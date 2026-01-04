// ==UserScript==
// @name         Лучший скрипт в мире
// @namespace     https://forum.blackrussia.online
// @version      1.1
// @description  По вопросам(ВК): @inate4
// @author       хз
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503674/%D0%9B%D1%83%D1%87%D1%88%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B2%20%D0%BC%D0%B8%D1%80%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/503674/%D0%9B%D1%83%D1%87%D1%88%D0%B8%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B2%20%D0%BC%D0%B8%D1%80%D0%B5.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
})();(function () {
	'use strict';
	const DORABOTKA_PREFIX = 3; // доработка
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const NO_PREFIX = 0;
	const buttons = [
          {
          title: 'Предложения по улучшению - @inate4',
          dpstyle: 'oswald: 10px;     color: #fff; background: #28a745; box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.14), 0 2px 2px 0 rgba(0, 0, 0, 0.12), 0 1px 3px 0 rgba(0, 0, 0, 0.2); border: none; border-color: 2px solid #ff1493',
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀|-(--(- ღ ------ RolePlay биографии ------ ღ -)---|⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #ff69b4; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: '| Одобрено |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	ashot: "RPbio",
           },
           {
             title: '| Отказано |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
             content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
             prefix: UNACCEPT_PREFIX,
             status: false,
             ashot: "RPbio",
          },
          {
            title: '| Не по форме |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография составлена не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| Заголовок не по форме |' ,
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color:rgb(255, 192, 203, 0.5)',
            content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Заголовок вашей RolePlay биографии составлен не по форме. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
ashot: "RPbio",
          },
          {
            title: '| На доработке |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.  <br>"+
	    "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
            prefix: DORABOTKA_PREFIX,
            status: true,
            ashot: "RPbio",
          },
          {
            title: '| Не дополнил в течении 24 часов |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к вы ее не дополнили. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| Уже одобрена |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к она уже была одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
   },
          {
          title: '| Недостаточно информации |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
               content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
               prefix: UNACCEPT_PREFIX,
	           status: false,
	ashot: "RPbio",
          },
          {
          title: '| Неграмотно |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
               content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней допущены грамматические ошибки.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
               prefix: UNACCEPT_PREFIX,
	           status: false,
	ashot: "RPbio",
          },
          {
            title: '| Недостаточно инфы во внешности |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании внешности.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| Недостаточно инфы о характере |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об описании характера.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| Недостаточно инфы об учёбе |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color:  rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации об годах учёбы(образовании).<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| Недостаточно инфы о детстве |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период детства и юности.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| Недостаточно инфы о взрослой жизни |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay биография отказана, т.к в ней недостаточно информации о годах жизни в период взрослости.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
   {
            title: '| Мало инфы о семье |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к в пункте (Семья) не достаточно информации. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
          {
            title: '| От 1-ого лица |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay - биография отказана т.к она написана от 1-ого лица. Внимательно прочтите правила создания РП биографий закрепленые в данном разделе.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
 
          {
            title: '| Супергерой |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		   "[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		   "[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		   "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br> ',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
           {
        title: '| Копипаст |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к вы ее скопировали. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br> ' ,
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
           {
        title: '| Нонрп ник |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
           {
        title: '| Ник англ |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
           {
        title: '| Д.Р. не совпадает с годом |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к дата рождения вашего персонажа и возраст не совпадают. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
          },
           {
        title: '| Дата рождения не полностью |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>' ,
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPbio",
           },
    {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀|-(--(- ღ ------ RolePlay ситуации ------ ღ -)---|⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #ff69b4; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: '| Одобрено |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay ситуация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
  	ashot: "RPsit",
           },
           {
        title: '| Доб-я от себя |',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Ваша RolePlay - ситуация отказана.Оформите ее без добавления от себя. Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе. <br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
            prefix: UNACCEPT_PREFIX,
            status: false,
            ashot: "RPsit",
          },
          {
             title: '| Отказано |',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
             content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay ситуация отказана. Внимательно прочтите правила создания РП ситуаций закрепленые в данном разделе.<br>"+
		 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
             prefix: UNACCEPT_PREFIX,
             status: false,
             ashot: "RPsit",
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀|-(--(- ღ ------ RolePlay организации ------ ღ -)---|⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #ff69b4; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: '| Одобрено |',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
	  content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay организация одобрена.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mDkmFFKZ/download-2.gif[/img][/url]<br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
  	ashot: "RPorg",
           },
           {
          title: '| Не по форме |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
               content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay организация отказана, т.к. она написана не по форме.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
               prefix: UNACCEPT_PREFIX,
	           status: false,
	ashot: "RPorg",
          },
          {
          title: '| Заголовок Не по форме |',
          dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5)',
               content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#00FFFF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша RolePlay организация отказана, т.к. заголовок вашей биографии написан не по форме.<br>"+
	 "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
               prefix: UNACCEPT_PREFIX,
	           status: false,
	ashot: "RPorg",
          }
];
    $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
	// Добавление кнопок при загрузке страницы
    addButton('🤮БИОГРАФИИ 🤡', 'selectAnswer', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 192, 203, 0.5);');
// Поиск информации о теме
	const threadData = getThreadData();
 
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
			}
		});
	});
});
 
 function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
	}
	function addAnswers() {
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">ОТВЕТЫ</button>`,
	);
	}
 
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
        4 < hours && hours <= 11 ?
        'Доброе утро' :
        11 < hours && hours <= 15 ?
        'Добрый день' :
        15 < hours && hours <= 21 ?
        'Добрый вечер' :
        'Доброй ночи',
    };
}
 
 
          function editThreadData(prefix, pin = false)
          {
          // Получаем заголовок темы, так как он необходим при запросе
            const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
            if(pin == false)
            {
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
            if(pin == true)
            {
              fetch(`${document.URL}edit`,
              {
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
          if(prefix == ACCEPT_PREFIX && ashot == "RPbio")
          {
             moveThread(prefix, 1087);
          }
          if(prefix == UNACCEPT_PREFIX && ashot == "RPbio")
          {
             moveThread(prefix, 1089);
          }
          if(prefix == DORABOTKA_PREFIX && ashot == "RPbio")
          {
             moveThread(prefix, 1088);
             editThreadData(PIN_PREFIX, true);
          }
          if(prefix == ACCEPT_PREFIX && ashot == "RPsit")
          {
             moveThread(prefix, 1084);
          }
          if(prefix == UNACCEPT_PREFIX && ashot == "RPsit")
          {
             moveThread(prefix, 1086);
          }
          if(prefix == DORABOTKA_PREFIX && ashot == "RPsit")
          {
             moveThread(prefix, 1085);
             editThreadData(PIN_PREFIX, true);
          }
          if(prefix == ACCEPT_PREFIX && ashot == "RPorg")
          {
             moveThread(prefix, 1077);
          }
          if(prefix == UNACCEPT_PREFIX && ashot == "RPorg")
          {
             moveThread(prefix, 1079);
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
          })();// ==UserScript==
