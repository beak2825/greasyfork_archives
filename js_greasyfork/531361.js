// ==UserScript==
// @name         Скрипт для Оливера
// @namespace    https://forum.blackrussia.online
// @version      13.0
// @description  Версия для сервера CHOCO с ответами от Оливера, RP биографиями и полным списком жалоб с указанием пунктов
// @author       Arab_Kalashnikov
// @match        https://forum.blackrussia.online/*
// @include      https://forum.blackrussia.online/
// @grant        none
// @license      MIT
// @icon         0
// @downloadURL https://update.greasyfork.org/scripts/531361/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9E%D0%BB%D0%B8%D0%B2%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/531361/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9E%D0%BB%D0%B8%D0%B2%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const FAIL_PREFIX = 4;
    const OKAY_PREFIX = 8;
    const WAIT_PREFIX = 2;
    const TECH_PREFIX = 13;
    const CLOSE_PREFIX = 7;

    const START_DECOR = `<div style="text-align: center"><span style="font-family: 'Courier New'">`;
    const END_DECOR = `</span></div>`;

    // Раздел "Оливер ответы" с динамическим указанием пунктов
    const oliver = [
        {
            title: 'Жалоба передана руководству',
            content:
                `${START_DECOR}Доброго времени суток, {{ user.mention }}!<br><br>` +
                `Ваша жалоба была внимательно рассмотрена и передана на утверждение руководству. ` +
                `Просим вас немного подождать — мы ценим ваше терпение и обязательно разберемся в ситуации.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: WAIT_PREFIX,
            status: true,
            move: 0,
        },
        {
            title: 'Наказание выдано ошибочно',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Ваше наказание было выдано ошибочно и передано на рассмотрение руководству. ` +
                `Ожидайте решения в ближайшее время.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: WAIT_PREFIX,
            status: true,
            move: 0,
        },
        {
            title: 'Нарушение правил с передачей руководству',
            content: function(ruleText) {
                return `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                       `Вы были наказаны за нарушение пункта правил: [QUOTE]${ruleText}[/QUOTE]. ` +
                       `Ваше дело передано руководству для рассмотрения.<br><br>` +
                       `С уважением, Oliver_Horisov.${END_DECOR}`;
            },
            prefix: WAIT_PREFIX,
            status: true,
            move: 0,
        },
    ];

    // Раздел "RP биографии" (без изменений)
    const biography = [
        {
            title: 'На доработку',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `При рассмотрении вашей RolePlay биографии были выявлены недочеты, требующие исправления. ` +
                `У вас есть 24 часа на доработку.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: WAIT_PREFIX,
            status: true,
            open: true,
            move: 62,
        },
        {
            title: 'Биография одобрена',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Ваша RolePlay биография успешно проверена и одобрена. Спасибо за вашу работу!<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 61,
        },
        {
            title: 'Истёк срок рассмотрения',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `По истечении 24 часов необходимые изменения в вашей биографии не были внесены.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: FAIL_PREFIX,
            status: false,
            move: 63,
        },
        {
            title: 'Не по форме',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Ваша RolePlay биография составлена не по установленной форме. Ознакомьтесь с правилами: ` +
                `*[URL='https://forum.blackrussia.online/threads/red-%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BE%D1%84%D0%BE%D1%80%D0%BC%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%A0%D0%9F-%D0%B1%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9.7912578/']Кликабельно[/URL]*.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: FAIL_PREFIX,
            status: false,
            move: 63,
        },
        {
            title: 'Мало информации',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `В вашей RolePlay биографии недостаточно информации. Просим расписать её подробнее.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: WAIT_PREFIX,
            status: true,
            open: true,
            move: 62,
        },
    ];

    // Раздел "Меню жалоб" с полным списком правил (без изменений)
    const buttons = [
        {
            title: 'Жалоба на рассмотрении',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Ваша жалоба принята и находится в процессе рассмотрения. Просим не создавать дубликаты темы.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: WAIT_PREFIX,
            status: true,
            move: 0,
        },
        {
            title: 'Не по форме',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Ваша жалоба составлена не по установленной форме. Ознакомьтесь с правилами подачи: ` +
                `*[URL="https://forum.blackrussia.online/index.php?threads/%D0%9F%D1%80%D0%B0%D0%B2%D0%B8%D0%BB%D0%B0-%D0%BF%D0%BE%D0%B4%D0%B0%D1%87%D0%B8-%D0%B6%D0%B0%D0%BB%D0%BE%D0%B1-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.3429394/"]Кликабельно[/URL]*.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: FAIL_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Нет доказательств',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `В вашей жалобе отсутствуют необходимые доказательства нарушений.<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: FAIL_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'NonRP поведение (2.01)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.01. Запрещено поведение, нарушающее нормы процессов Role Play режима игры | Jail 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Уход от RP (2.02)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.02. Запрещено целенаправленно уходить от Role Play процесса всеразличными способами | Jail 30 минут / Warn[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'NonRP Drive (2.03)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.03. Запрещен NonRP Drive — вождение любого транспортного средства в невозможных для него условиях, а также вождение в неправдоподобной манере | Jail 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Помехи игровому процессу (2.04)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.04. Запрещены любые действия способные привести к помехам в игровом процессе, а также выполнению работ, если они этого не предусматривают и если эти действия выходят за рамки игрового процесса данной работы | Ban 10 дней / Обнуление аккаунта (при повторном нарушении)[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'OOC/IC обман (2.05)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.05. Запрещены любые OOC обманы и их попытки, а также любые IC обманы с нарушением Role Play правил и логики | PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'AFK без ESC (2.07)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.07. Запрещено нахождение в AFK без включенного ESC, создавая помеху другим игрокам | Kick[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Аморальные действия (2.08)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.08. Запрещена любая форма аморальных действий сексуального характера в сторону игроков | Jail 30 минут / Warn[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Слив склада (2.09)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.09. Запрещено сливать склад фракции / семьи путем взятия большого количества ресурсов или превышая допустимый лимит, установленный лидером | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Обман в /do (2.10)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.10. Запрещено в любой форме обманывать в /do, даже если это в дальнейшем негативно скажется на Вашем игровом персонаже | Jail 30 минут / Warn[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Личное использование транспорта (2.11)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.11. Запрещено использование рабочего или фракционного транспорта в личных целях | Jail 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Помеха блогерам (2.12)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.12. Запрещена помеха в работе блогеров, стримеров (медиа лиц), которые находятся на официальном сотрудничестве с проектом | Ban 7 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'DB (2.13)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.13. Запрещен DB (DriveBy) — намеренное убийство / нанесение урона без веской IC причины на любом виде транспорта | Jail 60 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'TK (2.15)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.15. Запрещен TK (Team Kill) — убийство члена своей или союзной фракции, организации без наличия какой-либо IC причины | Jail 60 минут / Warn (за два и более убийства)[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'SK (2.16)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.16. Запрещен SK (Spawn Kill) — убийство или нанесение урона на титульной территории любой фракции / организации, на месте появления игрока, а также на выходе из закрытых интерьеров и около них | Jail 60 минут / Warn (за два и более убийства)[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'MG (2.18)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.18. Запрещен MG (MetaGaming) — использование ООС информации, которую Ваш персонаж никак не мог получить в IC процессе | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'DM (2.19)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.19. Запрещен DM (DeathMatch) — убийство или нанесение урона без веской IC причины | Jail 60 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Mass DM (2.20)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.20. Запрещен Mass DM (Mass DeathMatch) — убийство или нанесение урона без веской IC причины трем игрокам и более | Warn / Ban 3 - 7 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Использование багов (2.21)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.21. Запрещено пытаться обходить игровую систему или использовать любые баги сервера | Ban 15 - 30 дней / PermBan (по согласованию с ГА, ЗГА, руководством тех. специалистов)[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Стороннее ПО (2.22)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.22. Запрещено хранить / использовать / распространять стороннее программное обеспечение или любые другие средства, позволяющие получить преимущество над другими игроками | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Скрытие ошибок (2.23)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.23. Запрещено скрывать от администрации ошибки игровых систем, а также распространять их игрокам | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Скрытие нарушителей (2.24)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.24. Запрещено скрывать от администрации нарушителей или злоумышленников | Ban 15 - 30 дней / PermBan + ЧС проекта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Ущерб репутации (2.25)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.25. Запрещены попытки или действия, которые могут навредить репутации проекта | PermBan + ЧС проекта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Вред ресурсам (2.26)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.26. Запрещено намеренно наносить вред ресурсам проекта (игровые серверы, форум, официальные Discord-серверы и так далее) | PermBan + ЧС проекта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Распространение информации (2.27)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.27. Запрещено распространение информации и материалов, непосредственно связанных с деятельностью администрации проекта, которые могут повлиять на работу и систему администрации | PermBan + ЧС проекта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Торговля за реальные деньги (2.28)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.28. Запрещена покупка/продажа внутриигровой валюты за реальные деньги в любом виде | PermBan с обнулением аккаунта + ЧС проекта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Ущерб экономике (2.30)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.30. Запрещено пытаться нанести ущерб экономике сервера | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Реклама (2.31)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.31. Запрещено рекламировать на серверах любые проекты, серверы, сайты, сторонние Discord-серверы, YouTube-каналы и тому подобное | Ban 7 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Обман администрации (2.32)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.32. Запрещено введение в заблуждение, обман администрации на всех ресурсах проекта | Ban 7 - 15 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Уязвимость правил (2.33)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.33. Запрещено пользоваться уязвимостью правил | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Конфликты по национальности (2.35)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.35. На игровых серверах запрещено устраивать IC и OOC конфликты на почве разногласия о национальности и / или религии совершенно в любом формате | Mute 120 минут / Ban 7 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'OOC угрозы (2.37)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.37. Запрещены OOC-угрозы, в том числе и завуалированные, а также угрозы наказанием со стороны администрации | Mute 120 минут / Ban 7 - 15 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Личная информация (2.38)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.38. Запрещено распространять личную информацию игроков и их родственников | Ban 15 - 30 дней / PermBan + ЧС проекта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Злоупотребление нарушениями (2.39)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.39. Злоупотребление нарушениями правил сервера | Ban 7 - 15 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Деструктивные действия (2.40)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.40. Запрещены совершенно любые деструктивные действия по отношению к проекту: неконструктивная критика, призывы покинуть проект, попытки нарушить развитие проекта или любые другие действия, способные привести к помехам в игровом процессе | Mute 300 минут / Ban 30 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Продажа имущества (2.42)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.42. Попытка продажи любого игрового имущества или игрового аккаунта за реальные деньги | PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Продажа промокодов (2.43)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.43. Запрещена продажа / обмен / покупка поощрительной составляющей от лица проекта, будь то бонус-код, либо промокод, который выдается безвозмездно игрокам в целях промоакций | Mute 120 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'RP сон (2.44)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.44. На серверах проекта запрещен Role Play сон (нахождение в AFK без ESC) | Kick[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Езда по полям (2.46)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.46. Запрещено ездить по полям на любом транспорте | Jail 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Езда по полям на грузовом ТС (2.47)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.47. Запрещено ездить по полям на грузовом транспорте, инкассаторских машинах (работа дальнобойщика, инкассатора) | Jail 60 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Продажа репутации (2.48)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.48. Запрещена продажа, передача, трансфер или покупка репутации семьи любыми способами, скрытие нарушителей, читеров лидером семьи | Обнуление рейтинга семьи / Обнуление игрового аккаунта лидера семьи[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Действия во фракциях (2.50)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.50. Запрещены задержания, аресты, а также любые действия со стороны игроков, состоящих во фракциях в интерьере аукциона, казино, а также во время системных мероприятий | Ban 7 - 15 дней + увольнение из организации[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Аксессуары (2.52)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.52. Запрещено располагать аксессуары на теле персонажа, нарушая нормы морали и этики, увеличивать аксессуары до слишком большого размера | При первом нарушении - обнуление аксессуаров, при повторном нарушении - обнуление аксессуаров + JAIL 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Названия ценностей (2.53)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.53. Запрещено устанавливать названия для внутриигровых ценностей с использованием нецензурной лексики, оскорблений, слов политической или религиозной направленности | Принудительная смена названия семьи / Ban 1 день / При повторном нарушении – обнуление бизнеса[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Неуважение к администрации (2.54)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.54. Запрещено неуважительное обращение, оскорбление, неадекватное поведение, угрозы в любом их проявлении по отношению к администрации | Mute 180 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Багоюз анимации (2.55)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.55. Запрещается багоюз связанный с анимацией в любых проявлениях | Jail 60 / 120 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Невозврат долга (2.57)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]2.57. Запрещается брать в долг игровые ценности и не возвращать их | Ban 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Caps Lock в чате (3.02)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.02. Запрещено использование верхнего регистра (Caps Lock) при написании любого текста в любом чате | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Оскорбления в OOC (3.03)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.03. Любые формы оскорблений, издевательств, расизма, дискриминации, религиозной враждебности, сексизма в OOC чате запрещены | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Упоминание родных (3.04)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.04. Запрещено оскорбление или косвенное упоминание родных вне зависимости от чата (IC или OOC) | Mute 120 минут / Ban 7 - 15 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Флуд в чате (3.05)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.05. Запрещен флуд — 3 и более повторяющихся сообщений от одного и того же игрока | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Знаки препинания (3.06)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.06. Запрещено злоупотребление знаков препинания и прочих символов | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Слив через чаты (3.08)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.08. Запрещены любые формы «слива» посредством использования глобальных чатов | PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Выдача за администратора (3.10)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.10. Запрещена выдача себя за администратора, если таковым не являетесь | Ban 7 - 15 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Злоупотребление командами (3.11)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.11. Запрещено введение игроков проекта в заблуждение путем злоупотребления командами | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Неправильный репорт (3.12)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.12. Запрещено подавать репорт, написанный транслитом, с сообщением не по теме (Offtop), с включённым Caps Lock, с использованием нецензурной брани, и повторять обращение (если ответ уже был дан ранее) | Report Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Музыка в Voice Chat (3.14)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.14. Запрещено включать музыку в Voice Chat | Mute 60 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Посторонние шумы (3.16)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.16. Запрещено создавать посторонние шумы или звуки | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Пропаганда (3.18)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.18. Запрещено политическое и религиозное пропагандирование, а также провокация игроков к конфликтам, коллективному флуду или беспорядкам в любом из чатов | Mute 120 минут / Ban 10 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Изменение голоса (3.19)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.19. Запрещено использование любого софта для изменения голоса | Mute 60 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Транслит в чате (3.20)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.20. Запрещено использование транслита в любом из чатов | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Реклама промокодов (3.21)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.21. Запрещается реклама промокодов в игре, а также их упоминание в любом виде во всех чатах | Ban 30 дней[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Объявления в ГОСС (3.22)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.22. Запрещено публиковать любые объявления в помещениях государственных организаций вне зависимости от чата (IC или OOC) | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Мат в VIP чате (3.23)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]3.23. Запрещено использование нецензурных слов, в том числе завуалированных и литературных в VIP чате | Mute 30 минут[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Передача аккаунта (4.03)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.03. Передача своего личного игрового аккаунта третьим лицам | PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Лимит аккаунтов (4.04)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.04. Разрешается зарегистрировать максимально только три игровых аккаунта на сервере | PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Трансфер ценностей (4.05)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.05. Запрещена передача либо трансфер игровых ценностей, между игровыми аккаунтами либо серверами, а также в целях удержания имущества | Ban 15 - 30 дней / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Неправильный никнейм (4.06)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.06. Никнейм игрового аккаунта должен быть в формате "Имя_Фамилия" на английском языке | Устное замечание + смена игрового никнейма[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Заглавные буквы в никнейме (4.07)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.07. В игровом никнейме запрещено использовать более двух заглавных букв | Устное замечание + смена игрового никнейма[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Несмысловой никнейм (4.08)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.08. Запрещено использовать никнейм, который не соответствует реальным именам и фамилиям и не несет в себе абсолютно никакой смысловой нагрузки | Устное замечание + смена игрового никнейма[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Оскорбительный никнейм (4.09)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.09. Запрещено использовать никнейм, содержащий в себе матерные слова или оскорбления (в том числе, завуалированные) | Устное замечание + смена игрового никнейма / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Похожий никнейм (4.10)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.10. Запрещено создавать никнейм, повторяющий или похожий на существующие никнеймы игроков или администраторов по их написанию | Устное замечание + смена игрового никнейма / PermBan[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Бизнесы с твинка (4.11)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.11. Владеть бизнесами разрешается с одного основного аккаунта | Обнуление твинк аккаунта[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Неактивность в ТК/СК (4.14)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.14. Запрещено, имея транспортную или строительную компанию, не проявлять активность в игре | Обнуление компании без компенсации[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
        {
            title: 'Промокод блогера (4.15)',
            content:
                `${START_DECOR}Здравствуйте, {{ user.mention }}.<br><br>` +
                `Нарушитель будет наказан по пункту правил: [QUOTE]4.15. Запрещено создавать промокод, идентичный промокоду блогера проекта, а также любой промокод, который не относится к рефералу и имеет возможность пассивного заработка | Перманентная блокировка аккаунта или обнуление имущества[/QUOTE]<br><br>` +
                `С уважением, Oliver_Horisov.${END_DECOR}`,
            prefix: OKAY_PREFIX,
            status: false,
            move: 0,
        },
    ];

    $(document).ready(() => {
        $('body').append('<script src="https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.js"></script>');

        addButton('Меню Оливера', 'selectOliverAnswer');
        addButton('Меню биографий', 'selectBiographyAnswer');
        addButton('Меню жалоб', 'selectComplaintAnswer');

        const threadData = getThreadData();

        $(`button#selectOliverAnswer`).click(() => {
            XF.alert(buttonsMarkup(oliver), null, 'Выберите ответ от Оливера:');
            oliver.forEach((btn, id) => {
                $(`button#answers-${id}`).click(() => {
                    if (id === 2) {
                        // Для "Нарушение правил с передачей руководству" показываем список правил
                        XF.alert(buttonsMarkup(buttons.slice(3)), null, 'Выберите пункт правил:');
                        buttons.slice(3).forEach((ruleBtn, ruleId) => {
                            $(`button#answers-${ruleId}`).click(() => {
                                const ruleText = ruleBtn.content.match(/\[QUOTE\](.*?)\[\/QUOTE\]/)[1];
                                pasteContentOliverWithRule(id, threadData, ruleText, true);
                            });
                        });
                    } else {
                        pasteContentOliver(id, threadData, true);
                    }
                });
            });
        });

        $(`button#selectBiographyAnswer`).click(() => {
            XF.alert(buttonsMarkup(biography), null, 'Выберите ответ по биографии:');
            biography.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContentBiography(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContentBiography(id, threadData, false));
                }
            });
        });

        $(`button#selectComplaintAnswer`).click(() => {
            XF.alert(buttonsMarkup(buttons), null, 'Выберите ответ по жалобе:');
            buttons.forEach((btn, id) => {
                if (id > 0) {
                    $(`button#answers-${id}`).click(() => pasteContentComplaint(id, threadData, true));
                } else {
                    $(`button#answers-${id}`).click(() => pasteContentComplaint(id, threadData, false));
                }
            });
        });
    });

    function addButton(name, id) {
        $('.button--icon--reply').before(
            `<button type="button" class="button rippleButton" id="${id}" style="margin: 3px; border: 2px solid red;">${name}</button>`
        );
    }

    function buttonsMarkup(items) {
        return `<div class="select_answer">${items
            .map(
                (btn, i) =>
                    `<button id="answers-${i}" class="button--primary button ` +
                    `rippleButton" style="margin:5px"><span class="button-text">${btn.title}</span></button>`
            )
            .join('')}</div>`;
    }

    function pasteContentOliver(id, data = {}, send = false) {
        const template = Handlebars.compile(oliver[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
        if (send && oliver[id].prefix !== null) {
            editThreadData(oliver[id].move, oliver[id].prefix, oliver[id].status, oliver[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContentOliverWithRule(id, data = {}, ruleText, send = false) {
        const template = Handlebars.compile(oliver[id].content(ruleText));
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
        if (send && oliver[id].prefix !== null) {
            editThreadData(oliver[id].move, oliver[id].prefix, oliver[id].status, oliver[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContentBiography(id, data = {}, send = false) {
        const template = Handlebars.compile(biography[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
        if (send) {
            editThreadData(biography[id].move, biography[id].prefix, biography[id].status, biography[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function pasteContentComplaint(id, data = {}, send = false) {
        const template = Handlebars.compile(buttons[id].content);
        if ($('.fr-element.fr-view p').text() === '') $('.fr-element.fr-view p').empty();
        $('span.fr-placeholder').empty();
        $('div.fr-element.fr-view p').append(template(data));
        $('a.overlay-titleCloser').trigger('click');
        if (send) {
            editThreadData(buttons[id].move, buttons[id].prefix, buttons[id].status, buttons[id].open);
            $('.button--icon.button--icon--reply.rippleButton').trigger('click');
        }
    }

    function getThreadData() {
        const authorID = $('a.username')[0].attributes['data-user-id'].nodeValue;
        const authorName = $('a.username').html();
        const hours = new Date().getHours();
        return {
            user: {
                id: authorID,
                name: authorName,
                mention: `[USER=${authorID}]${authorName}[/USER]`,
            },
            greeting: () =>
                4 < hours && hours <= 11
                    ? 'Доброе утро'
                    : 11 < hours && hours <= 15
                    ? 'Добрый день'
                    : 15 < hours && hours <= 21
                    ? 'Добрый вечер'
                    : 'Доброй ночи',
        };
    }

    function editThreadData(move, prefix, pin = false, open = false) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
        if (pin == false) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else if (pin == true && open) {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    discussion_open: 1,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        } else {
            fetch(`${document.URL}edit`, {
                method: 'POST',
                body: getFormData({
                    prefix_id: prefix,
                    title: threadTitle,
                    sticky: 1,
                    _xfToken: XF.config.csrf,
                    _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                    _xfWithData: 1,
                    _xfResponseType: 'json',
                }),
            }).then(() => location.reload());
        }
        if (move > 0) {
            moveThread(prefix, move);
        }
    }

    function moveThread(prefix, type) {
        const threadTitle = $('.p-title-value')[0].lastChild.textContent;
        fetch(`${document.URL}move`, {
            method: 'POST',
            body: getFormData({
                prefix_id: prefix,
                title: threadTitle,
                target_node_id: type,
                redirect_type: 'none',
                notify_watchers: 1,
                starter_alert: 1,
                starter_alert_reason: '',
                _xfToken: XF.config.csrf,
                _xfRequestUri: document.URL.split(XF.config.url.fullBase)[1],
                _xfWithData: 1,
                _xfResponseType: 'json',
            }),
        }).then(() => location.reload());
    }

    function getFormData(data) {
        const formData = new FormData();
        Object.entries(data).forEach(i => formData.append(i[0], i[1]));
        return formData;
    }
})();