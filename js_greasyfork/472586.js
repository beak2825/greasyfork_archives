// ==UserScript==
// @name         Skript КФ | без жалаб
// @namespace   https://forum.blackrussia.online
// @version      2.4.3
// @description  KF SKRIPT Moscow
// @author       Sasha_Gribok
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/threads/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472586/Skript%20%D0%9A%D0%A4%20%7C%20%D0%B1%D0%B5%D0%B7%20%D0%B6%D0%B0%D0%BB%D0%B0%D0%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/472586/Skript%20%D0%9A%D0%A4%20%7C%20%D0%B1%D0%B5%D0%B7%20%D0%B6%D0%B0%D0%BB%D0%B0%D0%B1.meta.js
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
        content:
        '[SIZE=4][COLOR=rgb(139, 69, 19)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
        {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'одобрено',
      content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]<br>'+
      "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: ACCEPT_PREFIX,
	  status:  true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии дополнения╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: ' дополните детсво',
      content:
                '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Детство[/color][/CENTER]<br>" +
        "[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>" +
       "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт юность и взрослая жизнь',
      content:
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Юность и взрослая жизнь[/color][/CENTER]<br>" +
        '[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>' +
          "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: PIN_PREFIX,
       status: true,
    },
    {
      title: ' дополните пункт настоящее время',
      content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Настоящее время[/color][/CENTER]<br>" +
        '[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>'+
       "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
    },
    {
      title: 'дополните хобби',
      content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение пункта Хобби[/color][/CENTER]<br>" +
        '[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>'+
         "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: PIN_PREFIX,
       status: false,
    },
    {
      title: ' некорректный возраст',
      content:
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на исправление пункта возраст[/color][/CENTER]<br>" +
        '[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>'+
          "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: PIN_PREFIX,
       status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП биографии отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'отказ не выполнение условий',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - не выполение условий выше[/FONT][/color][/CENTER]<br>'+
          "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '  отказ заголовок',
      content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Заголовок создаваемой темы должен быть написан строго по данной форме: “ RolePlay биография гражданина Имя Фамилия. “[/FONT][/color][/CENTER]<br>" +
          "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ нонрп ник',
      content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено создание Role Play биографии, если у Вас NonRolePlay никнейм.[/FONT][/color][/CENTER]<br>" +
          "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ нижнее подчеркивание в нике',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Никнейм должен быть указан без нижнего подчеркивания на русском как в заголовке, так и в самой теме.[/FONT][/color][/CENTER]<br>" +
  "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ не от 3-го лица',
      content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Биография должна быть написана от третьего лица персонажа.[/FONT][/color][/CENTER]<br>" +
   "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'отказ более чем 1 рп био на 1 акк',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено создавать более чем одной биографии для одного игрового аккаунта.[/FONT][/color][/CENTER]<br>"+
    "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ био известных лиц',
      content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено использовать биографии известных личностей, лидеров, администраторов сервера, разработчиков, руководителей.[/FONT][/color][/CENTER]<br>"+
"[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
	  status: false,
    },
    {
      title: ' отказ копипаси',
      content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено полное и частичное копирование биографий из данного раздела или из разделов RP биографий других серверов.[/FONT][/color][/CENTER]<br>"+
      "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ приписывание супер способностей',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено приписывание своему персонажу супер-способностей.[/FONT][/color][/CENTER]<br>" +
         "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: ' отказ много ошибок',
      content:
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило многочисленные грамматические ошибки[/FONT][/color][/CENTER]<br>" +
       "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
         {
      title: 'Отказ мало информации',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Малое количство информации в вашей РП биографии.[/FONT][/color][/CENTER]<br>" +
    "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
         {
      title: ' отказ не по форме',
      content:
 '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП биография получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Запрещено писать не по форме, с правилами подачи РП биографий можете ознакомится тут: [URL='https://forum.blackrussia.online/threads/moscow-Правила-создания-и-форма-role-play-биографии.1809168/']Правила подачи РП биографий. [/URL][/FONT][/color][/CENTER]<br>" +
    "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴РП ситуации╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'РП ситуация одобрено',
      content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]<br>"+
   "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РП ситуация на дороботке',
      content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение вашей РП ситуации[/color][/CENTER]<br>" +
        '[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>'+
       "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'РП ситуация отказ',
      content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа могло послужить какое-либо нарушение из [URL=https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-role-play-%D1%81%D0%B8%D1%82%D1%83%D0%B0%D1%86%D0%B8%D0%B9.1809166]Тык[/URL][/color][/CENTER][/FONT]<br>"+
     "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг.╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг Одобрено',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        '[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#00FF00]Одобрено.[/CENTER][/color][/FONT]<br>' +
        "[Color=#E0E0E0][FONT=times new roman][/color][/CENTER]Приятной игры [/color][/CENTER]<br>"+
     "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг на дороботке',
      content:
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER][B][I]Вам даётся 24 часа на дополнение вашей Неофициальная Орг[/color][/CENTER]<br>" +
        '[Color=#FF4500][CENTER]На рассмотрении[/CENTER][/color][/FONT]<br>'+
"[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: PIN_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. отказ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'Неофициальная Орг отказ',
      content:
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0)][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа могло послужить какое-либо нарушение из [URL='https://forum.blackrussia.online/index.php?threads/moscow-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BD%D0%B5%D0%BE%D1%84%D0%B8%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B9-roleplay-%D0%BE%D1%80%D0%B3%D0%B0%D0%BD%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8.1809163/']Правила создания неофициальной RolePlay организации[/URL].[/color][/CENTER][/FONT]<br>"+
     "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету стартового состава',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Для создания своей организации, её лидер должен иметь стартовый состав от 3+ человек, которые уже зарегистрированы на проекте.[/color][/CENTER][/FONT]<br>"+
  "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ нету истории орг',
      content:
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0)][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - В теме должна быть описана история появления организации, её дальнейшие занятия.[/color][/CENTER][/FONT]<br>"+
     "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ плохое оформление',
      content:
           '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000k]Отказано. [/color]Причиной отказа послужило - Оформление темы должно быть опрятным, если текст будет не читабелен, проверяющий вправе отклонить вашу заявку, переместив её в специальную тему.[/color][/CENTER][/FONT]<br>"+
       "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Неофициальная Орг отказ некорректное название',
      content:
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Ваша РП ситуация получает статус: [Color=#FF0000]Отказано. [/color]Причиной отказа послужило - Название темы должно быть по форме Название организации| Дата создания.[/color][/CENTER][/FONT]<br>"+
"[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
      prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Неофициал. орг. активность╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
      {
      title: 'Неофициальная Орг запроси активности',
      content:
   '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
	 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#FF4500][FONT=times new roman][CENTER]Ваша неофициальная РП организация может быть закрыта по пункту правил: Неактив в топике организации более недели, он закрывается. Прекрипите отчёт о активности организации в виде скриншотов. Через 24 часа если отчёта не будет или он будет некорректный организация будет закрыта.[/color][/CENTER]<br>"+
 "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
              prefix: PIN_PREFIX,
	 status: true
,
    },
    {
      title: 'Неофициальная Орг закрытие активности',
      content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		 `[COLOR=#E0E0E0][FONT=times new roman][SIZE=4][CENTER] Здравствуйте уважаемый {{ user.name }}[/CENTER]<br>` +
        "[Color=#E0E0E0][FONT=times new roman][CENTER]Активность небыла предоставлена. Организация закрыта.[/color][/CENTER]<br>"+
         "[B][CENTER][COLOR=#E0E0E0]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR].<br><br>",
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