// ==UserScript==
// @name         SMOLENSK | Скрипт для Кураторов Форума Сервера SMOLENSK (64)
// @namespace    https://forum.blackrussia.online
// @version      2.21
// @description  Скрипт для проверки жалоб
// @author       Andrey Sukhanov :))
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license 	 MIT
// @collaborator none
// @icon   https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/479870/SMOLENSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SMOLENSK%20%2864%29.user.js
// @updateURL https://update.greasyfork.org/scripts/479870/SMOLENSK%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20SMOLENSK%20%2864%29.meta.js
// ==/UserScript==

(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTRENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to Chief Administrator
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to Project Team
const WATCHED_PREFIX = 9;  // Prefix that will be set when thread reviewed by
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closed
const TEX_PREFIX = 13; // Prefix that will be set when thread send to Technical Specialist
const SPEC_PREFIX = 11; // Prefix that will be set when thread send to Special Administrator
const buttons = [
	{
	  title: '----------  Передать жалобу  ------------------------------------------------------------------------------------------------------------------------',
	},
{
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]Здравствуйте, уважаемый игрок[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=lightgrey] Приятной игры и времяпровождение  на сервере «SMOLENSK» [/COLOR][/FONT][/SIZE][/CENTER]`,
	     prefix: PIN_PREFIX,
	     status: true,
	       },
     {
      title: 'ГА',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Главному Администратору сервера.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: GA_PREFIX,
	  status: true,
    },
	{
      title: 'Теху',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Техническому Специалисту сервера.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: TEX_PREFIX,
	  status: false,
    },
	 {
      title: 'КП',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Команде Проекта.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: COMMAND_PREFIX,
	  status: true,
	},
	{
      title: 'Спец Адм',
      content:
	"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба передана на рассмотрение Специальному Администратору или же его Заместителю.<br>" +
		'[B][CENTER]Не нужно создавать копии данной темы.<br>' +
		"[B][CENTER]В противном случае Вам будет выдана блокировка ФА.<br><br>" +
		'[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPEC_PREFIX,
	  status: true,
	},
    {
	  title: '----------  Перенаправить  ---------------------------------------------------------------------------------------------------------------------------',
	},
	{
      title: 'Жалобы на Адм',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Администрацию.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Жалобы на Лд',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Лидеров.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: 'Жалобы на С-ГОС',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в раздел Жалобы На Сотрудников гос. организаций.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'РП Биографии',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Биографии.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
		{
      title: 'РП Ситуации',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, напишите эту тему в раздел РП Ситуации.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Обжалование',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Вы ошиблись разделом, подайте жалобу в Обжалование Наказаний.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
      title: 'Ошиблись разделом',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Вы ошиблись разделом, подайте жалобу в правильный на эту тему раздел.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '----------  ЖБ на игроков  ---------------------------------------------------------------------------------------------------------------------------',
	},
    {
      title: 'Игрок будет наказан',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Игрок будет наказан.Приятной игры на сервере SMOLENSK <br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
     {
      title: 'Отсутствует /time',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В вашей жалобе отсутствует /time.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'От третьего лица',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Жалоба от третьего лица не принимается (жалоба должна быть подана участником ситуации).<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Более 3 дней',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Срок написания жалобы составляет три дня (72 часа) с момента совершенного нарушения со стороны игрока сервера.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Не по форме жалоба',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ваша жалоба состоит не по форме.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нет доказательств',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]К Вашим доказательствам нет доступа. Просьба написать новую жалобу и предоставить доступ к просмотру доказательств.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нарушений не найдено',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Нарушений со стороны игрока не найдено.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Док-ва через соц. сети',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства в социальных сетях и т.д. не принимаются, загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Недостаточно докв',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Недостаточно доказательств на нарушение от данного игрока.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Дублирование темы',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Ранее вам уже был дан корректный ответ на подобную жалобу, просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: 'Нужен фрапс',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]В таких случаях нужна видеофиксация нарушения.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: 'Док-ва отредактированы ',
	  content:
	    "[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Закрыто.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
	  title: '-----  РП Биографии  -----------------------------------------------------------------------------------------------------------------------------------',
	},
     {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',

      prefix: ACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной могло послужить любое нарушение Правил Подачи РП Биографии.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'На дороботке',
      content:
	            "[CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		        "[B][CENTER]В вашей РП биографии мало информации.<br>" +
		        '[B][CENTER]У вас есть 24 часа и исправление.<br>' +
		        "[B][CENTER]В противном случае рп биография будет отказана.<br><br>" +
		        '[B][CENTER][COLOR=yellow][ICODE]На рассмотрении.[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
{
      title: 'возраст не совподает',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=red][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Год рождения и возраст не совподают.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
     {
      title: 'Не по форме',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии не по форме.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'От 3-го лица',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии от 3-го лица.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
         "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило копирование текста / темы.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
{
      title: 'Супергерой',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
         "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило приписание суперспособности своему персонажу / темы.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило дублирование РП Биографии.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Ошибки в словах',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание РП Биографии с грамматическими / орфографическими ошибками.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Заговолок',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание заговолка РП Биографии не по форме.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: '2 Био на 1 Акк',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило написание второй Биографии на один игровой аккаунт, что же запрещено правилами написаний РП Биографий.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Мало текста',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Биография получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило то, что Вы написали мало текста в своей РП Биографии.<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
	  title: '-----  РП Ситуации  -------------------------------------------------------------------------------------------------------------------------------------',
	},
	 {
      title: 'Одобрено',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:<br><br>" +
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено.[/ICODE][/COLOR][/CENTER][/B]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Отказано',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной могло послужить любое нарушение Правил Написания РП Ситуации.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Копипаст',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило копирование текста / темы.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
	 {
      title: 'Дублирование',
      content:
		"[B][CENTER][COLOR=#FF0000][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/CENTER][/B]<br><br>"+
        "[B][CENTER]Ваша РП Ситуация получает статус:<br><br>" +
		'[B][CENTER][COLOR=RED][ICODE]Отказано.[/ICODE][/COLOR][/CENTER][/B]' +
		"Причиной послужило дублирование темы.<br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
  ];

$(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
         addButton(`Выбор автоматических ответов`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
         $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
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
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
            ? `Здравствуйте`
            : 11 < hours && hours <= 15
                ? `Здравствуйте`
                : 15 < hours && hours <= 21
                    ? `Здравствуйте`
                    : `Здравствуйте`

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
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
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
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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