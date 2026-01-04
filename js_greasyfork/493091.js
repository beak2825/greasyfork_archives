// ==UserScript==
// @name         Script for GKF and ZGKF
// @namespace    https://forum.blackrussia.online/
// @version      1.0.1
// @description  По всем вопросам: https://vk.com/the_heag
// @author       Dreamy_Crazy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://imgur.com/gallery/TcnHVHe
// @downloadURL https://update.greasyfork.org/scripts/493091/Script%20for%20GKF%20and%20ZGKF.user.js
// @updateURL https://update.greasyfork.org/scripts/493091/Script%20for%20GKF%20and%20ZGKF.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const DORABOTKA_PREFIX = 3; // доработка
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
	const NO_PREFIX = 0;
	const buttons = [
          {
          title: 'Предложения по улучшению - @the_heat',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Основное⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
             title: 'Одобрено',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография получает статус: [/SIZE][/FONT][/I][/COLOR]<br>[COLOR=rgb(152, 251, 152)][I][FONT=times new roman][SIZE=4]ОДОБРЕНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
             prefix: ACCEPT_PREFIX,
             status: false,
           },
           {
             title: 'Передать ГКФ/ЗГКФ',
             dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
             content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
             "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография передана на рассмотрение [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ГКФ/ЗГКФ.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br>[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать новые биографии, иначе ваш форумный аккаунт будет заблокирован. [/SIZE][/FONT][/CENTER][/I][/COLOR]<br><br>" +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
             prefix: PIN_PREFIX,
             status: false,
          },
          {
            title: 'Заголовок не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Заголовок вашей RolePlay Биографии написан не по форме.<br>Пожалуйста, ознакомьтесь с темой [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/']Правила создания RolePlay биографии[/URL].<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не по форме',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана не по форме.<br>Пожалуйста, ознакомьтесь с темой [URL='https://forum.blackrussia.online/threads/azure-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-roleplay-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B8.5829805/']Правила создания RolePlay биографии[/URL].<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Плагиат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография полностью/частично скопирована у другого человека.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'На доработку',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография взята на доработку.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас есть 24 часа, чтобы дополнить свою RP Биографию.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[I][CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрении...[/SIZE][/CENTER][/COLOR]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: DORABOTKA_PREFIX,
            status: true,
          },
          {
            title: 'Не доработали',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вы никак не доработали свою RolePlay Биографию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀Недостаточно информации⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'В пункте детство недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Детство" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте юность недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Юность" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте взрослая жизнь недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте "Взрослая жизнь" недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте 11.1 и 11.2 недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 11.1 и 11.2 недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте 11.2 и 11.3 недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 11.2 и 11.3 недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте 11.1 и 11.3 недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 11.1 и 11.3 недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Во всех пунктах недостаточно инфы',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Во всех пунктах недостаточно информации.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Нету логики⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'В пункте 11.1 нет логики',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 11.1 нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте 11.2 нет логики',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 11.2 нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'В пункте 11.3 нет логики',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            '[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 11.3 нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 1⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'NonRP никнейм',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вас NonRP никнейм в заголовке биографии.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Имя в заголовке и пункте 1 отличается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В заголовке вашей биографии и пункте 1 имена отличаются.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Имя в пункте 1 и 11.1 отличается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пунктах 1 и 11.1 имена разные, соответственно нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Фамилия в заголовке и пункте 1 отличается',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В заголовке вашей биографии и пункте 1 фамилии отличаются.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'У персонажа не то отчество',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Отчество вашего персонажа не соответствует имени отца.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'У персонажа нет отчества',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Отчество вашего персонажа отсутствует, а значит это должно быть обыграно в вашей биографии.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'У персонажа другая фамилия',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]У вашего персонажа отличается фамилии от остальных родственников, если он её менял, то вы должны расписать это со всеми подробностями.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 2⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Даты рождения отличаются',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 2 и 11.1 даты рождения отличаются.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не совпадает дата рождения с возрастом',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии не совпадает дата рождения с возрастом.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Места рождения не совпадают',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Место рождения в пункте 11.1 отличается от места рождения в пункте 2.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дата рождения не полностью',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии дата рождения написана не полностью.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 3⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
         {
            title: 'Семья не полностью расписана',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии семья расписана не полностью, причина отсутствия одного из родителей должно быть расписана со всеми подробностями.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неполная информация про родителей',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В вашей RolePlay Биографии информация про родителей должна быть расписана со всеми подробностями.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Укажите ФИО родителей',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 3 укажите Ф.И.О родителей вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Информация про других родственников',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 3 указаны не только родители, соответственно биография написана не по форме.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 4⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не отучился на образование в пункте 4',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункты 4 и 11.3 противоречат друг другу, соответственно нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 8⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не служил в армии',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваш персонаж обязан отслужить в армии максимум 1 год, если он служит по контракту/не может по состоянию здоровья, то обыграйте это в своей биографии.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не в том возрасте пошел в армию',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваш персонаж начал служить ранее или позднее 18-ти лет, соответственно нет логики.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 10⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Укажите ФИО супруги',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 10 укажите Ф.И.О супруги вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
{
            title: 'Укажите ФИО детей',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 10 укажите Ф.И.О детей вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет инфы о супруге',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 10 напишите краткую информацию о супруге вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нет инфы о детях',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 10 напишите краткую информацию о детях вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Пункт 10 не соответствует пунктам 11.1, 11.2, 11.3',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Информация о вашей семье/детях в пунктах 11.1, 11.2, 11.3 отличается от указанной информации в пункте 10.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 11⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'В хобби написана труд. деятельность',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункт 11 написан не по форме, внимательно прочитайте правила РП Биографии в закрепленные в данном разделе.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀Проблемы с грамматикой⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Грамматические ошибки',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана неграмотно.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[LIST]<br>" +
            "[*][LEFT][FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Грамматическая ошибка - это ошибка в структуре языковой единицы: в структуре слова, словосочетания или предложения; это нарушение какой-либо грамматической нормы - словообразовательной, морфологической, синтаксической.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Проблемы со знаками препинаний',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана неграмотно.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][FONT=times new roman][SIZE=4] Обратите внимание на знаки препинания!.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[LIST]<br>" +
            "[*][LEFT][FONT=georgia][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание: [/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4]Пунктуационная ошибка - это неиспользование пишущим необходимого знака препинания или его употребление там, где он не требуется, а также необоснованная замена одного знака препинания другим.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
            "[/LIST]<br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 11.1⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Пункт 11.1 описывается с рождения',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункт 11.1 должен описываться с момента рождения вашего персонажа.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не в тот возраст в пункте детство',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункт 11.1 начинается с рождения и заканчивается в 12 лет.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету инфы про возраст в 11.1',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Уточните возраст вашего персонажа в начале/середине/конце пункта 11.1.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 11.2⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не в тот возраст в пункте юность',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункт 11.2 начинается с 13 лет и заканчивается в 18 лет.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Мало инфы про учебу, экзамены',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 11.2 опишите более подробно процесс обучения, сдачи экзаменов.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету инфы про возраст в 11.2',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Уточните возраст вашего персонажа в начале/середине/конце пункта 11.2.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀⠀⠀Ошибки в пункте 11.3⠀⠀⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не в тот возраст в пункте взрослая жизнь',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункт 11.3 начинается с 18 лет.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Нету инфы про возраст в 11.3',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Уточните возраст вашего персонажа в начале/середине/конце пункта 11.3.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀Ошибки в пунктах 11.1, 11.2, 11.3⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Не указан возраст отправления в школу',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В пункте 11.1 должно быть написано, во сколько лет ваш персонаж пошёл в школу.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Не в том классе',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Пункты 11.1 и 11.2 противоречат друг другу, ваш персонаж должен быть в 6 классе, если пошел в школу в 7 лет.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
          title: '⠀⠀⠀⠀⠀⠀Остальные причины для отказов⠀⠀⠀⠀⠀⠀',
          dpstyle: 'oswald: 3px;     color: #fff; background: #db2309; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #f53317',
          },
          {
            title: 'Персонажу нет 18-ти лет',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вашему персонажу должно быть 18 и более лет.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Копия своей старой одобренной био',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay биография частично/полностью схожа с вашей прошлой одобренной биографией.<br>Если вы поменяли никнейм, то вам нужно придумать новую биографию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'От 3-го лица',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша RolePlay Биография написана от 3-его лица.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Супергерой',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваш персонаж не может иметь сверхспособности.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Лучший во всем',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Запрещено создавать персонажа, который является лучшим во всём..<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Комментарии от себя',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Не нужно добавлять комментарии от себя, не по форме.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Картинки/gif в биографии',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Запрещено писать лишнее в своей биографии, вставлять какие-то gif/картинки..<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Дубликат',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Не нужно дублировать свою биографию.<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 1',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 1 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 2',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 2 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 3',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 3 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 4',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 4 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 8',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 8 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 9',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 9 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 10',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 10 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Ошибка в пункте 11',
            dpstyle: 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(236, 124, 38, 0.5)',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3mmQW2F/2.png[/img][/url][/CENTER]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             '[COLOR=rgb(178, 34, 34)][SIZE=4][FONT=times new roman][CENTER]{{ greeting }}, уважаемый игрок.[/CENTER][/COLOR]<br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратите внимание, в пункте 11 имеется/имеются ошибка(-и).<br>[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]ОТКАЗАНО[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/wTmmg4ks/RLwzo.png[/img][/url][/CENTER]<br>' +
             "[I][CENTER][FONT=times new roman][SIZE=3][COLOR=rgb(209, 213, 216)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] ASTRAKHAN[/B][/COLOR] [/FONT][/SIZE][/I]",
            prefix: UNACCEPT_PREFIX,
            status: false,
          },
	];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
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
		$('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 5px; margin-top: 10px; border-radius: 13px;">БИОГРАФИИ</button>`,
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
	11 < hours && hours <= 17 ?
	'Добрый день' :
	17 < hours && hours <= 21 ?
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
          if(prefix == ACCEPT_PREFIX)
          {
             moveThread(prefix, 730);
          }
          if(prefix == UNACCEPT_PREFIX)
          {
             moveThread(prefix, 732);
          }
          if(prefix == DORABOTKA_PREFIX)
          {
             moveThread(prefix, 731);
             editThreadData(PIN_PREFIX, true);
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
	target_node_id: 'none',
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