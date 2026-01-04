// ==UserScript==
// @name         Steam Stack Inventory
// @namespace    https://github.com/Kostya12rus/steam_inventory_stack/
// @supportURL   https://github.com/Kostya12rus/steam_inventory_stack/issues
// @version      1.0.1
// @description  Add a button in steam inventory for stack items
// @author       Kostya12rus
// @match        https://steamcommunity.com/profiles/*/inventory*
// @match        https://steamcommunity.com/id/*/inventory*
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/504036/Steam%20Stack%20Inventory.user.js
// @updateURL https://update.greasyfork.org/scripts/504036/Steam%20Stack%20Inventory.meta.js
// ==/UserScript==

(function() {
    'use strict';
    createButton();

    // Функция для создания кнопки
    function createButton() {
        const userSteamID = g_steamID;
        let { m_steamid } = g_ActiveInventory;
        let inProgress = false;
        if (userSteamID !== m_steamid) return;

        const button = document.createElement("button");
        button.innerText = "Stack Inventory";
        button.classList.add("btn_darkblue_white_innerfade");
        button.style.width = "100%";
        button.style.height = "30px";
        button.style.lineHeight = "30px";
        button.style.fontSize = "15px";
        button.style.position = "relative";
        button.style.zIndex = "2";

        // Добавляем обработчик события клика
        button.addEventListener("click", async function() {
            if (inProgress) return;
            inProgress = true;
            await startStackInventory()
            inProgress = false;
        });
        async function stackItem(item, leaderItem, token) {
            const { amount, id: fromitemid } = item;
            const { id: destitemid } = leaderItem;
            const {m_appid, m_steamid} = g_ActiveInventory;
            const steamToken = token;
            const url = 'https://api.steampowered.com/IInventoryService/CombineItemStacks/v1/';

            const data = {
                'access_token': steamToken,
                'appid': m_appid,
                'fromitemid': fromitemid,
                'destitemid': destitemid,
                'quantity': amount,
                'steamid': m_steamid,
            };
            try {
                await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams(data).toString()
                });
            } catch (error) {
                // логирование ошибки, если необходимо
            }
        }
        async function startStackInventory() {
            let token = document.querySelector("#application_config")?.getAttribute("data-loyalty_webapi_token");
            if (token) {
                token = token.replace(/"/g, "");
            }
            else {
                return;
            }
            const inventory = await getFullInventory();
            const totalItems = Object.values(inventory).reduce((sum, instanceDict) => {
                return sum + Object.values(instanceDict).reduce((instanceSum, items) => {
                    return instanceSum + items.length - 1; // -1 для исключения leaderItem
                }, 0);
            }, 0);
            if (totalItems < 2) {
                alert("Недостаточно предметов для объединения, либо не удалось получить список предметов. Пожалуйста, попробуйте позже");
                return;
            }

            let processedItems = 0;
            const progressModal = createProgressModal(totalItems);

            for (const classid in inventory) {
                if (inventory.hasOwnProperty(classid)) {
                    const instanceDict = inventory[classid];
                    for (const instanceid in instanceDict) {
                        if (instanceDict.hasOwnProperty(instanceid)) {
                            const items = instanceDict[instanceid];
                            if (items.length < 2) continue;
                            let leaderItem;
                            if (instanceid === "0") {
                                leaderItem = items[0];
                            } else {
                                leaderItem = items[items.length - 1];
                            }
                            for (const item of items) {
                                if (item === leaderItem) continue;
                                stackItem(item, leaderItem, token);
                                processedItems++;
                                updateProgressModal(progressModal, processedItems, totalItems);
                                await new Promise(resolve => setTimeout(resolve, 75));
                            }
                        }
                    }
                }
            }
            startCountdownAndClose(progressModal.overlay, progressModal.modal, progressModal.countdownText);
        }

        // Функция для создания модального окна
        function createProgressModal(totalItems) {
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            overlay.style.zIndex = '9999';
            overlay.style.display = 'flex';
            overlay.style.justifyContent = 'center';
            overlay.style.alignItems = 'center';
            overlay.style.transition = 'opacity 0.3s ease-in-out';
            overlay.style.opacity = '0';

            const modal = document.createElement('div');
            modal.style.padding = '30px';
            modal.style.backgroundColor = '#242424'; // Темно-серый цвет с легким оттенком
            modal.style.borderRadius = '12px';
            modal.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.5)';
            modal.style.textAlign = 'center';
            modal.style.color = '#e0e0e0'; // Светло-серый цвет для текста
            modal.style.width = '500px';
            modal.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
            modal.style.transform = 'scale(0.9)';
            modal.style.opacity = '0';

            const title = document.createElement('h3');
            title.innerText = 'Stacking Inventory Items...';
            title.style.marginBottom = '15px';
            title.style.fontSize = '22px'; // Немного увеличен размер шрифта
            title.style.fontWeight = 'bold';
            title.style.color = '#ffffff'; // Белый цвет для заголовка
            modal.appendChild(title);

            const progress = document.createElement('div');
            progress.style.marginTop = '20px';
            progress.style.position = 'relative';
            modal.appendChild(progress);

            const progressBar = document.createElement('div');
            progressBar.style.width = '100%';
            progressBar.style.height = '24px';
            progressBar.style.backgroundColor = '#333'; // Более темный цвет фона
            progressBar.style.borderRadius = '12px';
            progressBar.style.overflow = 'hidden';
            progressBar.style.position = 'relative'; // Добавлено позиционирование
            progress.appendChild(progressBar);

            const progressFill = document.createElement('div');
            progressFill.style.height = '100%';
            progressFill.style.width = '0%';
            progressFill.style.backgroundColor = '#008cba'; // Синий цвет для прогресса
            progressFill.style.transition = 'width 0.4s ease';
            progressFill.style.borderRadius = '12px';
            progressFill.style.position = 'absolute'; // Абсолютное позиционирование для заполнения
            progressFill.style.top = '0';
            progressFill.style.left = '0';
            progressBar.appendChild(progressFill);

            const progressBarText = document.createElement('span');
            progressBarText.style.position = 'absolute';
            progressBarText.style.top = '50%';
            progressBarText.style.left = '50%';
            progressBarText.style.transform = 'translate(-50%, -50%)';
            progressBarText.style.fontSize = '14px';
            progressBarText.style.color = '#ffffff';
            progressBarText.style.zIndex = '1';
            progressBarText.style.pointerEvents = 'none'; // Чтобы текст не перекрывал клики
            progressBar.appendChild(progressBarText);

            const progressText = document.createElement('div');
            progressText.style.marginTop = '15px';
            progressText.style.fontSize = '16px';
            progressText.style.color = '#f0f0f0';
            progressText.innerText = `0 of ${totalItems} items processed`;
            modal.appendChild(progressText);

            const countdownText = document.createElement('div');
            countdownText.style.marginTop = '20px';
            countdownText.style.fontSize = '16px';
            countdownText.style.color = '#ffcc00';  // Желтый цвет для обратного отсчета
            modal.appendChild(countdownText);

            const closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.marginTop = '25px';
            closeButton.style.padding = '12px 24px';
            closeButton.style.backgroundColor = '#008cba'; // Синий цвет для кнопки
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '8px';
            closeButton.style.color = '#fff'; // Белый цвет для текста кнопки
            closeButton.style.fontSize = '16px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.transition = 'background-color 0.3s ease';

            closeButton.onmouseover = () => {
                closeButton.style.backgroundColor = '#0077a3'; // Более темный синий при наведении
            };

            closeButton.onmouseout = () => {
                closeButton.style.backgroundColor = '#008cba'; // Возвращаем исходный цвет
            };

            closeButton.onclick = () => closeProgressModal(overlay);

            modal.appendChild(closeButton);

            overlay.appendChild(modal);
            document.body.appendChild(overlay);

            // Плавное появление оверлея и модального окна
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
                modal.style.transform = 'scale(1)';
                modal.style.opacity = '1';
            });

            return { modal, progressFill, progressText, countdownText, overlay, progressBarText };
        }


        // Функция для закрытия всплывающего окна с обратным отсчетом
        function startCountdownAndClose(overlay, modal, countdownText) {
            let countdown = 5;

            const interval = setInterval(() => {
                if (countdown > 0) {
                    countdownText.innerText = `Процесс завершен. Страница обновится через ${countdown} секунд...`;
                    countdown--;
                } else {
                    clearInterval(interval);
                    closeProgressModal(overlay);
                }
            }, 1000);
        }

        // Функция для закрытия всплывающего окна
        function closeProgressModal(overlay) {
            document.body.removeChild(overlay);
            window.location.reload();
        }

        // Функция для обновления прогресса
        function updateProgressModal({ progressFill, progressText, progressBarText }, processedItems, totalItems) {
            const progressPercentage = ((processedItems / totalItems) * 100).toFixed(1);
            progressFill.style.width = `${progressPercentage}%`;
            const timeLeft = (((totalItems-processedItems)*0.075).toFixed(1));
            progressBarText.innerText = `${progressPercentage}% (~${timeLeft} sec)`;
            progressText.innerText = `${processedItems} of ${totalItems} items processed`;
        }

        async function getFullInventory() {
            try {
                const inventoryItems = await getInventoryItems();
                const itemDict = {};
                for (const itemData of inventoryItems) {
                    for (const item of Object.values(itemData)) {
                        const { classid, instanceid } = item;
                        if (!itemDict[classid]) {
                            itemDict[classid] = {};
                        }
                        if (!itemDict[classid][instanceid]) {
                            itemDict[classid][instanceid] = [];
                        }
                        itemDict[classid][instanceid].push(item);
                    }
                }
                return itemDict;
            } catch (error) {
                console.error("Ошибка при получении предметов инвентаря:", error);
            }
            return {};
        }
        function getInventoryItems(start = 0, inventoryItems = []) {
            const {m_appid, m_contextid, m_steamid} = g_ActiveInventory;
            const url = `https://steamcommunity.com/profiles/${m_steamid}/inventory/json/${m_appid}/${m_contextid}/?start=${start}`;

            return fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.success) {
                    throw new Error("Не удалось получить данные инвентаря.");
                }
                inventoryItems = inventoryItems.concat(data.rgInventory || []);
                if (data.more) {
                    const more_start = data.more_start || 0;
                    if (Number.isInteger(more_start) && more_start > 0) {
                        return getInventoryItems(more_start, inventoryItems);
                    }
                }
                return inventoryItems;
            })
            .catch(error => {
                console.error("Ошибка проверки инвентаря:", error);
                throw error;
            });
        }


        // Функция для обновления текста кнопки с логированием
        function updateButtonText() {
            const gameNameElement = document.querySelector('.name_game');
            if (gameNameElement) {
                button.innerText = "Stack Inventory " + gameNameElement.textContent.trim();
            }
        }

        // Функция для ожидания появления элемента
        function waitForElement(selector) {
            return new Promise((resolve) => {
                const observer = new MutationObserver((mutations, observer) => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }

        // Наблюдатель для изменений в элементе с классом name_game с логированием
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'characterData') {
                    updateButtonText();
                }
            });
        });

        // Настройка наблюдателя
        waitForElement('.name_game').then((target) => {
            observer.observe(target, { childList: true, subtree: true, characterData: true });
            updateButtonText(); // Обновление текста кнопки сразу после установки наблюдателя
        });

        // Вставка кнопки с логированием
        const referenceElement = document.querySelector('#tabcontent_inventory');
        if (referenceElement) {
            referenceElement.parentNode.insertBefore(button, referenceElement);
            updateButtonText();
        }
    }
})();
