// ==UserScript==
// @name         Forum Black Russia
// @namespace    https://forum.blackrussia.online
// @version      1.0.5.17
// @description  АААа
// @author       SPECTER
// @match       *://*.forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/index.php?threads/
// @grant        none
// @license    MIT
// @icon https://icons.iconarchive.com/icons/aha-soft/iron-man/48/Ironman-Mask-3-Old-icon.png
// @downloadURL https://update.greasyfork.org/scripts/530910/Forum%20Black%20Russia.user.js
// @updateURL https://update.greasyfork.org/scripts/530910/Forum%20Black%20Russia.meta.js
// ==/UserScript==


(async function () {
    `use strict`;
    const UNACCEPT_PREFIX = 4; // Prefix that will be set when thread closes
  const ACCEPT_PREFIX = 8; // Prefix that will be set when thread accepted
  const PIN_PREFIX = 2; // Prefix that will be set when thread pins
  const COMMAND_PREFIX = 10; // Prefix that will be set when thread send to project team
  const WATCHED_PREFIX = 9;
  const CLOSE_PREFIX = 7;
  const SPECADM_PREFIX = 11;
  const DECIDED_PREFIX = 6;
  const MAINADM_PREFIX = 12;
  const TECHADM_PREFIX = 13;
  const CHECKED_PREFIX = 9
    const data = await getThreadData(),
          greeting = data.greeting,
          user = data.user;
    const buttons = [

    {
         title: `Ку`,
    content: `[SIZE=4][FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
    `[color=lightgreen] Рассмотрено.[/color][/FONT] [/SIZE]`,
    prefix:WATCHED_PREFIX,
    status: false,
    },
        {
        title: `Обман PIN`,
        content: `[FONT=Verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Ваш аккаунт будет разблокирован для выдачи компенсации пострадавшей стороне. Весь процесс нужно фиксировать на запись экрана с (/time), у вас есть 24 часа на ответ после совершения сделки с пострадавшим.<br>`+
        `Напомню, попытки перекинуть имущество на другие аккаунты будет наказываться и вы можете лишиться права обжалования.<br><br>`+
        `[color=orange] На рассмотрении.`,
        prefix: PIN_PREFIX,
        status: true,
    },

    {
        title: `Pin`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Ваше обращение находится на рассмотрении администрации сервера.\n`+
        `Просим вас не создавать обжалования с подобным содержанием, ответ будет дан в этой теме как только это будет возможно. Благодарим вас за ожидание.<br><br>`+
        `[Color=orange] На рассмотрении.`,
        prefix: PIN_PREFIX,
        status: true,
    },
        {
        title: `Обман`,
        content: `[FONT=Verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Данное наказание можно обжаловать только при условии выдачи компенсации пострадавшей стороне. Для этого вы должны связаться с обманутой стороной, обсудить условия.<br>`+
        `[U]Примечание:[/U] обманутый игрок должен подтвердить ваши слова в игре.<br>`+
        `[color=red] Любые попытки обмана администрации, караются блокировкой форумного аккаунта.[/color]<br><br>`+
        `[Color=red] Закрыто.`,
        prefix: CLOSE_PREFIX,
        Status:false,
    },

    {
        title: `Не подлежит`,
        content: `[Font=verdana][Size=4]Здравствуйте.<br><br>`+
        `[FONT=verdana]К сожалению, данное наказание не подлежит обжалованию.[/FONT]<br>`+
        `[COLOR=rgb(255, 0, 0)][FONT=verdana]Нарушения, по которым заявка на обжалование не рассматривается:[/FONT][/COLOR]<br>`+
        `[FONT=verdana][QUOTE]4.1. различные формы "слива";<br>
        4.2. продажа игровой валюты;<br>
        4.3. махинации;<br>
        4.4. целенаправленный багоюз;<br>
        4.5. продажа, передача аккаунта;<br>
        4.6. сокрытие ошибок, багов системы;<br>
        4.7. использование стороннего программного обеспечения;<br>
        4.8. распространение конфиденциальной информации;<br>
        4.9. обман администрации.<br><br>[/QUOTE]`+
        `Советую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/'] данной темой *Кликабельно*[/URL].[/FONT][/SIZE]<br>`+
        `[FONT=verdana][SIZE=4][COLOR=red]Закрыто. [/COLOR][/SIZE][/FONT]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Отказ`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `В обжалование вашего наказания — [color=red]отказано.[/color] Мы не готовы пойти к вам на встречу.<br>`+
        `Пожалуйста, помните;<br>
        • Каждая заявка на обжалование рассматривается индивидуально. <br>
        • Оформленная заявка на обжалование не означает гарантированного одобрения со стороны руководства сервера.<br><br>`+
        `[color=red]Закрыто.[/color]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:`Обж ранее`,
        content:`[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Вы уже получили шанс на обжалование вашего наказания, срок наказания был снижен ранее.<br><br>`+
        `[color=red] Закрыто.[/color]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:`Дубликат`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Ответ на свое обжалование вы получили в предыдущей теме.<br>
        Напоминаем, при 3 дублированиях – форумный аккаунт будет заблокирован.<br><br>` +
        `[color=red]Закрыто.[/color]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:`Верно`,
        content:`[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Наказание было выдано верно.<br>`+
        `В обжалование вашего наказания — [color=red]отказано.[/color] Мы не готовы пойти к вам на встречу.<br>`+
        `Пожалуйста, помните;<br>
        • Каждая заявка на обжалование рассматривается индивидуально. <br>
        • Оформленная заявка на обжалование не означает гарантированного одобрения со стороны руководства сервера.<br><br>`+
        `[color=red]Закрыто.[/color]`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Тех раздел`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Обратитесь в технический раздел сервера — [URL='https://forum.blackrussia.online/index.php?forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-spb.1095/']*Кликабельно*[/URL]<br>`+
        `[color=red]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Тех раздел ЖБ`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Обратитесь в раздел «Жалобы на Технических Специалистов» — [URL='https://forum.blackrussia.online/index.php?forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9624-spb.1205/']*Кликабельно*[/URL]<br>`+
        `[color=red]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Ошб сервера`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Обратитесь в раздел «Обжалование наказаний» своего сервера. На текущий момент, обжалование составлено на сервере ANAPA [30].<br>`+
        `[color=red]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `3 Лицо`,
        content:`[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Ваше обращение составлено от третьего лица. Рассмотрению данное обжалование не подлежит.<br>`+
        `Советую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/'] данной темой *Кликабельно*[/URL].[/FONT][/SIZE]<br>`+
        `[color=red]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `окно бана`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Зайдите на сервер и прикрепите скриншот окна блокировки.<br>`+
        `[color=red]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Форма`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Ваше обращение составлено не по форме.<br>`+
        `Создайте новую тему и придерживайтесь форме подачи обжалования.<br>`+
        `[CODE] <br>
         1. Ваш Nick_Name:<br>
        2. Nick_Name администратора:<br>
        3. Дата выдачи/получения наказания:<br>
        4. Суть заявки:<br>
        5. Доказательство:[/CODE]<br><br>`+
        `[color=red] Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Соц сети`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        ` Доказательства с социальных сетей не принимаются. Вам необходимо загрузить доказательства на imgur.com, далее создать новую тему.<br>`+
        `Советую ознакомиться с [URL='https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B7%D0%B0%D1%8F%D0%B2%D0%BA%D0%B8-%D0%BD%D0%B0-%D0%BE%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5-%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D1%8F.1884562/'] данной темой *Кликабельно*[/URL].[/FONT][/SIZE]<br>`+
        `[color=red]Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title:  `нет док-вы`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Вы не предоставили скриншот выдачи наказания, от администратора. Обращение не подлежит рассмотрению.<br>`+
        `[color=red] Закрыто.`,
        prefix: CLOSE_PREFIX,
        status: false,
    },
    {
        title: `Док-ва не робят`,
        content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
        `Предоставленная вами ссылка не работает/открывается или вовсе не действительна. Создайте новую тему и убедитесь что ссылка работает корректно.<br>`+
        `[color=red]Закрыто.`,
        prefix:CLOSE_PREFIX,
        status: false,
        },
        {
            title: `Обж мин`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Ваше обжалование — [color=lightgreen] одобрено.[/color] Наказание будет снижено до мининимальных мер.<br>`+
            `Рекомендую прочитать[URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта *Кликабельно*[/URL], дабы не повторять ошибки в будущем.`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Мин уже есть`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Вам и так выдано минимальное наказание за совершенное вами нарушение.<br>`+
            `В обжалование вашего наказания — [color=red]отказано.[/color]`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `обж фулл`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Администрация сервера готова пойти к вам на встречу. Ваше наказание будет полностью снято.<br>`+
            `Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта *Кликабельно*[/URL], дабы не повторять ошибки в будущем.<br><br>`+
            `[color=lightgreen]Одобрено.`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `обж 7 дней`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 7 дней блокировки аккаунта.<br>`+
            `Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта *Кликабельно*[/URL], дабы не повторять ошибки в будущем.<br><br>`+
            `[color=lightgreen]Одобрено.`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `обж 15`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 15 дней блокировки аккаунта.<br>`+
            `Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта *Кликабельно*[/URL], дабы не повторять ошибки в будущем.<br><br>`+
            `[color=lightgreen]Одобрено.`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `обж 30`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Администрация сервера готова пойти к вам на встречу. Ваше наказание будет снижено до 30 дней блокировки аккаунта.<br>`+
            `Рекомендую прочитать [URL='https://forum.blackrussia.online/index.php?threads/%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D0%BF%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D1%81%D0%B5%D1%80%D0%B2%D0%B5%D1%80%D0%BE%D0%B2.312571/']регламент проекта *Кликабельно*[/URL], дабы не повторять ошибки в будущем.<br><br>`+
            `[color=lightgreen]Одобрено.`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Ошибка`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Ваше наказание было выдано по ошибке администратора, оно будет снято.<br>`+
            `С администратором будет проведена профилактическая беседа. Приношу извинение за доставленные неудобства.<br>`+
            `[color=lightgreen] Одобрено.`,
            prefix: ACCEPT_PREFIX,
            status: false,
        },
        {
            title: `Глав адм`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Ваше обращение было передано [color=red]Главному Администратору.[/color]<br>`+
            `Иногда решение/рассмотрение подобных обращений требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.<br><br>`+
            `[color=orange] На рассмотрении.`,
            prefix: MAINADM_PREFIX,
            status:true,
        },
        {
            title: `Спец адм`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Ваше обращение было передано [color=red]Cпециальной администрации проекта.[/color]<br>`+
            `Иногда решение/рассмотрение подобных обращений требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.<br><br>`+
            `[color=orange] На рассмотрении.`,
            prefix: SPECADM_PREFIX,
            status:true,
        },
        {
            title: `КП`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Ваше обжалование было передано [color=yellow] Команде Проекта.[/color]<br>`+
            `Иногда решение/рассмотрение подобных обжалований требует больше времени чем 2 дня. Настоятельно рекомендуем вам не создавать темы с подобным содержанием. Ответ будет дан в данной теме, как только это будет возможно.<br><br>`+
            `[color=orange] На рассмотрении.`,
            prefix: COMMAND_PREFIX,
            status: true,
        },
        {
            title: `Ошибка разделом`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            `Ваше обращение никаким образом не относится к предназначению данного раздела.<br><br>`+
            `Полезные ссылки (все кликабельны); <br>
            [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1401/']Жалобы на лидеров.[/URL]<br>
            [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1402/']Жалобы на игроков.[/URL]<br>
            [URL='https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-anapa.1416/']Технический раздел сервера.[/URL]<br>
            [URL='https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%BB%D0%B8%D0%B4%D0%B5%D1%80%D0%BE%D0%B2.1400/'] Жалобы на Администрацию.[/URL]<br><br>`+
            `[color=red]Закрыто.`,
            prefix: CLOSE_PREFIX,
            status: false,
        },
        {
            title: `ППВ`,
            content: `[FONT=verdana][SIZE=4]Здравствуйте.<br><br>`+
            ` Отпишитесь в данной теме, и предоставьте данную информацию;<br>`+
            `— Город регистрации аккаунта:<br>
             — Дата регистрации аккаунта:<br>
             — Сколько донатили на свой аккаунт?<br>
             — Провайдер интернета при регистрации аккаунта:<br>
             — Город в котором проживаете на текущий момент:<br><br>`+
             `[color=orange] На рассмотрении.`,
             prefix: PIN_PREFIX,
             status: true,
        },
        {
            title: `Роспись`,
            content: `[SIZE=4] [FONT=verdana] [color=#447294]S[/color][color=#5d8bac]p[/color][color=#76a3c3]e[/color][color=#8fbcdb]c[/color][color=#b1c5d1]t[/color][color=#d2cdc6]e[/color][color=#f4d6bc]r[/color]`,

        },

    ];


    $(document).ready(() => {
        // Загрузка скрипта для обработки шаблонов
        $(`body`).append(`<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>`);

        // Добавление кнопок при загрузке страницы
        addButton(`Ans`, `selectAnswer`);
        addButton(`Pin`, `pin`);
        addButton(`Approved`, `accepted`);
        addButton(`КП`, `teamProject`);
        addButton(`Close`, `closed`);
        addButton (`Spec.A`, `specialAdmin`);
        addButton (`Checked`, `checked`)




        // Поиск информации о теме
        const threadData = getThreadData();

       $(`button#unaccept`).click(() => editThreadData(UNACCEPT_PREFIX, false));
$(`button#pin`).click(() => editThreadData(PIN_PREFIX, true));
$(`button#accepted`).click(() => editThreadData(ACCEPT_PREFIX, false));
$(`button#teamProject`).click(() => editThreadData(COMMAND_PREFIX, true));
$(`button#specadm`).click(() => editThreadData(SPECADM_PREFIX, true));
$(`button#mainadm`).click(() => editThreadData(MAINADM_PREFIX, true));
$(`button#watched`).click(() => editThreadData(WATCHED_PREFIX, false));
$(`button#decided`).click(() => editThreadData(DECIDED_PREFIX, false));
$(`button#closed`).click(() => editThreadData(CLOSE_PREFIX, false));
$(`button#techspec`).click(() => editThreadData(TECHADM_PREFIX, true));
        $(`button#specialAdmin`).click(() => editThreadData(SPECADM_PREFIX, true));
        $(`button#checked`).click(() => editThreadData(CHECKED_PREFIX, false));
        $(`button#statusTheme`).click(() => {
            const threadTitle = $(`.p-title-value`)[0].lastChild.textContent;

            let status = threadData.theme_status
            if ( status == false) status = 1
            else status = 0

            fetch(`${document.URL}edit`, {
                method: `POST`,
                body: getFormData({
                    title: threadTitle,
                    discussion_open: status,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: `json`,
                }),
            }).then(() => location.reload());
        });

        $(`button#selectAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, `Select an answer:`);
            buttons.forEach((btn, id) => {
                if (id >1) {
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

    $('#input').focus(function() {
        $(this).setCursorPosition(4);
      });

    async function getThreadData() {
        const authorID = $(`a.username`)[0].attributes[`data-user-id`].nodeValue;
        const authorName = $(`a.username`).html();
        const theme_status = $(`a.discussion_open`).html();
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
        theme_status,
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
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/sak0v/ForumScript/blob/codespace-sak0v-shiny-space-waddle-6j4wgwqjw6phw67/ForumObz.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://forum.blackrussia.online/threads/%D0%9E%D0%B1%D0%B6%D0%B0%D0%BB%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5.6178332/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blackrussia.online
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();