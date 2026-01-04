// ==UserScript==
// @name         Для Куратора Администрации 60
// @namespace    http://tampermonkey.net/
// @version      3.9
// @description  Для Куратора Администрации
// @author       Boss_Richardson
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://sun101-1.userapi.com/impg/AGn39HxbHjhD0LQiwRBNDbQYGONTDOei9J4U9w/PMOSOAHbMC4.jpg?size=200x200&quality=96&sign=aac9ce583767da3a28a94d3b11a64c1b&type=album
// @downloadURL https://update.greasyfork.org/scripts/502864/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2060.user.js
// @updateURL https://update.greasyfork.org/scripts/502864/%D0%94%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%2060.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4;
const ACCEPT_PREFIX = 8;
const RASSMOTENO_PREFIX = 9;
const PIN_PREFIX = 2;
const GA_PREFIX = 12;
const COMMAND_PREFIX = 10;
const DECIDED_PREFIX = 6;
const WAIT_PREFIX = 14;
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Текст [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)] Закрыто. [/COLOR][/FONT][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴На рассмотрении╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Запрошу доква(опру)',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Запрошу доказательства у администратора.<br> Не нужно создавать копии этой жалобы, ожидайте ответа в данной теме.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]На рассмотрении.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'На рассмотрении(жб)',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/FONT][/B][/COLOR][/CENTER]<br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передача ЖБ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Для ЗГА ГОСС ОПГ',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение  [Color=rgb(255, 0, 0)] Заместителю Главного Администратора по направлению ГОСС / ОПГ. [/Color] [/FONT][/B][/COLOR][/CENTER] <br><br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Для ОЗГА',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(255, 0, 0)] Основному Заместителю Главного Администратора. [/Color] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для ГА',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(255, 0, 0)]Главному Администратору.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для теха',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение [Color=rgb(178, 34, 34)]Tехническому специалисту.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: TEX_PREFIX,
	  status: 123,
    },
    {
      title: 'для Куратора',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была передана на рассмотрение[Color=rgb(128, 0, 128)]Куратору Администрации.[/COLOR] [/FONT][/B][/COLOR][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(230, 230, 250)]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix:  PIN_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ЖБ одобрена ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Наказание выдано ошибочно',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]С Администратором будет проведена необходимая работа.<br>Ваше наказание будет снято.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(27, 255, 47)]Одобрено.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Будет проведена работа',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] С Администратором будет проведена необходимая работа.<br>Приносим извинения за предоставленные неудобства.[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(250,0 ,0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'СПС ЗА ИНФУ/ПРОВЕДЕНА РАБОТА',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] С Администратором будет проведена необходимая работа.<br>Спасибо за информацию.[/color] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][B][FONT=times new roman][COLOR=rgb(250,0 ,0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'В раздел обжалование',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь в раздел  Обжалование. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на адм',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1570/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL=https://forum.blackrussia.online/forums/Жалобы-на-лидеров.1571/]*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вам было выдано наказание Техническим Специалистом.<br>Обратитесь в технический раздел - [URL=https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tyumen.2639/]*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись разделом.<br>Вам было выдано наказание Техническим Специалистом.<br>Обратитесь в раздел жалоб на технических специалистов[URL=https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9660-tuymen.2640/]*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на сотрудников орги',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на ап',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/threads/novosibirsk-Жалобы-на-Агентов-Поддержки.3498956/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴отказ жб ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
        title: 'Наказание выдано верно',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Aдминистратор предоставил доказательства.<br>Наказание выдано верно.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Бан по IP',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Попробуйте перезагрузить интернет или телефон и снова войти.<br>Проблема должна пропасть.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нарушений не найдено',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'недостаток докв',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Недостаточно доказательств на нарушение от Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Ответ дан в прошлой жб',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ответ уже был дан в прошлой жалобе.<br>За дублирование жалоб, ваш форумный аккаунт может быть заблокирован. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-администрацию.3429349/']с правилами подачи жалоб на администрацию[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет тайма',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]На ваших доказательствах отсутствует /time. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
        title: 'Отсутвуют доква',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Для рассмотрения жалобы необходимы доказательства.<br>Жалобы без доказательств не рассматриваются. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'более 48 часов',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]прошло более 48-ми часов.<br>Ваша жалоба не подлежит рассмотрению. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'маты в жб',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба с подобным содержанием рассматриватся не будет. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нужен фрапс + промотка чата',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В таких случаях нужен фрапс + промотка чата. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'фрапс обрывается',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм снят/ушел псж',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Игрок был снят/ушел с поста администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman] Доказательства не работают. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'доква отредактированы',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваши доказательства отредактированы. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: '3-е лицо',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба от третьего лица не принимается. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не тот сервер',
      content:
		'[CENTER][COLOR=rgb(0, 255, 255)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вы ошиблись сервером.<br> Обратитесь в раздел жалоб на Администрацию вашего сервера. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не написал ник',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Игровой ник автора жалобы, ник Администратора, на которого подается жалоба, должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'не по теме',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к гугл диску',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]К гугл диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/FRpfsF2k/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'закрыт доступ к яндекс диску',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]К яндекс диску закрыт доступ, пожалуйста откройте доступ, либо загрузите доказательства на фотохостинг(YouTube, Япикс, imgur). <br> [SPOILER=Скрин][url=https://postimages.org/][img]https://i.postimg.cc/7YvGNcwR/image.png[/img][/url][/SPOILER] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'уже на рассмотрении',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба такого же содержания от Вас уже находится на рассмотрении.<br> Ожидайте ответа в прошлой жалобе и не нужно дублировать ее. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'прикрепите ссылку на жб',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Прикрепите ссылку на ранее одобренную жалобу в новой теме.[/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'чел выгнал игроков из семьи',
      content:
		'[CENTER][COLOR=rgb(238, 130, 238)][B][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/B][/COLOR][/CENTER] <br><br>' +
        "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Нет ни единого правила по которому игрок может быть наказан за исключение участников из семьи, даже в больших количествах.<br>Вы сами выдали ему высокую должность, советую внимательнее назначать на данную должность людей. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    
];

  $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('ГА', 'Ga');
    addButton('Одобрено ✅', 'accepted');
    addButton('Отказано ❌', 'unaccept');
    addButton('Тех. Специалисту', 'Texy');
    addButton('Рассмотрено', 'Rasmotreno');
    addButton('Закрыто', 'Close');
    addButton('Ответы', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => pasteContent(2, threadData, true));
	$('button#Ga').click(() => pasteContent(8, threadData, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#Texy').click(() => pasteContent(7, threadData, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));


$(`button#selectAnswer`).click(() => {
XF.alert(buttonsMarkup(buttons), null, 'ВЫБЕРИТЕ ОТВЕТ');
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

function addButton(name, id) {
$('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 0px 20px; border-color: green; border-style: dashed solid; margin-right: 7px; margin-bottom: 10px; background: green; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
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
            discussion_open: 0,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
	if(pin == 123){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 1,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}

}


function moveThread(prefix, type) {
// Перемещение темы
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
})();