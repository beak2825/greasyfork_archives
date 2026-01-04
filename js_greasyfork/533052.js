// ==UserScript==
// @name         LOLZ Live Contest Counter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Добавляет значение лимита конкурсов в симпатии в профиль.
// @author       QIYANA
// @match        https://lolz.live/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      lolz.live
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533052/LOLZ%20Live%20Contest%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/533052/LOLZ%20Live%20Contest%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createRPGModal({ title, message, input = false, onConfirm }) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '9999';

        const modalContent = document.createElement('div');
        modalContent.style.background = 'linear-gradient(135deg, #f5e9f5 0%, #e0f7fa 100%)';
        modalContent.style.backgroundImage = 'url("https://www.transparenttextures.com/patterns/stardust.png")';
        modalContent.style.opacity = '0.98';
        modalContent.style.border = '4px solid #ff80ab';
        modalContent.style.padding = '25px';
        modalContent.style.borderRadius = '20px';
        modalContent.style.boxShadow = '0 0 20px rgba(255, 128, 171, 0.5), 0 0 40px rgba(179, 229, 252, 0.3)';
        modalContent.style.width = '450px';
        modalContent.style.fontFamily = '"M PLUS Rounded 1c", "Anime Ace", "Comic Sans MS", sans-serif';
        modalContent.style.color = '#ffffff';
        modalContent.style.textAlign = 'center';
        modalContent.style.position = 'relative';
        modalContent.style.animation = 'sparkle 4s infinite';

        const styleSheet = document.createElement('style');
        styleSheet.textContent = `
            @keyframes sparkle {
                0%, 100% { box-shadow: 0 0 20px rgba(255, 128, 171, 0.5), 0 0 40px rgba(179, 229, 252, 0.3); }
                50% { box-shadow: 0 0 30px rgba(255, 128, 171, 0.7), 0 0 50px rgba(179, 229, 252, 0.5); }
            }
        `;
        document.head.appendChild(styleSheet);

        const titleElement = document.createElement('h2');
        titleElement.textContent = title;
        titleElement.style.margin = '0 0 15px 0';
        titleElement.style.fontSize = '28px';
        titleElement.style.textShadow = '0 0 8px rgba(255, 128, 171, 1), 0 0 16px rgba(179, 229, 252, 1)';
        titleElement.style.color = '#ffffff';
        titleElement.style.fontWeight = 'bold';
        modalContent.appendChild(titleElement);

        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.margin = '0 0 20px 0';
        messageElement.style.fontSize = '18px';
        messageElement.style.lineHeight = '1.5';
        messageElement.style.color = '#ffffff';
        messageElement.style.textShadow = '0 0 3px rgba(255, 128, 171, 0.8), 0 0 6px rgba(179, 229, 252, 0.8)';
        modalContent.appendChild(messageElement);

        let inputElement;
        if (input) {
            inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.placeholder = 'Введите путь к данным...';
            inputElement.style.width = '100%';
            inputElement.style.padding = '10px';
            inputElement.style.marginBottom = '20px';
            inputElement.style.border = '3px solid #ff80ab';
            inputElement.style.borderRadius = '8px';
            inputElement.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            inputElement.style.color = '#c2185b';
            inputElement.style.fontFamily = 'inherit';
            inputElement.style.fontSize = '16px';
            inputElement.style.boxShadow = '0 0 10px rgba(255, 128, 171, 0.4)';
            inputElement.style.zIndex = '10000';
            inputElement.style.pointerEvents = 'auto';
            modalContent.appendChild(inputElement);

            setTimeout(() => {
                inputElement.focus();
                console.log('Фокус установлен на поле ввода');
            }, 100);
        }

        const confirmButton = document.createElement('button');
        confirmButton.textContent = input ? 'Подтвердить' : 'Закрыть';
        confirmButton.style.padding = '12px 25px';
        confirmButton.style.background = 'linear-gradient(135deg, #ff80ab 0%, #b3e5fc 100%)';
        confirmButton.style.border = '3px solid #ff80ab';
        confirmButton.style.borderRadius = '10px';
        confirmButton.style.color = '#ffffff';
        confirmButton.style.fontFamily = 'inherit';
        confirmButton.style.fontSize = '18px';
        confirmButton.style.fontWeight = 'bold';
        confirmButton.style.cursor = 'pointer';
        confirmButton.style.boxShadow = '0 0 15px rgba(255, 128, 171, 0.7)';
        confirmButton.style.transition = 'all 0.3s';
        confirmButton.style.position = 'relative';
        confirmButton.style.overflow = 'hidden';
        confirmButton.addEventListener('mouseover', () => {
            confirmButton.style.boxShadow = '0 0 25px rgba(255, 128, 171, 0.9)';
            confirmButton.style.animation = 'sparkle 1.5s infinite';
        });
        confirmButton.addEventListener('mouseout', () => {
            confirmButton.style.boxShadow = '0 0 15px rgba(255, 128, 171, 0.7)';
            confirmButton.style.animation = 'none';
        });
        confirmButton.addEventListener('click', () => {
            const value = input ? inputElement.value : null;
            document.body.removeChild(modal);
            if (onConfirm) onConfirm(value);
        });
        modalContent.appendChild(confirmButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        return new Promise((resolve) => {
            confirmButton.addEventListener('click', () => {
                const value = input ? inputElement.value : null;
                resolve(value);
            });
        });
    }

    let profileUrl = GM_getValue('profileUrl');
    if (!profileUrl) {
        createRPGModal({
            title: '✨ Запись в магическом нейро-свитке ✨',
            message: 'О, путник-чан! Назови путь к своему профилю в этой цифровой реальности! (Пример: https://lolz.live/kqlol/) 💖',
            input: true,
            onConfirm: (value) => {
                if (value) {
                    profileUrl = value.trim().replace(/\/$/, '');
                    GM_setValue('profileUrl', profileUrl);
                    location.reload();
                } else {
                    createRPGModal({
                        title: '🌸 Свиток данных пуст! 🌸',
                        message: 'Ты не указал путь к профилю. Моя нейромагия не сработает без этого! (ノД`)・゜・。',
                        onConfirm: () => {
                            location.reload();
                        }
                    });
                }
            }
        });
        return;
    }

    const currentUrl = window.location.href.replace(/\/$/, '');
    if (!currentUrl.startsWith(profileUrl)) {
        return;
    }

    document.addEventListener('keydown', (event) => {
        if (event.altKey && event.key.toLowerCase() === 'l') {
            GM_deleteValue('profileUrl');
            createRPGModal({
                title: '💿 Ссылка сброшена 💿',
                message: 'Ссылка на профиль сброшена. Перезагружаю магическую матрицу! ^_^. 💫',
                onConfirm: () => {
                    location.reload();
                }
            });
        }
    });

    function waitForElement(selector, callback, timeout = 10000) {
        const startTime = Date.now();
        const checkElement = () => {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
            } else if (Date.now() - startTime < timeout) {
                setTimeout(checkElement, 500);
            } else {
                console.error(`Элемент ${selector} не найден за ${timeout / 1000} секунд`);
            }
        };
        checkElement();
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "https://lolz.live/forums/contests/",
        withCredentials: true,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const counterElement = doc.querySelector('div.limitCounter .counterText');
            if (!counterElement) {
                console.error("Элемент div.limitCounter .counterText не найден на странице конкурсов");
                return;
            }

            const counterText = counterElement.textContent.trim();

            const computedStyles = getComputedStyle(counterElement);
            const counterStyles = {
                color: computedStyles.color,
                fontSize: computedStyles.fontSize,
                fontWeight: computedStyles.fontWeight,
                fontFamily: computedStyles.fontFamily
            };

            waitForElement('a.page_counter[href$="/likes"]', (pageCounter) => {
                const originalTitle = pageCounter.getAttribute('data-cachedtitle') || '';
                const newTitle = `${originalTitle}<br><div class="counterText">Лимит участий - ${counterText}</div>`;

                pageCounter.setAttribute('data-cachedtitle', newTitle);
                pageCounter.removeAttribute('title');

                pageCounter.addEventListener('mouseover', () => {
                    setTimeout(() => {
                        const tooltip = document.querySelector('div[id^="tippy-"] .tippy-content');
                        if (tooltip && tooltip.textContent.includes(originalTitle)) {
                            tooltip.innerHTML = `${originalTitle}<br><div class="counterText">Лимит участий - ${counterText}</div>`;
                            const counterDiv = tooltip.querySelector('.counterText');
                            if (counterDiv) {
                                counterDiv.style.color = counterStyles.color;
                                counterDiv.style.fontSize = counterStyles.fontSize;
                                counterDiv.style.fontWeight = counterStyles.fontWeight;
                                counterDiv.style.fontFamily = counterStyles.fontFamily;
                            }
                        }
                    }, 100);
                });
            });
        },
        onerror: function(err) {
            console.error("Ошибка при запросе страницы конкурсов:", err);
        }
    });
})();