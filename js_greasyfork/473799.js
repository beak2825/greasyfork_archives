// ==UserScript==
// @name         AZURE//Скрипт для Рп Биографий.
// @namespace    https://forum.blackrussia.online
// @version      10.1
// @description  Мой
// @author       Danya
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/473799/AZURE%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%BF%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/473799/AZURE%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%A0%D0%BF%20%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.meta.js
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
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [
    {
      title: '—————————————————————————>Прочие<—————————————————————————',
    },
    {
title: 'Передать ГКФ/ЗГКФ',
	  content:
		'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
		"[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваша Рп Биография переадрисована ГКФ/ЗГКФ [/SIZE][/FONT][/COLOR][/I]<br><br>" +
        "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Не создавайте темы подобного формата, иначе ваш аккаунт будет заблокирован. [/SIZE][/FONT][/COLOR][/I]<br><br>" +
		'[COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]На рассмотрение.[/SIZE][/FONT][/COLOR][/CENTER]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
    {
title: 'Биография на дороботку',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][COLOR=rgb(209, 213, 216)][FONT=times new roman]Ваша Рп Биография взята на рассмотрение.[/FONT][/COLOR][/SIZE]<br>" +
        '[SIZE=4][FONT=times new roman][COLOR=rgb(209, 213, 216)]Не нужно создавать копии этой Рп Биографии.[/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Биография одобрена',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][SIZE=4][FONT=times new roman]Ваша Рп Биография получила статус.[/FONT][/SIZE]<br>" +
        '[FONT=times new roman][COLOR=rgb(0, 255, 0)][SIZE=4][I]Одобрено.[/I][/SIZE][/COLOR][/FONT][/I][/COLOR][/CENTER]',
	      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '—————————————————————————>Подробные отказы<—————————————————————————',
     },
    {
      title: 'Не по форме',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Ваша Рп Биография составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
         ',[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
      title: 'Дублирована',
	  content:
		'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
		"[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваша Рп Биография уже находится на даработке/дублирована не имеющая не каких изменений. Если вы будете продолжать, ваш аккаунт будет заблокирован. [/SIZE][/FONT][/COLOR][/I]<br><br>" +
		'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано.[/SIZE][/FONT][/COLOR][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
      title: 'Ошибки в словах',
	  content:
		'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый игрок.[/SIZE][/FONT][/COLOR]<br><br>' +
		"[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Вашей Рп Биографии имеются грамматические ошибки.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
		'[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Отказано.[/SIZE][/FONT][/COLOR][/CENTER]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
   {
	  title: '—————————————————————————>Отказ по пунктам<—————————————————————————',
    },
   {
title: 'Нарушение пункт 1',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется грамматические ошибки/не по форме в пункте 1. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 2',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется грамматические ошибки/не по форме/Нету логики в пункте 2. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 3',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется грамматические ошибки/не по форме/Мало информации/Нету логики в пункте 3. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 4',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется грамматические ошибки/не по форме/Мало информации/Нету логики в пункте 4. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 5',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется грамматические ошибки/не по форме/Мало информации/Нету логики в пункте 5. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 6',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется грамматические ошибки/не по форме/Мало информации/Нету логики в пункте 6. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 7',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется не по форме/Мало информации/Нету логики в пункте 7. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 8',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется не по форме/Мало информации/Нету логики/Не развернута дата в пункте 8. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 9',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется Мало информации/Нету логики в пункте 9. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 10',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется не по форме/Мало информации/Нету логики в пункте 10. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 11',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется Мало информации/Нету логики в пункте 11. [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 11.1',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется Мало информации/Нету логики/грамматические ошибки в пункте 11.1 [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 11.2',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется Мало информации/Нету логики/грамматические ошибки в пункте 11.2 [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
   {
title: 'Нарушение пункт 11.3',
      content:
        '[CENTER][FONT=times new roman][SIZE=4][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый игрок.[/COLOR][/SIZE][/FONT]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Вашей Рп Биографий имеется Мало информации/Нету логики/грамматические ошибки в пункте 11.3 [/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила Рп Биографии. - https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    ];

 $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить', 'accepted');
	addButton('Отказать', 'unaccept');
	addButton('На рассмотрение', 'pin');
	addButton('Рассмотрено', 'watched');

    // Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
}

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();