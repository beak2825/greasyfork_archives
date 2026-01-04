// ==UserScript==
// @name         РАБОТА С ФОРУМОМ | РУСЬ МОБАЙЛ
// @namespace    https://forum.russia-game.ru/*
// @version      1.7
// @description  Помощь с форумом от администрации 1-го сервера
// @author       Команда РУСЬ МОБАЙЛ
// @match        https://forum.russia-game.ru/*
// @include      https://forum.russia-game.ru/
// @grant        none
// @license 	 MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/521594/%D0%A0%D0%90%D0%91%D0%9E%D0%A2%D0%90%20%D0%A1%20%D0%A4%D0%9E%D0%A0%D0%A3%D0%9C%D0%9E%D0%9C%20%7C%20%D0%A0%D0%A3%D0%A1%D0%AC%20%D0%9C%D0%9E%D0%91%D0%90%D0%99%D0%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/521594/%D0%A0%D0%90%D0%91%D0%9E%D0%A2%D0%90%20%D0%A1%20%D0%A4%D0%9E%D0%A0%D0%A3%D0%9C%D0%9E%D0%9C%20%7C%20%D0%A0%D0%A3%D0%A1%D0%AC%20%D0%9C%D0%9E%D0%91%D0%90%D0%99%D0%9B.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const RESHENO_PREFIX = 3;
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 5; // Prefix that will be set when thread solved
  const COMMAND_PREFIX = 6; // Prefix that will be set when thread solved
  const GA_PREFIX = 7;
  const WATCHED_PREFIX = 9;
  const buttons = [
      {
        title: '----------------------------------------------------Жалобы на игроком-----------------------------------------------------'
      },
      {
        title: '====================================================Отказанные жалобу=================================================='
      },
      {
        title: 'Игрок уже наказан',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Данный игрок уже наказан[/COLOR][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)[/color].[/size][/font][/CENTER]'+
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      },
      {
        title: 'Недостаточно док-в',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Недостаточно доказательств для выдачи наказания игроку.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Нет нарушений',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MSСо стороны игрока нет нарушений[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Дубликат жалобы',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Данная жалоба является дубликатом вашей прошлой жалобы.[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: UNACCEPT_PREFIX,
      status: false,
      },
      {
        title: '====================================================Основные правила=================================================='
      },
      {
        title: 'Оск администрации',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]2.5 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]2.5 Запрещено хамское отношение, оскорбление, попытка дискредитации, клевета или обман администрации сервера, а также оскорбление проекта. | [color=rgb(255,0,0)] Блокировка репорта до 180 минут / Блокировка аккаунта от 3 до 7 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Продажа за реальные средства',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]3.4 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]3.4 Запрещена попытка покупки/продажи, а также покупка/продажа игрового имущества/аккаунта(-ов) за реальную валюту. | [color=rgb(255,0,0)] Бан на 15-30 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Трансфер',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]3.8 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]3.8 Запрещено передавать бизнес на другой аккаунт за стоимость ниже, чем 50% от стоимости покупки, тем самым обходя систему, а также содержать бизнес за счет других игроков. | [color=red] Бан до 30 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Нарушение стандарта ролевой игры',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.1 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.1 Запрещены действия, которые нарушают стандарты ролевой игры. | [color=red] Деморган до 30 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,   
      },
      {
        title: 'Читы',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.6 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.6 Запрещено хранить, использовать и распространять любые программы, дающие преимущество над другими игроками (читы, скрипты и другие сторонние программы), а также использовать недоработки или баги игрового мода для получения выгоды или преимущества над другими игроками. | [color=red] Бан 15 - 30 дней / Вечная блокировка + ЧСП[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      },  
      {
        title: 'Уход от РП',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.4 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.4 Запрещено избегать и уходить из RP ситуации путём отказа продолжить ситуацию, выхода из игры, АФК или в недоступный для других интерьер, а также в воду. | [color=red] Деморган до 30 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      }, 
      {
        title: 'Отыгровки в свою сторону',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.3 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.3 Запрещено использовать отыгровку в свою пользу. | [color=red] Деморган до 30 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,    
      }, 
      {
        title: 'AFK no ESC',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Приветствую, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.8[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.8 Запрещено находиться в AFK без активации режима ESC или создание помехи для других игроков. | [color=red] Кик[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Аморальные действия',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.5[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.5 Запрещены любые формы аморального, сексуального поведения в отношении других игроков без их согласия. | [color=red]Бан 1-7 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      
      {
        title: 'Выдача себя за администратора',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.14 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.14 Запрещено выдавать себя за администратора, а так-же угрожать наказанием от администрации | [color=red]Блокировка чата до 60 минут / Блокировка аккаунта на 3-7 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'NRP акс',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.7 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.7 Запрещено размещать аксессуары на теле персонажа таким образом, что это нарушает нормы морали и этики, а также увеличивать аксессуары до слишком больших размеров. | [color=red] Деморган до 15 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Caps, Flood, Злоуп символами',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255,200,0)]4.17[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.17 Запрещено повторять однотипные сообщения более двух раз подряд (Флудить), чрезмерно использовать верхний регистр (CapsLock) и чрезмерно использовать знаки препинания и другие символы. | [color=red] Блокировка чата до 30 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Реклама не официальных ресурсов',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.10 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.10 Запрещено рекламирование других проектов, серверов, сайтов, своих каналов | [color=red] Бан на 15-30 дней / Бан навсегда + ЧСП[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Оскорбительное название семьи',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.9[/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.9 Запрещено в названии семьи использовать нецензурные выражения, любого вида оскорбления (родных/адм./игроков/нации и проч.), нарушающие правила проекта, а также названия уже существующих семей на сервере. | [color=red] Предупреждение / Удаление семьи[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Реклама промокода, семей, бизнесов',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.11 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.11 Запрещена реклама промокодов/семьи и бизнеса | [color=red] Блокировка чата до 30 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Межнациональная травля',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго вресени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.13  [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.13 Запрещено подстрекательство или пропагандирование к межнациональной вражде или травле других игроков. | [color=red] Блокировка чата до 120 минут / Блокировка аккаунта на 7-15 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Упом/Оск родных',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.15 [/color][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.15 Запрещено упоминать, оскорблять родителей и родственников, разглашать различную личную информацию игрока, а также прямые и завуалированные OOC угрозы. | [color=red] Блокировка чата до 120 минут / Блокировка аккаунта на 7-15 дней[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      },
      {
        title: 'Помеха через Voice',
        content:
  '[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS]Игрок понесет наказание, согласно пункту правил: [color=rgb(255, 0, 0)]4.16[/color] [/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][SPOILER="Пункт из правил"]4.16 Запрещено намеренно создавать помеху игровому процессу через голосовой чат | [color=red] Блокировка чата до 120 минут[/color][/SPOILER][/size][/font][/CENTER]<br><br>' +
  '[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]С уважением, Администрация [COLOR=rgb(255,200,0)]РУСЬ Mobile[/color].[/size][/font][/CENTER]',
      prefix: ACCEPT_PREFIX,
      status: false,
      }, 
      {
        title: '-------------------------------------------------Раздел жалоб на администрацию------------------------------------------------'
      },
     {
      title: 'Админ выдал наказание верно',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Администратор выдал наказание верно[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Админ не нарушает',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Со стороны администратора нарушений нет[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Админ выдал неверно/нету док-в на наказание',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Администратор выдал наказание неверно.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Наказание будет снято.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Амнистия отказ',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]В данный момент руководство не готово смягчить ваше наказание.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][COLOR=rgb(0, 255, 21)]Одобрено[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'В снятие ЧС отказано',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]В данный момент руководство не готово пройти к вам на встречу и снять ваш черный список.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Проявите хороший актив на других должностях проекта что-бы руководство пошло к вам на встречу.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'В снятии ЧС одобрено',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Вы были вынесены из Черного списка.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(94, 255, 0)]Одобрено[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
      title: 'Нечитабельные доказательства',
      content:
'[CENTER][size=15px][font=Trebuchet MS][CENTER]Доброго времени суток, уважаемый игрок [COLOR=rgb(255,200,0)] {{ user.mention }}[/color].[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Нечитабельные доказательства.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS]Пожалуйста, создайте новыю жалобу с более читабельными доказательствами.[/size][/font][/CENTER]<br><br>' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS][COLOR=rgb(255, 0, 0)]Отказано[/color].[/size][/font][/CENTER]' +
'[CENTER][size=15px][font=Trebuchet MS][size=15px][font=Trebuchet MS]Приятной игры на [COLOR=rgb(255,200,0)РУСЬ МОБАЙЛ[/color].[/size][/font][/CENTER]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
  ];
   
    $(document).ready(() => {
      // Загрузка скрипта для обработки шаблонов
      $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
   
      // Добавление кнопок при загрузке страницы
      addButton('На рассмотрении', 'pin');
      addButton('Одобрено', 'accepted');
      addButton('Отказано', 'unaccept');
      addButton('Главному Администратору', 'Ga');
      addButton('Спец.адм', 'teamProject');
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