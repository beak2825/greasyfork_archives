// ==UserScript==
// @name         Copy and Ticket Actions
// @namespace    https://sd-frt.com/
// @version      5.9
// @description  Добавление кнопок: "Скопировать ID мерча", "Скопировать ID прова", "Скопировать ID прова + ID мерча", "Пуш", "Ожидание прова", "Ожидание мерча", "Закрыть"
// @author       loli
// @license      MIT
// @match        https://sd-frt.com/ru/ticket/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/518763/Copy%20and%20Ticket%20Actions.user.js
// @updateURL https://update.greasyfork.org/scripts/518763/Copy%20and%20Ticket%20Actions.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function rmvSearch() {
        const u = new URL(window.location.href);
        if (u.searchParams.has('search')) {
            u.searchParams.delete('search');
            window.history.replaceState({}, document.title, u.toString());
        }
    }

    function clrSearch() {
        const sB = document.querySelector('.ticket-search');
        if (sB) {
            const sI = sB.querySelector('.el-input__inner');
            if (sI) {
                sI.value = '';
                sI.dispatchEvent(new Event('input', { bubbles: true }));
                setTimeout(() => { rmvSearch(); }, 500);
            }
        }
    }

    function addBtns() {
        if (document.querySelector('#copy-merchant-id-button') &&
            document.querySelector('#copy-provider-id-button') &&
            document.querySelector('#copy-provider-and-merchant-id-button') &&
            document.querySelector('#await-provider-button') &&
            document.querySelector('#await-merchant-button') &&
            document.querySelector('#close-ticket-button') &&
            document.querySelector('#push-button')) return;

        const rB = document.querySelector('.ticket-right-block');
        if (!rB) return;

        function addBtn(id, text, color, action) {
            if (!document.querySelector(`#${id}`)) {
                const btn = document.createElement('button');
                btn.id = id;
                btn.textContent = text;
                btn.style = `padding: 10px; background-color: ${color}; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px; width: 100%; transition: all 0.3s ease;`;
                btn.addEventListener('click', action);
                rB.appendChild(btn);
            }
        }

        addBtn('copy-merchant-id-button', 'Скопировать ID мерча', '#409EFF', () => btnClick(copyMerchantID, false));
        addBtn('copy-provider-id-button', 'Скопировать ID прова', '#5FB3B3', () => btnClick(copyProviderID, false));
        addBtn('copy-provider-and-merchant-id-button', 'Скопировать ID прова + ID мерча', '#4CAF50', () => btnClick(copyProviderAndMerchantID, false));
        addBtn('push-button', 'Пуш', '#FF4500', () => btnClick(pushAction, false));

        if (!document.querySelector('#button-divider')) {
            const d = document.createElement('div');
            d.id = 'button-divider';
            d.style = 'margin: 10px 0; border-top: 1px solid #ccc;';
            rB.appendChild(d);
        }

        addBtn('await-provider-button', 'Ожидание прова', '#FFD700', () => btnClick(() => awaitAct('ARB | Ожидание провайдера'), true));
        addBtn('await-merchant-button', 'Ожидание мерча', '#FFD700', () => btnClick(() => awaitAct('ARB | Ожидание выписки от мерча'), true));
        addBtn('close-ticket-button', 'Закрыть', '#FF6347', () => btnClick(closeTicket, true));

        addStyles();
    }

    function btnClick(action, shouldGoBack) {
        action();
        if (shouldGoBack) {
            setTimeout(() => {
                clrSearch();
                const url = new URL(window.location.href);
                if (!url.searchParams.has('search')) {
                    setTimeout(() => history.back(), 500); // Возврат на предыдущую страницу, если поиска нет в URL
                }
            }, 1000);
        }
    }

    function copyMerchantID() {
        const c = document.querySelector('.ticket-conversation__message-text .ticket-conversation__message-html');
        if (c) {
            const l = Array.from(c.querySelectorAll('p')).map(p => p.textContent.trim());
            if (l.length >= 4) GM_setClipboard(l[3]);
        }
    }

    function copyProviderID() {
        const c = document.querySelector('.ticket-conversation__message-text .ticket-conversation__message-html');
        if (c) {
            const l = Array.from(c.querySelectorAll('p')).map(p => p.textContent.trim());
            if (l.length >= 3) GM_setClipboard(l[2]);
        }
    }

    function copyProviderAndMerchantID() {
        const c = document.querySelector('.ticket-conversation__message-text .ticket-conversation__message-html');
        if (c) {
            const l = Array.from(c.querySelectorAll('p')).map(p => p.textContent.trim());
            if (l.length >= 4) GM_setClipboard(`${l[2]}\n\n${l[3]}`);
        }
    }

    function awaitAct(target) {
        const currEx = document.querySelector('.ticket-fields__field-owner .el-input__inner');
        const takeBtn = document.querySelector('.ticket-fields__field-owner button');
        if (currEx && currEx.value === 'Неприсвоенный' && takeBtn) takeBtn.click();

        setTimeout(() => {
            const tgtOpt = Array.from(document.querySelectorAll('.el-select-dropdown__item span')).find(s => s.textContent.trim() === target);
            if (tgtOpt) tgtOpt.click();
        }, currEx && currEx.value !== 'Неприсвоенный' ? 100 : 500);
    }

    function closeTicket() {
        const currEx = document.querySelector('.ticket-fields__field-owner .el-input__inner');
        const takeBtn = document.querySelector('.ticket-fields__field-owner button');
        if (currEx && currEx.value === 'Неприсвоенный' && takeBtn) takeBtn.click();

        setTimeout(() => {
            const cBtnAct = document.querySelector('.ticket-fields__field-name button');
            if (cBtnAct) cBtnAct.click();

            setTimeout(() => {
                const stClosed = document.querySelector('.ticket-fields__field-name span');
                if (stClosed && stClosed.textContent.trim() !== 'Закрыт') cBtnAct.click();
            }, 500);
        }, currEx && currEx.value !== 'Неприсвоенный' ? 100 : 500);
    }

    function pushAction() {
        // Выполняем POST запрос для отправки комментария "пуш"
        const ticketId = window.location.pathname.split('/').pop();
        fetch(`https://sd-frt.com/ru/ticket/form/comment/id/${ticketId}`, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "content-type": "application/x-www-form-urlencoded",
                "x-requested-with": "XMLHttpRequest"
            },
            body: "editorCommentContent=%3Cp%3E%D0%BF%D1%83%D1%88%3C%2Fp%3E",
            method: "POST"
        }).then(response => {
            if (response.ok) {
                console.log('Комментарий "пуш" успешно отправлен');
                showTemporaryMessage('Комментарий добавлен');
            } else {
                console.error('Ошибка при отправке комментария');
            }
        }).catch(error => {
            console.error('Ошибка при выполнении запроса:', error);
        });
    }

    function showTemporaryMessage(message) {
        const msg = document.createElement('div');
        msg.textContent = message;
        msg.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; opacity: 1; transition: all 1s ease-in-out;`;
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.style.transform = 'translate(-50%, -150%)';
            msg.style.opacity = '0';
            setTimeout(() => document.body.removeChild(msg), 1000);
        }, 1000);
    }

    function addStyles() {
        const s = document.createElement('style');
        s.textContent = 'button:hover { transform: scale(1.05); box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); }';
        document.head.appendChild(s);
    }

    const obs = new MutationObserver(() => { addBtns(); });
    obs.observe(document.body, { childList: true, subtree: true });
    addBtns();
})();
