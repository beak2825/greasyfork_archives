// ==UserScript==
// @name         BLACK RUSSIA PINK  | Скрипт лидеров сервера PINK // by A.Wolff
// @namespace    https://forum.blackrussia.online
// @version      1.3. 0.
// @description  Специально для BlackRussia || PINK
// @author        Anthony_Wolff
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @grant        none
// @license      MIT
// @collaborator QuenkM
// @icon  https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/9d/01/ec/9d01ec3f-e453-5f38-bbf1-a79fda790c2a/AppIcon-0-0-1x_U007emarketing-0-7-0-sRGB-85-220.png/246x0w.webp
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/517690/BLACK%20RUSSIA%20PINK%20%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20PINK%20%20by%20AWolff.user.js
// @updateURL https://update.greasyfork.org/scripts/517690/BLACK%20RUSSIA%20PINK%20%20%7C%20%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20PINK%20%20by%20AWolff.meta.js
// ==/UserScript==



(function () {
  'use strict';
'@version 7' ;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const TEX_PREFIX = 13;
const GA_PREFIX = 12;
const V_PREFIX = 1;
const buttons = [

      {
        title: '__________________________АРМИЯ______________________________'
    },
  {
      title: '|',
      content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/FONT][/I][/COLOR][/SIZE]',
      },

      {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
      title: 'ВОССТ ОДОБРЕНО',
      content:
     '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
      title: 'ВОССТ ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ВОЕН БИЛЕТ ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на получение военного билета была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ВОЕН БИЛЕТ ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на получение военного билета была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ЖБ на сотрудника одобрено',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
      { title: 'ЖБ на сотрудника ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ЖБ на СС одобрено',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на СС ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОДОБРЕН',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОТКАЗАН',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ПОСТАВКА МАТЕРИАЛОВ ОДОБРЕНО',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на поставление материалов в вашу организацию была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'ПОСТАВКА МАТЕРИАЛОВ ОТКАЗАН',
         content:
        '[CENTER][url=https://postimg.cc/4KcxB8XB][img]https://i.postimg.cc/Pq3vfc9s/i.webp[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на поставление материалов в вашу организацию была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
        title: '________________________________ПРАВИТЕЛЬСТВО__________________________________'
    },


    {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
      title: 'ВОССТ ОДОБРЕНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)[FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  { title: 'ВОССТ ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ЖБ на сотрудника одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на сотрудника ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ЖБ на СС одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на СС ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'Заяв. на Лицензера одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на должность лицензера была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'Заяв. на Лицензера ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на должность лицензера была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: 'Заяв. на Адвоката одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на должность адвоката была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'Заяв. на адвоката ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на должность адвоката была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок. {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zXxkC3HT/35c2-CAhjlb4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
      title: '|',
      content:
        '[SIZE=4][COLOR=rgb(0, 255, 255)][I][FONT=times new roman]{{ greeting }}, уважаемый {{ user.mention }}.[/FONT][/I][/COLOR][/SIZE]',
      },
   {
        title: '________________________________ГИБДД__________________________________'
    },
     {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
{
      title: 'ВОССТ ОДОБРЕНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)[FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  { title: 'ВОССТ ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ЖБ на сотрудника одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на сотрудника ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ЖБ на СС одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на СС ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОДОБРЕН',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОТКАЗАН',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок. {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/3w1MJkJt/C59838-D9-CEF6-4224-9-EBA-4-E2-E6-D4-B1054.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
        title: '________________________________УМВД__________________________________'
    },
    {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
{
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
{
      title: 'ВОССТ ОДОБРЕНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)[FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  { title: 'ВОССТ ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'ЖБ на сотрудника одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },

      { title: 'ЖБ на сотрудника ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ЖБ на СС одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на СС ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОДОБРЕН',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОТКАЗАН',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/d3H5fzJ9/image-4.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
          },
   {
        title: '________________________________ФСБ__________________________________'
    },
 {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
      '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ВОССТ ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
      '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ВОССТ ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
     '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстанавление была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'Жб на сотрудника ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
       '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
         "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'Жб на сотрудника ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
     '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
         "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ЖБ на СС одобрено',
         content:
      '[CENTER]   [url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
      ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
     "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'Жб на СС ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
        ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
         "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОДОБРЕН',
         content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'ПЕРЕВОД ОТКАЗАН',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/x1h2wNHk/photo-2023-07-22-08-40-59.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },

       {
        title: '__________________________ФСИН______________________________'
    },
   {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
    '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
      '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ВОССТ ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
      '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ВОССТ ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
     '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстанавление была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'Жб на сотрудника ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
       '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
         "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'Жб на сотрудника ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
     '[url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
         "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ЖБ на СС одобрено',
         content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
      ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
     "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'Жб на СС ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
        ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
         "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПЕРЕВОД ОДОБРЕН',
         content:
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'ПЕРЕВОД ОТКАЗАН',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
       '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на перевод в нашу организацию была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
      '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок[/I][/SIZE][/FONT][/COLOR]<br><br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/k46n5ynQ/image.png[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/qvCYCbhR/Picsart-23-07-25-17-05-24-636.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
        title: '__________________________БОЛЬНИЦА______________________________'
    },
    {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
      ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
   {
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
     ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
      title: 'ВОССТ ОДОБРЕНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
            '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)[FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  { title: 'ВОССТ ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
   ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
  {
         title: 'ЖБ на сотрудника одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
    ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на сотрудника ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
     ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ЖБ на СС одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
   ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на СС ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
     ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
              '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок. {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/GtyF2ngs/image-1.png[/img][/url]<br>' +
             '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
         ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/vmgb9NDd/N5SLA.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
        title: '________________________________СМИ__________________________________'
    },
    {
         title: 'ПОВЫХА ОДОБРЕНА',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
{
         title: 'ПОВЫХА ОТКАЗАНО',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на повышение была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
{
      title: 'ВОССТ ОДОБРЕНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)[FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
  { title: 'ВОССТ ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на восстановление  была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
    {
         title: 'ЖБ на сотрудника одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },

      { title: 'ЖБ на сотрудника ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
 {
         title: 'ЖБ на СС одобрено',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
           "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Сотрудник получит соответствующее наказание.[/SIZE][/FONT][/COLOR]<br><br>" +
    '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
    { title: 'ЖБ на СС ОТКАЗАНО',
      content:
     '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша жалоба на нашего сотрудника Старшего Состава рассмотрена и отказано․[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
    },
      {
         title: ' снятие выговора одобрено.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый игрок.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(0, 255, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и одобрена.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/FzZjdvTG/1000008996.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(51, 204, 51)][FONT=times new roman][SIZE=4][I]Одобрено.[/I][/SIZE][/FONT][/COLOR]',
    },
       {
         title: ' снятие выговора отказано.',
         content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/7YBH6J70/Dhn8b0-OVS-A.jpg[/img][/url]<br>' +
       ' [I][COLOR=rgb(0, 255, 255)][FONT=times new roman][SIZE=4][I]Здравствуйте уважаемый сотрудник. [/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4]Ваша заявка на снятие выговора была рассмотрена и отказано.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
          '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/nhVDWN3f/1000008997.gif[/img][/url]<br>'+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/mk10R03b/index-1.png[/img][/url]<br>'+
        "[COLOR=rgb(209, 213, 216)][FONT=times new roman][SIZE=4]Приятной игры на BLACK RUSSIA [/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4]PINK[/SIZE][/FONT][/COLOR][COLOR=rgb(255, 20, 147)][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/COLOR]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=times new roman][SIZE=4][I]Отказано.[/I][/SIZE][/FONT][/COLOR]',
          },





    ];

  $(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
    addButton('Шаблон ответов.🧑‍💻', 'selectAnswer');

	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, false));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, false));
	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

	$(`button#selectAnswer`).click(() => {
		XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
		buttons.forEach((btn, id) => {
			if(id > 1) {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
			} else {
				$(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
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

	if(send == false){
		editThreadData(buttons[id].prefix, buttons[id].status);
		$('.button--icon.button--icon--reply.rippleButton').trigger('click');
	}
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
	if(pin == false){
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
  function getThreadData() {
const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
const authorName = $('a.username').html();
const hours = new Date().getHours();
  }


function getFormData(data) {
	const formData = new FormData();
	Object.entries(data).forEach(i => formData.append(i[0], i[1]));
	return formData;
  }
})();
