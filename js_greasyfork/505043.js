// // ==UserScript==
// @name         ANAPA Скрипт от руфета
// @namespace    https://forum.blackrussia.online
// @version      1.1
// @description  Скрипт для Руководства сервера Penza
// @author       Rufet_Banhammer
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator 
// @icon https://klike.net/uploads/posts/2021-12/1638345168_12.jpg
// @downloadURL https://update.greasyfork.org/scripts/505043/ANAPA%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%82%20%D1%80%D1%83%D1%84%D0%B5%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/505043/ANAPA%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BE%D1%82%20%D1%80%D1%83%D1%84%D0%B5%D1%82%D0%B0.meta.js
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
          '[SIZE=4][COLOR=rgb(0, 255, 127)][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/COLOR][/B]',
        },
        {      
          title: '_________________________________Жалобы на администрацию________________________________________',
        },
        {
          title: 'На рассмотрении',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Запрошу доказательства у администратора, ожидайте вердикта в данной теме.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрение...[/B][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
        },
        {
          title : 'Прошло 48 часов',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба отказана, т.к с момента выдачи наказания прошло более 48-и часов.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано.[/B][/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'от 3-его лица',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба отказана, т.к она написана от 3-его лица.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'Уже дан ответ',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вам уже был дан корректный ответ в прошлых темах.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false, 
        },
        {
          title : 'Наказание по ошибке',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Вследствие беседы с администратором было выяснено, что наказание было выдано по ошибке, вы будете разблокированы в течение нескольких часов.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Беседа с админом',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба была одобрена, в сторону администратора будут приняты необходимые меры.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Нет нарушений',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'Наказание верное',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]',
          prefix: CLOSE_PREFIX,
          status: false, 
         },
         {
          title : 'Не работает док-во ',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваши доказательства не рабочие или же битая ссылка.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
        },
        {
          title : 'ЖБ не по форме',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи жалобы - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите сюда*[/URL][/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Недостаточно док-в в «Жалобе»',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Недостаточно доказательств нарушения со стороны администратора.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Редактор док-в',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Доказательства предоставлены в плохом качестве, или подвергались редактированию,составьте повторно жалобу, с предоставлением нормальных доказательств.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Фейковые доказательства',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Доказательства являются подделанными, Форумный аккаунт будет заблокирован.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Док-во соц сети',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Доказательства из каких-либо соц. сетей не принимаются, Требуется загрузить доказательства на какой-либо фото/видео хостинг.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Нету /time',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]На ваших доказательствах отсутствует /time.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'Нужен Скрин бана',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]В ваших доказательствах отсутсвует скриншот окна бана при входе на сервер.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'В обжалования',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.2417/']*Нажмите сюда*[/URL][/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title : 'В тех. раздел',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']*Нажмите сюда*[/URL][/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
		 {
          title : 'В жалобы на техов',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Обратитесь жалобы на Технических Специалистов - [URL='https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9654-penza.2387/']*Нажмите сюда*[/URL][/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false, 
         },
         {
          title: 'Передано Специальной администрации',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба передана Специальному Администратору, а так же его Заместителю - @Sander_Kligan / @Clarence Crown / @Myron_Capone / @Dmitry Dmitrich, пожалуйста ожидайте ответа...[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрение...[/B][/CENTER][/COLOR]',
          prefix: SA_PREFIX,
          status: true,
        },
        {
          title: 'Передано ГА',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба переадресована [/B][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Главному администратору @Evgeniy_Lorenzo[/B][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрение...[/B][/CENTER][/COLOR]',
          prefix: GA_PREFIX,
          status: true,
        },
         {
          title: 'Передано КП',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба переадресована [/B][/FONT][/COLOR][COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Команде Проекта.[/B][/FONT][/COLOR][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4].[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрение...[/B][/CENTER][/COLOR]',
          prefix: COMMAND_PREFIX,
          status: false,
         },
         {
          title: 'Передано Рук.МД',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Жалоба передана Руководителю модерации Discord.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]На рассмотрение...[/B][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: true,
        },
         {      
          title: '_________________________________Обжалования________________________________________',
        },
         {
          title : 'Обжалование на рассмотрение',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваше обжалование взято «На рассмотрение».[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]<br>' +
          '[CENTER][SIZE=3][COLOR=rgb(255, 140, 0)]Ожидайте ответа...[/B][/CENTER][/COLOR]',
          prefix: PIN_PREFIX,
          status: false, 
         },
         {
          title : 'Срок снижен до 30 дней',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Срок блокировки аккаунта будет снижен до 30 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Срок снижен до 15 дней',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Срок блокировки аккаунта будет снижен до 15 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Срок снижен до 7 дней',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Срок блокировки аккаунта будет снижен до 7 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Срок снижен до 3 дней',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Срок блокировки аккаунта будет снижен до 3 дней,с момента разблокировки аккаунта, не повторяйте подобных действий.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'ОБЖ Одобрено',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваше обжалование «Одобрено».[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Одобрено, Закрыто.[/CENTER][/COLOR]',
          prefix: ACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'ОБЖ Отказано',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
         '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваше обжалование «Отказано».[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'ОБЖ не по форме',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Ваша жалоба составлена не по форме. Ознакомьтесь с правилами подачи обжалования - [URL='https://forum.blackrussia.online/threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/']*Нажмите сюда*[/URL][/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Обжалованию не подлежит',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Данное наказание, которое вам выдано - обжалованию «Не подлежит».[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'В ЖБ на АДМ',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Если не согласны с выданным наказанием от администрации, то обратитесь в раздел «Жалобы на администрацию».[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
         },
         {
          title : 'Недостаточно док-в в «ОБЖ»',
          content:
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vTpwmhvr/6.gif[/img][/url][/CENTER]<br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/hvwQPkw2/image.png[/img][/url][/CENTER]<br>' +
          '[CENTER][COLOR=RED][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR]<br><br>' +
          "[CENTER][COLOR=rgb(230, 230, 250)][B][FONT=times new roman]Недостаточно доказательств, чтобы корректно рассмотреть данное обжалование.[/B][/FONT][/COLOR][/CENTER]<br><br>" +
          '[CENTER][SIZE=3][COLOR=rgb(255, 0, 0)]Отказано, Закрыто.[/CENTER][/COLOR]',
          prefix: UNACCEPT_PREFIX,
          status: false,
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