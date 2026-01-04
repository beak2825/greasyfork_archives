// ==UserScript==
// @name         Скрипт RP-Биографий (Black Russia)
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Автоматизация одобрения/отказа биографий на форуме Black Russia
// @author       RAYN REY
// @match        https://forum.blackrussia.online/threads/*
// @icon         https://i.postimg.cc/NF5V6D1h/J4c2-Db-P4-Oog.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538629/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20RP-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9%20%28Black%20Russia%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538629/%D0%A1%D0%BA%D1%80%D0%B8%D0%BF%D1%82%20RP-%D0%91%D0%B8%D0%BE%D0%B3%D1%80%D0%B0%D1%84%D0%B8%D0%B9%20%28Black%20Russia%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Префиксы
    const PREFIXES = {
        UNACCEPTED: 4,
        ACCEPTED: 8,
        PINNED: 2,
    };

    // Шаблоны кнопок
    const buttons = [
        {
            title: '✅ Одобрено',
            content: `[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>
[CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус — [COLOR=#00ff00]Одобрено[/color].[/COLOR][/SIZE][/FONT][/CENTER]<br><br>
[CENTER][img]https://i.postimg.cc/43WY7jx3/nRMnEsM.gif[/img][/CENTER]`,
            prefix: PREFIXES.ACCEPTED
        },
        {
            title: '❌ Отказано',
            content: `[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>
[CENTER][FONT=georgia][SIZE=4][COLOR=lavender]К сожалению, Ваша [COLOR=#00bfff]RolePlay Биография[/color] получает статус: [COLOR=#ff0000]Отклонено[/color].[/COLOR][/SIZE][/FONT]</CENTER><br><br>
[CENTER][img]https://i.postimg.cc/DzwtM9Yy/3-Nx-P1-gif-0e0c6523faa5f31ef44e0b8939199665.gif[/img][/CENTER]`,
            prefix: PREFIXES.UNACCEPTED
        },
        {
            title: '📌 На рассмотрении',
            content: `[I][B][CENTER][FONT=georgia][SIZE=4][COLOR=#ffff00]Здравствуйте, уважаемый {{ user.mention }}[/COLOR][/SIZE][/FONT][/CENTER][/B]<br><br>
[CENTER][FONT=georgia][SIZE=4][COLOR=lavender]Ваша RolePlay Биография принята на рассмотрение. Пожалуйста, ожидайте решения и не создавайте дубликатов.[/COLOR][/SIZE][/FONT]</CENTER><br><br>
[CENTER][img]https://i.postimg.cc/S2yFSD5t/uix-logo-cust.png[/img][/CENTER]`,
            prefix: PREFIXES.PINNED
        }
    ];

    // Вставка кнопок в интерфейс форума
    function insertButtons() {
        const postArea = document.querySelector('.message-actionBar'); // или подбери другой селектор, где лучше разместить кнопки
        if (!postArea) return;

        const container = document.createElement('div');
        container.style.margin = '10px 0';
        container.style.display = 'flex';
        container.style.flexWrap = 'wrap';
        container.style.gap = '6px';

        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.textContent = btn.title;
            button.style.padding = '6px';
            button.style.fontSize = '12px';
            button.style.cursor = 'pointer';
            button.style.backgroundColor = '#282c34';
            button.style.color = '#fff';
            button.style.border = '1px solid #555';

            button.addEventListener('click', () => handleAction(btn));
            container.appendChild(button);
        });

        postArea.appendChild(container);
    }

    // Обработка действия кнопки
    function handleAction(button) {
        const userMention = getMention(); // Получить имя автора темы
        const finalText = button.content.replace('{{ user.mention }}', userMention);

        insertTextToReplyBox(finalText);
        setPrefix(button.prefix);
    }

    // Получение упоминания пользователя из поста
    function getMention() {
        const author = document.querySelector('.message-threadStarter .username');
        return author ? `[USER=${author.dataset.userId}]${author.innerText}[/USER]` : '[USER=1]Участник[/USER]';
    }

    // Вставка текста в поле ответа
    function insertTextToReplyBox(text) {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.value = text;
            textarea.scrollIntoView();
        }
    }

    // Установка префикса (если доступно через DOM, иначе вручную)
    function setPrefix(prefixId) {
        const prefixSelect = document.querySelector('select[name="prefix_id"]');
        if (prefixSelect) {
            prefixSelect.value = prefixId;
        }
    }

    // Подождать пока страница загрузится
    window.addEventListener('load', insertButtons);
})();
