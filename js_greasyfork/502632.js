// ==UserScript==
// @name         Кураторы адм/ЗГА/ГА | мурманск
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  По вопросам в ВК - https://vk.com/id496625893, туда же и по предложениям на улучшение скрипта)
// @author       Patrick_Dadelion
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/data/avatars/o/11/11193.jpg?1680968342
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/502632/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%97%D0%93%D0%90%D0%93%D0%90%20%7C%20%D0%BC%D1%83%D1%80%D0%BC%D0%B0%D0%BD%D1%81%D0%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502632/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%97%D0%93%D0%90%D0%93%D0%90%20%7C%20%D0%BC%D1%83%D1%80%D0%BC%D0%B0%D0%BD%D1%81%D0%BA.meta.js
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
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5] . [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
    },
    {
      title: 'хзхз',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении(жб)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'На рассмотрении(обжалование)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этого обжалования, ожидайте ответа в этой теме.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'ссылку на жб',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Прикрепите ссылку на данную жалобу в течении 24 часов.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
      title: 'ссылку на вк',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Прикрепите ссылку на вашу страницу в ВК.[/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴доки╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'запрошу доки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'выдано верно',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Проверив доказательства администратора, было принято решение, что наказание было выдано верно. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER]<br><br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'выдано не верно',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5] В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴жб на адм ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /time',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В предоставленных доказательствах отсутствует /time. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нет /myreports',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В предоставленных доказательствах отсутствует /myreports. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'От 3 лица',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Жалобы написанные от 3-его лица не подлежат рассмотрению. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Дока-во отредактированы',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Прошло более 48 часов',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет строки выдачи наказания',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]На ваших доказательствах отсутствует строка с выдачей наказания. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет окна бана',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]На ваших доказательствах отсутствует окно блокировки аккаунта. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В вашей жалобе отсутствуют доказательства. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не работают доки',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Предоставленные доказательства не рабочие. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'дубликат',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'будет проинструктирован',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Благодарим за ваше обращение! Администратор будет проинструктирован. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу беседу',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'проведу строгую беседу',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'Адм будет наказан',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была одобрена и администратор получит наказание. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: 'нет нарушений',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'адм снят/псж',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Администратор был снят/ушел с поста администратора. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'нет ссылки на жб',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нет ссылки на данную жалобу.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'не написал ник',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'перезагрузи роутер',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Перезагрузите роутер.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(жб) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для зга гос/опг',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для зга',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Главному Администратору. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для сакаро',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваша жалоба была передана на рассмотрение Специальной Администрации. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'в жб на адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.2372/']*Тык*[/URL] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на игроков',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Данный игрок не является администратором.<br>Обратитесь в раздел Жалоб на игроков - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.2374/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на лд',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2373/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в обжалования',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2375/']*Тык*[/URL] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в тех раздел',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Тык*[/URL]. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'в жб на теха',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Тык*[/URL] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(обжалование) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для га',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование было передано на рассмотрение Главному Администратору. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: GA_PREFIX,
	  status: true,
    },
    {
      title: 'для сакаро',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование было передано на рассмотрение [Color=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: true,
    },
    {
      title: 'для спец адм',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование было передано на рассмотрение Специальной Администрации. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#00FFFF][ICODE]Ожидайте ответа. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
	  status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴обжалования ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше обжалование составлено не по форме.<br>Убедительная просьба ознакомиться с правилами подачи заявки на обжалование наказания - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Тык*[/URL] [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'не подлежит обжалованию',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Данное нарушения не подлежит обжалованию, администрация не может снизить вам его. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'Не готовы снизить',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Администрация сервера не готова снизить вам наказания, пожалуйста не создавайте дубликаты, создание дубликатов карается блокировкой форумного аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'обж отказ',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В обжаловании отказано.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'нет докв',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]В вашем обжаловании отсутствуют доказательства. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'уже был обжалован',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание уже было обжаловано, повторного обжалования не будет. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'соц сеть',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
	{
	  title: 'ошиблись сервером',
	  content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы ошиблись сервером. <br>Подайте обжалование в разделе вашего сервера.[/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
	  prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 30 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет снижено до 30 дней блокировки аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 15 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет снижено до 15 дней блокировки аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'снижу на 7 дн',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет снижено до 7 дней блокировки аккаунта. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'наказание будет снято',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Ваше наказание будет полностью снято. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: RASSMOTENO_PREFIX,
	  status: false,
    },
    {
      title: 'чсc снят',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы вынесены из черного списка сервера. [/FONT][/COLOR]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]Приятной игры и времяпровождения. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
      title: '24 часа смена ника',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вам дается 24 часа что бы сменить NickName, после смены обязательно прикрепите скриншот с /time. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Разблокировка игрового аккаунта будет возможна только в случае возврата полной суммы причиненного ущерба, либо непосредственно самого имущества, которое было украдено. Игрок которого вы обманули должен написать обжалование, после того как вы всё согласуете. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(24 часа на возврат имущества)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок разблокирован на 24 часа, когда вам вернут имущество обязательно отпишите в эту тему. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FFFF00][ICODE]На рассмотрении. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
	  status: 123,
    },
    {
      title: 'НРП развод(пишет с другого акка)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Вы обманули данного игрока и сейчас пишите обжалование с подставной перепиской. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(пострадавший пишет обж)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Игрок которого вы обманули должен сам написать обжалование. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
	  status: false,
    },
    {
      title: 'НРП развод(нет переписки)',
      content:
		'[CENTER][I][SIZE=4][FONT=arial][COLOR=#F5F5DC][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[I][FONT=times new roman][COLOR=#E0FFFF][SIZE=5]Нет скриншота договора о возврате имущества. [/COLOR][/FONT]<br>[B][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG][/B][/CENTER] <br>" +
        '[CENTER][FONT=times new roman][SIZE=5][I][I][SIZE=4][FONT=arial][COLOR=#FF0000][ICODE]Закрыто. [/ICODE][/COLOR][/FONT][/SIZE][/I][/I][/SIZE][/FONT][/CENTER]',
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
    addButton('⚠ Скрипт от Patrick_Dandelion ⚠', '/');



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
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text; font-style: italic">${btn.title}</span></button>`,
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