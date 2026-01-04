// ==UserScript==
// @name         BR | ЖБ ADM  Script for Forum
// @namespace    https://forum.blackrussia.online
// @version      1.0.5.17
// @description  Для жёсткого секса
// @author       Carrizo
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license 	 MIT
// @collaborator Carrizo
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @copyright 2021, Carrizo (https://openuserjs.org/users/Carrizo)
// @downloadURL https://update.greasyfork.org/scripts/442372/BR%20%7C%20%D0%96%D0%91%20ADM%20%20Script%20for%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/442372/BR%20%7C%20%D0%96%D0%91%20ADM%20%20Script%20for%20Forum.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const CA_PREFIX = 11;
const buttons = [
	{
	  title: 'Приветствие',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}![/CENTER]<br><br>' +
        "[CENTER] <br><br>" +
		"[CENTER][ICODE] [/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	},
	{
      title: 'Перенаправление в жб на техов',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Администратор является техническим специалистом, напишите на него жалобу в разделе “Жалобы на технических специалистов“[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'Запросить доки',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Запрошу доказательства у администратора.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
	  title: 'Отправить на рассмотрение жалоба',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Ожидайте ответа.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
        	  title: 'Жалоба одобрена в сторону игрока, наказание админу',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей жалобой, ваша жалоба была одобрена.<br>Администратор будет наказан.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Приятной игры на нашем сервере.[/ICODE][/CENTER][/FONT][/SIZE]" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
        	  title: 'Адм наказан , наказание будет снято',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER] Администратор будет наказан, ваше наказание будет снято, просим прощение за предоставленные неудобства.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Приятной игры на нашем сервере.[/ICODE][/CENTER][/FONT][/SIZE]" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
        title: 'Жалоба одобрена в сторону игрока , беседа с админом',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Приятной игры на нашем сервере.[/ICODE][/CENTER][/FONT][/SIZE]" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
         title: 'У админа есть доки',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Назывние жалобы не по форме',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Название жалобы составлено не по форме. Внимательно прочитайте правила составления жалобы [URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-Администрации.193330/]*ТЫК*[/URL].[/CENTER]<br>" +
        "[CENTER]В названии темы необходимо написать: “Nick_Name | Cуть жалобы“[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Жалоба не по форме',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы: [URL=https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-Администрации.193330/]*ТЫК*[/URL][/CENTER] <br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
        title: '3 лицо',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Жалоба поданная от Вас является жалобой от третьего лица, так как Вы не являетесь участником данной ситуации и не можете знать всех подробностей произошедшего.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
         title: 'Дублирование темы',
	  content:
		'[SIZE=4][FONT=Courier New][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
      prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: 'Передано ГА',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER][ICODE]Ваша жалоба будет передана Главному Администратору на рассмотрение. Ожидайте его ответа.[/ICODE][/CENTER][/FONT][/SIZE]",
	  prefix: GA_PREFIX,
	  status: true,
	},
	{
	  title: 'Передано СА',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER][ICODE]Ваша жалоба будет передана Специальному Администратору на рассмотрение. Ожидайте его ответа.[/ICODE][/CENTER][/FONT][/SIZE]",
	  prefix: CA_PREFIX,
	  status: true,
	},
	{
        title: 'Передано главной адм',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER][ICODE]Ваша жалоба будет передана главной администрации на рассмотрение. Ожидайте их ответа.[/ICODE][/CENTER][/FONT][/SIZE]",
	  prefix: PIN_PREFIX,
	  status: true,
	},
	{
     title: 'Срок подачи жалобы истёк',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Внимательно ознакомившись с вашей жалобой, вы получаете ответ отказано, так как срок подачи жалобы истек. <br>" +
        "[CENTER]3.1. Срок написания жалобы составляет один день (24 часа) с момента совершенного нарушения со стороны администратора сервера.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету док о выдачи наказания',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Нету докозательств о выданном наказании.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: 'Присутвуют редактирования',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Доказательства должны быть в первоначальном виде, без присутствия редактирования с помощью сторонних программ.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету даты выдачи наказания',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Нет скрина даты выдачи наказания.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету даты выдачи наказания /time',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]На доказательствах отсутствует /time.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нету даты выдачи варна',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Прикрепите скриншот даты выдачи наказания через команду /notif[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
    title: 'Мало докозательств',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Недостаточно докозательств.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
    title: 'Ваш ник',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Укажаите ваш никнем.[/CENTER]<br>" +
        "[CENTER]3.5. Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
    title: 'Ник админа',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Укажаите никнейм администнратора.[/CENTER]<br>" +
        "[CENTER]3.5. Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
            {
    title: 'Дата наказания',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Укажите дату наказания.[/CENTER]<br>" +
        "[CENTER]3.5. Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
            {
    title: 'Хостинг',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Доказательства должны быть загружены только на фото/видео хостинги.[/CENTER]<br>" +
        "[CENTER]3.6. Прикрепление доказательств обязательно.[/CENTER]<br>" +
        "[CENTER]Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
            {
    title: 'Игнор репорта',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Чтобы понять всю суть ситуации мне нужно видео доказательство.[/CENTER]<br>" +
        "[CENTER]3.4. Жалобы, в которых требуются доказательства не только скриншотом, но и видео, должны содержать его.[/CENTER]<br>" +
        "[CENTER]Пример: nRP обман, игнорирование репорта, ответный DM и так далее.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: 'Нет смысла',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Данная жалоба не несет в себе никакой смысловой нагрузки и просто отнимает время у администрации.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: 'Нет нарушений со стороны адм',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
   {
	  title: 'Ошибся сервером',
	  content:
		'[SIZE=4][FONT=courier new][CENTER]{{ greeting }}, уважаемый {{ user.mention }}[/CENTER]<br><br>' +
		"[CENTER]Вы ошиблись сервером обратитесь в свой сервер в тему жалобы на администрацию.[/CENTER]<br><br>" +
		"[CENTER][ICODE]Закрыто.[/ICODE][/CENTER][/FONT][/SIZE]<br><br>" +
        "[LEFT][SIZE=4][FONT=courier new]Связь со мной:<br>" +
        "VK: [URL='https://vk.com/66moonlight6']@66moonlight6(Кликабельно)[/URL]<br>" +
        'Discord: Alive#7456[/FONT][/SIZE][/LEFT]',
	  prefix: CLOSE_PREFIX,
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
    addButton('Рассмотрено', 'watched');
	addButton('Отказано', 'unaccept');
    addButton('Закрыто', 'close');
    addButton('га', 'ga');
    addButton('тех', 'tex');
    addButton('са', 'ca');
	addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#watched').click(() => editThreadData(WATCHED_PREFIX, false));
    $('button#close').click(() => editThreadData(CLOSE_PREFIX, false));
    $('button#ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#tex').click(() => editThreadData(TEX_PREFIX, true));
    $('button#ca').click(() => editThreadData(CA_PREFIX, true));

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
