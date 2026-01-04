// ==UserScript==
// @name         Скрипт для Заместителя Главного Администратора 
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Скрипт для ЗГА всех серверов пользуйтесь >3
// @author       Stoyn by Artem_Thankov
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.pinimg.com/564x/43/cd/7c/43cd7c65d590d2f41c05a23f3dfe82d4.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/482528/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/482528/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%97%D0%B0%D0%BC%D0%B5%D1%81%D1%82%D0%B8%D1%82%D0%B5%D0%BB%D1%8F%20%D0%93%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%90%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEXY_PREFIX = 13;
const buttons = [
	{
      title: '--------------------------------------------------------- Жалоба на администрацию ---------------------------------------------------------',
               },
    {
      title: 'свой текст',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]текст<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
        },
    {
      title: 'на рассмотрении',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Запросил доказательства у администратора.<br>' +
		"Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/FONT][/SIZE]<br>"+
        '[B][COLOR=rgb(255, 152, 0)][FONT=verdana][SIZE=4]На рассмотрение.[/SIZE][/FONT][/COLOR]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: PIN_PREFIX,
         status: true,
    },
    {
      title: 'у админа нету доков',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Ваша жалоба была рассмотрена, с администратором будет проведена [/FONT][COLOR=rgb(255, 0, 0)][FONT=verdana]профилактическая беседа.[/FONT][/COLOR]<br>' +
		"[COLOR=rgb(251, 160, 38)][FONT=verdana]Наказание будет снято в скором времени,[/FONT][/COLOR][FONT=verdana] просьба вас ожидать.<br>"+
        'Приносим извинения за предоставленные неудобства.[/FONT][/SIZE]<br><br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено, [/COLOR]закрыто.[/SIZE][/FONT]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
      title: 'админ ошибся',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Ваша жалоба была рассмотрена, с администратором будет проведена [/FONT][COLOR=rgb(255, 0, 0)][FONT=verdana]профилактическая беседа.[/FONT][/COLOR]<br>' +
        'Приносим извинения за предоставленные неудобства.[/SIZE]<br><br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(0, 255, 0)]Одобрено, [/COLOR]закрыто.[/SIZE]<br><br>' +
        "[B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/B][/FONT][SIZE=4] [COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
        prefix: ACCEPT_PREFIX,
        status: false,
    },
     {
      title: 'у админа есть док-ва',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаемый игрок.<br><br>"+
        'Администратор предоставил доказательство вашего нарушения.<br><br>' +
		"Наказание[/SIZE] [COLOR=rgb(251, 160, 38)][SIZE=4]в[/SIZE][/COLOR][/FONT][SIZE=4][COLOR=rgb(251, 160, 38)][FONT=verdana][B]ыдано верно.[/B][/FONT][/COLOR]<br>"+
        '[FONT=verdana][B][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/B][/FONT][/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: '72 часа',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][B][FONT=verdana]С момента выдачи наказания прошло более 72-х часов.[/FONT][/B]<br>' +
		"[FONT=verdana][B][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/B][/FONT][/SIZE]<br><br>"+
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'в жб на теха',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[FONT=verdana][SIZE=4]Вы ошиблись разделом.[/SIZE][/FONT]<br>' +
		'[SIZE=4][FONT=verdana]Подайте жалобу в раздел[/FONT][/SIZE] [URL="https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9655-kursk.2429/"][FONT=verdana][COLOR=rgb(0, 168, 133)][SIZE=4]"Жалобы на технических специалистов"[/SIZE][/COLOR][/FONT][/URL]<br>' +
        '<br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'жб к Наде',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Передано [COLOR=rgb(255, 0, 0)]Главному Администратору[/COLOR] - @Nadezhda_Gray .[/FONT][/SIZE]<br>' +
		"<br>"+
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: GA_PREFIX,
         status: true,
               },
               {
      title: 'док-ва в соц. сетях',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        "[FONT=verdana]Доказательства в социальной сети. Просьба создать новую жалобу, выложить их на фото или видео платформы([URL='https://www.youtube.com/']You[COLOR=rgb(255, 0, 0)]Tube[/COLOR][/URL] или [URL='https://www.imgur.com/']Imgur[/URL]) и прикрепить в новой жалобе.[/FONT]<br><br>" +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'не по форме',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[size=4][FONT=verdana]Ваша жалоба составлена не по форме.[/font][/size]<br>' +
		'[FONT=verdana][SIZE=4]Форма подачи [/SIZE][/FONT][COLOR=rgb(251, 160, 38)][FONT=verdana][SIZE=4]"Жалобы на администрацию"[/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4] будет написана ниже.[/SIZE][/FONT]<br><br>' +
        '[COLOR=rgb(97, 189, 109)][SIZE=5][ICODE]1. Ваш Nick_Name:<br>2. Nick_Name администратора:<br>3. Дата выдачи/получения наказания:<br>4. Суть жалобы:<br>5. Доказательство:[/ICODE][/SIZE][/COLOR]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'не достаточно док-ва',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][B][SIZE=4]Здравствуйте ува[/SIZE][/B][SIZE=4]жаем[B]ый игрок.[/B][/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Недостаточно доказательств которые подтверждают нарушение [/FONT][/SIZE][COLOR=rgb(0, 255, 0)][FONT=verdana][SIZE=4]администратора[/SIZE][/FONT][/COLOR][FONT=verdana][SIZE=4].[/SIZE][/FONT]<br>' +
		"[SIZE=4][FONT=verdana][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], закрыто.[/FONT][/SIZE]"+
        '<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
               {
      title: 'нет скрина бана',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Прикрепите скриншот окна блокировки, пример будет ниже.[/FONT][/SIZE]<br>https://imgur.com/a/4kOFFS4#l23MOZ4<br>' +
		'[SIZE=4][FONT=verdana]Просьба создать новую жалобу, выложить фото "[URL="https://www.imgur.com/"]Imgur[/URL]" и прикрепить в новой жалобе.<br><br>'+
        '[COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/FONT][/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'нету доков на админа',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]Отсутствуют доказательство которые подтверждают нарушений администратора, соответственно рассмотрению не подлежит[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
        },
    {
      title: 'Ответ был дан в прошлой теме',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana][COLOR=rgb(84, 172, 210)]Ответ был дан вам в прошлой теме.[/color][/FONT][/SIZE]<br>' +
        '[SIZE=4][FONT=verdana]Просьба больше не создавать жалобу с данным наказанием администратора.[/FONT][/SIZE]<br>' +
        '[FONT=verdana][SIZE=4][COLOR=rgb(255, 0, 0)]Отказано[/COLOR], Закрыто.[/SIZE]<br><br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: '--------------------------------------------------------------- Обжалования ---------------------------------------------------------------',
               },
    {
      title: 'Отказано',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[SIZE=4][FONT=verdana]После рассмотрения темы было принято решение не сокращать вам наказание.[/FONT][/SIZE]<br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br><br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'Одобрено',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>' +
        "Наказание будет снято в течении 24 часов.[/SIZE][/FONT][/CENTER]<br><br>" +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br><br>",
 
         prefix: ACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'дай вк',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]Предоставьте ссылку на ваш ВКонтакте на котором блокировка.<br>' +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br><br>",
 
         prefix: PIN_PREFIX,
         status: true,
               },
    {
      title: 'Ошибка в подаче обжалования',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]К сожалению, вам отказано, Вы допустили ошибку в правилах подачи обжалования.<br>' +
        "Прочитайте внимательно эту тему: [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']Правила подачи обжалования.[/URL]<br>Прежде чем написать обжалование.[/SIZE][/FONT][/CENTER]<br><br>" +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'Жб теху',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[CENTER][FONT=verdana][SIZE=4]Если Вы не согласны с решением Технического Специалиста.<br>' +
        "Обратитесь в раздел жалоб на [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-kursk.2430/']Технических специалистов[/URL].[/SIZE][/FONT][/CENTER]<br><br>" +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'Nonrp обман',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.[/SIZE][/FONT]<br><br>"+
        '[CENTER][SIZE=4][FONT=verdana]Аккаунт будет разблокирован на 24 часа, в течении этого времени, вы должны вернуть имущество игроку по договоренности, и прикрепить видеофиксацию сделки в данную тему.<br><br>' +
        "[COLOR=rgb(255, 255, 0)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br><br>" +
        "[FONT=verdana][B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/FONT][/B][SIZE=4][FONT=verdana] [/FONT][COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]<br>",
 
         prefix: PIN_PREFIX,
         status: false,
               },
    {
      title: 'Nonrp обман вернул',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.<br><br>"+
        "Ваш аккаунт останется [COLOR=rgb(0, 255, 0)]разблокированным.[/COLOR][/SIZE][/FONT]<br><br>" +
        "[B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/B][SIZE=4] [COLOR=rgb(216, 0, 0)][FONT=verdana][I]Заместитель Главного администратора.[/I][/FONT][/COLOR][/SIZE][/CENTER]",
         prefix: ACCEPT_PREFIX,
         status: false,
               },
    {
      title: 'В жб на админов',
	  content:
		'[CENTER][IMG]https://i.pinimg.com/originals/81/f4/a4/81f4a429035e1c8faec2078257a2eb7f.gif[/IMG]<br><br>' +
		"[FONT=verdana][SIZE=4]Здравствуйте уважаемый игрок.<br><br>"+
        "[CENTER][FONT=verdana][SIZE=4]Если вы не согласны с выданным наказанием, то вам в раздел \"[url='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2456/']Жалобы на администрацию.[/url]\"[/SIZE][/FONT][/CENTER]<br><br>" +
        "[B][SIZE=4][FONT=verdana][SIZE=4][COLOR=white][I]С уважением[/I][/COLOR][/SIZE][/FONT][/SIZE] [/B][SIZE=4] [FONT=verdana][I][color=rgb(216, 0, 0)]Заместитель Главного администратора[/color][/I][/FONT][/SIZE][/CENTER]",
         prefix: UNACCEPT_PREFIX,
         status: false,
               },
 
    ];
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('💥Ответы💥', 'selectAnswer');
 
    // Поиск информации о теме
    const threadData = getThreadData();
 
    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
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