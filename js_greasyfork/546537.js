// ==UserScript==
// @name         Black Russia Кф Хелпер by A Chapaev
// @description  только для кураторов форума 
// @namespace    https://forum.blackrussia.online
// @version      1.4.7
// @author       Assiriks_Chapaev
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/thesquid.ink/free-flat-sample/128/support-icon.png
// @downloadURL https://update.greasyfork.org/scripts/546537/Black%20Russia%20%D0%9A%D1%84%20%D0%A5%D0%B5%D0%BB%D0%BF%D0%B5%D1%80%20by%20A%20Chapaev.user.js
// @updateURL https://update.greasyfork.org/scripts/546537/Black%20Russia%20%D0%9A%D1%84%20%D0%A5%D0%B5%D0%BB%D0%BF%D0%B5%D1%80%20by%20A%20Chapaev.meta.js
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
'[CENTER][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша жалоба передано на Рассмотрение.[/I]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B][I]Ожидайте ответа...[/I][/B]<br><br>' +
'[CENTER]<br>[I]Не создавайте дубликатов.[/I]<br><br>' +
'[B][CENTER][COLOR=yellow][ICODE]На рассмотрение[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'Ваша жалоба получает статус: отказано',
      content:
'[Color=Red][CENTER]Отказано,и закрыто.[/CENTER][/color]<br><br>' +
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Ваша жалоба получает статус: одобрено',
      content:
'[Color=Green][CENTER]Одобрено, закрыто.[/CENTER][/color]<br><br>' +
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '---------------------------------------------передача by Assiriks_Chapaev---------------------------------------------',
    },
    {
	  title: 'Тех.специалисту',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша жалоба передано на рассмотрение [COLOR=rgb(255, 69, 0)] Технического Специалиста.[/I]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B]Ожидайте ответа...[/B]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=blue][ICODE]Передано Тех[/ICODE][/COLOR][/CENTER][/B]'
    },
    {
	  title: 'Главному Администратору',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Ваша жалоба передано на рассмотрение [COLOR=rgb(255, 0, 0)][B] Главного Администратора Сервера. [COLOR=rgb(209, 213, 216)][/I][/B]<br><br>' +
'[COLOR=rgb(255, 255, 255)][B]Ожидайте ответа...[/B]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Передано ГА[/ICODE][/COLOR][/CENTER][/B]',
    },
    {
     title: '-----------------------------------------------------Не по форме составлено by A.Chapaev-----------------------------------------------------',
     },
     {
      title: 'Не по форме',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[B][I]Ваша жалоба написана не по форме.[/I][/B]<br><br>' +
"Ознакомьтесь с разделом *[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']Правила подачи жалоб на игроков[/URL]*<br><br>" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
     },
     {
      title: 'Более 72часов',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Ваша жалоба отказана, так как прошло более 72(3дня) часов с момента нарушения игрока.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
     },
     {
      title: 'Дублирование темы',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Дублироване темы.[/B]<br><br><br>' +
'[CENTER][B][I]Если вы дальше будете так же повторять (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более дней.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Ссылка не работает',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Ваша ссылка плохо работает,либо же она вообще не работает.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
        title: 'Нету доков',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Отсутствуют доказательства, рассмотрению не подлежит. Загрузите ваш фрапс на YouTube, Imgur, Yapx и т.д.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
        title: 'написано от 3-его лица',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Ваша жалоба отказана, так как она написана от 3-его лица.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Мало доков',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>Жалоба содержит мало доказательств, предоставьте больше доказательств в следующей жалобе.<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Нецензурная брань в теме',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>Жалобы с нецензурной бранью рассмотрению не подлежат.<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Монтаж/изминен',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Нарушений не найдено',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>Нарушений со стороны данного игрока не было найдено.<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Неполный фрапс',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]Ваша фрапс обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Нужен видео',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]В данных случаях нужна видеофиксация.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Нету /time',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][B][I]В ваших доказатествах нет /time.[/B][/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'жалоба на админа',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на администрацию».[/CENTER]<br>" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'в раздел обжалование',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Обжалования наказаний».[/CENTER]<br>" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'жб на сотрудников',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Вы ошиблись разделом.<br>Обратитесь в раздел «Жалобы на сотрудников» в разделе Государственных организаций.[/CENTER]<br>" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'не по форме',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб, закреплённые в этом разделе.[/CENTER]<br>" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Укажите таймкоды',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER]Укажите таймкоды.[/CENTER]<br>" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Нет условий сделки',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки.[/CENTER]" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Статус: Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'доки через соц.сети',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно.[/CENTER]" +
