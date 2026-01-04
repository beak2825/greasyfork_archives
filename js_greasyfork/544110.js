// ==UserScript==
// @name         Скрипт для КФ
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  Скрипт для КФ(написан администратором Maga_Zavodchikov)
// @author       AZARTY
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/544110/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/544110/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
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
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#F44336'
    },
	{
                                        	  title: '| Приветствие |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Текст <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
               },
    {
                                        	  title: '| На рассмотрении |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша RolePlay биография взята на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=RED]Ожидайте ответа в данной теме.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                    prefix: PINN_PREFIX,
      status: true,
    },
    {
                                	  title: '| рп био одобрено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша RP биография получает статус:[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| мало инфы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RP биографии мало информации о персонаже.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
    {
                                	  title: '| заголовок не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Заголовок вашей RP биографии составлен не по форме.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
    {
                                        	  title: '| возраст |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RP биографии дата рождения не совпадает с возрастом получает статус:<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
               },
    {
                                        	  title: '| рп био от 3 лица |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша RP биография написана от 3 лица.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
                                        	  title: '| рп био украдена |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша RP биография скопирована/украдена и получает статус:<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
                                        	  title: '| орфографические ошибки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RolePlay-биографии много орфографических ошибок, поэтому она получает статус:<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
               },
    {
                                	  title: '| Биографию существующих людей |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RP-биографии используются имена реальных людей.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
    {
                                	  title: '| факторы, позволяющие нарушать правила сервера |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RP-биографии используются факторы, позволяющие нарушать правила сервера.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
    {
                                	  title: '| логические противоречия |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RP-биографии используются логические противоречия.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
    {
                                	  title: '| На доработку |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей RP-биографии недостаточно информации. Вам дается 24 часа на её доработку."+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: PINN_PREFIX,
	  status: true,
                           },

        {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#FF9800'
    },
    {
                                        	  title: '| На расмотрении |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED]Ваша RolePlay ситуация взята на [/COLOR][COLOR=Yellow]рассмотрение.[/COLOR]<br>[COLOR=RED]Ожидайте ответа в данной теме.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: PINN_PREFIX,
      status: true,
    },
    {
                                	  title: '| рп ситуация одобрена |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша RolePlay ситуация получает статус:[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| заголовок рп ситуации не по форме |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Заголовок вашей RolePlay ситуации составлен не по форме.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
    {
                                	  title: '| рп ситуация отказана |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша RolePlay ситуация получает статус:Отказано.<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций. </br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                           },
        {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RP ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#FFEB3B'
    },
    {
                                	  title: '| CK |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства).</br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| DM |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по данному пункту правил:</br><br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| ТК |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства).</br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Помеха ИП |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)" +
        "[B][CENTER][COLOR=#00BC00] Одобрено, закрыто.[/COLOR]" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Невозврат долга |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.57. Запрещается брать в долг игровые ценности и не возвращать их | Ban 30 дней / permban </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| DB |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| NonRP поведение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| NonRP Drive |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| NonRP Drive(фура/инко) |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Постороннее ПО/Изм. Файлов игры |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| NRP обман |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Слив склада |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Масс ДМ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Багоюз аним |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Уход от РП |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Подделка ника |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Аморальные действия |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
        {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#4CAF50'
    },
    {
                                	  title: '| MG |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Caps |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Flood |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Osk |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| OOC угрозы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 2.57. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Упом/оск родни |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Упом/оск родни в ГЧ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней</br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| реклама промо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Продажа Промо |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Политика |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Неув обр. к адм/оск адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут " +
        "[B][CENTER][COLOR=#00BC00] Одобрено, закрыто.[/COLOR]]"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Обман адм/ввод в заблуждение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней " +
        "[B][CENTER][COLOR=#00BC00] Одобрено, закрыто.[/COLOR]]"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Выдача себя за адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Оск. Проекта/призыв покинуть проект |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| ввод в заблуждение игроков |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| угроза баном |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
        {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пункта жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#2196F3'
    },
    {
                                	  title: '| Нету условий сделки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В данных доказательствах отсутствуют условия сделки.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Укажите таймкоды |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED]Ваше видео более 3х минут.<br>3.7 Если видеодоказательство длится более 3 минут, Вы должны указать тайм-коды нарушений. " +
        "[B][CENTER]Укажите тайм коды нарушений игрока и создайте новую жалобу. </br> <br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Нужна видеофиксация |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В таких случаях нужна видеофиксация нарушения. <br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Нарушений не найдено |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Нарушений со стороны данного игрока не было найдено.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Недостаточно доказательств |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Недостаточно доказательств на нарушение от данного игрока." +
        "[B][CENTER] Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Дублирование |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ранее вам уже был дан ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| В жалобы на адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Вы ошиблись разделом. Обратитесь в раздел жалоб на администрацию. <br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| В обжалование наказаний |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Вы ошиблись разделом. Обратитесь в раздел обжалований наказаний. <br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Форма темы жалоб |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб.</br><br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Нету /time |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] На ваших доказательствах отсутствует /time.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Док-ва в соц. сетях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Доква отредактированы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Доказательства должны быть в первоначальном виде.<br>Видеодоказательства, которые были отредактированы и на которых присутствует посторонняя музыка, неадекватная речь, нецензурные слова или выражения, могут быть не рассмотрены в качестве доказательств.</br><br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Нету доков |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей жалобе отсутствуют доказательства.<br>Создайте новую жалобу и прикрепите доказательства.</br><br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Не работают доки |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В вашей жалобе не работают доказательства.<br>Создайте новую жалобу с рабочими доказательствами.</br><br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| жалоба от 3 лица |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| более 3 суток |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| название темы |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] В названии темы необходимо указать никнейм игрока, на которого подается жалоба, и суть жалобы: Nick_Name | Суть жалобы.<br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Жалоба на рассмотрении |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба взята на [color=orange] рассмотрение.[/color]<br>Просьба ожидать ответа и не создавать дубликаты данной темы.</br><br>[color=orange]Ожидайте ответа.[/color]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: PINN_PREFIX,
	  status: true,
                 },
    {
                                	  title: '| жалоба с другого серва |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Вы ошиблись разделом сервера.<br>Создайте новую жалобу в нужный раздел вашего сервера.</br><br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| закрыт доступ к докам |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Доступ к вашим доказательствам закрыт.<br>Создайте новую жалобу с открытыми доказательствами.</br><br>Отказано, закрыто.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: UNACCСEPT_PREFIX,
	  status: false,
                 },
        {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила госс ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#9C27B0'
    },
    {
                                	  title: '| Работа в форме госс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | Jail 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Казино/БУ в форме госс |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 1.13. Запрещено находиться в форме внутри казино, участвовать в битве за контейнеры, участвовать в захвате семейного контейнера, находится на Б/У рынке с целью покупки / продажи авто, а также устраиваться на сторонние работы в форме фракции | Jail 30 минут  </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| NoNRP коп |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 6.03. Запрещено оказывать задержание без Role Play отыгровки | Warn </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| Редакт не по ПРО |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| редактирование в личных целях |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Игрок будет наказан по пункту правил:<br> 4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком | Ban 7 дней + ЧС организации </br><br>[COLOR=#00BC00] Одобрено, закрыто.[/COLOR]</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: ACCСEPT_PREFIX,
	  status: false,
                 },
        {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалоб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
             background: '#424242'
    },
    {
                                	  title: '| Гл.Адм |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба передана Главному администратору.<br> Просьба ожидать ответа и не создавать дубликаты данной темы. </br><br>Ожидайте ответа.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: GA_PREFIX,
	  status: true,
                 },
    {
                                	  title: '| Тех. спецу |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба передана [COLOR=#ff4500]Техническому специалисту.[/COLOR]<br> Просьба ожидать ответа и не создавать дубликаты данной темы. </br><br>Ожидайте ответа.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: TEXY_PREFIX,
	  status: false,
                 },
    {
                                	  title: '| ГКФ |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба передана Главному Куратору Форума.<br> Просьба ожидать ответа и не создавать дубликаты данной темы. </br><br>Ожидайте ответа.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: PINN_PREFIX,
	  status: true,
                 },
    {
                                	  title: '| Специальной Администрации |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба передана Специальной Администрации.<br> Просьба ожидать ответа и не создавать дубликаты данной темы. </br><br>Ожидайте ответа.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: SPECY_PREFIX,
	  status: true,
                 },
    {
                                	  title: '| Команде Проекта |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=RED] Ваша жалоба передана Команде Проекта.<br> Просьба ожидать ответа и не создавать дубликаты данной темы. </br><br>Ожидайте ответа.</br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=RED]С уважением Куратор форума<3.[/COLOR]<br>",
                       prefix: COMMAND_PREFIX,
	  status: true,
                 },
];
         $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Ответы', 'selectAnswer');

    // Стили для кнопки "Ответ💥"
    const style = document.createElement('style');
    style.textContent = `
      #selectAnswer {
        background-color: #f44336 !important;
        color: white !important;
        border: none !important;
        border-radius: 999px !important;
        padding: 6px 16px !important;
        font-weight: bold !important;
        font-size: 13px !important;
        text-transform: uppercase !important;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    `;
    document.head.appendChild(style);

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
    .map((btn, i) =>
      `<button id="answers-${i}" class="button--primary button rippleButton"
        style="
          margin:5px;
          ${btn.background ? `background-color: ${btn.background} !important;` : ''}
          border-radius: 10px !important;
          color: white !important;
        ">
        <span class="button-text">${btn.title}</span>
      </button>`
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