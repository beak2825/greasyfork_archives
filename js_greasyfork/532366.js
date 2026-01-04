// ==UserScript==
// @name         Arizona RP Punishes
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Вывод наказаний игрока
// @match        https://forum.arizona-rp.com/threads/*
// @grant        none
// @author       Maximiliano_Venzo
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532366/Arizona%20RP%20Punishes.user.js
// @updateURL https://update.greasyfork.org/scripts/532366/Arizona%20RP%20Punishes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SERVER_URL = 'https://vds.kurome.ru/logs';
    const TOKEN = '';

    const extractNickname = () => {
        const match = document.body.innerText.match(/Ваш игровой ник[:\s]*["“”']?([\w_]+)["“”']?/);
        return match ? match[1] : '';
    };

const extractServer = () => {
    const items = [...document.querySelectorAll('li[itemprop="itemListElement"] span[itemprop="name"]')];

    for (const el of items) {
        const text = el.textContent.trim();

        // Обычные сервера: Сервер №7 [Mesa]
        const normalMatch = text.match(/Сервер №(\d+)/);
        if (normalMatch) {
            return normalMatch[1];
        }

        // Мобильные сервера: Arizona Mobile 1, 2, 3...
        const mobileMatch = text.match(/Arizona Mobile (\d+)/i);
        if (mobileMatch) {
            return (100 + parseInt(mobileMatch[1], 10)).toString();
        }
    }

    // Если не найдено — по умолчанию 7
    return '7';
};


    const nickname = extractNickname();
    const server = extractServer();
    const formGroup = document.querySelector('.formButtonGroup');
    if (!formGroup) return;

    // Визуальная часть
    const wrapper = document.createElement('div');
    wrapper.style.marginTop = '20px';

    const nicknameInput = document.createElement('input');
    nicknameInput.type = 'text';
    nicknameInput.value = nickname;
    nicknameInput.placeholder = 'Введите ник';
    nicknameInput.style = 'padding: 6px 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 8px; color: black;';
    wrapper.appendChild(nicknameInput);

    const button = document.createElement('input');
    button.type = 'button';
    button.value = '🔍 Загрузить логи';
    button.className = 'button shabs';
    button.style = 'margin-top: 10px; background: #0a84ff; color: white;';
    wrapper.appendChild(button);

    const output = document.createElement('div');
    output.style = 'margin-top: 15px; padding: 10px; background: #1a1a1a; border-radius: 6px; color: #eee; font-size: 14px;';
    output.innerHTML = `<b>Логи для <span style="color:deepskyblue">${nickname}</span> появятся здесь после загрузки...</b>`;
    wrapper.appendChild(output);

    formGroup.parentElement.appendChild(wrapper);

    // Запрос логов
    button.onclick = () => {
        const currentNick = nicknameInput.value.trim();
        if (!currentNick) {
            output.innerHTML = '❌ Укажите ник.';
            return;
        }

        output.innerHTML = `⏳ Загружаем логи для <span style="color:deepskyblue">${currentNick}</span>...`;

        fetch(`${SERVER_URL}?name=${encodeURIComponent(currentNick)}&server=${server}&token=${TOKEN}`)
            .then(res => res.json())
            .then(data => {
                const result = document.createElement('div');

                if (data.ban) {
                    result.innerHTML += `
                        <div style="background:#300;padding:8px;border-radius:4px;margin-bottom:10px;">
                            <b>🚫 Забанен:</b><br>
                            👤 <b>Ник:</b> ${data.ban.nickname}<br>
                            👮 <b>Админ:</b> ${data.ban.admin}<br>
                            📅 <b>Дата бана:</b> ${data.ban.bandate}<br>
                            ⏳ <b>Разбан:</b> ${data.ban.unbandate}<br>
                            📝 <b>Причина:</b> ${data.ban.reason}
                        </div>`;
                }

                if (Array.isArray(data.punish)) {
                    const logs = data.punish.slice(0, 10).map(p =>
                        `<li><span style="color:gold;">${p.date}</span> — ${p.reason}</li>`).join('');
                    result.innerHTML += `<ul>${logs}</ul>`;
                } else {
                    result.innerHTML += '<div>❌ Наказаний не найдено.</div>';
                }

                output.innerHTML = '';
                output.appendChild(result);
            })
            .catch(err => {
                console.error('[Ошибка]', err);
                output.innerHTML = '❌ Ошибка: Failed to fetch';
            });
    };
})();
