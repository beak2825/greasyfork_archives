// ==UserScript==
// @name         script by marquez owoline | MURMANSK
// @namespace    http://tampermonkey.net/
// @version      1.9.7
// @description  По вопросам в ВК - https://vk.com/fantigm, туда же и по предложениям на улучшение скрипта)
// @author      Marquez Owoline
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/494065/script%20by%20marquez%20owoline%20%7C%20MURMANSK.user.js
// @updateURL https://update.greasyfork.org/scripts/494065/script%20by%20marquez%20owoline%20%7C%20MURMANSK.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RASSMOTENO_PREFIX = 9; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECY_PREFIX = 11;
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
		'[CENTER][B][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[B][FONT=Arial][SIZE=4] . [/FONT][/CENTER]<br><br>" +
 	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4][B] Закрыто. [/COLOR][/FONT][/CENTER]',
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении(жб)',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[CENTER][FONT=Arial][SIZE=4]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме [/FONT][/CENTER]<br><br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]На рассмотрении[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении(обжалование)',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4]Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этого обжалования, ожидайте ответа в этой теме.[/FONT][/CENTER]<br><br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'ссылку на жб',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4]Прикрепите ссылку на данную жалобу в течении 24 часов.[/FONT][/CENTER]<br><br>" +
 	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]На рассмотрении[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
      title: 'ссылку на вк',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4]Прикрепите ссылку на вашу страницу в ВК.[/FONT][/CENTER]<br><br>" +
 	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]На рассмотрении[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴доки╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'запрошу доки',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/FONT][/CENTER]<br><br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'выдано верно',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4]Проверив доказательства администратора, было принято решение, что наказание было выдано верно. [/FONT][/CENTER]<br><br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'выдано не верно',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4] В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято. [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]Приятной игры на сервере[/COLOR] [COLOR=cyan]MURMANSK.[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отказы (жалобы на адм)╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][SIZE=4][FONT=Arial][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Arial][SIZE=4]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Arial][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /time',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]В предоставленных доказательствах отсутствует /time. [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /myreports',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]В предоставленных доказательствах отсутствует /myreports. [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'От 3 лица',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Жалобы написанные от 3-его лица не подлежат рассмотрению. [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][CENTER] <br>" +
	'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Дока-во отредактированы',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Прошло более 72 часов',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]С момента выдачи наказания прошло более 72-ух часов, жалоба не подлежит рассмотрению. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки выдачи наказания',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]На ваших доказательствах отсутствует строка с выдачей наказания.[/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]На ваших доказательствах отсутствует окно блокировки аккаунта. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]В вашей жалобе отсутствуют доказательства. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Предоставленные доказательства не рабочие. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'будет проинструктирован',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Благодарим за ваше обращение. Администратор будет проинструктирован. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Приятной игры на сервере [Color=cyan]MURMANSK.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу беседу',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Приятной игры на сервере [Color=cyan]MURMANSK.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу строгую беседу',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Приятной игры на сервере [Color=cyan]MURMANSK.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм будет наказан',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваша жалоба была одобрена и администратор получит наказание. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Приятной игры на сервере [Color=cyan]MURMANSK.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет нарушений',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'адм снят/псж',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Администратор был снят/ушел с поста администратора. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'нет ссылки на жб',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Нет ссылки на данную жалобу.[/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'не написал ник',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'перезагрузи роутер',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][COLOR=#FFFF00][SIZE=4]Перезагрузите роутер.[/FONT][/COLOR][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(жб) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для зга гос/опг',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ.[/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][I][FONT=Courier New][COLOR=RED][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для га',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваша жалоба была передана на рассмотрение Главному Администратору. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для сакаро',
      content:
		'[CENTER][I][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=Courier New][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=Courier New][COLOR=#FFFF00][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=КУВ]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[I][FONT=Courier New][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение Специальной Администрации. [/COLOR][/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=#FFFF00][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
	'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4] Если вы не согласны с наказанием со стороны администратора то обратитесь в раздел Жалобы на администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2372/']*Тык*[/URL]. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на игроков',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4] Вы ошиблись разделом, обратитесь в раздел Жалобы на игроков - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.2374/']*Тык*[/URL]. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4] Вы ошиблись разделом, обратитесь в раздел Жалобы на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2373/']*Тык*[/URL]. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
	'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4] Вы ошиблись разделом, напишите обжалование в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2375/']*Тык*[/URL]. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто.[/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[CENTER][I][SIZE=4][FONT=Courier New][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][I][SIZE=4][FONT=Courier New][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'для га',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4] Ваша жалоба/обжалование передано на рассмотрение Главному администратору сервера. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4] Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
			'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4] Ваша жалоба передана на рассмотрение Специальной администрации. [/FONT][/CENTER] <br>" +
