// ==UserScript==
// @name         MAGADAN | ГС/ЗГС ОПГ — автоответы (новый формат сообщений с GIF)
// @namespace    forum.blackrussia.online
// @version      9.2
// @description  Автоответы с пробелами и GIF для всех кнопок, статус перед "Закрыто!" белый, сама "Закрыто!" черная, текст жирный, новые префиксы TEX14 и 99 без кнопок
// @author       Azimut Elemental + доработка
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547572/MAGADAN%20%7C%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%E2%80%94%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%28%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%81%20GIF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547572/MAGADAN%20%7C%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%E2%80%94%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D1%8B%20%28%D0%BD%D0%BE%D0%B2%D1%8B%D0%B9%20%D1%84%D0%BE%D1%80%D0%BC%D0%B0%D1%82%20%D1%81%D0%BE%D0%BE%D0%B1%D1%89%D0%B5%D0%BD%D0%B8%D0%B9%20%D1%81%20GIF%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const FONT = 'Verdana';

    const PREFIX = {
        UNACCEPT: 4,
        ACCEPT: 8,
        PIN: 2,
        TEX14: 14,   // Тех Спецу
        NINETY9: 99  // 99 с GIF
    };

    const buttons = [
        {icon:'⏳', title:'На рассмотрении', message:'Ваша жалоба была принята на рассмотрение, просьба не создавать копии темы.', prefix:PREFIX.PIN},
        {icon:'🚫', title:'Игрок не лидер', message:'Данный игрок не является лидером, на этом основании ваша жалоба получает статус отказано. ', prefix:PREFIX.UNACCEPT},
        {icon:'❌', title:'Доказательств недостаточно', message:'К сожалению данных доказательств недостаточно для выявления нарушения со стороны лидера, если у вас есть дополнительные материалы, то предоставьте их в новой теме.', prefix:PREFIX.UNACCEPT},
        {icon:'⚠️', title:'Не рабочие доказательства', message:'Предоставленные доказательства не рабочие, предоставьте рабочую ссылку.', prefix:PREFIX.UNACCEPT},
        {icon:'⏱', title:'Отсутствует /time', message:' На предоставленных вами доказательствах отсутствует /time, на этом основании жалоба получает статус отказано.', prefix:PREFIX.UNACCEPT},
        {icon:'🕐', title:'Более 24-х часов без таймкодов', message:'К сожалению, с момента получения видеозаписи прошло более 24-х часов, таймкоды не добавлены.', prefix:PREFIX.UNACCEPT},
        {icon:'🧪', title:'Поддельные доказательства', message:'Доказательства в вашей жалобе являются отредактированными или поддельными, на этом основании жалоба получает статус отказано.', prefix:PREFIX.UNACCEPT},
        {icon:'📤', title:'Загрузите на официальные платформы', message:'Для подтверждения ваших доказательств, требуется загрузить их на официальные платформы такие как Imgur, Yapx, или YouTube, т.к другие платформы могут вызвать затруднения, или недоразумения.', prefix:PREFIX.UNACCEPT},
        {icon:'📂', title:'Ошиблись разделом', message:'Вы ошиблись разделом, этот раздел предназначен для жалоб на лидеров.', prefix:PREFIX.UNACCEPT},
        {icon:'🌍', title:'Ошиблись сервером (MAGADAN)', message:'Вы ошиблись сервером, данный раздел жалоб относиться к серверу MAGADAN.', prefix:PREFIX.UNACCEPT},
        {icon:'🎥', title:'Длинный фрапс', message:'Ваш фрапс является слишком длинным. ( Более 3-х минут ) На этом основании мы просим вас предоставить таймкоды в течении 24-х часов, в противном случае ваша жалоба будет отказана.', prefix:PREFIX.PIN},
        {icon:'⌛', title:'Жалоба >72-х часов', message:'К сожалению жалоба не подлежит рассмотрению, так как с момента нарушения прошло более 72-х часов.', prefix:PREFIX.UNACCEPT},
        {icon:'📌', title:'Передано Зам. Главного Следящего', message:'Ваша жалоба была передана Заместителю Главного Следящего за Криминальными организациями.', prefix:PREFIX.NINETY9},
        {icon:'📍', title:'Передано Зам. Главного Администратора', message:'Ваша жалоба была передана Заместителю Главного Администратора по направлению ГОСС/ОПГ.', prefix:PREFIX.NINETY9},
        {icon:'✅', title:'Одобрено — беседа проведена', message:'Ваша жалоба получает статус Одобрено, с лидером будет проведена беседа.', prefix:PREFIX.ACCEPT},
        {icon:'🏆', title:'Одобрено — наказание лидера', message:'Ваша жалоба получает статус одобрено, лидер получит наказание.', prefix:PREFIX.ACCEPT},
        {icon:'🎯', title:'Передано Главному Следящему', message:'Ваша жалоба была передана Главному Следящему за Криминальными организациями.', prefix:PREFIX.NINETY9},
        {icon:'🎯', title:'Тех Спецу', message:'Ваша жалоба передана на рассмотрение Техническому специалисту.', prefix:PREFIX.TEX14}

        // TEX14 и 99 здесь не добавляем в buttons — кнопок нет
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

    function formatMessage(message, nickname, timeOfDay, btn) {
        let statusText = '';
        let gif = btn.gif || '';

        switch(btn.prefix) {
            case PREFIX.ACCEPT:
                statusText = 'Одобрено';
                gif = gif || 'https://i.postimg.cc/Kz3XZZsg/oh-my.gif';
                break;
            case PREFIX.UNACCEPT:
                statusText = 'Отказано';
                gif = gif || 'https://i.postimg.cc/Kz3XZZsg/oh-my.gif';
                break;
            case PREFIX.PIN:
                statusText = 'На рассмотрении';
                gif = gif || 'https://i.postimg.cc/sxf6QMQH/image.gif';
                break;
            case PREFIX.TEX14:
                statusText = 'Тех Спецу';
                gif = gif || 'https://i.postimg.cc/Kz3XZZsg/oh-my.gif';
                break;
            case PREFIX.NINETY9:
                statusText = 'На рассмотрении';
                gif = gif || 'https://i.postimg.cc/sxf6QMQH/image.gif';
                break;
        }

        let formatted = `[B][COLOR=magenta]${timeOfDay}, уважаемый(ая) [COLOR=magenta]${nickname}[/COLOR][/COLOR][/B]\n\n`;

        const lines = message.split('\n');
        lines.forEach(line => {
            formatted += `[B][COLOR=white]${line}[/COLOR][/B]\n\n`;
        });

        formatted += `[B][COLOR=red]${statusText}[/COLOR], [COLOR=red]Закрыто![/COLOR][/B]`;

        return { text: formatted, gif: gif };
    }

    function insertAndSend(btn) {
        const username = getUsername();
        const timeOfDay = getTimeOfDay();
        const formatted = formatMessage(btn.message, username, timeOfDay, btn);

        const finalMessage = `[CENTER][FONT=${FONT}]${formatted.text}[/FONT][/CENTER]\n` +
                             (formatted.gif ? `[CENTER][IMG]${formatted.gif}[/IMG][/CENTER]` : '');

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
            prefixSelect.value = btn.prefix;
            prefixSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const lockBox = document.querySelector('input[name="discussion_open"]');
        if (lockBox) lockBox.checked = false;

        const stickyBox = document.querySelector('input[name="sticky"]');
        if (stickyBox) stickyBox.checked = true;

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
        menu.style.marginTop = '5px';
        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.type = 'button';
            b.textContent = `${btn.icon} ${btn.title}`;
            b.style.cssText = `
                display:block;
                width:100%;
                text-align:left;
                background:#444;
                color:white;
                border:none;
                padding:6px;
                margin-bottom:2px;
                border-radius:5px;
                cursor:pointer;
                font-family:Verdana;
                font-weight:bold;
            `;
            b.onclick = () => insertAndSend(btn);
            menu.appendChild(b);
        });

        mainBtn.onclick = () => menu.style.display = menu.style.display === 'none' ? 'block' : 'none';

        wrap.appendChild(mainBtn);
        wrap.appendChild(menu);
        container.parentNode.insertBefore(wrap, container.nextSibling);
    }

    window.addEventListener('load', addButtons);
})();


