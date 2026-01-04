// ==UserScript==
// @name         A Rothschild 
// @namespace    https://forum.1wmobile.gg/index.php
// @version      1.0.6
// @description  Специально для 1WMOBILE || Victoria by A.Rothschild
// @author       A.Rothschild |
// @match        https://forum.1wmobile.gg/index.php*
// @include      https://forum.1wmobile.gg/index.php
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @supportURL   https://t.me/ruzveltes
// @downloadURL https://update.greasyfork.org/scripts/510511/A%20Rothschild.user.js
// @updateURL https://update.greasyfork.org/scripts/510511/A%20Rothschild.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    const VAZNO = 1;               // Важно
const NA_RASSMOTRENII = 2;     // На рассмотрение
const RASSMOTRENO = 3;         // Рассмотрено
const ODOBRENO = 4;            // Одобрено
const ZAKRYTO = 5;             // Закрыто
const OTKRYTO = 6;             // Открыто
const NA_DORABOTKE = 7;        // На доработке
const PROVERENO = 8;           // Проверено
const INFORMACIYA = 9;         // Информация
const NA_RASSMOTRENII_GA = 10; // На рассмотрение ГА
const KOMANDE_PROEKTA = 11;    // Команде проекта
const ZGA = 12;                                 // Передать ЗГА
const TEHU = 13;                             //Тех специалисту
    const data = await getThreadData(),
     greeting = data.greeting,
     user = data.user;
    const BUTTONS_PER_PAGE = 3; // Количество кнопок на странице
     let currentPage = 1; // Текущая страница
 
 
    const buttons = [
        {
            title: `____________________________________ЖБ на АДМИНОВ____________________________________`,
 
        },
        {
            title: `Нет доказательств`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>` +
                     `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>` +
                     `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>` +
                     `[COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b].[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: ZAKRYTO,
            status: false,
              },
      {
             title: `Мало доказательств`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые потверждают нарушение администратора.<br><br>`+
             `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b] [/COLOR][/CENTER]<br><br>`,
             prefix: ZAKRYTO,
             status: false,
      },
      {
          title: `Нарушений нет`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на серверае Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
             prefix: ZAKRYTO,
             status: false
           },
      {
          title: `Администратор наказан`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>` +
        `Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ODOBRENO,
	  status: false,
	},
    {
        title: `Предоставлена док-ва`,
	   content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
       `[CENTER]Наказание выдано верно![/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	   prefix: ZAKRYTO,
	   status: false,
        },
    {
        title: `Прошло 72 часа`,
	  content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 72 часов.[/CENTER]<br>` +
      `[CENTER]Обратитесь в раздел обжалований` +
      `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ZAKRYTO,
	  status: false
        },
      {
           title: `Нарушений нет`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано. Приятной игры на серверае Victoria[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
             prefix: ZAKRYTO,
             status: false,
             },
             {
             title: 'Нету условий сделки',
      content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]В ваших доказательствах отсутствуют условия сделки<br>`+
         `[COLOR=rgb(251, 160, 38)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/FONT][/SIZE][/CENTER]<br>`,
	   prefix: ZAKRYTO,
	   status: true,
	},
	{
	title: `Нужен фрапс`,
	   content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]В таких случаях нужны видео доказательства (фрапс)<br>`+
         `Загрузите доказательства на видео хостинг и предоставьте в новой жалобе<br><br>`+
         `[COLOR=rgb(251, 160, 38)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/FONT][/SIZE][/CENTER]<br>`,
	   prefix: ZAKRYTO,
	   status: true,
	  },
      {
	   title: `На рассмотрении (док-ва)`,
	   content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]Запросил доказательства у администратора.<br>`+
         `Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>`+
         `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/FONT][/SIZE][/CENTER]<br>`,
	   prefix: NA_RASSMOTRENII,
	   status: true,
      },
      {
	   title: `На рассмотрении`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении у руководства сервера.[/CENTER]<br>` +
         `[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>` +
	 	`[CENTER][COLOR=rgb(250, 197, 28)][center][color=yellow][b]На рассмотрении[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
       prefix: NA_RASSMOTRENII,
	   status: true,
           title: `На расмотрении`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Ваша жалоба взата на рассмотрение.<br>` +
        `Ожидайте ответа в этой теме, дублирование жалоб модет привести к блокировке аккаунта [/CENTER]<br><br>`+
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=yellow][b]На рассмотрении...[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: NA_RASSMOTRENII,
	  status: false,
	},
    {
	  title: `От 3-его лица`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба создана от третьего лица.[/CENTER]<br>` +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ZAKRYTO,
	  status: false,
	},
    {
            title: `Окно бана`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br><br>`+
            `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: ZAKRYTO,
            status:false,
    },
	 {
	   title: `Жалоба не по форме`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	 	`[CENTER]Жалоба составлена не по форме.<br>` +
         `Внимательно прочитайте правила составления жалобы - [URL=https://forum.1wmobile.gg/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1.225/']*ТЫК*[/URL]<br><br>` +
	 	`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	   prefix: ZAKRYTO,
	   status: false,
	 },
    {
        title: `Опра в соц сети (отказ)`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Пожалуйста внимательно прочитайте тему «[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/']Правила подачи жалоб на администрацию[/URL][B]»[/B]<br><br>`+
        `И обратите своё внимание, на данный пункт правил:[/SIZE][/CENTER][/FONT]`+
        `[QUOTE][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]3.6. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER][/QUOTE]`+
        `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]`,
        prefix: ZAKRYTO,
        status: false,
        title: `Не туда написана`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба ознакомится с назначением данного раздела в котором Вы создали тему.<br>`+
            `Ваш запрос никоим образом не относится к предназначению данного раздела.<br><br>`+
            `[COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: ZAKRYTO,
        status:false,
    },
    {
        title: `Администратор снят (наказание будет снято)`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER] Администратор был снят/ушел по собственному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
            `[CENTER][COLOR=rgb(0, 255, 0)][center][color=green][b]Рассмотрено[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
        prefix: ZAKRYTO,
        status:false,
    },
	{
	    title: `Смена IP адресса`,
	    content:
		    `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
		    `[CENTER]Дело в вашем айпи адресе. <br>` +
            `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
            `Ваш аккаунт не в блокировке<br><br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	    prefix: ZAKRYTO,
	    status: false,
	},
    {
        title: `В раздел ОБЖ`,
        content:
            `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2864/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: ZAKRYTO,
        status: false,
    },
 
	{
	  title: `Бред в жалобе`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба бредовая и не содержит в себе смысла.<br>` +
        `Рассмотрению не подлежит.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ZAKRYTO,
	  status: false,
	},
	 {
	   title: `Ошибка от администора (относящиеся к игре)`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	 	`[CENTER]Администратор совершил ошибку.<br>` +
         `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
	 	`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	   prefix: ODOBRENO,
	   status: false,
	 },
	{
	  title: `Ошибка от администора (не относящиеся к игре)`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Администратор ошибся, с ним будет проведена профлактическая беседа<br>` +
        `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ODOBRENO,
	  status: false,
        title: `________________________________________________ПЕРЕАДРЕСАЦИИ_________________________________________________`,
    },
    {
	  title: `В раздел жалоб на игроков`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на игроков.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Отказано[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ZAKRYTO,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на лидеров<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
	  prefix: ZAKRYTO,
	  status: false,
	},
    {
      title: `Жалобу на теха`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)][center][color=red][b]Закрыто[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
        prefix: ZAKRYTO,
        status: false,
 
    },
    {
	  title: `Передать Спецу`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Специальному  Администратору<br>`+
        `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
      prefix: KOMANDE_PROEKTA,
	  status: true,
	},
    {
	  title: `Передать Теху`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Техническому Специалисту<br>`+
        `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
      prefix: TEHU,
	  status: true,
	},
    {
	  title: `Передать ЗГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора <br>`+
        `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
      prefix: ZGA,
	  status: true,
	},
     {
	   title: `Передать ГА`,
	  content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Главному Администратору<br>`+
         `[COLOR=rgb(251, 160, 38)][center][color=yellow][b]На рассмотрении[/b][/color][/center]  
[b][color=aqua]Приятной игры на сервере[/color][/b]  
[b][color=blue]Victoria[/color][/b][/COLOR][/CENTER]<br>`,
       prefix: NA_RASSMOTRENII_GA,
       status: true,
          title: `_______________________________Правила Role Play процесса ______________________________________`,
    },
    {
      title: `Нонрп поведение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Уход от РП`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Нонрп вождение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
     {
       title: `NonRP Обман`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/color].[/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ODOBRENO,
       status: false,
     },
    {
      title: `Аморал действия`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
     {
       title: `Слив склада`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ODOBRENO,
       status: false,
     },
    {
      title: `РК`,
      content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `ТК`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ODOBRENO,
        status: false,
      },
      {
        title: `СК`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ODOBRENO,
        status: false,
      },
      {
        title: `ПГ`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ODOBRENO,
        status: false,
      },
      {
        title: `MG`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
     {
       title: `ДМ`,
       content:
       `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/color].[/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ODOBRENO,
       status: false,
     },
     {
       title: `Масс ДМ`,
       content:
     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/color].[/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ODOBRENO,
       status: false,
     },
     {
       title: `ДБ`,
       content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
         `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ODOBRENO,
       status: false,
     },
    {
      title: `Стороннее ПО`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]|  Ban 15 - 30 дней / PermBan[/color] <br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Реклама сторонние ресурсы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Оск адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Уяз.правил`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил [Color=Red]| Ban 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Уход от наказания`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.34[/color]. Запрещен уход от наказания [Color=Red]| Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `IC и OCC угрозы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `IC конфликты в OOC`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.36[/color]. Запрещено переносить конфликты из IC в OOC и наоборот [Color=Red]| Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
     {
      title: `Угрозы OOC`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней [/color]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Злоуп наказаниями`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 30 дней [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Оск проекта`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Продажа промо`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `ЕПП Фура`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Покупка фам.репы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [Color=Red]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color]<br><br>` +
        `[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Помеха РП процессу`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.51[/color]. Запрещено вмешательство в Role Play процесс с целью помехи и препятствования дальнейшего развития Role Play процесса [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Нонрп акс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=Red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `2.53(Названия маты)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=Red]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Неув обр. к адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
    },
    {
      title: `Баг аним`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.55[/color]. Запрещается багоюз связанный с анимацией в любых проявлениях. [Color=Red]| Jail 60 / 120 минут [/color]<br>` +
        `[Color=Orange]Пример[/color]: если Нарушитель, используя баг, убирает ограничение на использование оружия в зеленой зоне, сбивает темп стрельбы, либо быстро перемещается во время войны за бизнес или во время перестрелки на мероприятии с семейными контейнерами, последует наказание в виде [Color=Red]Jail на 120 минут[/COLOR].<br>` +
        `Данное наказание используется в случаях, когда, используя ошибку, было получено преимущество перед другими игроками. <br>` +
        `[Color=Orange]Пример[/color]: если Нарушитель использует баги, связанные с анимацией, и при этом не влияет на игровой процесс других игроков, а также не получает преимущество перед другими игроками, последует наказание в виде [Color=Red]Jail на 60 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ODOBRENO,
      status: false,
	        },
 
        // Другие кнопки можно добавлять здесь...
        ];
 
$(document).ready(() => {
    $('body').append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

    // Добавление кнопки "Ответы"
    addButton(`Ответы`, `button-answers`);

    // Добавление декоративной кнопки
    addDecorativeButton();

    // Обработка клика по кнопке "Ответы"
    $(`button#button-answers`).click(() => {
        showResponseModal();
    });

    // Создание модального окна для остальных кнопок
    createModal();

    // Добавление кнопок в модальное окно
    buttons.forEach((btn, index) => {
        addModalButton(btn.title, index);
    });

    // Добавление стилей через JavaScript
    addDynamicStyles();
});

