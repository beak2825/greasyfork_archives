// ==UserScript==
// @name         скрипт
// @namespace    https://forum.blackrussia.online
// @version      0.2
// @description   ммм героин
// @author       delivs
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460254/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/460254/%D1%81%D0%BA%D1%80%D0%B8%D0%BF%D1%82.meta.js
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
            title: `ПРИВЕТСВИЕ`,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER]      [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        },
         {

            title: `НАРУШЕНИЙ НЕТ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств нарушений со стороны администратора нет!<br>`+
            `[COLOR=rgb(184, 49, 47)] Отказано[/COLOR],[S]закрыто.[/S] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
       {
            title: `МАЛО ДОК-ВЫ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            ` [CENTER][SIZE=4][FONT=georgia][SIZE=4][FONT=georgia][SIZE=4][FONT=georgia] Недостаточно доказательств, которые подтверждают нарушение Администратора.[/FONT][/SIZE][/FONT][/SIZE][/FONT][/SIZE] [CENTER]<br>`+
             `[COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] <br><br>`+
           
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
          {
            title: `НЕТ ДОК-ВЫ`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Не увидел доказательств. Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
`[COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] <br><br>`+
`[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
 prefix: UNACCEPT_PREFIX,
            status:false,
        },
 {
	  title: `ОТ 3-его ЛИЦА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER] [COLOR=rgb(184, 49, 47)][FONT=georgia]Жалоба не подлежит рассмотрению.[/FONT][/COLOR] [CENTER] <br><br>`+
        `  [CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [/FONT][/SIZE]  [CENTER] <br><br>`+
          `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
	  status: false,

	  
	},
  {
	  title: `НА РАССМОТРЕНИЕ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		" [CENTER][SIZE=4][FONT=georgia]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста пока администратор предоставит мне доказательства[COLOR=rgb(184, 49, 47)] и не нужно создавать копии этой темы.[/COLOR][/FONT]  [CENTER]<br><br>" +
		`  [CENTER] [COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении.[/FONT][/COLOR]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
	  title: `НА РАССМОТРЕНИЕ ЗГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		" [CENTER][SIZE=4][FONT=georgia][SIZE=4][FONT=georgia]Ваша жалоба взята на рассмотрение ЗГА  [USER=316417]@Lucas_King[/USER] или @[B][USER=454070]Matwey_Pistenkоv[/USER][/B]. [CENTER]<br><br>" +
             "Ожидайте, пожалуйста пока администратор предоставит доказательства[COLOR=rgb(184, 49, 47)] и не нужно создавать копии этой темы.[/COLOR][/FONT] <br><br>" +
		`  [CENTER] [COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении.[/FONT][/COLOR]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `ПРАВИЛА(ОФФТОП)`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] [SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос[COLOR=rgb(184, 49, 47)] никоим образом не относится к предназначению данного раздела.[/COLOR][/CENTER]`+
              ` [CENTER] [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.3429349/']*Нажмите на меня*[/URL]  <br><br>`+
               `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
 {
            title: `ОКНО БАНА`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скриншот окна с баном после чего заново напишите жалобу.<br>`+
            `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://imgur.com/a/hSky19R'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `МУДРОМУ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Передаю вашу жалобу Главному Администратору —  @Joseph Stoyn  <br><br>"+
        ` [CENTER][COLOR=rgb(250, 197, 28)][FONT=georgia]На рассмотрении. [/FONT][/COLOR][/SIZE] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
	},
 {
        title: ` 48 `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 48х часов,[COLOR=rgb(184, 49, 47)] жалоба не подлежит рассмотрению.[/COLOR]<br><br>"+
     `[CENTER] Можете обратиться  в раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.471/']Обжалование (кликабельно)[/URL]<br>`+
        `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
        {
	  title: `АДМИН ПРАВ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER]<br><br>" +
		 `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
        title: `НАКАЗАНИЕ ПО ОШИБКЕ`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.С администратором будет проведена профилактическая беседа. Наказание будет снято.[/FONT][/SIZE] <br><br>"+
        `[COLOR=rgb(65, 168, 95)][SIZE=5][FONT=georgia]Одобрено,[/FONT][/SIZE][/COLOR][COLOR=rgb(209, 72, 65)][SIZE=5][FONT=georgia][S]закрыто.[/S][/FONT][/SIZE][/COLOR][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
          prefix: ACCEPT_PREFIX,
	  status: false,
    },
        {
	  title: `БЕСЕДА (не опра)`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.[/CENTER]<br>" +
             `[CENTER] [COLOR=rgb(97, 189, 109)]Одобрено[/COLOR],[S]закрыто.[/S] [/FONT][/SIZE] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
{
	  title: `БЕСЕДА СТРОГАЯ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]С администратором будет проведена строгая беседа на эту тему.<br><br>" +
		 `[CENTER] [COLOR=rgb(97, 189, 109)]Одобрено[/COLOR],[S]закрыто.[/S] [/FONT][/SIZE] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
        {
            title: `ОСК АДМ/НЕУВАЖ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Жалоба  отказана из-за  Неуважительного обращения к Администрации. За повторные действия Ваш форумный аккаунт,[COLOR=rgb(184, 49, 47)] может быть заблокирован[/COLOR][/CENTER]  <br><br>`+
		    `[CENTER][COLOR=rgb(184, 49, 47)]Отказано[/COLOR][COLOR=rgb(255, 255, 255)].[/COLOR][CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
	  title: `ФОРМА ПОДАЧИ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалоб. <br><br>" +
     `[CENTER]   [SPOILER="Форма подачи. "]   <br><br>`+
  `[CENTER] [B]1. Ваш Nick_Name:  <br><br>`+
  `[CENTER] 2. Nick_Name администратора:  <br><br>`+
  `[CENTER] 3. Дата выдачи/получения наказания:  <br><br>`+
  `[CENTER] 4. Суть жалобы:   <br><br>`+
  `[CENTER] 5. Доказательство:[/B]  <br><br>`+
 `[CENTER] [/SPOILER]  [CENTER]      <br><br>`+
		 `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: `BAN IP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Дело в вашем айпи адрессе. Попробуйте сменить его на старый с которого вы играли раньше, смените интернет соединение или же попробуйте использовать впн. Ваш аккаунт не в блокировке<br><br>" +
	 `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
        title: `ОПРА В СОЦ.СЕТИ`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
       `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
        title: `ДУБЛИРОВАНИЕ`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             `[CENTER] Напоминаю, за дублирование тем я могу [COLOR=rgb(184, 49, 47)]заблокировать ваш форумный аккаунт[/COLOR]  <br><br>`+

         `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
        {
      title: `ЖБ НА ТЕХА`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Вы ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов. <br><br><br>`+
            `[CENTER] [URL='https://forum.blackrussia.online/index.php?forums/Сервер-№10-black.1191/']*Кликабельно*[/URL]  <br><br>`+
              `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
 {
            title: `ТЕХ РАЗДЕЛ`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-black.488/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
              `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
             prefix: UNACCEPT_PREFIX,
        status: false,
     },
         {
            title: `АДМ ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] [COLOR=rgb(26, 188, 156)][FONT=georgia] [/FONT][/COLOR][COLOR=rgb(65, 168, 95)][FONT=georgia]Рассмотрено[/FONT][/COLOR][/SIZE] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
        {
            title: `НЕТ ССЫЛКИ НА РП БИО`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Прикрепите ссылку на Вашу  RolePlay биографию.<br>`+
             `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
         {
            title: `НЕТ ССЫЛКИ НА ЖБ`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Прикрепите ссылку на Вашу  Жалобу.<br>`+
             `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
	  title: `АДМИН ПРАВ DM`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER] <br><br>" +
        ` [CENTER] [QUOTE][/QUOTE][QUOTE][/quote][QUOTE][/quote][QUOTE][/quote][QUOTE][/quote][QUOTE]   [COLOR=rgb(226, 80, 65)]2.19.[/COLOR]  Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/QUOTE] [CENTER] <br><br>` +
           `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
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
             `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
	  title: `АДМИН ПРАВ DB`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER][SIZE=4][FONT=georgia]Проверив доказательства администратора, было принято решение, что наказание было выдано[COLOR=rgb(97, 189, 109)] верно[/COLOR].[/CENTER] <br><br>" +
        ` [CENTER] [QUOTE][COLOR=rgb(226, 80, 65)]2.13.[/COLOR] Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта[COLOR=rgb(226, 80, 65)] | Jail 60 минут[/COLOR] [/QUOTE] [CENTER] <br><br>` +

             `[CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
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
 ` [CENTER] [COLOR=rgb(184, 49, 47)]Отказано[/COLOR],[S]закрыто.[/S] [CENTER] <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
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