'[CENTER][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4] Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться с правилами подачи заявки на обжалование наказания - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Тык*[/URL] [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не подлежит обжалованию',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Данное нарушения не подлежит обжалованию, администрация не может снизить вам его. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Не готовы снизить',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][ <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Администрация сервера не готова снизить вам наказания, пожалуйста не создавайте дубликаты, создание дубликатов карается блокировкой форумного аккаунта. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обж отказ',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]В обжаловании отказано.[/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]В вашем обжаловании отсутствуют доказательства. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'уже был обжалован',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваше наказание уже было обжаловано, повторного обжалования не будет. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=times new roman][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Вы ошиблись сервером. <br>Подайте обжалование в разделе вашего сервера.[/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'наказание будет снято',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Ваше наказание будет полностью снято. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Приятной игры на сервере [Color=#DC143C]CRIMSON.[/COLOR] [/COLOR][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'чс сервера снят',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Вы вынесены из черного списка сервера. [/FONT][CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Приятной игры на сервере Murmansk.[/COLOR] [/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '24 часа смена ника',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Вам дается 24 часа что бы сменить NickName, после смены обязательно прикрепите скриншот с /time. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]На рассмотрении[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE]<br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Разблокировка игрового аккаунта будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено. Игрок которого вы обманули должен написать обжалование, после того как вы всё согласуете. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(пишет с другого акка)',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Вы обманули данного игрока и сейчас пишите обжалование с подставной перепиской. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=RED][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(пострадавший пишет обж)',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Игрок которого вы обманули должен сам написать обжалование. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(нет переписки)',
      content:
		'[CENTER][SIZE=4][FONT=Courier New][COLOR=RED]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE] <br><br>' +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        "[FONT=Courier New][SIZE=4]Нет скриншота договора о возврате имущества. [/FONT][/CENTER] <br>" +
'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/sXGVGm4p/Picsart-23-07-24-14-44-44-695.png[/img][/url][CENTER]'+
        '[CENTER][FONT=Courier New][COLOR=RED][SIZE=4]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },





  ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение 🍁', 'pin');
    addButton('КП 🐯', 'teamProject');
    addButton('Га 🐰', 'Ga');
    addButton('Спецу 🦁', 'Spec');
    addButton('Одобрено ✅', 'accepted');
    addButton('Отказано ❌', 'unaccept');
    addButton('Тех. Специалисту 🐣', 'Texy');
    addButton('Рассмотрено 👍', 'Rasmotreno');
    addButton('Закрыто 🏚', 'Close');
    addButton('Ответы', 'selectAnswer');
    addButton('⚠ Скрипт от Marquez Owoline', '/');



	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
	$('button#Ga').click(() => editThreadData(GA_PREFIX, true));
	$('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
	$('button#Texy').click(() => editThreadData(TEX_PREFIX, true));
	$('button#Rasmotreno').click(() => editThreadData(RASSMOTENO_PREFIX, false));
	$('button#Close').click(() => editThreadData(CLOSE_PREFIX, false));

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

function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();