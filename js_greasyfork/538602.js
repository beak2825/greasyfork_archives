// ==UserScript==
// @name         К/Ф /WHITE(Общий)
// @namespace    https://forum.blackrussia.online
// @version      1.0.2
// @description  by
// @author       нен5785
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://cdn-icons-png.flaticon.com/128/4080/4080314.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538602/%D0%9A%D0%A4%20WHITE%28%D0%9E%D0%B1%D1%89%D0%B8%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538602/%D0%9A%D0%A4%20WHITE%28%D0%9E%D0%B1%D1%89%D0%B8%D0%B9%29.meta.js
// ==/UserScript==

(async function () {
  `use strict`;
const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const CLOSE_PREFIX = 7; // Prefix that will be set when thread closes.
const VAJNO_PREFIX = 1;
const WATCHED_PREFIX = 9;
const TEX_PREFIX = 13;
const SPECY_PREFIX = 11;
const OJIDANIE_PREFIX = 14;
const REALIZOVANO_PREFIX = 5;
const PREFIKS = 0;
const V_PREFIX = 1;
const KACHESTVO = 15;
const OTKAZRP_PREFIX = 4;
const ODOBRENORP_PREFIX = 8;
const NARASSMOTRENIIRP_PREFIX = 2;
const NARASSMOTRENIIORG_PREFIX = 2;
const data = await getThreadData(),
      greeting = data.greeting, // greeting уже строка!
      user = data.user;
const buttons = [
    {
      title: '| Приветствие |',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Текст. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
      status: true,
    },
      {
      title: '| На рассмотрении |',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Взято на рассмотрение. Не создавайте дубликатов. <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
      prefix: PIN_PREFIX,
      status: false,
    },
    {
      title: '| Одобрено |',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Одобрено.<br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Отказано |',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Отказано.<br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Перенаправление в разделы <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
      },
       {
      title: '| Приветствие |',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Тут могла быть ваша реклама.<br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
      status: true,
    },
      {
      title: '| Ошибка разделом |',
      content:

        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention}[/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Вы ошиблись разделом.<br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/gcSnDLQF/download-4.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: true,
    },
     {
      title: '| ЖБ на Адм |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел Жалоб на администрацию.<br><br>`+
        `[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/forums/Жалобы-на-администрацию.3021/'][Color=lavender]Попасть в раздел[/URL] [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| ЖБ на ЛД |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел Жалоб на лидеров.<br><br>`+
        `[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.3022/'][Color=lavender]Попасть в раздел[/URL] [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| ЖБ на Игроков |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел Жалоб на игроков.<br><br>`+
        `[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/forums/Жалобы-на-игроков.3023/'][Color=lavender]Попасть в раздел[/URL] [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Обж наказаний |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел Обжалование наказания.<br><br>`+
        `[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.3024/'][Color=lavender]Попасть в раздел[/URL] [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| ЖБ на АП |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender] Вы ошиблись разделом. Обратитесь в раздел Жалоб на Агентов Поддержки.<br><br>`+
        `[CENTER][B][COLOR=RED]| [URL='https://forum.blackrussia.online/forums/Раздел-для-агентов-поддержки.3032/'][Color=lavender]Попасть в раздел[/URL] [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/BZM1VV8z/download-5.gif[/img][/url]<br>',
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Передать Другим <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
      },
    {
      title: '| Техническому специалисту |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>` +
        `[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение техническому специалисту.[/ICODE].[/COLOR][/CENTER]<br>`+
        `[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>`+
         `[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: TEX_PREFIX,
      status: false,
    },
    {
      title: '| ГА |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>` +
        `[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному Администратору.[/ICODE].[/COLOR][/CENTER]<br>`+
        `[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>`+
         `[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: GA_PREFIX,
      status: false,
    },
    {
      title: '| Передано Главному куратору форума |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>` +
        `[CENTER][COLOR=#FFFF00][ICODE]Ваша жалоба была передана на рассмотрение Главному куратору форума.[/ICODE].[/COLOR][/CENTER]<br>`+
        `[url=https://postimages.org/][img]https://i.postimg.cc/VsXdc0M3/C0ffE.png[/img][/url]<br>`+
         `[Color=AQUA][CENTER][ICODE]Ожидайте ответа [/ICODE].[/CENTER][/COLOR]`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: PIN_PREFIX,
      status: false,
    },

    {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Правила Role Play процесса <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
    },
      {
      title: '| Игрок будет наказан |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender] Игрок будет наказан.<br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Багаюз |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пункту правил: 2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов).<br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Non-Rp поведение |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пункту правил: 2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.<br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Уход от РП |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Non-Rp вождение |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| NonRP Обман |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
        `[FONT=times new roman][SIZE=5][I][I][COLOR=rgb(255, 255, 255)][SIZE=4][FONT=arial]Ваша жалоба была передана [/FONT][COLOR=rgb(255, 0, 0)][FONT=arial]Заместителю Главного Администратора[/FONT][/COLOR][FONT=arial] на дополнительную проверку. [/FONT][/SIZE][/COLOR][/I][/I][/SIZE][/FONT]<br><br>`+
        `[SIZE=5][FONT=times new roman][SIZE=5][I][I][SIZE=4][COLOR=rgb(243, 121, 52)][FONT=arial][ICODE]На рассмотрении. [/ICODE][/FONT][/COLOR][/SIZE][/I][/SIZE][/FONT][/SIZE][/I][/CENTER] <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: PIN_PREFIX,
      status: false,
    },
     {
      title: '| Аморал. действия |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Слив склада |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Запрос на слив |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[SIZE=5][COLOR=rgb(204, 204, 204)][FONT=tahoma][I][B]Прикрепите скриншоты:[/B][/I][/FONT][/COLOR][/SIZE]
        '[COLOR=rgb(204, 204, 204)][FONT=tahoma][SIZE=5][I][B]1. Вы являетесь Лидером семьи <br><br>`+
        `2. Логи взятия ресурсов <br><br>`+
        `3. Описание взаимодействия со складом /fm[/B][/I][/SIZE][/FONT][/COLOR] <br><br>`+
        `[SIZE=5][COLOR=rgb(204, 204, 204)][FONT=tahoma][B][I]На рассмотрении[/I][/B][/FONT][/COLOR][/SIZE].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: PIN_PREFIX,
      status: false,
    },
     {
      title: '| Нет в логах |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Извините, но по техническим причинам мы не можем рассмотреть Вашу жалобу.<br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. Закрыто. [COLOR=RED]|<br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
     {
      title: '| ДБ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| РК |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| ТК |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства). <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| СК |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства). <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| MG |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| DM |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Масс DM |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 3 - 7 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Использование Читов |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пункту правил:<br>2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Реклама сторонних ресурсов |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | Ban 7 дней / PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Обман адм |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| IC и OCC угрозы |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Уход от наказания |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.34. Запрещен уход от наказания | Ban 15 - 30 дней (суммируется к общему наказанию дополнительно). <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Угрозы OOC |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пункту правил:<br>2.37. Запрещены OOC угрозы, в том числе и завуалированные | Mute 120 минут / Ban 7 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Злоуп. наказаниями |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пункту правил:<br>2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 30 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Оск проекта |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней (Ban выдается по согласованию с главным администратором). <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Продажа промо |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
      {
      title: '| Помеха РП процессу 2.51 |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.51. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса | Jail 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
      {
      title: '| Нонрп акс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Неув обр. к адм |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Баг аним |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.55. Запрещается багоюз связанный с анимацией в любых проявлениях. | Jail 60 / 120 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Помеха ИП |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. | Ban 10 дней / Обнуление аккаунта (при повторном нарушении). <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Помеха блогерам |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Перенос конфликта |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.36. Запрещено переносить конфликты из IC в OOC и наоборот | Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '| Аррест в казино |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->---> Игровые чаты <---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
      },
     {
      title: '| Капс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Оск в ООС |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Оск/Упом родни |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Флуд |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Злоуп. знаками |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Оскорбление |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Слив СМИ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Угрозы о наказании со стороны адм |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пункту правил:<br>3.09. Запрещены любые угрозы о наказании игрока со стороны администрации | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Выдача себя за адм |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Ввод в забл |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Музыка в войс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Оск/Упом род в войс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.15. Запрещено оскорблять игроков или родных в Voice Chat | Mute 120 минут / Ban 7 - 15 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Шум в войс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Реклама промо |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Торговля на тт госс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Религиозное и политическая пропаганда |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>3.18. Запрещено политическое и религиозное пропагандирование | Mute 120 минут / Ban 10 дней. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|(>--->---> ФЕЙК <---<---<---)|',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по данному пункту правил:<br>4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Правила Гос.Структур <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
      },
    {
      title: '| Исп. фрак т/с в личных целях |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 1.08. Запрещено использование фракционного транспорта в личных целях | Jail 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| ДМ/Масс дм от МО |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 2.02. Наносить урон игрокам, которые находятся вне территории воинской части, запрещено | Jail 30 минут / Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Н/П/Р/О |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 4.01. Запрещено редактирование объявлений, не соответствующих ПРО | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Н/П/П/Э |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 4.02. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике | Mute 30 минут. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| ДМ/Масс от УМВД |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 6.01. Запрещено наносить урон игрокам без Role Play причины на территории УМВД | Jail 30 минут / Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Розыск без причины(УМВД) |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 6.02. Запрещено выдавать розыск без Role Play причины | Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| nRP поведение (Умвд) |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 6.03. Запрещено nRP поведение | Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| ДМ/Масс от ГИБДД |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 7.01. Запрещено наносить урон игрокам без Role Play причины на территории ГИБДД | Jail 30 минут / Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| nRP розыск |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 7.02. Запрещено выдавать розыск, штраф без Role Play причины | Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Забирание В/У во время погони(ГИБДД) |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 7.04. Запрещено отбирать водительские права во время погони за нарушителем | Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| ДМ/Масс от ФСБ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: 8.01. Запрещено наносить урон игрокам без Role Play причины на территории ФСБ | Jail 30 минут / Warn. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '|(--->--->--->--->--->--->--->--->--->--->--->--->---> Правила ОПГ <---<---<---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
      },
    {
      title: '| Нарушение правил В/Ч |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: За нарушение правил нападения на Войсковую Часть выдаётся предупреждение | Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ). <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нападение на В/Ч через стену |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан по пунтку правил: Нападение на военную часть разрешено только через блокпост КПП с последовательностью взлома | /Warn NonRP В/Ч. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нарушение правил Похищение/Ограбления |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Игрок будет наказан за Нонрп Ограбление/Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D0%B3%D1%80%D0%B0%D0%B1%D0%BB%D0%B5%D0%BD%D0%B8%D0%B9-%D0%B8-%D0%BF%D0%BE%D1%85%D0%B8%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.29/']Click[/URL]. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Отсутствие пункта жалоб <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
      },
    {
      title: '| Нарушений не найдено |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Нарушений со стороны данного игрока не было найдено. <br><br>`+
        `[CENTER][B][COLOR=RED]| [Color=lavender]Благодарю за обращение. [COLOR=RED]|<br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Ответ дан в прошлой ЖБ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ответ был дан в прошлой жалобе. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Недостаточно доказательств |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Недостаточно доказательств на нарушение от данного игрока.<br>Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Дублирование темы |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Форма темы |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться [URL='https://forum.blackrussia.online/threads/Правила-подачи-жалоб-на-игроков.3429394/']с правилами подачи жалоб на игроков[/URL]. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нету /time |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]На ваших доказательствах отсутствует /time. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Укажите тайм-коды |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Укажите Тайм-коды в новой жалобе. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Более 72 часов |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]С момента нарушения прошло более 72 часов. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Доква через запрет соц сети |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]3.6. Прикрепление доказательств обязательно. Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нету условий сделки |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]В данных доказательствах отсутствуют условия сделки. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нужен фрапс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]В таких случаях нужен фрапс. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нужен фарпс + промотка чата |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]В таких случаях нужен фрапс + промотка чата. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Нужна промотка чата |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]В таких случаях нужна промотка чата. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Неполный фрапс |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Фрапс обрывается. Загрузите полный фрапс на ютуб. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Не работают доква/обрезаны |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваши доказательства не рабочие/обрезаные, перезалейте их правильно и без обрезаний. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Док-ва отредактированы |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваши доказательства отредактированы. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| От 3-го лица |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Жалобы от 3-их лиц не принимаются. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Ответный ДМ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]В случае ответного ДМ нужен видео-запись. Пересоздайте тему и прикрепите видео-запись. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: '| Фотохостинги |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Доказательства должны быть загружены на Yapx/Imgur/YouTube. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>' +
        `[Color=#FF0000][FONT=times new roman][CENTER][I][ICODE]✿❯────「Отказано, ❖ Закрыто」────❮✿[/ICODE][/I][/CENTER][/color][/FONT]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },

    {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> РП СИТУАЦИИ <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
    },
    {
      title: '| РП ситуация Одобрена |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay ситуация была проверена и получает статус - Одобрено. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: ODOBRENORP_PREFIX,
        status: false,
    },
    {
      title: '| РП ситуация на доработке |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Вам дается 24 часа на дополнение Вашей РП ситуации. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: PIN_PREFIX,
        status: false,
    },
    {
      title: '| РП ситуация отказ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша РП ситуация получает статус-Отказано.'Причиной отказа могло послужить какое-либо нарушение из Правила RP ситуаций. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },

    {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> Неофицал.орг. <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
    },
    {
      title: '| Неофицальная Орг Одобрено |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша неофицальная организация получает статус - Одобрено. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: ODOBRENORP_PREFIX,
        status: false,
    },
    {
      title: '| Неофицальная Орг на доработке |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Вам дается 24 часа на дополнение Вашей неофицальной организации. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: PIN_PREFIX,
        status: false,
    },
    {
      title: '| Неофицальная Орг отказ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша РП ситуация получает статус-Отказано.'Причиной отказа могло послужить какое-либо нарушение из Правила создания неофицальной RolePlay организации. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
     {
      title: '|(--->--->--->--->--->--->--->--->--->--->---> РП биография <---<---<---<---<---<---<---<---<---<---<---<---<---)|',
      content:
        '',
    },
    {
      title: '| РП биография Одобрено |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - Одобрено. <br><br>`+
         `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: ODOBRENORP_PREFIX,
        status: false,
    },
    {
      title: '| На рассмотрении |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была взята на - [COLOR=#FFA500]Рассмотрение.[/COLOR] <br><br>`+
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: PIN_PREFIX,
        status: false,
    },
    {
      title: '| Орф и пунктуац ошибки |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Орфографические и пунктуационные ошибки.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Био от 3-го лица |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография от 3-го лица.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Дата рождения некорректна |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Дата рождения некорректна.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Информация не соответствует времени |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
        '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Информация в пунктах не соответствует временным рамкам.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Возраст не совпал |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Возраст не совпадает с датой рождения.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Слишком молод |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректен возраст (слишком молод).[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Биография скопирована |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография скопирована.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Недостаточно РП инф. |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Недостаточно РП информации.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Не по форме bio |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Биография не по форме.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Некоррект национальность |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Некорректная национальность.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },
    {
      title: '| Ник по англ |',
      content:
        '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
        `[B][CENTER][COLOR=#FFFF00]${greeting}, уважаемый(ая) ${user.mention} [/COLOR][/CENTER][/B]<br><br>`+
        `[B][CENTER][COLOR=lavender]Ваша RolePlay биография была проверена и получает статус - [COLOR=#FF0000]Отказано.[/COLOR]<br>[COLOR=#FFFF00]Убедительная просьба ознакомиться[/COLOR] [URL='https://forum.blackrussia.online/threads/WHITE-Правила-создания-roleplay-биографии.11053394/']с правилами написания RolePlay биографий.[/URL]. <br><br>`+
         '[CENTER][COLOR=#FFFF00]Причина отказа: [COLOR=#FFFFFF]Nick_Name должны быть написаны на русском языке.[/B][/COLOR]' +
        `[B][CENTER][COLOR=lavender]Приятной игры на  [COLOR=rgb(209, 213, 216)]WHITE[/COLOR].<br><br>`+
         '[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/dVnXV8xS/9.png[/img][/url]<br>',
        prefix: OTKAZRP_PREFIX,
        status: false,
    },











];

$(document).ready(() => {
    // Загрузка скрипта для обработки шаблонов
    $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    // Добавление кнопок при загрузке страницы
           addButton('!!!Ответы!!!', 'selectAnswer');

    // Поиск информации о теме
    const threadData = getThreadData();

    $('button#pin').click(() => editThreadData(PIN_PREFIX, true));
    $('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
    $('button#teamProject').click(() => editThreadData(COMMAND_PREFIX, true));
    $('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));
    $('button#Zakrito').click(() => editThreadData(UNACCEPT_PREFIX, false));

    $(`button#selectAnswer`).click(() => {
        XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ:');
        buttons.forEach((btn, id) => {
            if(id >= 1) {
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
  greeting:
  4 < hours && hours <= 11
    ? 'Доброе утро'
    : 11 < hours && hours <= 15
    ? 'Добрый день'
    : 15 < hours && hours <= 21
    ? 'Добрый вечер'
    : 'Доброй ночи',
};
}

$(document).ready(() => {
        // Загрузка скрипта для работы шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);


        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 2) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $(`.button--icon--reply`).before(
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
            .join(``)}</div>`;
    }

    function pasteContent(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons[id].prefix, buttons[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    async function getThreadData() {
      const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
      const authorName = $('a.username').html();
      const hours = new Date().getHours();

      const greeting = 4 < hours && hours <= 11
          ? 'Доброе утро'
          : 11 < hours && hours <= 15
          ? 'Добрый день'
          : 15 < hours && hours <= 21
          ? 'Добрый вечер'
          : 'Доброй ночи';

      return {
          user: {
              id: authorID,
              name: authorName,
              mention: `[USER=${authorID}]${authorName}[/USER]`,
          },
          greeting: greeting // теперь это просто строка
      };
  }

    function editThreadData(prefix, pin = false) {
        // Получаем заголовок темы, так как он необходим при запросе
        const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        }
        if (pin == true) {
            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
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