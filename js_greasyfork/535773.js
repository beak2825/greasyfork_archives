// ==UserScript==
// @name         Скрипт Для Кураторов Форума BLACK RUSSIA | by A.Darvill
// @namespace    https://forum.blackrussia.online/
// @version      3.18.1
// @author       Arthur_Darvill | Вк - https://vk.com/kynitsky
// @description Прост скрипт и все
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @downloadURL https://update.greasyfork.org/scripts/535773/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20BLACK%20RUSSIA%20%7C%20by%20ADarvill.user.js
// @updateURL https://update.greasyfork.org/scripts/535773/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20BLACK%20RUSSIA%20%7C%20by%20ADarvill.meta.js
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
    const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
	const NO_PREFIX = 0;
      const biography = [
	   {
       title: '     . . . . . Свой ответ для жалоб . . . . .     ',
	   dpstyle: 'oswald: 3px;   color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    },
{
	  title: 'Одобрено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваш текст<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
},
{
      title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На рассмотрении.[/COLOR]<br><br>",
},
{
      title: 'Отказ',
      dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',        
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Отказано.[/COLOR]<br><br>",
},
{
	  title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваш текст<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
},
{
       title: '     . . . . . Свой ответ для РП биографии . . . . .     ',
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
       title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Статус одобрено✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
    },

{
	  title: 'DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'DB',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'RK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'TK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'SK',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'PG',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Mass DM',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'помеха работе игрокам',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04. [/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#ff0000] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)   [/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
              {
      title: 'NonRP Обман',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05. [/color] . Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000] | PermBan [/color].[/COLOR][/CENTER][/B]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
{
	  title: 'NonRP Поведение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
       prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Drive',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},



              {
      title: 'Сторонне ПО',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
      content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками  [Color=#ff0000] | Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX ,
	  status: false,
    },
{
	  title: 'Розыск без причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено выдавать розыск без Role Play причины[Color=#ff0000]| Warn.[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX ,
	  status: false,
},
{
	  title: 'Штраф без причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]7.02 [/color] Запрещено выдавать штраф без Role Play причины [Color=#ff0000]| Warn.[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Права без причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено отбирать водительские права без Role Play причины [Color=#ff0000]| Warn // Jail 30[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'Права в погоне',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]6.02 [/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn.[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'Одиночный патруль',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обыск без отыгровки // причины',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено проводить обыск игрока без Role Play отыгровки и причины[Color=#ff0000]| Warn[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Задержаниие без отыгровки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Нарушитель буден наказан по следующему пункту правил государственных структур:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено оказывать задержание без Role Play отыгровки | Warn [Color=#ff0000]| [/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
    {
	  title: 'NonRP Коп',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn .[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP ВЧ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP ВЧ (Гражданский)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Огр. // Похищение',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][/COLOR][COLOR=rgb(209, 213, 216)]Нарушение одного из пунктов Общих правил ограблений и похищений | Jail (от 10 до 60 минут) // Warn // Ban[/COLOR]<br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Уход от RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
   prefix: ACCEPT_PREFIX,
	  status: false,
},

{
	  title: 'RP отыгровки в свою сторону',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Аморал',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Затягивание RP',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Nick',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Oск. Nick',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Fake',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Уход от наказания',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.34.[/color] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Злоуп. наказаниями',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
     prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'ЕПП',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
         prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Арест на аукционе',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP аксессуар',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Мат в названии Бизнеса',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#ff0000]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Багоюз анимации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Тим Мертв. рука',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.56.[/color] Запрещается объединение в команду между убийцей и выжившим на мини-игре «Мертвая рука» [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Работа в форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Казино в форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
     {
	  title: 'Помеха медиалицам',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.12[/color] Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом[Color=#ff0000]| Ban 7 дней. [/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Т/С в личных целях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Редактирование в личных целях',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️На рассмотрение✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
               {
	  title: 'На рассмотрении',
       dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][COLOR=#ffff00]На рассмотрении.[/CENTER]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
},

{
    	  title: 'Передано ГКФ-у',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба передана Главному Куратору Форума, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][COLOR=#ffff00]На рассмотрении.[/COLOR]<br><br>",
	  prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: 'Передано Тех. спецу',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба передана Техническому Специалисту, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#0000ff]Техническому Специалисту.[/COLOR]<br><br>",
      prefix: TEX_PREFIX,
	  status: true,
},
{
	  title: 'Передано ГА',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
	  content:

		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба передана Главному Администратору, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Главному Администратору.[/COLOR]<br><br>",
	  prefix: GA_PREFIX,
	  status: true,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Жалобы для ГКФ✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'

},
{
	  title: 'Оскорбление // Упом. родни',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оскорбление',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
        prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. Адм',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. проекта',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'CapsLock',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Flood',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
         prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Meta Gaming',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Политическая // Религ. пропоганда',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000] 3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Н/ПРО',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Объявления в ГОСС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Выдача себя за администратора',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧС администрации[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Реклама промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Продажа промо',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'OОC угрозы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
 		"[B][CENTER][FONT=times new roman][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Попытка ПИВ',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обман администрации',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обход системы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Разговор не на русском',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000]| Устное замечание / Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
        tile: 'Мат в Vip Chat',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
    contenrt:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
    prefix: ACCEPT_PREFIX,
    status: false,
},
{
	  title: 'Злоуп. символами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. секс. характера',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив гл. чата (СМИ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Угроза о наказании от Адм.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Ввод в заблуждение командами',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Транслит',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP эфир',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
 		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив склада',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Музыка в Voice',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. // Упом родни в Voice',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
 		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Шумы в Voice',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Реклама в Voice',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
           {
	  title: 'Нац. // Рел. конфликт',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.35[/color] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=#ff0000]| Mute 120 минут / Ban 7 дней [/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Изменение голоса софтом',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
},
{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Перенаправление жалоб✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
	  title: 'В ЖБ на Адм.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на ЛД',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В обжалования',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В тех. раздел',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на тех. спец.',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на СС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел соответствующей фракции в «Жалобы на Старший Состав». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на МС',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел соответствующей фракции в «Жалобы на сотрудников». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Отказ в жалобе✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
            {
     title: 'Администрация не может выдать наказание',
        dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Администрация не может выдать наказание по вашим доказательствам[/color].[/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0026]Отказоно.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
     },
{
	  title: 'Нарушений не найдено',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Нарушений со стороны данного игрока не было найдено. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Наказание уже выдано',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Наказание уже было выдано. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
    title: 'Дубликат жалобы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Данная жалоба - дубликат вашей прошлой жалобы.[/COLOR][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
      status: false,
},
{
      title: 'Разные ники',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
      content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]НикНеймы в жалобе и доказательствах отличаются.[/COLOR][/FONT][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
},
{
	  title: 'Возврат средств',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Недостаточно док-в',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
     prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Отсутствуют док-ва',
     dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательства на нарушение от данного игрока  отсутствуют. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва отредактированы',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательства на нарушение от данного игрока  отредактированы. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив семьи (Отказ)',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока недостаточны.Согласно [Color=#ff0000] 2.09 [/color]  пункту общих правил серверов в описании семьи должны быть указаны условия взаимодействия со складом. Если лидер семьи предоставил неограниченный доступ к складу и забыл снять его, администрация не несет ответственности за возможные последствия. Жалобы по данному пункту правил принимаются только от лица лидера семьи. То есть, лидер должен написать жалобу от своего лица, прикрепить видеодоказательство с /time, показать как он заходить в описание семьи, логи взаимодействия со складом семьи и пролистивает до момента нарушения. Жалобы от члена семьи или заместителя лидера семьи не принимаются. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Не по форме',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба составлена не по форме. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет /time',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]На ваших доказательствах отсутствует /time.  <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет time кодов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]На ваших доказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Более 72-х часов',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва загружены не там',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательства загружены в постороннем приложении. Загрузка доказательств в Соц. Сетях и т.п. запрещается, доказательства должны быть загружены исключительно на фото/видео хостинге (YouTube, Yapx, Imgur). <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Условия сделки',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В ваших доказательствах отсутствуют условия сделки. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нужен фрапс',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока недостаточно. В данной ситуации необходим фрапс (запись экрана). <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
    	  title: 'Промотка чата',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока недостаточно, необходим фрапс (запись экрана) + промотка чата. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Фрапс обрывается',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Видео-доказательства обрываются. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва не открываются',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваши доказательства не открываются. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
{
	  title: 'Жалоба от 3-го лица',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/COLOR]<br><br>",
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Ошиблись сервером',
    dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Жалоба закрыта от оффтопа и находится на рассмотрении администрации вашего сервера.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
           {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️RolePlay Биографии✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
          {
        title: ' Отказ (Недостаточно РП информации)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Причина отказа:[/color] Недостаточно РП информации.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=#FF0000]#ff0000[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=##ff0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>",
      prefix: UNACCEPT_PREFIX,
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
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
	  status: false,
},
          {
        title: 'Отказ (Орф и пунктуац ошибки)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
      	"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано Причина отказа:[/color][/color] Орфографические и пунктуационные ошибки.  <br><br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
       {
        title: 'Отказ (Орфографические ошибки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано Причина отказа:[/color] Орфографические ошибки.  <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
       {
        title: 'Отказ (Пунктуационные ошибки)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]]Причина отказа:[/color]Пунктуационные ошибки. <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
        {
        title: 'Отказ (Вымышленные действия персонажа)',
               dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Причина отказа:[/color]Вымышленные действия персонажа <br><br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
       {
        title: 'Отказ (Слишком молод)',
              dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Причина отказа:[/color]Некорректен возраст (слишком молод).<br><br>"+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
          {
        title: 'Отказ (Некоррект национальность)',
                 dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5)',
        content:
        		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
              "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус -[COLOR=#FF0000]Причина отказа:[/color]Некорректная национальность.  <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/COLOR]<br><br>" ,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
              ];
        
    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

      addAnswers();      
      addButton('Свой ответ', 'selectBiographyAnswer', 'border-radius: 13px; margin-right: 5px; margin-left: 5px; margin-bottom: 5px; border: none; background: #483D8B');
      addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5);');
      addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);');
      addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
      addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; margin-bottom: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);');
	// Поиск информации о теме
	const threadData = getThreadData();
 
	$(`button#ff`).click(() => pasteContent(8, threadData, true));
	$(`button#prr`).click(() => pasteContent(2, threadData, true));
	$(`button#zhb`).click(() => pasteContent(21, threadData, true));
	$('button#unaccept').click(() => editThreadData2(UNACCEPT_PREFIX, false));
	$('button#accepted').click(() => editThreadData2(ACCEPT_PREFIX, false));
	$('button#pin').click(() => editThreadData2(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData2(COMMAND_PREFIX, true));
	$('button#watched').click(() => editThreadData2(WATCHED_PREFIX, false));
	$('button#decided').click(() => editThreadData2(DECIDED_PREFIX, false));
	$('button#closed').click(() => editThreadData2(CLOSE_PREFIX, false));
	$('button#closed_complaint').click(() => editThreadData2(CLOSE_PREFIX, false, false));
	$('button#techspec').click(() => editThreadData2(TEX_PREFIX, true));
  
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
          editThreadData(buttons[id].prefix, buttons[id].status, buttons[id].open);
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
        editThreadData(biography[id].prefix, biography[id].status, biography[id].open);
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
  

  function editThreadData(prefix, pin = false, open = false) {
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
  }

    function editThreadData2(prefix, pin = false) {
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
  
  function getFormData(data) {
      const formData = new FormData();
      Object.entries(data).forEach(i => formData.append(i[0], i[1]));
      return formData;
    }
  })();