'[Color=Red][CENTER]Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
      title: 'Нужен фрапс + промотка чата',
      content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
"[CENTER][B][I][FONT=georgia]В таких случаях нужна видеозапись + промотка чата.[/CENTER]" +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '----------------------------------------Правила игры----------------------------------------',
    },
    {
	  title: 'Нонрп поведение',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено поведение, нарушающее нормы процессов Role Play режима игры. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
 
    },
    {
	  title: 'ЕПП',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен NonRP Drive(ЕПП) — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'скам',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики. [COLOR=rgb(255, 0, 0)]| PermBan [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Role Play отыгровки в свою сторону',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые Role Play отыгровки в свою сторону или пользу  Запрещены любые Role Play отыгровки в свою сторону или пользу. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Аморальные действия',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена любая форма аморальных действий сексуального характера в сторону игроков. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Слив склада',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Обман в /do',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже. [COLOR=rgb(255, 0, 0)]| Jail 30 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Использование фракц. т/с в лич. целях',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование рабочего или фракционного транспорта в личных целях. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Затягивание Role Play процесса',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.12.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено целенаправленное затягивание Role Play процесса. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'DB',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта. [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'RK',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.14.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'TK',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины. [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'SK',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.16.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них. [COLOR=rgb(255, 0, 0)]| Jail 60 минут / Warn (за два и более убийства)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'PG',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.1.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'MG',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'дм',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.19.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины. [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Mass DM',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более. [COLOR=rgb(255, 0, 0)]| Warn / Ban 3 - 7 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Обход системы',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться обходить игровую систему или использовать любые баги сервера. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Стороннее ПО',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.22.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Действия вредящие репутации проекта',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.25.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены попытки или действия, которые могут навредить репутации проекта. [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Нанесение вреда ресурсам проекта',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.26.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее). [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Распространение инфы админ-работ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.27.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространение информации и материалов, которые имеют непосредственное отношение к работе администрации проекта. [COLOR=rgb(255, 0, 0)]| PermBan + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Покупка/продажа ИВ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.28.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена покупка/продажа внутриигровой валюты в любых ее проявлениях за реальные деньги. [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта + ЧС проекта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Трансфер имущества',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.29.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен трансфер имущества между серверами проекта. [COLOR=rgb(255, 0, 0)]| PermBan с обнулением аккаунта[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ущерб экономике',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.30.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пытаться нанести ущерб экономике сервера. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Реклама',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.31.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное. [COLOR=rgb(255, 0, 0)]| Ban 7 дней / PermBan [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Обман администрации',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.32.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта. [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Пользование уязвимостью правил',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.33.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено пользоваться уязвимостью правил. [COLOR=rgb(255, 0, 0)]| Ban 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Запрещен уход от наказания',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.34.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен уход от наказания. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней (суммируется к общему наказанию дополнительно)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'IC и OOC конфликты о национальности/религии',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.35.[/COLOR][COLOR=rgb(209, 213, 216)] На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
    },
    {
	  title: 'Перенос конфликта из IC в OOC и наоборот',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.36.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено переносить конфликты из IC в OOC, и наоборот. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'OOC угрозы',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.37.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены OOC угрозы, в том числе и завуалированные. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 дней [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Распространение лич.инфы игроков и их родственников',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.38.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено распространять личную информацию игроков и их родственников. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Многократные нарушения',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[Color=violet][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.39.[/COLOR][COLOR=rgb(209, 213, 216)] Злоупотребление нарушениями правил сервера. [COLOR=rgb(255, 0, 0)]| Ban 7 - 30 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Деструктивные действия по отношению к проекту',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.40.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе. [COLOR=rgb(255, 0, 0)]| Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором)[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'ЕПП',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.46.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на любом транспорте. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'ЕПП на фуре',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.47.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора). [COLOR=rgb(255, 0, 0)]| Jail 60 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Продажа/покупка репутации семьи',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.48.[/COLOR][COLOR=rgb(209, 213, 216)] Продажа или покупка репутации семьи любыми способами. [COLOR=rgb(255, 0, 0)]| Обнуление рейтинга семьи[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Многократная продажа/покупка репутации семьи',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.49.[/COLOR][COLOR=rgb(209, 213, 216)] Многократная продажа или покупка репутации семьи любыми способами. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan + удаление семьи[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Арест в аукционе',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.50.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона. [COLOR=rgb(255, 0, 0)]|  Ban 7 - 15 дней + увольнение из организации[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Помеха РП',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.51.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'nRP Аксессуар',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.52.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [COLOR=rgb(255, 0, 0)]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск администрации, неуважение, неадекват.поведение',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.54.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации. [COLOR=rgb(255, 0, 0)]| Mute 180 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Багоюз анимации',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.55.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается багоюз связанный с анимацией в любых проявлениях. [COLOR=rgb(255, 0, 0)]| Jail 60 / 120 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '----------------------------------------Игровой чат---------------------------------------------------------',
    },
    {
	  title: 'Общение не по-русски',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.01.[/COLOR][COLOR=rgb(209, 213, 216)] Общепризнанный язык сервера — русский. Общение в IC и OOC чатах во всех RolePlay ситуациях обязательно должно проходить исключительно на русском языке. [COLOR=rgb(255, 0, 0)]| Устное замечание / Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'CapsLock',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'ОСК/УПОМ РОДНИ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC). [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Флуд',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.05.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Злоуп знаками',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.06.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено злоупотребление знаков препинания и прочих символов. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оскорбление',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[Color=violet][FONT=times new roman][CENTER][I]{{ greeting }}, уважаемый игрок.[/color][/CENTER]<br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.07.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Слив СМИ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.08.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые формы «слива» посредством использования глобальных чатов. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Угрозы наказанием',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещены любые угрозы о наказании игрока со стороны администрации. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Выдача себя за адм',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена выдача себя за администратора, если таковым не являетесь. [COLOR=rgb(255, 0, 0)]| Ban 7 - 15 + ЧС администрации[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Ввод в заблуждение командами',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.11.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено введение игроков проекта в заблуждение путем злоупотребления командами. [COLOR=rgb(255, 0, 0)]| Ban 15 - 30 дней / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Капс или оффтоп в репорт',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.12.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено подавать репорт с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее).<br><br>' +
'[COLOR=rgb(255, 0, 0)] | Report Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Оск родных в Voice',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.15.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено оскорблять игроков или родных в Voice Chat. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 7 - 15 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Политика',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.18.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено политическое и религиозное пропагандирование. [COLOR=rgb(255, 0, 0)]| Mute 120 минут / Ban 10 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Транслит',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.20.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование транслита в любом из чатов. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Реклама/упом промокодов',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.21.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [COLOR=rgb(255, 0, 0)]| Ban 30 дней[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'мат в VIP',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]3.23.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '-----------------------------------------------------Стороние-----------------------------------------------------',
    },
    {
      title: 'ППВ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.03.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещена совершенно любая передача игровых аккаунтов третьим лицам. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: '3 акка',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Разрешается зарегистрировать максимально только три игровых аккаунта на сервере. [COLOR=rgb(255, 0, 0)]| PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'фейк ник',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.10.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию. [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'АФК Бизнес',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.13.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено, имея бизнес или автозаправочную станцию (АЗС), заходить в игру только ради его оплаты и не проявлять активность в игре. [COLOR=rgb(255, 0, 0)]| Обнуление владения бизнесом[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: 'Оскорбительный NickName',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.09.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные). [COLOR=rgb(255, 0, 0)]| Устное замечание + смена игрового никнейма / PermBan[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '-----------------------------------------------------Правила ГОСС структур-----------------------------------------------------',
    },
    {
	  title: 'нРП ГОСС',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]1.07.[/COLOR][COLOR=rgb(209, 213, 216)] Всем сотрудникам государственных организаций запрещено выполнять работы где-либо в форме, принадлежащей своей фракции. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Одиночный патруль',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]1.11.[/COLOR][COLOR=rgb(209, 213, 216)]  Всем силовым структурам запрещен одиночный патруль или конвоирование, минимум 2 сотрудника. [COLOR=rgb(255, 0, 0)]| Jail 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'нРП СМИ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактирование объявлений, не соответствующих ПРО. [COLOR=rgb(255, 0, 0)]| Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'дм in тт умвд',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено наносить урон игрокам без Role Play причины на территории УМВД. [COLOR=rgb(255, 0, 0)]| DM / Jail 60 минут / Warn [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'НРП ПОВЕДЕНИЕ УМВД',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение. [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[CENTER][B][COLOR=rgb(255, 0, 0)][SIZE=3]Примечание: поведение, не соответствующее сотруднику УМВД.[/SIZE][/COLOR]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'РОЗЫСК НРП/ШТРАФ НРП',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]7.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск, штраф без Role Play причины. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЗАБИРАТЬ ПРАВА В ПОГОНЕ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]7.04.[/COLOR][COLOR=rgb(209, 213, 216)]  Запрещено отбирать водительские права во время погони за нарушителем. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'УРОН НА ТТ/ФСБ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]8.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено наносить урон игрокам без Role Play причины на территории ФСБ. [COLOR=rgb(255, 0, 0)]| DM / Jail 60 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'НРП УРОН НА ТТ/ФСИН',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]8.01.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено наносить урон игрокам без Role Play причины на территории ФСИН. [COLOR=rgb(255, 0, 0)]| DM / Jail 60 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'НРП РОЗЫСК',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено выдавать розыск без Role Play причины. [COLOR=rgb(255, 0, 0)]| Warn [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'наносение МО/ТТ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]2.02.[/COLOR][COLOR=rgb(209, 213, 216)] Наносить урон игрокам, которые находятся вне территории воинской части, запрещено. [COLOR=rgb(255, 0, 0)] | DM / Jail 60 минут / Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'ЗАМЕНА ТЕКСТА',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком. [COLOR=rgb(255, 0, 0)] | Ban 7 дней + ЧС организации [/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'НРП ЭФИРЫ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]4.02.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено проведение эфиров, не соответствующих Role Play правилам и логике. [COLOR=rgb(255, 0, 0)]  | Mute 30 минут[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'нРП Коп',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER]<br>[I]Игроку будет выдано следующее наказание за нарушение данного пункта правил:[/I]<br><br>' +
'[COLOR=rgb(255, 0, 0)]6.04.[/COLOR][COLOR=rgb(209, 213, 216)] Запрещено nRP поведение. [COLOR=rgb(255, 0, 0)]| Warn[/COLOR][COLOR=rgb(209, 213, 216)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Жалоба получает статус: <br><br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '---------------------------------------------------------------RP Биографии by A.Chapaev---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография получает статус: одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: 'Скопрована',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография скопирована.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Дата не подходит',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваш возраст не совпадает с датой рождения.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Заголовок в вашей биографии составлен не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она составлена не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Мало информации',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана так как в ней мало информации.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Много ошибок',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к в ней много ошибок.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'От 3-его лица',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она написана от 3-его лица.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Уже одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к она уже одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Ник на англ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваш NickName должен быть написан на русском языке.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Нон рп ник',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к у вас NonRP NickName.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Дата рождения не дописана',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к ваша дата рождения расписана не полностью.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Супергерой',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - биография отказана т.к вы приписали суперспособности своему персонажу.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - биографий закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Биография получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '---------------------------------------------------------------RP Ситуации---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к она составлена не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
          title: 'Отказ',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Здравствуйте, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Ник на америко',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к ваш NickName должен быть написан на русском языке.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Скопрована',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация скопирована.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Много ошибок',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - ситуация отказана т.к в ней много ошибок.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
	  title: 'Заголовок не по форме',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Заголовок в вашей ситуации составлен не по форме.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила создания RP - ситуаций закрепленные в данном разделе.<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
          title: 'Не сюда',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Обратитесь в нужный вам раздел.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Ситуация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
    },
    {
     title: '---------------------------------------------------------------RP Организации---------------------------------------------------------------',
    },
    {
	  title: 'Одобрена',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация одобрена.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Организация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=green][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
          title: 'Отказано',
	  content:
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FRb3z3Xw/RLwzo.png[/img][/url]<br>' +
'[CENTER][COLOR=violet][FONT=times new roman][SIZE=4][I]Доброго времени суток, уважаемый {{ user.mention }}[/I][/SIZE][/FONT][/COLOR]<br><br>' +
'[CENTER][COLOR=rgb(209, 213, 216)]Ваша RolePlay - организация отказана.[COLOR=rgb(255, 0, 0)]<br><br>' +
'[COLOR=rgb(209, 213, 216)][I] Ваша Организация получает статус: <br>' +
'[CENTER]"[url=https://postimages.org/][img]https://i.postimg.cc/MKb4gMwJ/2023-08-20-174519042.png[/img][/url]<br>'+
'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: UNACCEPT_PREFIX,
          status: false,
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
	addButton('Click', 'selectAnswer');
 
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