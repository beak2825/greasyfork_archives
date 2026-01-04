// ==UserScript==
// @name         скрипт руководства
// @namespace    https://forum.blackrussia.online
// @version      1.29
// @description   васап мабой
// @author       campotik_61
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535610/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/535610/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D1%80%D1%83%D0%BA%D0%BE%D0%B2%D0%BE%D0%B4%D1%81%D1%82%D0%B2%D0%B0.meta.js
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
      title: '――――――――――――――――――――――――Жалобы―――――――――――――――――――――――',
	},




         {

            title: `НАРУШЕНИЙ НЕТ`,
            content:`[SIZE=4][FONT=georgia][COLOR=#F0E68C][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER][/COLOR]<br><br>` +
            `[CENTER] [SIZE=4] Исходя из выше приложенных доказательств нарушений со стороны администратора нет![/SIZE]<br><br>`+
            `[CENTER] [SIZE=4] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] [/SIZE]<br><br>` ,

            prefix: UNACCEPT_PREFIX,
            status: false,
	          },


{
            title: `МАЛО ДОК-ВЫ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            ` [CENTER][SIZE=4][FONT=georgia] Недостаточно доказательств, которые подтверждают нарушение Администратора.[/FONT][/SIZE][CENTER]<br><br>`+
             `[CENTER] [SIZE=4] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S][CENTER][/SIZE]<br><br>`,


            prefix: UNACCEPT_PREFIX,
            status: false,
        },
          {
            title: `НЕТ ДОК-ВЫ`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER][/SIZE]<br><br>` +
            `[CENTER] [SIZE=4] Не увидел доказательств. Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.[/SIZE]<br><br>`+
