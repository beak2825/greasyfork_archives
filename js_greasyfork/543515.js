// ==UserScript==
// @name         KHABAROVSK Куратор адм
// @namespace    https://forum.blackrussia.online/
// @version      1.6.1
// @description  Если нашли баг/недочёт писать
// @author       Baker Jordan
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://i.postimg.cc/dVF25LZY/JS.png
// @downloadURL https://update.greasyfork.org/scripts/543515/KHABAROVSK%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%B0%D0%B4%D0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/543515/KHABAROVSK%20%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%20%D0%B0%D0%B4%D0%BC.meta.js
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
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴на рассмотрении ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'На рассмотрении(жб)',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: 'ссылку на жб',
        content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Прикрепите ссылку на данную жалобу в течении 24 часов.[/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]На рассмотрении[/COLOR][/FONT][/CENTER]',
        prefix: PIN_PREFIX,
      status: 123,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴доки╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'запрошу доки',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Запрошу доказательства у администратора. <br> Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы. [/COLOR][/FONT][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: 'выдано верно',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I] <br><br>' +
        "[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Проверив доказательства администратора, было принято решение, что наказание было выдано [/SIZE][COLOR=rgb(65, 168, 95)][SIZE=5]верно[/SIZE][/COLOR][SIZE=5].[/SIZE][/COLOR][/FONT][/I][/CENTER]<br><br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'выдано не верно',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5] В следствие беседы с администратором, было выяснено, что наказание было выдано по [/SIZE][COLOR=rgb(226, 80, 65)][SIZE=5]ошибке.[/SIZE][/COLOR][SIZE=5] [/SIZE][/COLOR][/FONT][/I][/CENTER] <br> [CENTER][COLOR=rgb(250, 197, 28)]Ваше наказание будет [/COLOR][COLOR=rgb(184, 49, 47)]снято. [/COLOR][/CENTER] <br>" +
        '[CENTER][FONT=verdana]Приятной игры на сервере [COLOR=rgb(250, 197, 28)]KHABAROVSK[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴ отказы жб на адм ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'не по форме',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Нет /time',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]В предоставленных доказательствах отсутствует /time. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Нет /myreports',
      content:
   '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER]' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]В предоставленных доказательствах отсутствует /myreports. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'От 3 лица',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Жалобы написанные от 3-его лица не подлежат рассмотрению. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Нужен фрапс',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Фрапс обрывается',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваш фрапс обрывается, загрузите полный фрапс на ютуб. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Док-ва отредактированы',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал. Иначе Ваш форумный аккант может быть [/SIZE][COLOR=rgb(184, 49, 47)][SIZE=5]заблокирован.[/SIZE][/COLOR][/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'Прошло более 48 часов',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'соц сеть',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'нет окна бана',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]На ваших доказательствах отсутствует окно блокировки аккаунта. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'нет докв',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]В вашей жалобе отсутствуют доказательства. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'не работают доки',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Предоставленные доказательства не рабочие. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'дубликат',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/COLOR][/FONT][/CENTER] Ответ был дан ранее. <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
     {
      title: 'нет нарушений',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Исходя из выше приложенных доказательств, нарушения со стороны администратора  не имеется! [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'адм снят/псж',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Администратор был снят/ушел с поста администратора. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
   {
   title: 'ошиблись сервером',
   content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вы ошиблись сервером. <br>Обратитесь в раздел жалоб на администрацию вашего сервера.[/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
   prefix: CLOSE_PREFIX,
   status: false,
    },
     {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴одобренные жб на адм ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'будет проинструктирован',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Благодарим за ваше обращение! Администратор будет проинструктирован. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][FONT=verdana]Приятной игры на сервере [COLOR=rgb(250, 197, 28)]KHABAROVSK[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
      title: 'проведу беседу',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][FONT=verdana]Приятной игры на сервере [COLOR=rgb(250, 197, 28)]KHABAROVSK[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
      title: 'Адм будет наказан',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была одобрена и администратор получит наказание. [/FONT][/COLOR][CENTER] <br>" +
        '[CENTER][FONT=verdana]Приятной игры на сервере [COLOR=rgb(250, 197, 28)]KHABAROVSK[/COLOR][/FONT][/CENTER]',
      prefix: ACCEPT_PREFIX,
   status: false,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴передам(жб) ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },
    {
      title: 'для зга гос/опг',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: 'для зга',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: 'для га',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение [/SIZE][/COLOR][COLOR=rgb(235, 107, 86)][SIZE=5]Главному Администратору.[/SIZE][/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: GA_PREFIX,
   status: true,
    },
    {
      title: 'для сакаро',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение [COLOR=#1E90FF]Руководителю Модерации Дискорда.[/COLOR] [/SIZE][/COLOR][/FONT][/I][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте его ответа.[/COLOR][/FONT][/CENTER]',
      prefix: PIN_PREFIX,
   status: true,
    },
    {
      title: 'для спец адм',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ваша жалоба была передана на рассмотрение Специальной Администрации. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Ожидайте ответа.[/COLOR][/FONT][/CENTER]',
      prefix: SPECY_PREFIX,
   status: true,
    },
    {
     title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴другой раздел ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
    },

{
      title: 'в жб на игроков',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Данный игрок не является администратором.<br>Обратитесь в раздел Жалоб на игроков - [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.2206/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },

{
      title: 'в жб на лд',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Данный игрок является лидером.<br>Обратитесь в раздел Жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2205/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'в обжалование',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел Обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2207/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'в тех раздел',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вы ошиблись разделом.<br>Обратитесь в Технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Тык*[/URL]. [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
    {
      title: 'в жб на теха',
      content:
  '[CENTER][I][SIZE=4][FONT=arial][COLOR=#FFFF00]Здравствуйте, уважаемый {{ user.mention }}.[/COLOR][/FONT][/SIZE][/I][/CENTER] <br><br>' +
        "[I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Вам было выдано наказания Техническим специалистом, вы можете написать жалобу/обжалование здесь - [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Тык*[/URL] [/COLOR][/FONT][/CENTER] <br>" +
        '[CENTER][I][FONT=times new roman][COLOR=#FFFF00][SIZE=5]Закрыто. [/COLOR][/FONT][/CENTER]',
      prefix: CLOSE_PREFIX,
   status: false,
    },
     ];

  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('На рассмотрение', 'pin');
    addButton('КП', 'teamProject');
    addButton('Га', 'Ga');
    addButton('Спецу', 'Spec');
    addButton('Click me', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));

    $(`button#selectAnswer`).click(() => {
      XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
      buttons.forEach((btn, id) => {
        if (id > 0) {
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