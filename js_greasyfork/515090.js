// ==UserScript==
// @name         Auto Leave Conversations
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Автоматически покидает выбранные переписки.
// @author       eretly
// @match        https://zelenka.guru/conversations/*
// @match        https://lolz.guru/conversations/*
// @match        https://lolz.live/conversations/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515090/Auto%20Leave%20Conversations.user.js
// @updateURL https://update.greasyfork.org/scripts/515090/Auto%20Leave%20Conversations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scriptNavigation = sessionStorage.getItem('scriptNavigation') === 'true';

    if (!scriptNavigation) {
        localStorage.removeItem('selectedConversations');
        localStorage.removeItem('leavingInProgress');
        localStorage.removeItem('selectedRadioOption');
    } else {
        sessionStorage.removeItem('scriptNavigation');
    }

    const selectedConversations = JSON.parse(localStorage.getItem('selectedConversations')) || [];
    const leavingInProgress = localStorage.getItem('leavingInProgress') === 'true';
    let isLeaving = false;
    const selectedRadioOption = localStorage.getItem('selectedRadioOption') || 'delete';

    const leaveFormHTML = `
        <div id="leave-conversation-form" style="border: 1px solid #ccc; border-radius: 6px; padding: 20px; width: 300px; background: #272727; position: fixed; top: 50px; right: 20px; z-index: 9999; display: none;">
            <h2 class="heading h1">Покинуть переписку:</h2>
            <p>Если покинуть переписку, она исчезнет из Вашего списка.</p>

            <dl class="ctrlUnit">
                <dt><label for="delete_type_delete">Обработка новых ответов:</label></dt>
                <dd>
                    <ul>
                        <li>
                            <label for="delete_type_delete">
                                <input type="radio" name="delete_type" value="delete" id="delete_type_delete" ${selectedRadioOption === 'delete' ? 'checked' : ''}>
                                Принимать последующие сообщения
                            </label>
                            <p class="hint">Если появятся новые ответы, то переписка будет восстановлена у Вас во входящих.</p>
                        </li>
                        <li>
                            <label for="delete_type_delete_ignore">
                                <input type="radio" name="delete_type" value="delete_ignore" id="delete_type_delete_ignore" ${selectedRadioOption === 'delete_ignore' ? 'checked' : ''}>
                                Игнорировать последующие сообщения
                            </label>
                            <p class="hint">Вы не будете получать уведомления о новых ответах, а переписка будет оставаться удалённой.</p>
                        </li>
                    </ul>
                </dd>
            </dl>

            <dl class="ctrlUnit submitUnit">
                <dt></dt>
                <dd>
                    <button id="submit-leave" class="button primary">Покинуть переписку</button>
                    <button id="cancel-leave" class="button OverlayCloser">Отмена</button>
                </dd>
            </dl>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', leaveFormHTML);

    // Утилиты для надежной работы
    function waitForElement(selector, timeout = 5000, parent = document) {
        return new Promise((resolve, reject) => {
            const element = parent.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = parent.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(parent, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Элемент ${selector} не найден за ${timeout}мс`));
            }, timeout);
        });
    }

    async function safeClick(element, maxRetries = 3) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                if (element && typeof element.click === 'function') {
                    element.click();
                    return true;
                } else if (element) {
                    const event = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    element.dispatchEvent(event);
                    return true;
                }
            } catch (error) {
                console.log(`Попытка клика ${i + 1} неудачна:`, error);
                if (i < maxRetries - 1) {
                    await delay(200);
                }
            }
        }
        return false;
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getCurrentConversationId() {
        const urlMatch = window.location.pathname.match(/\/conversations\/(\d+)/);
        return urlMatch ? urlMatch[1] : null;
    }

    function getBaseUrl() {
        return window.location.origin;
    }

    document.addEventListener('click', (e) => {
        if (e.ctrlKey && e.target.closest('.conversationItem')) {
            e.preventDefault();
            toggleConversationSelection(e.target.closest('.conversationItem'));
        }
    });

    // Обработчик для выбора/снятия всех переписок
    document.addEventListener('mousedown', (e) => {
        if (e.ctrlKey && e.button === 1) { // Средняя кнопка мыши + Ctrl
            e.preventDefault();
            const conversationList = document.querySelector('#ConversationListItems');
            if (conversationList && e.target.closest('#ConversationListItems')) {
                toggleAllConversations();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            if (selectedConversations.length > 0) {
                showLeaveForm();
            } else {
                console.log("Нет выбранных переписок для покидания.");
            }
        }
    });

    document.getElementById('submit-leave').addEventListener('click', async () => {
        const selectedRadio = document.querySelector('input[name="delete_type"]:checked');
        if (selectedRadio) {
            localStorage.setItem('selectedRadioOption', selectedRadio.value);
            await leaveSelectedConversations();
            hideLeaveForm();
        }
    });

    document.getElementById('cancel-leave').addEventListener('click', hideLeaveForm);

    if (leavingInProgress) {
        setTimeout(() => {
            leaveSelectedConversations();
        }, 1000);
    }

    function toggleConversationSelection(conversationItem) {
        const conversationId = conversationItem.dataset.cid;

        if (selectedConversations.includes(conversationId)) {
            selectedConversations.splice(selectedConversations.indexOf(conversationId), 1);
            conversationItem.style.backgroundColor = '';
        } else {
            selectedConversations.push(conversationId);
            conversationItem.style.backgroundColor = '#48b04cb2';
        }

        localStorage.setItem('selectedConversations', JSON.stringify(selectedConversations));
    }

    function toggleAllConversations() {
        const conversationItems = document.querySelectorAll('.conversationItem');

        if (conversationItems.length === 0) {
            console.log("Переписки не найдены");
            return;
        }

        const allConversationIds = Array.from(conversationItems).map(item => item.dataset.cid);
        const allSelected = allConversationIds.every(id => selectedConversations.includes(id));

        if (allSelected) {
            console.log("Снимаем выделение со всех переписок");
            conversationItems.forEach(item => {
                const cid = item.dataset.cid;
                const index = selectedConversations.indexOf(cid);
                if (index > -1) {
                    selectedConversations.splice(index, 1);
                }
                item.style.backgroundColor = '';
            });
        } else {
            console.log("Выбираем все переписки");
            conversationItems.forEach(item => {
                const cid = item.dataset.cid;
                if (!selectedConversations.includes(cid)) {
                    selectedConversations.push(cid);
                }
                item.style.backgroundColor = '#48b04cb2';
            });
        }

        localStorage.setItem('selectedConversations', JSON.stringify(selectedConversations));
        console.log(`Выбрано переписок: ${selectedConversations.length}`);
    }

    async function leaveSelectedConversations() {
        if (isLeaving) return;
        if (selectedConversations.length === 0) {
            console.log("Нет выбранных переписок.");
            return;
        }

        isLeaving = true;
        localStorage.setItem('leavingInProgress', 'true');

        const remainingConversations = [...selectedConversations];
        const baseUrl = getBaseUrl();

        for (const cid of remainingConversations) {
            try {
                console.log(`Начинаем обработку переписки с ID: ${cid}`);

                const currentCid = getCurrentConversationId();
                if (currentCid !== cid) {
                    console.log(`Переходим к переписке ${cid}`);

                    sessionStorage.setItem('scriptNavigation', 'true');

                    window.location.href = `${baseUrl}/conversations/${cid}/`;

                    await new Promise(resolve => {
                        const checkLoad = () => {
                            if (document.readyState === 'complete' && getCurrentConversationId() === cid) {
                                resolve();
                            } else {
                                setTimeout(checkLoad, 100);
                            }
                        };
                        checkLoad();
                    });

                    await delay(300);
                }

                console.log('Ищем кнопку меню...');
                const menuButton = await waitForElement('.membersAndActions .PopupControl', 3000);
                console.log(`Найдена кнопка меню для переписки с ID: ${cid}`);

                const menuClicked = await safeClick(menuButton);
                if (!menuClicked) {
                    console.error(`Не удалось кликнуть по кнопке меню для переписки ${cid}`);
                    continue;
                }

                await delay(200);

                console.log('Ищем ссылку выхода...');
                const leaveLink = await waitForElement(`a[href*="conversations/${cid}/leave"]`, 2000);
                console.log(`Найдена ссылка выхода для переписки с ID: ${cid}`);

                const leaveLinkClicked = await safeClick(leaveLink);
                if (!leaveLinkClicked) {
                    console.error(`Не удалось кликнуть по ссылке выхода для переписки ${cid}`);
                    continue;
                }

                await delay(200);

                console.log('Ищем форму...');
                const form = await waitForElement('form.xenForm', 3000);
                console.log(`Найдена форма для переписки с ID: ${cid}`);

                const selectedOption = localStorage.getItem('selectedRadioOption');
                if (selectedOption) {
                    try {
                        const radioOption = await waitForElement(
                            `input[name="delete_type"][value="${selectedOption}"]`,
                            1000,
                            form
                        );
                        console.log(`Выбираем радиокнопку: ${selectedOption}`);
                        await safeClick(radioOption);
                        await delay(200);
                    } catch (error) {
                        console.log(`Радиокнопка не найдена или не обязательна: ${error.message}`);
                    }
                }

                console.log('Ищем кнопку отправки...');
                const submitButton = await waitForElement('input[type="submit"]', 2000, form);
                console.log(`Найдена кнопка отправки для переписки с ID: ${cid}`);

                const submitClicked = await safeClick(submitButton);
                if (!submitClicked) {
                    console.error(`Не удалось кликнуть по кнопке отправки для переписки ${cid}`);
                    continue;
                }

                console.log(`Покинута переписка с ID: ${cid}`);

                const index = selectedConversations.indexOf(cid);
                if (index > -1) {
                    selectedConversations.splice(index, 1);
                    localStorage.setItem('selectedConversations', JSON.stringify(selectedConversations));
                }

                await delay(500);

            } catch (error) {
                console.error(`Ошибка при обработке переписки ${cid}:`, error);
                continue;
            }
        }

        localStorage.removeItem('leavingInProgress');
        isLeaving = false;
        console.log('Завершена обработка всех переписок');

        window.location.href = `${baseUrl}/conversations/`;
    }

    function showLeaveForm() {
        document.getElementById('leave-conversation-form').style.display = 'block';
    }

    function hideLeaveForm() {
        document.getElementById('leave-conversation-form').style.display = 'none';
    }

    function simulateClick(element) {
        const mouseEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(mouseEvent);
    }
})();