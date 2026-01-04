// ==UserScript==
// @name         ANAPA Главный следящий | Заместитель главного следящего by M.Fayzra & C.Dark 
// @namespace    https://forum.blackrussia.online
// @version      2.4
// @description  Для ГС/ЗГС
// @author       Christopher_Dark & Mason_Fayzra, Boris_Lov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Quenk269
// @icon         https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/494248/ANAPA%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B9%20%7C%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B5%D0%B3%D0%BE%20by%20MFayzra%20%20CDark.user.js
// @updateURL https://update.greasyfork.org/scripts/494248/ANAPA%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B8%D0%B9%20%7C%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8C%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D1%81%D0%BB%D0%B5%D0%B4%D1%8F%D1%89%D0%B5%D0%B3%D0%BE%20by%20MFayzra%20%20CDark.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    const UNACCEPT_PREFIX = 4; // Префикс, устанавливаемый при закрытии темы
    const ACCEPT_PREFIX = 8; // Префикс, устанавливаемый при принятии темы
    const RESHENO_PREFIX = 6; // Префикс, устанавливаемый при решении проблемы
    const PIN_PREFIX = 2; // Префикс, устанавливаемый при закреплении темы
    const GA_PREFIX = 12; // Префикс, устанавливаемый при отправке темы в GA
    const COMMAND_PREFIX = 10; // Префикс, устанавливаемый при отправке темы в команду проекта
    const WATCHED_PREFIX = 9; // Префикс, устанавливаемый при отслеживании темы
    const CLOSE_PREFIX = 7; // Префикс, устанавливаемый при закрытии темы
    const SPECIAL_PREFIX = 11; // Префикс, устанавливаемый для особых случаев
    const TECH_PREFIX = 13; // Префикс, устанавливаемый для технических проблем
 
    const buttons = [
        {
            title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ИТОГИ------------- ------------------╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
        {
            title: '| ИТОГИ |',
            content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>" +
                "[B][CENTER][FONT=georgia][COLOR=#ff0000] Здравствуйте, уважаемые игроки [/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][FONT=georgia][COLOR=lavender]Список [COLOR=#00ff00]одобренных[COLOR=lavender] кандидатов:" +
                "[B][CENTER][FONT=georgia][COLOR=lavender]*ОДОБРЕННЫЕ [/CENTER][/FONT][/COLOR][/B]" +
                "[B][CENTER][FONT=georgia][COLOR=lavender]Список [COLOR=#ff0000] отказанных[COLOR=lavender] кандидатов:" +
                "[B][CENTER][FONT=georgia][COLOR=lavender]*ОТКАЗАННЫЕ* [/CENTER][/FONT][/COLOR][/B]" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>" +
                "[B][CENTER][FONT=georgia][COLOR=lavender]Обзвон будет назначен в группе кандидатов на пост Лидера, он будет проходить в официальном дискорд канале сервера [URL='https://discord.gg/Q4b9q2nD9j'][Color=lavender]Кликабельно[/URL]." +
                "[B][CENTER][FONT=georgia][COLOR=RED]Убедительная просьба не опаздывать" +
                "[B][CENTER][FONT=georgia][COLOR=lavender]VK Главного Следящего - [URL='https://vk.com/id593310097'][Color=lavender]Кликабельно[/URL]." +
                "[B][CENTER][FONT=georgia][COLOR=lavender]VK Заместителя Главного Следящего - [URL='https://vk.com/id353665102'][Color=lavender]Кликабельно[/URL]",
        },
        {
            title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Жб на лидера  ------------------╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
        {
            title: '| Приветствие |',
            content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>" +
                "[B][CENTER][FONT=georgia][COLOR=#2222ff][ICODE]{{ greeting }} {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=lavender] [/CENTER][/COLOR][/B]",
        },
        {
            title: '| Беседа с лд |',
            content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>" +
                '[SIZE=4][CENTER][B][FONT=georgia]{{ greeting }}, {{ user.mention }}.[CENTER][/FONT][/B][/SIZE]' +
                "[B][CENTER][FONT=georgia][COLOR=#ff0000]С лидером будет проведена беседа.[/COLOR][/CENTER][/B]" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>" +
                "[B][COLOR=#00FF00][CENTER][ICODE]Одобрено.[/ICODE][/B][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Приветствие',
            content:
                '[SIZE=4][CENTER][B][FONT=georgia]{{ greeting }}, {{ user.mention }}.[/FONT][/B][/SIZE]' +
                "[B][CENTER][FONT=georgia][COLOR=lavender] {{ greeting }} {{ user.name }} [/COLOR][/CENTER][/B]<br><br>",
        },
        {
 title: '- - - - - -  - - - - - - - - -  - - - - - - - - - - - - - - - - - Правила Role Play процесса - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Игрок будет наказан',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан[/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Багоюз',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по пункту правил: 2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).[/ICODE] [/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp поведение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.[/ICODE] [/CENTER] " +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от РП',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }}. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#ffff00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn [/ICODE].[/COLOR] [/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]Одобрено, закрыто.[/ICODE][/I][/CENTER][/color][/FONT]',
 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'non-rp вождение',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/ICODE].[/COLOR][/CENTER]<br>"+
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'NonRP Обман',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Аморал. действия',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
 
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив склада',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДБ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ТК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СК',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
	  status: false,
    },
    {
      title: 'ПГ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.17. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь | Jail 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'MG',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Масс ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 3 - 7 дней [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
      title: 'Сторонне ПО',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan [/ICODE].[/COLOR][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
	    '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Реклама сторонних ресурсов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск. адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 15 дней / PermBan [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Уход от наказания',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.34. Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней [/ICODE].[/COLOR][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
         '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
         '[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Злоуп. наказаниями',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней [/ICODE].[/COLOR][/CENTER]" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Оск проекта',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором) [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Продажа промо',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Помеха РП процессу',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нонрп акс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Баг аним',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минутПример: если игрок, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде Jail на 120 минут. Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. Пример: если игрок использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде Jail на 60 минут [/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
            title: '----╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ Отказы ------------------╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
        },
        {
            title: '| Беседа с лд |',
            content:
                "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>" +
                '[SIZE=4][CENTER][B][FONT=georgia]{{ greeting }}, {{ user.mention }}.[CENTER][/FONT][/B][/SIZE]' +
                "[B][CENTER][FONT=georgia][COLOR=#ff0000]С лидером будет проведена беседа.[/COLOR][/CENTER][/B]" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/wvQFLSp4/1.png[/IMG]<br>" +
                "[B][COLOR=#00FF00][CENTER][ICODE]Одобрено.[/ICODE][/B][/COLOR][/CENTER]",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| Не по форме |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=lavender] Ваша жалоба составлена не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>" +
                "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=black]Правила подачи жалоб[/URL] [COLOR=RED]|<br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| Заголовок не по форме |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=lavender]Заголовок у вашей жалобы составлен не по форме, пожалуйста ознакомьтесь с правилами подачи жалоб.<br><br>" +
                "[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/index.php?threads/3429394/'][Color=lavender]Правила подачи жалоб[/URL] [COLOR=RED]|<br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| Не туда попали |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=red] Ваша жалоба отклонена, так как вы не туда попали.<br><br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| Нет нарушений |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=gold]Со стороны игрока нет нарушений, пожалуйста, ознакомьтесь с правилами проекта.<br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| Уже был ответ |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=lavender]Вам был дан ответ в прошлой жалобе. Просьба не создавать дубликаты данной темы.<br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| Уже был наказан |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=white]Ваша жалоба отклонена, так как нарушитель уже был наказан ранее. Просьба не создавать дубликатов данной темы.<br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: '| Оффтоп |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=black] Прекратите писать оффтоп. Просьба не создавать дубликатов данной темы, иначе ваш форумный аккаунт будет заблокирован.<br><br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: '| 2 и более игрока |',
            content:
                "[B][CENTER][COLOR=#FF0080][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>" +
                "[B][CENTER][COLOR=lavender] Вашa жалобa отклонена, так как нельзя писать жалобу на 2 и более игроков.<br><br>" +
                "[CENTER][B][COLOR=gold] Составьте одну жалобу на одного игрока, а другую жалобу на другого и игрока.<br>" +
                "[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>" +
                '[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
            prefix: CLOSE_PREFIX,
            status: false,
          },
          {
            title: '_________________________________Наказания в чатах________________________________________',
          },
          {
            title: 'MG',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.18. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/SIZE][/FONT][/COLOR]<br><br>" +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание:[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] телефонное общение также является IC чатом.[/SIZE][/FONT][/COLOR]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'CAPS',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.02. [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Flood',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.05.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Политика',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.18.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещено политическое и религиозное пропагандирование.[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 120 минут / Ban 10 дней[/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
            title: 'Транслит',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.15. [/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование транслита в любом из чатов [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример:[/COLOR][COLOR=rgb(209, 213, 216)] «Privet», «Kak dela», «Narmalna».[/COLOR][/SIZE][/FONT]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Рынок в ГОСС',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]3.22. [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]| Mute 30 минут[/FONT][/SIZE][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]Пример: [/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua]в помещении центральной больницы писать в чат: «Продам эксклюзивную шапку дешево!!!»[/FONT][/SIZE][/COLOR]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Упом род',
            content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vZ2f6V91/2.png[/img][/url][/CENTER]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
            "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.19.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
              '[LIST]<br><br>' +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
              "[*][LEFT][FONT=book antiqua][COLOR=rgb(255, 0, 0)][SIZE=4]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/SIZE][/COLOR][/FONT][/LEFT]<br>" +
 
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][SIZE=1][COLOR=rgb(255, 255, 255)]Приятной игры на[/COLOR][COLOR=rgb(255, 0, 0)][B] BLACK RUSSIA[/B][/COLOR] [/SIZE][/I][COLOR=rgb(255, 165, 0)][B][SIZE=1]Role Play[/SIZE][/CENTER][/B][/COLOR]<br>" +
              '[CENTER][url=https://postimages.org/][img]https://media.discordapp.net/attachments/1115566790790098944/1115597676717801482/standard_2.gif?width=514&height=66[/img][/url][/CENTER]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Оск род войс',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.15. [/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорблять игроков или родных в Voice Chat [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][COLOR=rgb(209, 213, 216)] термин «MQ» расценивается, как упоминание родных.[/COLOR][/SIZE][/FONT]<br><br>" +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/COLOR][/SIZE][/FONT]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'OOC оск',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.03. [/COLOR][COLOR=rgb(209, 213, 216)]Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR] [/SIZE][/FONT]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'IC оск (секс. хар-ра)',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.07.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4] | Mute 30 минут[/SIZE][/FONT][/COLOR]<br><br>" +
              '[LIST]<br><br>' +
              "[*][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]Примечание: [/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]«дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/SIZE][/FONT][/COLOR]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Аморал',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.08. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещена любая форма аморальных действий сексуального характера в сторону игроков[/COLOR][COLOR=rgb(255, 0, 0)] | Jail 30 минут / Warn[/COLOR][/FONT][/SIZE]<br><br>" +
              '[LIST]<br><br>' +
              "[*][SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]Исключение: [/COLOR][COLOR=rgb(209, 213, 216)]обоюдное согласие обеих сторон.[/COLOR][/FONT][/SIZE]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Мат в назв. фам/биз',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua]2.53.[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 213, 216)][SIZE=4][FONT=book antiqua] Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности.[/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=book antiqua] | Ban 1 день / При повторном нарушении обнуление бизнеса[/FONT][/SIZE][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Иностр язык',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.01.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Устное замечание / Mute 30 минут [/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Неув к адм',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.54.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Mute 180 минут [/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Выдача за адм',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]3.10.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4] Запрещена выдача себя за администратора, если таковым не являетесь [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Ban 7 - 15 + ЧС администрации[/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Оск/обман адм',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.32. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта [/COLOR][COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней / PermBan[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)]подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.[/COLOR][/SIZE][/FONT]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
           {
            title: 'Угрозы о наказании',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]2.32. [/COLOR][COLOR=rgb(209, 213, 216)]Запрещены любые угрозы о наказании игрока со стороны администрации[/COLOR][COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Введение в заблуждения',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.32.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Ban 7 - 15 дней[/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'ООС угрозы',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[SIZE=4][FONT=book antiqua][COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещены OOC угрозы, в том числе и завуалированные [/COLOR][COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][/FONT][/SIZE]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Уязвим. правил',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.33.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено пользоваться уязвимостью правил [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]|  Ban 15 дней [/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Конфликты ooc и ic',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.35.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Mute 120 минут / Ban 7 дней [/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Переносить конфликты',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]2.36.[/SIZE][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=book antiqua][SIZE=4]Запрещено переносить конфликты из IC в OOC и наоборот[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=book antiqua][SIZE=4]| Warn [/SIZE][/FONT][/COLOR]<br><br>" +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
            title: 'Злоуп символами',
            content:
            '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Нарушитель буден наказан по следующему пункту общих правил серверов:[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)]Запрещено злоупотребление знаков препинания и прочих символов[/COLOR][COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/SIZE][/FONT]<br><br>" +
              '[LIST]<br><br>' +
              "[*][FONT=book antiqua][SIZE=4][COLOR=rgb(255, 0, 0)]Пример: [/COLOR][COLOR=rgb(209, 213, 216)] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/COLOR][/SIZE][/FONT]<br><br>" +
 
              "[I][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA ANAPA [/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4]Role Play[/SIZE][/FONT][/COLOR][COLOR=rgb(0, 140, 240)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/I]<br><br>" +
              '[url=https://postimages.org/][img]https://i.yapx.cc/QY7Mg.gif[/img][/url]',
            prefix: ACCEPT_PREFIX,
            status: false,
          },
          {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Передачи жалобы - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Техническому специалисту',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение техническому специалисту.[/ICODE].[/COLOR][/CENTER]<br>" +
         '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: TECH_PREFIX,
	  status: true,
    },
    {
      title: 'Передано ГА',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному Администратору.[/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'Передано Главному куратору форума',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному куратору форума.[/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
    },
    {
      title: 'Передано Зам. Главному куратору форума',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Зам. Главному куратору форума.[/ICODE].[/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила Гос.Структур - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ',
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 1.08. Запрещено использование фракционного транспорта в личных целях | Jail 30 минут.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс дм от МО',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/Р/О (Объявы)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Н/П/П/Э (Эфиры)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут [/ICODE].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УМВД',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Розыск без причины(УМВД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP поведение (Умвд)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 6.03. Запрещено nRP поведение | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/MKdRrVzK/1P76bnn.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
 
    },
    {
      title: 'ДМ/Масс от ГИБДД',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'nRP розыск',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
 
    },
    {
      title: 'Забирание В/У во время погони(ГИБДД)',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ДМ/Масс от УФСБ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | Jail 30 минут / Warn.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#FF00FF][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
 
    },
    {
     title: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - Правила ОПГ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -',
    },
    {
      title: 'Нарушение правил В/Ч',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ).[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		'[Color=##00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нападение на В/Ч через стену',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Игрок будет наказан по пунтку правил: Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома | /Warn NonRP В/Ч.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Похищение/Ограбления нарушение правил',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Игрок будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Click[/URL][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Спасибо за Ваше обращение!<br>Приятной игры[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		'[Color=#00FF00][FONT=times new roman][CENTER][I][ICODE]☆︎¦︎Одобрено✓︎, ↔︎ закрыто.¦︎☆︎[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пункта жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Нарушений не найдено',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Нарушений со стороны данного игрока не было найдено.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
 
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ответ дан в прошлой ЖБ',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]hhttps://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ответ был дан в прошлой жалобе.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Недостаточно доказательств',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Дублирование темы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1570/']Жалобы на администрацию[/URL].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'В обжалования',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Вы ошиблись разделом.<br>Обратитесь в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1573/']Обжалование наказаний[/URL].[/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Форма темы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	{
	  title: 'Нету /time',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]На ваших доказательствах отсутствует /time.[/ICODE][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Укажите тайм-коды',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]В течении 24х часов укажите тайм-коды, иначе жалоба будет отказана.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]На рассмотрении...[/ICODE][/CENTER][/COLOR]'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
      title: 'Жалоба на рассмотрении',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/ICODE][/COLOR][/CENTER]<br>" +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
		'[Color=AQUA][CENTER][ICODE]Ожидайте ответа.[/ICODE][/COLOR][/CENTER]'+
         '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>',
      prefix: PIN_PREFIX,
	  status: false,
    },
      {
      title: 'Заголовок не по форме',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/index.php?threads/3429394/']с правилами подачи жалоб на игроков[/URL].[/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Более 72 часов',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]С момента получения нарушение прошло более 72 часов.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/J4v7nzq5/crPNFEh.png[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
      {
      title: 'Доква через запрет соц сети',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В данных доказательствах отсутствуют условия сделки.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких случаях нужен фрапс.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фарпс + промотка чата',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких случаях нужен фрапс + промотка чата.[/ICODE][/COLOR][[/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В таких случаях нужна промотка чата.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Не работают доква',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Не работают доказательства.[/icode][/COLOR][/CENTER]<br>" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Ваши доказательства отредактированы.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Жалобы от 3-их лиц не принимаются.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]В случае ответного ДМ нужен видео-запись. Пересоздайте тему и прикрепите видео-запись.[/ICODE][/COLOR][/CENTER]" +
		'[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        "[CENTER][COLOR=#FFFF00][ICODE]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/ICODE][/COLOR][/CENTER]<br>" +
           '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Док-ва не рабочие',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Ваши доказательства не рабочие/обрезаные, перезалейте их правильно и без обрезаний.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: 'Фотохостинги',
	  content:
		"[B][CENTER][COLOR=#ff0000][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
		"[CENTER][COLOR=#FFFF00][ICODE]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/ICODE][/COLOR][/CENTER]<br>" +
		 '[url=https://postimages.org/][img]https://i.postimg.cc/GmmtwYtF/24728761-1.png[/img][/url]<br>' +
        '[Color=AQUA][CENTER][ICODE]Приятной игры.[/ICODE][/CENTER][/color]' +
        '[url=https://postimages.org/][img]https://i.postimg.cc/VNTPGQsQ/image2-3-1-1-1-10.gif[/img][/url]<br>'+
        '[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
        },
    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
        // Добавление кнопок при загрузке страницы
        addButton('Закрыть', 'closed');
        addButton('Меню', 'selectAnswer');
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#techspec`).click(() => editThreadData(TECH_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
 
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
 
        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if (id > 1) {
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
                4 < hours && hours <= 11
                    ? 'Доброе утро, уважаемый(ая)'
                    : 11 < hours && hours <= 15
                    ? 'Добрый день, уважаемый(ая)'
                    : 15 < hours && hours <= 21
                    ? 'Добрый вечер, уважаемый(ая)'
                    : 'Доброй ночи, уважаемый(ая)',
        };
    }
 
    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
 
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL,
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    }
                })
                .catch((err) => console.error('Error:', err));
        } else {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: true,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL,
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.redirect) {
                        window.location.href = data.redirect;
                    }
                })
                .catch((err) => console.error('Error:', err));
        }
    }
 
    function getFormData(obj) {
        const formData = new FormData();
        for (const key in obj) {
            formData.append(key, obj[key]);
        }
        return formData;
    }
})();