// ==UserScript==
// @name         MAGADAN | ГС/ЗГС ОПГ — автоответы (новый формат сообщений)
// @namespace    forum.blackrussia.online
// @version      4
// @description  Автоответы с новым форматированием: черная первая строка + белый ник, серый текст до точки + белый после + "Закрыто!" черным
// @author       Azimut Elemental + доработка
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546188/MAGADAN%20%7C%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%E2%80%94%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%28%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546188/MAGADAN%20%7C%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%E2%80%94%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%28%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FONT = 'Verdana';
    const GIF = 'https://i.postimg.cc/L6dgQP6H/tumblr-mylm16-BBTs1rydwbvo1-500.gif';

    const PREFIX = {
        UNACCEPT: 4,
        ACCEPT: 8,
        PIN: 2
    };

    const buttons = [
        {
            icon: '⏳',
            title: 'На рассмотрении',
            message: `Ваша жалоба была принята на рассмотрение, просьба не создавать копии темы. На рассмотрении.`,
            prefix: PREFIX.PIN,
            lock: true,
            sticky: true
        },
        {
            icon: '🚫',
            title: 'Игрок не лидер',
            message: `Игрок не лидер. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '❌',
            title: 'Доказательств недостаточно',
            message: `Доказательств недостаточно. Если есть дополнительные материалы — создайте новую тему. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '⚠️',
            title: 'Не рабочие доказательства',
            message: `Предоставленные доказательства не рабочие, предоставьте рабочую ссылку. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '⏱',
            title: 'Отсутствует /time',
            message: `На доказательствах отсутствует /time. Жалоба — Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '🕐',
            title: 'Более 24-х часов без таймкодов',
            message: `К сожалению, с момента получения видеозаписи прошло более 24-х часов, таймкоды не добавлены. Ваша жалоба — Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '🧪',
            title: 'Поддельные доказательства',
            message: `Доказательства поддельные или отредактированы. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '📤',
            title: 'Загрузите на официальные платформы',
            message: `Для подтверждения доказательств используйте Imgur, Yapx или YouTube. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '📂',
            title: 'Ошиблись разделом',
            message: `Вы ошиблись разделом. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '🌍',
            title: 'Ошиблись сервером (MAGADAN)',
            message: `Вы ошиблись сервером, раздел — MAGADAN. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '🎥',
            title: 'Длинный фрапс',
            message: `Ваш фрапс слишком длинный (>3 мин). Добавьте таймкоды в течение 24 часов. На рассмотрении.`,
            prefix: PREFIX.PIN,
            lock: true,
            sticky: true
        },
        {
            icon: '⌛',
            title: 'Жалоба >72-х часов',
            message: `Жалоба >72-х часов, не подлежит рассмотрению. Отказано.`,
            prefix: PREFIX.UNACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '📌',
            title: 'Передано Зам. Главного Следящего',
            message: `Ваша жалоба была передана Заместителю Главного Следящего. На рассмотрении.`,
            prefix: PREFIX.PIN,
            lock: true,
            sticky: true
        },
        {
            icon: '📍',
            title: 'Передано Зам. Главного Администратора',
            message: `Ваша жалоба была передана Заместителю Главного Администратора по направлению ГОСС/ОПГ. На рассмотрении.`,
            prefix: PREFIX.PIN,
            lock: true,
            sticky: true
        },
        {
            icon: '✅',
            title: 'Одобрено — беседа проведена',
            message: `Жалоба одобрена, с лидером проведена беседа. Одобрено.`,
            prefix: PREFIX.ACCEPT,
            lock: true,
            sticky: false
        },
        {
            icon: '🏆',
            title: 'Одобрено — наказание лидера',
            message: `Жалоба одобрена, лидер получит наказание. Одобрено.`,
            prefix: PREFIX.ACCEPT,
            lock: true,
            sticky: false
        }
    ];

    function getUsername() {
        const el = document.querySelector('.p-title-value a, .message-threadStarterPost .username');
        return el ? el.textContent.trim() : 'игрок';
    }

    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 12) return 'Доброе утро';
        if (hour < 18) return 'Добрый день';
        return 'Добрый вечер';
    }

    function formatMessage(message) {
        const dotIndex = message.indexOf('.');
        if (dotIndex === -1) return `[COLOR=gray]${message}[/COLOR]\n[COLOR=white][/COLOR][COLOR=black]Закрыто![/COLOR]`;
        const firstPart = message.slice(0, dotIndex + 1);
        const secondPart = message.slice(dotIndex + 1).trim();
        return `[COLOR=gray]${firstPart}[/COLOR]\n[COLOR=white]${secondPart}[/COLOR][COLOR=black] Закрыто![/COLOR]`;
    }

    function insertAndSend(message, prefix, lock, sticky) {
        const username = getUsername();
        const timeOfDay = getTimeOfDay();
        const formattedMessage = formatMessage(message);

        const finalMessage = `
[CENTER][FONT=${FONT}]
[B][COLOR=black]${timeOfDay}, уважаемый(ая) [COLOR=white][B]${username}[/B][/COLOR][/COLOR][/B]
${formattedMessage}
[/FONT][/CENTER]
[CENTER][IMG]${GIF}[/IMG][/CENTER]
`;

        const editor = document.querySelector('.fr-element');
        if (editor) {
            editor.focus();
            document.execCommand('selectAll', false, null);
            document.execCommand('delete', false, null);
            document.execCommand('insertText', false, finalMessage);
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            editor.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const textarea = document.querySelector('textarea[name="message"]');
        if (textarea) {
            textarea.value = finalMessage;
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const prefixSelect = document.querySelector('select[name="prefix_id"]');
        if (prefixSelect) {
            prefixSelect.value = prefix;
            prefixSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const lockBox = document.querySelector('input[name="discussion_open"]');
        if (lockBox) lockBox.checked = !lock;

        const stickyBox = document.querySelector('input[name="sticky"]');
        if (stickyBox) stickyBox.checked = sticky;

        const form = document.querySelector('form[action*="add-reply"]');
        if (form) setTimeout(() => form.requestSubmit(), 400);
    }

    function addButtons() {
        const container = document.querySelector('.button--icon--reply');
        if (!container) return;

        const wrap = document.createElement('div');
        wrap.style.marginTop = '10px';

        const mainBtn = document.createElement('button');
        mainBtn.type = 'button';
        mainBtn.innerHTML = '📝 <b>Ответы</b>';
        mainBtn.style.cssText = `
            background:#2b2b2b;
            color:#fff;
            padding:6px 14px;
            border-radius:10px;
            cursor:pointer;
            font-weight:bold;
            margin-bottom:6px;
            font-family:Verdana;
        `;

        const menu = document.createElement('div');
        menu.style.display = 'none';
        menu.style.marginTop = '6px';

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.type = 'button';
            b.innerHTML = `<span style="margin-right:8px;">${btn.icon}</span>${btn.title}`;
            b.style.cssText = `
                display:block;
                width:100%;
                padding:5px 10px;
                text-align:left;
                margin-bottom:3px;
                border-radius:6px;
                background:#3b3b3b;
                color:#fff;
                cursor:pointer;
                font-family:Verdana;
            `;
            b.addEventListener('click', () => insertAndSend(btn.message, btn.prefix, btn.lock, btn.sticky));
            menu.appendChild(b);
        });

        mainBtn.addEventListener('click', () => {
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        wrap.appendChild(mainBtn);
        wrap.appendChild(menu);
        container.parentNode.insertBefore(wrap, container.nextSibling);
    }

    setTimeout(addButtons, 1500);

})();
