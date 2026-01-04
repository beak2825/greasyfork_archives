// ==UserScript==
// @name         Кураторы форума by N Darkness
// @namespace    https://forum.blackrussia.online/
// @version      1.2.5
// @description  Скрипт для Кураторов форума на ответы на жалобы игроков | Black Russia OMSK
// @author       Nekoglai Darkness
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/472709/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20N%20Darkness.user.js
// @updateURL https://update.greasyfork.org/scripts/472709/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20N%20Darkness.meta.js
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
             {
           title: '_________________________________RolePlay биографии________________________________________',
          },
          {
           title: 'Одобрена',
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография получает статус: [COLOR=rgb(0,255,0)]Одобрено[COLOR=rgb(209,213,216)].[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/T3cg5HBn/di-9TOO.gif[/img][/url]',
           prefix: ACCEPT_PREFIX,
           status: false,
          },
          {
           title: 'Отказана',
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay биография получает статус: [COLOR=rgb(255,0,0)]Отказано[COLOR=rgb(209,213,216)].[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
            title: 'Дополните информацию',
            content:
            '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
             "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана, Добавьте больше информации в новой RolePlay биографии.[/COLOR]<br><br>" +
             "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
             "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0,250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
             '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
            prefix: UNACCEPT_PREFIX,
            status: false,
           },
          {
           title : 'Заголовок не по форме'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Не по форме'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Не дополнил'  ,
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0,250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[img][/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Неграмотная'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(255,255,255)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'От 3-его лица'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Уже одобрена'  ,
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже была одобрена. [/COLOR]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0,250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'Супергерой'  ,
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0,250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title: 'Копипаст',
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее скопировали у другого человека.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0,250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'нонрп ник'  ,
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0,250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'ник англ'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'дата рождения с годом'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к дата рождения не совпадает с возрастом. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Вниматльно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'семья не полнос.'  ,
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша семья расписана не полностью. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'дата рождения не полнос.'  ,
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
           prefix: UNACCEPT_PREFIX,
           status: false,
          },
          {
           title: 'На доработке',
           content:
           '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - биографии недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250,154)]OMSK[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>",
           prefix: PIN_PREFIX,
           status: true,
          },
          {
           title: '_________________________________RolePlay организации________________________________________'
          },
          {
           title: 'одобрено',
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay организация получает статус: [COLOR=rgb(0,255,0)]Одобрено[COLOR=rgb(209,213,216)].[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]'+
            '[url=https://postimages.org/][img]https://i.postimg.cc/T3cg5HBn/di-9TOO.gif[/img][/url]',
           prefix: ACCEPT_PREFIX,
           status: false,
          },
          {
           title : 'не туда'  ,
           content:
           '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы не туда попали. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
           prefix: UNACCEPT_PREFIX,
           status: false,
         },
         {
          title : 'не по форме'  ,
          content:
          '[COLOR=rgb(0, 250,154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к она составлена не по форме. [/COLOR]<br><br>"+
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'отказ'  ,
          content:
          '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay организация получает статус: [COLOR=rgb(255,0,0)]Отказано[COLOR=rgb(209,213,216)].[/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]' +
             '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: 'На доработке',
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - организации недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
           '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
         },
         {
          title : 'ник англ'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Неграмотная'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организаций отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Копипаст'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Не дополнил'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Заголовок не по форме'  ,
          content:
          '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]'+
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: '_________________________________RolePlay ситуации________________________________________'
         },
         {
          title: 'одобрено',
          content:
          '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay ситуация получает статус: [COLOR=rgb(0,255,0)]Одобрено[COLOR=rgb(209,213,216)].[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]' +
            '[url=https://postimages.org/][img]https://i.postimg.cc/T3cg5HBn/di-9TOO.gif[/img][/url]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'не туда'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы не туда попали. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]'+
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'не по форме'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]'+
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'отказ'  ,
          content:
          '[COLOR=rgb(0, 250, 154)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый [COLOR=rgb(255,255,255)]{{ user.name }}[COLOR=rgb(0, 250, 154)].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay ситуация получает статус: [COLOR=rgb(255,0,0)]Отказано. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на [COLOR=rgb(255,0,0)]BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 250, 154)]OMSK[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]' +
            '[url=https://postimages.org/][img]https://i.postimg.cc/5yXxXFLR/cMT3Vgp.gif[/img][/url]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: 'На доработке',
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
         },
         {
          title : 'ник англ'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Неграмотная'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Копипаст'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Не дополнил'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Заголовок не по форме'  ,
          content:
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
          prefix: UNACCEPT_PREFIX,
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
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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