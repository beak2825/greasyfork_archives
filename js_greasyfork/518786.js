// ==UserScript==
// @name Для Руководства администрации сервера TOMSK | 84
// @namespace https://forum.blackrussia.online
// @version 0.1.8
// @description Для РА 
// @author Maksim_Vitalievich
// @match https://forum.blackrussia.online/threads/*
// @include https://forum.blackrussia.online/threads/
// @grant none
// @license MIT
// @collaborator !
// @icon https://icons.iconarchive.com/icons/papirus-team/papirus-apps/48/emerald-theme-manager-icon-icon.png
// @downloadURL https://update.greasyfork.org/scripts/518786/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20TOMSK%20%7C%2084.user.js
// @updateURL https://update.greasyfork.org/scripts/518786/%D0%94%D0%BB%D1%8F%20%D0%A0%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D0%B8%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20TOMSK%20%7C%2084.meta.js
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
        title: 'Жалобы на администрацию ',
        style: 'width: 97%; background: #ff0000; box-shadow: 0px 0px 3px #fff',
    },
   {
        title: 'Жалобы на рассмотрение ',
        style: 'width: 97%; background: #ff9800; box-shadow: 0px 0px 3px #fff',
    },
    {
    title: 'Запрошу доказательства',
    content:
    '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Запрошу доказательства у администратора. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'На рассмотрении',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба взята [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем, иначе форумный аккаунт может быть заблокирован[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Рук Модер ДС',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа.[/color]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
   "[CENTER]Ваша жалоба будет передана [Color=Red]Главному администратору[/color] - @~𝕀𝕧𝕒𝕟_𝔽𝕦𝕝𝕘𝕒~ [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'ЗГА',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба будет передана [Color=Red]Заместителю главного администратора[/color]- @Zheka Jordan[Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone @Liana_Mironova, @Gleb Xovirs[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба будет передана [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: COMMAND_PREFIX,
    status: true,
    },
 {
        title: 'ОДОБРЕННЫЕ / ЗАКРЫТЫЕ ',
        style: 'width: 97%; background: #4caf50; box-shadow: 0px 0px 3px #fff',
    },
    {
    title: 'Доки предоставлены (наказание снято)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба была [color=#32CD32]Одобрена[/color].<br>С администратором будет проведена беседа.<br>Наказание будет снято.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ПРОСТО НАКАЗАНИЕ СНЯТО.',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Наказание будет снято.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
 {
    title: 'Наказание администратора',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Администратор будет наказан. Спасибо за обращение![/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
  {
    title: 'Ответ дан верно на жалобу/биографию',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Нарушений со стороны администратора нет. Ответ дан корректно.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Наказание снято и GW',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба была одобрена. Наказание будет снято, GunWarn тоже.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Перевыдача наказания',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Наказание будет перевыдано.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
 
    {
    title: 'проинструктирован',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Спасибо за обращение. Администратор будет проинструктирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
  "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена беседа.[/CENTER]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором(строгая)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба была одобрена. С администратором будет проведена строгая беседа.[/CENTER]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Будет проведена беседа с Администратором, ответ будет исправлен (КФ)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба была одобрена.<br>Ответ в жалобе будет исправлен.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Администратор ошибся ',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Администратор допустил ошибку. Приносим извинения за предоставленные неудобства.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Администратор снят',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Администратор снят.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Игрок не является администратором',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Данный игрок не является администратором.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Проф беседа',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]С администратором будет проведена профилактическая беседа.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Информация будет проверена.',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Информация будет проверена, в случае подтверждения информации администратор получит соответствующее наказание.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: WATCHED_PREFIX,
    status: false,
    },
    {
    title: 'Наказание адм',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Администратор получит соответсвующее наказание.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не помог с репортом',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]У администратора произошли проблемы, из-за которых он вам не смог помочь. Приносим извинения за предоставленные неудобства. [/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не успел зафиксировать, наруш не выдал',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]К сожалению администратор не успел зафиксировать наказание, поэтому наказание игроку не было выдано.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'СНЯТО, перевыдано',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше наказание было снято / перевыдано чуть позже, когда администратор увидел ошибку.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Не достал / починил',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Администратор не обязан доставать автомобиль из воды, или же чинить, т.к это является Role Play процессом. К примеру, Вы можете воспользоваться услугами такси, автобуса, либо попросить знакомых.<br>Нарушений со стороны администратора нет. [/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: ' типо блат, но сокращено с вип',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER] Прежде чем составлять подобные жалобы, нужно грамотно изучить мод игры. Игрокам с VIP статусом наказание снижается автоматически при его выдачи. То есть, администратор выдает наказание по регламенту, а система сама, исходя из пропорций снижает наказание. <br> Блата тут нет, нарушений тоже. [/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'Если не отпишут',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Создайте повторную заявку, если не отпишут в течении 24 часов, то напишите повторную жалобу.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    },
    {
    title: 'будет исправлены (Заявки)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Скоро будет все исправлено.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'будет рассмотрены (Заявки)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Скоро будет все рассмотрено.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'скоро будут рассмотрены (жалобы/обж/био/сит)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Скоро все будет рассмотрено, сроки рассмотрения не нарушаются.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено. Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
    title: 'ограничение vmute / rmute',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Выдача голосового чата только максимально 60 минут.<br> Выдача блокировки репорта максимально 120 минут.<br>Нарушений со стороны администратора нет.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Закрыто.[/color]<br>'+
    '[CENTER]Приятной игры и времяпровождение на сервере [COLOR=rgb(0, 233, 178)]TOMSK[/COLOR].[/CENTER][/B][/SIZE]',
    prefix: CLOSE_PREFIX,
    status: false,
    },
    {
        title: 'Отказанные ',
        style: 'width: 97%; background: #d32f2f; box-shadow: 0px 0px 3px #fff',
    },
    {
    title: 'Доки предоставлены, наказание выдано верно',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки предоставлены, наказание выдано по жб на ф',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Наказание было выдано по жалобе на форуме. Проверив доказательство, было принято решение, что наказание выдано верно.<br>Впредь не нарушайте правила сервера, ознакомиться можно по ссылке - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/'][Color=rgb(255,0,0)]«Общие правила серверов»[/color].[/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба составлена не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/'][COLOR=rgb(255,0,0)]«правилами подачи жалоб на администрацию».[/color][/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех.спец',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Обратитесь в жалобы на технических специалистов[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В тех раздел',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Обратитесь со своей проблемов в  [URL='https://forum.blackrussia.online/index.php?forums/Сервер-№9-cherry.1190/']«Технический раздел [Color=rgb(128,0,64)]CHERRY[/COLOR]».[/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Вы ошиблись разделом/сервером',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Вы ошиблись разделом / сервером. Переподайте жалобу в нужный раздел / сервер.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'жб 3-е лицо',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Жалоба составлена от 3-го лица, что не подлежит рассмотрению.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отсутствуют доки',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]В жалобе отсутствуют доказательство о нарушении от администратора. Создайте повторную жалобу и прикрепите доказательства.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Прикрепление ссылки (КФ))',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Прикрепите в новой жалобе ссылку, где не согласны с вердиктом администратора.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
    title: 'На доках постороннее ПО',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша жалоба не подлежит рассмотрению, поскольку вы используете не оригинальные файлы игры. (Сборка/Постороннее ПО) [/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Недостаточно доказательств «ЖБ»',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Недостаточно доказательств, чтобы корректно рассмотреть данную жалобу.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'доки обрезанные',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваши доказательства подверглись редактированию, создайте повторную тему и прикрепите доказательства в первоначальном виде.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    status: false,
    },
    {
    title: 'не рабочие доки',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Не работают доказательства.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Смайлик клоуна, оск в жб',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Жалобы с подобным содержанием не подлежат рассмотрению.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нарушений со стороны администратора нет.',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Нарушений со стороны администратора нет.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Дублирование темы',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Вам уже ранее был дан корректный ответ, за создание дубликатов этой темы ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'прошло время+в обж',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]В вашем случае нужно было сразу реагировать на выданное наказание и обращаться в раздел жалоб на администрацию, в настоящий момент срок написания жалобы прошел.<br>Обратитесь в раздел Обжалование наказаний.<br>Просьба не создавать копии данной темы, иначе ваш форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В ОБЖ',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Если хотите как-то снизить свое наказание, то можете написать в раздел [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.436/'][Color=rgb(255,0,0)]«Обжалование наказаний»[/COLOR][/URL], но не факт, что обжалование одобрят.<br> Перед написанием обжалования внимательно ознакомьтесь с правилами подачи заявок на обжалование наказания[/CENTER]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана.',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Прикрепите в новой жалобе окно блокировки игрового аккаунта при входе в игру.[/CENTER]<br><br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'бан IP',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Перезагрузите роутер или переключите на другой провайдер, если блокировка IP останется, то напишите повторную жалобу. [/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '48 часов',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]С момента получения наказание прошло 48 часов.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Доки из соц сети',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Доказательства в социальных сетях и т.д. не принимаются. Загрузите доказательства на фото-видео хостинги:<br>[URL='https://imgur.com/']IMGUR[/URL]<br>[URL='https://yapx.ru/']Yapix[/URL]<br>[URL='https://postimages.org/']postimages[/URL]<br>[URL='https://ru.imgbb.com/']IBB[/URL]<br>[URL='https://clck.ru/8pxGW']YouTube[/URL] и.т.д<br><br>Все ссылки [COLOR=rgb(255,0,0)]кликабельны[/color].[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /time',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]В доказательствах нету /time.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нету /myreports',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]В доказательствах нету  /myreports.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не по теме',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Убедительная просьба, ознакомиться с назначение данного раздела, в котором Вы создали тема. Ваша жалоба никоим образом не относится к данному разделу.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ (Гугл)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/BvxnD9yw/image.png[/img][/url][/CENTER]<br>"+
    "[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Нет доступа к доказ (Ютуб)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Доступ к доказательствам закрыт - <br> [url=https://postimages.org/][img]https://i.postimg.cc/131G5gqy/image.png[/img][/url][/CENTER]<br>"+
    "[CENTER]Создайте новую жалобу и загрузите доказательства на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'уже есть на рассмотрении',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Подобная жалоба уже закреплена на рассмотрение. Ожидайте ответа там и не создавайте подобных, иначе форумный аккаунт может быть заблокирован.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Системные наказания',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Наказания полученные системой, администрацией не снимаются.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
    title: 'Монтаж на доказательствах',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]В Ваших доказательствах присутствует монтаж.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
 {
    title: 'Блата нет',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "Проверив систему логирования данного администратора, нарушения/блата с его стороны обнаруженно не было.<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
  {
        title: 'Обжалования наказаний ',
        style: 'width: 97%; background: #ff0000; box-shadow: 0px 0px 3px #fff',
    },
    {
    title: 'На рассмотрении',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование взятo [Color=Orange]на рассмотрение[/Color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'Рук Модер ДС',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование будет передано [COLOR=rgb(43,108,196)]Руководителю модераторов Forum/Discord[/color] - @sakaro [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
prefix: PIN_PREFIX,
    status: true,
    },
    {
    title: 'ГА',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование будет передано [Color=Red]Главному Администратору[/color] - @Ronald Kõlman ☭︎ [Color=Orange]на рассмотрение[/color]. Просьба не создавать подобных тем.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: GA_PREFIX,
    status: true,
    },
    {
    title: 'Специальной Администрации',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование будет передано[COLOR=rgb(204,6,5)]Специальной Администрации[/color] - @Sander_Kligan, @Clarence Crown, @Dmitry Dmitrich, @Myron_Capone @Liana_Mironova, @Gleb Xovirs[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: SA_PREFIX,
    status: true,
    },
    {
    title: 'Команде проекта',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
"[CENTER]Ваше обжалование будет передано [COLOR=rgb(239,211,52)]Команде проекта.[/color][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Ожидайте ответа[/color]',
    prefix: COMMAND_PREFIX,
    status: true,
    },
    {
    title: 'В жалобы на адм',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Внимательно ознакомившись с вашим обжалованием, было решено, что вам нужно обратится в раздел жалоб на администрацию.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    status: false,
    },
    {
    title: 'Одобрено + полностью снято',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше наказание будет полностью снято.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено.[/color]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'В жалобы на тех',
    content:
       '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Вы получили наказание от технического специалиста Вашего сервера. Вам следует обратиться в раздел жалоб на технических специалистов в случае, если Вы не согласны с наказанием.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'ППВ',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Воспользуйтесь одним из способов восстановления вашего игрового аккаунта, затем создайте повторное обжалование и прикрепите все необходимые доказательства, предварительно закройте конфиденциальную информацию.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Одобрено до мин.срока',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование одобрено и ваше наказание будет снижено до минимального срока.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Одобрено.[/color]',
    prefix: ACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Уже снизили',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Вам уже снижали наказание.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'У вас мин.нак',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Вам выдано минимальное наказание.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Отказано',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Данному обжалованию отказано.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Не готовы',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Администрация не готова снизить вам наказание.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: '3-е лицо',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Обжалование от 3-го лица.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Прикрепите окно бана при входе в игру.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Слив, ПИВ, Махинации (отказ)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование не будет рассматриваться и будет закрыто, так как ваше наказание соответствует причинам которые обжалованию не подлежат: различные формы слива, продажа игровой валюты, махинации, целенаправленный багоюз, продажа, передача аккаунта, сокрытие ошибок, багов системы, использование стороннего программного обеспечения, распространение конфиденциальной информации, обман администрации.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Скриншот переписки',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Прикрепите скриншот с перепиской.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'Окно бана+скрин переписки',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Прикрепите окно бана при входе в игру. И скриншот переписки.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'nRP obman',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Свяжитесь с игроком для возврата средств, затем он должен написать обжалование со скриншотами переписки и окном блокировки аккаунта.[/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },
    {
    title: 'nRP obman(вк отписать)',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваша задача отписать мне в вконтакте: <br>[QUOTE][/QUOTE][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]На рассмотрении.[/color]',
    prefix: PIN_PREFIX,
    status: false,
    },
    {
    title: 'Не по форме',
    content:
   '[SIZE=4][COLOR=rgb(255, 0, 255)][FONT=Verdana][CENTER][B]{{ greeting }}, уважаемый[/color] {{ user.mention }}!<br>'+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    "[CENTER]Ваше обжалование составлено не по форме. Ознакомьтесь с [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-заявки-на-обжалование-на%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.3429398/'][COLOR=rgb(255,0,0)]«Правила подачи заявки на обжалование наказания».[/color][/URL][/CENTER]<br>"+
"[url=https://postimages.org/][img]https://i.postimg.cc/L8Kc80JJ/image.png[/img][/url]<br>"+
    '[COLOR=rgb(255, 0, 255)]Отказано.[/color]',
    prefix: UNACCEPT_PREFIX,
    status: false,
    },


 ]
     
     
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
       // Добавление кнопок при загрузке страницы
	addButton('На рассмотрении', 'pin', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(255, 173, 51, 0.5);');
	addButton('Команде проекта', 'teamProject', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(255, 240, 110, 0.5);');
    addButton('Техническому специалисту', 'techspec', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(17, 92, 208, 0.5);');
	addButton('Рассмотрено', 'watched', 'border-radius: 13px; margin-right: 5px; border: 2px solid;  border-color: rgb(110, 192, 113, 0.5)');
	addButton('Решено', 'decided', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(110, 192, 113, 0.5);');
    addButton('Отказано', 'unaccept', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addButton('Закрыто', 'closed', 'border-radius: 13px; margin-right: 5px; border: 2px solid; border-color: rgb(220, 89, 89, 0.5);');
	addAnswers();
 
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $('button#pin').click(() => editThreadData(PINN_PREFIX, true));
        $('button#accepted').click(() => editThreadData(ACCСEPT_PREFIX, false));
        $('button#Ga').click(() => editThreadData(GA_PREFIX, true));
        $('button#Spec').click(() => editThreadData(SPECY_PREFIX, true));
        $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
        $('button#unaccept').click(() => editThreadData(UNACCСEPT_PREFIX, false));
        $('button#Texy').click(() => editThreadData(TEXY_PREFIX, false));
        $('button#Resheno').click(() => editThreadData(RESHENO_PREFIX, false));
        $('button#Zakrito').click(() => editThreadData(CLOSE_PREFIX, false));
        $('button#Realizovano').click(() => editThreadData(REALIZOVANO_PREFIX, false));
        $('button#Vajno').click(() => editThreadData(VAJNO_PREFIX, false));
        $('button#Rassmotreno').click(() => editThreadData(RASSMOTRENO_PREFIX, false));
        $('button#Ojidanie').click(() => editThreadData(OJIDANIE_PREFIX, false));
 
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
 
    function addButton(name, id, style) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; ${style}">${name}</button>`,
        );
    }
    function addAnswers() {
        $('.button--icon--reply').after(`<button type="button" class="button--cta uix_quickReply--button button button--icon button--icon--write rippleButton" id="selectAnswer" style="oswald: 3px; margin-left: 25px; border: 3px solid; border-radius: 20px; background: #850002; padding: 0px 27px 0px 27px; font-family: JetBrains Mono; border-color: #fc0509;">ОТВЕТЫ</button>`,
                                       );
    }
 
    function buttonsMarkup(buttons) {
        return `<div class="select_answer" style="display:flex; flex-direction:row; flex-wrap:wrap">${buttons
            .map(
            (btn, i) =>
            `<button id="answers-${i}" class="button--primary button ` +
            `rippleButton" style="margin:5px; ${btn.style}"><span class="button-text">${btn.title}</span></button>`,
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
            6 < hours && hours <= 11 ?
            'Доброго времени суток' :
            12 < hours && hours <= 17 ?
            'Доброго времени суток' :
            18 < hours && hours <= 23 ?
            'Доброго времени суток' :
            0 < hours && hours <= 5 ?
            'Доброго времени суток' :
            'Доброго времени суток',
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
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
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
})();