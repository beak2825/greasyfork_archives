// ==UserScript==
// @name         Forum Script...
// @namespace    https://forum.blackrussia.online
// @version      3.2
// @description  t
// @author       Griff BS
// @match        https://forum.blackrussia.online/index.php?threads/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @icon         https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437508/Forum%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/437508/Forum%20Script.meta.js
// ==/UserScript==

(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
    const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
    const PIN_PREFIX = 2; // Prefix that will be set when thread pins
    const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
    const WATCHED_PREFIX = 9;
    const CLOSE_PREFIX = 7;
    const TECH_PREFIX = 13;
    const data = await getThreadData(),
        greeting = data.greeting,
        user = data.user;
    const buttons = [
        {
            title: `Приветствие`,
            content:
                `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}![/CENTER]<br>` +
            `[CENTER]      [/CENTER][/FONT][/SIZE]`,
        },
         {

      title: `Форма темы`,
      content: `[SIZE=4][FONT=georgia][CENTER] ${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Пожалуйста, убедительная просьба, заполните данную форму: https://clck.ru/VZe8q и создайте новую тему.[/CENTER]` +
        `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: `Жалобы на адм`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Обратитесь в раздел - Жалобы на администрацию. [/CENTER]<br>` +
        `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: `Правила раздела`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Созданная  вами тема никоим образом не относится к теме данного раздела. [/CENTER]<br>` +
        `[CENTER]Отказано,закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: `Дублирование темы`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Дублирование темы. Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br>` +
        `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
    },
    {
      title: `Недостаточно доказательств`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Недостаточно доказательств на нарушение от данного игрока.<br><br>` +
        `[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
    },
     {
      title: `SK`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 30 минут / Warn (за два и более убийства).<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
          prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `ДМ`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `ДБ`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 30 минут.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {

      title: `NonRP Обман`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan.<br><br>` +
        `[CENTER] Одобрено, закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `MASS DM`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины более трем игрокам | Warn / Ban 7 - 15 дней.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `Оск/Упом родни`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:3.04. Запрещено оскорбление или косвенное упоминание кровных родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `Оскорбление`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `MG`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
    {
      title: `Продажа промо`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 30 минут / Ban 7 - 15 дней.<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
    },
        {
            title: `Упом промо`,
            content:`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>`+
             `[CENTER]Игрок будет наказан по пункту правил:3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах. | Ban 30 дней.<br><br>`+
              `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
        },
    {
	  title: `Нарушений нет`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
		`[CENTER]Нарушений со стороны игрока нет.<br><br>` +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
	},
	{
	  title: `КАПС`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
		`[CENTER]Игрок будет наказан по пункту правил:3.02. Запрещено использование верхнего регистра (CapsLock) при написании любого текста в любом чате | Mute 30 минут.<br><br>` +
		`[CENTER]Одобрено, закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
	},
	{
	  title: `Нету /time`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
		`[CENTER]На ваших доказательствах отсутствует /time.<br><br>` +
		`[CENTER]Отказано, закрыто.[/CENTER][/FONT]`,
         prefix: UNACCEPT_PREFIX,
        status: false,
	},
    {
	  title: `NonRP`,
	  content:
		`[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
		`[CENTER]Игрок будет наказан по пункту правил:2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут.<br><br>` +
		`[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
            status:false,
},
     {
         title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B8%D1%81%D1%82%D1%80%D0%B0%D1%86%D0%B8%D1%8E.193340/`]Правила подачи жалоб на администрацию[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] закрыто.[/S][/FONT][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
       {
        title: `Techinal Specialist`,
        content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        `[CENTER] Ваша жалоба была передана техническому специалисту сервера<br>`+
        `[USER=308876]@Ivan_Dmortyanov[/USER]<br><br>`+
        ` Ожидайте ответа.[/CENTER][/FONT]` ,
        prefix: TECH_PREFIX,
        status:true,
            },
         {
            title: ` Исп сборки`,
            content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            "[CENTER]Игрок будет наказан по пункту правил:2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan<br><br>"+
            `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Задержание без отыгровки`,
            content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             "[CENTER]Игрок будет наказан по пункту правил:6.03. (госс) Запрещено оказывать задержание без Role Play отыгровки | Warn <br><br>"+
              `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Аморал действия`,
            content:  `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            "[CENTER]Игрок будет наказан по пункту правил:2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn<br><br>"+
             `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
 },
    {
        title:`Неуважительное отношение к АДМ`,
        content:`[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            "[CENTER]Игрок будет наказан по пункту правил: 2.54. Запрещено неуважительное обращение, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 120 минут <br><br>"+
                `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
    },
        {
            title: `Исп рабочего т/с в личных целях`,
            content:`[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             "[CENTER]Игрок будет наказан по пункту правил: 2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут<br><br>"+
            `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Выдача себя за АДМ`,
            content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             "[CENTER]Игрок будет наказан по пункту правил: 3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 15 - 30 + ЧС администрации<br><br>"+
             `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title:`Разногласия на почве религии`,
            content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             "[CENTER]Игрок будет наказан по пункту правил:2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 30 минут / Ban 7 - 15 дней<br><br>"+
            `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Найден ФастКоннект`,
            content:`[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
              "[CENTER]Игрок будет наказан по пункту правил:2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan.<br><br>"+
            `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title: `ФастКоннект не найден`,
            content:`[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Проверив логи игрока, могу смело заявить — Фаст Коннект у данного игрок не обнаружен!<br>`+
            `Закрыто`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `Osk ADM`,
            content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             "[CENTER]Игрок будет наказан по пункту правил: 2.32. Запрещено введение в заблуждение, обман, оскорбление, неконструктивная критика администрации на всех ресурсах проекта | Ban 7 - 30 дней / PermBan.<br>"+
            `Пример: подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.<br>`+
              `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
        {
            title: `Fake`,
            content: `[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
               "[CENTER]Игрок будет наказан, за выдачу себя другим игроком<br><br>"+
            `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
          {
        title: `Опра в соц.сети`,
        content:` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
        "Пожалуйста внимательно прочитайте тему «[URL=`https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.193407/`]Правила подачи жалоб на игроков[/URL][SIZE=5][B]»<br><br>"+
        "И обратите своё внимание, на данный пункт правил —[/B][/SIZE][/FONT][/SIZE][SIZE=4][FONT=georgia][QUOTE]3.6. Прикрепление доказательств обязательно.Примечание: загрузка доказательств в соц. сети (ВКонтакте, instagram) запрещается, доказательства должны быть загружены на фото/видео хостинги (YouTube, Япикс, imgur).[/QUOTE][/FONT][QUOTE][/quote][/SIZE][QUOTE][/QUOTE]"+
        `[SIZE=4][FONT=georgia]Отказано,[S] закрыто.[/S][/FONT][/SIZE]`,
        prefix: UNACCEPT_PREFIX,
        status: false,

    },
        {
            title: `Реклама`,
            content:`[CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
             "[CENTER]Игрок будет наказан по пункту правил:2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube каналы и тому подобное | PermBan.<br>"+
            `Пример: подделка доказательств, искажение информации в свою пользу, оскорбление администрации в репорт, обвинение администраторов без доказательств и т.д.<br>`+
              `Одобрено,закрыто[/CENTER][/FONT]`,
            prefix: ACCEPT_PREFIX,
            status:false,
        },
         {
            title: `В тех раздел`,
            content:  ` [CENTER][SIZE=5][FONT=georgia]${greeting}, уважаемый ${user.mention} <br><br>`+
            `[CENTER] Пожалуйста составьте свою жалобу в "Техническом Разделе сервера"[URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-black.488/'][SIZE=4][FONT=georgia](кликабельно)[/URL]<br><br>`+
            `[CENTER] Отказано,закрыто!`,
             prefix: UNACCEPT_PREFIX,
        status: false,
         },
             {
      title: `NonRP cop`,
      content: `[SIZE=4][FONT=georgia][CENTER]${greeting}, уважаемый ${user.mention}[/CENTER]<br>` +
        `[CENTER]Игрок будет наказан по пункту правил:6.04. Запрещено nRP поведение | Warn<br><br>` +
        `[CENTER]Одобрено,закрыто.[/CENTER][/FONT]`,
         prefix: ACCEPT_PREFIX,
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
        addButton(`Тех.Спец`, `techspec`);
        addButton(`Ответы`, `selectAnswer`);
       

        // Поиск информации о теме
        const threadData = getThreadData();

        $(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
        $(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
        $(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
        $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
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