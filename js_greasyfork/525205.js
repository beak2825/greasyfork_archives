// ==UserScript==
// @name         ARKHANGELSK | Скрипт для КФ
// @namespace    https://forum.blackrussia.online
// @version      1.3
// @description  Скрипт для КФ
// @author       Ghost
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      Ghost
// @icon         https://i.postimg.cc/zGq4SCZM/image.png
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL
// @downloadURL https://update.greasyfork.org/scripts/525205/ARKHANGELSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/525205/ARKHANGELSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
// ==/UserScript==

    (function () {
	'use strict';
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const TECHADM_PREFIX = 13 // тех администратору
	const WATCHED_PREFIX = 9; // рассмотрено
	const WAIT_PREFIX = 14; // ожидание
    const ACCEPT_PREFIX = 8; // префикс одобрено
    const UNACCEPT_PREFIX = 4; // префикс отказано
    const GA_PREFIX = 12; // передать га
    const VAJNO_PREFIX = 1; // передать гкф
    const NO_PREFIX = 0;
	const buttons = [
    {
      title: '|-(--(->------ RolePlay биографии ------<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
	{
	  title: '| Одобрено |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Отказано |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография составлена не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Заголовок не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay биографии составлен не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| На доработке |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.  <br>"+
	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR]  .<br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил в течении 24 часов |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уже одобрена |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к она уже была одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Недостаточно инфы/неграмотно |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации, либо в ней допущены грамматические ошибки.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Недостаточно инфы во внешности |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании внешности.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о характере |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании характера.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы об учёбе |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об годах учёбы(образовании).<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о детстве |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период детства и юности.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о взрослой жизни |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период взрослости.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Мало инфы о семье |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к в пункте (Семья) не достаточно информации. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| От 3-его лица |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к она написана от 3-его лица. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы ее скопировали. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Нонрп ник |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник англ |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Д.Р. не совпадает с годом |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к дата рождения вашего персонажа и возраст не совпадают. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Дата рождения не полностью |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: '|-(--(->------- RolePlay ситуации -------<-)--)-|',
        color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    	{
	  title: '| Одобрено |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     	{
	  title: '| Отказано |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Заголовок не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay ситуации составлен не по форме. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '| На доработке |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - ситуации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП ситуация будет отказана.  <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    	{
	  title: '| Не дополнил |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR]  .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы не туда попали. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не пишите лишнее(Счет банка и т.п. |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. Оформите ее без добавлений от себя, по типу (Банк счет...) и тд...<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR]  .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: '|-(--(->---- Неоф. RP организации ----<-)--)-|',
      color: 'oswald: 3px; color: #FFFF00; background: #000000; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FFFF00',
    },
    {
	  title: '| Одобрено |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
                    {
	  title: '| Отказано |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#ff0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к она составлена не по форме. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: '| На доработке |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - организации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП организация  будет отказана.  <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП организаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы не туда попали. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник по англ(нужно русские) |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к она оформлена неграмотно. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:

		'[CENTER][img]https://i.postimg.cc/WzsG9Jgr/NQgJd.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/HWvcssQP/1.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];
    	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницs
	addButton('Одобрено', 'accept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
	addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
    addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
	addAnswers();

	// Поиск информации о теме
	const threadData = getThreadData();

	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
    $('button#accept').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#techspec').click(() => editThreadData(TECHADM_PREFIX, true));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#vajno').click(() => editThreadData(VAJNO_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
	buttons.forEach((btn, id) => {
	if (id > 1) {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
	}
	else {
	$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
	}
	});
	});
	});

   function addButton(name, id, hex = "grey") {
		$('.button--icon--reply').before(
		`<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 25px; margin-right: 5px; background-color: ${hex}">${name}</button>`,
		);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">Шаблончики</button>`,
	);
	}

	function buttonsMarkup(buttons) {
		return `<div class="select_answer">${buttons
		  .map(
			(btn, i) =>
			  `<button id="answers-${i}" class="button--primary button ` +
			  `rippleButton" style="margin:5px; background-color: ${btn.color || "grey"}"><span class="button-text">${btn.title}</span></button>`,
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


         function editThreadData(prefix, pin = false, kumiho = true) {
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
    discussion_open: 1,
    sticky: 1,
    _xfToken: XF.config.csrf,
    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
    _xfWithData: 1,
    _xfResponseType: 'json',
     }),
   }).then(() => location.reload());
  }
}


 function moveThread(prefix, type) {
 // Перемещение темы
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
 })();

const bgButtons = document.querySelector(".pageContent");
const buttonConfig = (text, href) => {
  const button = document.createElement("button");
  button.textContent = text;
  button.classList.add("bgButton");
  button.addEventListener("click", () => {
    window.location.href = href;
  });
  return button;
};

    const Button4 = buttonConfig("RP Biography", "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.2480/");

    bgButtons.append(Button4);

    const Button5 = buttonConfig("RP Situation", "https://forum.blackrussia.online/forums/%D0%A0%D0%9F-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B8.2479/");

    bgButtons.append(Button5);

    const Button6 = buttonConfig("RP Organization", "https://forum.blackrussia.online/forums/%D0%9D%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-rp-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.2477/");

    bgButtons.append(Button6);
