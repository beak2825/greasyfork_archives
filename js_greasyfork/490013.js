// ==UserScript==
// @name         Belgorod | Скрипт для руководства сервера 
// @namespace    http://wh10919.web1.maze-host.ru/index.php
// @version      1.2.2
// @description  Мой скриптик, надеюсь вам понравиться
// @author       Sergey_Medvedev
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/490013/Belgorod%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/490013/Belgorod%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function () {
  'use strict';
    const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
    const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
    const RESHENO_PREFIX = 6; // Префикс "Решено"
    const PIN_PREFIX = 2; // Префикс "На рассмотрении"
    const GA_PREFIX = 12; // Префикс "Главному Администратору"
    const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
    const RASSMOTENO_PREFIX = 9; // Префикс "Рассмотрено"
    const CLOSE_PREFIX = 7; // Префикс "Закрыто"
    const SPECY_PREFIX = 11; // Префикс "Специальному Администратору"
    const buttons = [
        {
               title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
            title: 'На рассмотрение',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая) .<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Запросил доказательства у администратора.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрении.[/COLOR][/FONT][/CENTER]',
             prefix: PIN_PREFIX,
             prefix: CLOSE_PREFIX,
             status: false,
    },
    {
      title: 'На рассмотрении(жб)',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFA500][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          prefix: CLOSE_PREFIX,
          status: false,
    },
    {
      title: 'На рассмотрении(обжалование)',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этого обжалования, ожидайте ответа в этой теме.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFA500][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          prefix: CLOSE_PREFIX,
          status: false,
    },
    {
      title: 'ссылку на жб',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Прикрепите ссылку на данную жалобу в течении 24 часов.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=orange][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          prefix: CLOSE_PREFIX,
          status: false,
    },
    {
      title: 'ссылку на вк',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Прикрепите ссылку на вашу страницу в ВК.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=orange][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
          prefix: PIN_PREFIX,
          prefix: CLOSE_PREFIX,
          status: false,
    },
    {
    title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴доки╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
        {
      title: 'запрошу доки',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
  '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/FONT][/CENTER]<br><br>" +
  '[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'выдано верно',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Проверив доказательства администратора, было принято решение, что наказание было выдано верно. [/FONT][/CENTER]<br><br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'выдано не верно',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4] В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Приятной игры на сервере[/COLOR][/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
           title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказы (жалобы на адм)╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][B][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][B][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /time',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]В предоставленных доказательствах отсутствует /time. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /myreports',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]В предоставленных доказательствах отсутствует /myreports. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'От 3 лица',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Жалобы написанные от 3-его лица не подлежат рассмотрению. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Дока-во отредактированы',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Прошло более 72x часов',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]С момента выдачи наказания прошло более 72-х часов, жалоба не подлежит рассмотрению. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки выдачи наказания',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]На ваших доказательствах отсутствует строка с выдачей наказания.[/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]На ваших доказательствах отсутствует окно блокировки аккаунта. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {title: 'нет докв',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]В вашей жалобе отсутствуют доказательства. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Предоставленные доказательства не рабочие. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'будет проинструктирован',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Благодарим за ваше обращение. Администратор будет проинструктирован. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Приятной игры на сервере [Color=cyan]BELGOROD.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу беседу',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Приятной игры на сервере [Color=cyan]BELGOROD.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу строгую беседу',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Приятной игры на сервере [Color=cyan]BELGOROD.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм будет наказан',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Ваша жалоба была одобрена и администратор получит наказание. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Приятной игры на сервере [Color=cyan]BELGOROD.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет нарушений',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'адм снят/псж',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Администратор был снят/ушел с поста администратора. [/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'нет ссылки на жб',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Нет ссылки на данную жалобу.[/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'не написал ник',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][SIZE=4]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'перезагрузи роутер',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=MAGENTA]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        "[FONT=Courier New][COLOR=#FFFF00][SIZE=4]Перезагрузите роутер.[/FONT][/COLOR][CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/rmpZT9bX/Pics-Art-07-12-03-23-18.png[/img][/CENTER]<br>' +
        '[CENTER][FONT=Courier New][COLOR=MAGENTA][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(обжалование) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для зга гос/опг',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше обжалование было передано на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше обжалование было передано на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше обжалование было передано на рассмотрение Главному Администратору. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для Руководиля Модерации',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше обжалование было передано на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше обжалование было передано на рассмотрение Специальной Администрации. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFD700][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
              title: '-----------------------------------------------передам(жб) -----------------------------------------------',
        },
        {
            title: 'Передано ГА',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Жалоба передана Главному Администратору, пожалуйста ожидайте ответа.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Главному Администратору[/COLOR][/FONT][/CENTER]',
             prefix: GA_PREFIX,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
             title: 'для зга',
             content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFA500][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
         prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Передано ЗГА ГОСС & ОПГ',
            content:
             "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Жалоба передана Заместителю Главного Администратора по направлению ОПГ и ГОСС.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано ЗГА ГОСС&ОПГ[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Спецу',
            content:
             "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваша жалоба передана Специальному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Передано Специальному Администратору.[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
         },
         {
           title: '-----------------------------------------------другой раздел -----------------------------------------------',
    },
    {
      title: 'в жб на адм',
      content:
	 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='http://wh10919.web1.maze-host.ru/index.php?forums/Жалобы-на-Администрацию.30/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
         prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: 'в жб на игроков',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Данный игрок не является администратором.<br>Обратитесь в раздел Жалоб на игроков - [URL='http://wh10919.web1.maze-host.ru/index.php?forums/Жалобы-на-Игроков.32/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: 'в жб на лд',
      content:
        "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='http://wh10919.web1.maze-host.ru/index.php?forums/Жалобы-на-Лидеров.31/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: 'в обжалования',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='http://wh10919.web1.maze-host.ru/index.php?forums/Обжалование-наказаний.33/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
    prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: 'в тех раздел',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='http://wh10919.web1.maze-host.ru/index.php?forums/Технический-раздел.12/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
      title: 'в жб на теха',
      content:
		 "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
        "[I][FONT=times new roman][COLOR=#FFFFFF][SIZE=5]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='http://wh10919.web1.maze-host.ru/index.php?forums/Жалобы-на-Технических-Специалистов.14/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FF0000][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
     prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
    },
    {
            title: '-----------------------------------------------> Раздел Обжалование <-----------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='http://wh10919.web1.maze-host.ru/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.22/']*Нажмите сюда*[/URL]<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[CENTER][FONT=Verdana][COLOR=RED]Отказано[COLOR=red], Закрыто.[/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Обжалованию не подлежит',
            content:
             "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Данное нарушение не подлежит обжалованию, в обжаловании отказано.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[COLOR=red], Закрыто.[/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Не готовы снизить',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Администрация сервера не готова снизить вам наказание.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[COLOR=red], Закрыто.[/FONT][/CENTER]',
          prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'ОБЖ на рассмотрении',
            content:
             "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Ваше обжалование взято на рассмотрение.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[COLOR][/FONT][/CENTER]',
           prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Уже есть мин. наказание',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Вам было выдано минимальное наказание, обжалованию не подлежит.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=RED]Отказано[COLOR=red], Закрыто.[/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Обжалование одобрено',
            content:
             "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование одобрено, ваше наказание будет снято/снижено в течение 24-ех часов.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=#00FA9A]Одобрено[COLOR=red], Закрыто.[/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Передано ГА обж',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Обжалование передано Главному Администратору.<br>"+
            "Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=orange]На рассмотрение[/COLOR][/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'Соц. сети ОБЖ',
            content:
            "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            " Доказательства из соц сетей не принимаются, вам нужно загрузить доказательств на видео/фото хостинге.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[COLOR=red], Закрыто.[/FONT][/CENTER]',
           prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
            title: 'В жб на админов',
            content:
           "[CENTER][FONT=Verdana][FONT=Verdana]Доброго времени суток, уважаемый(-ая).<br><br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            "Если вы не согласны с выданным наказанием, то напишите жалобу в раздел Жалобы на Администрацию.<br>"+
            "[url=https://ibb.co/51gRYCr][img]https://i.ibb.co/grLRvQS/image.png[/img][/url]<br>"+
            '[COLOR=red]Отказано[COLOR=red], Закрыто.[/FONT][/CENTER]',
            prefix: PIN_PREFIX,
         prefix: CLOSE_PREFIX,
         status: false,
        },
        {
      title: 'уже был обжалован',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше наказание уже было обжаловано, повторного обжалования не будет. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вы ошиблись сервером. <br>Подайте обжалование в разделе вашего сервера.[/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 30 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше наказание будет снижено до 30 дней блокировки аккаунта. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 15 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше наказание будет снижено до 15 дней блокировки аккаунта. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 7 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше наказание будет снижено до 7 дней блокировки аккаунта. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'наказание будет снято',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваше наказание будет полностью снято. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры на сервере [Color=#DC143C]CRIMSON.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'чс лд снят',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вы вынесены из черного списка лидеров. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Приятной игры на сервере [Color=#DC143C]CRIMSON.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '24 часа смена ника',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вам дается 24 часа что бы сменить NickName, после смены обязательно прикрепите скриншот с /time. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
     {title: 'НРП развод',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Разблокировка игрового аккаунта будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено. Игрок которого вы обманули должен написать обжалование, после того как вы всё согласуете. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(24 часа на возврат имущества)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Игрок разблокирован на 24 часа, когда вам вернут имущество обязательно отпишите в эту тему. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод(пишет с другого акка)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вы обманули данного игрока и сейчас пишите обжалование с подставной перепиской. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(пострадавший пишет обж)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Игрок которого вы обманули должен сам написать обжалование. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(нет переписки)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Нет скриншота договора о возврате имущества. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    }
    ];

 $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
         // Добавление кнопок при загрузке страницы
         addButton('Ответы', 'selectAnswer');
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