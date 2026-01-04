// ==UserScript==
// @name         Скрипт для старшей адм(от куратора) для KAZAN
// @namespace    https://forum.blackrussia.online
// @version      4.3
// @description  I don't know what to write here
// @author       Martin_Alfrenzio
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450856/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D1%82%D0%B0%D1%80%D1%88%D0%B5%D0%B9%20%D0%B0%D0%B4%D0%BC%28%D0%BE%D1%82%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%29%20%D0%B4%D0%BB%D1%8F%20KAZAN.user.js
// @updateURL https://update.greasyfork.org/scripts/450856/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D1%81%D1%82%D0%B0%D1%80%D1%88%D0%B5%D0%B9%20%D0%B0%D0%B4%D0%BC%28%D0%BE%D1%82%20%D0%BA%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D0%B0%29%20%D0%B4%D0%BB%D1%8F%20KAZAN.meta.js
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
            title: `Приветствие (ответ  своим ответом) `,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
                `[CENTER][/CENTER][/FONT][/SIZE]`,
        },
        {
            title: `•~•~•~•~•~•Отправление на закреп•~•~•~•~•~•`
        },
        {
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: PIN_PREFIX,
	  status: true,
        },
        {
        title: `Передать Тех. Специалисту`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Ваша жалоба была передана техническому специалисту сервера.<br><br>`+
        ` Ожидайте ответа<br><br>`+
        ` На рассмотрение`,
        prefix: TECH_PREFIX,
        status:true,
        },
            {
	  title: `Передано ЗГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Зам.Главной Администрации —  @Rodrigo Osuna @Martin Alfrenzio  <br><br>"+
        `На рассмотрении. `,
      prefix: PIN_PREFIX,
	  status: true,
    },
	{
	  title: `Передано ГА`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба передана Главной Администрации —  @James_Lanister <br><br>"+
        `На рассмотрении. `,
      prefix: GA_PREFIX,
	  status: true,
	},
        {
        title: `Передать руководителю модерации`,
        content: `[CENTER][SIZE=5][FONT=Georgia]${greeting}, уважаемый ${user.mention} <br><br>` +
        "Ваша жалоба передана - Руководителю модерации @sakaro .[/FONT] [COLOR=rgb(251, 160, 38)][FONT=georgia]<br>" +
        `На рассмотрении. [/FONT][/CENTER][/COLOR][/SIZE]<br><br>`,
        prefix: PIN_PREFIX,
        status: true,
    },
        {
        title:`Передать Спецу и его заму`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Ваша жалоба передана - Специальному Администратору и его заместителю. @Sander_Kligan , @Clarence Crown , @Myron_Capone , @Dmitry Dmitrich[/FONT] [COLOR=rgb(251, 160, 38)][FONT=georgia]<br>"+
        `На рассмотрении. [/FONT][/COLOR][/SIZE][/CENTER]<br><br>`,
        prefix: SPECIAL_PREFIX,
        status: true,
    },
        {
            title: `•~•~•~•~•~•Раздел Жалобы на Администрацию•~•~•~•~•~•`
        },
        {

            title: `Нету нарушение от администратора`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Исходя из выше приложенных доказательств,нарушение со стороны администратора - не имеется.<br>`+
            `[CENTER] Отказано, закрыто. [/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
	},
         {
	  title: `Жалоба от 3 лица`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба создана от третьего лица.[/CENTER]<br><br>" +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `Отказано, закрыто. [/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Отправить на рассмотрение`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба взята на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: PIN_PREFIX,
	  status: true,
	},
         {
            title: `Недостаточно док-вы`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Недостаточно доказательств, которые потверждают нарушение администратора.<br>`+
            ` [CENTER] Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
  {
            title: `Нету док-вы`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br>`+
            `[CENTER] Закрыто`,
 prefix: CLOSE_PREFIX,
            status:false,
        },
         {
            title: `Правила раздела`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Пожалуйста, убедительная просьба, ознакомится с назначением данного раздела в котором Вы создали тему, так как ваш запрос никоим образом не относится к предназначению данного раздела.[/CENTER]`+
		    `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
        {
            title: `Окно бана`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER]Зайдите в игру и сделайте скрин окна с баном после чего, заново напишите жалобу.<br>`+
            `[CENTER] Отказано,закрыто[/CENTER][/FONT][/SIZE]<br><br>`+
            `[SIZE=5][FONT=georgia]Пример: [URL='https://yapx.ru/v/PnPvS'](Кликабельно)[/URL][/FONT][/SIZE]`,
            prefix: CLOSE_PREFIX,
            status:false,
        },
    {
        title: `Отсутствует /time`,
        content: `[SIZE=4][FONT=geogria][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
        `[CENTER]На вашем скриншоте отсутствует /time` +
        `[CENTER]В следующий раз при написании жалобы когда скрите вводите прежде всего /time.<br><br>` +
        `[CENTER] Отказано, закрыто. [/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
	{
	  title: `Жалоба одобрена в сторону игрока`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваша жалоба была одобрена, наказание будет снято в ближайшие 24 часа.<br>С администратором будет проведена беседа.[/CENTER]" ,
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба одобрена в сторону администратора`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Проверив доказательства администратора, было принято решение, что наказание выдано верно.[/CENTER]<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Жалоба не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Жалоба составлена не по форме. Внимательно прочитайте правила составления жалобы, которые закреплены в этом разделе. <br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
        title: `Наказание по ошибке`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "В следствие беседы с администратором, было выяснено, наказание было выдано по ошибке. С администратором будет проведена профилактическая беседа. Наказание будет снято.[/FONT][/SIZE] <br><br>"+
        `[SIZE=5][FONT=georgia]Одобрено, закрыто.[/FONT][/SIZE][/CENTER]`,
        prefix:WATCHED_PREFIX,
        status:false,
    },
    {
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано, закрыто.[/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Прошло более 3 дня`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       " С момента выдачи наказание прошло более 72х часов, жалоба не подлежит рассмотрению.<br><br>"+
        `Отказано, закрыто.[/FONT][/SIZE][/CENTER]<br><br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:` Наказание сократить на половину`,
        content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания на половину.<br><br>" +
        `[SIZE=4][FONT=georgia][CENTER] Закрыто`,
        prefix: WATCHED_PREFIX,
        status: false,
    },
    {
        title: `Администратор будет проинструктирован`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[SIZE=4][FONT=georgia]Благодарим за ваше обращение!  Администратор будет проинструктирован.<br><br>`+
        `Одобрено, закрыто.[/FONT][/SIZE]`,
        prefix: WATCHED_PREFIX,
        status: false,
    },
{
            title: `Администратор получит наказание`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор получит наказание.<br>`+
            `[CENTER] Благодарим за ваше обращение<br>`+
            `[CENTER] Одобрено, закрыто<br><br>`,
              prefix: WATCHED_PREFIX,
        status: false,
    },
    {
        title: `Дублирова темы`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Ваша тема написана снова, ответ дан в прошлой теме<br><br>` +
        `Напоминаю, за дублирование тем ваш форумный аккаунт может быть заблокирован<br><br>`+
        `Отказано, закрыто`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
    {
      title: `ЖБ на техов`,
      content: ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
         `[CENTER] Напишите свою жалобу в раздел — [URL='https://forum.blackrussia.online/index.php?forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D1%82%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D1%85-%D1%81%D0%BF%D0%B5%D1%86%D0%B8%D0%B0%D0%BB%D0%B8%D1%81%D1%82%D0%BE%D0%B2.490/']Жалобы на технических специалистов.(кликабельно)[/URL].<br><br>`+
 `[CENTER] Отказано, закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,

    },
     {
            title: `В тех раздел`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в Техническом Разделе сервера [SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
            `[CENTER] Отказано, закрыто.`,
             prefix: CLOSE_PREFIX,
        status: false,
     },
 {
            title: `Админ ПСЖ`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
  {
            title: `Админ снят`,
            content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Администратор был снят/ушел по собстевенному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
             `[CENTER] Рассмотрено`,
            prefix: WATCHED_PREFIX,
            status:false,
        },
 {
     title: `•~•~•~•~•~•Раздел Куратора Форума[Для рассмотрений]`
 },
        {
            title: `Жалоба составлена не по форме`,
            content:
            `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            "[CENTER] Жалоба подана не по форме.[/CENTER]<br><br>" +
            "[CENTER] Ознакомьтесь с правилами подачи жалоб - [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/']*Кликабельно*[/URL] [/CENTER]<br><br>" +
            `[CENTER] Отказано, закрыто. [/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
        },
 {
	  title: `Жалоба подделана`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Рассмотрев доказательства выше, делаю вердикт. Доказательства подделаны.  Вы будете наказаны за пункт: [/CENTER]<br>" +
        "[CENTER][COLOR=rgb(255, 0, 0)]2.32.[/COLOR] Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[COLOR=rgb(255, 0, 0)] | Ban 7 - 15 дней, Permban [/CENTER] <br><br>" +
		`[CENTER]Отказано,закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
 {
	  title: `Жалоба отказана в сторону игрока`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Рассмотрев доказательства выше, делаю вердикт. На доказательстве отсутствует нарушение игрока<br><br>" +
		`[CENTER]Отказано,закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
        {
	  title: `Жалоба одобрена в сторону игрока`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Спасибо что обратились к нам,  игрок будет наказан в течение 24-х часов. <br><br>" +
		`[CENTER]Одобрено,рассмотрено.[/CENTER][/FONT][/SIZE]`,
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
         {
        title: `Недостаточно доказательств`,
        content:
`[SIZE=4][FONT=geogria][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
 "[CENTER]На ваших доказательствах не видно нарушений, так как их недостаточно" +
  "[CENTER]В следующий раз делайте дольше доказательства.<br><br>" +
        `[CENTER] Отказано, закрыто. [/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
         {
        title: `Отсутствует /time`,
        content:
`[SIZE=4][FONT=geogria][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
 "[CENTER]На вашем скриншоте отсутствует /time" +
  "[CENTER]В следующий раз при записи видео/скриншота вводите прежде всего /time.<br><br>" +
        `[CENTER] Отказано, закрыто. [/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status:false,
    },
        {
            title: `Нету док-вы`,
            content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
            `[CENTER] Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение игрока<br><br>` +
            `[CENTER] Закрыто`,
 prefix: CLOSE_PREFIX,
            status:false,
        },
            {
        title: `•~•~•~•~•~•Обжалования•~•~•~•~•~•`
    },
	{
	  title: `Обжалованию не подлежит`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Данное обжалование рассмотрению не подлежит обжалованию.<br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование не готовы на встречу`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Мы не готовы пойти к вам на встречу на данный момент.<br><br>" +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование снято`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование одобрено и ваше наказание будет полностью снято.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование до минималки`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование было рассмотрено и принято решение о сокращении вашего наказания до минимальных мер.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: WATCHED_PREFIX,
	  status: false,
	},
	{
	  title: `Уже есть мин. наказание`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Вам итак выдано минимальное наказание за нарушение.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	{
	  title: `Обжалование не по форме`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]x[/CENTER]<br><br>` +
		"[CENTER]Обжалование составлено не по форме. Внимательно прочитайте правила составления обжалования, которые закреплены в этом разделе.<br><br>" +
		`[CENTER]Закрыто.[/CENTER][/FONT][/SIZE]`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
          {
	  title: `Отправить на рассмотрение обжалование`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование взято на рассмотрение. Ожидайте, пожалуйста, ответа от администрации и не нужно создавать копии этой темы.[/CENTER]<br><br>" +
		`[CENTER]На рассмотрении.[/CENTER][/FONT][/SIZE]`,
	  prefix: PIN_PREFIX,
	  status: true,
        },
        	{
	  title: `Передано ГА обжалование`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование передана Главной Администрации —  @James_Lanister <br><br>"+
        `На рассмотрении. `,
      prefix: GA_PREFIX,
	  status: true,
	},
        	{
	  title: `Передано CA/ЗСА обжалование`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br><br>` +
		"[CENTER]Ваше обжалование передана Специальной администрации —  @Sander_Kligan , @Clarence Crown , @Dmitry Dmitrich , @Myron_Capone <br><br>"+
        `На рассмотрении. `,
      prefix: GA_PREFIX,
	  status: true,
	},
 {

            title: `•~•~•~•~•~•Скрипт сделан Martin_Alfrenzio•~•~•~•~•~•`
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