// ==UserScript==
// @name         Скрипт для КФ ТВЕРЬ
// @namespace    http://tampermonkey.net/
// @version      022
// @description  Скрипт для КФ
// @author       RAYN REY
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/NF5V6D1h/J4c2-Db-P4-Oog.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538627/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%A2%D0%92%D0%95%D0%A0%D0%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538627/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20%D0%B4%D0%BB%D1%8F%20%D0%9A%D0%A4%20%D0%A2%D0%92%D0%95%D0%A0%D0%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const UNACCСEPT_PREFIX = 4;
    const ACCСEPT_PREFIX = 8;
    const PINN_PREFIX = 2;

    const buttons = [
        {
            title: '╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴БИО ╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴╴',
            content: '',
            prefix: 0,
            status: false
        },
        {
            title: 'На рассмотрении RP',
            content:
                "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
                "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша RolePlay Биография взята на [COLOR=#ffff00]рассмотрение[/color], ожидайте ответа и не создавайте [COLOR=#ff0000]тем-дубликатов[/color].[/SIZE][/FONT] <br><br>" +
                "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]" +
                "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]На рассмотрении[/COLOR][/SIZE][/FONT]<br><br>" +
                "[img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img]",
            prefix: PINN_PREFIX,
            status: true
        },
        {
            title: 'Одобрено',
            content:
                "[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
                "[B][CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>" +
                "[CENTER][img]https://i.postimg.cc/mrhcH5vR/1621526767066.png[/img][/CENTER]" +
                "[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]",
            prefix: ACCСEPT_PREFIX,
            status: false
        }
    ];

    // Дальше добавь реализацию вывода кнопок на страницу и вставку контента, если нужно
    console.log("Кнопки загружены:", buttons);
})();
