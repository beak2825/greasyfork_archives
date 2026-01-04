// ==UserScript==
// @name         Для Кураторов Форума | VOLOGDA
// @namespace    https://forum.blackrussia.online
// @description По всем вопросам или предложениям в ВК @dmitrii_forbes
// @version      1.9.4
// @author       Wilson
// @match        https://forum.blackrussia.online/threads/*
// @include      
https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @collaborator Wilson
// @icon https://icons.iconarchive.com/icons/goescat/macaron/64/telegram-icon.png
// @downloadURL https://update.greasyfork.org/scripts/456390/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20VOLOGDA.user.js
// @updateURL https://update.greasyfork.org/scripts/456390/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20VOLOGDA.meta.js
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
const TEX_PREFIX = 13;
const buttons = [
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Правила RP ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
     {
                        	  title: '| Приветствие |',
	  content:
	    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3R73007G/VRJf8-Haa-So.jpg[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=Grey]{{ greeting }}, уважаемый {{ user.mention }} [/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=Grey] Текст <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br>' + '[COLOR=grey][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>'
        },
    {
      title: 'СК',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.16. [/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства).[/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.19. [/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил. [/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'ТК',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER][Color=#ff0000] 2.15. [/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства).[/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
   { title: 'Помеха ИП',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.04. [/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[Color=#ff0000]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении) [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    { title: 'Невозврат долга',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.57. [/color] Запрещается брать в долг игровые ценности и не возвращать их [Color=#ff0000]| Ban 30 дней / permban [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда [/FONT] [/SIZE]<br>' + 
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER][Color=#ff0000] 2.13. [/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000] Исключение: [/COLOR] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера. [/FONT] [/SIZE]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
 title: 'NonRP поведение',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.01. [/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'ЕПП',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.03. [/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] езда на скутере по горам, езда на любом транспортном средстве по встречным полосам, нарушая все правила дорожного движения без какой-либо причины, намеренное создание аварийных ситуаций на дорогах и так далее.[/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'ЕПП фура/инко',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.47. [/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Постороннее ПО/Изм. Файлов игры',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.22. [/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#ff0000]| Ban 15 - 30 дней / PermBan [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Исключение: [/COLOR] запрещено внесение любых изменений в оригинальные файлы игры.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Исключение: [/COLOR] разрешено изменение шрифта, его размера и длины чата (кол-во строк). [/FONT] [/SIZE]<br>' + 
'[FONT=times new roman][SIZE=4] [COLOR=#ff0000]Исключение: [/COLOR] блокировка за включенный счетчик FPS не выдается. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
    title: 'NRP обман',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.05. [/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000]| PermBan [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR]  разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'слив склада',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.09. [/color] Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером [Color=#ff0000]| Ban 15 - 30 дней / PermBan [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лидера семьи. [/FONT] [/SIZE]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] исключение всех или части игроков из состава семьи без ведома лидера также считается сливом. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
{
      title: 'Масс ДМ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
title: 'Багоюз аним',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.55. [/color]Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#ff0000]| Jail 60 / 120 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [COLOR=#ff0000] Jail на 120 минут [/COLOR]. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR]  если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [COLOR=#ff0000] Jail на 60 минут [/COLOR].[/Color] [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Уход от РП',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.02. [/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания или ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа. Уходить в интерьер или зеленую зону во время перестрелки с целью избежать смерти или уйти от Role Play процесса и так далее. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'подделка ника',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER][FONT=times new roman][SIZE=4] [Color=#ff0000] 4.10. [/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR] подменять букву i на L и так далее, по аналогии. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
       {
      title: 'аморальные действия',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.08. [/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] обоюдное согласие обеих сторон. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },

{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
      title: 'MG',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.18. [/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] телефонное общение также является IC чатом. [/FONT] [/SIZE]<br>' + 
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Исключение: [/COLOR] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.02. [/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Флуд',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER]  [Color=#ff0000] 3.05. [/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в нрп чат',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.03. [/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Оск в рп чат',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.07. [/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее. [/FONT] [/SIZE]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Угрозы в OOC',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.57. [/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Упом/оск родни',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.04. [/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] термины "MQ", "rnq" расценивается, как упоминание родных.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Исключение: [/COLOR]  если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Упом/оск родни в ГЧ',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.15. [/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]|  Mute 120 минут / Ban 7 - 15 дней [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Реклама промо',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.21. [/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#ff0000]| Ban 30 дней [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Исключение: [/COLOR] промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта. [/FONT] [/SIZE]<br>' + 
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR] если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа Промо',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.43. [/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Политика',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.18. [/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм/оск адм',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.54. [/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR] оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR]  оскорбление администрации в любой чат, включая репорт подлежит наказанию в виде блокировки доступа к использованию всех видов чатов - [Color=#ff0000] Mute 180 минут.[/Color] [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Обман адм/ввод в заблуждение',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.32. [/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Пример: [/COLOR] подделка доказательств, искажение информации в свою пользу, предоставление неполной информации о ситуации.[/FONT] [/SIZE]<br>' +
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] за подделку доказательств по решению руководства сервера может быть выдана перманентная блокировка, как на аккаунт, с которого совершен обман, так и на все аккаунты нарушителя. [Color=#ff0000]| PermBan [/Color] [/FONT] [/SIZE]<br>' + 
'[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] за предоставление услуг по прохождению обзвонов на различные должности, а также за услуги, облегчающие процесс обзвона, может быть выдан чёрный список проекта. [Color=#ff0000]| PermBan + ЧС проекта [/Color] [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.10. [/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧС администрации [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
 title: 'Оск. Проекта/призыв покинуть проект',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 2.40. [/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'ввод в заблуждение игроков',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.11. [/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan [/FONT] [/color] [/CENTER]<br>' + '[FONT=times new roman][SIZE=4]• [COLOR=#ff0000]Примечание: [/COLOR] /me чтобы поднять кошелек введите /pay 228 5000. Для продажи автомобиля введите /sellmycar id 2828 (счёт в банке) цена. [/FONT] [/SIZE]<br><br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'угроза баном',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 3.09. [/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Отсутствие пункта жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
title: 'Нету условий сделки',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В данных доказательствах отсутствуют условия сделки.[/CENTER]<br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/CENTER][/color]<br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Укажите таймкоды',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваше видео более 3х минут. [/SIZE][/FONT][/CENTER]<br><br>" +
        "[CENTER][FONT=times new roman][SIZE=4][COLOR=#ff0000]3.7 [/COLOR] Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений.[/SIZE][/FONT][/CENTER]<br>" +
		"[CENTER][FONT=times new roman][SIZE=4]Укажите тайм коды нарушений игрока и создайте новую жалобу. [/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Нужна видеофиксация',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В таких случаях нужна видеофиксация нарушения.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]<br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
	  title: 'Нарушений не найдено',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Нарушений со стороны данного игрока не было найдено.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
      title: 'Недостаточно доказательств',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Недостаточно доказательств на нарушение от данного игрока.[/CENTER][/SIZE][/FONT]" + "[CENTER][FONT=times new roman][SIZE=4] Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ранее вам уже был дан ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'В жалобы на адм',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Вы ошиблись разделом. Обратитесь в раздел жалоб на администрацию по ссылке: [url='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3623/']*Клик*[/url] [/SIZE][/FONT][/CENTER]<br><br>" +		
'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'В обжалование наказаний',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Вы ошиблись разделом. Обратитесь в раздел обжалований наказаний по ссылке: [url='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.3626/']*Клик*[/url] [/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы жалоб',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб:[url='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']*Клик*[/url] [/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]На ваших доказательствах отсутствует /time.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
title: 'Док-ва в соц. сетях',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/FONT][/CENTER]<br><br>" +'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
title: 'Доква отредактированы',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Доказательства должны быть в первоначальном виде.<br>Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нету доков',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В вашей жалобе отсутствуют доказательства.<br>Создайте новую жалобу и прикрепите доказательства.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Не работают доки',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В вашей жалобе не работают доказательства.<br>Создайте новую жалобу с рабочими доказательствами.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
   {
	  title: 'жалоба от 3 лица',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'более 3 суток',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'название темы',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
    {
      title: 'Жалоба на рассмотрении',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба взята на [color=orange] рассмотрение.[/color]<br>Просьба ожидать ответа и не создавать дубликаты данной темы. [/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=orange][FONT=times new roman][SIZE=4][CENTER] Ожидайте ответа.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: PIN_PREFIX,
	  status: true,
    },
{
	  title: 'жалоба с другого серва',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Вы ошиблись разделом сервера.<br>Создайте новую жалобу в нужный раздел вашего сервера.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 },
{
	  title: 'закрыт доступ к докам',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Доступ к вашим доказательствам закрыт.<br>Создайте новую жалобу с открытыми доказательствами.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	 }, 
{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Правила гос ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
    {
 title: 'Работа в форме ГОС',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 1.07. [/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
 title: 'Казино/БУ в форме ГОС',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 1.13. [/color] Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
 title: 'Одиночный патруль ГОС',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 1.11. [/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
title: 'NoNRP коп',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 6.03. [/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Редакт не по ПРО',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 4.01. [/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
{
      title: 'редактирование в лч',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        '[CENTER][FONT=times new roman]Игрок будет наказан по данному пункту правил:<br>' + '[CENTER] [Color=#ff0000] 4.04. [/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации [/FONT] [/color] [/CENTER]<br>' +
		'[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
     },
{
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Передача жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ ',
	},
     {
      title: 'Гл.Адм',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба передана [color=red] Главному администратору.[/color]<br>Просьба ожидать ответа и не создавать дубликаты данной темы. [/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=red][FONT=times new roman][SIZE=4][CENTER] Ожидайте ответа.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Тех. спецу',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша жалоба передана [color=#0000FF] Техническому специалисту.[/color]<br>Просьба ожидать ответа и не создавать дубликаты данной темы. [/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=red][FONT=times new roman][SIZE=4][CENTER] Ожидайте ответа.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: TEX_PREFIX,
	  status: true,
    },
    {
	  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ РП биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
	},
    {
      title: 'био одобрено',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша RP биография получает статус:[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=#00ff00][FONT=times new roman][SIZE=4][CENTER]Одобрено, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{ 
title: 'от 3 лица',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4] Ваша RP биография написана от у лица.<br>С формой подачи RP биографии ознакомиться [url='https://forum.blackrussia.online/threads/vologda-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.10434179/']*Тут*[/url][/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
title: 'Заголовок темы',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4] Заголовок вашей RP биографии составлен не по форме.<br>С формой подачи RP биографии ознакомиться [url='https://forum.blackrussia.online/threads/vologda-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.10434179/']*Тут*[/url][/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'био украдено',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша RP биография скопирована/украдена и получает статус:[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'дата с возрастом',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В вашей RP биографии дата рождения не совпадает с возрастом получает статус:[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мало информации',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В вашей RP биографии мало информации о персонаже[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=Red][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },

    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ РП ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
{ title: 'Одобрена',
content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша RP ситуация получает статус:[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=#00ff00][FONT=times new roman][SIZE=4][CENTER]Одобрено, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
  {
title: 'Отказано',
      content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]Ваша RP ситуация составлена не по форме и получает статус:/[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=#00ff00][FONT=times new roman][SIZE=4][CENTER]Отказано, закрыто.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'На доработке',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/G2n33f8H/Picsart-24-11-27-11-28-45-682.png[/img][/url]<br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dtjwvqrV/1805-2.png[/img][/url]<br>' +
	 '[CENTER][FONT=times new roman][SIZE=5]Доброго времени суток, {{ user.mention }}.[/SIZE]<br><br>' +
        "[CENTER][FONT=times new roman][SIZE=4]В вашей RP ситуации мало информации,даю вам 24 часа на её дополнение.[/SIZE][/FONT][/CENTER]<br><br>" +
		'[Color=#orange][FONT=times new roman][SIZE=4][CENTER] На рассмотрении.[/SIZE][/FONT][/CENTER][/color]' + '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4zLNHSZ/OXMgDyr.png[/img][/url]<br><br>' + '[FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][COLOR=rgb(227,38,54)][FONT=times new roman][SIZE=4]VOLODGA[/SIZE][/FONT][/COLOR][COLOR=rgb(227, 38, 54)].[FONT=times new roman][SIZE=4][/SIZE][/FONT][/COLOR]<br><br>',
      prefix: PIN_PREFIX,
	  status: false,
},
  ];
$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');


    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');



    // Поиск информации о теме
    const threadData = getThreadData();


    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));


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
      ? 'Доброе утро'
      : 18 < hours && hours <= 21
      ? 'Добрый день'
      : 21 < hours && hours <= 4
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

