// ==UserScript==
// @name         Curator 40 by L.Cortez
// @namespace    http://tampermonkey.net/
// @version      1.10
// @description  Скрипт для Руководства сервера
// @author       Андрей Романов
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://klike.net/uploads/posts/2022-09/1662473818_a.jpg
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/529963/Curator%2040%20by%20LCortez.user.js
// @updateURL https://update.greasyfork.org/scripts/529963/Curator%2040%20by%20LCortez.meta.js
// ==/UserScript==
 
(function () {
  'use strict';
const UNACCСEPT_PREFIX = 3; // Prefix that will be set when thread closes
const ACCСEPT_PREFIX = 2; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 11; // Prefix that will be set when solving the problem
const PINN_PREFIX = 8; // Prefix that will be set when thread pins
const LD_PREFIX = 6; // Prefix that will be set when thread send to ld
const WATCHED_PREFIX = 16;
const CLOSE_PREFIX = 9;
const ODOBRENOBIO_PREFIX = 2;
const NARASSMOTRENIIBIO_PREFIX = 8;
const OTKAZBIO_PREFIX = 3;
const buttons = [
    {
    	  title: '|(-(-(-(-(->╴Ответы ╴<-)-)-)-)-)-|'
    },
    {
      title: 'На рассмотрении',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][FONT=georgia][I][B]Приветствую.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][FONT=georgia][I][B]Ваша жалоба взята на рассмотрение, убедительная просьба не создавать идентичных жалоб и ожидать ответа в данной теме.[/FONT][/I][/B][/CENTER]<br><br> " +
        "[CENTER][B][COLOR=rgb(255, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「На рассмотрении」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: PINN_PREFIX,
      status: true,
    },
    {
      title: '| Передано Лидеру |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба была передана на рассмотрение [COLOR=rgb(216, 0, 0)]Лидеру.[/color][/CENTER]<br><br> " +
        '[Color=Flame][CENTER]Ожидайте ответа.[/I][/CENTER][/color][/FONT]',
      prefix: LD_PREFIX,
      status: true,          
    },
    {
      title: '| Не по форме |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша жалоба составлена [COLOR=rgb(255, 0, 0)]не по форме[/color].[/CENTER]<br><br>" +
            "[CENTER][SPOILER=Форма подачи жалобы][COLOR=rgb(255, 0, 0)]1.[/color] Ваш Nick_Name:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]2.[/color] Nick_Name игрока:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]3.[/color] Суть жалобы:[/CENTER]<br><br>" +
            "[CENTER][COLOR=rgb(255, 0, 0)]4.[/color] Доказательство:[/SPOILER][/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,      
    },
    {
      title: '| Прошло 3 дня |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]С момента возможного нарушения со стороны игрока прошло более 72 часов, жалоба рассмотрению не подлежит.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
       title: '| Неуважение в жалобе |',
       content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В вашей жалобе присутствует неуважение к игроку, жалоба рассмотрена не будет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Фотохостинги |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Видеозапись |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]В данном случае, для выдачи наказания игроку, требуется видеозапись[/CENTER]<br><br>" +                       
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Видео обрывается |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваше видеодоказательство обрывается. Видеохостинг YouTube загружает видео без ограничений, рекомендуем использовать его.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {     
      title: '| Нет доказательств |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Нет каких-либо доказательств на совершенное нарушение от данного игрока.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Недостаточно доказательств |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательств, предоставленных Вами, недостаточно для выдачи наказания данному игроку.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Не работают док-ва |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Доказательства, предоставленные Вами, нерабочие.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: '| Плохое качество |',
      content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Качество доказательств, предоставленными Вами низкое, в связи с этим, мы не можем принять их.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Нет /time |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]На Ваших доказательствах отсутствует /time.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| От 3-го лица |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Жалобы, написанные от 3-го лица рассмотрению не подлежат.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Нет нарушений |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Нарушений со стороны игрока нет.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Ошиблись разделом |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. [/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: '| Таймкоды |',
     content:
"[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша видеозапись длится более 3-х минут. У Вас есть 24 часа, чтобы прикрепить таймкоды нарушений, в ином случае жалоба будет закрыта.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman]Отказано. ❖  Закрыто.[/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
    	  title: '|(-(-(-(-(->╴Одобренные жалобы ╴<-)-)-)-)-)-|'
    },
     {
      title: 'TK',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен TK (Team Kill) — убийство члена своей или союзной семьи, без наличия какой-либо IC причины[COLOR=rgb(255, 0, 0)]  | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'PG',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.02.[/color] Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [COLOR=rgb(255, 0, 0)] | Выговор/Устное замечание [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Аморал. действия',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.03.[/color] Запрещена любая форма аморальных действий сексуального характера в сторону игроков [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Взял больше чем разрешили',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.04.[/color] Запрещено брать больше количество ресурсов семьи, чем разрешили на самом деле [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'NRP обман',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.05.[/color] Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [COLOR=rgb(255, 0, 0)] | Увольнение + ЧС навсегда + Жалобу на Форум [/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Сокрытие нарушителей',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.06.[/color] Запрещено скрывать от Заместителя нарушителей или Злоумышленников в семье [COLOR=rgb(255, 0, 0)] | Увольнение + ЧС навсегда[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'CapsLock',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.07.[/color] Запрещено использование верхнего регистра (CapsLock) при написании любого текста в семейном чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Упоминание родных',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.08.[/color] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC)[COLOR=rgb(255, 0, 0)] | Mute 120 минут + Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Политика, провокация',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.09.[/color] Запрещено политическое и религиозное пропагандирование вне чате семьи [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Нарушение АП',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.10.[/color] Нарушение семейного Авто-Парка [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Флуд',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.11.[/color] Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока в чате семьи [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оскорбление в игровой чат',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.12.[/color] Запрещено оскорблять участников семьи [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Оскорбление в фам чат',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.13.[/color] Запрещено оскорблять участников семьи в семейном чате [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Не чинить авто',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.14.[/color] Не ремонтировать после себя семейные автомобили [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
     {
      title: 'Трансфер',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.15.[/color] Запрещен трансфер имущества между аккаунтами [COLOR=rgb(255, 0, 0)] | Увольнение + ЧС навсегда[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Политика/религия в фам чате',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.16.[/color] Запрещено политическое и религиозное пропагандирование в чате семьи [COLOR=rgb(255, 0, 0)] | Mute 30 минут + Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Продажа/покупка репутации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.17.[/color] Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров заместителем семьи. [COLOR=rgb(255, 0, 0)] | Увольнение + ЧС семьи[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Злоуп. символами',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.18.[/color] Запрещено злоупотребление знаков препинания и прочих символов [COLOR=rgb(255, 0, 0)] | Mute 30 минут[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Порча имущества',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.19.[/color] Порча имущества семьи [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Игнор вышестоящих',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.20.[/color] Запрещается игнорировать сообщения или просьбы от вышестоящих вас по рангу [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Устраивание конфликта',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.21.[/color] Запрещено устраивать конфликты с другими семьями [COLOR=rgb(255, 0, 0)] | Выговор[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Выпрашивание повышеня',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.22.[/color] Запрещено выпрашивать повышение на ранг  [COLOR=rgb(255, 0, 0)] | Выговор/Устное замечание[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
      title: 'Нелегал способ снятия выга',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Игрок будет наказан по пункту правил[/CENTER]<br><br>" +
        "[CENTER][QUOTE][COLOR=rgb(255, 0, 0)]2.23.[/color] Запрещен нелегальный способ снятия выговора [COLOR=rgb(255, 0, 0)] | ЧС на 7 дней[/COLOR][/QUOTE][/CENTER]<br><br>" +
        "[CENTER][B][COLOR=rgb(0, 255, 0)][SIZE=4][FONT=times new roman]✿❯────「Одобрено ❖ Закрыто」────❮✿ [/FONT][/SIZE][/COLOR][/B][/CENTER]",
      prefix: RESHENO_PREFIX,
      status: false,
    },
    {
    	  title: '|(-(-(-(-(->╴RolePlay Биографии ╴<-)-)-)-)-)-|'
    },
      {
      title: 'Биография одобрена',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Lime]Одобрено.[/I][/CENTER][/color][/FONT]",
      prefix: ODOBRENOBIO_PREFIX,
      status: false,
    },
    {
      title: 'На доработке',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER][B][I][FONT=georgia]Вам даётся 24 часа на дополнение Вашей RolePlay биографии, иначе она будет отказана.[/CENTER]",
      prefix: NARASSMOTRENIIBIO_PREFIX,
      status: true,
    },
    {
      title: 'Отказано',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причиной отказа могло послужить какое-либо нарушение из правил написания RP биографии.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Скопированная биография',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Биография скопирована у другого человека.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Заголовок не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br>Причина: Заголовок вашей RolePlay Биографии составлен не по форме. Внимательно изучите правила составления РП биографий.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Не по форме',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Ваша RolePlay Биография составлена не по форме. Внимательно изучите правила составления РП биографий.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Прошло 24ч',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "По истечении 24-х часов, в РП биографии не произошло изменений.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Ник написан на английском',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Никнейм в заголовке/теме написан на английском языке. Внимательно изучите правила составления РП биографий.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Ники в теме не совпадают',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Никнеймы в заголовке и теме не совпадают, что является нелогичным.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Множество ошибок',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: В вашей РП биографии присутствует множество грамматических/пунктуационных ошибок.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: '1 лицо',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Ваша РП биография написана от 1-го лица. Внимательно изучите правила составления РП биографий.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Юность с 15 лет',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Юность у персонажа должна начинаться с 15-ти лет.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
     {
      title: 'Мало о взрослой жизни',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о Вашей взрослой жизни расписана недостаточно.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Нет места рождения',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Отсутствие места рождения.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Нет даты рождения',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Отсутствие даты рождения.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Возраст - тема',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Возраст Вашего персонажа не соответствует истории, что является нелогичным.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Возраст - дата',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Возраст Вашего персонажа не соответствует дате рождения, что является нелогичным.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
        {
      title: 'Мало о семье',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о Вашей семье не расписана полностью.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
        {
      title: 'Мало о детстве',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о Вашем детстве расписана недостаточно.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
            {
      title: 'Мало о юности',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о Вашей юности расписана недостаточно.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
            {
      title: 'Мало о взрослой жизни',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о Вашей взрослой жизни расписана недостаточно.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
                {
      title: 'Мало о настоящем времени',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Информация о настоящем времени расписано недостаточно.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Не заполнены некоторые пункты',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина:  Не заполнены некоторые пункты.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'NonRP nick',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: У вас NonRP NickName.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Биография уже есть',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: У Вас уже есть существующая РП биография.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
 {
      title: 'Мало информации',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Слишком мало информации о вашем персонаже.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
     {
      title: 'Малолетка',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]Ваша РП биография получает статус: [Color=Red]Отказано.[/color]<br><br>" +
        "Причина: Вашему персонажу менее 18-ти лет.[/CENTER][/FONT]",
      prefix: OTKAZBIO_PREFIX,
      status: false,
    },
    {
      title: 'Ошиблись разделом',
      content:
        "[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/fTh4W2B3/RLwzo.png[/img][/url][/CENTER]<br>" +
        '[Color=rgb(222, 143, 255)][FONT=Georgia][CENTER][I]{{ greeting }}, уважаемый {{ user.mention }}.[/color][/CENTER]<br>' +
        "[CENTER]К сожалению, Вы ошиблись разделом. Данный раздел предназначен для написания RolePlay биографий.[/CENTER]<br><br>" +
        '[CENTER][B][COLOR=rgb(255, 0, 0)]✿❯────「[SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman] Закрыто. [/FONT][/COLOR][/SIZE]」────❮✿ [/COLOR][/B] [/CENTER]',
      prefix: CLOSE_PREFIX,
      status: false,
    },

  ];
 
 $(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');
 
    // Добавление кнопок при загрузке страницы
    addButton('💖 Script by. Support 💖', 'selectAnswer');
 
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
      `<button type="button" class="button rippleButton" id="${id}" style="border-radius: 13px; margin-right: 5px; border: 2px solid #BF40BF;">${name}</button>`,
    );
  }
 
	function buttonsMarkup(buttons) {
	return `<div class="select_answer">${buttons
	.map(
	(btn, i) =>
	`<button id="answers-${i}" class="button--primary button ` +
	`rippleButton" style="margin:4px; ${btn.dpstyle}"><span class="button-text">${btn.title}</span></button>`,
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
                              sticky: 1,
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