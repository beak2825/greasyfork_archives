// ==UserScript==
// @name         Кураторы форума | Purple
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  Скрипт для Кураторов Форума
// @author       Timofei_Oleinik
// @match        https://forum.blackrussia.online/index.php?threads/*
// @icon         https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/453003/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Purple.user.js
// @updateURL https://update.greasyfork.org/scripts/453003/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D1%84%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Purple.meta.js
// ==/UserScript==

(function () {
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
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER][/FONT]',
    },
     {
              title: 'Приветствие (2)',
      content:
         '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
         '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый игрок![/CENTER][/FONT]',
    },
     {
      title: 'Отказано, закрыто',
      content: '[Color=#ff0000 ][CENTER]Отказано, закрыто.[/CENTER][/color]<br>' +
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/LXK0dYGv/giphy-1.gif[/img][/url][/CENTER]',
      prefix: UNACCСEPT_PREFIX,
      status: false,
    },
    {
      title: 'Одобрено, закрыто',
      content: '[Color=#00FF00][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
               '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/XJ5Yp4yv/giphy.gif[/img][/url][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	 status: false,
    },
    {
      title: 'На рассмотрении...',
      content:
               '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
               '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
               '[Color=#FFFF00][CENTER]Ваша жалоба направляется на рассмотрении...[/CENTER][/color]<br>' +
                '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>' +
               '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR].[/FONT][/CENTER]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила RolePlay процесса╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP Поведение',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=#00FF00]| Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'NonRP Казино',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.03. Охраннику казино запрещено выгонять игрока без причины.[Color=#00FF00]| Увольнение с должности | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
		'[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от RP',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=#00FF00]| Jail 30 минут / Warn[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP drive',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=#00FF00]| Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP Обман',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=#00FF00]| PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'RP отыгровки в свою сторону',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.06. Запрещены любые Role Play отыгровки в свою сторону или пользу [Color=#00FF00]| Jail 30 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'аморальные действия',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=#00FF00]| Jail 30 минут / Warn[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив склада',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=#00FF00]| Ban 15 - 30 дней / PermBan[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Затягивание в RP',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.12. Запрещено целенаправленное затягивание Role Play процесса [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=#00FF00] | Jail 60 минут[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'RK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=#00FF00] | Jail 30 минут[/color]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=#00FF00] | Jail 60 минут / Warn (за два и более убийства)[/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'PG',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DM',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=#00FF00] | Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс DM',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=#00FF00] | Warn / Ban 3 - 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'сборка',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уход от наказания',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.34. Запрещен уход от наказания [Color=#00FF00] | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OОC угрозы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные [Color=#00FF00] | Mute 120 минут / Ban 7 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп наказаниями',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера [Color=#00FF00] | Ban 7 - 30 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск проекта',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=#00FF00] | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'продажа промо',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=#00FF00] |  Mute 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЕПП (фура)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=#00FF00] |  Jail 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'арест на аукционе',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона [Color=#00FF00] |  Ban 7 - 15 дней + увольнение из организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP аксесуар',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=#00FF00] | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мат в названии (Бизнеса)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.53. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=#00FF00] | Ban 1 день / При повторном нарушении обнуление бизнеса [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск администрации',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=#00FF00] | Mute 180 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'баг с аним',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=#00FF00] | Jail 60 / 120 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        	  title: 'Покупка/продажа ИВ',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new] Игроку будет выдано наказание по пункту правил:<br>2.28 Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги.[Color=#00FF00] | PermBan с обнулением аккаунта + ЧС проекта [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
        	  title: 'ППВ',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
       "[CENTER][Color=#ff0000][FONT=courier new]Игроку будет выдано наказание по пункту правил:<br>4.03 Запрещена совершенно любая передача игровых аккаунтов третьим лицам.[Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
          '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
     },
    {
        	  title: 'Обман администрации',
	  content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new] Игроку будет выдано наказание по пункту правил:<br>2.32  Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта.[Color=#00FF00] | Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Обход системы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new] Игроку будет выдано наказание по пункту правил:<br>2.21 Запрещено пытаться обходить игровую систему или использовать любые баги сервера.[Color=#00FF00] | Ban 15 - 30 дней / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
                      title: 'Покупка/Продажа репутации',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new] Игроку будет выдано наказание по пункту правил:<br>2.48. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [Color=#00FF00]  | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'реклама',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Chat ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'разговор не на русском',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.01. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=#00FF00] | Устное замечание / Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Caps',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск в OOC',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом родни',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Flood',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп символами',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оскорбление',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'слив чата (СМИ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=#00FF00] | PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'угроза со стороны администрации',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'выдача себя за администратора',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь [Color=#00FF00] | Ban 7 - 15 + ЧС администрации[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ввод в заблуждение командами',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=#00FF00] | Ban 15 - 30 дней / PermBan[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'музыка в Voice',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск/упом род в Voice',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat [Color=#00FF00]| | Mute 120 минут / Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'шумы в Voice',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама в Voice',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.17. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=#00FF00] | Ban 7 - 15 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'полит/религ пропоганда',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование [Color=#00FF00] | Mute 120 минут / Ban 10 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'изменение голоса софтом',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.19. Запрещено использование любого софта для изменения голоса [Color=#00FF00] | Mute 60 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'транслит',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.20. Запрещено использование транслита в любом из чатов [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама промо',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=#00FF00] | Ban 30 дней [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обьявления в госс орг',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
           '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
             title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'ГКФу',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#0000ff]Главному Куратору Форума. [/COLOR][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]Ожидайте ответа...[/COLOR].[/FONT][/CENTER]',
        prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Теху',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#ffa500]Техническому специалисту. [/COLOR][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(250, 197, 28)]Ожидайте ответа...[/COLOR].[/FONT][/CENTER]',
        prefix: TEXY_PREFIX,
	  status: true,
    },
    {
              title: 'ЗГА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#ff0000]Зам.Главного Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>' +
  '[CENTER][COLOR=rgb(250, 197, 28)]Ожидайте ответа...[/COLOR].[/FONT][/CENTER]',
        prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'ГА',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#ff0000]Главному Администратору. [/COLOR][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>' +
       '[CENTER][COLOR=rgb(250, 197, 28)]Ожидайте ответа...[/COLOR].[/FONT][/CENTER]',
        prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Спец.админу',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Ваша жалоба была передана на рассмотрение [Color=#ff0000]Специальному Администратору. [/COLOR][/FONT][/CENTER] <br>" +
        '[FONT=times new roman][I][COLOR=rgb(209, 213, 216)]Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR][/I][/FONT][/SIZE][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]Ожидайте ответа...[/COLOR]. [/FONT][/CENTER]',
        prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴NikName ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP Nik',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ff00][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.06. Никнейм игрового аккаунта должен быть в формате Имя_Фамилия на английском языке [Color=#00FF00] | Устное замечание + смена игрового никнейма [/color] [/COLOR][/FONT][/CENTER] <br>" +
              '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'оск Nik',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ff00][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Feik',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ff00][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=#00FF00] | Устное замечание + смена игрового никнейма / PermBan [/color] [/COLOR][/FONT][/CENTER] <br>" +
           '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на администратора',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.310/']Жалобы на администрацию[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
                ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лидера',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.311/']Жалобы на лидеров[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
                 ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
   prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.313/']Обжалование наказаний[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB.22/']Технический раздел[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жалобы на теха',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#FFFF00][FONT=courier new]Вы ошиблись разделом.<br>Обратитесь в [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила форума ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'неадекват',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.02. Запрещено неадекватное поведение в любой возможной форме, от оскорблений простых пользователей, до оскорбления администрации или других членов команды проекта. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'травля пользователя',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.03. Запрещена массовая травля, то есть агрессивное преследование одного из пользователей данного форума. [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'провокация, розжик конфликта',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.04. Запрещены латентные, то есть скрытные (завуалированные), саркастические сообщения/действия, созданные в целях оскорбления того или иного лица, либо для его провокации и дальнейшего розжига конфликта. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'реклама',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.05. Запрещена совершенно любая реклама любого направления. [/COLOR][/FONT][/CENTER] <br>" +
           '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: '18+',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.06. Запрещено размещение любого возрастного контента, которые несут в себе интимный, либо насильственный характер, также фотографии содержащие в себе шок-контент, на примере расчленения и тому подобного. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Flood , Offtop',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.07. Запрещено флудить, оффтопить во всех разделах которые имеют строгое назначение. [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'религия/политика',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.09. Запрещены споры на тему религии/политики. [/COLOR][/FONT][/CENTER] <br>" +
           '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'помеха развитию проекта',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.14. Запрещены деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
  prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'попрошайничество',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.16. Запрещено вымогательство или попрошайничество во всех возможных проявлениях. [/COLOR][/FONT][/CENTER] <br>" +
           '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
   prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'злоуп Caps/транслит',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.17. Запрещено злоупотребление Caps Lock`ом или транслитом. [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат тем',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>2.18. Запрещена публикация дублирующихся тем. [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'бесмысленый/оск Nik фа',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.02. Запрещено регистрировать аккаунты с бессмысленными никнеймами и содержащие нецензурные выражения. [/COLOR][/FONT][/CENTER] <br>" +
          '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Feik Nik фа адм/лд',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил пользования форумом:<br>3.03. Запрещено регистрировать аккаунты с никнеймами похожими на никнеймы администрации. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила госс ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'работа в форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.07. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'т/с в лич целях',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.08. Запрещено использование фракционного транспорта в личных целях [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'патруль в одиночку',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.11. Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
          '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'госс в казино',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>1.13. Запрещено находиться в форме внутри казино, а также устраиваться на сторонние работы в форме фракции [Color=#00FF00] | Jail 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'урон вне тт в/ч (армия)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (СМИ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.01. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/Э (СМИ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=#00FF00] | Mute 30 минут [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'замена текста обьявки (СМИ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br>4.04. Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=#00FF00] | Ban 7 дней + ЧС организации [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Урон без RP причины (УМВД/ГИБДД/ФСБ/ФСИН)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6.01 Запрещено наносить урон игрокам без Role Play причины на территории УМВД/ГИБДД/ФСБ/ФСИН [Color=#00FF00] | DM / Jail 60 минут / Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'розыск без причины (УМВД/ФСБ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.02 Запрещено выдавать розыск без Role Play причины [Color=#00FF00] | Warn[/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'задержание без RP (УМВД/ГИБДД/ФСБ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6.04 Запрещено оказывать задержание без Role Play отыгровки [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP поведение (УМВД/ГИБДД/ФСБ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 6.03 Запрещено nRP поведение [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отбор вод прав при погоне (ГИБДД)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.05. Запрещено отбирать водительские права во время погони за нарушителем [Color=#00FF00] |  Warn [/color] [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'остановка и осмотр т/с без RP (ГИБДД)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 7.04. Запрещено останавливать и осматривать транспортное средство без Role Play отыгровки [Color=#00FF00] |  Warn [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'обыск без RP (ФСБ)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> 8.06. Запрещено проводить обыск игрока без Role Play отыгровки [Color=#00FF00] |  Warn. [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴правила опг ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'NonRP В/Ч',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок будет наказан по пункту правил:<br> За нарушение правил нападения на Войсковую Часть выдаётся предупреждение [Color=#00FF00] | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ) [/color] [/COLOR][/FONT][/CENTER] <br>" +
          '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
    prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP похищение/ограбление(jail)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок получит наказание в виде деморгана за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP похищение/ограбление (Warn)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок получит наказание в виде предупреждения за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'NonRP ограбление/похищениме (Ban)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игрок получит наказание в виде блокировки аккаунта за нарушение правил ограблений/похищений [/COLOR][/FONT][/CENTER] <br>" +
         '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'нарушений не найдено',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Нарушений со стороны данного игрока не было найдено. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#ff0000][FONT=courier new]Если у Вас есть дополнительные доказательства с нарушением данного игрока, предоставьте в следующей теме. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Возврат средств',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Администрация сервера не несёт ответственности за утраченные Вами средства при обмане и т.д, средства буду возвращены только при желании нарушителя через Обжалование. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаточно док-ев',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Недостаточно доказательств на нарушение от данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#ff0000][FONT=courier new] Прикрипите в следующей жалобе больше доказательств на нарушение данного игрока. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false
    },
    {
              title: 'Слив семьи',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Слив семьи никак не относится к правилам проекта,то есть если Лидер семьи дал игроку роль заместителя,то только он за это и отвечает, Администрация сервер не несет за это ответственность! [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
          },
          {
      title: 'дубликат',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Дублироване темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/'] правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		"[CENTER][Color=#ff0000][FONT=courier new] И впредь не нарушать данные правила. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'заголовок не по форме',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Заголовок вашей жалобы составлен не по форме.<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/'] правилами подачи жалоб на игроков[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
		"[CENTER][Color=#ff0000][FONT=courier new] И впредь не нарушать данные правила. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет /time',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]На ваших доказательствах отсутствует /time.<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/'] правилами подачи жалоб на игроков[/URL] [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'TimeKode прошло 24 часа',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]У вас было 24 часа на указание Тайм-Кодов, Вы их не указали в течении 24-х часов жалоба закрыта. [/COLOR][/FONT][/CENTER] <br>" +
		"[CENTER][Color=#ff0000][FONT=courier new] Закрыто. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Timekode',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Ваше видеодоказательство длится более 3-х минут, поэтому укажите тайм-коды в течении 24-х часов.<br>В противном случае жалоба будет отказана. [/COLOR][/FONT][/CENTER] <br>" +
            '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]',
     prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'более 72-х часов',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/'] правилами подачи жалоб на игроков[/URL] [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'док-ва соц сеть',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/'] правилами подачи жалоб на игроков[/URL] [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'условия сделки',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]В ваших доказательствах отсутствуют условия сделки. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]В таких случаях нужен фрапс. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нужна промотка чата',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]В таких случаях нужна промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не работают док-ва',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Доказательства не работают, прикрепите в следующей жалобе рабочие доказательства. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет док-ев',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]В вашей жалобе отсутствуют доказательства. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'док-ва отредактированы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'жалоба от 3-го лицо',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br>Убедительная просьба ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-игроков.2639619/'] правилами подачи жалоб на игроков[/URL] [/COLOR][/FONT][/CENTER] <br>" +
                ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'долг',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Долг дается на ваш страх и риск. Невозврат долга не наказуем. [/COLOR][/FONT][/CENTER] <br>" +
               ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'трай',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#ff0000][FONT=courier new]Игра в трай, это развлечение, за котрое наказание не выдаётся даже если Вы играли на деньги. [/COLOR][/FONT][/CENTER] <br>" +
                ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись сервером',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        '[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Вы ошиблись сервером, перенаправляю  вашу жалобу на нужный сервер. [/COLOR][/QUOTE][/FONT][/CENTER]',
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay биографии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'био одобрена',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new] Ваша РП биография получает статус - [Color=#00FF00]Одобрено[/color]|[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
          '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',
     prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био на доработке',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Вам даётся 24 часа на дополнение вашей РП биографии, в противном случае она получит статус - [Color=#DC143C]Отказано[/color]|[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
         '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]',
        prefix: PINN_PREFIX,
    },
    {
      title: 'био отказ (форма)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило нарушение Правила написания RP биографии |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
              ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
   prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (не дополнил)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Не дополнили биографию в течение 24-х часов |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
            ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'био отказ (Мало инфы)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Недостаточно количество RolePlay информации о вашем персонаже. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
            ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (Скопирована)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Биография скопирована |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (заголовок)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Неправильное написание заголовка биографии. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
             ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (1-е лицо)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Написание Биографии от 1-го лица. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'био отказ (возраст не совпал)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Возраст не совпадает с датой рождения. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER]<br>" +
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
            ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
            },
    {
              title: 'био отказ (возраст)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Возраст слишком мал. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER]<br>" +
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
            },
    {
      title: 'био отказ (ошибки)',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило большое количество ошибок. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Биографий. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
        {
         title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴RolePlay ситуациии ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'одобрено',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new] Ваша РП ситуация получает статус - [Color=#00FF00]Одобрено[/color]|[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
          '[CENTER][Color=#00ff00][FONT=courier new] Одобрено,закрыто.[/COLOR][/FONT][/CENTER]',

        prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'на доработке',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Вам даётся 24 часа на дополнение вашей РП ситуации, в противном случае она получит статус - [Color=#DC143C]Отказано[/color]|[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR]. [/FONT][/SIZE][/CENTER]',
    prefix: PINN_PREFIX,
    },
    {
      title: 'форма',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило нарушение Правила написания РП ситуации |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
             ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
    prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не дополнил',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Не дополнили РП ситуацию в течение 24-х часов |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
              title: 'Мало инфы',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП биография получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Недостаточно количество RolePlay информации о вашей РП ситуации. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ Скопирована',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - РП ситуация скопирована |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
            ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'заголовок',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило - Неправильное написание заголовка РП ситуации. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>" +
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
            ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
     prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ошибки',
      content:
        '[CENTER][B][FONT=trebuchet ms][SIZE=3][IMG]http://i.yapx.ru/QqZnC.jpg[/IMG][/SIZE][/FONT][/B][SIZE=3][FONT=trebuchet ms] [/CENTER]<br>' +
        '[CENTER][I][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]{{ greeting }}, уважаемый {{ user.mention }}.[/SIZE][/FONT][/COLOR][/I]<br><br>' +
        "[CENTER][Color=#00ffff][QUOTE][FONT=courier new]Ваша РП ситуация получает статус - [Color=#DC143C]Отказано[/color].<br>Причиной отказа послужило большое количество ошибок. |[Color=#800080]Purpe. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Еще раз внимательнее прочитайте правила написания RP Ситуаций. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
        "[CENTER][Color=#ff0000][QUOTE][FONT=courier new]Если Вы не согласны с моим решением,просьба обратиться в раздел Жалобы на администрацию. [/COLOR][/QUOTE][/FONT][/CENTER] <br>"+
           ',[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано,закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение💫', 'pin');
    addButton('Важно💥', 'Vajno');
    addButton('Команде Проекта💥', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу💥', 'Spec');
    addButton('Одобрено✅', 'accepted');
    addButton('Отказано⛔', 'unaccept');
    addButton('Теху', 'Texy');
    addButton('Решено✅', 'Resheno');
    addButton('Закрыто⛔', 'Zakrito');
    addButton('Реализовано💫', 'Realizovano');
    addButton('Рассмотрено✅', 'Rassmotreno');
    addButton('Ожидание', 'Ojidanie');
    addButton('Без префикса⛔', 'Prefiks');
    addButton('Проверено контролем качества', 'Kachestvo');
    addButton('Ответ💥', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
    $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
    $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
    $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
    $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
    $('button#Prefiks').click(() => editThreadData(PREFIKS, false));
    $('button#Kachestvo').click(() => editThreadData(KACHESTVO, false));

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