function addButton(name, id) {
    $(`.button--icon--reply`).before(
        `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px;">${name}</button>`
    );
}

// Функция для добавления декоративной кнопки
function addDecorativeButton() {
    const decorativeButtonHTML = `
        <button type="button" id="decorative-button" style="
            margin: 3px; 
            padding: 5px 10px; 
            font-size: 12px; 
            background: transparent; 
            border: 1px solid #00ffcc; /* Тонкая рамка */
            color: #00ffcc; 
            border-radius: 5px; /* Уменьшенный радиус */
            cursor: default; 
            position: relative; 
            overflow: hidden; 
            font-weight: bold;
            text-transform: uppercase;
        ">
            <span class="decorative-text" style="
                display: inline-block; 
                animation: text-flip 2s linear infinite;
                font-family: Arial, sans-serif;
            ">1Wmobile</span>
        </button>
    `;
    $(`.button--icon--reply`).before(decorativeButtonHTML);
}

// Создание модального окна
function createModal() {
        const modalHTML = `
         <div id="response-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0, 0, 0, 0.9); z-index:9999;">
    <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%) scale(0.8); background:#1a1a1a; color:#00ffcc; padding:20px; border-radius:15px; box-shadow: 0 0 20px rgba(0, 255, 204, 0.8);">
        <h2 style="margin: 0 0 10px; font-family: Arial, sans-serif; color: #00ffcc;">Выберите действие:</h2>
        <div id="modal-buttons"></div>
        <button id="close-modal" style="margin-top: 15px; padding: 10px 20px; background: linear-gradient(90deg, #007bff, #00ffcc); color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 0 10px rgba(0, 123, 255, 0.5); transition: all 0.3s ease;">Закрыть</button>
    </div>
</div>
    `;
    $('body').append(modalHTML);

    $('#close-modal').click(() => {
        $('#response-modal').hide();
    });
}

