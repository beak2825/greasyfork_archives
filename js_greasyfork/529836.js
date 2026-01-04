// ==UserScript==
// @name         Скрипт для Кураторов Форума | Deep_Ferreiro
// @namespace    https://forum.blackrussia.online/
// @version      1.4
// @description  Скрипт создан для кураторов форума Black Russia Lime | По вопросам обращайтесь --> https://vk.com/deepferreiro
// @author       Deep_Ferreiro
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://gas-kvas.com/grafic/uploads/posts/2024-01/gas-kvas-com-p-kontur-brillianta-na-prozrachnom-fone-26.png
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/529836/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Deep_Ferreiro.user.js
// @updateURL https://update.greasyfork.org/scripts/529836/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%7C%20Deep_Ferreiro.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const UNACCEPT_PREFIX = 4; // префикс отказано
	const ACCEPT_PREFIX = 8; // префикс одобрено
	const PIN_PREFIX = 2; //  префикс закрепить
    const NARASMOTRENII_PREFIX = 2; // Жалоба на рассмотрении
	const COMMAND_PREFIX = 10; // команде проекта
	const CLOSE_PREFIX = 7; // префикс закрыто
	const DECIDED_PREFIX = 6; // префикс решено
	const WATCHED_PREFIX = 9; // рассмотрено
	const TEX_PREFIX = 13; // техническому специалисту
    const GA_PREFIX = 12; // Главному администратору
	const NO_PREFIX = 0;
	const buttons = [
     {
      title: 'Приветствие',
      content: '[FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER][FONT=georgia][I]       [/I][/FONT][/CENTER]',
    },
      {
          title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Создано: BY DEEP_FERREIRO~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #4ec200',
    },
    {
      title: 'Жалоба на рассмотрении',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +

        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]<br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: NARASMOTRENII_PREFIX,
      status: true,
    },
    {
      title: 'Док-ва что лидер фамы',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +

        "[CENTER]Здравствуйте уважаемый игрок. Мы принимаем жалобы только от лидеров семьи прикрепите ниже доказательства что вы являетесь лидером, а также доказательства объявлений семьи в течении 24 часов.​[/CENTER]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
        prefix: NARASMOTRENII_PREFIX,
      status: true,
    },
    {
      title: 'Жалоба только от ЛД',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вы не являетесь лидером семьи, жалобы на слив склада принимаются только от лидеров семей.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT]<br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Правила Role Play процесса~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
     dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Нонрп поведение',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Нарушитель будет наказан по пункту правил: [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | [Color=Red]Jail 30 минут [/color][/FONT][/I][/B][/CENTER] " +
        '[Color=Lime][CENTER]Одобрено, закрыто[/color].<br> ' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уход от РП',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:[Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп вождение',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.03[/color]. Запрещён NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
            "[CENTER][Color=Red]Примечание[/color]: нарушением считаются такие действия, как езда на скутере по горам, намеренное создание аварийных ситуаций при передвижении. Передвижение по полям на любом транспорте, за исключением кроссовых мотоциклов и внедорожников.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'Помеха работе',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.04[/color]. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | [Color=Red]Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
     },
        {
      title: 'NonRP Обман',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | [Color=Red]PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'AFK no ESC',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.07[/color]. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | [Color=Red]Kick[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Аморал действия',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Слив склада',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обман в /do',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.10[/color]. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | [Color=Red]Jail 30 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'DB',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | [Color=Red]Jail 60 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'TK',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'SK',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | [Color=Red]Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'MG',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'DM',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | [Color=Red]Jail 60 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Масс DM',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | [Color=Red]Warn / Ban 3 - 7 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Сторонне ПО',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил: [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [Color=Red] Ban 15 - 30 дней / PermBan[/color] <br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
        {
      title: 'Сокрытие багов',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил: [Color=Red]2.22[/color]. Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам | [Color=Red] Ban 15 - 30 дней / PermBan[/color] <br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама сторонних ресурсов',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | [Color=Red]Ban 7 дней / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обман АДМ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | [Color=Red]Ban 7 - 15 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Уяз. правил',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил | [Color=Red]Ban 15 - 30 дней / PermBan[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'IC и OCC угрозы',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | [Color=Red]Mute 120 минут / Ban 7 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Угрозы OOC',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пункту правил: [Color=Red]2.37[/color]. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | [Color=Red]Mute 120 минут / Ban 7 - 15 дней. [/color]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп наказаниями',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил: [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера | [Color=Red]Ban 7 - 15 дней [/color][/CENTER]" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Расп. личн. инф',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушитель будет наказан по пункту правил: [Color=Red]2.38[/color]. Запрещено распространять личную информацию игроков и их родственников | [Color=Red]Ban 15 - 30 дней / PermBan + ЧС проекта [/color][/CENTER]" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск проекта',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | [Color=Red]Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Продажа промо',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | [Color=Red]Mute 120 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ЕПП Фура - инк',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | [Color=Red]Jail 60 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Покупка фам.репы',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. | [Color=Red]Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color]<br>" +
        "[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп акс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | [Color=Red]При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '2.53(Названия маты)',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности | [Color=Red]Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса.[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неув обр. к адм',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | [Color=Red]Mute 180 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Баг аним',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.55[/color]. Запрещается багоюз, связанный с анимацией в любых проявлениях. | [Color=Red]Jail 120 минут [/color]<br>" +
                "[Color=Orange]Примечание[/color]: наказание применяется в случаях, когда, используя ошибку, игрок получает преимущество перед другими игроками.<br>" +
                        "[Color=Orange]Пример[/color]: если игрок, используя баг, убирает ограничение на использование оружия в зелёной зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес, перестрелки на мероприятии с семейными контейнерами или на мероприятии от администрации.<br>" +
                                "[Color=Orange]Исключение[/color]: разрешается использование сбива темпа стрельбы в войне за бизнес при согласии обеих сторон и с уведомлением следящего администратора в соответствующей беседе.<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обмен трейдом',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.57[/color]. Запрещается брать в долг игровые ценности и не возвращать их | [Color=Red]Ban 30 дней / permban[/color][/CENTER]<br>" +
        "[Color=Red]Примечание[/color]: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется. В данном случае нарушений со стороны игрока нет.<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
       title: 'Попытка обмана',
       content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
       '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
       "[CENTER]Нарушитель будет наказан, запрещены любые попытки nRP обмана | [Color=Red]PermBan[/color].[/CENTER]<br>" +
       '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'Fake Nick',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [Color=Red]Устное замечание + смена игрового никнейма / PermBan[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'Продажа ИВ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.28[/color]. Запрещена покупка, продажа внутриигровой валюты за реальные деньги в любом виде | [Color=Red]PermBan с обнулением аккаунта + ЧС проекта[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Правила игровых чатов~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Капс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.02[/color]. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color]<br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск в ООС',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Оск/Упом родни',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:[Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | [Color=Red]Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Флуд',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | [Color=Red]Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп знаками',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Редактирование в л/ц',
        content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Запрещено редактировать поданные объявления в личных целях заменяя текст обьявления на несоответствующий отправленному игроком | [Color=Red]Ban 7 дней + Чс Организации[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
        prefix: ACCEPT_PREFIX,
        status: false,
    },


    {
      title: 'Слив СМИ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов | [Color=Red]PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Выдача себя за адм ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь | [Color=Red]Ban 7 - 15 дней.[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ввод в заблуждение',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: 'Музыка в войс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat | [Color=Red]Mute 60 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Шум в войс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: 'ОСК НА ДР.ЯЗЫКЕ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке | [Color=Red]Устное замечание / Mute 30 минут[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Религиозное и политическая пропаганда',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.18[/color].  Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | [Color=Red]Mute 120 минут / Ban 10 дней[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Реклама промо',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | [Color=Red]Ban 30 дней[/color].[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Торговля на тт госс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~Положение об игровых аккаунтах~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Мульти-аккаунт [3+]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.04[/color]. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | [Color=Red]PermBan[/color].<br>" +
            "[Color=Orange]Примечание[/color]: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фейк аккаунт',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | [Color=Red]Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Активность ТК',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил:<br>4.14. Запрещено, имея транспортную или строительную компанию не проявлять активность в игре. | [Color=Red]Обнуление компании без компенсации[/color][/CENTER]<br>" +
            "[Color=Orange]Примечание[/color]: минимальный онлайн для владельцев строительных и транспортных компаний — 7 часов в неделю активной игры (нахождение в nRP сне не считается за активную игру).<br>" +
            "[Color=Orange]Примечание[/color]: если не заходить в игру в течении 5-ти дней, не чинить транспорт в ТК, не проявлять активность в СК - компания обнуляется автоматически.<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/I][/CENTER][/color][/FONT] <br>' +
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Передача жалоб~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Техническому спец.',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: TEX_PREFIX,
      status: true,
    },
    {
      title: 'ГА',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Главному Администратору.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
      status: true,
    },
    {
      title: 'Спец.администратору',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Специальному администратору.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'ГКФ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение Главному Куратору Форума.[/CENTER]<br>" +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: NARASMOTRENII_PREFIX,
      status: true,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Правила Госс.Структур~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Работа в форме',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.07[/color]. Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Исп. фрак т/с в личных целях',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]1.08[/color]. Запрещено использование фракционного транспорта в личных целях | [Color=Red]Jail 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'НПРО [Объявы]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'НППЭ [Эфиры]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | [Color=Red]Mute 30 минут[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Задержание в интерьере',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по данному пункту правил: [Color=Red]2.50[/color]. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий  | [Color=Red]Ban 7 - 15 дней + увольнение из организации[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'ДМ от ГОСС',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.01[/color]. Запрещено наносить урон игрокам без Role Play причины на территории гос.организаций | [Color=Red]Jail 60 минут / Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины [УМВД]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нонрп поведение[УМВД]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.03[/color]. Запрещено nRP поведение | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Штраф | Розыск [ГИБДД]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.02[/color]. Запрещено выдавать розыск, штраф без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины(ГИБДД)',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Лишение В/У во время погони [ГИБДД]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]7.04[/color]. Запрещено отбирать водительские права во время погони за нарушителем | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Розыск без причины [ФСБ]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан по пунтку правил: [Color=Red]8.02[/color]. Запрещено выдавать розыск без Role Play причины | [Color=Red]Warn[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Правила ОПГ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Нарушение правил ВЧ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за нарушение правил нападения на [Color=Orange]Воинскую Часть,[/color] выдаётся предупреждение | [Color=Red]Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нападение на ВЧ через стену',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан нападение на [Color=Orange]Военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома | [Color=Red]Warn NonRP В/Ч[/color][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Похищение | Ограбление',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушитель будет наказан за NonRP Ограбление/Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Кликабельно[/URL][/CENTER]<br>" +
        '[Color=Lime][CENTER]Одобрено, закрыто.[/CENTER][/color] <br> '+
        "[CENTER] Приятной игры на [Color=Red]Black Russia Lime [/I][/CENTER][/color][/FONT]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Отсутствие пунка жалоб~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
     {
         title: 'Уже наказан',
         content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
         '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
         "[CENTER][I][SIZE=5][FONT=courier new] [/FONT][/SIZE][SIZE=4][FONT=courier new]Данный игрок уже наказан.[/FONT][/SIZE][/I][/CENTER]<br>" +
         '[Color=Red][CENTER] Решено! [/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
          prefix: DECIDED_PREFIX,
            status: false,
     },
    {

            title: 'Отыгровка при наручниках',
            content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
            '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][I][SIZE=5][FONT=courier new] [/FONT][/SIZE][SIZE=4][FONT=courier new]При надевании наручников рп отыгровка отыгрывается автоматически.[/FONT][/SIZE][/I][/CENTER]<br>" +
            '[Color=Red][CENTER] Решено! [/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
            prefix: DECIDED_PREFIX,
            status: false,
        },
     {
            title: 'Оск в РП чат',
            content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
            '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
            "[CENTER][B][I][FONT=courier new]Оскорбление в рп чат является рп процессом![/FONT]<br>" +
            '[COLOR=red][FONT=courier new]Решено,закрыто![/FONT][/COLOR][/I][/B][/CENTER] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
            prefix: DECIDED_PREFIX,
            status: false,
        },
    {
      title: 'Нарушений не найдено',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
        },
    {
      title: 'Сборка на док-вах',
 content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]' +
        "[CENTER]Вы используете не оригинальные файлы игры (сборку), поэтому ваша жалоба не подлежит рассмотрению. Так же вы будете наказаны по данному пункту правил: [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | [Color=Red]Ban 15 - 30 дней / PermBan[/color][/CENTER]<br>" +
        "[Color=Orange]Примечание:[/color]: запрещено внесение любых изменений в оригинальные файлы игры. <br>" +
                "[Color=Orange]Исключение:[/color]: разрешено изменение шрифта, его размера и длины чата (кол-во строк). <br>" +
                    "[Color=Orange]Исключение: [/color]: блокировка за включенный счетчик FPS не выдается. <br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
 prefix: UNACCEPT_PREFIX,
 status: false,
     },
    {
      title: '2.28(продажа слотов в фаму, покупка н/з)',
 content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]' +
        "[CENTER]Вы купили/продали внутриигровой валюты за реальные деньги, поэтому ваша жалоба не подлежит рассмотрению. Так же вы будете наказаны по данному пункту правил:  [Color=Red]2.28[/color]. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | [Color=Red]PermBan с обнулением аккаунта + ЧС проекта.[/color][/CENTER]<br>" +
        "[Color=Orange]Примечание:[/color]: любые попытки купить или продать внутриигровую валюту, интересоваться этим у других игроков или обсуждать это – наказуемо. <br>" +
              "[Color=Orange]Примечание:[/color]: нельзя обменивать донат валюту (например, рубли, пополненные через сайт) на игровые ценности и наоборот. <br>" +
                    "[Color=Orange]Пример:[/color]: пополнение донат-счёта другого игрока в обмен на игровую валюту или другие ценности запрещено. <br>" +
                           "[Color=Orange]Примечание:[/color]: продавать или обменивать игровые ценности, которые были куплены за донат-валюту, не запрещено. <br>" +
                                 "[Color=Orange]Исключение: [/color]: покупка игровой валюты или ценностей через официальный сайт разрешена. <br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
     },
    {
      title: 'Недостаточно доказательств',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Дублирование темы',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Дублирование темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Фотохостинги',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx - Imgur - YouTube - Rutube и прочие фото-видео хостинги.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на адм',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на администрацию[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В обжалования',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Обжалование наказаний[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'тема не по форме',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету /time',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Требуются TimeCode',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/CENTER]<br>" +
        '[CENTER][SPOILER="Пример"]<br>' +
        "1:56 - условия сделки<br>" +
        '2:34 - Сделка<br>' +
        "3:50 - Игрок выходит из игры[/SPOILER][/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Заголовок не по форме',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Georgia][I]Заголовок вашей жалобы составлен не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: 'Более 72 часов',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]С момента получения наказания прошло более 72 часов[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: 'Доква через запрет соц сети',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно. <br>" +
            "[Color=Orange]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказ обмен трейдом',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Согласно пункту правил: [Color=Red]2.57[/color]. Запрещается брать в долг игровые ценности и не возвращать их | [Color=Red]Ban 30 дней / permban[/color][/CENTER]<br>" +
        "[Color=Red]Примечание[/color]: займ может быть осуществлен только через зачисление игровых ценностей на банковский счет, максимальный срок займа 30 календарных дней, если займ не был возвращен, аккаунт должника блокируется. В данном случае нарушений со стороны игрока нет.<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нету условий сделки',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужен фрапс + промотка чата.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'В жалобы на Лд',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на лидеров[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Нужна промотка чата',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В таких случаях нужна промотка чата.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Не работают доква',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Не работают доказательства[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Доква отредактированы',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы, предоставьте оригинал доказательств.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'От 3-го лица',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ответный ДМ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видеозапись. Пересоздайте тему и прикрепите видеозапись.[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись сервером/разделом, переподайте жалобу в нужный раздел.[/CENTER]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Обратитесь в жб на сотруд.',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Вы ошиблись разделом, переподайте свою жалобу в раздел жалоб на сотрудников организации.[/CENTER]<br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'TRAY',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Система [Color=Red]/try[/color] не предназначена для игр на деньги, это не команда для определения победителя.[/CENTER]<br>" +
        "[CENTER]Данная команда служит для отыгровки действий (как /me) только имеет шансы на [Color=Lime]Удачно[/color] и [Color=Red]Неудачно[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Док-ва не рабочие',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваши доказательства не рабочие/обрезанные, перезалейте их правильно и без обрезаний.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
        title: 'Не доказать',
        content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
         '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER]На данный момент невозможно доказать вину игрока.[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: 'Дублирование темы 2 раз',
        content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
         '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER]Ответ дан в прошлой жалобе.[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
          prefix: CLOSE_PREFIX,
      status: false,
    },
      {
        title: 'Нет Опры',
        content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
         '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER]В вашей жалобе отсутствуют какие-либо доказательства.[/CENTER]<br>" +
        '[Color=Red][CENTER]Закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Role Play биографии~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
      {
      title: 'Биография одобрена',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT] <br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'есть био на доработке',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]У вас уже имеется RolePlay биография на доработке, работайте там.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {
      title: 'Скопирована',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография скопирована/украдена.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказ [Инфа]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Добавьте больше информации о себе в новой биографии.[/CENTER][/FONT] <br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Заголовок не по форме',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=Georgia][I]Заголовок вашей RolePlay биографии составлен не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи RolePlay биографии[/color].[/CENTER]" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
      title: 'Отказ [3е лицо]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить создание биографии от 3го лица.[/CENTER][/FONT] <br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказ [Ошибки]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить большое количество грамматических ошибок.[/CENTER][/FONT]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказ [Возраст и Дата]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить несовпадение возраста и даты рождения.[/CENTER][/FONT]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Био пустая',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша RolePlay биография практически пуста. Рекомендую подумать над новым сценарием вашего игрового персонажа. Не забудьте ознакомиться с правилами подачи биографии в этом разделе.[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Отказ [18 лет]',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина отказа: минимальный возраст для составления биографии: 18 лет.[/CENTER][/FONT]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'тема не по форме',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша [Color=Red]RolePlay[/color] биография составлена не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи RolePlay биографии[/color].[/CENTER]<br>" +
        '[Color=Red][CENTER]Отказано, закрыто.[/I][/CENTER][/color][/FONT] <br>' +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Role Play ситуации~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'РП ситуация одобрено',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'РП ситуация на доработке',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей РП ситуации[/CENTER] <br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'РП ситуация отказ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП ситуация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций[/CENTER][/FONT] <br>" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~Неофициал. орг~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
dpstyle: 'oswald: 3px;     color: #fff; background: #4ec200; box-shadow: 0 0 2px 0 rgba(0,0,0,0.14),0 2px 2px 0 rgba(0,0,0,0.12),0 1px 3px 0 rgba(0,0,0,0.2); border: none; border-color: #FF6',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП организация получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/CENTER]"+

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП организация получает статус: [Color=Red]Отказано.[/color]<br>Причиной отказа могло послужить какое-либо нарушение из Правила создания неофициальной RolePlay организации.[/CENTER][/FONT]"+

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
          "[CENTER][B][I][FONT=georgia]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прикрепите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/CENTER]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
              prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]<br>' +
        '[Color=rgb(188, 19, 254)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Активность не была предоставлена. Организация закрыта.[/CENTER]" +

        '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER][CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4][/COLOR][/FONT][/CENTER]',
              prefix: UNACCEPT_PREFIX,
      status: false,
    },
  ];

	$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('ОТВЕТЫ', 'selectAnswer', 'border-radius: 11px; margin-right: 8px; border: 3px solid; border-color: rgb(123, 190, 3, 0.5);');
//	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(203, 40, 33, 0.5);');
//  addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 36, 0, 0.5);')
//  addButton('Одобрено', 'accepted', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(152, 251, 152, 0.5);')
//	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(138, 43, 226, 0.5);');
//	addAnswers();

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
    $('button#GA').click(() => editThreadData(GA_PREFIX, true));
    $('button#zakrepleno').click(() => editThreadData(NARASMOTRENII_PREFIX, true));

	$(`button#selectAnswer`).click(() => {
	XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ НУЖНЫЙ ОТВЕТ');
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