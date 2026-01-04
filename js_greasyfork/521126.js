// ==UserScript==
// @name         Кураторы адм/ЗГА/ГА | PSKOV
// @namespace    https://greasyfork.org/ru/scripts/521126-кураторы-адм-зга-га-pskov/code
// @version      2.1
// @description  По вопросам в ВК - https://vk.com/id361264463
// @author       Manuel_Castellano
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://forum.blackrussia.online/data/avatars/o/325/325389.jpg?1734531359
// @grant        none
// @license      vsexydivil
// @downloadURL https://update.greasyfork.org/scripts/521126/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%97%D0%93%D0%90%D0%93%D0%90%20%7C%20PSKOV.user.js
// @updateURL https://update.greasyfork.org/scripts/521126/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%97%D0%93%D0%90%D0%93%D0%90%20%7C%20PSKOV.meta.js
// ==/UserScript==

(function() {
    'use strict';
const UNACCEPT_PREFIX = 4; // Префикс "Отказано"
const ACCEPT_PREFIX = 8; // Префикс "Одобрено"
const RASSMOTENO_PREFIX = 9; // Префикс "Решено"
const PIN_PREFIX = 2; // Префикс "На рассмотрении"
const GA_PREFIX = 12; // Префикс "Главному Администратору"
const COMMAND_PREFIX = 10; // Префикс "Команде Проекта"
const WATCHED_PREFIX = 9; // Префикс "Рассмотрено"
const CLOSE_PREFIX = 7; // Префикс "Закрыто"
const SPECY_PREFIX = 11; // Префикс "Специальному Администратору"
const TEX_PREFIX = 13;
const buttons = [
    {
      title: 'свой ответ',
      content:
		'[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
	    "[B][CENTER][COLOR=WHITE] . <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
    },
    {
     title: '-------------------------------------------------------------> На рассмотрении <-------------------------------------------------------------',
    },
    {
        title: 'На рассмотрении ЖБ',
        content:
        '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: PIN_PREFIX,
        status: true
    },
    {
      title: 'На рассмотрении(обжалование)',
      content:
		'[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этого обжалования, ожидайте ответа в этой теме.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора.[/FONT] [/COLOR]<br>",
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Ссылку на ЖБ',
      content:
        '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Прикрепите ссылку на данную жалобу в течении 24 часов. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'Ссылку на ВК',
      content:
        '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] Прикрепите ссылку на вашу страницу в ВК. <br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '------------------------------------------------------------------------> Доки <-----------------------------------------------------------------------',
    },
    {
      title: 'Запрошу доки',
      content:
		'[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        prefix: PIN_PREFIX,
      status: true,
    },
    {
        title: 'Выдано верно',
        content:
          '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		  "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		  "[B][CENTER][COLOR=WHITE]Проверив доказательства администратора, было принято решение, что наказание было выдано верно. <br>"+
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
          "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
          prefix: CLOSE_PREFIX,
        status: false,
    },
    {
    title: 'Выдано не верно',
      content:
		'[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		"[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		"[B][CENTER][COLOR=WHITE] В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: '-----------------------------------------------------------------> ЖБ на админа <---------------------------------------------------------------',
    },
    {
     title: 'Не по форме',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Ваша жалоба составлена не по форме. <br> Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нет /time',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]В предоставленных доказательствах отсутствует /time. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нет /myreports',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]В предоставленных доказательствах отсутствует /myreports. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'От 3 лица',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Жалобы написанные от 3-его лица не подлежат рассмотрению. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нужен фрапс',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Фрапс обрывается',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Ваш фрапс обрывается, загрузите полный фрапс на ютуб. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Дока-во отредактированы',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Прошло более 48 часов',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нет строки выдачи наказания',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] На ваших доказательствах отсутствует строка с выдачей наказания. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нет окна бана',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] На ваших доказательствах отсутствует окно блокировки аккаунта. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нет докв',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] В вашей жалобе отсутствуют доказательства. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Не работают доки',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]]Предоставленные доказательства не рабочие. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Дубликат',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Дублирование темы. <br> Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Будет проинструктирован',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Благодарим за ваше обращение! <br> Администратор будет проинструктирован.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: ACCEPT_PREFIX,
     status: false,
    },
    {
     title: 'Проведу беседу',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Ваша жалоба была одобрена и будет проведена беседа с администратором. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: ACCEPT_PREFIX,
     status: false,
    },
    {
     title: 'Проведу строгую беседу',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: ACCEPT_PREFIX,
     status: false,
    },
    {
     title: 'Адм будет наказан',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Ваша жалоба была одобрена и администратор получит наказание. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: ACCEPT_PREFIX,
     status: false,
    },
    {
     title: 'Нет нарушений',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Адм снят/псж',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Администратор был снят/ушел с поста администратора. <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Ошиблись сервером',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Вы ошиблись сервером. <br> Обратитесь в раздел жалоб на администрацию вашего сервера.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Нет ссылки на жб',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Нет ссылки на данную жалобу.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Не написал ник',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'Перезагрузи роутер',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Перезагрузите роутер.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: '------------------------------------------------------------------> Передам(жб) <-----------------------------------------------------------------',
    },
    {
     title: 'Для ЗГА гос/опг',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: PIN_PREFIX,
     status: true,
    },
    {
     title: 'Для ЗГА',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: PIN_PREFIX,
     status: true,
    },
    {
     title: 'Для ГА',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение Главному Администратору.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: GA_PREFIX,
     status: true,
    },
    {
     title: 'Для Сакаро',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение [Color=#1E90FF] Руководителю Модерации Дискорда.[/COLOR] <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: PIN_PREFIX,
     status: true,
    },
    {
     title: 'Для Спец Адм',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваша жалоба была передана на рассмотрение Специальной Администрации.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: SPECY_PREFIX,
     status: true,
    },
    {
     title: '-----------------------------------------------------------------> Другой раздел <---------------------------------------------------------------',
    },
    {
     title: 'В жб на адм',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Если вы не согласны с выданным наказанием, то обратитесь в раздел Жалоб на Администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2829/']*Тык*[/URL]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'В жб на игроков',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Данный игрок не является администратором. <br> Обратитесь в раздел Жалоб на игроков - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2831/']*Тык*[/URL].<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'В жб на лд',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Данный игрок является лидером. <br> Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.2830/']*Тык*[/URL].<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'В обжалования',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2832/']*Тык*[/URL]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'В тех раздел',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Вы ошиблись разделом. <br> Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Тык*[/URL].<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: 'В жб на теха',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Тык*[/URL]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
    {
     title: '----------------------------------------------------------> Передам(обжалование) <-------------------------------------------------------',
    },
    {
     title: 'Для ГА',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваше обжалование было передано на рассмотрение Главному Администратору.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: GA_PREFIX,
     status: true,
    },
    {
     title: 'Для Сакаро',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваше обжалование было передано на рассмотрение [Color=#1E90FF] Руководителю Модерации Дискорда.[/COLOR] <br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: PIN_PREFIX,
     status: true,
    },
    {
     title: 'Для Спец Адм',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]Ваше обжалование было передано на рассмотрение Специальной Администрации.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
       prefix: SPECY_PREFIX,
     status: true,
    },
    {
           title: '---------------------------------------------------------------> Амнистии <---------------------------------------------------------------',
        },
                {
                    title: 'Свой ответ',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE]  <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: 123,
            status: 123,
        },
        {
            title: 'Не по форме',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите сюда*[/URL]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
        },
    {
     title: 'Дубликат',
     content:
       '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
       "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE] Дублирование темы. <br> Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован.<br>"+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
       "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Основной Заместитель Главного Администратора.[/FONT][/COLOR]<br>",
       prefix: CLOSE_PREFIX,
     status: false,
    },
        {
            title: 'Обжалованию не подлежит',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Выданное вам наказание не подлежит обжалованию. <br>"+
            "Нарушения, по которым заявка на обжалование не рассматривается: <br>"+
            "[ISPOILER] 4.1. различные формы слива 4.2. продажа игровой валюты 4.3. махинации <br> 4.4. целенаправленный багоюз 4.5. продажа, передача аккаунта 4.6. сокрытие ошибок, багов системы <br> 4.7. использование стороннего программного обеспечения 4.8. распространение конфиденциальной информации 4.9. обман администрации. [/ISPOILER]  <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Отказано',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] В обжаловании отказано <br>"+
            "[ICODE]1.6. Каждая заявка на обжалование рассматривается индивидуально. <br> 1.7. Оформленная заявка на обжалование не означает гарантированного одобрения со стороны руководства сервера, она может быть отклонена без объяснения причин.[/ICODE]  <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
    title: 'Не готовы снизить',
    content:
    '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][COLOR=WHITE] Администрация сервера не готова снизить вам наказание. <br>"+
    "Пожалуйста, не создавайте дубликаты, создание дубликатов карается блокировкой форумного аккаунта. <br>"+
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
    prefix: CLOSE_PREFIX,
    status: false
},
        {
            title: 'ОБЖ на рассмотрении',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваше обжалование было взято на рассмотрение. <br> Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Передано ГА обж',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Обжалование передано Главному Администратору.<br> Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: 'Наказание полностью снято',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>Наказание будет снято в течении 24 часов. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: ACCEPT_PREFIX,
	        status: false,
        },
        {
            title: 'Наказание сокращено',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] После рассмотрения темы было принято решение о сокращении вашего наказания.<br>Наказание будет заменено в течении 24 часов. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'Руководителю Модераторов',
	        content:
		    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=RED]{{ greeting }}, уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=RED] Ваше обжалование передано на [/COLOR][COLOR=Yellow]рассмотрение[/COLOR][COLOR=BLUE] Руководству модерации <br>Ожидайте ответа в данной теме. Не создавайте повторные темы в противном случае Вы можете получить блокировку форумного аккаунта.<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'В другой раздел',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваше обращение относится к другому разделу <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Недостаточно док-ев',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Недостаточно доказательств для корректного [/COLOR][COLOR=Yellow]рассмотрения[/COLOR][COLOR=RED] вашего обращения. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Отсутствуют док-ва',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] В вашем обжаловании отсутствуют доказательства.<br>Следовательно обжалование [/COLOR][COLOR=Yellow]рассмотрению[/COLOR][COLOR=RED] не подлежит. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Смена NikName',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Ваш аккаунт разблокирован на 24 часа. Чтобы сменить никнейм - /mm - 8 или через /donate <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'NonRP Обман(от обманутой стороны)',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Аккаунт игрока будет разблокирован на 24 часа,за это время игрок должен вернуть обманутое имущество.<br>"+
            "[B][CENTER][COLOR=WHITE] После возращения имущества,оставьте доказательства в этой теме <br>"+
            "[B][CENTER][COLOR=WHITE] Ожидаю ответа в этой теме<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: 'Отсутствует /time',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] В ваших доказательствах отсутствует /time.<br>Следовательно, обжалование [/COLOR][COLOR=Yellow]рассмотрению[/COLOR][COLOR=RED] не подлежит. <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Невозврат ущерба',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] У вас было 24 часа на возмещение ущерба, за это время вы не вернули обманутое имущество,аккаунт будет заблокирован навсегда <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },{
    title: 'Обманутый должен писать',
    content:
        '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
        "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE] Игрок которого вы обманули должен сам написать обжалование.<br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
    prefix: CLOSE_PREFIX,
    status: false,
        },
        {
     title: 'Вернул имущество',
    content:
    '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][COLOR=WHITE]Имущество было возвращено. <br>" +
    "Приятной игры на сервере [COLOR=RED]PSKOV[/COLOR]![/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
    prefix: CLOSE_PREFIX,
    status: false
},
        {
    title: 'Не вернул имущество',
    content:
    '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][COLOR=WHITE]Игрок не вернул имущество. Аккаунт будет заблокирован.<br>" +
    "В случае передачи имущества куда-либо все аккаунты, на которые было передано имущество, также будут заблокированы.[/COLOR][/CENTER][/B]<br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
    "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
    prefix: CLOSE_PREFIX,
    status: false
},
        {
            title: 'Док-ва в соц. сетях',
	        content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются.<br>Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube). <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Окно бана',
	        content:
		    '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Создайте новое обжалование прикрепив в доказательствах окно блокировки при входе <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: CLOSE_PREFIX,
            status: false
        },
        {
            title: 'Ошиблись сервером',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE]Вы ошиблись сервером, напишите обжалование на сервере на котором вы получили блокировку <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
         {
                    title: 'Запрос ВК',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Прикрепите ссылку на вашу страницу в VK.[/COLOR] <br> [COLOR=#FFA500] На рассмотрении [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: PIN_PREFIX,
            status: 178
         },
         {
                    title: 'ссылку на жб',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Прикрепите ссылку на жалобу на данного игрока.[/COLOR] <br> [COLOR=#FFA500] На рассмотрении [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: PIN_PREFIX,
            status: 178
         },
          {
                    title: 'На рассмотрении(жб)',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Запросил доказательства у администратора. <br> Ожидайте, ответа от администрации и не нужно создавать копии этой темы. [/COLOR] <br> [COLOR=#FFA500] На рассмотрении [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: PIN_PREFIX,
            status: true
         },
             {
                    title: 'Наказание верное',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Администратор предоставил доказательства. <br> Наказание выдано верно. [/COLOR] <br> [COLOR=#8B0000] Закрыто [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
                     {
                    title: 'Наказание неверное',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] С администратором будет проведена работа. <br> Наказание будет снято в течении 24-х часов. [/COLOR] <br> [COLOR=#00FF00] Одобрено [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: ACCEPT_PREFIX,
            status: false
         },
                             {
                    title: '48 часов',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. [/COLOR] <br> [COLOR=#8B0000] Закрыто [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
                                  {
                    title: 'В жб на теха',
	        content:
		    '[CENTER][FONT=Georgia][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
		    "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
		    "[B][CENTER][COLOR=WHITE] Вы ошиблись разделом. <br> Вам было выдано наказание Техническим Специалистом [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL]  [/COLOR] <br> [COLOR=#8B0000] Закрыто [/COLOR] <br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        	prefix: CLOSE_PREFIX,
            status: false
         },
        {
            title: 'Ник изменён',
            content:
            '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
            "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE] NickName был изменён Приятной Игры на сервере PSKOV<br>"+
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
            "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
            prefix: ACCEPT_PREFIX, // Префикс "Одобрено"
            status: true,
        },
    {
        title: 'Ник не изменён',
        content:
        '[CENTER][FONT=Georgia][url=https://postimages.org/][img]https://i.postimg.cc/k4v0KjRf/f3eabafac57241f0ac0dd6776a1c00ff.gif[/img][/url]<br>' +
        "[B][CENTER][COLOR=WHITE]{{ greeting }} [/COLOR],[COLOR=RED] уважаемый {{ user.name }} [/COLOR][/CENTER][/B]<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE] Вы не изменили Nick_Name за 24 часа аккаунт будет заблокирован снова<br>"+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]' +
        "[B][CENTER][COLOR=WHITE]С уважением [/COLOR][COLOR=RED]Заместитель Главного Администратора [/FONT][/COLOR]<br>",
        prefix: CLOSE_PREFIX, // Префикс "Закрыто"
        status: false,
    }




  ];

   $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        // Добавление кнопок при загрузке страницы
        addButton('Меню', 'selectAnswer');



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