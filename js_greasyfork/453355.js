// ==UserScript==
// @name         Скрипт только для Блэйзика
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Скрипт только для пупсика
// @author       Santa_Aelpee
// @match        https://forum.blackrussia.online/index.php?threads/*
// @icon         
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/453355/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D0%91%D0%BB%D1%8D%D0%B9%D0%B7%D0%B8%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/453355/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%82%D0%BE%D0%BB%D1%8C%D0%BA%D0%BE%20%D0%B4%D0%BB%D1%8F%20%D0%91%D0%BB%D1%8D%D0%B9%D0%B7%D0%B8%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCСEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PINN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
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
const buttons = [
     {
      title: 'Приветствие',
      content:
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]  [/CENTER][/FONT]',
     },
     {
      title: 'Отказано, закрыто',
      content: '[Color=#DC143C][CENTER]Отказано, закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content: '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]' + '[CENTER]  [/CENTER]<br>' +
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content:
               '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
               '[Color=#FFA500][CENTER]На рассмотрении...[/CENTER][/color]' + '[CENTER]  [/CENTER]<br>' +
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zByWk0xc/giphy-3.gif[/img][/url][/CENTER]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴NikName ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'оск Nik',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan [/CENTER] <br>" +
	    "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RolePlay процесса╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP Поведение',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#00FF00]| Jail 30 минут[/B]. [/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'NonRP Казино',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.03. Охраннику казино запрещено выгонять игрока без причины.[Color=#00FF00]| Увольнение с должности | Jail 30 минут.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#00FF00]| Jail 30 минут / Warn.[/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP drive',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#00FF00]| Jail 30 минут.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'RP отыгровки в свою сторону',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#00FF00]| Jail 30 минут.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморальные действия',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#00FF00]| Jail 30 минут / Warn. .[/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#00FF00]| Ban 15 - 30 дней / PermBan. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#00FF00] | Jail 60 минут. [/COLOR][/CENTER] <br>" +
	    "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства) [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#00FF00] | Mute 30 минут  [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс DM',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#00FF00] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск проекта',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
    	"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'продажа промо',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП (фура)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP аксесуар',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск администрации',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'баг с аним',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Chat ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Caps',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом родни',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Flood',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оскорбление',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив чата (СМИ)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за администратора',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка в Voice',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      status: false,
    },
    {
      title: 'оск/упом род в Voice',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#00FF00]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'шумы в Voice',
      content:
      '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
       "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#00FF00] | Ban 30 дней [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьявления в госс орг',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Теху',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба была передана на рассмотрение техническому специалисту. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'ГА',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба была передана на рассмотрение Главному Администратору. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Спец.админу',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба была передана на рассмотрение Специальному Администратору. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на администратора',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на администрацию[/URL]. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лидера',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.311/']Жалобы на лидеров[/URL]. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.313/']Обжалование наказаний[/URL]. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/']Технический раздел[/URL]. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жалобы на теха',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов[/URL]. [/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила госс ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в лич целях',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'госс в казино',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне тт в/ч (армия)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'лицензия без RP (Право)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>3.01. Запрещена выдача лицензий без Role Play отыгровок; [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'адвокат без RP (Право)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
      "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>3.02. Запрещено оказание услуг адвоката без Role Play отыгровок. [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (СМИ)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/Э (СМИ)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#00FF00] | Ban 7 дней + ЧС организации [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> Запрещено выдавать розыск без Role Play причины [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'задержание без RP (УМВД/ГИБДД/ФСБ)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> Запрещено оказывать задержание без Role Play отыгровки [Color=#00FF00] |  Warn [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP поведение (УМВД/ГИБДД/ФСБ)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> Запрещено nRP поведение [Color=#00FF00] |  Warn [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#00FF00] |  Warn [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'остановка и осмотр т/с без RP (ГИБДД)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки; [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'маскировка в лич целях',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> 8.04. Запрещено использовать маскировку в личных целях; [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обыск без RP (ФСБ)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> 8.06. Запрещено проводить обыск игрока без Role Play отыгровки. [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Задержание без РП(Нонрп коп)(ФСИН)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> 9.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСИН | DM / Jail 60 минут / Warn [/COLOR][/CENTER] <br>" +
         "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP В/Ч',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP похищение/ограбление(jail)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP похищение/ограбление (Warn)',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Прикрепите докозательства',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Создайте новую тему,в которой прикрепите докозательства.[/COLOR][/CENTER] <br>" +
		 "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нарушений не найдено',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Нарушений со стороны данного игрока не было найдено.[/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаточно докзательств',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false
    },
    {
      title: 'Неполный фрапс',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Фрапс обрываеться, загрузите полный фрапс на ютуб. [/COLOR][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'дубликат',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/']с правилами подачи жалоб на игроков[/URL]. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]На ваших доказательствах отсутствует /time. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Timekode',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваше видеодоказательство длится более 3-х минут, поэтому создайте новую тему и укажите тайм-коды. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'более 72-х часов',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'док-ва соц сеть',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'условия сделки',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В ваших доказательствах отсутствуют условия сделки [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В таких случаях нужен фрапс. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фотохостинги',
      content:
       '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают док-ва',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Доказательства не работают. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет док-ев',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]В вашей жалобе отсутствуют доказательства. [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'док-ва отредактированы',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'жалоба от 3-го лицо',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации). [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
       "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Долг дается на ваш страх и риск. Невозврат долга не наказуем [/COLOR][/CENTER] <br>" +
		"[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'био одобрена',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=#00FF00]Одобрено[/color]. [/COLOR][/QUOTE][/CENTER] <br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
       prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=Red]Отказано[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила написания RP биографии. [/COLOR][/QUOTE][/CENTER] <br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'био отказ (форма)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило нарушение Правила написания RP биографии | Purpe[/URL]. [/COLOR][/QUOTE][/CENTER] <br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (заголовок)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Неправильное написание заголовка биографии. [/COLOR][/QUOTE][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (3-е лицо)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Биография написана от 3-го лица. [/COLOR][/QUOTE][/CENTER] <br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (возраст не совпал)',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Возраст не совпадает с датой рождения. [/COLOR][/QUOTE][/CENTER]<br>" +
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'био отказ (ошибки)',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило большое количество ошибок | Purpe[/URL]. [/COLOR][/QUOTE][/CENTER] <br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay ситуации ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация отказано',
      content:
         '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
          "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций | Purpe[/URL]. [/COLOR][/QUOTE][/CENTER] <br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][B]Отказано, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      prefix: ODOBRENORP_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация одобрено',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
        "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено[/color]. [/COLOR][/QUOTE]/CENTER] <br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
      status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила управления казино и ночным клубом. ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Продажа должностей',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Данный игрок будет наказан по пункту правил:<br>2.01. Владельцу и менеджерам казино и ночного клуба запрещено принимать работников за денежные средства на должность охранника, крупье или механика. | Ban 3 - 5 дней. - [Color=#00FF00]Одобрено[/color]. [/COLOR][/QUOTE][/CENTER] <br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
    },
    {
      title: 'Охраник выгоняет без причины',
      content:
        '[CENTER][B][COLOR=rgb(255, 255, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый(ая) {{ user.mention }}.[/SIZE][/FONT][/COLOR][/B]<br><br>' +
         "[COLOR=rgb(255, 255, 255)][B][SIZE=3]Данный игрок будет наказан по пункту правил:<br>2.03. Охраннику казино запрещено выгонять игрока без причины | Увольнение с должности | Jail 30 минут. - [Color=#00FF00]Одобрено[/color]. [/COLOR][/QUOTE][/CENTER] <br>"+
         "[CENTER][COLOR=rgb(0, 255, 0)][B]Одобрено, закрыто.[/B][/COLOR][/CENTER] <br>" +
		"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/5N2wQLtP/gz-PL7-Yrox-Eyf3x365e-UKy-V0-GC6ei-G7-BQj3-n-DGq-Vyc-TNi-JFtv-Vbmrmdi-Ger-QKHS62g-Ze-IJ4-E8v-Gm-Wc-FD1-Py-Fs-Nr.jpg[/img][/url][/CENTER] <br>" +
        '[CENTER][COLOR=rgb(255, 255, 255)][B]Приятной игры от Мияги Блэйза.[/B][/COLOR][/CENTER] ',
     },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

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