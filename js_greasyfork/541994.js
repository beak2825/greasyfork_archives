// ==UserScript==
// @name         Скрипт КФ logs Black Russia
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Стиль - скрипт для тех. раздела
// @author       I.Drag
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://postimg.cc/1fqy8FGB
// @grant        none
// @license dragsotka
// @downloadURL https://update.greasyfork.org/scripts/541994/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D0%A4%20logs%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/541994/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%9A%D0%A4%20logs%20Black%20Russia.meta.js
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
const OTKAZBIO_PREFIX = 4;
const ODOBRENOBIO_PREFIX = 8;
const NARASSMOTRENIIBIO_PREFIX = 2;
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
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]  [/CENTER][/FONT]'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>',
    },
    {
      title: 'На рассмотрении...',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша тема закреплена и находится на рассмотрении у администрации сервера[/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 255, 0)]На рассмотрении[/COLOR][/CENTER][/FONT]',
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - Одобрено - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
     title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - - - - - - - - Глава 2 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Игрок будет наказан',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по соответствующему [U]пункту правил серверов[/U][/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP поведение [2.01]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП [2.02]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP drive [2.03]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.03. Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха ИП [2.04]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP обман [2.05]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия [2.08]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада [2.09]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха блогерам [2.12]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'DB [2.13]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'TK [2.15]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'SK [2.16]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
	  status: false,
    },
    {
      title: 'MG [2.18]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
        {
      title: 'DM [2.19]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Mass DM [2.20]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Багоюз [2.21]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Стороннее ПО [2.22]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама [2.31]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | Ban 7 дней / PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Обман администрации [2.32]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Полит/религ конфликты [2.35]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'OOC угрозы [2.37]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.37. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | Mute 120 минут / Ban 7 - 15 дней.[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. нарушениями [2.39]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 15 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта [2.40]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо [2.43]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Арест в казино [2.50]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP аксессуар [2.52]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. администрации [2.54]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Багоюз анимации [2.55]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.55. Запрещается багоюз, связанный с анимацией в любых проявлениях. | Jail 120 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Невозврат долга [2.57]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]2.57. Запрещается брать в долг игровые ценности и не возвращать их. | Ban 30 дней / permban[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Глава 3 - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'CapsLock [3.02]',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.02. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут.[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Оск в ООС [3.03]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск/Упом родни [3.04]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд [3.05]',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Злоуп. знаками [3.06]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ [3.08]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Выдача себя за адм [3.10]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней.[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ввод в забл. командами [3.11]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Музыка в voice [3.14]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Шум в voice [3.16]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Полит/религ пропаганда [3.18]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Транслит [3.20]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама промокода [3.21]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Торговля в ГОСС [3.22]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Фейк-аккаунт [4.10]',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Игрок будет наказан по следующему [U]пункту правил серверов[/U]:[/CENTER]<br><br>'+
        '[CENTER]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/CENTER]<br><br>'+
        '[CENTER]Спасибо за Ваше обращение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(0, 256, 0)]Одобрено. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: ACCСEPT_PREFIX,
	  status: false,
    },

    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Техническому специалисту',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]техническому специалисту по направлению логирования[/U][/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 255, 0)]Передано техническому специалисту[/COLOR][/CENTER][/FONT]',
      prefix: TEXY_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваша жалоба передана на рассмотрение [U]Главному Администратору сервера[/U][/CENTER]<br><br>'+
        '[CENTER]Просьба не создавать подобные темы, иначе ваш форумный аккаунт может быть [U]заблокирован[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(255, 255, 0)]Передано техническому специалисту[/COLOR][/CENTER][/FONT]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Отказано - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Нарушений со стороны данного игрока не было найдено[/CENTER]<br><br>'+
        '[CENTER]Если у вас есть более информативные док-ва нарушения, прикрепите их в [U]новой жалобе[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Дублирование ЖБ',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Вы уже подавали жалобу на данного игрока[/CENTER]<br><br>'+
        '[CENTER]За дублирование жалоб ваш форумный аккаунт может быть [U]заблокирован[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Плохое качество',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваши доказательства предоставлены в плохом качестве[/CENTER]<br>'+
        '[CENTER]Попробуйте прикрепить док-ва через другой фото/видеохостинг в [U]новой жалобе[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не по форме',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Жалоба составлена не по форме[/CENTER]<br><br>'+
        '[CENTER]Ознакомьтесь с [U]правилами подачи жалоб[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]На ваших доказательствах отсутствует /time[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Фрапс длится более 3 минут, необходимо указать [U]таймкоды[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Более 72 часов',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]С момента нарушения от игрока прошло более 72 часов[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]На ваших доказательствах отсутствуют условия сделки[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]В таких случаях необходим [U]фрапс[/U] (запись экрана)[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Фрапс обрывается[/CENTER]<br><br>'+
        '[CENTER]Загрузите полный фрапс на YouTube/RuTube[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают док-ва',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Доказательства не рабочие[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Ваши доказательства были отредактированы[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Вы ошиблись сервером/разделом[/CENTER]<br><br>'+
        '[CENTER]Переподайте жалобу в [U]нужный раздел[/U][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Доп. вердикты - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'RP обманы',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Предложение обмена через /changeprop является RolePlay обманом или попыткой, так как все условия обмена есть у обоих игроков перед глазами[/CENTER]<br>'+
        '[CENTER]Является nRP обманом только в том случае, если обменивается т/с с идентичным названием другого[/CENTER]<br>'+
        '[CENTER](например продажа обычной приоры VAZ 2172 под видом ППС приоры VAZ 2172)[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нет в логах',
      content:
        '[FONT=Verdana][CENTER][COLOR=rgb(209, 213, 216)]Доброго времени суток, уважаемый[/COLOR][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(255, 204, 0)]{{ user.name }}[/COLOR][/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER]Любое нарушение проверяется через [U]систему логигрования[/U][/CENTER]<br>'+
        '[CENTER]На данный момент мы не можем доказать данное нарушение[/CENTER]<br><br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br><br>'+
        '[CENTER][COLOR=rgb(256, 0, 0)]Отказано. Закрыто.[/COLOR][/CENTER][/FONT]',
      prefix: UNACCСEPT_PREFIX,
	  status: false,
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Заявки АП - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'На рассмотрении',
      content:
        "[CENTER][COLOR=rgb(255, 204, 0)]Закрыто на рассмотрение...[/COLOR]<br><br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br><br>"+
        "[COLOR=rgb(184, 49, 47)]Внимание![/COLOR]<br><br>"+
        "[COLOR=rgb(209, 213, 216)]Просьба учесть несколько нюансов, чтобы не было вопросов.[/COLOR]<br><br>"+
        "[COLOR=rgb(250, 197, 28)]1. Не развит вк - есть два варианта:[/COLOR]<br><br>"+
        "[COLOR=rgb(239, 239, 239)] 1) если ВК был создан менее 3-х месяцев назад.[/COLOR]<br>"+
        "[COLOR=rgb(239, 239, 239)] 2) если на странице нет активности, нет постов (также входит если вы создали аккаунт пару лет назад, а на нем нет ни постов, ни фото)[/COLOR]<br><br>"+
        "[COLOR=rgb(250, 197, 28)] 2. Не развит ФА - есть два варианта:[/COLOR]<br><br>"+
        "[COLOR=rgb(239, 239, 239)] 1) ФА меньше 1 месяца.[/COLOR]<br>"+
        "[COLOR=rgb(239, 239, 239)] 2) на ФА нет, или очень мало сообщений (меньше 10). (также входит, если вы создали свой форумник пару месяцев назад, а на нем нет активности, ни сообщений, ни публикации)[/COLOR]<br><br>"+
        "[COLOR=rgb(250, 197, 28)]3. Грубые нарушения на твинке[/COLOR]<br><br>"+
        "[COLOR=rgb(239, 239, 239)]Под твинк имеются ввиду все игровые аккаунты на ВСЕХ серверах (поэтому, не надо писать, что у вас якобы нет твинков)[/COLOR]<br><br>"+
        "[COLOR=rgb(250, 197, 28)]4. Гбаны или блокировки за обманы администрации, за упом родни или неадекватное поведение в вашей странице ВК.[/COLOR]<br><br>"+
        "[COLOR=rgb(239, 239, 239)]Если вы считаете, что отказали неверно, вам следует сначала ОБЖАЛОВАТЬ вашу блокировку, а после этого заново подавать.[/COLOR]<br><br>"+
        "[COLOR=rgb(250, 197, 28)]5. Точного времени проверки заявок нет.[/COLOR]<br><br>"+
        "[COLOR=rgb(239, 239, 239)] Это может занять только день, либо целую неделю целиком, поэтому НЕ НАДО писать по типу 'когда закроют заявки', 'когда проверят заявки', а также флудить нам 'проверьте заявки пж', 'ауу' и т.п. Всему свое время, просьба ждать и не спешить.[/COLOR]<br><br>"+
        "[URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL]<br><br>"+
        "[CENTER][COLOR=rgb(209, 213, 216)]На рассмотрении...[/COLOR][/CENTER]",
      prefix: PINN_PREFIX,
	  status: true,
    },
    {
      title: 'Итоги',
      content:
        "[CENTER][COLOR=rgb(255, 204, 0)]Заявления были рассмотрены.[/COLOR]<br><br>"+
        "[CENTER][COLOR=rgb(209, 213, 216)]С итогами вы можете ознакомиться ниже.[/COLOR]<br><br>"+
        "[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br><br><br>"+
        "[COLOR=rgb(0, 187, 0)]Одобрено:[/COLOR]<br><br><br>"+
        "[COLOR=rgb(209, 213, 216)]   [/COLOR]<br><br>"+
        "[COLOR=rgb(187, 0, 0)]Отказано:[/COLOR]<br><br>"+
        "[COLOR=rgb(209, 213, 216)]   [/COLOR]<br><br><br>"+
        "[COLOR=rgb(184, 49, 47)][U]Примечание: [/U][/COLOR][COLOR=rgb(209, 213, 216)]Всем одобренным отпишу с данной страницы ВК - https://vk.com/id871943454 , обязательно убедитесь, что Вам пишу именно я.[/COLOR]<br><br>"+
        "[COLOR=rgb(209, 213, 216)]Так же, администрация никогда не попросит у вас данные от вашего аккаунта для каких-либо целей.[/COLOR]<br><br>"+
        "[URL='https://postimages.org/'][IMG]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/IMG][/URL]<br><br>"+
        "[CENTER][COLOR=rgb(0, 255, 0)]Рассмотрено. Закрыто.[/COLOR][/CENTER]<br>",
    },

  ];
  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('ГА', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Решено', 'Resheno');
    addButton('Закрыто', 'Zakrito');
    addButton('Ответы', 'selectAnswer');

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
            sticky: 1,
			pin: true,
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
            sticky: 1,
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