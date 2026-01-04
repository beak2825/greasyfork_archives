// ==UserScript==
// @name         Для руководства сервера BlackRussia
// @namespace    http://tampermonkey.net/
// @version      2.0R
// @description  Скрипт для упрощения работы с жалобами на администраторов BlackRussia. Связь с разработчиком https://vk.com/kottvse https://vk.com/jaroslavgrasso
// @author       Ярослав Колмогорцев || Jaroslav_Grasso
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license 	 MIT
// @icon https://forum.blackrussia.online/data/avatars/o/0/3.jpg?1650124351
// @downloadURL https://update.greasyfork.org/scripts/536264/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20BlackRussia.user.js
// @updateURL https://update.greasyfork.org/scripts/536264/%D0%94%D0%BB%D1%8F%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%B0%20BlackRussia.meta.js
// ==/UserScript==

//-----------------------------------------------------------------------------------------------------------------
//-------------------------------Жалобы на администрацию-----------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

(function() {
    'use strict';
    const GGUNACCEPT_PREFIX = 4; //Префикс Отказано
    const GGACCEPT_PREFIX = 8; //Префикс Одобрено
    const GGRASSMOTENO_PREFIX = 9; //Префикс Рассмотрено
    const GGVAJNO_PREFIX = 1; //Префикс Важно
    const GGPIN_PREFIX = 2; //Префикс На рассмотрении
    const GGGA_PREFIX = 12; //Префикс Главному администратору
    const GGCOMMAND_PREFIX = 10;
    const GGDECIDED_PREFIX = 6;
    const GGWAIT_PREFIX = 14; //Префикс Ожидание
    const GGWATCHED_PREFIX = 9;
    const GGCLOSE_PREFIX = 7; //Префикс Закрыто
    const GGSPECY_PREFIX = 11;
    const GGTEX_PREFIX = 13; //Префикс Тех. Специалисту
const buttons5 = [
{
    title: 'Свой ответ (Закрыто)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       '[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]',
},
{
    title: 'Свой ответ (Одобрено)',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
       "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
       "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
       "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
       "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
{
  title: 'Свой ответ (Ожидание)',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B] <br><br>" +
     "[URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL] <br> <br>" +
     "[B][COLOR=WHITE][FONT=georgia] Сообщение [/FONT][/COLOR][/B] <br><br>" +
     "[COLOR=WHITE][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/COLOR][/CENTER] <br><br>" +
     "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
},
{
    title: 'На рассмотрение',
    content:
      "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба взята на рассмотрение. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGPIN_PREFIX,
 status: true,
},
{
      title: 'На рассмотрении(обжалование)',
      content:
		  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обжалование взято на рассмотрение. <br> Не нужно создавать копии этой темы, ожидайте ответа в этой теме.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: GGPIN_PREFIX,
      status: true,
    },
{
  title: 'Запрошу доки',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Запрошу доказательства у администратора. <br> Не нужно создавать копии этой жалобы, ожидайте ответа в этой теме.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGPIN_PREFIX,
status: true,
},
{
  title: 'Выдано верно',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Выдано не верно',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В следствие беседы с администратором, было выяснено, что наказание было выдано по ошибке. <br> Ваше наказание будет снято.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
      title: 'Ссылку на ЖБ',
      content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=WHITE][FONT=georgia]Прикрепите ссылку на данную жалобу в течении 24 часов.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: GGPIN_PREFIX,
      status: true,
    },
    {
      title: 'Ссылку на ВК',
      content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=WHITE][FONT=georgia]Прикрепите ссылку на вашу страницу в ВК.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: GGPIN_PREFIX,
      status: 123,
    },
{
   title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передать жалобу ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
{
  title: 'ЗГА ГОСС/ОПГ',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора по направлению ГОС и ОПГ. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGPIN_PREFIX,
  status: true,
  },
{
title: 'ЗГА',
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Заместителю Главного Администратора. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: GGPIN_PREFIX,
status: true,
},
{
title: 'ГА',
content:
"[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Главному Администратору. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
"[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
"[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
prefix: GGGA_PREFIX,
status: true,
},
{
    title: 'Спецу',
    content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia] Ваша жалоба была передана на рассмотрение Специальной Администрации. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGSPECY_PREFIX,
    status: true,
},
{
  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Перекинуть ЖБ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
{
  title: 'В ЖБ на ЛД',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на лидеров - [URL='https://forum.blackrussia.online/forums/Жалобы-на-лидеров.2830/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на АДМ',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на администрацию - [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.2829/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В обжалования',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел обжалований наказаний - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2832/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В тех. раздел',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в технический раздел - [URL='https://forum.blackrussia.online/index.php?forums/Технический-раздел.22/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на теха',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на технических специалистов[URL='https://forum.blackrussia.online/index.php?forums/Жалобы-на-технических-специалистов.490/']кликабельно[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ Фракций',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на сотрудников данной организации. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: 'В ЖБ на АП',
  content:
  "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый(-ая)[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=WHITE][FONT=georgia] Вы ошиблись разделом.<br>Обратитесь в раздел жалоб на Агентов поддержки - [URL='https://forum.blackrussia.online/forums/Раздел-для-хелперов-сервера.2840/'] кликабельно[/URL]. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
  "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
  "[CENTER][B][COLOR=#FF0000][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGUNACCEPT_PREFIX,
  status: false,
},
{
  title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Прочее╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
},
{
  title: 'Не по форме',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба составлена не по форме.<br>Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*Тык*[/URL] [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Нет /time',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В предоставленных доказательствах отсутствует /time. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Нет /myreports',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В предоставленных доказательствах отсутствует /myreports. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'От 3 лица',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Жалобы написанные от 3-его лица не подлежат рассмотрению.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Нужен фрапс',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Фрапс обрывается',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваш фрапс обрывается, загрузите полный фрапс на ютуб.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Дока-во отредактированы',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Представленные доказательства были отредактированны, пожалуйста прикрепите оригинал.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Прошло более 48 часов',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'нет строки выдачи наказания',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]На ваших доказательствах отсутствует строка с выдачей наказания. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'нет окна бана',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]На ваших доказательствах отсутствует окно блокировки аккаунта.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'нет докв',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В вашей жалобе отсутствуют доказательства. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'не работают доки',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Предоставленные доказательства не рабочие. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'дубликат',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Дублирование темы.<br>Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'будет проинструктирован',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Благодарим за ваше обращение! Администратор будет проинструктирован. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'проведу беседу',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба была одобрена и будет проведена беседа с администратором. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'проведу строгую беседу',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба была одобрена и будет проведена строгая беседа с администратором. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'Спасибо за инфу',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Спасибо за информацию, необходимая работа будет проведена. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'Адм будет наказан',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваша жалоба была одобрена и администратор получит наказание. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'нет нарушений',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имеется! [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'адм снят/псж',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Администратор был снят/ушел с поста администратора. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'не написал ник',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Игровой ник автора жалобы, ник администратора, на которого подается жалоба, дата выдачи наказания должны быть указаны в соответствии с правилами подачи жалоб, даже если эта информация присутствует на доказательствах или в тексте жалобы. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Бан по IP',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Попробуйте изменить подключение на вашем устройстве. Пример: зайти в игру с подключением к Wi-Fi, мобильным интернетом или с сервисом VPN [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Доква не в имгур япикс',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur). [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Качество докв',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Пересоздайте жалобу и прикрепите туда доказательства в нормальном качестве. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Беседа с кф',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]С куратором форума будет проведена беседа, ваша жалоба будет перерассмотрена. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'Оскорбительная жалоба',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]В вашей жалобе имеется слова оскорбительного характера, данная тема рассмотрению не пожлежит. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGCLOSE_PREFIX,
status: false,
},
{
  title: 'Смена наказания',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше наказание будет заменено на другое.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FF00][FONT=georgia][ICODE]Одобрено[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGACCEPT_PREFIX,
status: false,
},
{
  title: 'Нету ссылки на жб',
  content:
    "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=WHITE][FONT=georgia]Нужно предоставить ссылку на вашу жалобу. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
    "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
    "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
  prefix: GGPIN_PREFIX,
status: 123,
},
{
     title: '----------------------------------------------------------> Передам(обжалование) <-------------------------------------------------------',
    },
    {
     title: 'Для ГА',
     content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обжалование было передано на рассмотрение Главному Администратору. [/FONT][/COLOR][/B][/CENTER] <br><br>" +
      "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
      "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
       prefix: GGGA_PREFIX,
     status: true,
    },
    {
     title: 'Для Сакаро',
     content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обжалование было передано на рассмотрение [Color=#1E90FF] Руководителю Модерации Дискорда.[/COLOR][/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
       prefix: GGPIN_PREFIX,
     status: true,
    },
    {
     title: 'Для Спец Адм',
     content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обжалование было передано на рассмотрение Специальной Администрации.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте ответа[/ICODE][/FONT][/COLOR][/B][/CENTER]",
       prefix: GGSPECY_PREFIX,
     status: true,
    },
    {
           title: '---------------------------------------------------------------> Амнистии <---------------------------------------------------------------',
        },
        {
            title: 'Не по форме',
            content:
          "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обжалование составлено не по форме, пожалуйста ознакомьтесь с правилами подачи обжалований : [URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите сюда*[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
          "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
          "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGCLOSE_PREFIX,
            status: false,
        },
    {
     title: 'Дубликат',
     content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=WHITE][FONT=georgia]Ответ был дан в прошлой теме. <br> Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован.[/FONT][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
       prefix: GGCLOSE_PREFIX,
     status: false,
    },
        {
            title: 'Обжалованию не подлежит',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[B][CENTER][COLOR=WHITE] Выданное вам наказание не подлежит обжалованию. <br>"+
            "Нарушения, по которым заявка на обжалование не рассматривается: <br>"+
            "[ISPOILER] 4.1. различные формы слива 4.2. продажа игровой валюты 4.3. махинации <br> 4.4. целенаправленный багоюз 4.5. продажа, передача аккаунта 4.6. сокрытие ошибок, багов системы <br> 4.7. использование стороннего программного обеспечения 4.8. распространение конфиденциальной информации 4.9. обман администрации. [/ISPOILER]  <br>"+
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGCLOSE_PREFIX,
            status: false,
        },
        {
            title: 'Отказано',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[B][CENTER][COLOR=WHITE] В обжаловании отказано <br>"+
            "[ICODE]1.6. Каждая заявка на обжалование рассматривается индивидуально. <br> 1.7. Оформленная заявка на обжалование не означает гарантированного одобрения со стороны руководства сервера, она может быть отклонена без объяснения причин.[/ICODE]  <br>"+
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGCLOSE_PREFIX,
            status: false,
        },
        {
    title: 'Не готовы снизить',
    content:
        "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[B][CENTER][COLOR=WHITE] Администрация сервера не готова снизить вам наказание. <br>"+
        "Пожалуйста, не создавайте дубликаты, создание дубликатов карается блокировкой форумного аккаунта. <br>"+
        "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
        "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGCLOSE_PREFIX,
    status: false
},
        {
            title: 'Наказание полностью снято',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]После рассмотрения темы было принято решение о снятии вашего наказания полностью.<br>Наказание будет снято в течении 24 часов.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGACCEPT_PREFIX,
	        status: false,
        },
        {
            title: 'Наказание сокращено',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]После рассмотрения темы было принято решение о сокращении вашего наказания.<br>Наказание будет заменено в течении 24 часов.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGACCEPT_PREFIX,
            status: false,
        },
        {
            title: 'В другой раздел',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваше обращение относится к другому разделу.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
        },
        {
            title: 'Недостаточно док-ев',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Недостаточно доказательств для корректного рассмотрения вашего обращения.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
        },
        {
            title: 'Отсутствуют док-ва',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]В вашем обжаловании отсутствуют доказательства. Следовательно обжалование рассмотрению не подлежит.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
        },
        {
            title: 'Отсутствует /time',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]В ваших доказательствах отсутствует /time. Следовательно, обжалование рассмотрению не подлежит.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
        },
        {
            title: 'Док-ва в соц. сетях',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Доказательства в социальных сетях (VK,Instagram,FaceBook) не принимаются. Загрузите доказательства на фохостинг (Imgur,Yapix,Youtube).[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
        },
        {
            title: 'Окно бана',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Создайте новое обжалование прикрепив в доказательствах окно блокировки при входе.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGCLOSE_PREFIX,
            status: false
        },
        {
            title: 'Ошиблись сервером',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Вы ошиблись сервером, напишите обжалование на сервере на котором вы получили блокировку.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
         },
         {
            title: 'Смена NikName',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Ваш аккаунт разблокирован на 24 часа. Чтобы сменить никнейм - /mm - 8 или через /donate[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидайте[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGPIN_PREFIX,
            status: true,
        },
        {
            title: 'Ник изменён',
            content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]NickName был изменён Приятной Игры на сервере PSKOV.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGACCEPT_PREFIX, 
            status: true,
        },
    {
        title: 'Ник не изменён',
        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Вы не изменили Nick_Name за 24 часа аккаунт будет заблокирован снова.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        prefix: GGCLOSE_PREFIX, 
        status: false,
    },
    {
            title: 'NonRP Обман(unban)',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[B][CENTER][COLOR=WHITE] Аккаунт игрока будет разблокирован на 24 часа,за это время игрок должен вернуть обманутое имущество.<br>"+
            "[B][CENTER][COLOR=WHITE] После возращения имущества,оставьте доказательства в этой теме <br>"+
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Ожидаю ответа в этой теме[/ICODE][/FONT][/COLOR][/B][/CENTER]",
            prefix: GGPIN_PREFIX,
            status: true,
        },
    {
            title: 'Невозврат ущерба',
	        content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]У вас было 24 часа на возмещение ущерба, за это время вы не вернули обманутое имущество,аккаунт будет заблокирован навсегда.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
        	prefix: GGCLOSE_PREFIX,
            status: false
        },{
    title: 'Обманутый должен писать',
    content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок которого вы обманули должен сам написать обжалование.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGCLOSE_PREFIX,
    status: false,
        },
        {
     title: 'Вернул имущество',
    content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Имущество было возвращено.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGCLOSE_PREFIX,
    status: false
},
        {
    title: 'Не вернул имущество',
    content:
            "[CENTER][B][COLOR=WHITE]{{ greeting }}, уважаемый[/COLOR][COLOR=#7800C9] [ICODE]{{ user.name }}[/ICODE][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=WHITE][FONT=georgia]Игрок не вернул имущество. Аккаунт будет заблокирован. В случае передачи имущества куда-либо все аккаунты, на которые было передано имущество, также будут заблокированы.[/URL][/FONT][/COLOR][/B][/CENTER] <br><br>" +
            "[CENTER][URL=https://postimages.org/][IMG]https://i.postimg.cc/sxH6xq2w/5aHZMOe.png[/IMG][/URL][/CENTER] <br><br>" +
            "[CENTER][B][COLOR=#00FFFF][FONT=georgia][ICODE]Закрыто[/ICODE][/FONT][/COLOR][/B][/CENTER]",
    prefix: GGCLOSE_PREFIX,
    status: false
},
];

$(document).ready(() => {
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

    addButton('Жалобы на администрацию', 'selectAnswer5');

	const threadData = getThreadData();

$(`button#selectAnswer5`).click(() => {
XF.alert(buttonsMarkup(buttons5), null, 'Жалобы на администрацию. Выберите ответ');
buttons5.forEach((btn, id) => {
if (id > 1) {
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
            `<button type="button" class="button--primary button rippleButton" id="${id}" style="border-radius: 20px 20px; border-color: MediumSpringGreen; border-style: double; margin-right: 7px; margin-bottom: 10px; background: SpringGreen; text-decoration-style: wavy;">${name}</button>`,
);
}

function buttonsMarkup(buttons) {
return `<div class="select_answer">${buttons
  .map(
	(btn, i) =>
	  `<button id="answers-${i}" class="button--primary button ` +
	  `rippleButton" style="border-radius: 10px; margin-right: 10px; margin-bottom: 10px"><span class="button-text">${btn.title}</span></button>`,
  )
  .join('')}</div>`;
}
function pasteContent(id, data = {}, send = false) {
	const template = Handlebars.compile(buttons5[id].content);
	if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();

	$('span.fr-placeholder').empty();
	$('div.fr-element.fr-view p').append(template(data));
	$('a.overlay-titleCloser').trigger('click');

	if(send == true){
		editThreadData(buttons5[id].prefix, buttons5[id].status);
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
            discussion_open: 0,
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
	if(pin == 12345){
		fetch(`${document.URL}edit`, {
		  method: 'POST',
		  body: getFormData({
			prefix_id: prefix,
			title: threadTitle,
            discussion_open: 1,
			sticky: 0,
			_xfToken: XF.config.csrf,
			_xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
			_xfWithData: 1,
			_xfResponseType: 'json',
		  }),
		}).then(() => location.reload());
	}
}

function moveThread(prefix, type) {
// Перемещение темы
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