// Функция для динамического добавления CSS
function addDynamicStyles() {
    const styles = `
        @keyframes text-flip {
            0%, 50% {
                color: #ff0000;
                content: "August";
            }
            50%, 100% {
                color: #0000ff;
                content: "1wmobile";
            }
        }

        #decorative-button .decorative-text {
            display: inline-block; 
            animation: text-flip 2s linear infinite;
            font-family: Arial, sans-serif;
        }
    `;
    const styleSheet = `<style>${styles}</style>`;
    $('head').append(styleSheet);
}

function showResponseModal() {
    $('#response-modal').show();
}

function addModalButton(name, index) {
    const buttonHTML = `
        <button class="modal-button" id="modal-button-${index}" style="
            margin: 5px; 
            padding: 10px 15px; 
            font-size: 14px; 
            background: transparent; /* Убрана заливка */
            color: #00ffcc; /* Цвет текста */
            border: 2px solid; /* Рамка кнопки */
            border-image-source: linear-gradient(90deg, #00ffcc, #007bff); /* Неоновая рамка */
            border-image-slice: 1;
            border-radius: 8px; 
            box-shadow: 0 0 10px rgba(0, 255, 204, 0.6); 
            cursor: pointer; 
            transition: all 0.3s ease;
        ">
            ${name}
        </button>
    `;
    $('#modal-buttons').append(buttonHTML);
    $(`#modal-button-${index}`).click(() => pasteContent(index, data, true));
}

function pasteContent(id, data = {}, send = false) {
    const template = Handlebars.compile(buttons[id].content);
    if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

    $(`span.fr-placeholder`).empty();
    $(`div.fr-element.fr-view p`).append(template(data));
    $(`a.overlay-titleCloser`).trigger(`click`);

    if (send === true) {
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
                : `Доброй ночи`;

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
    const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

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

function getFormData(data) {
    const formData = new FormData();
    Object.entries(data).forEach(i => formData.append(i[0], i[1]));
    return formData;
}
})();