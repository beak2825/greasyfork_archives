// ==UserScript==
// @name         Black Russia Скрипт для КФ | Magenta
// @description  Для Кураторов Форума
// @namespace    https://forum.blackrussia.online
// @version      1.1.5
// @author       Alex_Meronov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/462113/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%7C%20Magenta.user.js
// @updateURL https://update.greasyfork.org/scripts/462113/Black%20Russia%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%7C%20Magenta.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const buttons = [
	{
	  title: 'На рассмотрении',
      content:
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша Жалоба направляется на Рассмотрение.[/I]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B][I]Ожидайте ответа...[/I][/B]<br><br>' +
'[COLOR=rgb(255, 0, 0)][B]Примечание[/COLOR][COLOR=rgb(255, 0, 0)] - не создавайте идентичных тем, воизбежание блокировки вашего форумного аккаунта (3 и более дней)[/B][/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/COLOR][/RIGHT]',
    },
    {
      title: 'отказано',
      content:
'[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/COLOR][/RIGHT]',
    },
    {
      title: 'одобрено',
      content:
'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/COLOR][/RIGHT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты передачи╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: 'Для ГКФ',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша Жалоба передана на рассмотрение [COLOR=rgb(0, 255, 255)] Главному Куратору Форума.[COLOR=rgb(209, 213, 216)][/I]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B]Ожидайте ответа...[/B]<br><br>' +
'[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=rgb(255, 0, 0)] - не создавайте идентичных тем, воизбежание блокировки вашего форумного аккаунта (3 и более дней)[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: 'Тех.специалисту',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Жалоба направляется на рассмотрение [COLOR=rgb(255, 69, 0)] Техническому Специалисту.[/I]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B]Ожидайте ответа...[/B]<br><br>' +
'[COLOR=rgb(255, 0, 0)]Примечание[/COLOR][COLOR=rgb(255, 0, 0)] - не создавайте идентичных тем, воизбежание блокировки вашего форумного аккаунта (3 и более дней)[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: 'Главному Администратору',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Жалоба направляется на рассмотрение [COLOR=rgb(255, 0, 0)][B] Главному Администратору Сервера. [COLOR=rgb(209, 213, 216)][/I][/B]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B]Ожидайте ответа...[/B]<br><br>' +
'[COLOR=rgb(255, 0, 0)][B]Примечание[/COLOR][COLOR=rgb(255, 0, 0)] - не создавайте идентичных тем, воизбежание блокировки вашего форумного аккаунта (3 и более дней)[/B][/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'САНДЕРУ',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша Жалоба передана на рассмотрение [COLOR=rgb(255, 0, 0)][B] Специальному Администратору.[COLOR=rgb(209, 213, 216)][/I][/B]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B]Ожидайте ответа...[/B]<br><br>' +
'[COLOR=rgb(255, 0, 0)][B]Примечание[/COLOR][COLOR=rgb(255, 0, 0)] - не создавайте идентичных тем, воизбежание блокировки вашего форумного аккаунта (3 и более дней)[/B][/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴БЕЗ ОПР. ПУНКТА╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Не по форме',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[B][I]Ваша Жалоба написана не по форме.[/I][/B]<br><br>' +
"Ознакомьтесь с разделом *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']Правила подачи жалоб на игроков[/URL]*<br><br>" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
	{
      title: 'Дублирование темы',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Дублироване темы.[/B]<br><br><br>' +
'[CENTER][B][I]Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более дней.[/B][/CENTER]<br><br>' +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'Не достаточно док-ва',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>Жалоба содержит недостаточное количество доказательств, предоставьте больше доказательств в следующей жалобе.<br><br>' +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'Нецензурная брань в теме',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>Жалобы с нецензурной бранью рассмотрению не подлежат.<br><br>' +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'Нарушений не найдено',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>Нарушений со стороны данного игрока не было найдено.<br><br>' +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'жб на адм',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br>" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'в обжалование',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Обжалования наказаний».[/CENTER]<br>" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'жб на сотрудников',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на сотрудников» в разделе Государственных организаций.[/CENTER]<br>" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'форма темы',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]<br>" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'Укажите таймкоды',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Укажите таймкоды.[/CENTER]<br>" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'Нет условий сделки',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки.[/CENTER]" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'доки через соц.сети',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно.[/CENTER]" +
'[Color=Red][CENTER]Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>' +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись + промотка чата.[/CENTER]" +
'[Color=Red][CENTER]Отказано, закрыто.[/COLOR][/CENTER]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 2.0-2.54╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: '2.01 Нонрп поведение',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено поведение, нарушающее нормы процессов Role Play режима игры. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.02 Уход от РП',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.03 nRP Drive',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.05 OOC обман',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики. [COLOR=rgb(255, 0, 0)]| PermBan [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.06 Role Play отыгровки в свою сторону',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые Role Play отыгровки в свою сторону или пользу  Запрещены любые Role Play отыгровки в свою сторону или пользу. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.08 Аморальные действия',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена любая форма аморальных действий сексуального характера в сторону игроков. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.09 Слив склада',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.10 Обман в /do',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.11 Использование фракц. т/с в лич. целях',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование рабочего или фракционного транспорта в личных целях. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.12 Затягивание Role Play процесса',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.12.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено целенаправленное затягивание Role Play процесса. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.13 DB',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта. [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.14 RK',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.14.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.15 TK',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины. [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.16 SK',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.16.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.17 PG',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.1.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.18 MG',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.19 DM',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины. [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.20 Mass DM',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более. [COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.21 Обход системы',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.22 Стороннее ПО',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.25 Действия вредящие репутации проекта',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.25.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены попытки или действия, которые могут навредить репутации проекта. [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.26 Нанесение вреда ресурсам проекта',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.26.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее). [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.27 Распространение инфы админ-работ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.27.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта. [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.28 Покупка/продажа ИВ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.28.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги. [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.29 Трансфер имущества',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.29.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен трансфер имущества между серверами проекта. [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.30 Ущерб экономике',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.30.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться нанести ущерб экономике сервера. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.31 Реклама',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.31.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное. [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.32 Обман администрации',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.32.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта. [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.33 Пользование уязвимостью правил',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.33.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пользоваться уязвимостью правил. [COLOR=rgb(255, 0, 0)]| Ban 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.34 Запрещен уход от наказания',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.34.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен уход от наказания. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.35 IC и OOC конфликты о национальности/религии',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.36 Перенос конфликта из IC в OOC и наоборот',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.36.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено переносить конфликты из IC в OOC, и наоборот. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.37 OOC угрозы',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены OOC угрозы, в том числе и завуалированные. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.38 Распространение лич.инфы игроков и их родственников',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.38.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространять личную информацию игроков и их родственников. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.39 Многократ',
	  content:
'[Color=violet][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.39.[/COLOR][COLOR=rgb(209, 213, 216)] Злоупотребление нарушениями правил сервера. [COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.40 Деструктивные действия по отношению к проекту',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.40.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.46 ЕПП',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.46.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на любом транспорте. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.47 ЕПП на фуре',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.47.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора). [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.48 Продажа/покупка репутации семьи',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.48.[/COLOR][COLOR=rgb(209, 213, 216)] Продажа или покупка репутации семьи любыми способами. [COLOR=rgb(255, 0, 0)]| Обнуление рейтинга семьи[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.49 Многократная продажа/покупка репутации семьи',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.49.[/COLOR][COLOR=rgb(209, 213, 216)] Многократная продажа или покупка репутации семьи любыми способами. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan + удаление семьи[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.50 Арест в аукционе',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.50.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона. [COLOR=rgb(255, 0, 0)]|  Ban 7 - 15 дней + увольнение из организации[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.51 Помеха РП',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.51.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.52 nRP Аксессуар',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.52.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.54 Оск администрации, неуважение, неадекват.поведение',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.54.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации. [COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '2.55 Багоюз анимации',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)][I]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/I][/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 3.1-3.21╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: '3.01 Общение не по-русски',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.01.[/COLOR][COLOR=rgb(209, 213, 216)] Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке. [COLOR=rgb(255, 0, 0)]| Устное замечание / Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.02 CapsLock',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.04 ОСК/УПОМ РОДНИ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC). [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.05 Флуд',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.06 Злоуп знаками',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.07 Оскорбление',
	  content:
'[Color=violet][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.07.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '3.08 Слив СМИ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые формы «слива» посредством использования глобальных чатов. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.09 Угрозы наказанием',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые угрозы о наказании игрока со стороны администрации. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.10 Выдача себя за адм',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь. [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 + ЧС администрации[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.11 Ввод в заблуждение командами',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.12 Капс или оффтоп в репорт',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.12.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено подавать репорт с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее).<br><br>' +
'[COLOR=rgb(255, 0, 0)] | Report Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.15 Оск родных в Voice',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорблять игроков или родных в Voice Chat. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.18. Политика',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено политическое и религиозное пропагандирование. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.20 Транслит',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование транслита в любом из чатов. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '3.21. Реклама/упом промокодов',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '3.23. мат в VIP',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.23.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Пункты 4.03-4.09╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: '4.03 ППВ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена совершенно любая передача игровых аккаунтов третьим лицам. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
        title: '4.04 3 акка',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
        title: '4.10 фейк ник',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
        title: '4.13 АФК Бизнес',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено, имея бизнес или автозаправочную станцию (АЗС), заходить в игру только ради его оплаты и не проявлять активность в игре. [COLOR=rgb(255, 0, 0)]| Обнуление владения бизнесом[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
        title: '4.09 Оскорбительный NickName',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные). [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ГОСС╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
	  title: '1.07 нРП ГОСС',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]1.07.[/COLOR][COLOR=rgb(209, 213, 216)] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '4.01 нРП СМИ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактирование объявлений, не соответствующих ПРО. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '6.01 дм in тт мвд',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено наносить урон игрокам без Role Play причины на территории УМВД. [COLOR=rgb(255, 0, 0)]| DM / Jail 60 минут / Warn [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '6.3 НРП ПОВЕДЕНИЕ МВД',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение. [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Примечание: поведение, не соответствующее сотруднику УМВД.[/SIZE][/COLOR]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера. [COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '7.02 РОЗЫСК НРП/ШТРАФ НРП',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]7.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск, штраф без Role Play причины. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера. [COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '7.04 ЗАБИРАТЬ ПРАВА В ПОГОНЕ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]7.04.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено отбирать водительские права во время погони за нарушителем. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера. [COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '8.01 УРОН НА ТТ/ФСБ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]8.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ. [COLOR=rgb(255, 0, 0)]| DM / Jail 60 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера. [COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '9.02 НРП УРОН НА ТТ/ФСИН',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]8.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН. [COLOR=rgb(255, 0, 0)]| DM / Jail 60 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера. [COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '6.02 НРП РОЗЫСК',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск без Role Play причины. [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '2.02 наносение МО/ТТ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено. [COLOR=rgb(255, 0, 0)] | DM / Jail 60 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '4.04 ЗАМЕНА ТЕКАСТА',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком. [COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
      title: '4.02 НРП ЭФИРЫ',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике. [COLOR=rgb(255, 0, 0)]  | Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
    {
	  title: '6.04 нРП Коп',
	  content:
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игрок будет наказан по пункту правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: [/COLOR][COLOR=rgb(0, 255, 0)]Одобрено.[/I][/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Наказание игроку будет выдано в течение суток (24 часа)[/SIZE][/COLOR]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3] Спасибо за обращение.[/SIZE][/COLOR]<br><br>' +
'[RIGHT][COLOR=rgb(209, 213, 216)][B][SIZE=3][COLOR=rgb(0, 255, 255)]С Уважением, Кураторы Форума сервера [/COLOR][COLOR=rgb(255, 51, 255)]"Magenta" (13)[/COLOR][/SIZE][/B][/COLOR][/RIGHT]',
    },
];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('На рассмотрение', 'pin');
	addButton('Одобрено', 'accepted');
    addButton('Передача ГА', 'accepted');
	addButton('Отказано', 'unaccept');
	addButton('Выбрать💥', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 0) {
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

	if(send == true){
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
	  ? 'Доброе утро'
	  : 11 < hours && hours <= 15
	  ? 'Добрый день'
	  : 15 < hours && hours <= 21
	  ? 'Добрый вечер'
	  : 'Доброй ночи',
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