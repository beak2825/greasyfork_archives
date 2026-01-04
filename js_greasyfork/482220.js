// ==UserScript==
// @name         Pyatak for Cur/Zga/GA | Modded (66)
// @namespace    https://forum.blackrussia.online/
// @version      5.99.7
// @description  Специально для BlackRussia || GROZNY by A.Pyatak
// @author       A.Pyatak | modded by D.Kolobrodov
// @match        https://forum.blackrussia.online/threads/*
// @include      https://forum.blackrussia.online/threads/
// @match        https://forum.blackrussia.online/forums/*
// @include      https://forum.blackrussia.online/forums/
// @match        https://forum.blackrussia.online/forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1*
// @include      https://forum.blackrussia.online/forums/Сервер-№35-grozny.1587/post-thread&inline-mode=1
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @supportURL https://vk.com/id659131672
// @downloadURL https://update.greasyfork.org/scripts/482220/Pyatak%20for%20CurZgaGA%20%7C%20Modded%20%2866%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482220/Pyatak%20for%20CurZgaGA%20%7C%20Modded%20%2866%29.meta.js
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
    //      `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>`+
    //      `Пожалуйста, прикрепите доказательства к жалобе, которые подтверждают нарушение администратора.<br><br>`+
    //      `[COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
    //         prefix: UNACCEPT_PREFIX,
    //         status:false,
    //  },
    //  {
    //         title: `Мало доказательств`,
    //         content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //         `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые подтверждают нарушение администратора.<br><br>`+
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
     /*{
	  title: `Прошло 48 часов`,
	  content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br>` +
      `[CENTER]Обратитесь в раздел обжалований: [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2864/']*ТЫК*[/URL]![/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	  prefix: UNACCEPT_PREFIX,
	  status: false,
	},*/
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
        title: `Соц сети (жб)`,
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
	/*{
	    title: `Смена IP адресса`,
	    content:
		    `[CENTER][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
		    `[CENTER]Дело в вашем айпи адресе. <br>` +
            `Попробуйте сменить его на старый с которого вы играли раньше.<br>Смените интернет соединение или же попробуйте использовать впн.<br>` +
            `Ваш аккаунт не в блокировке<br><br>` +
		    `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
	    prefix: CLOSE_PREFIX,
	    status: false,
	},*/
    {
        title: `В раздел ОБЖ`,
        content:
            `[CENTER][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR]${user.mention}<br><br>`+
            `[CENTER]Пожалуйста обратитесь в раздел - [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2864/']Обжалование (кликабельно)[/URL]<br>`+
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
       `[CENTER] Напишите свою жалобу в раздел — Жалобы на технических специалистов<br><br>`+
       `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
    {
	  title: `Передать ЗГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора —  [user=693910]Lev_Romson[/user]<br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: PIN_PREFIX,
	  status: true,
	},
    {
	  title: `Передать ОЗГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю вашу жалобу Заместителю Главного Администратора —  [user=232369/]Dmitrii_Kolobrodov[/user] <br><br>`+
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
        title: `Смена имени`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
        `[FONT=georgia][SIZE=4]Разблокировал ваш игровой аккаунт.<br>`+
        `У Вас есть 24 часа, чтобы сменить игровой никнейм.[/SIZE][/FONT]<br><br>`+
        `[SIZE=4][FONT=georgia][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]`,
        prefix: PIN_PREFIX,
        status: true,
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
        title: `Обж не по форме`,
        content:  `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>`+
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
        title: `Соц сети (обж)`,
        content:`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}<br><br>Пожалуйста внимательно прочитайте тему «[URL='https://forum.blackrussia.online/threads/Правила-подачи-заявки-на-обжалование-наказания.3429398/']Правила подачи заявки на обжалование наказания[/URL][B]»[/B]<br>И обратите своё внимание, на данный пункт правил:[/FONT][/SIZE][/CENTER]<br>`+
        `[QUOTE]`+
        `[CENTER][SIZE=4][COLOR=rgb(255, 0, 0)]3.3. [/COLOR]Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/SIZE][/CENTER]`+
        `[/QUOTE]<br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
	  title: `Обж для ГА`,
	  content:
		`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Передаю ваше обжалование Главному Администратору —  [user=81429]Damir Galante[/user] <br><br>`+
        `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
      prefix: GA_PREFIX,
	  status: true,
    },
];
    const buttons2 = [
        {
      title: `Отказано, закрыто`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[Color=rgb(255, 0, 0)][CENTER]Отказано, закрыто.[/CENTER][/color]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `Жалоба на рассмотрении (ВАЖНО)`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
    //     `[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
    //   prefix: PINN_PREFIX,
    //   status: true,
    // },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Role Play процесса ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Нонрп поведение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.01[/COLOR]. Запрещено поведение, нарушающее нормы процессов Role Play режима игры [Color=Red]| Jail 30 минут [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от РП`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.02[/COLOR]. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп вождение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.03[/color]. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `NonRP Обман`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/color].[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `Аморал действия`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.08[/color]. Запрещена любая форма аморальных действий сексуального характера в сторону игроков [Color=Red]| Jail 30 минут / Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `Слив склада`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `РК`,
      content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.14[/color]. Запрещен RK (Revenge Kill) — убийство игрока с целью мести, возвращение на место смерти в течение 15-ти минут, а также использование в дальнейшем информации, которая привела Вас к смерти [Color=Red]| Jail 30 минут[/color][/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ТК`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.15[/color]. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
      },
      {
        title: `СК`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.16[/color]. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них [Color=Red]| Jail 60 минут / Warn[/color] ([Color=Orange]за два и более убийства[/color]).[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
      },
      {
        title: `ПГ`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.17[/color]. Запрещен PG (PowerGaming) — присвоение свойств персонажу, не соответствующих реальности, отсутствие страха за свою жизнь [Color=Red]| Jail 30 минут[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
        prefix: ACCEPT_PREFIX,
        status: false,
      },
      {
        title: `MG`,
        content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.18[/color]. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе [Color=Red]| Mute 30 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `ДМ`,
    //   content:
    //   `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //   `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/color].[/CENTER]<br><br>` +
    //   `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    // {
    //   title: `Масс ДМ`,
    //   content:
    //   `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //   `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/color].[/CENTER]<br><br>` +
    //   `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    // {
    //   title: `ДБ`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `Стороннее ПО`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][FONT=georgia][B][I]Нарушитель будет наказан по пункту правил:<br> [Color=Red]2.22[/color]. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками [Color=Red]|  Ban 15 - 30 дней / PermBan[/color] <br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама сторонние ресурсы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.31[/color]. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное [Color=Red]| Ban 7 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.32[/color]. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта [Color=Red]| Ban 7 - 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уяз.правил`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.33[/color]. Запрещено пользоваться уязвимостью правил [Color=Red]| Ban 15 дней[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Уход от наказания`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.34[/color]. Запрещен уход от наказания [Color=Red]| Ban 15 - 30 дней[/color]([Color=Orange]суммируется к общему наказанию дополнительно[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `IC и OCC угрозы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.35[/color]. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате [Color=Red]| Mute 120 минут / Ban 7 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `IC конфликты в OOC`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.36[/color]. Запрещено переносить конфликты из IC в OOC и наоборот [Color=Red]| Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: `Угрозы OOC`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.37[/color]. Запрещены OOC угрозы, в том числе и завуалированные [Color=Red]| Mute 120 минут / Ban 7 дней [/color]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Злоуп наказаниями`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.39[/color]. Злоупотребление нарушениями правил сервера [Color=Red]| Ban 7 - 30 дней [/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск проекта`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.40[/color]. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе [Color=Red]| Mute 300 минут / Ban 30 дней[/color] ([Color=Cyan]Ban выдается по согласованию с главным администратором[/color])[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Продажа промо`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.43[/color]. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций [Color=Red]| Mute 120 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ЕПП Фура`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.47[/color]. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Покупка фам.репы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.48[/color]. Продажа или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи. [Color=Red]| Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/color]<br><br>` +
        `[CENTER][Color=Orange]Примечание[/color]: скрытие информации о продаже репутации семьи приравнивается к [Color=Red]пункту правил 2.24.[/color][/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Помеха РП процессу`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br>[COLOR=rgb(255, 0, 0)]2.04.[/COLOR] Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы. [COLOR=rgb(255, 0, 0)]| Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/COLOR]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нонрп акс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.52[/color]. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера. [Color=Red]| При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `2.53(Названия маты)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.53[/color]. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной наклонности [Color=Red]| Ban 1 день / При повторном нарушении обнуление бизнеса[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Неув обр. к адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.54[/color]. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации [Color=Red]| Mute 180 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
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
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Игровые чаты ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Транслит, язык (Не Русский)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.01[/color]. Общепризнанный язык сервера — русский. Общение в IC чатах во всех Role Play ситуациях обязательно должно проходить исключительно на русском языке [Color=Red]| Устное замечание / Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Обман администрации (вк,форум)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][FONT=Georgia][I]Нарушитель будет наказан по данному пункту правил:<br> [COLOR=rgb(255, 0, 0)][B]2.32. [/B][/COLOR]Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта[COLOR=rgb(255, 0, 0)] [B]| Ban 7 - 15 дней [/B][/COLOR]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      status: false,
    },
    {
      title: `Капс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил: [COLOR=Red]3.02[/COLOR]. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате [COLOR=Red]| Mute 30 минут[/COLOR].<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск в ООС`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.03[/color]. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `Оск/Упом родни`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `Флуд`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.05[/color]. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока [Color=Red]| Mute 30 минут[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Злоуп знаками`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.06[/color]. Запрещено злоупотребление знаков препинания и прочих символов [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `Оскорбление`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
    //   prefix: ACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `Слив СМИ`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.08[/color]. Запрещены любые формы «слива» посредством использования глобальных чатов [Color=Red]| PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(97, 189, 109)][I]Одобрено.[/I][/COLOR][/CENTER]` ,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Угрозы о наказании со стороны адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.09[/color]. Запрещены любые угрозы о наказании игрока со стороны администрации [Color=Red]| Mute 30 минут[/color]. <br><br>` +
        `[CENTER][Color=Lime]Одобрено, закрыто[/I][/B][/CENTER] <br>`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Выдача себя за адм `,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.10[/color]. Запрещена выдача себя за администратора, если таковым не являетесь [Color=Red]| Ban 7 - 15 + ЧС администрации[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Ввод в заблуждение`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.11[/color]. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: `Репорт Капс + Оффтоп + Транслит`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.12[/color]. Запрещено подавать репорт написанный транслитом, с сообщением не по теме (Offtop), с включенным Caps Lock и повторять обращение (если ответ был уже дан ранее) [Color=Red]| Report Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
     {
      title: `Музыка в войс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.14[/color]. Запрещено включать музыку в Voice Chat [Color=Red]| Mute 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск/Упом род в войс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.15[/color]. Запрещено оскорблять игроков или родных в Voice Chat [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Шум в войс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.16[/color]. Запрещено создавать посторонние шумы или звуки [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама в VOICE`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.17[/color]. Запрещена реклама в Voice Chat не связанная с игровым процессом [Color=Red]| Ban 7 - 15 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Религиозное и политическая пропоганда`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.18[/color]. Запрещено политическое и религиозное пропагандирование [Color=Red]| Mute 120 минут / Ban 10 дней[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Реклама промо`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.21[/color]. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. [Color=Red]| Ban 30 дней[/color].[/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Торговля на тт госс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.22[/color]. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) [Color=Red]| Mute 30 минут[/color][/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Нарушение правил казино╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
         title: `Продажа должности`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [B][COLOR=rgb(255, 0, 0)]2.01.[/COLOR] Владельцу и менеджерам казино и ночного клуба [COLOR=rgb(255, 0, 0)][U]запрещено[/U][/COLOR] принимать работников за денежные средства на должность охранника, крупье или механика.[COLOR=rgb(255, 0, 0)] | Ban 3 - 5 дней.[/COLOR][/B]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Положение об игровых аккаунтах ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Мультиаккаунт (3+)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.04[/color]. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере [Color=Red]| PermBan[/color].<br><br>` +
        `[Color=Orange]Примечание[/color]: блокировке подлежат все аккаунты созданные после третьего твинка.[/CENTER]<br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Фейк аккаунт`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]4.10[/color]. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию [Color=Red]| Устное замечание + смена игрового никнейма / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    // {
    //  title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Передача жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    // },
    // {
    //   title: `Техническому специалисту`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
    //     `[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
    //   prefix: TEXY_PREFIX,
    //   status: true,
    // },
    // {
    //   title: `Главному куратору Форума`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
    //     `[CENTER]Ваша жалоба была передана на рассмотрение Главному Куратору Форума.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
    //   prefix: NARASSMOTRENIIBIO_PREFIX,
    //   status: true,
    // },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Переадресация жалобы ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Жалобу на сотрудника`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись с разделом "Жалобы на сотрудника".<br>Обратитесь в раздел жалоб на сотрудников.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
      title: `Жалобу на лидера`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись с разделом "Жалобы на лидеров".<br>Обратитесь в раздел жалоб на лидеров.[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: CLOSE_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила Государственных Структур╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Н/П/Р/О (Объявы)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]4.01[/color]. Запрещено редактирование объявлений, не соответствующих ПРО [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Н/П/П/Э (Эфиры)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]4.02[/color]. Запрещено проведение эфиров, не соответствующих Role Play правилам и логике [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Розыск без причины(ГИБДД/МВД/ФСБ)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по пунтку правил:<br> [Color=Red]6.02[/color]. Запрещено выдавать розыск без Role Play причины [Color=Red]| Warn[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Редактирование в личных целях`,
      content: `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
       `[CENTER]Нарушитель будет наказан по пункту правил:<br> [Color=Red]4.04.[/color] Запрещено редактировать поданные объявления в личных целях заменяя текст объявления на несоответствующий отправленному игроком [Color=Red]|  Ban 7 дней + ЧС организации[/color][CENTER]<br><br>` +
       `[CENTER][COLOR=rgb(97, 189, 109)]Одобрено.[/COLOR][/CENTER]`,
       prefix: ACCEPT_PREFIX,
       status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Правила ОПГ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    {
      title: `Нарушение правил В/Ч`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по пунтку правил: За нарушение правил нападения на [Color=Orange]Войсковую Часть[/color] выдаётся предупреждение [Color=Red]| Jail 30 минут (NonRP нападение) / Warn (Для сотрудников ОПГ)[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нападение на В/Ч через стену`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по пунтку правил: Нападение на [Color=Orange]военную часть[/color] разрешено только через блокпост КПП с последовательностью взлома [Color=Red]| Warn NonRP В/Ч[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Похищение/Ограбления нарушение правил`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан за Нонрп Ограбление\Похищениее в соответствии с этими правилами [URL='https://forum.blackrussia.online/threads/bryansk-Правила-ограблений-и-похищений.6714689/']Кликабельно[/URL][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
     title: `╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴Отсутствие пунка жалоб╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴`,
    },
    // {
    //   title: `Нарушений не найдено`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br><br>` +
    //     `[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]`,
    //   prefix: UNACCEPT_PREFIX,
    //   status: false,
    // },
    // {
    //   title: `Недостаточно доказательств`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Недостаточно доказательств на нарушение от данного игрока. Доказательства должны быть предоставлены в хорошем качестве и с полным процессом сделки или нарушения от какого-либо игрока.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
    //   prefix: UNACCEPT_PREFIX,
    //   status: false,
    // },
    // {
    //   title: `Дублирование темы`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Дублироване темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
    //   prefix: UNACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `В жалобы на адм`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Жалобы на администрацию[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `В обжалования`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Вы ошиблись разделом. Обратитесь в раздел [Color=Red]Обжалование наказаний[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Форма темы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба составлена не по форме. Убедительная просьба ознакомиться [Color=Red]с правилами подачи жалоб на игроков[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `Нет /time`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
    //   prefix: UNACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `Требуются TimeCode`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба отказана, т.к в ней нету таймкодов.<br>Если видео длится больше 3-ех минут Вы должны указать таймкоды нарушений.[/CENTER]<br><br>` +
        `[Color=Red][CENTER]Отказано[/CENTER][/color]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Более 72 часов`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]С момента нарушения игроком правил серверов прошло более 72 часов[/CENTER]<br>` +
        `[CENTER][B][I][FONT=georgia]Рассмотрению не подлежит.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
      {
      title: `Доква через запрет соц сети`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]3.6. Прикрепление доказательств обязательно. <br>` +
        `[Color=Orange]Примечание[/color]: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нету условий сделки`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В данных доказательствах отсутствуют условия сделки[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нужен фрапс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В таких случаях нужнен фрапс[/CENTER]<br><br>`+
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нужна промотка чата`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В таких случаях нужна промотка чата.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    // {
    //   title: `Неполный фрапс`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]<br><br>` +
    //     `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
    //   prefix: UNACCEPT_PREFIX,
    //   status: false,
    // },
    // {
    //   title: `Не работают доква`,
    //   content:
    //     `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
    //     `[CENTER]Не работают доказательства[/CENTER]<br><br>` +
		// `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
    //   prefix: UNACCEPT_PREFIX,
    //   status: false,
    // },
    {
      title: `Доква отредактированы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]Ваши доказательства отредактированы.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `От 3-го лица`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]Жалобы от 3-их лиц не принимаются[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Ответный ДМ`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]В случае ответного ДМ нужен видиозапись. Пересоздайте тему и прекрепите видиозапись.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Фотохостинги`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Доказательства должны быть загружены на Yapx/Imgur/YouTube.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
];
    const buttons3 = [
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
                `[CENTER][SIZE=4][FONT=georgia]Недостаточно доказательств, которые подтверждают нарушение администратора.<br><br>`+
                `[COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]<br><br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Передать ГА`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
                `[CENTER]Передаю вашу жалобу Главному Администратору —  [user=81429]Damir Galante[/user] <br><br>`+
                `[COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/CENTER]<br>`,
            prefix: GA_PREFIX,
            status: true,
        },
        {
            title: `Техническому специалисту`,
            content:
                `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
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
                `[SIZE=4][FONT=georgia]Не увидел доказательств, которые подтверждают нарушение администратора.<br>`+
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
            title: `Прошло 48 часов`,
            content: 	`[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]${greeting}, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
            `[CENTER][SIZE=4][FONT=georgia]С момента выдачи наказания прошло более 48 часов.[/CENTER]<br>` +
            `[CENTER]Обратитесь в раздел обжалований: [URL='https://forum.blackrussia.online/forums/Обжалование-наказаний.2864/']*ТЫК*[/URL]![/CENTER]<br><br>` +
            `[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]<br>`,
            prefix: UNACCEPT_PREFIX,
            status: false,
        },
    ];
    const buttons0 = [
    {
      title: `Жалоба на рассмотрении (ВАЖНО)`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба взята на рассмотрение.<br>Просьба ожидать ответа и не создавать дубликаты данной темы.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Главному куратору Форума`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба была передана на рассмотрение Главному Куратору Форума.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
      prefix: PIN_PREFIX,
      status: true,
    },
    {
      title: `Техническому специалисту`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/CENTER]<br><br>`+
        `[CENTER]Ваша жалоба была передана на рассмотрение техническому специалисту.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(251, 160, 38)]На рассмотрении.[/COLOR][/FONT][/SIZE][/CENTER]<br>`,
      prefix: TECH_PREFIX,
      status: true,
    },
    {
      title: `NonRP Обман`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.05[/color]. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики [Color=Red]| PermBan[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оск/Упом родни`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.04[/color]. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) [Color=Red]| Mute 120 минут / Ban 7 - 15 дней[/color].[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Слив склада`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.09[/color]. Запрещено сливать склад фракции / семьи путем взятия большого количестве ресурсов, или же брать больше, чем разрешили на самом деле [Color=Red]| Ban 15 - 30 дней / PermBan[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ДМ`,
      content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.19[/color]. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины [Color=Red]| Jail 60 минут[/color].[/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Масс ДМ`,
      content:
      `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
      `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.20[/color]. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более [Color=Red]| Warn / Ban 3 - 7 дней[/color].[/CENTER]<br><br>` +
      `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `ДБ`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]2.13[/color]. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта [Color=Red]| Jail 60 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нарушений не найдено`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушений со стороны данного игрока не было найдено.[/CENTER]<br><br>` +
        `[Color=Red][CENTER]Отказано, закрыто.[/CENTER][/color]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Недостаточно доказательств`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Недостаточно доказательств на нарушение от данного игрока.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Дублирование темы`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Дублироване темы. Если вы дальше будете заниматься данной деятельностью (дублированием тем), то ваш форумный аккаунт будет заблокирован на 3 дня и более.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Нет /time`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]На ваших доказательствах отсутствует /time.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Неполный фрапс`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER][B][I][FONT=georgia]Фрапс обрывается. Загрузите полный фрапс на ютуб.[/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(255, 0, 0)]Отказано.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Не работают доква`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Не работают доказательства[/CENTER]<br><br>` +
		`[CENTER][COLOR=rgb(255, 0, 0)]Закрыто.[/COLOR][/CENTER]`,
      prefix: UNACCEPT_PREFIX,
      status: false,
    },
    {
      title: `Оскорбление`,
      content:
        `[CENTER][SIZE=4][FONT=georgia][COLOR=rgb(255, 0, 0)]Доброго времени суток, уважаемый[/COLOR] ${user.mention}[/FONT][/SIZE][/CENTER]<br><br>`+
        `[CENTER]Нарушитель будет наказан по данному пункту правил:<br> [Color=Red]3.07[/color]. Запрещены совершенно любые оскорбления или действия, порочащие честь и достоинства, несущие в себе подтекст сексуального характера вне зависимости от чата [Color=Red]| Mute 30 минут[/color][/CENTER]<br><br>` +
        `[CENTER][COLOR=rgb(0, 255, 0)]Одобрено.[/COLOR][/CENTER]`,
      prefix: ACCEPT_PREFIX,
        status: false,
    },
  ]

    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Нет нарушений`, `closed`)
        addButton(`Нет опры`, `netopra`);
        addButton(`Мало опры`, `unaccept`);
        addButton(`Нет формы`, `forma`);
        addButton(`На рассмотрение`, `pin`);
        addButton(`Запрос опры`, `zapros`);
        addButton(`Есть опра`, `est_opra`);
        addButton(`Беседа`, `accepted`);
        addButton(`Ошибка адм`, `watched`);
        addButton(`Команде проекта`, `teamProject`);
        addButton(`Ростику`, `specialAdmin`);
        addButton(`Дамирычу`, `mainAdmin`);
        addButton(`Теху`, `techspec`);
        addButton(`IP-адрес`, `ip-adress`);
        addButton(`48 часов`, `48-hours`);
        addButton(`АДМИН-ОТВЕТЫ`, `admin-otvet`);
        addButton(`---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------`, '');
        addButton(`На рассмотрение`, `pinn`);
        addButton(`ГКФу`, `gkf`);
        addButton(`Теху`, `texy`);
        addButton(`NonRP Обман`, `obman`);
        addButton(`Оск/Упом родни`, `rodn`);
        addButton(`Слив склада`, `slivskl`);
        addButton(`ДМ`, `dm`);
        addButton(`ДБ`, `db`); // после масс дм
        addButton(`Масс ДМ`, `mdm`);
        addButton(`Оскорбление`, `osk`); //последнее
        addButton(`Нарушений нет`, `otkazano`);
        addButton(`Мало док-вы`, `malo`);
        addButton(`Дубликат`, `dublikat`);
        addButton(`Нет /time`, `time`);
        addButton(`Неполный фрапс`, `fraps`);
        addButton(`Не работают док-ва`, `ne_rabochaya_opra`);
        addButton(`ИГРОК-ОТВЕТЫ`, `player-otvet`);
        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => pasteContent3(0, threadData, true));
        $(`button#zapros`).click(() => pasteContent3(9, threadData, true));
        $(`button#est_opra`).click(() => pasteContent3(10, threadData, true));
        $(`button#accepted`).click(() => pasteContent3(1, threadData, true));
        $(`button#teamProject`).click(() => pasteContent3(3, threadData, true));
        $(`button#unaccept`).click(() => pasteContent3(6, threadData, true));
        $(`button#watched`).click(() => pasteContent3(5, threadData, true));
        $(`button#closed`).click(() => pasteContent3(4, threadData, true));
        $(`button#specialAdmin`).click(() => pasteContent3(2, threadData, true));
        $(`button#mainAdmin`).click(() => pasteContent3(7, threadData, true));;
        $(`button#techspec`).click(() => pasteContent3(8, threadData, true));
        $(`button#netopra`).click(() => pasteContent3(11, threadData, true));
        $(`button#forma`).click(() => pasteContent3(12, threadData, true));
        $(`button#ip-adress`).click(() => pasteContent3(13, threadData, true));
        $(`button#48-hours`).click(() => pasteContent3(14, threadData, true));


        $(`button#pinn`).click(() => pasteContent0(0, threadData, true));
        $(`button#gkf`).click(() => pasteContent0(1, threadData, true));
        $(`button#texy`).click(() => pasteContent0(2, threadData, true));
        $(`button#obman`).click(() => pasteContent0(3, threadData, true));
        $(`button#rodn`).click(() => pasteContent0(4, threadData, true));
        $(`button#slivskl`).click(() => pasteContent0(5, threadData, true));
        $(`button#dm`).click(() => pasteContent0(6, threadData, true));
        $(`button#mdm`).click(() => pasteContent0(7, threadData, true));
        $(`button#db`).click(() => pasteContent0(8, threadData, true));
        $(`button#otkazano`).click(() => pasteContent0(9, threadData, true));
        $(`button#malo`).click(() => pasteContent0(10, threadData, true));
        $(`button#dublikat`).click(() => pasteContent0(11, threadData, true));
        $(`button#time`).click(() => pasteContent0(12, threadData, true));
        $(`button#fraps`).click(() => pasteContent0(13, threadData, true));
        $(`button#ne_rabochaya_opra`).click(() => pasteContent0(14, threadData, true));
        $(`button#osk`).click(() => pasteContent0(15, threadData, true));


        $(`button#admin-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Здарова грозный, выбери ответ:`);
            buttons.forEach((btn, id) => {
                if (id > 15) {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent(id, threadData, false));
                }
            });
        });

        $(`button#player-otvet`).click(() => {
            XF.alert(buttonsMarkup(buttons2), null, `Здарова грозный, выбери ответ:`);
            buttons2.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContent2(id, threadData, false));
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

    function pasteContent3(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons3[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons3[id].prefix, buttons3[id].status);
            $(`.button--icon.button--icon--reply.rippleButton`).trigger(`click`);
        }
    }

    function pasteContent0(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons0[id].content);
        if ($(`.fr-element.fr-view p`).text() === ``) $(`.fr-element.fr-view p`).empty();

        $(`span.fr-placeholder`).empty();
        $(`div.fr-element.fr-view p`).append(template(data));
        $(`a.overlay-titleCloser`).trigger(`click`);

        if (send == true) {
            editThreadData(buttons0[id].prefix, buttons0[id].status);
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