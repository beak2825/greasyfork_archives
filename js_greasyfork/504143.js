// ==UserScript==
// @name         РП Биография | Для Кураторов Форума сервера SARATOV
// @namespace    https://forum.blackrussia.online/
// @version      1.0.1
// @description  Скрипт предназначен для Кураторов Форума проекта Black Russia | Этот скрипт был объеденён со скриптом "Скрипт для модераторов форума Saratov" и "Кураторы форума by S.Beezy" с разрешением автора
// @author       Klaus_Pittmon | Skezzy_Beezy | Fanzi_Vinogradov 
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://i.postimg.cc/nhCzsd3r/32x32-1000279848.png
// @downloadURL https://update.greasyfork.org/scripts/504143/%D0%A0%D0%9F%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8F%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SARATOV.user.js
// @updateURL https://update.greasyfork.org/scripts/504143/%D0%A0%D0%9F%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D1%8F%20%7C%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SARATOV.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const WATCHED_PREFIX = 9; // рассмотрено
	const TEX_PREFIX = 13; //  техническому специалисту
	const NO_PREFIX = 0;
      const biography = [
	   {
       title: '     . . . . . Отказ (своими словами) . . . . .     ',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
       {
      title: 'Отказ (Несколько ошибок)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',     
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей биографии присутсвует несколько ошибок:<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
},
       {
        title: 'Отказ (Причина)',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)', 
        content:
    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Ваш текст[/COLOR]<br><br>",
    },
       {
      title: 'Отказ (Свой текст)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',        
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
},
       {
      title: 'Отказ (Несколько ошибок)',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',        
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей биографии присутсвует несколько ошибок:<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
},
       {
       title: '     . . . . . На доработку (своими словами) . . . . .     ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
       {
      title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография (ваш текст). У вас есть 24 часа на исправление своей биографии.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На рассмотрении.[/COLOR]<br><br>",
},
       ];
       const buttons = [
       {
       title: '     . . . . . Готовые ответы . . . . .     ',
              dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
       {
      title: 'Биография одобрена',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)', 
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу RolePlay биографию я готов вынести вердикт.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B]<br><br>",
      prefix: ACCEPT_PREFIX,
      move: 1661,
	  status: false,
},
           {
      title: 'На доработку',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',            
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/исправление, иначе РП биография будет отказана.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На рассмотрении..[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B]<br><br>",
      prefix: PIN_PREFIX,
      move: 1662,            
	  status: true,
},
{
      title: 'На дополнение',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография нарушает правила подачи RolePlay биографий. У вас есть 24 часа на исправление своей биографии.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На дополнении.[/COLOR]<br><br>",
      prefix: PIN_PREFIX,
      move: 1662,
	  status: true,
},
{
      title: 'Отказ (Не по форме)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография написана не по форме.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Не заполнена)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Форма RolePlay биографии не заполнена частично либо вовсе не заполнена.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Мало информации)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Недостаточное количество RolePlay информации о вашем персонаже. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Скопирована)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография скопирована. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Заголовок)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вашей RolePlay биографии не верный заголовок. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (От 1-го лица)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография написана от 1-го лица. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
          {
        title: ' Отказ (Недостаточно РП информации)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Недостаточно РП информации.[/COLOR]<br><br>",

      prefix: UNACCEPT_PREFIX,
       move: 1663,
      status: false,
    },
{
  	  title: 'Отказ (Возраст не совпал)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Возраст не совпадает с датой рождения. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
{
      title: 'Отказ (Ошибки)',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей RolePlay биографии присутствуют грамматические либо пунктуационные ошибки. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
       {
      title: 'Отказ (Юность и Взрослая)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Юность и Взрослая жизнь должна начинаться с 18 лет. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
       {
      title: 'Отказ (Опечатки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей RolePlay биографии присутствуют опечатки в словах. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
	  status: false,
},
          {
        title: 'Отказ (Орф и пунктуац ошибки)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        '[CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Орфографические и пунктуационные ошибки.[/B][/COLOR]' +
         "[B]<br><br>",        
      prefix: UNACCEPT_PREFIX,
      move: 1663,
      status: false,
    },
       {
        title: 'Отказ (Орфографические ошибки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        '[CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Орфографические ошибки.[/B][/COLOR]' +
              "[B]<br><br>",
      prefix: UNACCEPT_PREFIX,
      move: 1663,
      status: false,
    },
       {
        title: 'Отказ (Пунктуационные ошибки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        '[CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Пунктуационные ошибки.[/B][/COLOR]' +
        "[B]<br><br>",      
      prefix: UNACCEPT_PREFIX,
      move: 1663,
      status: false,
    },
        {
        title: 'Отказ (Вымышленные действия персонажа)',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        '[CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Вымышленные действия персонажа[/B][/COLOR]' +
        "[B]<br><br>",       
      prefix: UNACCEPT_PREFIX,
      move: 1663,
      status: false,
    },
       {
        title: 'Отказ (Слишком молод)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.<br><br>"+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman]Причина отказа: [COLOR=#ccff00]Некорректен возраст (слишком молод).[/COLOR]<br><br>",

      prefix: UNACCEPT_PREFIX,
       move: 1663,
      status: false,
    },
          {
        title: 'Отказ (Некоррект национальность)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
              "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус -[COLOR=#FF0000]Отказано. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
 "[B][CENTER][FONT=times new roman] [COLOR=#ff0000] Причина отказа: [COLOR=#FFFFFF]Некорректная национальность.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
       move: 1663,
      status: false,
    },
              ];
       const tasks = [
      {
        title: 'В архив',
          dpstyle: 'oswald: 3px;     color: #fff; background: #808080',
        prefix: 0,
        move: 1639,
      },
      {
        title: 'В одобренные био',
          dpstyle: 'oswald: 3px;     color: #fff; background: #228B22; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #32CD32',
        prefix: ACCEPT_PREFIX,
        move: 1661,
      },
      {
        title: 'Био на доработку',
          dpstyle: 'oswald: 3px;     color: #fff; background: #FF8C00; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF8C00',
        prefix: PIN_PREFIX,
        move: 1662,
      },
      {
        title: 'В отказанные био',
          dpstyle: 'oswald: 3px;     color: #fff; background: #B22222; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF0000',
        prefix: UNACCEPT_PREFIX,
        move: 1663,
      },
  ];
        
    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      addAnswers();      
      addButton('Свой ответ', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: none; background: #483D8B');
      addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('ПЕРЕМЕЩЕНИЕ', 'selectMoveTask', 'border-radius: 13px; margin-right: 5px; border: none; background: #4682B4');
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACСEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData(TEX_PREFIX, true));
  
      $(`button#selectComplaintAnswer`).click(() => {
          XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
          buttons.forEach((btn, id) => {
              if (id > 0) {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
              } else {
                  $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
              }
          });
      });
      $(`button#selectBiographyAnswer`).click(() => {
        XF.alert(buttonsMarkup(biography), null, 'Выберите ответ:');
        biography.forEach((btn, id) => {
            if (id > 1) {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            } else {
                $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
            }
        });
      });
          $(`button#selectMoveTask`).click(() => {
        XF.alert(tasksMarkup(tasks), null, 'Выберите действие:');
        tasks.forEach((btn, id) => {
            $(`button#answers-${id}`).click(() => moveThread(tasks[id].prefix, tasks[id].move));
        });
      });
  });
  
      function addButton(name, id, style) {
         $('.button--icon--reply').before(
	`<button type="button" class="button--primary button rippleButton" id="${id}" style="${style}">${name}</button>`,
	);
  }
  function addAnswers() {
		$('.button--icon--reply').before(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectComplaintAnswer" style="oswald: 3px; margin-bottom: 5px; border-radius: 13px;">ОТВЕТЫ</button>`,
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

  function tasksMarkup(buttons) {
  return `<div class="select_answer">${buttons
    .map(
      (btn, i) =>
        `<button id="answers-${i}" class="button--primary button ` +
        `rippleButton" style="margin:6px; width:300px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
          editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
          $('.button--icon.button--icon--reply.rippleButton').trigger('click');
      }
  }
      
  function pasteContent2(id, data = {}, send = false) {
    const template = Handlebars.compile(biography[id].content);
    if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

    $('span.fr-placeholder').empty();
    $('div.fr-element.fr-view p').append(template(data));
    $('a.overlay-titleCloser').trigger('click');

    if (send == false) {
        editThreadData(biography[id].move, biography[id].prefix, biography[id].status, biography[id].open);
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
      4 < hours && hours <= 11
        ? 'Доброе утро'
        : 11 < hours && hours <= 15
        ? 'Добрый день'
        : 15 < hours && hours <= 21
        ? 'Добрый вечер'
        : 'Доброй ночи',
  };
  }
  
  function editThreadData(move, prefix, pin = false, open = false) {
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
      } else if (pin == true && open) {
        fetch(`${document.URL}edit`, {
          method: 'POST',
          body: getFormData({
          prefix_id: prefix,
          discussion_open: 1,
          title: threadTitle,
          sticky: 1,
          _xfToken: XF.config.csrf,
          _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
          _xfWithData: 1,
          _xfResponseType: 'json',
          }),
        }).then(() => location.reload());
      } else {
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
      if (move > 0) {
        moveThread(prefix, move);
      } 
  }        
  
  function moveThread(prefix, type) {
  // Функция перемещения тем
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

