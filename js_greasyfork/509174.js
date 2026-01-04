// ==UserScript==
// @name         Скрипт для личного использования
// @namespace    http://tampermonkey.net/
// @version      1.33
// @description  Создатель - https://vk.com/ahiko.hagiwara, при нахождение багов/ошибок, просьба отписать
// @author       Luffy_Luxury
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://icons.iconarchive.com/icons/gartoon-team/gartoon-action/256/help-about-star-fav-icon.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/509174/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/509174/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%BB%D0%B8%D1%87%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%B8%D1%81%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
  const FAIL_PREFIX = 4;
  const OKAY_PREFIX = 8;
  const WAIT_PREFIX = 2;
  const TECH_PREFIX = 13;
  const WATCH_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const UNACCСEPT_PREFIX = 4;
  const PIN_PREFIX = 2;
  const ACCСEPT_PREFIX = 8;
  const RESHENO_PREFIX = 6;
  const PINN_PREFIX = 2; 
  const GA_PREFIX = 12; 
  const COMMAND_PREFIX = 10;
  const WATCHED_PREFIX = 9;
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
 
  const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Courier New'">`
  const END_DECOR = `</span></div>`
 
 
  const buttons = [
  {
       title: '---------- by Luffy Luxury ----------'
    },
   {
       title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴🏆Одобрение жалобы️🏆╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
    },


 {
            title: 'Салам',
            content:
            "[CENTER][url='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9wb3N0aW1hZ2VzLm9yZy8='][IMG]https://i.postimg.cc/k4v4QhH8/f-Yg51po-1.gif[/img][/url][/CENTER]<br>"+
            "[CENTER][url='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9wb3N0aW1hZ2VzLm9yZy8='][IMG]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>"+
            "[CENTER][FONT=Verdana] Доброго времени суток, уважаемый(-ая)  {{ user.name }}.[/FONT][/CENTER]<br><br>"+
            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]<br>"+
            "[CENTER][FONT=Verdana] текст [/FONT][/CENTER]<br>"+
            "[CENTER][url='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9wb3N0aW1hZ2VzLm9yZy8='][IMG]https://i.ibb.co/rF87DNV/23e304932c71453a.png[/img][/url][/CENTER]<br>"+
            "[CENTER][url='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9wb3N0aW1hZ2VzLm9yZy8='][IMG]https://i.postimg.cc/k4v4QhH8/f-Yg51po-1.gif[/img][/url][/CENTER]<br>"+
            "[CENTER][url='https://forum.blackrussia.online/redirect?to=aHR0cHM6Ly9wb3N0aW1hZ2VzLm9yZy8='][IMG]https://i.postimg.cc/Cx0NL6LX/35f8f9f31713830146a83ec1450f9d9809bcc85dr1-500-280-hq.gif[/img][/url][/CENTER]<br>"+''
            
        },

   {
	  title: 'DM',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		 "[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
         "[B][CENTER][FONT=times new roman][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
   },
    {
	  title: 'DB',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][FONT=times new roman][Color=#ff0000]2.13.[/color] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#ff0000]| Jail 60 минут[/color].[/COLOR]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'RK',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.14.[/color] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'TK',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'SK',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.16.[/color] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#ff0000]| Jail 60 минут / Warn (за два и более убийства)[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'PG',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.17.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Mass DM',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.20. [/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#ff0000]| Warn / Ban 3 - 7 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: 'помеха работе игрокам',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.04. [/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [Color=#ff0000] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)   [/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
              {
      title: 'NonRP Обман',
      content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.05. [/color] . Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#ff0000] | PermBan [/color].[/COLOR][/CENTER][/B]<br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
           '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: 'NonRP Поведение',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.01.[/color] Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
       prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Drive',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.03.[/color] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
              {
      title: 'Сторонне ПО',
      content:
 
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками  [Color=#ff0000] | Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
           '[CENTER][CENTER][FONT=times new roman][COLOR=#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
{
	  title: 'Розыск без причины',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено выдавать розыск без Role Play причины[Color=#ff0000]| Warn // Jail 30[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Штраф без причины',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено выдавать штраф без Role Play причины [Color=#ff0000]| Warn // Jail 30[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Права без причины',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено отбирать водительские права без Role Play причины [Color=#ff0000]| Warn // Jail 30[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Права в погоне',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено отбирать водительские права во время погони за нарушителем [Color=#ff0000]| Warn // Jail 30[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Одиночный патруль',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.11.[/color] Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обыск без отыгровки // причины',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено проводить обыск игрока без Role Play отыгровки и причины[Color=#ff0000]| Warn[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Задержаниие без отыгровки',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Нарушитель буден наказан по следующему пункту правил государственных структур:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено оказывать задержание без Role Play отыгровки | Warn [Color=#ff0000]| [/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
	  title: 'NonRP Коп',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000][/color] Запрещено оказывать задержание без Role Play отыгровки [Color=#ff0000]| Warn .[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
         '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP ВЧ',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Warn[/color].<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP ВЧ (Гражданский)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан за нарушение правил нападения на воинскую часть [Color=#ff0000]| Jail 30 минут[/color].<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Огр. // Похищение',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][/COLOR][COLOR=rgb(209, 213, 216)]Нарушение одного из пунктов Общих правил ограблений и похищений | Jail (от 10 до 60 минут) // Warn // Ban[/COLOR]<br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Уход от RP',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
},
 
{
	  title: 'RP отыгровки в свою сторону',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.06.[/color] Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Аморал',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.08.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#ff0000]| Jail 30 минут / Warn[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Затягивание RP',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.12.[/color] Запрещено целенаправленное затягивание Role Play процесса [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP Nick',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.06.[/color] Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#ff0000]| Устное замечание + смена игрового никнейма[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Oск. Nick',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.09.[/color] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Fake',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]4.10.[/color] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#ff0000]| Устное замечание + смена игрового никнейма / PermBan[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Уход от наказания',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][Spoiler][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.34.[/color] Запрещен уход от наказания [Color=#ff0000]| Ban 15 - 30 дней[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Злоуп. наказаниями',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.39.[/color] Злоупотребление нарушениями правил сервера [Color=#ff0000]| Ban 7 - 30 дней[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'ЕПП',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.47.[/color] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#ff0000]| Jail 60 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
         prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Арест на аукционе',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.50.[/color] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#ff0000]| Ban 7 - 15 дней + увольнение из организации[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP аксессуар',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.52.[/color] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера [Color=#ff0000]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Мат в названии Бизнеса',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.53.[/color] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#ff0000]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Багоюз анимации',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.55.[/color] Запрещается багоюз связанный с анимацией в любых проявлениях [Color=#ff0000]| Jail 60 / 120 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Тим Мертв. рука',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.56.[/color] Запрещается объединение в команду между убийцей и выжившим на мини-игре «Мертвая рука» [Color=#ff0000]| Jail 30 минут[/color].[/COLOR]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Работа в форме',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.07.[/color] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Казино в форме',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.13.[/color] Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Т/С в личных целях',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]1.08.[/color] Запрещено использование фракционного транспорта в личных целях [Color=#ff0000]| Jail 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Редактирование в личных целях',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
        "[B][CENTER][COLOR=lavender][FONT=times new roman][Color=#ff0000]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#ff0000]| Ban 7 дней + ЧС организации[/color].[/COLOR][/CENTER][/B]<br><br>"+
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️На рассмотрение✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
      {
	  title: 'На рассмотрении',
	  content:
 
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба взята на рассмотрение, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][COLOR=#ffff00]На рассмотрении.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	  prefix: PIN_PREFIX,
	  status: true,
},
{
    	  title: 'Передано ГКФ-у',
	  content:
 
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба передана Главному Куратору Форума, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][FONT=times new roman][COLOR=#ffff00]На рассмотрении.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
},
{
	  title: 'Передано Тех. спецу',
	  content:
 
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба передана Техническому Специалисту, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#0000ff]Техническому Специалисту.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
},
{
	  title: 'Передано ГА',
	  content:
 
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба передана Главному Администратору, пожалуйста ожидайте ответа и не нужно создавать повторные темы.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Главному Администратору.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
	  prefix: GA_PREFIX,
	  status: true,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Жалобы для ГКФ✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
 
},
{
	  title: 'Оскорбление // Упом. родни',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оскорбление',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]3.03.[/color] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. Адм',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#ff0000]| Mute 180 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. проекта',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.40.[/color] Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#ff0000]| Mute 300 минут / Ban 30 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'CapsLock',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Flood',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
         prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Meta Gaming',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Политическая // Религ. пропоганда',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.18.[/color] Запрещено политическое и религиозное пропагандирование [Color=#ff0000]| Mute 120 минут / Ban 10 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Н/ПРО',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]4.01.[/color] Запрещено редактирование объявлений, не соответствующих ПРО [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Объявления в ГОСС',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.22.[/color] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Выдача себя за администратора',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [Color=#ff0000]| Ban 7 - 15 + ЧС администрации[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Реклама промо',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.21.[/color] ЗЗапрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах [Color=#ff0000]| Ban 30 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Продажа промо',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.43.[/color] Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#ff0000]| Mute 120 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'OОC угрозы',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
 		"[B][CENTER][FONT=times new roman][COLOR=lavender][FONT=times new roman][Color=#ff0000]2.37.[/color] Запрещены OOC угрозы, в том числе и завуалированные [Color=#ff0000]| Mute 120 минут / Ban 7 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Попытка ПИВ',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.28.[/color] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги [Color=#ff0000]| PermBan с обнулением аккаунта + ЧС проекта[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обман администрации',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.32.[/color] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
         "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Обход системы',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.21.[/color] Запрещено пытаться обходить игровую систему или использовать любые баги сервера [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Разговор не на русском',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#ff0000]| Устное замечание / Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
        tile: 'Мат в Vip Chat',
    contenrt:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.23.[/color] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
    prefix: ACCСEPT_PREFIX,
    status: false,
},
{
	  title: 'Злоуп. символами',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.06.[/color] Запрещено злоупотребление знаков препинания и прочих символов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. секс. характера',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.07.[/color] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив гл. чата (СМИ)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.08.[/color] Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#ff0000]| PermBan[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Угроза о наказании от Адм.',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.09.[/color] Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Ввод в заблуждение командами',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Транслит',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.20[/color] Запрещено использование транслита в любом из чатов [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'NonRP эфир',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
 		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]4.02.[/color] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#ff0000]| Mute 30 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив склада',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]2.09.[/color] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#ff0000]| Ban 15 - 30 дней / PermBan[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Музыка в Voice',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.14.[/color] Запрещено включать музыку в Voice Chat [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Оск. // Упом родни в Voice',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
 		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.15.[/color] Запрещено оскорблять игроков или родных в Voice Chat [Color=#ff0000]| Mute 120 минут / Ban 7 - 15 дней[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Шумы в Voice',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.16.[/color] Запрещено создавать посторонние шумы или звуки [Color=#ff0000]| Mute 30 минут[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Реклама в Voice',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.17.[/color] Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#ff0000]| Ban 7 - 15 дней[/color].[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Изменение голоса софтом',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Игрок будет наказан по следующему пункту правил:<br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender][Color=#ff0000]3.19.[/color] Запрещено использование любого софта для изменения голоса [Color=#ff0000]| Mute 60 минут[/color].[/COLOR][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Перенаправление жалоб✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
	  title: 'В ЖБ на Адм.',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на администрацию». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на ЛД',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на лидеров». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В обжалования',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Обжалование наказаний». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В тех. раздел',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в технический раздел. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на тех. спец.',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел «Жалобы на технических специалистов». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'В ЖБ на СС',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись разделом. Обратитесь в раздел соответствующей фракции в «Жалобы на Старший Состав». <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Отказ в жалобе✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
{
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Нарушений со стороны данного игрока не было найдено. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
      {
	  title: 'Логи не позволяют чекнуть',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Cистема Логирования не позволяет выявить нарушения от игрока. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
           {
	  title: ' В логах нету нарушений',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Проверив систему Логирования, нарушения не были выявлены. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Наказание уже выдано',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Наказание уже было выдано. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
    title: 'Дубликат жалобы',
      content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Данная жалоба - дубликат вашей прошлой жалобы.[/COLOR][/FONT][/CENTER][/B]<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
{
      title: 'Разные ники',
      content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]НикНеймы в жалобе и доказательствах отличаются.[/COLOR][/FONT][/CENTER][/B]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
},
{
	  title: 'Возврат средств',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Недостаточно док-в',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока  недостаточно. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Отсутствуют док-ва',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательства на нарушение от данного игрока  отсутствуют. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва отредактированы',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательства на нарушение от данного игрока  отредактированы. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Слив семьи (Отказ)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Слив семьи никак не относится к правилам проекта, то есть если Лидер семьи дал игроку роль заместителя, то только он за это и отвечает, Администрация сервера не несет за это ответственность. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Не по форме',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба составлена не по форме. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет /time',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]На ваших доказательствах отсутствует /time.  <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нет time кодов',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]На ваших доказательствах отсутствуют time коды. Если видео длится больше 3-ех минут - Вы должны указать time коды нарушений. <br><br>"+
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Более 72-х часов',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]С момента совершенного нарушения со стороны игрока прошло более 72 часов. Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва загружены не там',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательства загружены в постороннем приложении. Загрузка доказательств в Соц. Сетях и т.п. запрещается, доказательства должны быть загружены исключительно на фото/видео хостинге (YouTube, Yapx, Imgur). <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Условия сделки',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В ваших доказательствах отсутствуют условия сделки. <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Нужен фрапс',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока недостаточно. В данной ситуации необходим фрапс (запись экрана). <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
    	  title: 'Промотка чата',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Доказательств на нарушение от данного игрока недостаточно, необходим фрапс (запись экрана) + промотка чата. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Фрапс обрывается',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Видео-доказательства обрываются. Загрузите полную видеозапись на видео-хостинг YouTube. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Док-ва не открываются',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваши доказательства не открываются. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
	  title: 'Жалоба от 3-го лица',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша жалоба написана от 3-го лица. Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на игроков, закрепленные в данном разделе.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Закрыто.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
     prefix: CLOSE_PREFIX,
	  status: false,
},
{
	  title: 'Ошиблись сервером',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ff0000]Жалоба закрыта от оффтопа и находится на рассмотрении администрации вашего сервера.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: OJIDANIE_PREFIX,
	  status: false,
},
  {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️RolePlay Биографии✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
},
    {
      title: 'На доработку',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей RolePlay - биографии недостаточно информации. Даю вам 24 часа на ее дополнение/ исправление, иначе РП биография будет отказана.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=lavender] <br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На рассмотрении..[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
},
 
{
      title: 'Биография одобрена',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу RolePlay биографию я готов вынести вердикт.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
'[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Не по форме)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография написана не по форме.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Не заполнена)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Форма RolePlay биографии не заполнена частично либо вовсе не заполнена.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Мало информации)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Недостаточное количество RolePlay информации о вашем персонаже. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Скопирована)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография скопирована. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Заголовок)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вашей RolePlay биографии не верный заголовок. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (От 1-го лица)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография написана от 1-го лица. <br><br>"+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
          {
        title: 'Недостаточно РП информации',
        content:
    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][FONT=times new roman]Причина отказа: [COLOR=#FF0000]Недостаточно РП информации.[/CENTER]<br><br>" +
     '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
{
  	  title: 'Отказ (Возраст не совпал)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Возраст не совпадает с датой рождения. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
{
      title: 'Отказ (Ошибки)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей RolePlay биографии присутствуют грамматические либо пунктуационные ошибки. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
          {
        title: 'Орф и пунктуац ошибки',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано. <br><br>"+
        '[CENTER][FONT=times new roman]Причина отказа: [COLOR=#FF0000]Орфографические и пунктуационные ошибки.[/B][/COLOR]' +
        "[B][CENTER][FONT=times new roman] [/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: OTKAZBIO_PREFIX,
 
      status: false,
    },
        {
        title: 'Вымышленные действия персонажа',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано. <br><br>"+
        '[CENTER][FONT=times new roman]Причина отказа: [COLOR=#FF0000]Вымышленные действия персонажа[/B][/COLOR]' +
        "[B][CENTER][FONT=times new roman] [/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
      {
        title: 'Слишком молод',
        content:
        "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
          "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.<br><br>"+
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman]Причина отказа:[COLOR=#FF0000]Некорректен возраст (слишком молод).[/CENTER]<br><br>" +
          '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
 
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
          {
        title: 'Некоррект национальность',
        content:
        		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
              "[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус -[COLOR=#FF0000]Отказано. <br><br>"+
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
 "[B][CENTER][FONT=times new roman] [COLOR=#FF0000] Причина отказа: [COLOR=#FF0000]Некорректная национальность.[/CENTER]<br><br>" +
              '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
{
      title: 'На дополнение',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша RolePlay биография нарушает правила подачи RolePlay биографий. У вас есть 24 часа на на исправление своей биографии.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На дополнении.[/CENTER]<br><br>" +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
     prefix: PIN_PREFIX,
	  status: true,
 
 
         title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️Неофициальные RP организации✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
    },
    {
      title: ' Неофицальной RolePlay организации одобрена',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу  неофицальной RolePlay организации я готов вынести вердикт.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Не по форме)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша Неофицальной RolePlay организации написана не по форме .<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Скопирована)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша Неофицальной RolePlay организации скопирована. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Ошибки)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей Неофицальной RolePlay организации присутствуют грамматические либо пунктуационные ошибки. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'На дополнение',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша Неофицальной RolePlay организации нарушает правила подачиНеофицальной RolePlay организации. У вас есть 24 часа на на исправление своей Неофицальной RolePlay организации.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На дополнении.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
        },
    {
      title: 'Отказ (Заголовок)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вашей Неофицальной RolePlay организации не верный заголовок. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Не заполнена)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Форма Неофицальной RolePlay организации не заполнена частично либо вовсе не заполнена.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
},
    {
      title: 'Отказ (Мало информации)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Недостаточное количество  Неофицальной RolePlay организации информации о вашем персонаже. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX, 
	  status: false,
},
      {
       title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴✅️РП ситуации✅️╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴'
    },
    {
      title: ' Неофицальной RolePlay организации одобрена',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Рассмотрев вашу  РП ситуации я готов вынести вердикт.<br><br>"+
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]Одобрено.[/COLOR]<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Не по форме)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша РП ситуации написана не по форме .<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Скопирована)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша РП ситуации скопирована. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Ошибки)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]В вашей РП ситуации присутствуют грамматические либо пунктуационные ошибки. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'На дополнение',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Ваша РП ситуации нарушает правила подачиНеофицальной RolePlay организации. У вас есть 24 часа на на исправление своей Неофицальной RolePlay организации.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#ccff00]На дополнении.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: PIN_PREFIX,
	  status: true,
        },
    {
      title: 'Отказ (Заголовок)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]У вашей РП ситуации не верный заголовок. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Не заполнена)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Форма РП ситуации не заполнена частично либо вовсе не заполнена.<br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
    {
      title: 'Отказ (Мало информации)',
	  content:
		"[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][FONT=times new roman][COLOR=lavender]Недостаточное количество  Неофицальной RolePlay организации информации о вашем персонаже. <br><br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][FONT=times new roman][COLOR=#FF0000]Отказано.[/CENTER]<br><br>" +
        '[CENTER][CENTER][FONT=times new roman][COLOR=	#ffc6b4]Приятного время проведения на сервере Vladimir[/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
},
 
 
  ];
 
  const tasks = [
      {
        title: 'В архив',
        prefix: 0,
        move: 3494,
      },
      {
        title: 'В одобренные био пока не работает',
        prefix: OKAY_PREFIX,
        move: 3487,
      },
      {
        title: 'Био на доработку пока не работает',
        prefix: WAIT_PREFIX,
        move: 1662,
      },
      {
        title: 'В отказанные био пока не работает',
        prefix: FAIL_PREFIX,
        move: 1663,
      },
      {
        title: 'В одобренные ситуации пока не работает',
        prefix: OKAY_PREFIX,
        status: false,
        move: 1658,
      },
      {
        title: 'Ситуацию на доработку пока не работает',
        prefix: WAIT_PREFIX,
        status: false,
        move: 1659,
      },
      {
        title: 'В отказанные ситуации пока не работает',
        prefix: FAIL_PREFIX,
        status: false,
        move: 1660,
      },
      {
        title: 'В одобренные организации пока не работает',
        prefix: OKAY_PREFIX,
        status: false,
        move: 1651,
      },
      {
        title: 'Организацию на доработку пока не работает',
        prefix: WAIT_PREFIX,
        status: false,
        move: 1652,
      },
      {
        title: 'В отказанные организации пока не работает',
        prefix: FAIL_PREFIX,
        status: false,
        move: 1653,
      },
      {
        title: 'Вам в Жалобы на администрацию',
        prefix:FAIL_PREFIX,
        status: false,
        move: 3482,
      },
      {
        title: 'Вам в Жалобы на лидеров',
        prefix: FAIL_PREFIX,
        status: false,
        move: 3483,
      },
       {
        title: 'Вам в Обжалование наказаний',
        prefix: FAIL_PREFIX,
        status: false,
        move: 3485,
      },
  ];
  
  $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
      addButton('Одобрено✅', 'accepted')
      addButton('Отказано❌', 'unaccept','border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
      addButton('На рассмотрение ⏳', 'pin');
      addButton('Га 🐰', 'Ga');
      addButton('Тех. Специалисту 🤸‍♂️', 'Texy');
      addButton('Рассмотрено 🤹‍♀️', 'Rasmotreno');
      addButton('『Автоматический ответ』', 'selectAnswer');
  
      // Поиск информации о теме
      const threadData = getThreadData();
  
   $('button#pin').click(() => editThreadData(0, WAIT_PREFIX, true));
   $('button#tech').click(() => editThreadData(0, TECH_PREFIX, true));
   $('button#accepted').click(() => editThreadData(0, OKAY_PREFIX, false));
   $('button#watch').click(() => editThreadData(0, WATCH_PREFIX, false));
   $('button#close').click(() => editThreadData(0, CLOSE_PREFIX, false));
   $('button#unaccept').click(() => editThreadData(0, FAIL_PREFIX, false));
    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
     $('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
     $('button#pin').click(() => editThreadData(WAIT_PREFIX, true));
  
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
 
   function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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
	4 < hours && hours <= 11
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
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
	if(pin == 123){
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
 
function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
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
 
})();