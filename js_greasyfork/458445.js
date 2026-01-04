// ==UserScript==
// @name         Forum Script для Босса
// @namespace    https://forum.blackrussia.online
// @version      0.4
// @description  Очень удобный, полезный, а самое главное - полноценный форумный скрипт для руководства!
// @author       Твой Danya из 21 сервера..
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458445/Forum%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%91%D0%BE%D1%81%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/458445/Forum%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%91%D0%BE%D1%81%D1%81%D0%B0.meta.js
// ==/UserScript==
 
(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const SPECIAL_PREFIX = 11;
    const GA_PREFIX = 12;
    const TECH_PREFIX = 13;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
 
        {
            title:`Приветствие`,
            content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.  [/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]<br><br>",
        },
	{
 
	  title: `Отправить на рассмотрение`,
	  content:
"[CENTER][B][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/COLOR]<br><br>"+
`[COLOR=rgb(255, 140, 0)][ICODE]На рассмотрении..[/ICODE][/COLOR][/FONT][/SIZE][/B][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
{
 
            title: `Нету нарушение`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Исходя из выше приложенных доказательств, нарушений со стороны администратора - не имеется![/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Отказано.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
         {
	  title: `От 3 лица`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Ваша жалоба создана от третьего лица, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
            title: `Нету док-вы`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора, на данный момент жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: `Недостаточно док-вы`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][B][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/B][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][B][COLOR=rgb(230, 230, 250)]Недостаточно доказательств, которые подтверждают нарушение администратора.[/COLOR][/B][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][B][ICODE]Закрыто.[/ICODE][/B][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
     {
            title: `Не работает док-ва`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][B][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/B][/FONT][/SIZE][/COLOR]<br><br>"+
"[B][SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]В вашей жалобе не работают доказательства. Пере-создайте тему с рабочими доказательствами в этот же раздел.[/COLOR][/FONT][/SIZE][/B]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][B][ICODE]Закрыто.[/ICODE][/B][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
         {
            title: `Ошиблись разделом`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][B][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/B][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][B][ICODE]Отказано.[/ICODE][/B][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нету окна бана`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][B][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/B][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Прикрепите Scrinchoot окна блокировки перед входом в игру после чего, заново напишите жалобу.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][B][ICODE]Закрыто.[/ICODE][/B][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
{
            title: `Взлом ФА / Аккаунта`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][COLOR=rgb(230, 230, 250)][FONT=tahoma]Вы подвергли свой аккаунт [/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=tahoma][U]мошенникам[/U][/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma]. На форуме стоит защита, где указано [/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=tahoma][U]«Не переходите по незнакомым ссылкам и не вводите туда данные от аккаунта»[/U][/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma]. Если Вы ввели данные, у Вас есть время чтобы восстановить аккаунт через бота [/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=tahoma][U]Вконтакте[/U][/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma], или через [/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=tahoma][B][U]Вашу почту через VK бота[/U][/B][/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma][B][U].[/U][/B][/FONT][/COLOR][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
	{
	  title: `Некорректная опра, беседа`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][B][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/B][/FONT][/SIZE][/COLOR]<br><br>"+
"[B][COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>"+
"Ваше наказание будет снято.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Простая Беседа`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][B][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/B][/FONT][/SIZE][/COLOR]<br><br>"+
"[B][COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Ваша жалоба была одобрена, с администратором будет проведена беседа.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Неверный вердикт, беседа`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Администратор будет проинструктирован по поводу проверок жалоб.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `Неверный вердикт, Наказание`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Администратор получит наказание за халатное рассмотрение жалоб.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
  {
	  title: `Строгая Беседа`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Ваша жалоба была одобрена, с администратором будет проведена строгая беседа.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Одобрено, наказание`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Ваша жалоба была одобрена, администратор получит соответствующее наказание.<br>"+
"Ваше наказание будет снято. [/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Админ прав`,
	  content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок. [/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Проверив доказательства администратора, наказание выдано верно.[/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба не по форме`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Отказано.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Не указан никнейм администратора`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В вашей жалобе не указан Nickname администратора, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Не указан никнейм игрока`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В вашей жалобе не указан Nickname игрока, жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Отсутствует /time`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В вашей жалобе отсутствует /time на Scrinchoot о выдаче наказания.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Отказано.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: `Нужна ссылка на жалобу`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Нужна ссылка на жалобу, пожалуйста предоставьте ссылку на данную жалобу.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Жалоба не по правилам`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Если Вы хотите, чтобы Вашу жалобу рассмотрели, напишите ее соответствующее с правилам, закрепленными в данном разделе.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Нужен /myreports`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]В ваших доказательств отсутствует /myreports. Без данной команды жалоба не будет рассмотрена.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел обжалование`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Если Вы согласны с наказанием, обратитесь в раздел Обжалование наказаний [B]—[/B]  [/FONT][/SIZE][/COLOR][COLOR=rgb(204, 204, 204)][SIZE=4][FONT=tahoma][URL='https://forum.blackrussia.online/index.php?forums/Обжалование-наказаний.995/'][U]«Нажмите»[/U][/URL][/FONT][/SIZE][/COLOR][COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma].[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
        title: `Спец. админу`,
        content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR][/B]<br><br>"+
"[SIZE=4][FONT=tahoma][B][COLOR=rgb(230, 230, 250)]Ваша жалоба передана [/COLOR][COLOR=rgb(255, 0, 0)]Специальной администрации[/COLOR][COLOR=rgb(230, 230, 250)], ожидайте их ответа.[/COLOR][/B][/FONT][/SIZE]<br><br>"+
`[B][COLOR=rgb(255, 140, 0)][SIZE=4][FONT=tahoma][ICODE]Взято на рассмотрение, ожидайте ответа.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
 
	{
 
	  title: `Передано ГА`,
	  content:
"[CENTER][B][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR][/B]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma][B]Ваша жалоба передана [/B][/FONT][/SIZE][/COLOR][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][B]Главному администратору[/B][/FONT][/SIZE][/COLOR][COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma][B]  —  [USER=52127]Vladislav_Knyazev[/USER].[/B][/FONT][/SIZE][/COLOR]<br><br>"+
`[B][COLOR=rgb(255, 140, 0)][SIZE=4][FONT=tahoma][ICODE]Взято на рассмотрение, ожидайте ответа.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
     prefix: GA_PREFIX,
	 status: true,
	},
  {
	  title: `Передано ЗГА`,
	  content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)]Ваша жалоба передана [/COLOR][COLOR=rgb(255, 0, 0)]Заместителю ГА[/COLOR][COLOR=rgb(230, 230, 250)] по направлен[/COLOR][COLOR=rgb(230, 230, 250)]ию структур — [/COLOR][USER=201683]Yuki Kalashnikov[/USER].[/B]<br><br>"+
`[COLOR=rgb(255, 140, 0)][B][ICODE]Взято на рассмотрение, ожидайте ответа.[/ICODE][/B][/COLOR][/FONT][/SIZE][/CENTER]`,
     prefix: PIN_PREFIX,
	 status: true,
	},
{
	  title: `Передано КП`,
	  content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/B][/FONT]<br><br>"+
"[COLOR=rgb(230, 230, 250)][FONT=tahoma]Ваша жалоба передана [/FONT][/COLOR][COLOR=rgb(255, 215, 0)][FONT=tahoma]Команде проекта[/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma], срок рассмотрения жалоб переданной команде проекта [B]—[/B]  [/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=tahoma][U]не ограничено правилами[/U][/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma].[/FONT][/COLOR]<br><br>"+
`[FONT=tahoma][COLOR=rgb(255, 140, 0)][B][ICODE]Взято на рассмотрение, ожидайте ответа.[/ICODE][/B][/COLOR][/FONT][/SIZE][/CENTER]`,
     prefix: COMMAND_PREFIX,
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
        title: `Наказание по ошибке`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/B][/FONT]<br><br>"+
"[COLOR=rgb(230, 230, 250)][FONT=tahoma]Проверив доказательства администратора, наказание было выдано по ошибке.<br>"+
"Наказание с Вас будет снято в течении [/FONT][/COLOR][COLOR=rgb(255, 255, 255)][FONT=tahoma][U]24-часов[/U][/FONT][/COLOR][COLOR=rgb(230, 230, 250)][FONT=tahoma], так же с администратором будет проведена беседа.[/FONT][/COLOR][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
    },
    {
        title: `Опра в соц. сети`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/FONT][/SIZE]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Пожалуйста внимательно прочитайте тему [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.1305084/']«Правила подачи жалоб на администрацию»[/URL][/FONT][/SIZE][/COLOR]<br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]И обратите своё внимание, на данный пункт правил — [/COLOR][SPOILER=3.6]<br>"+
"[COLOR=rgb(255, 0, 0)]3.6.[/COLOR] Прикрепление доказательств обязательно.<br>"+
"[B][COLOR=rgb(255, 0, 0)]Примечание:[/COLOR][/B] загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).<br>"+
"[/SPOILER][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Отказано.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: ` Срок подачи жалобы `,
        content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)]С момента выдачи наказание прошло более [/COLOR][COLOR=rgb(255, 255, 255)]48-ми часов[/COLOR][COLOR=rgb(230, 230, 250)], жалоба не подлежит рассмотрению.[/COLOR][/B][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][B][ICODE]Отказано.[/ICODE][/B][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
  {
        title: `Проинструктировать`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)]Администратор будет проинструктирован.[/COLOR]<br>"+
"[COLOR=rgb(230, 230, 250)]Благодарим за Ваше обращение![/COLOR][/B][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
  {
            title: `Наказание`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[SIZE=4][FONT=tahoma][COLOR=rgb(230, 230, 250)]Администратор получит наказание.<br>"+
"Благодарим за Ваше обращение![/COLOR][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(0, 255, 0)][SIZE=4][FONT=tahoma][ICODE]Одобрено.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Тех. спецу`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR]<br><br>"+
"[COLOR=rgb(230, 230, 250)]Ваша жалоба была передана[/COLOR][COLOR=rgb(255, 77, 0)] техническому специалисту [/COLOR][COLOR=rgb(230, 230, 250)]сервера.[/COLOR][/B][/FONT][/SIZE]<br><br>"+
`[COLOR=rgb(255, 140, 0)][B][SIZE=4][FONT=tahoma][ICODE]Взято на рассмотрение, ожидайте ответа.[/ICODE][/FONT][/SIZE][/B][/COLOR][/CENTER]`,
        prefix: TECH_PREFIX,
        status:true,
    },
    {
        title: `Дублирование`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/FONT][/SIZE]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован. Ваша жалоба не подлежит рассмотрению.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Отказано.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
  {
        title: `Ответ уже был дан`,
        content:
"[CENTER][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/FONT][/SIZE]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Ответ на Вашу жалобу был дан в прошлой вашей теме, прочитайте вердикт более внимательнее.[/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
    {
      title: `Жалоба на теха`,
      content:
"[CENTER][SIZE=4][FONT=tahoma][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/FONT][/SIZE]<br><br>"+
"[COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Наказание было выдано техническим специалистом, обратитесь в жалобы в техническом разделе сервера —  [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9621-chilli.1202/']«Нажмите»[/URL][/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
 
    },
     {
            title: `В тех раздел`,
            content:
"[CENTER][COLOR=rgb(255, 105, 180)][SIZE=4][FONT=tahoma][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/FONT][/SIZE][/COLOR]<br><br>"+
"[B][COLOR=rgb(230, 230, 250)][SIZE=4][FONT=tahoma]Оставьте свою жалобу в технический раздел — [URL='https://forum.blackrussia.online/index.php?forums/Сервер-№21-chilli.1202/']«Нажмите»[/URL][/FONT][/SIZE][/COLOR]<br><br>"+
`[COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
{
            title: `Админ ПСЖ`,
            content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/B][/FONT][/SIZE]<br><br>"+
"[FONT=tahoma][SIZE=4][COLOR=rgb(230, 230, 250)]Администратор был снят по собственному желанию.[/COLOR]<br>"+
"[COLOR=rgb(255, 255, 255)][U]Ваше наказание будет снято.[/U][/COLOR][/SIZE][/FONT]<br><br>"+
`[B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
     {
            title: `Админ снят`,
            content:
"[CENTER][SIZE=4][FONT=tahoma][B][COLOR=rgb(255, 105, 180)][ICODE]Доброго времени суток, уважаемый игрок.[/ICODE][/COLOR][/B][/FONT][/SIZE]<br><br>"+
"[FONT=tahoma][SIZE=4][COLOR=rgb(230, 230, 250)]Администратор был снят со своего поста.[/COLOR]<br>"+
"[COLOR=rgb(255, 255, 255)][U]Ваше наказание будет снято.[/U][/COLOR][/SIZE][/FONT]<br><br>"+
`[B][COLOR=rgb(255, 0, 0)][SIZE=4][FONT=tahoma][ICODE]Закрыто.[/ICODE][/FONT][/SIZE][/COLOR][/B][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
        },

    ];
 
    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);
 
        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`КП`, `teamProject`);
        addButton(`Рассмотрено`, `watched`);
        addButton(`Закрыто`, `closed`);
        addButton (`Спецу`, `specialAdmin`);
        addButton (`ГА`, `mainAdmin`);
        addButton(`Теху`, `techspec`);
        addButton(`Меню ответов`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();
 
        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
        $(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
        $(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
        $(`button#specialAdmin`).click(() => editThreadData(SPECIAL_PREFIX, true));
        $(`button#mainAdmin`).click(() => editThreadData(GA_PREFIX, true));
        $(`button#techspec`).click(() => editThreadData( TECH_PREFIX , true));
 
 
        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Выберите ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 0) {
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
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const hours = new Date().getHours();
        const greeting = 4 < hours && hours <= 11
        ? `Доброе утро`
            : 11 < hours && hours <= 15
        ? `Добрый день`
                : 15 < hours && hours <= 21
        ? `Добрый вечер`
                    : `Доброй ночи`
 
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: greeting
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