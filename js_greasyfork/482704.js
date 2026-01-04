// ==UserScript==
// @name         Для Milky
// @namespace    https://forum.blackrussia.online
// @version      1
// @description  пон
// @a6uthor      Sova_Evseeva
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license 	 MIT
// @collaborator Quenk269
// @downloadURL https://update.greasyfork.org/scripts/482704/%D0%94%D0%BB%D1%8F%20Milky.user.js
// @updateURL https://update.greasyfork.org/scripts/482704/%D0%94%D0%BB%D1%8F%20Milky.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
const RESHENO_PREFIX = 6; // Prefix that will be set when solving the problem
const PIN_PREFIX = 2; // Prefix that will be set when thread pins
const GA_PREFIX = 12; // Prefix that will be set when thread send to ga
const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
const WATCHED_PREFIX = 9;
const CLOSE_PREFIX = 7;
const SPECIAL_PREFIX = 11;
const TECH_PREFIX = 13;
const buttons = [

   {
	  title: '----> Раздел Жалоб <-----',
   },
    {
        title: '| На рассмотрение |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=AQUA][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба взята на [COLOR=#ffff00]рассмотрение[/COLOR], пожалуйста ожидайте ответа.<br><br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#00FFFF]IRKUTSK[/COLOR].<br><br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]<br>"+
		"[url=https://postimages.org/][img]https://i.postimg.cc/bvzbc50C/download-4.gif[/img][/url]<br>",
	  prefix: PIN_PREFIX,
	  status: true,
    },
   {
      title: 'Не по форме',
      content:
        '[CENTER][COLOR=#FF69B4][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[SIZE=4][FONT=georgia][I][COLOR=rgb(209, 213, 216)]Ваша жалоба составлена не по форме.[/COLOR]<br><br>" +
        "[COLOR=rgb(209, 213, 216)]Внимательно прочитайте правила составления жалоб - https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/ [/COLOR][/I][/FONT][/SIZE]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>'+
       "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
      status: false,
 },
  {
      title: 'Не по теме',
      content:
        '[CENTER][COLOR=#FF1493][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Ваше сообщение никоим образом не относится к предназначению данного раздела.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
         '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>'+
      "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
        title: '| Нет /time |',
	  content:
		"[B][CENTER][COLOR=#FF4500][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В предоставленных доказательств отсутствует время (/time), не подлежит рассмотрению.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| От 3 лица |',
	  content:
		"[B][CENTER][COLOR=#0000FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]Жалоба составлена от 3-го лица, мы не можем ее рассмотреть.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Док-ва не открываются |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#0000FF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как ваши доказательства не открываются. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#00FFFF]IRKUTSK[/COLOR].<br><br>"+
		'[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
    {
	  title: '| Нужен фрапс |',
	  content:
		"[B][CENTER][COLOR=#DC143C][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender]В данной ситуации обязательно должен быть фрапс (видео фиксация) всех моментов, в противном случае жалоба будет отказано.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Дока-во отредактированы |',
	  content:
		"[B][CENTER][COLOR=#DC143C][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Представленные доказательства были отредактированные или в плохом качестве, пожалуйста прикрепите оригинал.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: '| Прошло более 48 часов |',
	  content:
		"[B][CENTER][COLOR=#0000FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] С момента выдачи наказания прошло более 48-ми часов, жалоба не подлежит рассмотрению.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
    },
    {
	  title: '| Отсутствуют док-ва |',
	  content:
		'[CENTER][url=https://postimages.org/][img]https://i.postimg.cc/zX82rx2b/1.png[/img][/url]<br>' +
		"[B][CENTER][COLOR=#0000FF][ICODE]{{ greeting }}, уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба [COLOR=#FF0000]отказана[/COLOR], так как доказательств на нарушение от данного администратора отсутствуют. <br><br>"+
                "[B][CENTER][COLOR=lavender]Убедительная просьба ознакомиться с правилами подачи жалоб на администрацию, закрепленные в данном разделе.<br>"+
                "[B][CENTER][COLOR=lavender]Приятной игры на [COLOR=black]BLACK[/COLOR] [COLOR=RED]RUSSIA[/COLOR] [COLOR=#00FFFF]IRKUTSK[/COLOR].<br><br>"+
		'[url=https://postimages.org/][img]https://i.postimg.cc/tgD5Xwhj/1618083711121.png[/img][/url]',
	  prefix: UNACCEPT_PREFIX,
	  status: false,
},
    	{
	  title: '| Не рабочие док-ва |',
	  content:
		"[B][CENTER][COLOR=#0000FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Предоставленные доказательства не рабочие либо же битая ссылка, пожалуйста загрузите доказательства на фото/видео хостинге.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
            "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
        },
    {
	  title: '| Окно бана |',
	  content:
		"[B][CENTER][COLOR=#FF00FF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
     },
    {
title: 'Бан по ip',
content:
"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток увaжaемый {{user.name}} [/ICODE][/COLOR][/CENTER][/B] <br>"+
"[B][CENTER][COLOR=lavender]Смените wi-fi соединение или же ip адрес на тот с которого вы играли раньше, дело именно в нем.<br>"+
"Перезагрузите ваш роутер или используйте VPN. <br>"+
'[B][CENTER] [COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]',
      prefix: CLOSE_PREFIX,
      status: false,
     },
    {
	  title: '| Дублирование |',
	  content:
		"[B][CENTER][COLOR=#00FFFF][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован.<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: `Ответ уже был дан`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/FONT][/SIZE]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Ответ на Вашу жалобу был дан в прошлой вашей теме, прочитайте вердикт более внимательнее.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
        prefix: CLOSE_PREFIX,
        status:false,
    },
    {
	  title: '| Проинструктировать |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Благодарим за ваше обращение! Администратор будет проинструктирован.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Неверный вердикт, беседа`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Администратор будет проинструктирован по поводу проверок жалоб.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Неверный вердикт, Наказание`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Администратор получит наказание за халатное рассмотрение жалоб.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Беседа с админом |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Строгая беседа с админом |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и будет проведена строгая беседа с администратором.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Админ будет наказан |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Ваша жалоба была одобрена и администратор получит наказание.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Нет нарушений |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Исходя из выше приложенных доказательств, нарушения со стороны администратора - не имееться!<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	 {
	  title: `Не указан никнейм администратора`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В вашей жалобе не указан Nickname администратора, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`+
         "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: `Не указан никнейм игрока`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В вашей жалобе не указан Nickname игрока, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`+
         "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
	  title: `Нужна ссылка на жалобу`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Нужна ссылка на жалобу, пожалуйста предоставьте ссылку на данную жалобу.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	 {
	  title: `Нужен /myreports`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В ваших доказательств отсутствует /myreports. Без данной команды жалоба не будет рассмотрена.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`+
         "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

	{
	  title: '| Наказание верное |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Проверив доказательства администратора, было принято решение, что наказание выдано верно.<br>"+
		'[B][CENTER][COLOR=RED][ICODE]Закрыто[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/4xbt01NG/download-5.gif[/img][/url]<br>",
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: '| Наказание по ошибке |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Одобрено[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: '| Админ Снят/ПСЖ |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Администратор был снят/ушел с поста администратора.<br>"+
		'[B][CENTER][COLOR=#00FA9A][ICODE]Рассмотрено[/ICODE][/COLOR][/CENTER][/B]'+
        "[url=https://postimages.org/][img]https://i.postimg.cc/qqpxm7bR/download-2.gif[/img][/url]<br>",
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	 {
              title: 'Передано ГА',
      content:
        '[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Главному Администратору  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=georgia][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR][/FONT]',
      prefix: GA_PREFIX,
      status: false,
    },
	 {
              title: 'Передано ЗГА',
      content:
        '[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Заместителю Главного Администратора  [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br>" +
        '[FONT=georgia][SIZE=4][I][COLOR=rgb(209, 213, 216)]Ожидайте ответа в данной теме, копии создавать не нужно.[/COLOR][/I][/SIZE][/FONT][/CENTER]<br>' +
        '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрени [/COLOR]',
        prefix: PIN_PREFIX,
	  status: true,
    },
    {
	  title: `Рук. МД`,
	  content:
"[CENTER][B][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)]Ваша жалоба передана [/COLOR][COLOR=rgb(30, 144, 255)]Руководителю модерации Discord[/COLOR][COLOR=rgb(230, 230, 250)]. [/COLOR]<br><br>"+
`[COLOR=rgb(255, 140, 0)][ICODE]Взято на рассмотрение..[/ICODE] [/COLOR][/FONT][/SIZE][/B][/CENTER]`,
     prefix: PIN_PREFIX,
	 status: true,
	},
	{
                      title: 'Передано КП',
      content:
        '[CENTER][FONT=georgia][SIZE=4][I][COLOR=rgb(255, 0, 0)]{{ greeting }}, уважаемый {{ user.mention }}.[/COLOR][/I][/SIZE][/FONT]<br><br>' +
        "[COLOR=rgb(209, 213, 216)][I][FONT=georgia][SIZE=4]Ваша жалоба переадресована [/SIZE][/FONT][/I][/COLOR][COLOR=rgb(255, 0, 0)][I][FONT=times new roman][SIZE=4]Команде Проекта[/SIZE][/FONT][/I][/COLOR][COLOR=rgb(209, 213, 216)][I][FONT=times new roman][SIZE=4].[/SIZE][/FONT][/I][/COLOR]<br><br>" +
       '[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении[/COLOR][/FONT][/SIZE][/CENTER]',
      prefix: COMMAND_PREFIX,
	  status: false,
    },
    {
	  title: '| Передано Спецу и Заму Спеца |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Жалоба передана Специальному Администратору, а так же его Заместителю - @Sander_Kligan / @Clarence Crown, пожалуйста ожидайте ответа..<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Передано Специальному Администратору[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: SPECIAL_PREFIX,
	  status: true,
	},
{
title: '-*- Отказ (Соц Сети)',
content:
'[B][Color=Turquoise]Здравствуйте, {{ user.name }}[/B][/color]<br><br>'+
"[FONT=Courier New]Благодарим Вас за потраченное время на обращение к нам в связи с ограничениями, наложенными на Ваш игровой аккаунт.[/FONT]<br><br>"+
"[FONT=Courier New]Мы сожалеем, но мы не можем принимать доказательства, размещенные в социальных сетях.[/FONT]<br>"+
"[FONT=Courier New]Но не волнуйтесь, у нас есть альтернативные варианты: Вы можете загрузить свои доказательства на известные фото-хостинги, такие как Imgur или PostIMG, или видео-хостинги, такие как Yandex, Google или YouTube, а также на другие доступные сервисы.[/FONT]<br><br>"+
"[FONT=Courier New]Как только вы загрузите свои доказательства на один из этих хостингов, создайте новую тему и мы с радостью её рассмотрим.[/FONT]<br>"+
'[SIZE=17][FONT=Courier New][Color=IndianRed]Тема была рассмотрена и закрыта.',
prefix: WATCHED_PREFIX,
status: false,
},
	{
	  title: '| В Тех раздел |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Пожалуйста составьте свою жалобу в Технический раздел сервера<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
  {
	  title: '| В ЖБ на теха |',
	  content:
		"[B][CENTER][COLOR=#EE82EE][ICODE]Доброго времени суток уважаемый {{ user.name }} [/ICODE][/COLOR][/CENTER][/B]<br><br>"+
		"[B][CENTER][COLOR=lavender] Вам было выдано наказания Техническим специалистом, вы можете написать жалобу на технического специалиста<br>"+
		"[CENTER][IMG width=695px]https://i.postimg.cc/qBmYpvQv/C0ffE.png[/IMG]<br>"+
		'[B][CENTER][COLOR=red][ICODE]Отказано[/ICODE][/COLOR][/CENTER][/B]',
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
      title: 'В обжалования',
      content:
        '[CENTER][COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]{{ greeting }}, уважаемый {{ user.mention }}.[/I][/SIZE][/FONT][/COLOR]<br><br>' +
        "[I][COLOR=rgb(209, 213, 216)][FONT=georgia][SIZE=4]Обратитесь в раздел обжалований наказаний.[/SIZE][/FONT][/COLOR][/I]<br><br>" +
        '[COLOR=rgb(255, 0, 0)][FONT=georgia][SIZE=4][I]Закрыто.[/I][/SIZE][/FONT][/COLOR][/CENTER]<br>',
      prefix: CLOSE_PREFIX,
      status: false,
    },
 ];

$(document).ready(() => {
	// Загрузка скрипта для обработки шаблонов
	$('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

	// Добавление кнопок при загрузке страницы
	addButton('Меню', 'selectAnswer');
	addButton('Одобрить', 'accepted');
	addButton('Отказать', 'unaccept');
	addButton('На рассмотрение', 'pin');
	addButton('Рассмотрено', 'watched');
	addButton('Закрыть', 'closed');
	addButton(`КП`, `teamProject`);
    addButton ('Спецу', 'specialAdmin');
    addButton ('ГА', 'mainAdmin');
    addButton('Тех.Спецу', 'techspec');


	// Поиск информации о теме
	const threadData = getThreadData();

	$('button#pin').click(() => editThreadData(PIN_PREFIX, true));
	$('button#accepted').click(() => editThreadData(ACCEPT_PREFIX, false));
	$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
	$(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
	$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
	$(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
	$(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));

	$(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));

	$('button#unaccept').click(() => editThreadData(UNACCEPT_PREFIX, false));

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
})()