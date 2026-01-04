// ==UserScript==
// @name         Мой скрипт
// @namespace    https://https://forum.matrp.ru
// @version      1.1
// @description  Скрипт для Администрации 14го сервера
// @author       Emiliano Jimenez | Владимир Авдеев
// @match        https://forum.matrp.ru/index.php?threads/*
// @include      https://forum.matrp.ru/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator jimenez
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/485392/%D0%9C%D0%BE%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/485392/%D0%9C%D0%BE%D0%B9%20%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
// ==/UserScript==

(function () {
  'use strict';
const buttons = [
	{
	  title: 'MAIN | Свой ответ с инфой о сервере',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Текст<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
    },
    {
      title: 'MAIN | Свой ответ без инфы',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
'Текст<br><br>',
    },
    {
	  title: '=======================================================================================================',
    },
    {
	  title: 'MAIN | Отчет следящего семей',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]Emiliano Jimenez[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства слежки: Первый, Второй, Третий.[/B][/FONT]<br>" +
'[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Дата отчета: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]хх[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]хх[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]2024[/B][/FONT][COLOR=rgb(255, 255, 255)][FONT=courier new][B].[/B][/FONT][/COLOR][/COLOR]',
    },
    {
	  title: 'MAIN | Отчет о пиаре заявлений',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]1[/B][/FONT][/COLOR][FONT=courier new][B]. Ваш ник: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]Emiliano Jimenez[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
"[COLOR=rgb(61, 142, 185)][FONT=courier new][B]2[/B][/FONT][/COLOR][FONT=courier new][B]. Должность: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]Следящий за семьями[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br>" +
'[COLOR=rgb(61, 142, 185)][FONT=courier new][B]3[/B][/FONT][/COLOR][FONT=courier new][B]. Доказательства: [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]хх[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]хх[/B][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]2024[/B][/FONT][COLOR=rgb(255, 255, 255)][FONT=courier new][B].[/B][/FONT][/COLOR][/COLOR]',
    },
    {
	  title: '=======================================================================================================',
    },
    {
	  title: 'ЖБ | Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Жалоба [/B][/FONT][COLOR=rgb(26, 188, 156)][FONT=courier new][B]одобрена[/B][/FONT][/COLOR][FONT=courier new][B], игрок будет наказан.[/B][/FONT]<br><br>" +
"[COLOR=rgb(26, 188, 156)][FONT=courier new][B]Одобрено[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | На рассмотрении',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Жалоба [/B][/FONT][COLOR=rgb(250, 197, 28)][FONT=courier new][B]на рассмотрении[/B][/FONT][/COLOR][FONT=courier new][B], ожидайте ответа, не дублируйте тему что бы не получить блокировку форумного аккаунта.[/B][/FONT]<br><br>" +
"[COLOR=rgb(250, 197, 28)][FONT=courier new][B]На рассмотрении[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Заголовок не по форме',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Заголовок темы составлен не по форме.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Нет даты времени на доках',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"На ваших доказательствах отсутствуют время или дата.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Недостаточно доков',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"На ваших доказательствах отсутствуют время или дата.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Жалоба от третьего лица',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Жалоба написана от третьего лица.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Фрапс 2+ без тайм кодов',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В доказательствах фрапс более 2-х минут, отсутствуют тайм-коды.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Неадекватное содержание жалобы',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Неадекватное содержание жалобы.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | С момента нарушения прошло 24часа',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"С момента нарушения прошло более 24-х часов.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'ЖБ | Док-ва отредактированы.',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Доказательства содержат в себе момент редактирования.<br>" +
"Ознакомьтесь с правилами подачи жалоб - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-жалобы.66297/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: '=======================================================================================================',
    },
    {
	  title: 'РП БИО | Одобрено',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ваша Role Play биография имеет статус - [/B][/FONT][COLOR=rgb(26, 188, 156)][FONT=courier new][B]одобрено.[/B][/FONT][/COLOR][FONT=courier new][B]Приятной игры[/B][/FONT]<br><br>" +
"[COLOR=rgb(26, 188, 156)][FONT=courier new][B]Одобрено[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | На рассмотрении',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ваша Role Play биография [/B][/FONT][COLOR=rgb(250, 197, 28)][FONT=courier new][B]на рассмотрении[/B][/FONT][/COLOR][FONT=courier new][B], ожидайте ответа, не дублируйте тему что бы не получить блокировку форумного аккаунта.[/B][/FONT]<br><br>" +
"[COLOR=rgb(250, 197, 28)][FONT=courier new][B]На рассмотрении[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Заголовок не по форме',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Заголовок не соответствует правилам.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | В био инфа реальных людей',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В биографии присутствует информация из жизни реального человека.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Скопирована',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Биография скопирована.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Не по шаблону',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Биография написана не по шаблону.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Био не от 3го лица',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В биографии имеется информация от первого лица.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | 1 пункт на англ',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Первый пункт RP биографии (имя, фамилия) должен быть написан на русском языке.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Персонаж не совершеннолетний',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Персонаж должен быть совершеннолетним (18+ лет).<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Много ошибок',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"В тексте биографии имеется много грамматических - пунктуационных ошибок, воспользуйтесь специализированными сайтами для проверки текста.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | Мало информации',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Биография содержит мало информации о персонаже.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
    {
	  title: 'РП БИО | НРП ник',
      content:
'[CENTER][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/GYMNsyB.gif[/IMG][/FONT][/SIZE][/B]<br>' +
"[SIZE=4][FONT=courier new][B][URL='https://vk.com/dirsamp'][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL='https://discord.com/users/366672881712889857'][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [URL='https://t.me/e_jimenez'][IMG]https://i.imgur.com/HUUK9EQ.gif[/IMG][/URL]<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br><br>" +
"Приветствую, уважаемый(-ая) [/B][/FONT][COLOR=rgb(61, 142, 185)][FONT=courier new][B]{{ user.mention }}[/B][/FONT][/COLOR][FONT=courier new][B].<br>" +
"Ваш Nick Name нонРП формата. Смените ник нейм, затем напишите снова биографию.<br><br>" +
"Ознакомьтесь с правилами написания Role Play биографий - [/B][/FONT][COLOR=rgb(226, 80, 65)][FONT=courier new][URL='https://forum.matrp.ru/index.php?threads/Правила-подачи-РП-Биографии.359768/'][B]Кликабельно[/B][/URL][/FONT][/COLOR][FONT=courier new][B].[/B][/FONT]<br><br>" +
"[COLOR=rgb(184, 49, 47)][FONT=courier new][B]Отказано[/B][/FONT][/COLOR][FONT=courier new][B], закрыто.<br><br>" +
"[IMG]https://i.imgur.com/79n14ch.png[/IMG]<br>" +
"[IMG]https://i.imgur.com/q7aG7me.gif[/IMG]<br>" +
'[URL=https://vk.com/matrp_srv14][IMG]https://i.imgur.com/CP5TFzZ.gif[/IMG][/URL] [URL=https://discord.gg/DCcCq5MWdZ][IMG]https://i.imgur.com/OCib3gB.gif[/IMG][/URL] [/B][/FONT][/SIZE][URL=https://forum.matrp.ru/index.php?forums/Матрешка-rp-Сервер-14.418/][B][SIZE=4][FONT=courier new][IMG]https://i.imgur.com/Vn9wWQU.gif[/IMG][/FONT][/SIZE][/B][/URL][/CENTER]',
        status: false,
    },
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
    addButton('💥 | - Открыть кнопки - | 💥', 'selectAnswer');


// Поиск информации о теме
const threadData = getThreadData();

$(`button#selectAnswer`).click(() => {
  XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ(будет отправлено после нажатия):');
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