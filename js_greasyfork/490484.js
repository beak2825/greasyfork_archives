// // ==UserScript==
// @name         SOCHI | ADM Script for forum
// @namespace    https://forum.blackrussia.online
// @version      1.1.0
// @description  Скрипт для Руководства сервера Sochi
// @author       Don_Washington
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator Kirill
// @icon https://takocode.ru/assets/imgs/avatar.gif
// @downloadURL https://update.greasyfork.org/scripts/490484/SOCHI%20%7C%20ADM%20Script%20for%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/490484/SOCHI%20%7C%20ADM%20Script%20for%20forum.meta.js
// ==/UserScript==
  (function () {
    'use strict';
  const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SA_PREFIX = 11;
  const buttons = [
      {
        title: 'Свой ответ',
        content:
          '[SIZE=4][COLOR=rgb(0, 255, 127)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
        },
        {      
          title: '_________________________________Жалобы на администрацию________________________________________',
        },
        {
          title: 'На рассмотрении',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]Ожидайте ответа...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title: 'Запрос докв',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Запрошу доказательства у администратора, ожидайте вердикта в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title : 'Прошло 48 часов',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к с момента выдачи наказания прошло более 48-и часов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'от 3-его лица',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба отказана, т.к она написана от 3-его лица.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'Уже дан ответ',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вам уже был дан корректный ответ в прошлых темах.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false, 
        },
        {
          title : 'Наказание по ошибке',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Вследствие беседы с администратором было выяснено, что наказание было выдано по ошибке, вы будете разблокированы в течение нескольких часов.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Беседа с админом',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба была одобрена, в сторону администратора будут приняты необходимые меры.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Нет нарушений',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'Наказание верное',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false, 
         },
         {
          title : 'Не работает док-во ',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваши доказательства не рабочие или же битая ссылка.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'ЖБ не по форме',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалобы - [/I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Недостаточно док-в в «Жалобе»',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств нарушения со стороны администратора.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Редактор док-в',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства предоставлены в плохом качестве, или подвергались редактированию,Составьте повторно жалобу, с предоставлением нормальных доказательств.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Фейковые доказательства',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства являются подделанными, Форумный аккаунт будет заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Док-во соц сети',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Доказательства из каких-либо соц. сетей не принимаются, Требуется загрузить доказательства на какой-либо фото/видео хостинг.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Нету /time',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]На ваших доказательствах отсутствует /time.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Нужен Скрин бана',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]В ваших доказательствах отсутсвует скриншот окна бана при входе на сервер.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'В обжалования',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в раздел обжалований наказаний - [/I][URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.1235/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
         '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		 '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'В тех. раздел',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в технический раздел - [/I][URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title: 'Передано Специальной администрации',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Жалоба передана Специальному Администратору, а так же его Заместителю - @Sander_Kligan / @Clarence Crown, пожалуйста ожидайте ответа...[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: SA_PREFIX,
          status: true,
        },
        {
          title: 'Передано ГА',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному администратору[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: GA_PREFIX,
          status: true,
        },
         {
          title: 'Передаю КП',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4[COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Команде Проекта.[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: COMMAND_PREFIX,
          status: false,
         },
         {
          title: 'Передано Рук.МД',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Жалоба передана Руководителю модерации Discord.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
        },
		{
		title: 'В ЖБ на ТЕХ',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
           "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Обратитесь в жалобы на технического специалиста - [/I][URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
         title: 'Нрп обман.связь',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
           "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Свяжитесь с пострадавшим в любой соц.сети, после этого пострадавший должен создать тему обжалованя, указав ссылки на ваши соц.сети, а так же приложив скриншот вашей переписки в которой будет согласие на возравт имущеста.[/SIZE][/FONT][/COLOR][/CENTER]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: '_________________________________Обжалования________________________________________',
        },
         {
          title : 'Обжалование на рассмотрение',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование взято «На рассмотрение».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" + 
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]Ожидайте ответа...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: false, 
         },
         {
          title : 'Срок снижен до 30 дней',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 30 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Срок снижен до 15 дней',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 15 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
         '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		 '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Срок снижен до 7 дней',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 7 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Срок снижен до 3 дней',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Срок блокировки аккаунта будет снижен до 3 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'ОБЖ Одобрено',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование «Одобрено».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Одобрено, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'ОБЖ Отказано',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование «Отказано».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'ОБЖ не по форме',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи обжалования - [/I][URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL][/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Обжалованию не подлежит',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Данное наказание, которое вам выдано - обжалованию «Не подлежит».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'В ЖБ на АДМ',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Если не согласны с выданным наказанием от администрации, то обратитесь в раздел «Жалобы на администрацию».[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
		  '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Недостаточно док-в в «ОБЖ»',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Недостаточно доказательств, чтобы корректно рассмотреть данное обжалование.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
		  '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 0, 0)][ICODE]Отказано, Закрыто.[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title: 'На рассмотрении',
          content:
          '[B][CENTER][url=https://postimages.org/][img]https://i.postimg.cc/q7pLC4Bz/RLwzo.png[/img][/url]<br>'+
          '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
          "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваше обжалование взято на рассмотрение.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[I][CENTER][SIZE=1][COLOR=rgb(255, 140, 0)][ICODE]Ожидайте ответа...[/ICODE][/SIZE][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,

         },
        ];
 
 
          $(document).ready(() => {
            // Загрузка скрипта для обработки шаблонов
            $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
           
            // Добавление кнопок при загрузке страницы
            addButton('На рассмотрение', 'pin');
            addButton('КП', 'teamProject');
            addButton('Одобрено', 'accepted');
            addButton('Отказано', 'unaccept');
            addButton('Вердикты', 'selectAnswer');
           
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