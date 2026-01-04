

    // ==UserScript==
    // @name         Кураторы форума by K.Kristov
    // @namespace    https://forum.blackrussia.online/
    // @version      4.2
    // @description  Скрипт для КФ на жалобы игроков
    // @author       Kirill_Kristov
    // @match        https://forum.blackrussia.online/threads/*
    // @include      https://forum.blackrussia.online/threads/
    // @grant        none
    // @license      MIT
    // @icon https://img.icons8.com/nolan/452/beezy.png
// @downloadURL https://update.greasyfork.org/scripts/538942/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20KKristov.user.js
// @updateURL https://update.greasyfork.org/scripts/538942/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20by%20KKristov.meta.js
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
    	const buttons = [
    	{
            title: ' ᅠᅠ.... Одобрено ....      ',
            dpstyle: 'oswald: 3px;     color: #fff; background: #41A85F; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    	},
             {
            title: 'На рассмотрении',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба взята [/SIZE][COLOR=rgb(243, 121, 52)][SIZE=4] на рассмотрение[/COLOR], ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
            "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
            "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: PIN_PREFIX,
            status: true,
              },
              {
            title: 'DM',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Читы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Запрещено внесение любых изменений в оригинальные файлы игры.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Разрешено изменение шрифта, его размера и длины чата (кол-во строк).[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Блокировка за включенный счетчик FPS не выдается.[/SIZE][/FONT][/CENTER][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Mass DM',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn / Ban 3 - 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
    {
            title: 'ДБ',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'TK',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'SK',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 60 минут / Warn (за два и более убийства)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'MG',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR][/CENTER][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
            },
    {
            title: 'CAPS',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Flood',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
              '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Политика',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено политическое и религиозное пропагандирование.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
    {
            title: 'Рынок в  ГОСС',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC).[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]ив помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
            },
              {
            title: 'Упом род',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'OOC оск',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Аморал',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] обоюдное согласие обеих сторон.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
               {
            title: 'мат в назв. фам/биз',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 1 день / При повторном нарушении обнуление бизнеса[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'неув к адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |   Mute 180 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
    {
            title: 'выдача за адм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] |   Ban 7 - 15 + ЧС администрации [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Введение в заблуждения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'ooc угрозы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены OOC угрозы, в том числе и завуалированные.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'конфликты ooc и ic',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 7 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'злоуп нарушениями',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Злоупотребление нарушениями правил сервера.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
             {
            title: 'злоуп символами',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Реклама промо',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 30 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]чаты семейные, строительных компаний, транспортных компаний, фракционные чаты, IC, OOC, VIP и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Исключение: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]промокоды, предоставленные разработчиками, а также распространяемые через официальные ресурсы проекта.[/SIZE][/FONT][/COLOR][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Пример: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]если игрок упомянет промокод, распространяемый через официальную публичную страницу ВКонтакте либо через официальный Discord в любом из чатов, наказание ему не выдается.[/SIZE][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Реклама',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
               {
            title: 'Nrp Обман',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]после IC договоренности получить денежные средства и сразу же выйти из игры с целью обмана игрока, или же, договорившись через OOC чат (/n), точно также получить денежные средства и сразу же выйти из игры и тому подобные ситуации[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] разблокировка игрового аккаунта нарушителя будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено (по решению обманутой стороны).[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Nrp Cop',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту правил государственных структур:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оказывать задержание без Role Play отыгровки.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Nrp В/Ч',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту правил нападения на Военскую часть:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]За нарушение правил нападения на Военную Часть .[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Jail 30 минут (NonRP поведение) / Warn (Для сотрудников ОПГ)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Н/П/Р/О',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено писать по своему, не по правилам редактирования..[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                                },
              {
            title: 'Замена объяв',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 7 дней + ЧС организации [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Nrp Поведение',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено поведение, нарушающее нормы процессов Role Play режима игры[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4] Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] ездить на крышах транспортных средств, бегать или ходить по столам в казино, целенаправленная провокация сотрудников правоохранительных органов с целью развлечения, целенаправленная помеха в проведении различных собеседований и так далее.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Nrp AKC',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера.[/COLOR][COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение:[/COLOR][COLOR=rgb(209, 213, 216)] слишком большие аксессуары на голове персонажа, имитация гитарой половых органов и тому подобное.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false
                                                },
              {
            title: 'Долг',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещается брать в долг игровые ценности и не возвращать их. [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 30 дней / permban[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется;[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]при невозврате игровых ценностей общей стоимостью менее 5 миллионов включительно аккаунт будет заблокирован на 30 дней, если более 5 миллионов, аккаунт будет заблокирован навсегда;[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
              "[*][LEFT][CENTER][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] жалоба на игрока, который занял игровые ценности и не вернул в срок, подлежит рассмотрению только при наличии подтверждения суммы и условий займа в игровом процессе, меры в отношении должника могут быть приняты только при наличии жалобы и доказательств. Жалоба на должника подается в течение 10 дней после истечения срока займа. Договоры вне игры не будут считаться доказательствами.[/SIZE][/COLOR][/FONT][/CENTER][/LEFT]<br>" +
                  "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                                                  },
              {
            title: 'Слив Глобального чата',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещены любые формы «слива» посредством использования глобальных чатов.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'Слив склада',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                                },
               {
            title: 'Помеха игровому процессу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.04.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              "[LIST]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]таран дальнобойщиков, инкассаторов под разными предлогами.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                            },
        {
            title: 'Уход от Рп',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.02.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено целенаправленно уходить от Role Play процесса всеразличными способами.[/COLOR][COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] уходить в AFK при остановке транспортного средства правоохранительными органами, выходить из игры для избежания смерти, выходить из игры во время процесса задержания / ареста, полное игнорирование отыгровок другого игрока, которые так или иначе могут коснуться Вашего персонажа и так далее..[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                          },
              {
            title: 'Bagouse',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пытаться обходить игровую систему или использовать любые баги сервера[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Ban 15 - 30 дней / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                                },
              {
            title: 'Bagouse Anim',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещается багоюз связанный с анимацией в любых проявлениях. [/COLOR][COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                                },
              {
            title: 'Фейк',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Устное замечание + смена игрового никнейма / PermBan[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
            status: false,
                                                  },
              {
            title: 'Исп. уяз. правил',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(234, 346, 14, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено пользоваться уязвимостью правил. [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan [/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)]игрок объясняет свою невиновность тем, что какой-либо пункт правил недостаточно расписан, но вина очевидна. Либо его действия формально не нарушают конкретного пункта, но всё же наносят ущерб другим игрокам или игровой системе.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]игрок сознательно берёт долг через трейд, не планируя его возвращать, считая, что по правилам это не считается долгом и наказания не будет.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[/LIST]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: ACCEPT_PREFIX,
                  status: false,
              },

               {
            title: ' ᅠᅠ.... Перенаправление в другой раздел ....      ',
            dpstyle: 'oswald: 3px;     color: #fff; background: #7851A9; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    	},
    	 {
                title: 'Тенхическому Специалисту',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 102, 0)][I][FONT=times new roman][SIZE=4]Техническому Специалисту[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: TEX_PREFIX,
                status: true,
              },
              {
                title: 'В жб на адм',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом перенаправляю вас в жалобы на администрацию.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'В жб на лидеров',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на лидеров - [/I][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.351/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'В жб на Хелперов',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел жалоб на Агентов поддержки - [/I][URL='https://forum.blackrussia.online/index.php?threads/ekb-Жалобы-на-Агентов-Поддержки.4295218/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
            title: 'В жб на сотрудников орг',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в жалобы на сотрудников фракции[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: UNACCEPT_PREFIX,
            status: false,
              },
              {
            title: 'В Обжалования наказания',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 0, 255, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вы ошиблись разделом, обратитесь в раздел Обжалование наказаний - [/I][URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.351/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: UNACCEPT_PREFIX,
            status: false,
              },

               {
            title: ' ᅠᅠ.... Отказано ....      ',
            dpstyle: 'oswald: 3px;     color: #fff; background: #B8312F; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #7851A9',
    	},
        {
            title: 'Недостаточно док-в',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: UNACCEPT_PREFIX,
            status: false,
              },
              {
                title: 'Отсутствуют док-ва',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Не работает док-ва',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваши доказательства не рабочие или же битая ссылка.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Док-ва обрываются',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Док-ва отредакт',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Нужен фрапс',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Док-ва в соц. сетях',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4] Доказательства в соц. сетях не принимаются. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Неполный фрапс',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Видео фиксация не полная либо же нет условий сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Нету time',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]На доказательствах отсутствуют дата и время[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Отсутствуют таймкоды',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Нет условий сделки',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В предоставленных доказательствах отсутствуют условия сделки.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Нарушений нет',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: '2 и более игрока',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба отказана по причине: нельзя писать одну жалобу на двух и более игроков ( на каждого игрока отдельная жалоба)[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'Не по форме',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/'][B][U]««« правилами подачи жалоб на игроков »»»[/U][/B][/URL].[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
            title: 'Ответ был дан ранее',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Вам уже был дан ответ в прошлых жалобах[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
            prefix: UNACCEPT_PREFIX,
            status: false,
              },
              {
                title: 'Прошло 3 дня',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]С моменты нарушения прошло более 72-х часов[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                  "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
                prefix: UNACCEPT_PREFIX,
                status: false,
              },
              {
                title: 'От 3 лица',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Ваша жалоба написана от 3-его лица. Отказано[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                  "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
                prefix: UNACCEPT_PREFIX,
                status: false,
                                },
              {
                title: 'Системный промо',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Данный промокод является системным, или был выпущен  разработчиками[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                  "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/B][/COLOR]",
                prefix: UNACCEPT_PREFIX,
                status: false,
                                },
              {
                title: 'Обман в changeprop',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Нарушений со стороны игрока не было замечено. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]В реальной жизни может произойти абсолютно идентичная ситуация когда при договоре злоумышленник пытается обмануть поменяв условия договора на другие. В окне обмена вы видите все условия и уже сами решаете как пойдет сделка. Соответственно данная ситуация не является NonRp обманом. [/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
              "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,
                                                 },
              {
                title: 'ЖБ не от лидера семьи',
                dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(500, 24, 0, 0.5)',
                content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
                '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
                  "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4]Жалоба на слив семьи принимается только от лидера семьи.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
                  '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
                  "[I][CENTER][SIZE=4][COLOR=rgb(255, 255, 255)]Подавайте на [/COLOR][COLOR=rgb(250, 197, 28)]АП [/COLOR]" +
                  "[I][CENTER][SIZE=4] [URL='https://forum.blackrussia.online/forums/%D0%90%D0%B3%D0%B5%D0%BD%D1%82%D1%8B-%D0%BF%D0%BE%D0%B4%D0%B4%D0%B5%D1%80%D0%B6%D0%BA%D0%B8.3152/']КЛИК[/URL]",
                prefix: UNACCEPT_PREFIX,
                status: false,

              },



    	];

    	$(document).ready(() => {
    	// Загрузка скрипта для обработки шаблонов
    	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    	// Добавление кнопок при загрузке страницы
    	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
        addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
        addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
    	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
    	addAnswers();

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

