// ==UserScript==
// @name         ANAPA | Главным следящим by N.Donsckoy
// @namespace    https://forum.blackrussia.online/
// @version      1.0
// @description  Скрипт для ответа на жалобы игроков | Black Russia Anapa
// @author       Nekit_Donsckoy
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL
// @updateURL
// ==/UserScript==
(function () {
  'use strict';
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [
           {
           title:'________________________________________Рассмотрение/перенаправление________________________________________',
           },
           {
             title: 'На рассмотрении',
             content:
              '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][CENTER][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/CENTER][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/url][/CENTER]<br>' +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Ваша жалоба взята на рассмотрение, ожидайте ответа в данной теме.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[I][CENTER][COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/COLOR][/CENTER][/I]<br><br>" +
              "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url][/CENTER]"+
              '[I][CENTER][SIZE=2][COLOR=rgb(255, 140, 0)][ICODE]На рассмотрение...[/ICODE][/SIZE][/CENTER][/COLOR]',
             prefix: PIN_PREFIX,
             status: true,
           },
           {
             title: 'В ЖБ на адм',
             content:
              '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>' +
              "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.1400/'][I]Вы ошиблись разделом, обратитесь в раздел жалоб на администрацию[/I][/URL][/FONT][/SIZE]<br><br>" +
              "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
              '[url=https://postimages.org/][img]https://sun9-13.userapi.com/c627229/v627229095/1dbf2/niBXXem02v4.jpg[/img][/url]',
             prefix: UNACCEPT_PREFIX,
             status: false,
           },
           {
              title: 'В обжалование ЕЧСФ',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][URL='https://forum.blackrussia.online/threads/anapa-Обжалование-ЕЧС-ГОСС.12414138/'][I]Вы ошиблись разделом, обратитесь в раздел Обжалование ЕЧС фракции.[/I][/URL][/FONT][/SIZE]<br><br>" +
               "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы в этом разделе, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[COLOR=rgb(16612, 12, 12)][SIZE=4][FONT=times new roman][I]Отказано.[/I][/FONT][/SIZE][/COLOR]<br><br>' +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]" ,
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Нет лд',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+

               '[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Данный лидер уже снят с поста.[/I][/FONT][/SIZE]<br><br>'+

               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]Закрыто[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+
               '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/COLOR]',
              prefix: COMMAND_PREFIX,
              status: false,
           },
           {
              title:'______________________________________________________Одобрено______________________________________________________',
           },
           {
              title: 'Устное',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+

               '[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I][I]Ваша заявка была проверена и администрация готова принять решение.<br><br>'+
               'Лидер получит устное предупреждение.[/I][/I][/FONT][/SIZE]<br><br>'+

               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]Одобрено.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+
               '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/COLOR]',
              prefix: ACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Пред',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+

               '[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I][I]Ваша заявка была проверена и администрация готова принять решение.<br><br>'+
               'Лидер получит предупреждение.[/I][/I][/FONT][/SIZE]<br><br>'+

               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]Одобрено.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+
               '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/COLOR]',
              prefix: ACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'выг',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+

               '[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I][I]Ваша заявка была проверена и администрация готова принять решение.<br><br>'+
               'Лидер получит выговор.[/I][/I][/FONT][/SIZE]<br><br>'+

               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]Одобрено.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+
               '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/COLOR]',
              prefix: ACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Строгий выг',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+

               '[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I][I]Ваша заявка была проверена и администрация готова принять решение.<br><br>'+
               'Лидер получит строгий выговор.[/I][/I][/FONT][/SIZE]<br><br>'+

               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]Одобрено.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+
               '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/COLOR]',
              prefix: ACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Строгий выг',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+

               '[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I][I]Ваша заявка была проверена и администрация готова принять решение.<br><br>'+
               'Лидер будет снят.[/I][/I][/FONT][/SIZE]<br><br>'+

               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]Одобрено.[/ICODE][/I][/SIZE][/FONT][/COLOR]<br><br>'+
               '[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR][/COLOR]',
              prefix: ACCEPT_PREFIX,
              status: false,
           },
           {
              title:'______________________________________________________Отказано______________________________________________________',
           },
           {
              title: 'Недостаточно док-в',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Недостаточно доказательств для корректного рассмотрения вашей жалобы.[/I][/SIZE][/FONT]<br><br>" +
               "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false
           },
           {
              title: 'Отсутствуют док-ва',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Отсутствуют доказательства - следовательно, рассмотрению не подлежит. Загрузите доказательства на фото-видео хостинги YouTube, Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
               "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Не работает док-во',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]]Ваши доказательства не рабочие или же битая ссылка.[/I][/SIZE][/FONT]<br><br>" +
               "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false
           },
           {
              title: 'Док-ва отредакт',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Доказательства были подвергнуты редактированию - следовательно, рассмотрению не подлежит.<br><br>" +
               "Загрузите оригиналы видеозаписи/скриншотов, создав новую тему в данном разделе.<br><br>" +
               "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Док-ва обрываются',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Ваша видеозапись обрывается. Загрузите полную видеозапись на видео-хостинг YouTube.<br><br>" +
               "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Док-ва в соц. сетях',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги YouTube,Imgur, Yapx и так далее.[/I][/FONT][/SIZE]<br><br>" +
               "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Нужен Фрапс',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]В данной ситуации обязательнодолжен быть фрапс(видео фиксация)всех моментов.[/I][/SIZE][/FONT]<br><br>" +
               "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false
           },
           {
              title: 'Неполный Фрапс',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Видео фиксация не полная либо же нет условий сделки.[/I][/SIZE][/FONT]<br><br>" +
               "[I][FONT=times new roman][SIZE=4]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/SIZE][/FONT][/I][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false
           },
           {
              title: 'Нет time',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]На доказательствах отсутствуют дата и время [/I]([/SIZE][/FONT][FONT=courier new][SIZE=4]/time[/SIZE][/FONT][FONT=times new roman][SIZE=4])[I] - следовательно, рассмотрению не подлежит.<br><br>" +
               "Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title : 'Нет таймкодов'  ,
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][SIZE=4][FONT=times new roman][I]Ваша жалоба отказана, т.к в ней нету таймкодов. Если видео длится больше 3-ех минут - Вы должны указать таймкоды нарушений.[/FONT][/SIZE]<br><br>" +
               "[FONT=times new roman][SIZE=4][I]Просьба не создавать дубликаты этой темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br> <br>" +
               "[FONT=times new roman][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/SIZE][/FONT][/COLOR]<br><br>" +
               '[url=https://postimages.org/][img]https://s4.hostingkartinok.com/uploads/images/2013/05/1a612be953e1187f103dc4ae3f1d2b32.gif[/img][/url]',
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Нарушений нет',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Нарушений со стороны игрока не было замечено.<br><br>" +
               "[URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']Внимательно изучите общие правила серверов.[/I][/URL]<br><br>" +
               "[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]",
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
           {
              title: 'Не по форме',
              content:
               '[COLOR=rgb(0, 255, 127)][FONT=times new roman][SIZE=4][I][ICODE]{{ greeting }}, уважаемый {{ user.name }}[/ICODE].[/I][/SIZE][/FONT][/COLOR]<br><br>' +
               "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4][I]Нарушений со стороны игрока не было замечено.<br><br>" +
               "[URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-лидеров.3429391/']Ваша жалоба составлена не по форме.[/I][/URL]<br><br>" +
               "[I]Просьба не создавать дубликаты данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/I][/SIZE][/FONT][/COLOR]<br><br>" +
               "[FONT=book antiqua][SIZE=4][COLOR=rgb(209, 213, 216)][I]Приятной игры на BLACK RUSSIA ANAPA [/I][/COLOR][I][COLOR=rgb(0, 140, 240)]Role Play[/COLOR][/I][/SIZE][/FONT][COLOR=rgb(0, 140, 240)][FONT=book antiqua][SIZE=4][I].[/I][/SIZE][/FONT][/COLOR]",
              prefix: UNACCEPT_PREFIX,
              status: false,
           },
        ];


  $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
    addButton('Закрыто', 'close');
    addButton('На рассмотрение', 'pin');
    addButton('Одобрено', 'accepted');
    addButton('Отказано', 'unaccept');
    addButton('Ответы', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Texy').click(() => editThreadData(TEX_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));

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

function getFormData(data) {
const formData = new FormData();
Object.entries(data).forEach(i => formData.append(i[0], i[1]));
return formData;
}
}
})();