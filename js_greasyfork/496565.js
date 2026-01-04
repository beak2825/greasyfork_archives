// ==UserScript==
// @name         маратик сотка
// @namespace    https://forum.blackrussia.online/
// @version      2.32
// @description  Скрипт для Руководства сервера | Black Russia по всем вопросам на счет скрипта VK - https://vk.com/Extazzy300
// @author      extazzy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @downloadURL https://update.greasyfork.org/scripts/496565/%D0%BC%D0%B0%D1%80%D0%B0%D1%82%D0%B8%D0%BA%20%D1%81%D0%BE%D1%82%D0%BA%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/496565/%D0%BC%D0%B0%D1%80%D0%B0%D1%82%D0%B8%D0%BA%20%D1%81%D0%BE%D1%82%D0%BA%D0%B0.meta.js
// ==/UserScript==

(function () {
'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const GA_PREFIX = 12;
const CLOSE_PREFIX = 7;
const buttons = [
    {
	  title: '------------------------------------------------------------  Обжалования  ------------------------------------------------------------',
	},
	{
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br>' + '[CENTER]                       [/CENTER][/FONT][/SIZE]',
	},
    {
	  title: 'Отправить на рассмотрение',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		'[CENTER][Color=Orange]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Обжалование ник',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваш аккаунт будет разблокирован ровно на 24 часа, если в течении 24 часа Вы не смените свой никнейм, то Вы будете заново заблокированы. Доказательства предоставлять сюда.<br><br>" +
		'[CENTER][Color=Orange]Ожидаю вашего ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	
	  title: 'Не осознали вину',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжалование отказано, в данный момент мы не уверены что Вы осознали свой поступок.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: 'Не готовы пойти на встречу',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжалование отказано, в данный момент мы не готовы пойти на встречу и амнистировать ваше наказание.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown  [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалованию не подлежит',
	  content:
        '[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Мы рады что Вы поняли свой поступок и хотите обжаловать своё наказание, но данное наказание не подлежит обжалованию.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Одобрить обжалование',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование одобрено и Ваше наказание будет полностью снято/заменено.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]<br><br>',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'Отказать обжалование',
	  content:
		'[SIZE=5][FONT=georgia][CENTER] {{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В обжаловании отказано.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	   prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Отстутствуют доказательства',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
	"[CENTER]В Вашем обжаловании отсутствуют доказательства.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Отстутствует скрин окна бана',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Зайдите в игру и сделайте скриншот окна блокировки и приложите в следующей теме. Пример -  [URL='https://imgur.com/mdaW2tO']Кликабельно.[/URL] <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Дублирование тем',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Если Вы дальше будете дублировать темы в данном разделе, то Ваш форумный аккаунт будет заблокирован.<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Обжалование не по форме',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования по этой ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Кликабельно.[/URL].<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Направить в раздел жб на адм',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Если Вы не согласны с выданным наказанием, то Вам нужно обраться в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/']Кликабельно.[/URL]<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/color][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Направить в раздел жб на тех',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с Вашим обжалованием, было решено, что вам нужно обратиться в раздел жалоб на технических специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9655-kursk.2429/']Кликабельно.[/URL] <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Доказательство в соц сети',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'NRP обман 24 часа',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Аккаунт будет разблокирован. если в течении 24-ех часов ущерб не будет возмещён владельцу согласно вашей договоренности акканут будет заблокирован навсегда.[/CENTER]<br><br>" +
		'[CENTER]Вы должны прислать видео доказательство возврата имущества в данную тему.[/CENTER][/FONT][/SIZE]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: 'Игрок вернул ущерб',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Спасибо за содействие, впредь не повтряйте данных ошибок ведь шанса на обжалование больше не будет.[/CENTER]<br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Обжалование оффтоп',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша тема никак не отностится к разделу обжалования наказаний. <br><br>" +
		'[CENTER] Закрыто.  С Уважением [color=red] Заместитель Главного Администратора сервера Vladikavkaz - Angel Brown [/CENTER][/FONT][/SIZE][/color]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
     {
	  title: 'Передать ГА',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование передано [color=red]Главному администратору[/color].[/CENTER]<br><br>" +
		'[CENTER][Color=orange]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: GA_PREFIX,
	  status: true,
	},
     {
	  title: 'Передать СА',
	  content:
		'[SIZE=4][FONT=book antiqua][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваше обжалование передано Специальной администрации.[/CENTER]<br><br>" +
		'[CENTER][Color=#ED7014]Ожидайте ответа.[/CENTER][/FONT][/SIZE][/color]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: '--------------------------------------------------------- Жалобы на игроков(Чаты)  ---------------------------------------------------------',
	},
    {
	  title: 'упом/оск родни',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.04.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [color=red]| Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'другой язык',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.01.[/color] Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [color=red]| Устное замечание / Mute 30 минут[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'капс',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.02.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [color=red]| Mute 30 минут[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'реклама промо',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.21.[/color] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [color=red]| Ban 30 дней[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'выдача себя за адм',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.10.[/color] Запрещена выдача себя за администратора, если таковым не являетесь [color=red]| Ban 7 - 15 + ЧС администрации[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'mg',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.18.[/color] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [color=red]| Mute 30 минут[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'ввод в заблуждение',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.11.[/color] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [color=red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'оск адм',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.54.[/color] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [color=red]| Mute 180 минут[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'флуд',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.05.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [color=red]| Mute 30 минут[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'политика',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]3.18.[/color] Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов [color=red]| Mute 120 минут / Ban 10 дней[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '------------------------------------------------------ Жалобы на игроков(Действия)  ------------------------------------------------------',
	},
    {
	  title: 'дм',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.19.[/color] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [color=red]| Jail 60 минут[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'масс дм',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.20.[/color] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [color=red]| Warn / Ban 3 - 7 дней[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'уход от рп',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.02.[/color] Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [color=red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'помеха рп процессу',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.04.[/color] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [color=red]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'нрп обман',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [color=red]| PermBan[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'софт',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил проекта - [/CENTER]<br>" +
		"[CENTER][color=red]2.22.[/color] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [color=red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'nrp поведение(коп)',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Игрок будет наказан по следующим пунктам правил госсударственных организаций - [/CENTER]<br>" +
		"[CENTER][color=red]6.03.[/color] Запрещено nRP поведение [color=red]| Warn[/color][/CENTER]<br><br>" +
		'[CENTER]Благодарим за обращение. Приятной игры на Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '---------------------------------------------------- Жалобы на игроков(Отказы)  ----------------------------------------------------',
	},
    {
	  title: 'не по форме',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба составлена не по форме. Просьба ознакомиться с правилами подачи по этой ссылке - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']Кликабельно.[/URL]<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: '3 дня',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]С момента нарушения прошло более 72-х часов.<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'через банк счёт',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Долги даются через банк<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'фрапс более 3-х минут',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваш фрапс длится более 3-х минут, просьба в следующей теме предоставить тайм-коды. к<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'плохое качество',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В Вашей видеозаписи плохое качество.<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'фрапс обрывается',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваш фрапс обрывается. <br>" +
		"[CENTER]Загрузите доказательства на YouTube <br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'недостаточно доказательств',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Недостаточно доказательств которые подтверждают нарушения игрока. <br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'нет нарушений',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Нет нарушений со стороны игрока.<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'нет доказательств',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В Вашей жалобе отсутствуют доказательства, просьба загрузить доказательства в фотохостинги(imgur.yapx и т.п).<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'логи',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]К сожалению, мы не можем подтвердить нарушение игрока. <br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'нет тайм',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Отсутствует /time. <br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'доква в соц сетях',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Доказательства в соц сетях не принимаются. Просьба загрузить доказательства в фотохостинги(imgur.yapx и т.п).<br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: 'fraps',
	  content:
		'[SIZE=5][FONT=georgia][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]В таких случаях нужна видеозапись. <br><br>" +
		'[CENTER] Отказано. Приятной игры на сервере Vladikavkaz[/CENTER][/FONT][/SIZE]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
];

$(document).ready(() => {
// Загрузка скрипта для обработки шаблонов
$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

// Добавление кнопок при загрузке страницы
addButton('На рассмотрение', 'pin');
addButton('КП', 'teamProject');
addButton('Одобрено', 'accepted');
addButton('Отказано', 'unaccept');
addButton('Закрыто', 'close');
addButton('Ответы', 'selectAnswer');

// Поиск информации о теме
const threadData = getThreadData();

$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
$('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
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
const threadTitle =
$('.p-title-value')[0].lastChild.textContent;

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