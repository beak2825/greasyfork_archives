// ==UserScript==
// @name         Скрипт руководства AQUA 1.4
// @namespace    https://forum.blackrussia.online
// @version      1.4
// @description  Script ruk. // AQUA
// @author       babaenko
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://freepngimg.com/thumb/eagle/20-eagle-black-siluet-png-image-download-thumb.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540656/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20AQUA%2014.user.js
// @updateURL https://update.greasyfork.org/scripts/540656/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0%20AQUA%2014.meta.js
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
    const OJIDANIE_PREFIX = 14;
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [
       {
      title: '――――――――――――――――――――――ОТВЕТЫ ЖБ АДМ―――――――――――――――――――――',
	},
        {
	   title: `На рассмотрении`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении у руководства сервера.[/CENTER]<br>` +
         `[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>` +
	 	`[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
       prefix: PIN_PREFIX,
	   status: true,
      },
       {
	   title: `Запрос опры`,
	   content:
         `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
         `[SIZE=4][FONT=georgia]Запросил доказательства у администратора.<br>`+
         `Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>`+
         `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
	   prefix: PIN_PREFIX,
	   status: true,
      },
       {
	   title: `Есть опра+`,
	   content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
       `[CENTER]Наказание выдано верно.[/CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	   prefix: UNACCEPT_PREFIX,
	   status: false,
	 },
       {
	  title: `Беседа с адм`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>` +
        `Ваше наказание будет снято в течение часа, если оно еще не снято.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
       {
	  title: `Наказание по ошибке`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. Так же с ним будет проведена профилактическая беседа.<br>` +
        `Ваше наказание будет снято в течение часа, если оно еще не снято.[/CENTER]<br><br>`+
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
           {
             title: `Нет докв`,
             content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
          `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>`+
          `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>`+
          `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
             prefix: UNACCEPT_PREFIX,
             status:false,
      },
       {
             title: `Мало докв`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые подтверждают нарушение администратора.<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br><br>`,
             prefix: UNACCEPT_PREFIX,
             status: false,
      },
          {
             title: `Доква не работают`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Доказательства, которые вы предоставили, не работают.<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br><br>`,
             prefix: UNACCEPT_PREFIX,
             status: false,
      },
 {
             title: `Нарушений нет`,
             content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
             `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств, нарушений со стороны администратора я не увидел!<br><br>`+
             `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
             prefix: UNACCEPT_PREFIX,
             status: false,
	  },
       {
	   title: `Жалоба не по форме`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	 	`[CENTER]Жалоба составлена не по форме.<br>` +
         `Внимательно прочитайте правила составления жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*ТЫК*[/URL]<br><br>` +
	 	`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	   prefix: CLOSE_PREFIX,
	   status: false,
	 },
       {
            title: `Окно бана`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
    },
       {
        title: `Соц сети`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Пожалуйста внимательно прочитайте тему «[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/']Правила подачи жалоб на администрацию[/URL][B]»[/B]<br><br>`+
        `И обратите своё внимание, на данный пункт правил:[/SIZE][/CENTER][/FONT]`+
        `[QUOTE][CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]3.6. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER][/QUOTE]`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
 
    },
       {
	  title: `От 3-его лица`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба создана от третьего лица.[/CENTER]<br>` +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	    title: `Ban IP`,
	    content:
		    `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR]${user.mention}<br><br>`+
		    `[CENTER]Дело в вашем айпи адресе. <br>` +
            `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
            `Ваш аккаунт не в блокировке<br><br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	},
      {
	  title: `Бред в жалобе`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба бредовая и не содержит в себе смысла.<br>` +
        `Рассмотрению не подлежит.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
       {
	  title: `48 часов`,
	  content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br>` +
      `[CENTER]Обратитесь в раздел обжалований: [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2864/']*ТЫК*[/URL]![/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
       {
        title: `Адм ПСЖ/СНЯТ`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER] Администратор был снят/ушел по собственному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
            `[CENTER][COLOR=rgb(0, 255, 0)]Рассмотрено.[/COLOR][/CENTER]<br>`,
        prefix: WATCHED_PREFIX,
        status:false,
    },
        {
        title: `Дублирование`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт.<br>`+
        `Пожалуйста не создавайте повторяющиеся темы.[/CENTER]<br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/SIZE][/FONT]<br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
       {
        title: `Не туда написана`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба ознакомится с назначением данного раздела в котором вы создали тему.<br>`+
            `Ваш запрос никоим образом не относится к предназначению данного раздела. <br><br>`+
            `[COLOR=rgb(255, 0, 0)] Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
       {
        title: `Другой сервер`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Вы ошиблись сервером, переношу ваше обращение в нужный раздел.<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Ожидайте вердикта администрации.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
    },
       {
      title: '――――――――――――――――――――――ПЕРЕАДРЕСАЦИИ―――――――――――――――――――――',
	},
      {
	  title: `В жб на адм`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратиться в раздел жалоб на администрацию.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
      {
	  title: `В жб на игроков`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратиться в раздел жалоб на игроков. Сейчас перенесу вашу жалобу<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `В жб на лд`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратиться в раздел жалоб на лидеров<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
       {
	  title: `В обжалования`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обратиться в раздел обжалование наказаний. <br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]На рассмотрении.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
      title: `Жб на теха`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
	  title: `Для ОЗГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора —  [user=724012]Alexandra_Schmidt[/user]<br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: PIN_PREFIX,
	  status: true,
	},
   // {
	 // title: `Для ЗГА(неактуал)`,
	 // content:
		//`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      //  `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора —  [user=418913/]Nick_Name[/user] <br><br>`+
      //  `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
     // prefix: PIN_PREFIX,
	 // status: true,
	//},
     {
	   title: `Для ГА`,
	   content:
	 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER]Передаю вашу жалобу Главному Администратору —  [user=1349399]Artem_Rooall.[/user] <br><br>`+
         `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
       prefix: GA_PREFIX,
	   status: true,
	 },
     {
         title: `Спецам`,
         content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
         `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба передана - Специальной Администрации.<br><br>`+
         `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
         prefix: SPECIAL_PREFIX,
         status: true,
     },
       {
      title: '―――――――――――――――――――――――ОБЖАЛОВАНИЯ――――――――――――――――――――――',
	},
       {
        title: `Отказать`,
        content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование рассмотрено и принято решение об отказе в обжаловании.<br><br>[/CENTER]` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
       {
        title: `Одобрить и сократить наказание`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование рассмотрено и принято решение о сокращении вашего наказания.<br><br>[/CENTER]`+
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
       {
        title: `На рассмотрении`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование на рассмотрении, ожидайте ответа от руководства сервера<br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: PIN_PREFIX,
        status:true,
    },
       {
        title: `Возмещение ущерба`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Если вы готовы возместить ущерб обманутой стороне свяжитесь с игроком в любым способом.<br>`+
        `Для возврата имущества он должен оформить обжалование.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Смена ника`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `[FONT=georgia][SIZE=4]Разблокировал ваш игровой аккаунт.<br>`+
        `У Вас есть 24 часа, чтобы сменить игровой никнейм.[/SIZE][/FONT]<br><br>`+
        `[SIZE=4][FONT=georgia][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: PIN_PREFIX,
        status: true,
    },
       {
        title: `Не по форме`,
        content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Обжалование составлено не по форме, ознакмьтесь с правилой подачи обжалований и создайте новую тему.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Дублирование`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>`+
        `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт.<br>`+
        `Пожалуйста не создавайте повторяющиеся темы.[/CENTER]<br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/SIZE][/FONT]<br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Соц сети`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}<br><br>Пожалуйста внимательно прочитайте тему «[URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Правила подачи заявки на обжалование наказания[/URL][B]»[/B]<br>И обратите своё внимание, на данный пункт правил:[/FONT][/SIZE][/CENTER]<br>`+
        `[QUOTE]`+
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]3.3. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER]`+
        `[/QUOTE]<br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
	  title: `Обж для ГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый(-ая)[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю ваше обжалование Главному Администратору —  [user=1349399]Artem_Rooall.[/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: GA_PREFIX,
	  status: true,
    },
        ];
      
      
     $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`На рассмотрение`, `pin`);
        addButton(`Одобрено`, `accepted`);
        addButton(`Отказано`, `unaccept`);
        addButton(`Закрыто`, `closed`);
        addButton(`Рассмотрено`, `watched`);
        addButton (`ГА`, `mainAdmin`);
        addButton(`КП`, `teamProject`);
        addButton (`Спецам`, `specialAdmin`);
        addButton(`Ответики`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData( ACCEPT_PREFIX, false));
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
        // Получаем заголовок темы, так как он  нахуя-то необходим при запросе хуйни
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