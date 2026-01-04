// ==UserScript==
// @name        Скрипт для КФ|<3 by M.Bennet
// @namespace    http://tampermonkey.net/
// @version      2.10
// @description  Скрипт для КФ|<3
// @author       Mika_Bennet
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/yxnTbvdQ/zastavki-gas-kvas-com-2ynk-p-zastavki-blek-rasha-9.jpg
// @grant        none
// @license    MIT
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/529309/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%7C%3C3%20by%20MBennet.user.js
// @updateURL https://update.greasyfork.org/scripts/529309/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%7C%3C3%20by%20MBennet.meta.js
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
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
	       "[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Текст <br><br>"+
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
},
{
	  title: '| На рассмотрении |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=LightGray]на рассмотрении[/COLOR],<br><br>"+
                "[*][SIZE=4][COLOR=LightGray][FONT=Book Antiqua]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
{
	  title: '| Передать ГА|',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=LightGray]передана на рассмотрение Главному Администратору[/COLOR],<br><br>"+
                "[*][SIZE=4][COLOR=LightGray][FONT=Book Antiqua]Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: NARASSMOTRENIIRP_PREFIX,
	  status: false,
},
{
	                          title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RolePlay процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| NonRP Поведение |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.01.[/COLOR] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [COLOR=#FF0000]|Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Drive |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.03.[/COLOR] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [COLOR=#FF0000]| Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=LightGray][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха РП |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=#FF0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=LightGray][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]таран дальнобойщиков, инкассаторов под разными предлогами.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP обман |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.05.[/COLOR] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=#FF0000]| PermBan[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал действия |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.08.[/COLOR] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=#FF0000]| Jail 30 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]ИСключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]обоюдное согласие обеих сторон.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада фракции/семьи |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.09.[/COLOR]  Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [COLOR=#FF0000]| Ban 15 - 30 дней / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман в /do |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.10[/COLOR] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже [COLOR=#FF0000]| | Jail 30 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрак транс в ЛЦ |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.11.[/COLOR] Запрещено использование рабочего или фракционного транспорта в личных целях [COLOR=#FF0000]| Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Помеха работе блогеров |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.12.[/COLOR] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом [COLOR=#FF0000]| Ban 7 дней[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [COLOR=#FF0000]| Jail 60 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.15.[/COLOR] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [COLOR=#FF0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.16.[/COLOR] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [COLOR=#FF0000]| Jail 60 минут / Warn (за два и более убийства)[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.18.[/COLOR] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]телефонное общение также является IC чатом.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.19.[/COLOR] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [COLOR=#FF0000]| Jail 60 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.20.[/COLOR] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [COLOR=#FF0000]| Warn / Ban 3 - 7 дней[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы/Багоюз |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.21.[/COLOR] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [COLOR=#FF0000]| Ban 15 - 30 дней /PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Стороннее ПО |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.22.[/COLOR] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [COLOR=#FF0000]|  Ban 15 - 30 дней / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Сокрытие ошибок системы |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.23.[/COLOR] Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам  [COLOR=#FF0000]|  Ban 15 - 30 дней / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Сокрытие нарушителей |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.24.[/COLOR] Запрещено скрывать от администрации нарушителей или злоумышленников[COLOR=#FF0000]| Ban 15 - 30 дней / PermBan + ЧС Проекта[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]запрещено внесение любых изменений в оригинальные файлы игры.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ППИВ |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.28.[/COLOR] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [COLOR=#FF0000]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]любые попытки покупки/продажи, попытки поинтересоваться о ней у другого игрока и прочее - наказуемы.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]также запрещен обмен доната на игровые ценности и наоборот;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]пополнение донат счет любого игрока взамен на игровые ценности;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]официальная покупка через сайт.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ущерб ЭКО |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.30.[/COLOR] Запрещено пытаться нанести ущерб экономике сервера [COLOR=#FF0000]|  Ban 15 - 30 дней / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]имея достаточное количество денег и имущества игрок начинает раздавать денежные средства и имущество другим игрокам.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.31.[/COLOR] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [COLOR=#FF0000]| Ban 7 дней / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман Адм |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=#FF0000]| Ban 7 - 15 дней[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт с которого совершен обман, так и на все аккаунты нарушителя. [COLOR=#FF0000]| PermBan[/COLOR][/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Конфликт религия |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.35.[/COLOR] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [COLOR=#FF0000]| Mute 120 минут / Ban 7 дней[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| OOC угрозы/о наказании от АДМ |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.37.[/COLOR] Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации [COLOR=#FF0000]|  Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/COLOR]<br><br>" +
                 "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua] блокировка аккаунта выдаётся в случае, если есть прямые угрозы жизни, здоровью игрока или его близким. По решению главного администратора может быть выдана перманентная блокировка. [COLOR=#FF0000]| PermBan[/COLOR][/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Maroon][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.40.[/COLOR] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [COLOR=#FF0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ЕПП Инко |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.47.[/COLOR] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [COLOR=#FF0000]| Jail 60 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест в интерьере |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.50.[/COLOR] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий [COLOR=#FF0000]| Ban 7 - 15 дней + увольнение из организации[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRp акс |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.51.[/COLOR] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=#FF0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск Адм |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [COLOR=#FF0000]| Mute 180 минут[/COLOR].[/COLOR]<br><br>" +
                 "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Багоюз аним |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.55.[/COLOR] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=#FF0000]| Jail 60 / 120 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [COLOR=#FF0000]Jail на 120 минут[/COLOR]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [COLOR=#FF0000]Jail на 60 минут[/COLOR].[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Долг |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.57.[/COLOR] Запрещается брать в долг игровые ценности и не возвращать их. [COLOR=#FF0000]| Ban 30 дней / permban[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/FONT][/COLOR][/SIZE][/CENTER]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	                  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила игровых чатов╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| CapsLock |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.02.[/COLOR] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.03.[/COLOR] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Упом/оск родни |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [COLOR=#FF0000]| Mute 120 минут / Ban 7 - 15 дней[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]термины MQ, rnq расценивается, как упоминание родных.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Flood |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.05.[/COLOR] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп симв |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.06.[/COLOR] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
               "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив глоб чата |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.08.[/COLOR] Запрещены любые формы «слива» посредством использования глобальных чатов [COLOR=#FF0000]| PermBan[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача за Адм |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.10.[/COLOR] Запрещена выдача себя за администратора, если таковым не являетесь [COLOR=#FF0000]| Ban 7 - 15[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Ввод в забл |',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.11.[/COLOR] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [COLOR=#FF0000]| Ban 15 - 30 дней / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в воис |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.14.[/COLOR] Запрещено включать музыку в Voice Chat [COLOR=#FF0000]| Mute 60 минут[/COLOR].[/COLOR]<br><br>" +
               "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Масс флуд, политика |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.18.[/COLOR] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [COLOR=#FF0000]| Mute 120 минут / Ban 10 дней[/COLOR].[/COLOR]<br><br>" +
               "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.20.[/COLOR] Запрещено использование транслита в любом из чатов [COLOR=#FF0000]|  Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]«Privet», «Kak dela», «Narmalna».[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промо |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.21.[/COLOR] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=#FF0000]| Ban 30 дней[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]разрешено изменение шрифта, его размера и длины чата (кол-во строк), блокировка за включенный счетчик FPS не выдается.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама ГОСС |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.22.[/COLOR] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в VIP чат |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]3.23.[/COLOR] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Положение об игровых аккаунтах╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| Оск ник |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]4.09.[/COLOR] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [COLOR=#FF0000]| Устное замечание + смена игрового никнейма / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фейк ник |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]4.10.[/COLOR] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [COLOR=#FF0000]| Устное замечание + смена игрового никнейма / PermBan[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ППВ |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]4.03.[/COLOR] Передача своего личного игрового аккаунта третьим лицам [COLOR=#FF0000]| PermBan[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГОСС организаций╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| Работа в форме |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]1.07.[/COLOR] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [COLOR=#FF0000]|Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]1.11.[/COLOR] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [COLOR=#FF0000]| Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГОСС Конты, Казино, Авторынок |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]1.13.[/COLOR] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции. [COLOR=#FF0000]| Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Армия DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.02.[/COLOR] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [COLOR=#FF0000]| Jail 60 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| СМИ НПРО |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]4.01.[/COLOR] Запрещено редактирование объявлений, не соответствующих ПРО [COLOR=#FF0000]| Mute 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| СМИ Замена объяв |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]4.04.[/COLOR] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [COLOR=#FF0000]| Ban 7 дней + ЧС организации[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| УМВД DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории УМВД. [COLOR=#FF0000]| Jail 60 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| УМВД Розыск без причины |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины. [COLOR=#FF0000]| Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| УМВД NonRP поведение |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.03.[/COLOR] Запрещено nRP поведение. [COLOR=#FF0000]| Warn[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]задержание, выдача розыска, обыск без RP отыгровки.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГИБДД DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД. [COLOR=#FF0000]| Jail 60 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГИБДД Розыск без причины |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины. [COLOR=#FF0000]| Warn[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]задержание, выдача розыска, обыск, изъятие прав без RP отыгровки.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГИБДД Права в погоне |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]7.04.[/COLOR] Запрещено отбирать водительские права во время погони за нарушителем. [COLOR=#FF0000]| Warn[/COLOR].[/COLOR]<br><br>" +
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСБ DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ. [COLOR=#FF0000]| Jail 60 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| ФСБ Розыск без причины |',
	  content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.02.[/COLOR] Запрещено выдавать розыск без Role Play причины. [COLOR=#FF0000]| Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСБ NonRP поведение |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.03.[/COLOR] Запрещено nRP поведение. [COLOR=#FF0000]| Warn[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Пример: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]задержание, выдача розыска без RP отыгровки.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСИН DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]6.01.[/COLOR] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ. [COLOR=#FF0000]| Jail 60 минут / Warn[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| NonRp вч |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]2.00.[/COLOR] Запрещается нарушение правил нападения на Войсковую Часть. [COLOR=#FF0000]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Дуэль ОПГ |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]5.00.[/COLOR] Запрещено устраивать дуэли где-либо, а также на территории ОПГ [COLOR=#FF0000]| Jail 30 минут[/COLOR].[/COLOR]<br><br>" +
                "[*][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=Book Antiqua]Исключение: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=Book Antiqua]территория проведения войны за бизнес, когда мероприятие не проходит.[/FONT][/COLOR][/SIZE][/CENTER][/B]<br>"+
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ОПГ DM |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#D1D5D8]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua][COLOR=#FF0000]4.00.[/COLOR] Запрещено без причины наносить урон игрокам на территории ОПГ. [COLOR=#FF0000]| Jail 60 минут[/COLOR].[/COLOR]<br><br>" +
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>"+
                "[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
		 prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴В другой раздел╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|',
},
{
	  title: '| В жб на адм |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Тех спецу |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба была передана [COLOR=LightGray]на рассмотрение[/COLOR] [COLOR=orange]Техническому Специалисту[/COLOR]<br><br>"+
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: TEXY_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В ЖБ Орг |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел Жалобы на сотрудников организации. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказ жалобы╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ДОЛГ НЕ БАНК |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>'+
	    	"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=Red]отказана[/COLOR], так как все долговые перечисление должны перечисляться через банковскую систему<br><br>",
		 prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
       prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка на фоне |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в видео-доказательстве присутствует музыка. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лица |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '|╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay Биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴|'
},
{
        	  title: '| Био одобрена |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#D1D5D8]Одобрено[/COLOR]<br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило нарушение формы подачи RP биографии. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Био отказ (Уже одобрена) |',
	  content:
    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило то, что Ваша предыдущая Биография уже получила статус Одобрено.  <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже.<br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило - Биография скопирована <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило - Неправильное написание заголовка биографии. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило - Написание Биографии от 1-го лица.  <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило - Возраст не совпадает с датой рождения.<br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR] <br><br>"+
"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило - Возраст слишком мал.<br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Смысл несостык) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                 "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило присутствие смысловых несостыковок в вашей RP биографии. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Имя не анг) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray] [FONT=Book Antiqua]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило нарушение пункта правил - NickName должен быть указан на английском языка, как в заголовке, так и в самой теме.<br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (ООС инфа) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR][/B][/CENTER][/COLOR=LightGray]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило написание информации из реального мира (OOC).<br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Реалист) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужила нереалистичность Вашей биографии (OOC). <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Несовп возраст) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужила разница между возрастом указанным в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад мест рожд) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужила разница между местом рождения в Информации и в самой Биографии. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},

  {
                	  title: '| Био отказ (Несовпад образов) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray] [FONT=Book Antiqua]Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужила разница в образовании указанном в Информации и в Биографии. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
      "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/kgHfShkj/24bf9ea5632d759d4793dabbc51e89c6-1.gif[/img][/url]<br>"+
	    "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRBDvZT6/1621526767066.png[/img][/url]<br>" +
		"[B][CENTER][COLOR=Red][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=LightGray][FONT=Book Antiqua] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Причиной отказа послужило большое количество ошибок. <br>"+
                "[B][CENTER][COLOR=LightGray][FONT=Book Antiqua]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/2SS42F4P/1618083711121.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=LightGray]Приятной игры на [COLOR=Red]BLACK[/COLOR] [COLOR=Red]RUSSIA[/COLOR] [COLOR=DeepPink]<3[/COLOR]<br><br>",
     prefix: UNACCСEPT_PREFIX,
      status: false,
}
];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Отказано', 'unaccept');
	addButton('Одобрено', 'accepted');
	addButton('Меню Ответов', 'selectAnswer');

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
  countElement.style.fontFamily = 'Book Antiqua';
  countElement.style.fontSize = '14px';
  countElement.style.COLOR = 'Red';

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