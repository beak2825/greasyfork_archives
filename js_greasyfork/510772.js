// ==UserScript==
// @name         Жалобы ответы кфг
// @namespace    https://forum.1wmobile.gg/index.php
// @version      1.1.1
// @description  Специально для 1wMobile
// @author       D.Portego
// @match        https://forum.1wmobile.gg/index.php*
// @include      https://forum.1wmobile.gg/index.php
// @icon         https://icons.iconarchive.com/icons/bokehlicia/captiva/256/rocket-icon.png
// @grant        none
// @license      MIT
// @supportURL   - https://discord.gg/2V4GCJGaVN
// @downloadURL https://update.greasyfork.org/scripts/510772/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%D0%BA%D1%84%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/510772/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%D0%BA%D1%84%D0%B3.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const UNACCEPT_PREFIX = 4;
    const ACCEPT_PREFIX = 8;
    const GA_PREFIX = 9;
    const CLOSED_PREFIX = 5;
    const data = await getThreadData(),
     greeting = data.greeting,
     user = data.user;
    const BUTTONS_PER_PAGE = 3; // Количество кнопок на странице
     let currentPage = 1; // Текущая страница


    const buttons = [
        {
            title: `______________________________________ЖБ на АДМИНОВ__________________________________________`,

        },
        {
            title: `Нет доказательств`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>` +
                     `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>` +
                     `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>` +
                     `[COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
              },
      {
             title: `Мало доказательств`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые потверждают нарушение администратора.<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на сервере Victoria [/COLOR][/CENTER]<br><br>`,
             prefix: UNACCEPT_PREFIX,
             status: false,
      },
      {
          title: `Нарушений нет`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Исходя из приложеных вами доказательств, нарушения со стороны админисрации отсутствуют.<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на серверае Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
             prefix: UNACCEPT_PREFIX,
             status: false
           },
      {
          title: `Администратор наказан`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>` +
        `Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
        title: `Отказ - Предоставлены док-ва`,
	   content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
       `[CENTER]Наказание выдано верно![/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	   prefix: UNACCEPT_PREFIX,
	   status: false,
        },
    {
        title: `Прошло 72 часа`,
	  content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 72 часов.[/CENTER]<br>` +
      `[CENTER]Попробуйте обжаловать наказание` +
      `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false
        },
      {
	   title: `На рассмотрении (док-ва)`,
	   content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]Запросил доказательства у администратора.<br>`+
         `Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>`+
         `[COLOR=rgb(251, 160, 38)]На рассмотрении. Приятной игры на сервере Victoria[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
	   prefix: UNACCEPT_PREFIX,
	   status: true,
      },
      {
	   title: `На рассмотрении руководство`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении у руководства сервера.[/CENTER]<br>` +
         `[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>` +
	 	`[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении. Приятной игры на сервере Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
       prefix: UNACCEPT_PREFIX,
	   status: true,
      },
       {
         title: `Администратор наказан строго`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Администратор будет строго наказан, так же с ним будет проведена профилактическая беседа.<br>` +
        `Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br><br>`+
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `От 3-его лица`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба создана от третьего лица.[/CENTER]<br>` +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
            title: `Окно бана`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на сервере Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
    },
	 {
	   title: `Жалоба не по форме`,
	   content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	 	`[CENTER]Жалоба составлена не по форме.<br>`+
         `Внимательно прочитайте правила составления жалобы - [URL='https://forum.1wmobile.gg/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.606/']*ТЫК*[/URL]<br><br>` +
	 	`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	   prefix: UNACCEPT_PREFIX,
	   status: false,
	 },
    {
        title: `Опра в соц сети (отказ)`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Пожалуйста внимательно прочитайте тему «[URL='https://forum.1wmobile.gg/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.606/']Правила подачи жалоб на администрацию[/URL][B]»[/B]<br><br>`+
        `И обратите своё внимание, на данный пункт правил:[/SIZE][/CENTER][/FONT]`+
        `[QUOTE][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]1.1. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur, ВКвидео).[/SIZE][/CENTER][/QUOTE]`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на сервере Victoria[/COLOR][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
        title: `Не туда написана`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба ознакомится с назначением данного раздела в котором Вы создали тему.<br>`+
            `Ваш запрос никоим образом не относится к предназначению данного раздела.<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на сервере Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {
        title: `Администратор снят (наказание будет снято)`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER] Администратор был снят/ушел по собственному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
            `[CENTER][COLOR=rgb(0, 255, 0)]Рассмотрено. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
	 {
	    title: `Смена IP адресса`,
	    content:
		    `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
		    `[CENTER]Дело в вашем айпи адресе. <br>` +
            `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
            `Ваш аккаунт не в блокировке<br><br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	    prefix: UNACCEPT_PREFIX,
	    status: false,
    },
	 {
	  title: `Бред в жалобе`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба не содержит в себе смысла.<br>` +
        `Рассмотрению не подлежит.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	 {
	   title: `Ошибка от администора (Игровая)`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	 	`[CENTER]Администратор совершил ошибку.<br>` +
         `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
	 	`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	   prefix: ACCEPT_PREFIX,
	   status: false,
	 },
	{
	  title: `Ошибка от администора (Форум, дс и т.д)`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Администратор ошибся, с ним будет проведена профлактическая беседа<br>` +
        `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,

        title: `________________________________________________ПЕРЕАДРЕСАЦИИ_________________________________________________`,
    },
    {
	  title: `В раздел жалоб на игроков`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на игроков.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на лидеров<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: `Жалобу на теха`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
      {
	  title: `Передать Куратору Адм`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Куратору Администрации —  [user=236238]Danya_Portego[/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
      prefix: UNACCEPT_PREFIX,
	  status: true,
	},
     {
	   title: `Передать ГА`,
	  content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Главному Администратору — [user=236232]Mikhail_Portego[/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении. Приятной игры на сервере Victoria[/COLOR][/CENTER]<br>`,
       prefix: UNACCEPT_PREFIX,
       status: true,
	 },
     {

          title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Нонрп поведение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.8[/COLOR]. NonRP поведение (поведение или действия игрока, которые маловероятны в реальной жизни) [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп вождение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.19[/color]. NonRP езда (таран или езда по полям на транспорте, который не предусмотрен для этого). [Color=Red]| Jail 20 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
       title: `NonRP Обман`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]5.2[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| ban 30 / PermBan[/color].[/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ACCEPT_PREFIX,
       status: false,
     },
    {
      title: `РК`,
      content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.16[/color]. Убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут (RK). [Color=Red]| Warn + Jail 120 минут[/color][/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
      {
        title: `MG`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.10[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 20 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
       title: `ДМ`,
       content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.11[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 40 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
         prefix: ACCEPT_PREFIX,
         status: false,
    },
     {
       title: `Масс ДМ`,
       content:
       `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.13[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Jail 120 минут[/color].[/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ACCEPT_PREFIX,
       status: false,
    },
     {
       title: `ДБ`,
       content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
     `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.12[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 40 минут[/color][/CENTER]<br><br>` +
    `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ACCEPT_PREFIX,
     status: false,
   },
    {
      title: `Стороннее ПО`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил:<br> [Color=Red]4.1[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]|  Ban 365 / PermBan[/color] <br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама сторонние ресурсы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.3[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 365 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от наказания`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.5[/color]. Запрещен уход от наказания [Color=Red]| Наказание На усмотрение ст. администрации [/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Злоуп наказаниями`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]7.7[/color]. Администратор имеет право увеличивать тяжесть наказания за систематическое нарушение одного и того же правила игроком. [Color=Red]| На усмотрение ст.администрации [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ЕПП Фура`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.19[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 20 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Неув обр. к адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.6[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут / ban от 3 ло 7[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
      },
 // Другие кнопки можно добавлять здесь...
        ];
    $(document).ready(() => {
        $('body').append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);
        // Добавление кнопки "Ответы"
        addButton(`Ответы`, `button-answers`);
        // Обработка клика по кнопке "Ответы"
        $(`button#button-answers`).click(() => {
            showResponseModal();
        });
        // Создание модального окна для остальных кнопок
        createModal();
        // Добавление кнопок в модальное окно
        buttons.forEach((btn, index) => {
            addModalButton(btn.title, index);
        });
    });
    function addButton(name, id) {
        $(`.button--icon--reply`).before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
        );
    }
    function createModal() {
        const modalHTML = `
            <div id="response-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); z-index:9999;">
                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:lightgray; color:black; padding:20px; border-radius:10px; box-shadow: 0 0 15px rgba(0,0,0,0.5);">
                    <h2 style="margin: 0 0 10px;">Выберите действие:</h2>
                    <div id="modal-buttons"></div>
                    <button id="close-modal" style="margin-top: 10px; padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Закрыть</button>
                </div>
            </div>
        `;
        $('body').append(modalHTML);
        // Обработка клика по кнопке закрытия модального окна
        $('#close-modal').click(() => {
            $('#response-modal').hide();
        });
    }
    function showResponseModal() {
        $('#response-modal').show();
    }
    function addModalButton(name, index) {
       const buttonHTML = `
    <button class="modal-button" id="modal-button-${index}" style="margin: 5px; padding: 5px 10px; font-size: 12px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">
        ${name}
    </button>
        `;
        $('#modal-buttons').append(buttonHTML);
        $(`#modal-button-${index}`).click(() => pasteContent(index, data, true));
    }
    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();
        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);
        if (send === true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }
    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Доброе утро`
            : 11 < hours && hours <= 15
                ? `Добрый день`
                : 15 < hours && hours <= 21
                    ? `Добрый вечер`
                    : `Доброй ночи`;
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
        };
    }
    function editThreadData(prefix, pin = false) {
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;
        fetch(`${document.URL}edit`, {
            method: `POST`,
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: `json`,
            }),
        }).then(() => location.reload());
    }
    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();