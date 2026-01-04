// ==UserScript==
// @name         Tyda suda
// @namespace    https://forum.blackrussia.online
// @version      1.0
// @description  try
// @author       Amir/Rock
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL none
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
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        },
        {

            title: `Нету нарушение`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны администратора - не имеется!<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто. [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
	},
         {
	  title: `ЖБ от 3 лица`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[color=red]Отказано[/color],закрыто! [/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, пока администратор предоставит мне доказательства и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER][color=orange]На рассмотрении[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER][color=red] Отказано[/color],закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
  {
            title: `Нету док-вы`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] [color=red]Закрыто[/color]<br>`+
`[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
 prefix: UNACCEPT_PREFIX,
            status:false,
        },
         {
            title: `Правила раздела`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER][color=red]Отказано[/color], закрыто.[/CENTER][/FONT]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Окно бана`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
	{
	  title: `Беседа с адм`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>Ваше наказание будет снято. <br><br>" +
		`[CENTER][color=green]Одобрено[/color], закрыто.[CENTER][FONT=georgia][SIZE=15]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `Админ прав`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER][color=red]Закрыто[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER][color=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жб на ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Если Вы не согласны с решением главной администрации, то Вам в этот раздел - https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%93%D0%90-%D0%97%D0%93%D0%90.489/<br><br>" +
		`[CENTER][color=red]Отказано[/color], закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Передано ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Главному Администратору —  @Joseph Stoyn  <br><br>"+
        `[color=orange]На рассмотрении[/color]. <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: GA_PREFIX,
	  status: true,
	},
    {
	  title: `Передано ЗГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Заместителю Главного Администратора —  @Anatoliy Pyatak  <br><br>"+
        `[color=orange]На рассмотрении[/color]. <br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
 {
            title: `В раздел обж`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый(ая)${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/index.php?forums/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B9.471/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER][color=red] Отказано[/color],закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    {
	  title: `Наказание по ошибке`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке.<br>С администратором будет проведена профилактическая беседа.<br>Ваше наказание будет снято. <br><br>" +
		`[CENTER][color=green]Одобрено[/color], закрыто.[CENTER][FONT=georgia][SIZE=15]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Бан IP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Смените wi-fi соединение или же ip адресс на тот с которого вы играли раньше, дело именно в нем.<br>Перезагрузите ваш роутер или используйте VPN. <br><br>" +
		`[CENTER][color=red]Закрыто[/color].[CENTER][FONT=georgia][SIZE=15]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color],[S] закрыто.[/S][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
        title: ` 48 ч `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 48 часов, жалоба не подлежит рассмотрению.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Проинструктировать`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение!  Администратор будет проинструктирован.<br><br>`+
        `[color=green]Одобрено[/color],закрыто.[/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
{
            title: `Выговор`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит выговор.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
          `[CENTER][color=green]Одобрено[/color],закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
              prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Дублирование`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован<br><br>`+
        `[color=red]Отказано[/color],закрыто<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {
      title: `ЖБ на техов`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
     {
            title: `В тех раздел`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-black.488/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
            `[CENTER][color=red] Отказано[/color],закрыто!<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
             prefix: UNACCEPT_PREFIX,
        status: false,
     },
 {
            title: `Админ ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER][color=green] Рассмотрено[/color]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
            prefix: WATCHED_PREFIX,
            status:false,
        },

       {
	  title: `Не ссылки на Рп био`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Прикрепите ссылку на вашу РП биографию.[/CENTER]<br><br>" +
		`[CENTER][color=red]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: `Нет ссылку на ЖБ`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Прикрепите ссылку на Жалобу.[/CENTER]<br><br>" +
		`[CENTER][color=red]Закрыто.[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
         {
        title: `Админ прав Mass DM`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав  DM`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             "[QUOTE][color=red]Примечание:[/color] разрешен ответный DM в целях защиты, обязательно иметь видео доказательство в случае наказания администрации, нанесение урона по транспорту также является нарушением данного пункта правил.[/QUOTE]"+
             "[QUOTE][color=red]Примечание:[/color] нанесение урона с целью защиты особняка или его территории, а также нанесение урона после ДТП не является веской IC причиной, для войны семей предусмотрено отдельное системное мероприятие.[/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
          {
        title: `Админ прав MG`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
              "[QUOTE][color=red]Примечание:[/color] использование смайлов в виде символов «))», «=D» запрещено в IC чате.[/QUOTE]"+
              "[QUOTE][color=red]Примечание:[/color] телефонное общение также является IC чатом.[/QUOTE]"+
              "[QUOTE][color=red]Исключение:[/color] за написанный однократно вопросительный «?» или восклицательный «!» знак в IC чате, наказание не выдается.[/QUOTE]"+
        `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
          {
        title: `Админ прав Слив склада`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле | Ban 15 - 30 дней / PermBan [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
          {
        title: `Админ прав ТС в личных целях`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
             {
        title: `Админ прав DB`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
                 "[QUOTE][color=red]Исключение:[/color] разрешается на территории проведения мероприятия по захвату упавшего семейного контейнера.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав RK`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.14. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти | Jail 30 минут[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав CK`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства) [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав TK`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав TK`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    }, {
        title: `Админ прав Упом род`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        "[QUOTE][color=red]Примечание:[/color] термин 'MQ' расценивается, как упоминание родных.[/QUOTE]"+
        "[QUOTE][color=red]Исключение:[/color] если упоминание родных было совершено в ходе Role Play процесса и не содержало в себе прямого или завуалированного оскорбления.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
           {
        title: `Админ прав Флуд`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
          {
        title: `Админ прав Злоуп знаком`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
              "[QUOTE][color=red]Пример:[/color] «???????», «!!!!!!!», «Дааааааааааааааааааааааа» и так далее.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав Сексизм`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.07. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
              "[QUOTE][color=red]Примечание: [/color] «дырка», «шмара», «ведро», «мадагаскарский присосконог», «свиноногий бандикут», «скорострел» и так далее.[/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
          {
        title: `Админ прав слив ГЧ`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав Выдача себя за адм `,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 + ЧС администрации [/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: `Админ прав Музыка в войс чат  `,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE] 3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
             {
        title: `Админ прав Caps Lock`,
        content:` [CENTER][SIZE=4][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Проверив доказательства администратора, было принято решение, что наказание выдано верно.[SIZE=4][B]<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
             `[SIZE=4][FONT=georgia][color=red]Отказано[/color], [color=scarlet]закрыто.[/color][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
         {
        title: ` Обж нет `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " Данное наказание не подлежит обжалованию.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
         {
        title: ` Обж отказано `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " В Вашем обжаловании было отказано. Срок наказания не будет снижен.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },
         {
        title: ` Обж одобрено `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.<br><br>"+
        `[color=red]Закрыто.[/color], [/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: WATCHED_PREFIX,
        status:  false,
    },
        {
	  title: `Обж нрп обман`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]У вас есть 24 часа чтобы прикрепить доказательство о передаче обманутому игроку деньги/имущество на которое вы обманули игрока.​[/CENTER]<br><br>" +
		`[CENTER][color=orange]На рассмотрении[/color].[/CENTER][/FONT][/SIZE]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
        title: `Обж не по форме `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " Обжалование составлена не по форме. Внимательно прочитайте правила составления обжалований, которые закреплены в этом разделе.<br><br>"+
        `[color=red]Отказано[/color], закрыто.[/FONT][/SIZE][/CENTER]<br><br>`+
                 `[SIZE=4][FONT=georgia][CENTER][COLOR=black] Приятной игры и времяпровождение  на сервере BLACK (10)[/COLOR][/FONT][/SIZE][/CENTER]`,
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