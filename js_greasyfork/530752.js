// ==UserScript==
// @name         Скрипт by ensemble mansory
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Скрипт для Кураторов форума сервера KALUGA 79
// @author       константин ненормальный
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/CMCWTP07/photo-2025-03-19-21-43-57.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/530752/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20ensemble%20mansory.user.js
// @updateURL https://update.greasyfork.org/scripts/530752/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20by%20ensemble%20mansory.meta.js
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
      title: '| СВОЙ ОТВЕТ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>'
        },
{
        title: '| ⠀ᅠᅠ ᅠ ⠀ᅠᅠ ᅠ ᅠ ᅠ  ᅠᅠ ᅠᅠᅠ ᅠ Правила ROLEPLAY процесса ⠀ᅠᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠᅠᅠ  ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ |',

        dpstyle: 'oswald: 3px;     color: #ffff00; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #ff0000',
  },
{
	  title: '| NonRP Поведение |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
    "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Примечание: [/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman]ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT][/COLOR][/SIZE][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP охрана Казино |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
    "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.03.[/color] Охраннику казино запрещено выгонять игрока без причины [Color=#ff0000]| Увольнение с должности | Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от RP |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
    "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
                "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=times new roman]Примечание: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman]например, уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее.[/FONT][/SIZE][/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP drive |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
    "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP Обман |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan[/color].[/COLOR]<br><br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Долг |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR]<br><br>"+
		"[FONT=times new roman][SIZE=4][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
        "[FONT=times new roman][SIZE=4][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.57.[/color] Запрещается брать в долг игровые ценности и не возвращать их. [Color=#ff0000]| Ban 30 дней / permban[/color].[/COLOR]<br><br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/COLOR][/SIZE][/FONT]<br>" +
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/COLOR][/SIZE][/FONT]<br><br>"+
        "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/COLOR][/SIZE][/FONT]<br><br>"+
        "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| RP отыгровки в свою сторону |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Аморал |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
                "[SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив склада / слив семьи |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]исключение всех или части игроков из состава семьи без ведома лидера также считается сливом.[/COLOR][/SIZE][/FONT]<br>" +
       "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Затягивание RP |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]/me начал доставать документы [1/100], начал доставать документы [2/100] и тому подобное.[/COLOR][/FONT][/SIZE][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DB |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
                "[SIZE=4][FONT=times new roman][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/COLOR][/FONT][/SIZE][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| RK |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| TK |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| SK |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| PG |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| MG |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]телефонное общение также является IC чатом.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| DM |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Mass DM |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
    title: '| Читы |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]запрещено внесение любых изменений в оригинальные файлы игры.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]блокировка за включенный счетчик FPS не выдается.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Уход от наказания |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.34.[/color] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]зная, что в данный момент игроку может быть выдано наказание за какое-либо нарушение, изменение никнейма или передача своего имущества на другие аккаунты и тому подобное.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]выход игрока из игры не является уходом от наказания.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| OОC угрозы |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп наказаниями |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]неоднократное (от шести и более) нарушение правил сервера, которые были совершены за прошедшие 7 дней.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]наказания выданные за нарушения правил текстовых чатов, помеху (kick) в учет не идут.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]было получено пять наказаний за DM, шестое будет злоупотреблением. Если было получено одно наказание за упоминание родных, два наказания за DB и два наказания за DM, следующее будет считаться злоупотреблением.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск проекта |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа промо |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| ЕПП (фура/инк) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

            prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Арест на аукционе |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP аксессуар |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Мат в названии (Бизнеса) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#ff0000]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]названия семей, бизнесов, компаний и т.д.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск адм |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оформление жалобы в игре с текстом: Быстро починил меня, Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!, МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА и т.д. и т.п., а также при взаимодействии с другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000]Mute 180 минут[/color].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| багаюз аним |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=#ff0000]| Jail 120 минут[/color]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Продажа/покупка ив |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.28.[/color]Запрещена покупка, продажа внутриигровой валюты за реальные деньги в любом виде [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]покупка игровой валюты или ценностей через официальный сайт разрешена. [/COLOR][/SIZE][/FONT]<br><br>"+
 "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url][/CENTER]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| П/П/В |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.03.[/color] Запрещена совершенно любая передача игровых аккаунтов третьим лицам [Color=#ff0000]| PermBan[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обман администрации |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR]<br><br>"+
		"[FONT=times new roman][SIZE=4][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/COLOR][/SIZE][/FONT]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]по решению руководства сервера может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя.[/COLOR][Color=#ff0000] | PermBan<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обход системы |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]под игровой системой подразумеваются функции и возможности, которые реализованы в игре для взаимодействия между игроками, а также взаимодействия игроков с функциями, у которых есть свое конкретное предназначение.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]аптечка предназначена для пополнения уровня здоровья, доступна всем игрокам по фиксированной цене в любом магазине. Но она не предназначена для перепродажи по завышенной цене с целью передачи виртуальной валюты между игроками. Аксессуары предназначены для украшения внешнего вида персонажа, не предназначены для передачи виртуальной валюты между игроками. Банк и личные счета предназначены для передачи денежных средств между игроками. Транспортное средство предназначено для передвижения игроков, не предназначено для передачи денег тем или иным способом, включая обмен с завышенными доплатами.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Тим Мертв. рука |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]2.56.[/color] Запрещается объединение в команду между убийцей и выжившим на мини-игре «Мертвая рука» [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]правило действует только на время Хэллоуинского ивента.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'ᅠ| ⠀ᅠᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠᅠ ᅠ ᅠ  ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ Правила чата ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠ ⠀ᅠᅠ ᅠ ᅠ  ᅠᅠᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ | '
},
{
	  title: '| Мат в вип |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Caps |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оскорбление |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/Упом родни |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR]<br><br>"+
		"[FONT=times new roman][SIZE=4][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]термины «MQ», «rnq» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT]<br><br>"+
                "[FONT=times new roman][CENTER][SIZE=4][COLOR=lime]Одобрено.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
        tile: '| Мат в Vip Chat |',
    contenrt:
    	'[CENTER]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
        "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
        "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
    status: false,
},
{
	  title: '| Flood |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

            prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Злоуп символами |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск секс. характера |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив гл. чата (СМИ) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Угроза о наказании(адм) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Выдача себя за администратора |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ввод в заблужд командами |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]/me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Музыка в Voice |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Оск/упом род в Voice |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Шумы в Voice |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]Посторонние звуки на фоне речи, мешающие взаимодействию игроков посредством голосового чата. Сильное искажение звука, исходящее из микрофона плохого качества. Намеренно портить игру другим игрокам (кричать, перебивать).[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама в Voice |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]реклама Discord серверов, групп, сообществ, ютуб каналов и т.д.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Полит/религ пропоганда |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Изменение голоса софтом |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Транслит |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]«Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Реклама промо |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обьявления в госс |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: ' | ᅠᅠ ᅠᅠᅠᅠᅠ  ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠНа рассмотрениеᅠᅠ ᅠ ᅠ ᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ ᅠ| '
},
{
	  title: '| На рассмотрение |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба взята в процесс  [COLOR=YELLOW]рассмотрения[/COLOR] администрации сервера, пожалуйста ожидайте ответа. Создавать копии данной темы - не требуется.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ответ будет дан в этой теме, как только будет возможно. Благодарим вас за терпение и ожидание. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: PINN_PREFIX,
	  status: false,
},
{
    	  title: '| Таймкоды |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]В течении 24-ех часов укажите таймкоды нарушений и ключевых моментов, иначе жалоба будет отказана. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]Тема открыта. <br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: PINN_PREFIX,
	  status: true,
},
{
	  title: '| Тех. спецу |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=ORANGE]Техническому специалисту[/COLOR], пожалуйста ожидайте ответа. <br><br>"+
                "[FONT=times new roman][SIZE=4]Иногда рассмотрение подобных жалоб может занять больше двух дней, убедительная просьба не создавать копии данной темы.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: TEXY_PREFIX,
	  status: false,
},
{
    	  title: '| Заместителю ГА |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Заместителю Главного Администратора[/COLOR], пожалуйста ожидайте ответа. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
	  prefix: GA_PREFIX,
	  status: false,
},
{
	  title: '| Главному администратору |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба передана на [COLOR=#ffff00]рассмотрение[/COLOR] [COLOR=#ff0000]Главному администратору,[/COLOR] иногда рассмотрение подобных жалоб может занять более двух дней, убедительная просьба ожидать ответа. Благодарим за терпение и ожидание <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
	  prefix: GA_PREFIX,
	  status: false,
},
{
	  title: '| ᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠNickNameᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠ ᅠ|'
},
{
	  title: '| NonRP Nik |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Oск Nick |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Fake |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы рассмотрели ваши доказательства, игрок будет наказан по следующему пункту правил:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=lime]Одобрено.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ В другой раздел ⠀ᅠᅠ ᅠ ᅠ  ᅠ ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠᅠᅠ ᅠ |'
},
{
	  title: '| В жб на адм |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE], так как вы ошиблись разделом. Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3517/']Жалобы на администрацию *клик*[/URL]. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на лд |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE], так как вы ошиблись разделом. Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1401/']Жалобы на лидеров *клик*[/URL]. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В обжалования |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE], так как вы ошиблись разделом. Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1403/']Обжалования наказаний *клик*[/URL]. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В тех раздел |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE], так как вы ошиблись разделом. Обратитесь в [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-anapa.1416/']Технический раздел *клик*[/URL]. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| В жб на теха |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE], так как вы ошиблись разделом. Обратитесь в раздел [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов *клик*[/URL]. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ ЗАКРЫТИЕ ЖАЛОБЫ ⠀ᅠᅠ ᅠ  ⠀ᅠᅠ ᅠ  ᅠ   ᅠ   ᅠ   ᅠ    ᅠᅠᅠ ᅠ |'
},
{
	  title: '| Дубликат |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Данная тема является дубликатом другой темы, вам уже был дан ответ. Напомним, что если вы продолжите создавать дубликаты данной темы, то на ваш Форумный аккаунт могут быть наложены санкции в виде блокировки. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| 2+ игрока  |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Запрещено создавать одну жалобу на 2-ух и более игроков, на каждого игрока отдельная жалоба. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Качество |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Предоставленные доказательства в плохом качестве. Рекомендуем сменить фото/видеохостинг. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| займ |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Займ может быть осуществлен только через зачисление игровых ценностей на банковский счет. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| в жб на сотруд |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Вы обратились не в тот раздел. Обратитесь в раздел Жалоб на сотрудников данной организации. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=Lime]Решено,[/COLOR][COLOR=Red] закрыто. [/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: RESHENO_PREFIX,
	  status: false,
},
{
	  title: '| Другой серв |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Нами было установлено, что вы ошиблись сервером. Ваша тема была составлена на сервер [COLOR=BLUE]Kaluga (79). <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Перемещаю тему на нужный сервер. Ожидайте ответа от администрации вашего сервера.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: OJIDANIE_PREFIX,
	  status: false,
},
{
	  title: '| Был наказан |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Данный игрок уже был наказан администрацией сервера. Мы благодарны вам за содействие и бдительность. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=Lime]Рассмотрено.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: RASSMOTRENO_PREFIX,
	  status: false,
},
{
	  title: '| В логах нет |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Рассмотрев ваши доказательства было принято решение, что выдать наказание игроку не представляется возможным. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| 3.5 правил подачи |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Игровой ник автора жалобы, ник игрока, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| не логич обман |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Обман не является логичным, и не поддается какому либо пункту общих правил серверов. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| обман адм в жалобе |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
        "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваши доказательства были подделаны, все причастные аккаунты будут заблокированы по пункту правил: <br>"+
        "[FONT=times new roman][SIZE=4][CENTER]<br>"+
        "[FONT=times new roman][SIZE=4][CENTER][COLOR=red]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [COLOR=red] | Ban 7 - 15 дней.[/COLOR] <br>"+
        "[FONT=times new roman][SIZE=4][CENTER]<br>"+
        "[FONT=times new roman][CENTER][SIZE=4][FONT=times new roman][COLOR=red]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/COLOR]<br>"+
        "[CENTER][FONT=times new roman][COLOR=red]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] [U]по решению руководства сервера[/U] может быть выдана перманентная блокировка как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя.[/COLOR] [COLOR=red]| PermBan[/COLOR]<br>"+
        "[FONT=times new roman][SIZE=4][CENTER]<br>"+
        "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| неадекватность в жб |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Жалобы, в которых присутствует ненормативная лексика, неуважение к администрации или к игрокам рассмотрению не подлежат. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Уже на рассмотрении |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Подобная жалоба уже находится на рассмотрении администрации сервера, пожалуйста, воздержитесь от создания дубликатов, запаситесь терпением и ожидайте ответа. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| Нет условий склада |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]В описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи. Вами не было предоставлено условий взаимодействия складом.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
    title: '| Нет обратной связи |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Вами не было дано обратной связи. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=RED]Закрыто.[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: '| ⠀ᅠᅠ ᅠ ᅠ  ᅠᅠ    ᅠ ᅠᅠᅠ  ᅠ ᅠᅠᅠ ᅠ Правила ГОСС ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠ ᅠᅠ ⠀ᅠᅠ ᅠ   ᅠ ᅠᅠᅠ ᅠ ᅠ ᅠᅠᅠᅠ ᅠ |',
},
{
	  title: '| Работа в форме |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Казино в форме |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Т/С в личных целях |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для государственных организаций:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| fix me |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR]<br><br>"+
		"[FONT=times new roman][SIZE=4][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Министерства Обороны:<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=WHITE][FONT=times new roman][Color=#ff0000]6.03[/color] Запрещено nRP поведение[Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику УМВД, ГИБДД или ФСБ.[/COLOR][/SIZE][/FONT]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины[/COLOR][/SIZE][/FONT]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]- расстрел машин без причины[/COLOR][/SIZE][/FONT]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины[/COLOR][/SIZE][/FONT]<br><br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне и тому подобные ситуации.[/COLOR][/SIZE][/FONT]<br><br>"+
                "[FONT=times new roman][SIZE=4]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Н/ПРО |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP эфир |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Редактирование в лич. целях |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для СМИ:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| УМВД ДМит |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]6.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории УМВД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ГИБДД ДМит |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]7.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСБ ДМит |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]8.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ФСИН ДМит |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСИН:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]9.01.[/color] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН [Color=#ff0000]| DM / Jail 60 минут / Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]предупреждение (Warn) выдается только в случае Mass DM.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (УМВД) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для УМВД:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]6.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск/штраф без причины (ГИБДД) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]7.02.[/color] Запрещено выдавать розыск, штраф без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Розыск без причины (ФСБ) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]8.02.[/color] Запрещено выдавать розыск без Role Play причины [Color=#ff0000]| Warn[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение УМВД |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Государственных организаций:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику УМВД.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение ГИБДД |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для Государственных организаций:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]7.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ГИБДД.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| nRP поведение ФСБ |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ФСБ:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]8.03.[/color] Запрещено nRP поведение [Color=#ff0000]| Warn[/color].[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]поведение, не соответствующее сотруднику ФСБ.[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- открытие огня по игрокам без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- расстрел машин без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- нарушение ПДД без причины,[/COLOR][/SIZE][/FONT]<br>" +
                "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)]- сотрудник на служебном транспорте кричит о наборе в свою семью на спавне.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Права в погоне (ГИБДД) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для ГИБДД:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]7.04.[/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Одиночный патруль |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Обыск без отыгровки |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]8.05.[/color] Запрещено проводить обыск игрока без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NRP Cop |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан по следующему пункту правил для силовых структур:<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE][FONT=times new roman][Color=#ff0000]6.03.[/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn[/color].[/COLOR][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ Правила ОПГ ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ |'
},
{
	  title: '| Нарушение правил ОПГ |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение общих правил криминальных организаций.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP В/Ч (не ОПГ) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

       prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| NonRP огр/похищ |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша жалоба [COLOR=#00FF00]одобрена[/COLOR], игрок будет наказан за нарушение правил ограблений и похищений.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][/COLOR][COLOR=rgb(209, 213, 216)] Jail (от 10 до 60 минут) / Warn / Ban[/COLOR]<br>"+
"[FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание: [/COLOR][COLOR=rgb(209, 213, 216)]само наказание и его длительность выдаются на усмотрение администратора, размер выдаваемого наказания зависит от степени нарушения со стороны игрока. Строгий или устный выговор лидеру фракции может выдать только главный следящий за бандами или непосредственно его заместитель.[/COLOR][/SIZE][/FONT][/CENTER]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",

        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ Отказ жалобы ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ  ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ |'
},
{
	  title: '| Нарушений не найдено |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Мы тщательно проверили ваши доказательства, нарушений со стороны данного игрока выявлено не было. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слот |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Семейный слот - не является элементом рыночных отношений. Системно его передача, покупка и продажа напрямую между игроками не предусмотрена. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Недостаточно док-в |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваши доказательства были рассмотрены, было принято решение, что предоставленных доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Отсутствуют док-ва |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Вами не было предоставлено никаких доказательств. Пожалуйста, для более оперативного рассмотрения вашего обращения создайте новую тему и прикрепите доказательства. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва отредактированы |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Доказательства на нарушение от игрока были подвергнуты редактированию. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Слив семьи |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Не по форме |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваша жалоба составлена не по форме. Пожалуйста, для более оперативного и корректного рассмотрения вашего обращения создайте новую тему придерживаясь данной форме: <br><br>"+
        "[FONT=times new roman][SIZE=4][QUOTE]1.Ваш Nick_Name: <br>"+
        "[FONT=times new roman][SIZE=4]2. Nick_Name игрока: <br>"+
        "[FONT=times new roman][SIZE=4]3. Суть жалобы: <br>"+
        "[FONT=times new roman][SIZE=4]4. Доказательства:[/QUOTE] <br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с «Правилами подачи жалоб на игроков» — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL].<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Заголовок не по форме |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE], так как заголовок вашей жалобы составлен не по форме. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с «Правилами подачи жалоб на игроков» — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL].<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет /time |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]На ваших доказательствах отсутствует /time.  <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нет time кодов |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]На видеодоказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с «Правилами подачи жалоб на игроков» — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL].<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Более 72-х часов |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с «Правилами подачи жалоб на игроков» — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL].<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва соц сеть |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Доказательства загружены в соц. сетях. Загрузка доказательств в соц. сети (ВКонтакте, instagram, tiktok и тому подобные) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Условия сделки |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]В Ваших доказательствах отсутствуют, либо неккоректно обговорены условия сделки. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Нужен фрапс |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] В данной ситуации обязательно необходима запись экрана. Предоставленных доказательств недостаточно. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: '| Промотка чата |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Нужен фрапс + промотка чата. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с «Правилами подачи жалоб на игроков» — [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']*Кликабельно*[/URL].<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Фрапс обрывается |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Видео-доказательство обрывается. Возможно это связано с тем, что хостинг «imgur» не обрабатывает видео, которые занимают более одной минуты (0:59).  <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Док-ва не открываются |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваши доказательства не открываются, советуем сменить фото/видео хостинг. <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Жалоба от 3-го лицо |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваша жалоба написана от 3-го лица (жалоба должна быть подана участником ситуации). <br><br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: '| Ошиблись сервером |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠ ᅠ  ⠀ᅠᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ RolePlay Биографии ⠀ᅠᅠ ᅠ ᅠ  ᅠ ᅠᅠᅠ ᅠ  ⠀ᅠᅠ ᅠ ᅠᅠ ᅠᅠᅠ ᅠ |'
},
{
        	  title: '| Био одобрена |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша RolePlay биография получает статус - [COLOR=#00FF00]Одобрено[/COLOR]<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER]Желаем приятной игры на сервере [COLOR=BLUE]Kaluga (79)[/COLOR]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
    prefix: ACCСEPT_PREFIX,
	  status: false,
},
  {
    	  title: '| Био на рассмотрение |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша RolePlay биография находится [COLOR=ORANGE]на рассмотрении[/COLOR] администрации сервера.<br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ожидать ответа, и не создавать копии данной темы.<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: PINN_PREFIX,
	  status: false,
},
  {
          	  title: '| Био отказ (Мало инфы) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] Ваша Биография получает статус - [COLOR=#FF0000]Отказано[/COLOR], Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Скопирована) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваша RolePlay Биография скопирована/украдена. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Заголовок) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Заголовок вашей биографии составлен не по форме. Напомним, что заголовок создаваемой темы должен быть написан строго по данной форме:  « RolePlay биография гражданина Имя Фамилия. »  <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (1-ое лицо) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Ваша RolePlay Биография написана от 1-го лица. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст не совпал) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Возраст не совпадает с датой рождения. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Возраст) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Возраст персонажа слишком мал. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (форма) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR]<br><br>"+
		"[FONT=times new roman][SIZE=4][COLOR=WHITE] Ваша RolePlay Биография составлена не по форме. <br><br>"+
        "[FONT=times new roman][SIZE=4]Пожалуйста, для более оперативного рассмотрения вашей биографии создайте новую тему, заполнив данную форму:<br>"+
        "[FONT=times new roman][SIZE=4][QUOTE]Имя Фамилия:<br>"+
        "[FONT=times new roman][SIZE=4]Пол:<br>"+
        "[FONT=times new roman][SIZE=4]Национальность:<br>"+
        "[FONT=times new roman][SIZE=4]Возраст:<br>"+
        "[FONT=times new roman][SIZE=4]Дата и место рождения:<br>"+
        "[FONT=times new roman][SIZE=4]Семья:<br>"+
        "[FONT=times new roman][SIZE=4]Место текущего проживания:<br>"+
        "[FONT=times new roman][SIZE=4]Описание внешности:<br>"+
        "[FONT=times new roman][SIZE=4]Особенности характера:<br>"+
        "[FONT=times new roman][SIZE=4]Детство:<br>"+
        "[FONT=times new roman][SIZE=4]Юность и взрослая жизнь:<br>"+
        "[FONT=times new roman][SIZE=4]Настоящее время:<br>"+
        "[FONT=times new roman][SIZE=4]Хобби:[/QUOTE]<br>"+
        "[FONT=times new roman][SIZE=4][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
         "[FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR][SIZE=4] <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url][/CENTER]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
  {
                	  title: '| Био отказ (Ошибки) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]В вашей биографии присутствует много грамматических ошибок. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
        "[FONT=times new roman][SIZE=4][QUOTE][/QUOTE][CENTER]<br>"+
                "[FONT=times new roman][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы. Для обнаружения грамматической ошибки не нужен контекст, и в этом ее отличие от ошибки речевой, которая выявляется в контексте.[CENTER]<br>"+
		"[FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR][SIZE=4] <br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 {
                	  title: '| Био отказ (ник) |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]У вашего nRP Nick_Name <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
                "[FONT=times new roman][SIZE=4][COLOR=#FF0000]Отказано.[/COLOR][CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
 },
 {
                	  title: '| Био отказ пунктуац ошибки |',
	  content:

		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>' +
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=AQUA]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER]<br><br>"+
		"[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE] В вашей биографии присутствует большое количество пунктуационных ошибок. <br><br>"+
                "[FONT=times new roman][SIZE=4][CENTER][COLOR=WHITE]Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/kaluga-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%B8-%D1%84%D0%BE%D1%80%D0%BC%D0%B0-role-play-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.9805301/']«правилами подачи RolePlay биографий» — *Кликабельно*[/URL]<br>"+
        "[FONT=times new roman][SIZE=4][QUOTE][/QUOTE][CENTER]<br>"+
        "[FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR][SIZE=4] <br>"+
 "[FONT=times new roman][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[CENTER]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/0Qmc3DdF/image.png[/img][/url]<br>",
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 
 
];
 
 
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно', 'Vajno');
    addButton('Команде Проекта', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ', 'selectAnswer' );
 
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
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">Ответ</button>`,
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