`[CENTER] [SIZE=4] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] [/SIZE]<br><br>`,

 prefix: UNACCEPT_PREFIX,
            status:false,
        },
 {
	  title: `ОТ 3-его ЛИЦА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4]Жалоба создана от третьего лица.[/CENTER][/SIZE]<br><br>" +
		`[CENTER] [SIZE=4] [COLOR=rgb(184, 49, 47)][FONT=georgia]Жалоба не подлежит рассмотрению.[/FONT][/COLOR] [CENTER] [/SIZE]<br><br>`+
        `  [CENTER] [SIZE=4][COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] [/SIZE]<br><br>`,

      prefix: UNACCEPT_PREFIX,
	  status: false,


	},
  {
	  title: `НА РАССМОТРЕНИЕ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		" [CENTER][SIZE=4][FONT=georgia][COLOR=#F0E68C]Ваша жалоба взята на рассмотрение.[/COLOR] Ожидайте, пожалуйста, пока администратор предоставит мне доказательства[COLOR=#FFB6C1] и не нужно создавать копии этой темы.[/COLOR][/FONT] [/SIZE] [CENTER]<br><br>" +
		`  [CENTER] [SIZE=4] [COLOR=#87CEEB][FONT=georgia]На рассмотрении.[/FONT][/COLOR][/SIZE]<br><br>`,
            prefix:  PIN_PREFIX,
	  status: true,
	},
         {
	  title: `НА РАССМОТРЕНИЕ ЗГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		" [CENTER][SIZE=4][FONT=georgia][COLOR=#F0E68C]Ваша жалоба взята на рассмотрение ЗГА. [/COLOR][CENTER][.SIZE][/FONT]<br><br>" +
             "[CENTER][SIZE=4]Ожидайте, пожалуйста пока Администратор  вынесет вердикт[COLOR=#FFB6C1] и не нужно создавать копии этой темы.[/COLOR][/SIZE]<br><br>" +
		`  [CENTER] [COLOR=#87CEEB][FONT=georgia]На рассмотрении.[/FONT][/COLOR]<br><br>`,

	  prefix:  GA_PREFIX,
	  status: true,
	},
         {
            title: `ПРАВИЛА(ОФФТОП)`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] [SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба, [COLOR=#FFB6C1]ознакомится с назначением данного раздела[/COLOR], в котором Вы создали тему, так как Ваш запрос[COLOR=#FFB6C1] никоим образом не относится к предназначению данного раздела.[/COLOR][/CENTER]`+
              ` [CENTER] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите на меня*[/URL]<br><br>`+
               `[CENTER] [SIZE=4][COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] [/SIZE]<br><br>`,

              prefix: UNACCEPT_PREFIX,
            status:false,
        },
 {
            title: `ОКНО БАНА`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте [COLOR=#FFB6C1]скриншот окна с баном[/COLOR], после чего заново напишите жалобу.<br><br>`+
            `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`+
            `[SIZE=5][FONT=georgia][COLOR=#87CEEB]Пример:[/COLOR] [URL='https://imgur.com/a/hSky19R'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`,

            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `ГА Кампотику`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		`[CENTER] [SIZE=4][FONT=georgia]Передаю вашу жалобу [COLOR=#FFB6C1]Главному Администратору[/COLOR]  - @Woozy Skynex ✞<br><br>`+
        ` [CENTER][COLOR=#F0E68C][FONT=georgia]На рассмотрении. [/FONT][/COLOR][/SIZE] [CENTER] <br><br>`,
                 
	  prefix: GA_PREFIX,
	  status: true,
	},
         {
	  title: `СА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Передаю вашу жалобу [COLOR=#FFB6C1]Специальной администрации.[/COLOR]  <br><br>"+
        ` [CENTER][COLOR=#F0E68C][FONT=georgia]На рассмотрении. [/FONT][/COLOR][/SIZE] [CENTER] <br><br>`,
          prefix: SPECIAL_PREFIX,
	  status: true,
	},
         {
        title: ` пиши обж / 48 часво`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+

     `[CENTER] С момента выдачи наказание прошло более [COLOR=#F0E68C]48х часов[/COLOR], [COLOR=#87CEEB] жалоба не подлежит рассмотрению.[/COLOR] Обратитесь  в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.845/']Обжалование (кликабельно)[/URL]<br><br>` +
        `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
	  title: `АДМИН ПРАВ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, [COLOR=#87CEEB]что наказание было выдано верно[/COLOR].[/CENTER]<br><br>" +
		 `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
        title: `НАКАЗАНИЕ ПО ОШИБКЕ`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "В следствие беседы с администратором, было выяснено, [COLOR=#FFB6C1]наказание было выдано по ошибке[/COLOR]. По отношению к администратору будут приняты необходимые меры. [COLOR=#87CEEB]Наказание будет снято[/COLOR].[/FONT][/SIZE] <br><br>"+
        `[COLOR=#FFB6C1][SIZE=5][FONT=georgia]Одобрено, [/FONT][/SIZE][/COLOR][COLOR=#F0E68C][SIZE=5][FONT=georgia][S]закрыто.[/S][/FONT][/SIZE][/COLOR][/CENTER]<br><br>`,
                prefix:  ACCEPT_PREFIX,
	  status: false,
    },
        {
	  title: `БЕСЕДА `,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, [COLOR=#F0E68C]необходимые меры будут приняты[/COLOR].[/CENTER]<br><br>" +
             `[CENTER][COLOR=#FFB6C1][FONT=georgia]Одобрено, [/FONT][/COLOR][COLOR=#F0E68C][SIZE=5][FONT=georgia][S]закрыто.[/S][/FONT][/SIZE][/COLOR][/CENTER]<br><br>`,

	  prefix: ACCEPT_PREFIX,
	  status: false,
	},

        {
            title: `ОСК АДМ/НЕУВАЖ/ отказ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Жалоба отказана из-за [COLOR=#FFB6C1]Неуважительного обращения к Администрации[/COLOR]. За повторные действия Ваш форумный аккаунт,[COLOR=#87CEEB] может быть заблокирован[/COLOR].[/CENTER]<br><br>`+
		    `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `ФОРМА ПОДАЧИ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена [COLOR=#FFB6C1]не по форме[/COLOR]. Внимательно прочитайте [COLOR=#FFB6C1]правила составления жалоб[/COLOR]. <br><br>" +
     `[CENTER]   [SPOILER="Форма подачи. "]   <br><br>`+
  `[CENTER] [B]1. Ваш Nick_Name:  <br><br>`+
  `[CENTER] 2. Nick_Name администратора:  <br><br>`+
  `[CENTER] 3. Дата выдачи/получения наказания:  <br><br>`+
  `[CENTER] 4. Суть жалобы:   <br><br>`+
  `[CENTER] 5. Доказательство:[/B]  <br><br>`+
 `[CENTER] [/SPOILER]  [CENTER]      <br><br>`+
		 `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: `BAN IP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][COLOR=#FFB6C1]Дело в вашем айпи адрессе[/COLOR]. Попробуйте сменить его на старый, с которого Вы играли раньше, [COLOR=#F0E68C]смените интернет соединение или же попробуйте использовать ВПН[/COLOR]. [COLOR=#FFB6C1]Ваш аккаунт не в блокировке[/COLOR]<br><br>" +
	 `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
        title: `ОПРА В СОЦ.СЕТИ`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
       `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
        title: `ДУБЛИРОВАНИЕ`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             `[CENTER] Напоминаю, за дублирование тем я могу [COLOR=rgb(184, 49, 47)]заблокировать ваш форумный аккаунт[/COLOR]  <br><br>`+

         `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
        {
      title: `ЖБ НА ТЕХА`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Вы ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов. <br><br><br>`+
            `[URL='https://forum.blackrussia.online/forums/Сервер-№18-aqua.1199/']*Кликабельно*[/URL]  <br><br>`+
              `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
 {
            title: `ТЕХ РАЗДЕЛ`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/forums/Технический-раздел-aqua.815/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
              `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
             prefix: UNACCEPT_PREFIX,
        status: false,
     },
         {
            title: `АДМ ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] [COLOR=rgb(26, 188, 156)][FONT=georgia] [/FONT][/COLOR][COLOR=rgb(65, 168, 95)][FONT=georgia]Рассмотрено[/FONT][/COLOR][/SIZE] <br><br>`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
        {
            title: `НЕТ ССЫЛКИ НА РП БИО`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Прикрепите ссылку на Вашу  RolePlay биографию.<br><br>`+
             `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: `НЕТ ССЫЛКИ НА ЖБ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Прикрепите ссылку на Вашу  Жалобу.<br><br>`+
             `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Доказательства не работают`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Ваши доказательства не работают. Жалоба рассмотрению не подлежит.<br><br>`+
             `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Ошиблись сервером`,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>`+
            `[CENTER]Вы ошиблись сервером, переношу Вашу жалобу в нужный раздел.<br><br>`+
            `[CENTER]Убедительная просьба не создавать дубликаты данной темы.<br><br>`,
        },
        {
	  title: `АДМИН ПРАВ DM`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER] <br><br>" +
        ` [CENTER] [QUOTE][/QUOTE][QUOTE][/quote][QUOTE][/quote][QUOTE][/quote][QUOTE][/quote][QUOTE]   [COLOR=rgb(226, 80, 65)]2.19.[/COLOR]  Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/QUOTE] [CENTER] <br><br>` +
           `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
	  title: `АДМИН ПРАВ ОСК АДМ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER] <br><br>" +
        ` [CENTER] [QUOTE][COLOR=rgb(226, 80, 65)]2.54.[/COLOR] Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации |[COLOR=rgb(226, 80, 65)] Mute 180 минут[/COLOR] [/QUOTE][CENTER] <br><br>` +
         `  [QUOTE][/QUOTE][QUOTE][COLOR=rgb(226, 80, 65)]Пример[/COLOR]: оформление жалобы в игре с текстом: "Быстро починил меня", "Админы вы задрали уже когда работать будете меня тут ДБшат я 3 жалобы уже подал!!!!!!!!", "МОЗГИ ВКЛЮЧИТЕ Я УВОЛЮ ВАС ЩА" и т.д. и т.п., а также при взаимодействии с другими игроками.[/QUOTE][CENTER]  <br><br>`+
             `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
	  title: `АДМИН ПРАВ DB`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER] <br><br>" +
        ` [CENTER] [QUOTE][COLOR=rgb(226, 80, 65)]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(226, 80, 65)] | Jail 60 минут[/COLOR] [/QUOTE] [CENTER] <br><br>` +

             `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
	  title: `АДМ ПРАВ MQ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER]<br><br>" +
  `  [QUOTE]
[COLOR=rgb(184, 49, 47)]3.04.[/COLOR] Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) |[COLOR=rgb(184, 49, 47)] Mute 120 минут / Ban 7 - 15 дней[/COLOR]
[LIST]
[*]Примечание: термины "MQ", "rnq" расценивается, как упоминание родных.
[*]Исключение: если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.
[/LIST]

[/QUOTE] <br><br>` +
 ` [CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Помеха ИП`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER]<br><br>" +
  `  [QUOTE]
[COLOR=rgb(184, 49, 47)]2.04.[/COLOR]Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. |[COLOR=rgb(184, 49, 47)] Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]
[LIST]
[*]Пример: таран дальнобойщиков, инкассаторов под разными предлогами.
[/LIST]

[/QUOTE] <br><br>` +
 ` [CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},

        {
      title: '――――――――――――――――――――――――Обжалования―――――――――――――――――――――――',
	},
{
            title: `Снять наказание`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>`+
            `[CENTER][FONT=georgia]Проверив обжалование, было принято решение полностью снять наказание. Впредь не нарушайте и также ознакомьтесь с правилами проекта, чтобы подобных ситуаций больше не происходило.[/FONT]<br><br>`+
            `[COLOR=#FFB6C1][FONT=georgia]Одобрено[/COLOR], [COLOR=#F0E68C][S]закрыто.[/S][/FONT][/COLOR][/CENTER]<br><br>`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
       { title: `Сократить наказание`,
        content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>`+
        `[CENTER][FONT=georgia]Проверив обжалование, было принято решение сократить срок Вашего наказания. Впредь не нарушайте и также ознакомьтесь с правилами проекта, чтобы подобных ситуаций больше не происходило.[/FONT]<br><br>`+
        `[COLOR=#FFB6C1][FONT=georgia]Одобрено[/COLOR], [COLOR=#F0E68C][S]закрыто.[/S][/FONT][/COLOR][/CENTER]<br><br>`,
      prefix: ACCEPT_PREFIX,
      status: false,
       },
  {
            title: `ОБЖ ОТКАЗАНО`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] В Вашем обжаловании было отказано. Срок наказания не будет снижен.<br><br>` +
            `[CENTER]Оформленная заявка на обжалование не означает гарантированного одобрения со стороны руководства сервера, она может быть отклонена без объяснения причин.<br><br>`+
`[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

 prefix: UNACCEPT_PREFIX,
            status:false,
        },
{
	  title: `НА РАССМОТРЕНИЕ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		" [CENTER][SIZE=4][FONT=georgia]Ваше  обжалование  взято на рассмотрение. Ожидайте, пожалуйста ответа Администрации [COLOR=rgb(184, 49, 47)] и не нужно создавать копии этой темы.[/COLOR][/FONT]  [CENTER]<br><br>" +
		`  [CENTER] [COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении.[/FONT][/COLOR]<br><br>`,
            prefix:  PIN_PREFIX,
	  status: true,
	},
 {
	  title: `ГА Кампотику`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Передаю Ваше обжалование Главному Администратору  - @Woozy Skynex ✞  <br><br>"+
        ` [CENTER][COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении. [/FONT][/COLOR][/SIZE] [CENTER] <br><br>`,

	 prefix: GA_PREFIX,
	  status: true,
	},
 {
            title: `ЖБ ТЕХ`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]  [SIZE=4][FONT=georgia]Обратитесь в тех раздел -  [URL='https://forum.blackrussia.online/forums/Сервер-№18-aqua.1199/']*Нажмите на меня*[/URL] <br><br>`+
`[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

 prefix: UNACCEPT_PREFIX,
            status:false,
        },
{
            title: `ТЕХ РАЗДЕЛ`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/forums/Технический-раздел-aqua.815/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
              `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
             prefix: UNACCEPT_PREFIX,
        status: false,
     },
         {
            title: `ОБЖ НЕ ПОДЛЕЖИИТ`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Данное наказание не подлежит обжалованию.<br><br>` +
            `[CENTER][COLOR=#ff0000]Нарушения, по которым заявка на обжалование не рассматривается:<br><br>[/COLOR]`+
`[QUOTE][COLOR=#ff0000]4.1.[/COLOR] различные формы "слива";<br><br>`+
`[COLOR=#ff0000]4.2.[/COLOR] продажа игровой валюты;<br><br>`+
`[COLOR=#ff0000]4.3.[/COLOR] махинации;<br><br>`+
`[COLOR=#ff0000]4.4.[/COLOR] целенаправленный багоюз;<br><br>`+
`[COLOR=#ff0000]4.5.[/COLOR] продажа, передача аккаунта;<br><br>`+
`[COLOR=#ff0000]4.6.[/COLOR] сокрытие ошибок, багов системы;<br><br>`+
`[COLOR=#ff0000]4.7.[/COLOR] использование стороннего программного обеспечения;<br><br>`+
`[COLOR=#ff0000]4.8.[/COLOR] распространение конфиденциальной информации;<br><br>`+
`[COLOR=#ff0000]4.9.[/COLOR] обман администрации.[/QUOTE]<br><br>`+
`[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

 prefix: UNACCEPT_PREFIX,
            status:false,
        },
 
{
	  title: `BAN IP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Дело в вашем айпи адрессе. Попробуйте сменить его на старый с которого вы играли раньше, смените интернет соединение или же попробуйте использовать впн. Ваш аккаунт не в блокировке<br><br>" +
	 `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
            title: `ПРАВИЛА(ОФФТОП)`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] [SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос[COLOR=rgb(184, 49, 47)] никоим образом не относится к предназначению данного раздела.[/COLOR]`+
              `[/CENTER]
[SIZE=4][FONT=georgia] [/FONT][/SIZE]
[CENTER][URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']*Нажмите на меня*[/URL] <br><br>`+
               `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

            prefix: UNACCEPT_PREFIX,
            status:false,
        },
         {
	  title: `ФОРМА ПОДАЧИ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER] Обжалование составлена не по форме. Внимательно прочитайте правила составления обжалований. <br><br>" +
     `[CENTER]   [SPOILER="Форма подачи. "]   <br><br>`+
  `[CENTER] [B]1. Ваш Nick_Name:  <br><br>`+
  `[CENTER] 2. Nick_Name администратора:  <br><br>`+
  `[CENTER] 3. Дата выдачи/получения наказания:  <br><br>`+
  `[CENTER] 4. Суть жалобы:   <br><br>`+
  `[CENTER] 5. Доказательство:[/B]  <br><br>`+
 `[CENTER] [/SPOILER]  [CENTER]      <br><br>`+
		 `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
            title: `ОКНО БАНА`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скриншот окна с баном после чего заново напишите жалобу.<br><br>`+
            `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://imgur.com/a/hSky19R'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`,

            prefix: UNACCEPT_PREFIX,
            status:false,
        },

{
	  title: `НА РАССМОТРЕНИЕ обман`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		" [CENTER][SIZE=4][FONT=georgia]  У Вас есть 24 часа, чтобы возместить ущерб игроку и вернуть сумму обмана. Не забудьте прикрепить доказательства.[COLOR=rgb(184, 49, 47)] и не нужно создавать копии этой темы.[/COLOR][/FONT]  [CENTER]<br><br>" +
		`  [CENTER] [COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении.[/FONT][/COLOR]<br><br>`,
 prefix: PIN_PREFIX,
	  status: true,
	},
{
	  title: `Укажите ВК`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Укажите Вашу старницу ВК.  <br><br>"+
        `  [CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
       prefix:  UNACCEPT_PREFIX,
	  status: false,
	},
 {
	  title: ` свяжитесь с обманутой стороной`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER] Свяжитесь с обманутой стороной и договоритесь о возмещенье ущерба.[/CENTER]<br><br>" +
		"[CENTER] Затем  прикрепите доказательства соглашения  о возмещение.  [/CENTER]<br><br>" +
        `  [CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

      prefix: UNACCEPT_PREFIX,
	  status: false,


	},
 {
        title: `Ответ был/ДУБЛИРОВАНИЕ`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             `[CENTER] Уже на одно подобное обжалование от Вашего лица был дан ответ ранее. Напоминаю, за дублирование тем я могу [COLOR=rgb(184, 49, 47)]заблокировать Ваш форумный аккаунт[/COLOR]  <br><br>`+
         `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
{
            title: `НЕТ ДОК-ВЫ`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Не увидел доказательств. Пожалуйста, прикрепите доказательства к обжаловнию.<br><br>`+
`[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

 prefix: UNACCEPT_PREFIX,
            status:false,
        },
 {
	  title: `ОТ 3-его ЛИЦА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Обжалование создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER] [COLOR=rgb(184, 49, 47)][FONT=georgia]Обжалование не подлежит рассмотрению.[/FONT][/COLOR] [CENTER] <br><br>`+
        `  [CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

      prefix: UNACCEPT_PREFIX,
	  status: false,


	},

        {
	  title: `СА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Передаю Ваше   обжалование Специальной администрации.  <br><br>"+
        ` [CENTER][COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении. [/FONT][/COLOR][/SIZE] [CENTER] <br><br>`,
       prefix:  SPECIAL_PREFIX,
	  status: false,
	},
{
	  title: `Руководству Модерации`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Передаю Ваше обжалование Руководству Модерации.  <br><br>"+
        ` [CENTER][COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении. [/FONT][/COLOR][/SIZE] [CENTER] <br><br>`,
       prefix:  SPECIAL_PREFIX,
	  status: false,
	},
{
            title: `Ошиблись сервером`,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>`+
            `[CENTER]Вы ошиблись сервером, переношу Ваше обжалование в нужный раздел.<br><br>`+
            `[CENTER]Убедительная просьба не создавать дубликаты данной темы.<br><br>`,
        },
        {
            title: `Укажите привязки`,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>`+
            `[CENTER] Укажите все Ваши привязки.<br><br>`+  
            `[CENTER]Пример:<br>`+
            `[QUOTE][CENTER]VK ID: @idxxxxxxx<br>`+
            `[CENTER]TG ID  (id tg можно узнать в этом боте: @getmyid_bot)  Your user ID:xxxxxxx<br>`+
            `[CENTER]E-mail почта: xxxxxxx@gmail.com [/QUOTE] <br><br>`,
        },
{
	  title: `BAN IP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Дело в вашем айпи адрессе. Попробуйте сменить его на старый с которого вы играли раньше, смените интернет соединение или же попробуйте использовать впн. Ваш аккаунт не в блокировке<br><br>" +
	 `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{        title: `Смена ника`,
         content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ваш аккаунт будет разблокирован на 24 часа. За это время вы должны успеть поменять свой игровой NickName через /mm -> Смена имени или через /donate. После чего пришлите в данную тему скриншот с доказательством того, что вы изменили его. Если он не будет изменён, то аккаунт будет заблокирован обратно.<br><br>`+
                `[CENTER] [COLOR=#87CEEB][FONT=georgia]На рассмотрении.[/FONT][/COLOR]<br><br>`,
            prefix:  PIN_PREFIX,
	  status: true,
        },
{
         title: `Чужие привязки отказано`,
         content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Ваше обжалование отказано и аккаунт восстановлению не подлежит, поскольку указанные Вами привязки не соответствуют тем, что есть в игре.<br><br>`+
                `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,

	  prefix: CLOSE_PREFIX,
	  status: false,
	},
{
            title: `Док-ва отредактированы`,
            content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
                `[CENTER]Представленные доказательства были подвергнуты редактированию.<br><br>`+
                `[CENTER]Подобные обжалования рассмотрению не подлежат.<br><br>`+
            `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: UNACCEPT_PREFIX,
            status:false,
        },
{
            title: `ОБЖ уже на рассмотрении`,
            content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Уже одно подобное обжалование от Вашего лица находится на рассмотрении у Руководства сервера. Пожалуйста, прекратите создавать повторяющиеся темы и ожидайте ответа.<br><br>`+
            `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
	  prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Доказательства не работают`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Ваши доказательства не работают. Обжалование рассмотрению не подлежит.<br><br>`+
             `[CENTER] [COLOR=#FFB6C1]Отказано[/COLOR], [S][COLOR=#F0E68C]закрыто.[/COLOR][/S] [CENTER] <br><br>`,
            prefix: UNACCEPT_PREFIX,
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