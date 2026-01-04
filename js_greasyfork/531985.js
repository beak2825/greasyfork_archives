// ==UserScript==
// @name         Автопереход на Flicksbar с Google
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @icon         https://icons.iconarchive.com/icons/designbolts/free-multimedia/256/Film-icon.png
// @description  Находит ссылку на Кинопоиск и переходит на Flicksbar
// @match        *://www.google.com/search*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531985/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%20%D0%BD%D0%B0%20Flicksbar%20%D1%81%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/531985/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%B5%D1%80%D0%B5%D1%85%D0%BE%D0%B4%20%D0%BD%D0%B0%20Flicksbar%20%D1%81%20Google.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function showConfirmWithTimeout(flicksbarUrl, timeout = 5000) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px',
                backgroundColor: '#EEE8AA',
                border: '1px solid #ccc',
                zIndex: '9999',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
            });

            const message = document.createElement('p');
            message.style.color = 'black';
            message.innerHTML = `<b>Переход на Flicksbar</b> <br><br>Перейти по ссылке: <b>${flicksbarUrl}</b> ?`;
            modal.appendChild(message);

            const okButton = document.createElement('button');
            okButton.textContent = 'Да';
            Object.assign(okButton.style, {
                marginRight: '10px',
                padding: '5px 10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
            });
            okButton.onclick = () => {
                resolve(true);
                modal.remove();
            };
            modal.appendChild(okButton);

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Нет';
            Object.assign(cancelButton.style, {
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '5px',
            });
            cancelButton.onclick = () => {
                resolve(false);
                modal.remove();
            };
            modal.appendChild(cancelButton);

            document.body.appendChild(modal);

            setTimeout(() => {
                resolve(false);
                modal.remove();
            }, timeout);
        });
    }

    async function tryRedirect() {
        const kpLink = document.querySelector('a[href*="kinopoisk.ru/film/"]');
        if (!kpLink) return;

        const match = kpLink.href.match(/kinopoisk\.ru\/film\/(\d+)/);
        if (!match) return;

        const kpId = match[1];
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('flcks_type') || 'film';

        const flicksbarUrl = `https://flicksbar.mom/${type}/${kpId}/`;
        await showConfirmWithTimeout(flicksbarUrl, 5000).then(answer => {
            if (answer) window.location.href = flicksbarUrl;
            else console.log('Переход отменен пользователем или истек таймаут.');
        });
    }

    // Запуск, как только DOM доступен
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryRedirect);
    } else {
        tryRedirect();
    }
})();
