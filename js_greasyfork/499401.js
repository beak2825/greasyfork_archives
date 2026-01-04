// ==UserScript==
// @name        Скрипт для БЛУДОВА
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Скрипт для ГКФ
// @author       блудов
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/499401/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%91%D0%9B%D0%A3%D0%94%D0%9E%D0%92%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/499401/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%91%D0%9B%D0%A3%D0%94%D0%9E%D0%92%D0%90.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const OJIDANIE_PREFIX = 14;
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
const REALIZOVANO_PREFIX = 5;
const VAJNO_PREFIX = 1;
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
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XqD3fKsz/ed18139868df1fc7.jpg[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>'
        },
{
	  title: '|(--(-(-> Правила RolePlay процесса <-)-)--)-|'
},
{
	  title: '| NonRP Обман |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
},
{
	  title: '|(-(-(-(-(->╴╴╴╴Chat Правила╴╴╴╴<-)-)-)-)-)-|'
},
{
	  title: '| Оск/Упом родни |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{

	  title: '|(-(-(->Передача на рассмотрение<-)-)-)-|'
},
{
	  title: '| На рассмотрение |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#0000ff]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
        prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: '| Главному администратору |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Главному администратору[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
	  prefix: GA_PREFIX,
	  status: true,
},
{
	  title: '|(-(-(-(->╴╴╴╴NikName╴╴╴╴<-)-)-)-)-|'

},
{

 title: '| Fake |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(--(->В другой раздел<-)--)-)-)-|'
},
{
	  title: '| В жб на адм |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(->Правила госс. структур<-)-)-)-)-|'
},
{
	  title: '| Работа в форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино в форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/С в личных целях |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,

},
{
	  title: '| Н/ПРО |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP эфир |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обыск без отыгровки |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]8.05.[/color] Запрещено проводить обыск игрока без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NRP Cop |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '|(-(-(-(-(->╴╴╴╴╴Правила ОПГ╴╴╴╴╴<-)-)-)-)-)-|'
},
{
	  title: '| Нарушение правил ОПГ |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение общих правил криминальных организаций.<br><br>"+
                "[B][CENTER][Spoiler][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/Spoiler][/CENTER][/B]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",

       prefix: ACCСEPT_PREFIX,
	  status: false,

},
{
	  title: '|(-(-(-(-(->╴Отказ жалобы╴<-)-)-)-)-)-|'
},
{
	  title: '| Нарушений не найдено |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нарушений со стороны данного игрока не было найдено. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Возврат средств |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного игрока  отредактированы. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваша жалоба составлена не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как заголовок вашей жалобы составлен не по форме. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как на ваших доказательствах отсутствует /time.  <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов|',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как отсутствует time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как с момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как в Ваших доказательствах отсутствуют условия сделки. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств недостаточно. В данной ситуации необходим фрапс(запись экрана). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как нужен фрапс + промотка чата. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как видео-доказательство обрывается. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '|(-(-(-(-(->╴RolePlay Биографии ╴<-)-)-)-)-)-|'
},
{
        	  title: '| Био одобрена |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био отказ (Форма) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило нарушение Правила написания RP биографии <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Биография скопирована <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Неправильное написание заголовка биографии. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Написание Биографии от 1-го лица. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Возраст не совпадает с датой рождения. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Возраст слишком мал. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило большое количество ошибок. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи Биографий, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=BLUE]С уважением [/COLOR][COLOR=BLUE]Заместитель главного следящего за направлением ап.[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},


];



 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно💥', 'Vajno');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу💥', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ💥', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));

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