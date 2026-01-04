// ==UserScript==
// @name         MAGADAN | ГС/ЗГС ОПГ — Анти Блат
// @namespace    forum.blackrussia.online
// @version      1
// @description  Автоответы 
// @author       Azimut Elemental + доработка
// @match        https://forum.blackrussia.online/threads/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546383/MAGADAN%20%7C%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%E2%80%94%20%D0%90%D0%BD%D1%82%D0%B8%20%D0%91%D0%BB%D0%B0%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/546383/MAGADAN%20%7C%20%D0%93%D0%A1%D0%97%D0%93%D0%A1%20%D0%9E%D0%9F%D0%93%20%E2%80%94%20%D0%90%D0%BD%D1%82%D0%B8%20%D0%91%D0%BB%D0%B0%D1%82.meta.js
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
        {icon:'📌', title:'нет привязки TG и BK', message:'"нет привязки TG и BK', prefix:PREFIX.UNACCEPT},
        {icon:'📍', title:'очсп', message:' очсп', prefix:PREFIX.UNACCEPT},
        {icon:'✅', title:'Одобрено', message:'+', prefix:PREFIX.ACCEPT} ,
        {icon:'📍', title:'Нет привязки тг', message:'нет привязки тг', prefix:PREFIX.UNACCEPT},
        {icon:'🎯', title:'нет привязки вк', message: 'нет привязки VK', prefix:PREFIX.UNACCEPT},
        {icon:'🎯', title:'нет 6 лвл', message:'нет 6 lvl', prefix:PREFIX.NINETY9},
        {icon:'🎯', title:'NRP Ник', message:'Нрп ник', prefix:PREFIX.UNACCEPT}

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
                statusText = '';
                gif = gif || 'https://i.postimg.cc/76fTQD2t/8-F84-EC21-5-F00-40-D4-8-CA3-F53-AC8-F46-CA6.gif';
                break;
            case PREFIX.UNACCEPT:
                statusText = 'Отказано';
                gif = gif || 'https://i.postimg.cc/76fTQD2t/8-F84-EC21-5-F00-40-D4-8-CA3-F53-AC8-F46-CA6.gif';
                break;
            case PREFIX.PIN:
                statusText = 'На рассмотрении';
                gif = gif || 'https://i.postimg.cc/L6dgQP6H/tumblr-mylm16-BBTs1rydwbvo1-500.gif';
                break;
            case PREFIX.TEX14:
                statusText = 'Тех Спецу';
                gif = gif || 'https://i.postimg.cc/3RFFP36n/51b7e32fd2b0779a4c3ae02705b679f9.gif';
                break;
            case PREFIX.NINETY9:
                statusText = 'На рассмотрении';
                gif = gif || 'https://i.postimg.cc/3RFFP36n/51b7e32fd2b0779a4c3ae02705b679f9.gif';
                break;
        }

        let formatted = `[B][COLOR=black]${timeOfDay}, уважаемый(ая) [COLOR=white]${nickname}[/COLOR][/COLOR][/B]\n\n`;

        const lines = message.split('\n');
        lines.forEach(line => {
            formatted += `[B][COLOR=gray]${line}[/COLOR][/B]\n\n`;
        });

        formatted += `[B][COLOR=white]${statusText}[/COLOR]`;

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


