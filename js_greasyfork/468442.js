// ==UserScript==
// @name         Forum Script для ГА/ЗГА VOLGOGRAD
// @namespace    https://forum.blackrussia.online
// @version      2.6
// @description  my skills
// @author       Kingston007
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468442/Forum%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%20VOLGOGRAD.user.js
// @updateURL https://update.greasyfork.org/scripts/468442/Forum%20Script%20%D0%B4%D0%BB%D1%8F%20%D0%93%D0%90%D0%97%D0%93%D0%90%20VOLGOGRAD.meta.js
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
            title: `Приветствие`,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        },
        {

            title: `Нарушений нет`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br>`+
            `[CENTER] Отказано,закрыто. [/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
         {
	  title: `3`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `Отказано,закрыто! [/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста пока администратор предоставит мне доказательства и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Мало докв`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER] Отказано, закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
  {
            title: `Нет док`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Не увидел доказательств. Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] Закрыто<br>`+
`[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
 prefix: UNACCEPT_PREFIX,
            status:false,    
        },
         {
            title: `Правила`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER]Отказано, закрыто.[/CENTER][/FONT]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Окно`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скриншот окна с баном после чего заново напишите жалобу.<br>`+
            `[CENTER] Отказано,закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
	{
	  title: `Беседа`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br>" +
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Админ прав`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание было выдано верно.[/CENTER]<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Форма`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Айпи`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Дело в вашем айпи адрессе. Попробуйте сменить его на старый с которого вы играли раньше, смените интернет соединение или же попробуйте использовать впн. Ваш аккаунт не в блокировке<br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Передаю вашу жалобу Главному Администратору —  @Angel Extazzy ♅   <br><br>"+
        `На рассмотрении. <br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
	},
 {
            title: `ОБЖ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая)${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.471/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER] Отказано,закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },

	{
	  title: `ЗГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была передана ЗГА - @Oleg Kalashnikov<br><br>" +
		`[CENTER]Ожидайте ответа[/CENTER][/FONT][/SIZE]<br><br>`+
        `[CENTER]На рассмотрение[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `[ОБЖ] ЖБ АДМ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Если вы не согласны с выданным наказанием, то напишите в раздел Жалобы на Администрацию.<br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `ОшибкаА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Внимательно рассмотрев доказательства было принято, что админ ошибся. Наказание будет снято в течении часа.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `[ОБЖ] ОДОБРЕНО`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: WATCHED_PREFIX ,
	  status: true,
	},
	{
	  title: `лидер`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]x[/CENTER]<br><br>` +
		"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на лидеров<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `игрок`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на игроков.<br><br>" +
		`[CENTER]Отказано.[/CENTER][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
        title: `Наказание по ошибке`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.С администратором будет проведена профилактическая беседа. Наказание будет снято.[/FONT][/SIZE] <br><br>"+
        `[COLOR=rgb(65, 168, 95)][SIZE=5][FONT=georgia]Одобрено,[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 72, 65)][SIZE=5][FONT=georgia][S]закрыто.[/S][/FONT][/SIZE][/COLOR][/CENTER]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix:ACCEPT_PREFIX,
        status:false,
    },
    {
        title: `ВК`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] закрыто.[/S][/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
        title: ` 48 `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 48х часов, жалоба не подлежит рассмотрению.<br><br>"+
        `Отказано, закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: `СА`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Ваша жалоба передана - Специальной Администрации. [/FONT] [COLOR=rgb(251, 160, 38)][FONT=georgia]<br>"+
        `На рассмотрение. [/FONT][/COLOR][/SIZE][/CENTER]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
    {
        title:`[ОБЖ] ОТКАЗАНО`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "[CENTER]В Вашем обжаловании было отказано. Срок наказания не будет снижен.<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER] Отказано, закрыто.<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Предупрежден`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение!  Администратор будет предупрежден.<br><br>`+
        `Одобрено,закрыто.[/FONT][/SIZE]<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
{ 
            title: `Выговор`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER] Одобрено,закрыто<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `[ОБЖ] 24 ЧАСА`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       "[CENTER]У вас есть 24 часа чтобы прикрепить доказательство о передаче обманутому игроку деньги/имущество на которое вы обманули игрока.<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=orange] На рассмотрении.<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: PIN_PREFIX,
        status:true,
    },
    {
        title: `Дублирование`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт<br><br>`+
        `Отказано,закрыто<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {  
      title: `ЖБ ТЕХ`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
     {
            title: `ТЕХ Раздел`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-black.488/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
            `[CENTER] Отказано,закрыто!<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
             prefix: UNACCEPT_PREFIX,
        status: false,
     },
 {
            title: `ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено<br><br>`+ 
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
 {
             title:`[ОБЖ] РАССМОТРЕНО`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания.<br><br>" +
        "[CENTER]Ваше наказание будет снято/снижено в течение 24-ех часов.<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Закрыто.<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=red] Приятной игры и времяпровождение  на сервере VOLGOGRAD (39)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: WATCHED_PREFIX,
        status: false,
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
         addButton(`Тех.Спец`, `techspec`);
         addButton(`Ответы`, `selectAnswer`);
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