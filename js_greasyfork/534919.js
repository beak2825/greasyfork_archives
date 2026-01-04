// ==UserScript==
// @name         KEMEROVO | Скрипт для КФ
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Для любимых братков
// @author       M.Capone
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @license      M.Capone
// @icon         https://sun9-56.userapi.com/impg/8r8Y-KDK4pNAloXWSh99kChS8BIToX-fDBtuiw/udoNey6N5sY.jpg?size=810x810&quality=95&sign=991336afd7d7db8c2361d88e0360f67c&type=album
// @downloadURL
// @updateURL
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/534919/KEMEROVO%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/534919/KEMEROVO%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4.meta.js
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
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Отказано |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Не по форме |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография составлена не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Заголовок не по форме |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay биографии составлен не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
     {
	  title: '| На доработке |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.  <br>"+
	   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR]  .<br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил в течении 24 часов |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '| Уже одобрена |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к она уже была одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Недостаточно инфы/неграмотно |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации, либо в ней допущены грамматические ошибки.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Недостаточно инфы во внешности |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании внешности.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о характере |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании характера.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы об учёбе |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об годах учёбы(образовании).<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о детстве |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период детства и юности.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Недостаточно инфы о взрослой жизни |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период взрослости.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
{
	  title: '| Мало инфы о семье |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к в пункте (Семья) не достаточно информации. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| От 3-его лица |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к она написана от 3-его лица. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы ее скопировали. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Нонрп ник |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник англ |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Д.Р. не совпадает с годом |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к дата рождения вашего персонажа и возраст не совпадают. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Дата рождения не полностью |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
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
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     	{
	  title: '| Отказано |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Заголовок не по форме |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay ситуации составлен не по форме. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: '| На доработке |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - ситуации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП ситуация будет отказана.  <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    	{
	  title: '| Не дополнил |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR]  .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы не туда попали. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не пишите лишнее(Счет банка и т.п. |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана. Оформите ее без добавлений от себя, по типу (Банк счет...) и тд...<br>"+
        "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR]  .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Супергерой |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
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
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#00FF00]Одобрено.<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    	{
	  title: '| Не по форме |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к она составлена не по форме. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: '| На доработке |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - организации недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП организация  будет отказана.  <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FFFF00]На рассмотрении.<br>',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '| Не дополнил |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП организаций закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Не туда |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы не туда попали. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Ник по англ(нужно русские) |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
  	{
	  title: '| Неграмотно |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - организация отказана т.к она оформлена неграмотно. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[B][CENTER][COLOR=#FF0000]Отказано.<br>',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 	{
	  title: '| Копипаст |',
	  content:
 
		'[CENTER][img]https://i.postimg.cc/zGns3TKy/1621526767066.png[/img][/CENTER]<br><br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=#000000]BLACK[/COLOR] [COLOR=#FF0000]RUSSIA[/COLOR] .<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
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
 
    const Button2 = buttonConfig("ОПС", "https://forum.blackrussia.online/threads/Общие-правила-серверов.312571/");
 
    bgButtons.append(Button2);
 
 
(function () {
    'use strict';
 
    function createAnimatedSnow() {
 
        const snowflakes = [];
 
        function setupCanvas() {
            const canvas = document.createElement('canvas');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.id = 'snow-flakes';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.pointerEvents = 'none';
            canvas.style.zIndex = '99999';
            canvas.style.filter = 'blur(2px)';
            document.body.appendChild(canvas);
 
            return canvas.getContext('2d');
        }
 
        function createSnowflake(x, y) {
            const size = Math.random() * 2 + 1;
            const speedY = Math.random() * 1 + 1;
            const speedX = (Math.random() - 0.5) * 2;
 
            return { x, y, size, speedY, speedX };
        }
 
        function drawSnowflake(ctx, snowflake) {
            ctx.beginPath();
            ctx.arc(snowflake.x, snowflake.y, snowflake.size, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.closePath();
        }
 
        function updateSnowflakes(ctx) {
            for (let i = 0; i < snowflakes.length; i++) {
                const snowflake = snowflakes[i];
 
                snowflake.y += snowflake.speedY;
                snowflake.x += snowflake.speedX;
 
                if (snowflake.y > window.innerHeight || snowflake.x > window.innerWidth) {
                    snowflakes[i] = createSnowflake(Math.random() * window.innerWidth, Math.random() * -window.innerHeight);
                }
 
                drawSnowflake(ctx, snowflake);
            }
        }
 
        function animateSnow() {
            const ctx = setupCanvas();
 
            for (let i = 0; i < 500; i++) {
                snowflakes.push(createSnowflake(Math.random() * window.innerWidth, Math.random() * window.innerHeight));
            }
 
            function animate() {
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
                updateSnowflakes(ctx);
                requestAnimationFrame(animate);
            }
 
            animate();
        }
 
        animateSnow();
 
    }
 
    function removeAnimatedSnow() {
        const snowCanvas = document.querySelector('#snow-flakes');
        document.body.removeChild(snowCanvas);
    }
 
    const uixLogo = document.querySelector('a.uix_logo img');
    uixLogo.src = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
    uixLogo.srcset = 'https://i.postimg.cc/JzQPT4Wc/blackrussia.png';
 
    const messageCellUser = document.querySelectorAll('.message-cell--user');
    messageCellUser.forEach(function (cell) {
        cell.style.background = '#29586c88';
    });
 
    const messageCellMain = document.querySelectorAll('.message-cell--main');
    messageCellMain.forEach(function (cell) {
        cell.style.background = '#15293788';
    });
 
    const scrollbarStyle = document.createElement('style');
    scrollbarStyle.id = 'style-scrollbar';
    scrollbarStyle.textContent = `
    `;
    document.head.appendChild(scrollbarStyle);
 
    const pageHeader = document.querySelector('.pageContent');
    const switchStyleBlock = document.createElement('label');
    switchStyleBlock.className = 'switch';
    switchStyleBlock.innerHTML = `
            <input type="checkbox" id="styleToggleCheck">
            <span class="slider round" style="padding-right: 20px;">
            <span class="addingText" style="display: block; width: max-content; margin: 5px; margin-left: 42px; margin-top: 2px;">[Снег]</span>
            </span>
        `;
    pageHeader.appendChild(switchStyleBlock);
 
    const styleToggleCheck = document.getElementById('styleToggleCheck');
    if (localStorage.getItem('snowEnabled') === 'true') {
        styleToggleCheck.checked = true;
        createAnimatedSnow();
    }
    styleToggleCheck.addEventListener('change', function () {
        if (styleToggleCheck.checked) {
            createAnimatedSnow();
            localStorage.setItem('snowEnabled', 'true');
        } else {
            removeAnimatedSnow();
            localStorage.setItem('snowEnabled', 'false');
        }
    });
 
    const sliderStyle = document.createElement('style');
    sliderStyle.id = 'slider-style';
    sliderStyle.textContent = `
    .switch {
        position: relative;
        display: inline-block;
        width: 40px;
        height: 20px;
        padding-left: 20px;
        margin: 0 30px 0 auto;
    }
    .switch input { display: none; }
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #34aaeb;
        background-color: #212428;
        transition: all .4s ease;
    }
    .slider:hover{
        background-color: #29686d;
    }
    .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: #32a0a8;
        box-shadow: 0 0 5px #000000;
        transition: all .4s ease;
    }
    input:checked + .slider {
        background-color: #212428;
    }
    input:checked + .slider:hover {
        background-color: #29686d;
    }
    input:focus + .slider {
        box-shadow: 0 0 5px #222222;
        background-color: #444444;
    }
    input:checked + .slider:before {
        transform: translateX(19px);
    }
    .slider.round {
        border-radius: 34px;
    }
    .slider.round:before {
        border-radius: 50%;
    }
`;
    document.head.appendChild(sliderStyle);
})();