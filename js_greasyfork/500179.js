// ==UserScript==
// @name          WHITE | Скрипт для Младших КФ by Jefferson
// @namespace     https://forum.blackrussia.online
// @version       1.0
// @description   Скрипт для Кураторов Форума.
// @author        Tadeo_Jefferson
// @match         https://forum.blackrussia.online/threads/*
// @include       https://forum.blackrussia.online/threads/
// @icon          https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32343-watermelon-icon.png
// @grant         none
// @license       none
// @downloadURL https://update.greasyfork.org/scripts/500179/WHITE%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%BB%D0%B0%D0%B4%D1%88%D0%B8%D1%85%20%D0%9A%D0%A4%20by%20Jefferson.user.js
// @updateURL https://update.greasyfork.org/scripts/500179/WHITE%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9C%D0%BB%D0%B0%D0%B4%D1%88%D0%B8%D1%85%20%D0%9A%D0%A4%20by%20Jefferson.meta.js
// ==/UserScript==

(function () {
    'use strict';
    'esversion 6' ;
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; //  Префикс "Одобрено"
    const PIN_PREFIX = 2; //  Префикс "На рассмотрении"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const TEX_PREFIX = 13; // Префикс "Техническому специалисту"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const WAIT_PREFIX = 14;
    const V_PREFIX = 1;
    const NULL_PREFIX = 15;
    const buttons = [
        {
            title: '--------------------------------------------------------------------РП БИОГРАФИИ-----------------------------------------------------------------------------',
        },
        {
            title: 'Одобрена',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Отказана',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана.[/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Заголовок не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не дополнил' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Неграмотная' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'От 3-его лица' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Уже одобрена' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже была одобрена. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Супергерой' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Копипаст' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'NonRP ник' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)]PLATINUM[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Ник англ.' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Дата рожд. не совп. с годом' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к дата рождения не совпадает с возрастом. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Нет 18 лет' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш персонаж должен быть совершеннолетним. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Семья не полнос.' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша семья расписана не полностью. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Дата рождения не полнос.' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'На доработке',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - биографии недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Мало инфы',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - биографии крайне мало информации.<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.[/COLOR][/SIZE]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Создайте новую тему, дополнив ее новой информацией.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '--------------------------------------------------------------------РП Организации--------------------------------------------------------------------'
        },
        {
            title: 'Одобрено',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не туда' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы не туда попали. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к она составлена не по форме. [/COLOR]<br><br>"+
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Отказ' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'На доработке',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - организации недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title : 'Ник англ.' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Неграмотная' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организаций отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Копипаст' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не дополнил' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Заголовок не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - организаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '--------------------------------------------------------------------РП Ситуации--------------------------------------------------------------------'
        },
        {
            title: 'одобрено',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[/COLOR][/I][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'не туда' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы не туда попали. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'отказ' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана. [/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix:
            UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'На доработке',
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В вашей RolePlay - ситуации недостаточно информации.<br><br>" +
            "Даю вам 24 часа на ее дополнение.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title : 'ник англ' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш все никнеймы должны быть написаны на русском языке. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Неграмотная' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она оформлена неграмотно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Копипаст' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее скопировали у другого человека. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Не дополнил' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к вы ее не дополнили. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title : 'Заголовок не по форме' ,
            content:
            '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/I][/FONT][/COLOR]<br><br>' +
            "[SIZE=4][FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к заголовок оформлен неправильно. [/COLOR]<br><br>" +
            "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе [/COLOR][/I][COLOR=rgb(209, 213, 216)][/COLOR][/FONT][/SIZE]<br><br>" +
            '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA [/I][/COLOR][I][COLOR=rgb(0, 255, 255)][/COLOR][/I][/SIZE][/FONT][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('На рассмотрение', 'pin');
        addButton('Меню', 'selectAnswer');


        // Поиск информации о теме
        const threadData = getThreadData();
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ваш ответ:');
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
        );
    }

    function buttonsMarkup(buttons) {
        return `<div class="select_answer">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:4px"><span class="button-text">${btn.title}</span></button>`,
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
            6 < hours && hours <= 10
            ? 'Доброе утро'
            : 10 < hours && hours <= 18
            ? 'Добрый день'
            : 18 < hours && hours <= 6
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