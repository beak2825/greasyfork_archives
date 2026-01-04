// ==UserScript==
// @name         Moscow | Скрипт для Кураторов Форума "Без Жалоб" [by Maxim_Bryanskiy]
// @namespace    https://forum.blackrussia.online
// @version      3.6
// @description  По вопросам(ВК): https://vk.com/maximdashunin
// @author       Maxim_Bryanskiy
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://sun6-20.userapi.com/s/v1/ig2/3pIH5btgFfRAlhUtce935X9TBO2ax6ElkVCDFOzFUIbhnZ6BOofFVLDrH1RwB2AsWjiXJ-i1VbTvd9-_cgDEQCIw.jpg?size=500x500&quality=95&crop=0,0,500,500&ava=1
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/475844/Moscow%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%22%D0%91%D0%B5%D0%B7%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%22%20%5Bby%20Maxim_Bryanskiy%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/475844/Moscow%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%B2%20%D0%A4%D0%BE%D1%80%D1%83%D0%BC%D0%B0%20%22%D0%91%D0%B5%D0%B7%20%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%22%20%5Bby%20Maxim_Bryanskiy%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const buttons = [
   {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~РП биографии~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    },
      {
      title: 'Одобрено',
      content:

		 "[CENTER][COLOR=#E0E0E0]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
         '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]'+
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix:ACCEPT_PREFIX,
	  status: true,
    },
        {
      title: 'Отказано',
      content:
	    "[CENTER][COLOR=#E0E0E0]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
       '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано.[/CENTER][/color][/FONT]'+
       "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX ,
	  status:  true,
    },
    {
     title: '~~~~~~~~~~~~~~~~~~~~~~~~~РП биографии дополнения~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~',
    },
    {
      title: ' дополните детство',
      content:
		"[CENTER][COLOR=#E0E0E0]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=#E0E0E0]Вам даётся 24 часа на дополнение пункта Детство.[/COLOR][/CENTER]<br>" +
                        '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color]'+

            "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт юность и взрослая жизнь',
      content:
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Юность и взрослая жизнь[/color][/CENTER]" +
         '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color][/FONT]'+
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт настоящее время',
      content:
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Настоящее время[/color][/CENTER]" +
        '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color][/FONT]'+
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: 'дополните хобби',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Хобби[/color][/CENTER]" +
        '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color][/FONT]'+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
       status: false,
    },
    {
      title: ' некорректный возраст',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на исправление пункта возраст[/color][/CENTER]" +
        '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color][/FONT]'+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
       status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
   {
      title: 'Отказано,дубль тема',
      content:
	    "[CENTER][COLOR=#E0E0E0]Доброго времени суток уважаемый {{ user.name }}[/COLOR][/CENTER]<br><br>"+
       '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано.[Color=#E0E0E0]Причиной отказа послужило - Дублирование РП биографии.[/CENTER][/color][/FONT]'+
       "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX ,
	  status:  true,
    },
        {
      title: 'отказ не выполнение условий',
      content:
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - не выполение условий выше[/FONT][/color][/CENTER]'+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ заголовок',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. “[/FONT][/color][/CENTER]" +
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ нонрп ник',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/FONT][/color][/CENTER]" +
           "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ нижнее подчеркивание в нике',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.[/FONT][/color][/CENTER]" +
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ не от 3-го лица',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Биография должна быть написана от третьего лица персонажа.[/FONT][/color][/CENTER]" +
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ более чем 1 рп био на 1 акк',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено создавать более чем одной биографии для одного игрового аккаунта.[/FONT][/color][/CENTER]"+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ био известных лиц',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.[/FONT][/color][/CENTER]"+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
	  status: false,
    },
    {
      title: 'Отказ копипаст',
      content:
		  "[CENTER][COLOR=#FFFFFF]Доброго времени суток уважаемый {{ user.name }} [/COLOR][/CENTER]<br><br>"+
       "[CENTER][COLOR=#FFFFFF] Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/color][/CENTER]"+
        "[Color=#E0E0E0] [CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color]",
	   prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: ' отказ приписывание супер способностей',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено приписывание своему персонажу супер-способностей.[/FONT][/color][/CENTER]" +
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ много ошибок',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило многочисленные грамматические ошибки[/FONT][/color][/CENTER]" +
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'Отказ мало информации',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Малое количство информации в вашей РП биографии.[/FONT][/color][/CENTER]" +
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
         {
      title: ' отказ не по форме',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено писать не по форме, с правилами подачи РП биографий можете ознакомится тут: [URL='https://forum.blackrussia.online/threads/moscow-Правила-создания-и-форма-role-play-биографии.1809168/']Правила подачи РП биографий. [/URL][/FONT][/color][/CENTER]" +
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]"+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение вашей РП ситуации[/color][/CENTER]" +
        '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color][/FONT]'+
         "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'РП ситуация отказ',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа могло послужить какое-либо нарушение из [URL=https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1809166]Тык[/URL][/color][/CENTER][/FONT]"+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Организация Одобрено',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]' +
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW![/CENTER][/color][/FONT]",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение вашей Неофициальной Организации[/color][/CENTER]" +
        '[Color=#FE9800][CENTER]На рассмотрении[/CENTER][/color][/FONT]'+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
      
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0)][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.1809163/']Правила создания неофициальной RolePlay организации[/URL].[/color][/CENTER][/FONT]"+
           "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету стартового состава',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Для создания своей организации, её лидер должен иметь стартовый состав от 3+ человек, которые уже зарегистрированы на проекте.[/color][/CENTER][/FONT]"+
           "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету истории орг',
      content:
                '[CENTER] [url=https://postimages.org/][img]https://i.postimg.cc/kMkXT6nb/332711cd26646a01d923c3fdebe523bb.png[/img][/url][CENTER] '+
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0)][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - В теме должна быть описана история появления организации, её дальнейшие занятия.[/color][/CENTER][/FONT]"+
          "[Color=#F08080][FONT=times new roman][CENTER] Приятной игры на сервере MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ плохое оформление',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000k]Отказано. [/color]Причиной отказа послужило - Оформление темы должно быть опрятным, если текст будет не читабелен, проверяющий вправе отклонить вашу заявку, переместив её в специальную тему.[/color][/CENTER][/FONT]"+
           "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ некорректное название',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Название темы должно быть по форме Название организации| Дата создания.[/color][/CENTER][/FONT]"+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. активность╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#FF4500][FONT=times new roman][CENTER]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/color][/CENTER]"+
             "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
              prefix: PIN_PREFIX,
	 status: true
,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Активность небыла предоставлена. Организация закрыта.[/color][/CENTER]"+
          "[Color=#E0E0E0][FONT=times new roman][CENTER] Приятной игры на сервере [Color=#FF0000]MOSCOW! [/CENTER][/color][/FONT]",
              prefix: UNACCEPT_PREFIX,
	  status: false,
    },
            ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Одобрить', 'accepted');
        addButton('Отказать', 'unaccept');
        addButton('На рассмотрение', 'pin');
        addButton('Рассмотрено', 'watched');
        addButton('ГА', 'mainAdmin');
        addButton('Меню', 'selectAnswer');

        // Поиск информации о теме
        const threadData = getThreadData();

        $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

        $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
            buttons.forEach((btn, id) => {
                if(id > 1) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 30px; margin-right: 7px;">${name}</button>`,
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