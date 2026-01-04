// ==UserScript==
// @name         AnimeStars Auto-Trader Bot
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Авто-трейдер карт
// @author       Nickmur
// @match        *://*.animestars.org/user/cards*
// @match        *://*.animestars.org/cards/users/*
// @match        *://*.animestars.org/cards/*/trade/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        window.close
// @grant        window.open
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540339/AnimeStars%20Auto-Trader%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/540339/AnimeStars%20Auto-Trader%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // ГЛОБАЛЬНЫЕ ФУНКЦИИ И УПРАВЛЕНИЕ СОСТОЯНИЕМ
    // =================================================================================

    const state = {
        tradeActive: GM_getValue('autoTradeActive', false),
        tradeOfferCount: GM_getValue('tradeOfferCount', 1)
    };

    function clearTradeState() {
        GM_deleteValue('autoTradeActive');
        GM_deleteValue('targetCardId');
        GM_deleteValue('targetCardRank');
        GM_deleteValue('ownersQueue');
        GM_deleteValue('myTradeableCards');
        GM_deleteValue('tradeInProgress');
        GM_deleteValue('tradeStartTime');
        GM_deleteValue('tradeHaltReason'); // Очищаем и флаг остановки
        console.log('[AutoTrader] Состояние автообмена очищено.');
    }

    function createControlPanel() {
        if (document.getElementById('gemini-control-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'gemini-control-panel';
        let container = document.querySelector('.page-header__title, .ncard__info-title');
        if (container) {
            panel.style.cssText = 'padding: 10px; border: 1px solid #333; margin-top: 15px; margin-bottom: 15px; border-radius: 5px; display: flex; flex-wrap: wrap; gap: 10px; align-items: center;';
            container.insertAdjacentElement('afterend', panel);
        } else {
            console.warn('[AutoTrader] Не найдено стандартное место для панели. Создаем плавающую панель.');
            panel.style.cssText = 'position: fixed; top: 80px; left: 15px; z-index: 10000; padding: 10px; background: rgba(40, 40, 40, 0.9); border: 1px solid #999; border-radius: 5px; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(panel);
        }
    }

    function createButton(text, id, onClick) {
        const panel = document.getElementById('gemini-control-panel');
        if (!panel || document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.innerHTML = text;
        btn.id = id;
        btn.className = 'button';
        btn.style.backgroundColor = (id.includes('cancel') || id.includes('stop') || id.includes('remove')) ? '#E53935' : (id.includes('mode') ? '#ff9800' : '#4CAF50');
        btn.style.color = 'white';
        btn.style.padding = '5px 10px';
        btn.style.fontSize = '12px';
        btn.style.height = 'auto';
        btn.style.lineHeight = 'normal';
        btn.onclick = onClick;
        panel.appendChild(btn);
    }

    function getCardIdFromImageUrl(url) {
        if (!url) return null;
        const match = url.match(/\/cards_image\/(\d+)\//);
        return match ? match[1] : null;
    }

    async function fetchAllTradeableCards(username, statusCallback) {
        return new Promise((resolve, reject) => {
            statusCallback('Начинаем сбор ваших карт...');
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            let allCards = [];
            let pageCount = 1;
            iframe.onload = () => {
                try {
                    const doc = iframe.contentDocument;
                    if (!doc) throw new Error("Нет доступа к iframe.");
                    statusCallback(`Сканируем страницу ${pageCount}...`);
                    doc.querySelectorAll('.anime-cards__item').forEach(card => {
                        allCards.push({
                            id: card.dataset.id,
                            rank: card.dataset.rank,
                            name: card.dataset.name,
                            image: card.dataset.image
                        });
                    });
                    const nextPageLink = doc.querySelector('.pagination__pages-btn a');
                    if (nextPageLink && nextPageLink.href) {
                        pageCount++;
                        iframe.src = nextPageLink.href;
                    } else {
                        document.body.removeChild(iframe);
                        resolve(allCards);
                    }
                } catch (error) {
                    document.body.removeChild(iframe);
                    reject(error);
                }
            };
            iframe.onerror = () => reject(new Error("Ошибка загрузки iframe."));
            iframe.src = `/user/cards/trade/?name=${username}`;
        });
    }

    // =================================================================================
    // ИНИЦИАЛИЗАЦИЯ ИНТЕРФЕЙСА
    // =================================================================================

    function initializeUI() {
        createControlPanel();

        // --- Страница вашей коллекции ---
        if (window.location.pathname.startsWith('/user/cards') && !window.location.pathname.includes('/trade')) {
            const loggedInUser = document.querySelector('.lgn__name span')?.textContent.trim();
            const pageOwner = new URLSearchParams(window.location.search).get('name');
            if (loggedInUser && (pageOwner === null || loggedInUser === pageOwner)) {
                createButton('➕ Добавить все видимые в обмен', 'addAllToTradeBtn', async () => {
                    const button = document.getElementById('addAllToTradeBtn');
                    button.disabled = true;
                    const cards = document.querySelectorAll('.anime-cards__item');
                    let addedCount = 0;
                    for (let i = 0; i < cards.length; i++) {
                        button.innerHTML = `В процессе... (${i + 1}/${cards.length})`;
                        cards[i].click();
                        await new Promise(r => setTimeout(r, 350));
                        const tradeButton = document.querySelector('.all-owners[onclick*="ProposeAdd.call"]');
                        if (tradeButton) {
                            tradeButton.click();
                            addedCount++;
                            await new Promise(r => setTimeout(r, 350));
                        } else {
                            document.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Escape' }));
                            await new Promise(r => setTimeout(r, 200));
                        }
                    }
                    alert(`Завершено. Добавлено: ${addedCount} из ${cards.length}.`);
                    button.disabled = false;
                    button.innerHTML = '➕ Добавить все видимые в обмен';
                });
            }
        }

        // --- Страница вашего списка обмена ---
        if (window.location.pathname.startsWith('/user/cards/trade')) {
            const loggedInUser = document.querySelector('.lgn__name span')?.textContent.trim();
            const pageOwner = new URLSearchParams(window.location.search).get('name');
            if (loggedInUser && pageOwner && loggedInUser === pageOwner) {
                createButton('➖ Удалить все видимые', 'removeAllFromTradeBtn', async () => {
                    const button = document.getElementById('removeAllFromTradeBtn');
                    button.disabled = true;
                    const removeButtons = document.querySelectorAll('button.card-offer-remove-btn');
                    if(removeButtons.length === 0) {
                        alert('Нет карт для удаления.');
                        button.disabled = false;
                        return;
                    }
                    for (let i = 0; i < removeButtons.length; i++) {
                        button.innerHTML = `Удаление... (${i + 1}/${removeButtons.length})`;
                        removeButtons[i].click();
                        await new Promise(r => setTimeout(r, 250));
                    }
                    alert(`Завершено. Отправлено ${removeButtons.length} запросов. Страница будет перезагружена.`);
                    window.location.reload();
                });
            }
        }

        // --- Контрольная панель (страница владельцев) ---
        if (window.location.pathname.startsWith('/cards/users/')) {
            if (state.tradeActive) {
                const statusDiv = document.createElement('div');
                statusDiv.id = 'autotrade_status_div';
                statusDiv.style.cssText = 'width: 100%; padding: 10px; background: #222; border-radius: 4px; color: white;';
                document.getElementById('gemini-control-panel').appendChild(statusDiv);

                const processOwnersQueue = () => {
                    // НОВОЕ: Проверяем, не пришел ли сигнал на полную остановку
                    const haltReason = GM_getValue('tradeHaltReason', null);
                    if (haltReason) {
                        console.log('[AutoTrader] Получен сигнал на полную остановку.');
                        alert(`Авто-обмен остановлен по причине: ${haltReason}.`);
                        clearTradeState(); // Очищаем все состояние
                        window.location.reload();
                        return; // Прекращаем выполнение цикла
                    }

                    const statusDiv = document.getElementById('autotrade_status_div');
                    if (!statusDiv) return;

                    const tradeInProgress = GM_getValue('tradeInProgress', false);
                    const startTime = GM_getValue('tradeStartTime', 0);
                    const timeElapsed = (Date.now() - startTime) / 1000;

                    if (tradeInProgress && timeElapsed > 180) {
                        console.warn('[AutoTrader] Обмен занял слишком много времени. Сбрасываем и продолжаем.');
                        GM_deleteValue('tradeInProgress');
                        GM_deleteValue('tradeStartTime');
                        setTimeout(processOwnersQueue, 500);
                        return;
                    }

                    if (tradeInProgress) {
                        statusDiv.innerHTML = `⏳ Ожидание завершения предыдущего обмена... (прошло ${Math.round(timeElapsed)} сек)`;
                        setTimeout(processOwnersQueue, 1500);
                        return;
                    }

                    const ownersQueue = JSON.parse(GM_getValue('ownersQueue', '[]'));
                    if (ownersQueue.length > 0) {
                        const nextOwner = ownersQueue.shift();
                        GM_setValue('ownersQueue', JSON.stringify(ownersQueue));
                        GM_setValue('tradeInProgress', true);
                        GM_setValue('tradeStartTime', Date.now());
                        statusDiv.innerHTML = `Открываю вкладку... Осталось: <b>${ownersQueue.length}</b>.`;

                        const tradeTab = window.open(nextOwner, '_blank');
                        if (!tradeTab) {
                            alert('Не удалось открыть новую вкладку. Пожалуйста, разрешите всплывающие окна для этого сайта.');
                            clearTradeState();
                            window.location.reload();
                            return;
                        }
                        setTimeout(processOwnersQueue, 1500);
                    } else {
                        statusDiv.innerHTML = '✅ Обмен со всеми доступными владельцами завершен!';
                        alert('Процесс обмена завершен!');
                        clearTradeState();
                        window.location.reload();
                    }
                };
                processOwnersQueue();

                createButton('❌ Остановить обмены', 'cancelAutoTradeBtn', () => {
                    clearTradeState();
                    alert('Автоматический обмен отменен.');
                    window.location.reload();
                });

            } else {
                createButton('🚀 Начать автообмен', 'startAutoTradeBtn', async () => {
                    const startButton = document.getElementById('startAutoTradeBtn');
                    startButton.disabled = true; startButton.innerHTML = 'Идет подготовка...';
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'autotrade_status_div';
                    statusDiv.style.cssText = 'width: 100%; padding: 10px; background: #222; border-radius: 4px; color: white;';
                    document.getElementById('gemini-control-panel').appendChild(statusDiv);

                    try {
                        const username = document.querySelector('.lgn__name span')?.textContent.trim();
                        if (!username) throw new Error('Не удалось определить ваш никнейм.');
                        const myCards = await fetchAllTradeableCards(username, (status) => { statusDiv.innerHTML = status; });
                        GM_setValue('myTradeableCards', JSON.stringify(myCards));
                        statusDiv.innerHTML = `Собрано ${myCards.length} карт. Начинаем...`;
                        await new Promise(res => setTimeout(res, 1000));

                        const targetCardImage = document.querySelector('.ncard__img img');
                        const rankElement = document.querySelector('[class*="ncard__rank rank-"]');
                        const targetCardRank = rankElement ? rankElement.className.match(/rank-([sabcde])s?/)[1] : null;
                        if (!targetCardImage || !targetCardRank) throw new Error('Не удалось определить ID или ранг целевой карты.');
                        const targetCardId = getCardIdFromImageUrl(targetCardImage.src);
                        if (!targetCardId) throw new Error('Не удалось извлечь ID аниме.');
                        GM_setValue('targetCardId', targetCardId);
                        GM_setValue('targetCardRank', targetCardRank);

                        // НОВОЕ: Проверка наличия карт перед запуском
                        const offerCount = GM_getValue('tradeOfferCount', 1);
                        const suitableCards = myCards.filter(c => c.rank === targetCardRank);
                        if (suitableCards.length < offerCount) {
                            throw new Error(`Недостаточно карт для начала обмена. Требуется ${offerCount} карт(ы) ранга "${targetCardRank.toUpperCase()}", а у вас в списке обмена только ${suitableCards.length}.`);
                        }
                        GM_deleteValue('tradeHaltReason'); // Сбрасываем флаг перед стартом

                        const ownersQueue = Array.from(document.querySelectorAll('.card-show__owner'))
                            .filter(o => !o.querySelector('.fa-lock, .fa-user, .fa-star, .fa-exchange, .fa-trophy-alt'))
                            .map(o => o.href);

                        if (ownersQueue.length === 0) throw new Error('Нет подходящих владельцев для обмена.');
                        GM_setValue('ownersQueue', JSON.stringify(ownersQueue));
                        GM_setValue('autoTradeActive', true);

                        alert(`Начинаем обмен на карту ранга "${targetCardRank.toUpperCase()}". Найдено ${ownersQueue.length} подходящих владельцев.`);
                        window.location.reload();
                    } catch (error) {
                        alert(`Ошибка: ${error.message}`);
                        statusDiv.innerHTML = `Ошибка: ${error.message}`;
                        startButton.disabled = false; startButton.innerHTML = '🚀 Начать автообмен';
                    }
                });
                createButton(`Кол-во карт для обмена: ${state.tradeOfferCount}`, 'tradeModeBtn', () => {
                    let currentMode = GM_getValue('tradeOfferCount', 1);
                    currentMode = currentMode >= 3 ? 1 : currentMode + 1;
                    GM_setValue('tradeOfferCount', currentMode);
                    document.getElementById('tradeModeBtn').innerHTML = `Кол-во карт для обмена: ${currentMode}`;
                });
            }
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initializeUI);
    } else {
        initializeUI();
    }


    // =================================================================================
    // ЛОГИКА ДЛЯ РАБОЧИХ ВКЛАДОК
    // =================================================================================

    function closeTradeWindow() {
        GM_deleteValue('tradeInProgress');
        GM_deleteValue('tradeStartTime');
        window.close();
    }


    if (state.tradeActive && !window.location.pathname.startsWith('/cards/users/')) {

        if (window.location.pathname.includes('/cards/') && window.location.pathname.includes('/trade/')) {
            const observer = new MutationObserver((mutations) => {
                for(const mutation of mutations) {
                    if (mutation.addedNodes.length > 0) {
                        const messageNode = document.querySelector('.message-info__content');
                        if (messageNode && messageNode.textContent.includes('Обмен отправлен')) {
                            console.log('[Worker] Обмен успешно отправлен. Закрываем вкладку.');
                            observer.disconnect();
                            const usedCardIds = JSON.parse(GM_getValue('usedCardIds', '[]'));
                            if (usedCardIds.length > 0) {
                                let myTradeableCards = JSON.parse(GM_getValue('myTradeableCards', '[]'));
                                const updatedCards = myTradeableCards.filter(card => !usedCardIds.includes(card.id));
                                GM_setValue('myTradeableCards', JSON.stringify(updatedCards));
                                GM_deleteValue('usedCardIds');
                                console.log(`[Worker] ${usedCardIds.length} карт(а) удалена из списка для обмена.`);
                            }
                            setTimeout(closeTradeWindow, 1000);
                            return;
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });

            const findAndOfferCards = async () => {
                const myTradeableCards = JSON.parse(GM_getValue('myTradeableCards', '[]'));
                const targetRank = GM_getValue('targetCardRank');
                const offerCount = GM_getValue('tradeOfferCount', 1);

                const suitableCards = myTradeableCards.filter(c => c.rank === targetRank);

                // НОВОЕ: Если карт не хватает, устанавливаем флаг остановки для контроллера
                if (suitableCards.length < offerCount) {
                    console.error(`[Worker] Обнаружено, что закончились карты нужного ранга. Ранг: ${targetRank.toUpperCase()}. Нужно: ${offerCount}, Доступно: ${suitableCards.length}.`);
                    GM_setValue('tradeHaltReason', `закончились карты ранга ${targetRank.toUpperCase()}`);
                    closeTradeWindow();
                    return;
                }

                const searchInput = document.getElementById('trade_search');
                const searchBtn = document.querySelector('.trade__search-btn');
                if (!searchInput || !searchBtn) return closeTradeWindow();

                let offeredCardIds = new Set();
                for (let i = 0; i < offerCount; i++) {
                    console.log(`[Worker] Ищем карту ${i + 1}/${offerCount}...`);
                    let cardAdded = false;
                    for (const myCard of suitableCards) {
                        if (offeredCardIds.has(myCard.id)) continue;
                        searchInput.value = myCard.name;
                        searchBtn.click();
                        await new Promise(r => setTimeout(r, 450));
                        const resultItems = document.querySelectorAll('.trade__inventory-item:not([style*="display: none"]):not(.trade__inventory-item_state_selected)');
                        for (const item of resultItems) {
                            const img = item.querySelector('img');
                            if (img && img.src.includes(myCard.image)) {
                                item.click();
                                await new Promise(r => setTimeout(r, 300));
                                offeredCardIds.add(myCard.id);
                                cardAdded = true;
                                console.log(`[Worker] Карта "${myCard.name}" добавлена.`);
                                break;
                            }
                        }
                        if (cardAdded) break;
                    }
                    if (!cardAdded) {
                        console.log('[Worker] Не удалось найти и добавить следующую карту. Прерываем обмен.');
                        closeTradeWindow();
                        return;
                    }
                }

                if (offeredCardIds.size === offerCount) {
                    await new Promise(r => setTimeout(r, 500));
                    const offeredItems = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item');
                    if (offeredItems.length === offerCount) {
                        console.log(`[Worker] Все ${offerCount} карт(ы) добавлены. Отправляем обмен.`);
                        GM_setValue('usedCardIds', JSON.stringify(Array.from(offeredCardIds)));
                        document.querySelector('.trade__send-trade-btn')?.click();
                    } else {
                         console.error(`[Worker] Ошибка: в предложении оказалось ${offeredItems.length} карт вместо ${offerCount}. Закрываем.`);
                         closeTradeWindow();
                    }
                } else {
                    console.log(`[Worker] Не удалось собрать нужное количество карт (${offeredCardIds.size}/${offerCount}). Закрываем.`);
                    closeTradeWindow();
                }
            };
            setTimeout(findAndOfferCards, 1500);
        }
        else if (window.location.pathname.startsWith('/user/cards/')) {
            const findCardOnProfile = () => {
                const targetCardId = GM_getValue('targetCardId');
                if (!targetCardId) return closeTradeWindow();

                const allMatchingCards = Array.from(document.querySelectorAll('.anime-cards__item'))
                    .filter(card => getCardIdFromImageUrl(card.querySelector('img')?.src) === targetCardId);

                const availableCard = allMatchingCards.find(card => !card.querySelector('.lock-trade-btn'));

                if (availableCard) {
                    console.log('[Worker] Найдена доступная карта. Попытка начать обмен.');
                    availableCard.click();
                    setTimeout(() => {
                        const tradeButton = document.querySelector('.all-owners[href*="/trade/"]');
                        if (tradeButton) {
                            window.location.href = tradeButton.href;
                        } else {
                            console.log('[Worker] Кнопка обмена не найдена в модальном окне.');
                            closeTradeWindow();
                        }
                    }, 750);
                } else {
                    const nextPageButton = document.querySelector('.pagination__pages-btn:not(.pagination__pages-btn_state_disabled) a');
                    if (nextPageButton) {
                        console.log('[Worker] Доступная карта не найдена, перехожу на следующую страницу.');
                        nextPageButton.click();
                    } else {
                        console.log('[Worker] Карта не найдена или все ее копии уже в обмене. Закрываем вкладку.');
                        closeTradeWindow();
                    }
                }
            };
            setTimeout(findCardOnProfile, 1000);
        }
    }
})();