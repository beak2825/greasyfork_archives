// ==UserScript==
// @name         Кураторы/ЗГА 47
// @namespace    https://forum.blackrussia.online/
// @version      5.75
// @description  Специально для BlackRussia || GROZNY by A.Pyatak
// @author       Denis_Yangirov
// @match        https://forum.blackrussia.online/*
// @match        https://forum.blackrussia.online/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @supportURL https://vk.com/id659131672
// @downloadURL https://update.greasyfork.org/scripts/477700/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%D0%97%D0%93%D0%90%2047.user.js
// @updateURL https://update.greasyfork.org/scripts/477700/%D0%9A%D1%83%D1%80%D0%B0%D1%82%D0%BE%D1%80%D1%8B%D0%97%D0%93%D0%90%2047.meta.js
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
            content: `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/CENTER]`,
     },
     {
            title: `_________________________________________________ЗАЯВКИ АДМИНОВ_________________________________________________`,
     },
     {
            title: `Снятие наказания | Одобрено`,
            content:`[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Снял вам наказание.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,

     },
     {
            title: `Снятие наказания | Отказано (баллы)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]У вас недостаточно баллов.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,
     },
        {
            title: `Снятие наказания | Отказано (48 часов)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]С момента выдачи наказания не прошло 48 часов.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,
     },
     {
            title: `Доп баллы | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`,

     },
     {
            title: `Доп баллы | Отказано`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`,
     },
     {
            title: `Повыха | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`,

     },
     {
            title: `Повыха | Отказано (дни)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Вы не отстояли нужное кол-во дней.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,


     },
     {
            title: `Повыха | Отказано (баллы)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]У вас нету нужного кол-ва баллов.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,

     },
     {
            title: `Повыха | Отказано (наказания)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]У вас имеются активные наказания.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,


     },
     {
            title: `Неактив | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`,

     },
     {
            title: `Неактив | Отказано (дни)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]Вы уже использовали все 7 дней неактива.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,


     },
     {
            title: `Неактив | Отказано (баллы)`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br><br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`+
            `[COLOR=rgb(84, 172, 210)][SIZE=4][FONT=times new roman]У вас недостаточно баллов для неактива.[/I][/FONT][/SIZE][/COLOR][/CENTER]`,

     },
     {
            title: `Взаимодействия | Одобрено`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(97, 189, 109)]"одобрено"[/COLOR].[/SIZE][/FONT]<br>`,
     },
     {
            title: `Взаимодействия | Отказано`,
            content: `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)][FONT=times new roman][I]Доброго времени суток, уважаемый[/FONT][/COLOR] *ТЕГНУТЬ* [/SIZE]<br>` +
            `[FONT=times new roman][SIZE=4]Ваша заявка получает статус [COLOR=rgb(209, 72, 65)]"отказано"[/COLOR].[/SIZE][/FONT]<br>`,

     },
     {
            title: `____________________________________________________ОСНОВНОЕ____________________________________________________`,
     },
    //  {
    //         title: `Нет доказательств`,
    //         content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
    //      `[SIZE=4][FONT=georgia]Не увидел доказательств, которые потверждают нарушение администратора.<br>`+
    //      `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>`+
    //      `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
    //         prefix: UNACCEPT_PREFIX,
    //         status:false,
    //  },
    //  {
    //         title: `Мало доказательств`,
    //         content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //         `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые потверждают нарушение администратора.<br><br>`+
    //         `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br><br>`,
    //         prefix: UNACCEPT_PREFIX,
    //         status: false,
    //  },
    //  {
    //         title: `Нарушений нет`,
    //         content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //         `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
    //         `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
    //         prefix: UNACCEPT_PREFIX,
    //         status: false,
	//  },
    //  {
	//   title: `На рассмотрении (док-ва)`,
	//   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
    //     `[SIZE=4][FONT=georgia]Запросил доказательства у администратора.<br>`+
    //     `Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>`+
    //     `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
	//   prefix: PIN_PREFIX,
	//   status: true,
    //  },
    //  {
	//   title: `На рассмотрении`,
	//   content:
	// 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении у руководства сервера.[/CENTER]<br>` +
    //     `[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>` +
	// 	`[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
    //   prefix: PIN_PREFIX,
	//   status: true,
    //  },
     {
	  title: `Прошло 48 часов`,
	  content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br>` +
      `[CENTER]Обратитесь в раздел обжалований: [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2123/']*ТЫК*[/URL]![/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    // {
	//   title: `Предоставлена док-ва`,
	//   content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //   `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
    //   `[CENTER]Наказание выдано верно![/CENTER]<br><br>` +
    //   `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
	//   prefix: UNACCEPT_PREFIX,
	//   status: false,
	// },
    {
	  title: `Администратор наказан 1.0`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Ваша жалоба была одобрена и будет проведена беседа с администратором.<br>` +
        `Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `Администратор наказан 2.0`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Администратор будет строго наказан, так же с ним будет проведена профилактическая беседа.<br>` +
        `Ваше наказание будет снято в течении часа, если оно еще не снято.[/CENTER]<br><br>`+
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: ACCEPT_PREFIX,
	  status: false,
	},
    {
	  title: `От 3-его лица`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба создана от третьего лица.[/CENTER]<br>` +
		`[CENTER]Жалоба не подлежит рассмотрению.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
    {
            title: `Окно бана`,
            content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[SIZE=4][FONT=georgia][CENTER]Зайдите в игру и сделайте скриншот окна с баном, после чего заново напишите жалобу.<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
    },
	// {
	//   title: `Жалоба не по форме`,
	//   content:
	// 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	// 	`[CENTER]Жалоба составлена не по форме.<br>` +
    //     `Внимательно прочитайте правила составления жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*ТЫК*[/URL]<br><br>` +
	// 	`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	//   prefix: CLOSE_PREFIX,
	//   status: false,
	// },
    {
        title: `Опра в соц сети (отказ)`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Пожалуйста внимательно прочитайте тему «[URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/']Правила подачи жалоб на администрацию[/URL][B]»[/B]<br><br>`+
        `И обратите своё внимание, на данный пункт правил:[/SIZE][/CENTER][/FONT]`+
        `[QUOTE][CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]3.6. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER][/QUOTE]`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
            title: `________________________________________________СТОРОННЕЕ_________________________________________________`,
    },
    {
        title: `Не туда написана`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Пожалуйста, убедительная просьба ознакомится с назначением данного раздела в котором Вы создали тему.<br>`+
            `Ваш запрос никоим образом не относится к предназначению данного раздела.<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: UNACCEPT_PREFIX,
        status:false,
    },
    {
        title: `Администратор снят (наказание будет снято)`,
        content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER] Администратор был снят/ушел по собственному желанию.<br>`+
            `[CENTER] Ваше наказание будет снято.<br><br>`+
            `[CENTER][COLOR=rgb(0, 255, 0)]Рассмотрено.[/COLOR][/CENTER]<br>`,
        prefix: WATCHED_PREFIX,
        status:false,
    },
	{
	    title: `Смена IP адресса`,
	    content:
		    `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
		    `[CENTER]Дело в вашем айпи адресе. <br>` +
            `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
            `Ваш аккаунт не в блокировке<br><br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	},
    {
        title: `В раздел ОБЖ`,
        content:
            `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2123/']Обжалование (кликабельно)[/URL]<br>`+
            `[CENTER]Отказано, закрыто[/CENTER][/FONT][/SIZE]<br><br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,
    },

	{
	  title: `Бред в жалобе`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Жалоба бредовая и не содержит в себе смысла.<br>` +
        `Рассмотрению не подлежит.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
	// {
	//   title: `Ошибка от администора (относящиеся к игре)`,
	//   content:
	// 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
	// 	`[CENTER]Администратор совершил ошибку.<br>` +
    //     `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
	// 	`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	//   prefix: ACCEPT_PREFIX,
	//   status: false,
	// },
	{
	  title: `Ошибка от администора (не относящиеся к игре)`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Администратор ошибся, с ним будет проведена профлактическая беседа<br>` +
        `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
            title: `________________________________________________ПЕРЕАДРЕСАЦИИ_________________________________________________`,
    },
    {
	  title: `В раздел жалоб на игроков`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на игроков.<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},
	{
	  title: `В раздел жалоб на лидеров`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
		`[CENTER]Внимательно ознакомившись с вашей жалобой, было решено, что вам нужно обраться в раздел жалоб на лидеров<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: CLOSE_PREFIX,
	  status: false,
	},
    {
      title: `Жалобу на теха`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER] Ошиблись разделом!<br>`+
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
	  title: `Передать ОЗГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора —  [user=439954/]Ilya_Vishnekov [/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: PIN_PREFIX,
	  status: true,
	},
    // {
	//   title: `Передать ГА`,
	//   content:
	// 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Передаю вашу жалобу Главному Администратору —  [user=308750]Anatoliy Pyatak ღ[/user] <br><br>`+
    //     `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
    //   prefix: GA_PREFIX,
	//   status: true,
	// },
    // {
    //     title: `Ростику`,
    //     content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба передана - Специальной Администрации.<br><br>`+
    //     `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
    //     prefix: SPECIAL_PREFIX,
    //     status: true,
    // },
    {
            title: `________________________________________________ОБЖАЛОВАНИЯ_________________________________________________`,
    },
    {
        title: `Отказать (ОБЖ)`,
        content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование рассмотрено и принято решение об отказе в обжаловании.<br><br>[/CENTER]` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Одобрить и сократить наказание (ОБЖ)`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование рассмотрено и принято решение о сокращении вашего наказания.<br><br>[/CENTER]`+
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: ACCEPT_PREFIX,
        status: false,
    },
    {
        title: `Обжалование на рассмотрении`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Ваше обжалование на рассмотрении, ожидайте ответа от руководства сервера<br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: PIN_PREFIX,
        status:true,
    },
    {
        title: `Возмещение ущерба`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Если вы готовы возместить ущерб обманутой стороне свяжитесь с игроком в любым способом.<br>`+
        `Для возврата имущества он должен оформить обжалование.<br><br>`+
        `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Жалобу в адм раздел`,
        content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
      `Обратитесь в раздел жалоб на администрацию, так как с момента выдачи наказания не прошло 48 часов.[/CENTER]<br><br>`+
      `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: ` Обж не по форме `,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `Обжалование составлено не по форме, ознакмьтесь с правилой подачи обжалований и создайте новую тему.[/CENTER]<br><br>`+
      `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Дублирование тем`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `Напоминаю, за дублирование тем я могу заблокировать ваш форумный аккаунт.<br>`+
        `Пожалуйста не создавайте повторяющиеся темы.[/CENTER]<br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/SIZE][/FONT]<br>`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
	  title: `Обж для ГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю ваше обжалование Главному Администратору —  [user=13856]Ricardo Vendettaღ[/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: GA_PREFIX,
	  status: true,
    },
];
    const buttons2 = [
        {
            title: `На рассмотрении`,
            content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба находится на рассмотрении у руководства сервера.[/CENTER]<br>` +
            `[CENTER]Ожидайте ответа в данной теме, не нужно создавать копии этой темы.[/CENTER]<br><br>` +
            `[CENTER][COLOR=rgb(250, 197, 28)]На рассмотрении.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Администратор наказан`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER]Ваша жалоба была одобрена, с администратором будет проведена беседа.<br><br>` +
                `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]<br>`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Ростику`,
            content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба передана - [COLOR=rgb(204, 19, 4)]Специальной Администрации[/COLOR].<br><br>`+
            `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: SPECIAL_PREFIX,
            status: true,
        },
        {
            title: `Команде проекта`,
            content:
            `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Ваша жалоба передана - [COLOR=rgb(246, 207, 0)]Команде Проекта[/COLOR].<br><br>`+
            `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: COMMAND_PREFIX,
            status: true,
        },
        {
            title: `Нарушений нет`,
            content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]Исходя из выше приложенных доказательств нарушений со стороны администратора я не увидел!<br><br>`+
            `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER][/FONT][/SIZE]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Ошибка от администора (относящиеся к игре)`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER]Администратор совершил ошибку.<br>` +
                `Приносим свои извинения за предоставленные неудобства.[/CENTER]<br><br>` +
                `[CENTER][COLOR=rgb(0, 255, 0)]Рассмотрено.[/COLOR][/CENTER]<br>`,
            prefix: WATCHED_PREFIX,
            status: false,
        },
        {
            title: `Мало доказательств`,
            content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые потверждают нарушение администратора.<br><br>`+
                `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Передать ГА`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER]Передаю вашу жалобу Главному Администратору —  [user=13856]Ricardo_Vendettaღ[/user] <br><br>`+
                `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: `Техническому специалисту`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] {{ user.mention }}[/CENTER]<br><br>`+
                `[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br><br>` +
                `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: TECH_PREFIX,
            status: true,
        },
        {
            title: `На рассмотрении (док-ва)`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
                `[SIZE=4][FONT=georgia]Запросил доказательства у администратора.<br>`+
                `Ожидайте ответа в данной теме, не нужно создавать копии этой темы.<br><br>`+
                `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
                prefix: PIN_PREFIX,
            status: true,
        },
        {
            title: `Предоставлена док-ва`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER][SIZE=4][FONT=georgia]Администратор предоставил доказательства.[/CENTER]<br>` +
                `[CENTER]Наказание выдано верно![/CENTER]<br><br>` +
                `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER][/FONT][/SIZE]<br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Нет доказательств`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE]<br><br>`+
                `[SIZE=4][FONT=georgia]Не увидел доказательств, которые потверждают нарушение администратора.<br>`+
                `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>`+
                `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
            prefix: UNACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Жалоба не по форме`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER]Жалоба составлена не по форме.<br>` +
                `Внимательно прочитайте правила составления жалобы - [URL='https://forum.blackrussia.online/index.php?threads/Правила-подачи-жалоб-на-администрацию.3429349/']*ТЫК*[/URL]<br><br>` +
                `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
    ];

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Нет нарушений`, `closed`);
        addButton(`Нет опры`, `netopra`);
        addButton(`Мало опры`, `unaccept`);
        addButton(`Нет формы`, `forma`);
        addButton(`На рассмотрение`, `pin`);
        addButton(`Запрос опры`, `opra`);
        addButton(`Есть опра`, `opra1`);
        addButton(`Беседа`, `accepted`);
        addButton(`Ошибка адм`, `watched`);
        addButton(`Команде проекта`, `teamProject`);
        addButton(`Ростику`, `specialAdmin`);
        addButton(`Толяну`, `mainAdmin`);
        addButton(`Теху`, `techspec`);
        addButton(`Нажми`, `selectAnswer`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => pasteContent2(0, threadData, true));
        $(`button#opra`).click(() => pasteContent2(9, threadData, true));
        $(`button#opra1`).click(() => pasteContent2(10, threadData, true));
        $(`button#accepted`).click(() => pasteContent2(1, threadData, true));
        $(`button#teamProject`).click(() => pasteContent2(3, threadData, true));
        $(`button#unaccept`).click(() => pasteContent2(6, threadData, true));
        $(`button#watched`).click(() => pasteContent2(5, threadData, true));
        $(`button#closed`).click(() => pasteContent2(4, threadData, true));
        $(`button#specialAdmin`).click(() => pasteContent2(2, threadData, true));
        $(`button#mainAdmin`).click(() => pasteContent2(7, threadData, true));;
        $(`button#techspec`).click(() => pasteContent2(8, threadData, true));
        $(`button#netopra`).click(() => pasteContent2(11, threadData, true));
        $(`button#forma`).click(() => pasteContent2(12, threadData, true));


        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Здарова грозный, выбери ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 15) {
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
        if(id === 21) {
            button.hide()
        }
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

    function pasteContent2(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons2[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons2[id].prefix, buttons2[id].status);
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