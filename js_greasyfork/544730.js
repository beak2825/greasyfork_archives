// ==UserScript==
// @name         Animestars Trade Helper TEST mobile
// @namespace    http://tampermonkey.net/
// @version      8.1
// @description  Упрощенные обмены, авто обмены, автокликер, улучшение карт и предпросмотр обменов. Адаптация для мобильных устройств.
// @author       Nickmur
// @match        */user/cards*
// @match        */cards/users*
// @match        */cards/*/trade/
// @match        */clubs/boost/*
// @match        */trades*
// @match        */user/*/cards_progress/
// @match        */update_stars/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        window.close
// @grant        window.open
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544730/Animestars%20Trade%20Helper%20TEST%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/544730/Animestars%20Trade%20Helper%20TEST%20mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // MERGED GLOBAL CONFIGURATION, STATE, AND ICONS
    // =================================================================================

    const CURRENT_ORIGIN = window.location.origin;
    const isIframe = (window.self !== window.top);
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const ICONS = {
        // Trade Helper & General Icons
        TRADE_ON: 'https://i.postimg.cc/Y9CqzNHv/off-2.png',
        TRADE_OFF: 'https://i.postimg.cc/yxNB070c/off-1.png',
        ADD: 'https://i.postimg.cc/DyjCR9cP/image.png',
        ADD_ALL: 'https://i.postimg.cc/xdYrvNfB/all.png',
        ADD_DUPLICATES: 'https://i.postimg.cc/wBkC0x3M/duplicate.png',
        REMOVE: 'https://i.postimg.cc/8zgFk5wp/image.png',
        START_TRADE: 'https://i.postimg.cc/Prj49tZD/image.png',
        CANCEL_TRADE: 'https://i.postimg.cc/VLM87hDH/image.png',
        MODE_1: 'https://i.postimg.cc/C1ZS121h/1.png',
        MODE_2: 'https://i.postimg.cc/wvSHskyh/2.png',
        MODE_3: 'https://i.postimg.cc/L5LSkZLG/3.png',
        ONLY_ONLINE_ON: 'https://i.postimg.cc/sDNCFRGk/image.png',
        ONLY_ONLINE_OFF: 'https://i.postimg.cc/Z5WZ0qhY/image.png',
        // Club Boost Helper & Toggles Icons
        BOOST_ON: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 24" width="44" height="24"><rect x="1" y="1" width="42" height="22" rx="11" fill="%234CAF50" stroke="%23388E3C" stroke-width="1"/><circle cx="32" cy="12" r="9" fill="white"/></svg>`,
        BOOST_OFF: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 24" width="44" height="24"><rect x="1" y="1" width="42" height="22" rx="11" fill="%23ccc" stroke="%23a5a5a5" stroke-width="1"/><circle cx="12" cy="12" r="9" fill="white"/></svg>`,
        REFRESH: 'https://i.postimg.cc/L69LcpkG/image.png'
    };
    const SCRIPT_STATE = {
        // Trade Helper State
        helperEnabled: GM_getValue('helperEnabled', true),
        helperAutoSendMode: GM_getValue('helperAutoSendMode', 1),
        helperAutoSendEnabled: GM_getValue('helperAutoSendEnabled', true),
        logoEnabled: GM_getValue('logoEnabled', true),
        logoCache: JSON.parse(localStorage.getItem('clubLogosCache-v2') || '{}'),
        onlyOnlineEnabled: GM_getValue('onlyOnlineEnabled', false),
        // Club Boost Helper State
        boostMainEnabled: GM_getValue('boostMainEnabled', false),
        boostSkipEnabled: GM_getValue('boostSkipEnabled', false),
        // Mass operation state flags
        isAddingInProgress: false,
        isRemovingInProgress: false,
        isAddingDuplicatesInProgress: false,
    };
    // =================================================================================
    // STYLES
    // =================================================================================
    GM_addStyle(`
        /* Стили для нового модуля UpgradeHelper */
        .upgrade-star-btn { background-color: #4CAF50; border: none; color: white; padding: 10px; text-align: center; display: inline-flex; align-items: center; justify-content: center; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px; width: 38px; height: 38px; vertical-align: middle; margin-left: 5px; position: relative; }
        .upgrade-star-btn:hover { background-color: #45a049; }
        #upgrade-task-iframe { position: absolute; top: -9999px; left: -9999px; width: 800px; height: 600px; }
        @keyframes cardHelperSpin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .card-helper-status-notification { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background-color: #3e444c; color: #f0f0f0; padding: 10px 18px; border-radius: 6px; font-size: 14px; font-family: Arial, sans-serif; z-index: 2147483647; display: flex; align-items: center; box-shadow: 0 2px 6px rgba(0,0,0,0.25); opacity: 0; transition: opacity 0.4s ease, bottom 0.4s ease; max-width: 380px; min-width: 280px; box-sizing: border-box; }
        .card-helper-status-notification.show { opacity: 1; bottom: 30px; }
        .ch-status-icon-container { margin-right: 10px; display: flex; align-items: center; height: 18px; }
        .card-helper-spinner { width: 16px; height: 16px; border: 2px solid #666; border-top: 2px solid #ddd; border-radius: 50%; animation: cardHelperSpin 0.8s linear infinite; }
        .card-helper-checkmark, .card-helper-crossmark { font-size: 18px; line-height: 1; }
        .card-helper-checkmark { color: #76c779; }
        .card-helper-crossmark { color: #e57373; }
        .card-helper-status-text { white-space: normal; text-align: left; line-height: 1.3; }

        /* Стили модуля ImageZoomHelper */
        .anime-cards__placeholder img { transition: transform 0.25s ease-in-out; cursor: zoom-in; will-change: transform; }
        .anime-cards__placeholder img.enlarged { transform: scale(1.6) translateY(-10px); cursor: zoom-out; transform-origin: top center; }
        .anime-cards__placeholder.is-zoomed { position: relative; z-index: 10000; }

        /* Стили модуля ClubInfoHelper */
        #club-rank-info, #user-contribution-info { padding: 5px; color: white; font-size: 16px; text-align: center; background-color: transparent; font-weight: bold; }
        #club-rank-info { margin-bottom: 5px; }
        #user-contribution-info { margin-bottom: 15px; }

        /* СТИЛЬ ДЛЯ СКРЫТИЯ МОДАЛЬНОГО ОКНА ПРИ МАССОВОМ ДОБАВЛЕНИИ */
        body.mass-adding-active .ui-dialog.modalfixed {
            top: -9999px !important; left: -9999px !important;
            opacity: 0;
            pointer-events: none;
        }
    `);
    // =================================================================================
    // GENERAL UTILITY FUNCTIONS
    // =================================================================================

    async function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function waitForElement(selector, callback, timeout = 20000) {
        let timeElapsed = 0;
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else {
                timeElapsed += 500;
                if (timeElapsed > timeout) {
                    clearInterval(interval);
                    console.log(`[Super Helper] Элемент ${selector} не найден.`);
                }
            }
        }, 500);
    }

    // =================================================================================
    // UNIVERSAL UI CREATION FUNCTIONS
    // =================================================================================

    function createMainPanel() {
        if (document.getElementById('super-helper-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'super-helper-panel';
        panel.style.cssText = 'position: fixed; bottom: 20px; left: 20px; z-index: 9999; display: flex; flex-direction: column; align-items: flex-start; gap: 10px;';
        document.body.appendChild(panel);
        return panel;
    }

    function applyHoverEffect(btn) {
        btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.05)';
            btn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.4)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
        });
    }

    function addTooltipRight(btn, text) {
        if (isMobile) return;
        let tip = btn.querySelector('.tooltip-super-helper');
        if (!tip) {
            tip = document.createElement('span');
            tip.className = 'tooltip-super-helper';
            tip.style.cssText = `position: absolute; top: 50%; left: 115%; transform: translateY(-50%); background-color: rgba(0, 0, 0, 0.8); color: #fff; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-size: 12px; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; z-index: 10000;`;
            btn.style.position = 'relative';
            btn.appendChild(tip);
            btn.addEventListener('mouseenter', () => {
                tip.style.visibility = 'visible';
                tip.style.opacity = '1';
            });
            btn.addEventListener('mouseleave', () => {
                tip.style.opacity = '0';
                tip.style.visibility = 'hidden';
            });
        }
        tip.textContent = text;
    }

    function addTooltipTop(btn, text) {
        if (isMobile) return;
        let tip = btn.querySelector('.tooltip-super-helper');
        let modalBody;
        let originalOverflow;

        if (!tip) {
            tip = document.createElement('span');
            tip.className = 'tooltip-super-helper';
            tip.style.cssText = `position: absolute; bottom: 120%; left: 50%; transform: translateX(-50%); background-color: rgba(0, 0, 0, 0.8); color: #fff; padding: 4px 8px; border-radius: 4px; white-space: nowrap; font-size: 12px; opacity: 0; visibility: hidden; transition: opacity 0.3s ease, visibility 0.3s ease; z-index: 10001;`;
            btn.style.position = 'relative';
            btn.appendChild(tip);
            btn.addEventListener('mouseenter', () => {
                tip.style.visibility = 'visible';
                tip.style.opacity = '1';
                modalBody = btn.closest('.modal__body');
                if (modalBody) {
                    originalOverflow = modalBody.style.overflow;
                    modalBody.style.overflow = 'visible';
                }
            });
            btn.addEventListener('mouseleave', () => {
                tip.style.opacity = '0';
                tip.style.visibility = 'hidden';
                if (modalBody) {
                    modalBody.style.overflow = originalOverflow;
                }
            });
        }
        tip.textContent = text;
    }


    function createStyledButton(id, tooltip, iconUrl, onClick) {
        const panel = document.getElementById('super-helper-panel');
        if (!panel || document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.id = id;
        btn.style.cssText = `background-color: rgb(108, 92, 231); transition: transform 0.2s, box-shadow 0.2s; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px; position: relative; transform: scale(1); animation: 2.5s ease-in-out 0s infinite normal none running breatheShadowInteractive; border-radius: 50%; width: 40px; height: 40px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px;`;
        const img = document.createElement('img');
        img.src = iconUrl;
        img.style.cssText = 'width: 28px; height: 28px; object-fit: contain; pointer-events: none;';
        btn.appendChild(img);
        applyHoverEffect(btn);
        addTooltipRight(btn, tooltip);
        btn.onclick = onClick;
        panel.appendChild(btn);
        return btn;
    }

    function createToggleButton({
        id,
        tooltipOn,
        tooltipOff,
        stateKey,
        onToggle,
        iconOn,
        iconOff
    }) {
        const panel = document.getElementById('super-helper-panel');
        if (!panel || document.getElementById(id)) return;
        const btn = document.createElement('button');
        btn.id = id;
        btn.style.cssText = `width: 44px; height: 24px; border: none; cursor: pointer; background-color: transparent; padding: 0;`;
        const img = document.createElement('img');
        img.style.cssText = 'width: 100%; height: 100%; pointer-events: none;';
        const updateButton = (isEnabled) => {
            img.src = isEnabled ? iconOn : iconOff;
            addTooltipRight(btn, isEnabled ? tooltipOn : tooltipOff);
        };
        btn.addEventListener('click', () => {
            const newState = !SCRIPT_STATE[stateKey];
            SCRIPT_STATE[stateKey] = newState;
            GM_setValue(stateKey, newState);
            updateButton(newState);
            if (onToggle) onToggle(newState);
        });
        btn.appendChild(img);
        applyHoverEffect(btn);
        panel.appendChild(btn);
        updateButton(SCRIPT_STATE[stateKey]);
        if (SCRIPT_STATE[stateKey] && onToggle) {
            onToggle(SCRIPT_STATE[stateKey]);
        }
        return btn;
    }


    // =================================================================================
    // =================================================================================
    // MODULE 1: TRADE HELPER
    // =================================================================================
    // =================================================================================

    const TradeHelper = {
        clearTradeState: function() {
            GM_deleteValue('stealth.tradeActive');
            GM_deleteValue('stealth.ownersQueue');
            GM_deleteValue('stealth.myTradeableCards');
            GM_deleteValue('stealth.targetCardId');
            GM_deleteValue('stealth.targetCardRank');
            GM_deleteValue('stealth.tradeOfferCount');
            GM_deleteValue('stealth.usedCardIds');
            GM_deleteValue('stealth.returnUrl'); // Clear the return URL
            console.log('[Stealth Trader] Состояние автообмена очищено.');
        },

        getCardIdFromImageUrl: function(url) {
            if (!url) return null;
            const match = url.match(/\/cards_image\/(\d+)\//);
            return match ? match[1] : null;
        },

        getCardIdFromHref: function(href) {
            if (!href) return null;
            const match = href.match(/id=(\d+)/);
            return match ? match[1] : null;
        },

        getSearchableName: function(originalName) {
            const specialCharMatch = originalName.match(/[^a-zA-Z0-9а-яА-ЯёЁ\s]/);
            return specialCharMatch ? originalName.substring(0, specialCharMatch.index) : originalName;
        },

        runWorker: async function() {
            if (!GM_getValue('stealth.tradeActive', false)) {
                return;
            }

            const path = window.location.pathname;
            if (path.includes('/user/cards/')) {
                const targetCardId = GM_getValue('stealth.targetCardId');
                if (!targetCardId) {
                    if (isMobile) window.close();
                    return;
                }

                let availableCard = null;
                const maxRetries = 10;
                const retryDelay = 400;
                for (let i = 0; i < maxRetries; i++) {
                    availableCard = document.querySelector(`.anime-cards__item[data-id="${targetCardId}"][data-can-trade="1"]`);
                    if (availableCard) {
                        console.log(`[Stealth Worker] Карта ID ${targetCardId} найдена и доступна для обмена!`);
                        break;
                    }
                    if (i < maxRetries - 1) await wait(retryDelay);
                }

                if (availableCard) {
                    availableCard.click();
                    await wait(500);
                    const tradeButton = document.querySelector('.all-owners[href*="/trade/"]');
                    if (tradeButton) {
                        window.location.href = tradeButton.href;
                    } else {
                        console.error('[Stealth Worker] Кнопка обмена не найдена в модальном окне.');
                        GM_setValue('stealth.status', 'FAILED_NO_TRADE_BUTTON');
                        if (isMobile) window.close();
                    }
                } else {
                    console.warn(`[Stealth Worker] Нужная карта (ID: ${targetCardId}) не найдена или недоступна после ${maxRetries} попыток.`);
                    GM_setValue('stealth.status', 'FAILED_CARD_NOT_FOUND');
                    if (isMobile) window.close();
                }
                return;
            }

            if (path.includes('/cards/') && path.endsWith('/trade/')) {
                await wait(700);
                const limitMessage = document.querySelector('.message-info');
                if (limitMessage && limitMessage.textContent.includes('Достигнут лимит')) {
                    console.warn('[Stealth Worker] Достигнут лимит обменов с этим пользователем. Пропускаю.');
                    GM_setValue('stealth.status', 'FAILED_TRADE_LIMIT');
                    if (isMobile) window.close();
                    return;
                }

                const myCards = JSON.parse(GM_getValue('stealth.myTradeableCards', '[]'));
                const targetRank = GM_getValue('stealth.targetCardRank');
                const offerCount = GM_getValue('stealth.tradeOfferCount', 1);
                const usedCardIdsFromGM = JSON.parse(GM_getValue('stealth.usedCardIds', '[]'));

                const searchInput = document.getElementById('trade_search');
                const searchBtn = document.querySelector('.trade__search-btn');
                if (!searchInput || !searchBtn) {
                    GM_setValue('stealth.status', `FAILED_NO_SEARCH_INPUT`);
                    if (isMobile) window.close();
                    return;
                }

                const suitableAndUnusedCards = myCards.filter(c =>
                    (c.rank || '').toLowerCase() == (targetRank || '').toLowerCase() &&
                    !usedCardIdsFromGM.includes(c.id)
                );
                let offeredData = [];

                // ############ НАЧАЛО ИСПРАВЛЕНИЯ ############
                // Группируем карты, чтобы искать каждый тип карты только один раз
                const groupedCards = suitableAndUnusedCards.reduce((acc, card) => {
                    if (!acc[card.image]) {
                        acc[card.image] = [];
                    }
                    acc[card.image].push(card);
                    return acc;
                }, {});
                for (const image in groupedCards) {
                    if (offeredData.length >= offerCount) break;
                    const cardGroup = groupedCards[image];
                    const myCard = cardGroup[0]; // Берем первую карту как образец для поиска
                    const numToOfferForThisGroup = cardGroup.length;
                    const originalName = myCard.name;
                    const searchName = this.getSearchableName(originalName);

                    // Ищем карту один раз
                    searchInput.value = searchName;
                    searchBtn.click();
                    await wait(800); // Немного увеличена задержка для надежности

                    // Находим все доступные (невыбранные) элементы этой карты
                    const availableItems = Array.from(document.querySelectorAll('.trade__inventory-item:not([style*="display: none"]):not(.trade__inventory-item_state_selected)'))
                        .filter(item => item.querySelector('img')?.src.includes(myCard.image));
                    // Кликаем по найденным элементам столько раз, сколько нужно
                    for (let i = 0; i < numToOfferForThisGroup && i < availableItems.length; i++) {
                        if (offeredData.length >= offerCount) break;
                        availableItems[i].click();
                        await wait(250); // Небольшая пауза между кликами
                        offeredData.push(cardGroup[i]);
                    }
                }
                // ############ КОНЕЦ ИСПРАВЛЕНИЯ ############

                if (offeredData.length === offerCount) {
                    await wait(300);
                    const offeredItemsInDOM = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item');
                    if (offeredItemsInDOM.length === offerCount) {
                        console.log(`[Stealth Worker] Проверка DOM успешна. Найдено ${offeredItemsInDOM.length} карт(ы). Отправляю обмен.`);
                        const newUsedIds = offeredData.map(c => c.id);
                        GM_setValue('stealth.usedCardIds', JSON.stringify([...usedCardIdsFromGM, ...newUsedIds]));
                        document.querySelector('.trade__send-trade-btn')?.click();
                        await wait(1000);
                        GM_setValue('stealth.status', 'SUCCESS');
                    } else {
                        console.error(`[Stealth Worker] Ошибка синхронизации! Требуется ${offerCount} карт, но в DOM найдено ${offeredItemsInDOM.length}. Обмен не будет отправлен.`);
                        GM_setValue('stealth.status', 'FAILED_SYNC_ERROR');
                    }
                } else {
                    console.error(`[Stealth Worker] Не удалось найти достаточно карт для предложения (найдено ${offeredData.length} из ${offerCount}).`);
                    if (offeredData.length === 0) {
                        GM_setValue('stealth.status', 'FAILED_CANNOT_FIND_OFFER_CARD');
                    } else {
                        GM_setValue('stealth.status', 'FAILED_INSUFFICIENT_OFFER');
                    }
                }
                if (isMobile) await wait(1000).then(() => window.close());
            }
        },

        StealthTradeController: {
            statusDiv: null,
            startBtn: null,
            cancelBtn: null,
            modeBtn: null,
            worker: null,

            findIframeContainer() {
                const potentialSelectors = ['.card-show', '.card-details', '.card_details', '.card-info', '.card-show-container', '.ncard__main', 'main'];
                for (const selector of potentialSelectors) {
                    const element = document.querySelector(selector);
                    if (element) return element;
                }
                return document.body;
            },

            highlightOwner(ownerId, color) {
                if (!ownerId) return;
                const targetOwnerElement = document.querySelector(`a.card-show__owner[data-owner-id="${ownerId}"]`);
                if (targetOwnerElement) {
                    let bgColor, borderColor;
                    switch (color) {
                        case 'SUCCESS':
                            bgColor = 'rgba(40, 167, 69, 0.4)';
                            borderColor = 'rgba(40, 167, 69, 0.7)';
                            break;
                        case 'SKIPPED':
                            bgColor = 'rgba(255, 193, 7, 0.4)';
                            borderColor = 'rgba(255, 193, 7, 0.7)';
                            break;
                        case 'FAILED':
                            bgColor = 'rgba(220, 53, 69, 0.4)';
                            borderColor = 'rgba(220, 53, 69, 0.7)';
                            break;
                        default:
                            return;
                    }
                    targetOwnerElement.style.backgroundColor = bgColor;
                    targetOwnerElement.style.borderRadius = '8px';
                    targetOwnerElement.style.border = `1px solid ${borderColor}`;
                }
            },

            findNextPageLink() {
                const paginationContainer = document.querySelector('.pagination__pages');
                if (!paginationContainer) return document.querySelector('.pagination__pages-btn a');
                const pageElements = Array.from(paginationContainer.children);
                const currentPageIndex = pageElements.findIndex(el => el.tagName === 'SPAN' && !el.classList.contains('nav_ext'));
                if (currentPageIndex > -1) {
                    const nextElement = pageElements[currentPageIndex + 1];
                    if (nextElement && nextElement.tagName === 'A') {
                        return nextElement;
                    }
                }
                return document.querySelector('.pagination__pages-btn a');
            },

            fetchAllTradeableCards(username) {
                return new Promise((resolve, reject) => {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    document.body.appendChild(iframe);


                    let allCards = [];
                    iframe.onload = () => {
                        try {
                            const
                                doc = iframe.contentDocument;
                            if (!doc) throw new Error("Нет доступа к iframe.");
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
                    iframe.onerror = () => reject(new Error("Ошибка iframe."));
                    iframe.src = `/user/cards/trade/?name=${username}`;
                });
            },

            fetchOfferedCardIds: () => {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",


                        url: `${CURRENT_ORIGIN}/trades/offers/`,
                        onload: async (response) => {
                            try {
                                const parser = new DOMParser();


                                const doc = parser.parseFromString(response.responseText, "text/html");
                                const offerLinks = Array.from(doc.querySelectorAll('.trade__list-item')).map(a => a.href);



                                if (offerLinks.length === 0) {
                                    return resolve([]);
                                }



                                const cardIdPromises = offerLinks.map(link =>
                                    new Promise(res => {
                                        GM_xmlhttpRequest({


                                            method: "GET",
                                            url: link,


                                            onload: (offerResponse) => {
                                                const offerDoc = parser.parseFromString(offerResponse.responseText, "text/html");
                                                const cardElements = offerDoc.querySelectorAll('.trade__main-items .trade__main-item');
                                                const ids = Array.from(cardElements).map(card => TradeHelper.getCardIdFromHref(card.href)).filter(Boolean);
                                                res(ids);
                                            },
                                            onerror: () => res([])
                                        });
                                    })
                                );
                                const cardIdArrays = await Promise.all(cardIdPromises);
                                const allCardIds = cardIdArrays.flat();
                                resolve(allCardIds);
                            } catch (e) {
                                console.error("Ошибка при парсинге активных обменов:", e);
                                reject(e);
                            }
                        },
                        onerror: (error) => {
                            console.error("Не удалось загрузить страницу активных обменов:", error);
                            reject(error);
                        }
                    });
                });
            },

            async startTradeProcess() {
                this.startBtn.style.display = 'none';
                this.cancelBtn.style.display = 'flex';
                this.modeBtn.style.display = 'none';
                if (this.statusDiv) {
                    this.statusDiv.style.cssText = 'padding: 10px; background: rgba(0,0,0,0.75); border-radius: 8px; color: white; font-size: 14px; white-space: nowrap;';
                }

                const offerCount = GM_getValue('stealth.tradeOfferCount', 1);
                TradeHelper.clearTradeState();
                try {
                    this.statusDiv.innerHTML = `Проверка активных обменов...`;
                    const offeredCardIds = await this.fetchOfferedCardIds();
                    if (offeredCardIds.length > 0) {
                        console.log(`[Stealth Trader] Найдены карты в активных обменах: ${offeredCardIds.join(', ')}. Они будут исключены.`);
                    }
                    this.statusDiv.innerHTML = `Сбор ваших карт для обмена...`;
                    GM_setValue('stealth.tradeOfferCount', offerCount);
                    GM_setValue('stealth.returnUrl', window.location.href);
                    const urlParams = new URLSearchParams(window.location.search);
                    const targetCardId = urlParams.get('id');
                    if (!targetCardId) throw new Error('Не удалось определить ID целевой карты.');
                    const username = document.querySelector('.lgn__name span')?.textContent.trim();
                    if (!username) throw new Error('Не удалось найти ваш никнейм.');
                    const targetRank = document.querySelector('[class*="ncard__rank rank-"]')?.className.match(/rank-([sabcde])/)?.[1];
                    if (!targetRank) throw new Error('Не удалось определить ранг целевой карты.');

                    const onlyOnline = GM_getValue('onlyOnlineEnabled', false);
                    const ownersNodeList = onlyOnline ?
                        document.querySelectorAll('a.card-show__owner--online') :
                        document.querySelectorAll('a.card-show__owner');
                    let ownerIdCounter = 0;
                    const ownersQueue = Array.from(ownersNodeList)
                        .filter(el => !el.querySelector('.fa-exchange, .fa-lock, .fa-star, .fa-user, .fa-trophy-alt') && el.querySelector('.card-show__owner-name')?.textContent.trim() !== username)
                        .map(el => {
                            const ownerId = `owner-${Date.now()}-${ownerIdCounter++}`;



                            el.setAttribute('data-owner-id', ownerId);
                            return {
                                url: el.href,
                                id: ownerId,
                                name: el.querySelector('.card-show__owner-name')?.textContent.trim()
                            };
                        });
                    if (ownersQueue.length === 0) throw new Error('Подходящие владельцы не найдены.');
                    const allMyCards = await this.fetchAllTradeableCards(username);
                    const cardsNotInOffers = allMyCards.filter(card => !offeredCardIds.includes(card.id));
                    const myCards = cardsNotInOffers.filter(card => {
                        const searchableName = TradeHelper.getSearchableName(card.name);
                        if (searchableName.length < 3) {
                            console.log(`[Stealth Trader] Исключена карта "${card.name}", т.к. поисковый запрос "${searchableName}" слишком короткий.`);
                            return false;
                        }
                        return true;

                    });
                    console.log(`[Stealth Trader] Всего карт: ${allMyCards.length}. Доступно для обмена (за вычетом активных и коротких): ${myCards.length}.`);
                    if (myCards.filter(c => (c.rank || '').toLowerCase() == (targetRank || '').toLowerCase()).length < offerCount) {
                        throw new Error(`Недостаточно карт ранга ${targetRank.toUpperCase()} для обмена (с учетом уже отправленных).`);
                    }

                    GM_setValue('stealth.myTradeableCards', JSON.stringify(myCards));
                    GM_setValue('stealth.targetCardId', targetCardId);
                    GM_setValue('stealth.targetCardRank', targetRank);
                    GM_setValue('stealth.ownersQueue', JSON.stringify(ownersQueue));
                    GM_setValue('stealth.tradeActive', true);
                    GM_setValue('stealth.usedCardIds', '[]');
                    if (!isMobile) {
                        this.worker = document.getElementById('stealth_iframe');
                        if (!this.worker) {
                            this.worker = document.createElement('iframe');
                            this.worker.id = 'stealth_iframe';
                            this.worker.style.cssText = 'display: none; width: 0; height: 0; border: none; position: absolute;';
                            const iframeContainer = this.findIframeContainer();
                            iframeContainer.appendChild(this.worker);
                        }
                    }

                    this.processQueue();
                } catch (error) {
                    if (this.statusDiv) this.statusDiv.innerHTML = `Ошибка: ${error.message}`;
                    console.error('[Stealth Controller]', error);
                    this.startBtn.style.display = 'flex';
                    this.cancelBtn.style.display = 'none';
                    this.modeBtn.style.display = 'flex';
                }
            },

            async processQueue() {
                if (!GM_getValue('stealth.tradeActive', false)) {
                    if (this.statusDiv) this.statusDiv.innerHTML = 'Процесс остановлен.';
                    if (this.startBtn) {
                        this.startBtn.style.display = 'flex';
                        this.cancelBtn.style.display = 'none';
                        this.modeBtn.style.display = 'flex';
                    }
                    if (this.worker && !isMobile) this.worker.remove();
                    if (this.worker && isMobile && !this.worker.closed) this.worker.close();
                    return;
                }

                const myCards = JSON.parse(GM_getValue('stealth.myTradeableCards', '[]'));
                const targetRank = GM_getValue('stealth.targetCardRank', '');
                const offerCount = GM_getValue('stealth.tradeOfferCount', 1);
                const usedCardIds = JSON.parse(GM_getValue('stealth.usedCardIds', '[]'));
                const availableCardsCount = myCards.filter(c => (c.rank || '').toLowerCase() === targetRank.toLowerCase() && !usedCardIds.includes(c.id)).length;
                console.log(`[Stealth Controller] Проверка карт. Доступно карт ранга ${targetRank.toUpperCase()}: ${availableCardsCount}. Требуется: ${offerCount}.`);
                if (availableCardsCount < offerCount) {
                    if (this.statusDiv) this.statusDiv.innerHTML = `Остановлено: кончились карты ранга ${targetRank.toUpperCase()}`;
                    TradeHelper.clearTradeState();
                    if (this.worker && !isMobile) this.worker.remove();
                    if (this.startBtn) {
                        this.startBtn.style.display = 'flex';
                        this.cancelBtn.style.display = 'none';
                        this.modeBtn.style.display = 'flex';
                    }
                    return;
                }

                let owners = JSON.parse(GM_getValue('stealth.ownersQueue', '[]'));
                if (owners.length === 0) {
                    const username = document.querySelector('.lgn__name span')?.textContent.trim();
                    const onlyOnline = GM_getValue('onlyOnlineEnabled', false);
                    const ownersNodeList = onlyOnline ? document.querySelectorAll('a.card-show__owner--online') : document.querySelectorAll('a.card-show__owner');
                    let ownerIdCounter = 0;
                    const freshOwners = Array.from(ownersNodeList)
                        .filter(el => !el.style.backgroundColor && !el.querySelector('.fa-exchange, .fa-lock, .fa-star, .fa-user, .fa-trophy-alt') && el.querySelector('.card-show__owner-name')?.textContent.trim() !== username)
                        .map(el => {
                            const ownerId = `owner-${Date.now()}-${ownerIdCounter++}`;


                            el.setAttribute('data-owner-id', ownerId);
                            return {
                                url: el.href,
                                id: ownerId,
                                name: el.querySelector('.card-show__owner-name')?.textContent.trim()
                            };
                        });
                    if (freshOwners.length > 0) {
                        owners = freshOwners;
                        GM_setValue('stealth.ownersQueue', JSON.stringify(owners));
                    } else {
                        const nextPageLink = this.findNextPageLink();
                        if (nextPageLink && nextPageLink.href) {
                            if (this.statusDiv) this.statusDiv.innerHTML = 'Страница обработана.\nПерехожу к следующей...';
                            await wait(1000);
                            window.location.href = nextPageLink.href;
                        } else {
                            if (this.statusDiv) this.statusDiv.innerHTML = 'Все владельцы на всех страницах обработаны!';
                            TradeHelper.clearTradeState();
                            if (this.worker && !isMobile) this.worker.remove();
                            if (this.startBtn) {
                                this.startBtn.style.display = 'flex';
                                this.cancelBtn.style.display = 'none';
                                this.modeBtn.style.display = 'flex';
                            }
                        }
                        return;
                    }
                }

                const nextOwner = owners.shift();
                const ownerName = nextOwner.name;
                const ownerId = nextOwner.id;

                GM_setValue('stealth.ownersQueue', JSON.stringify(owners));
                if (this.statusDiv) this.statusDiv.innerHTML = `Работаю...<br>Цель: ${ownerName}. Осталось: ${owners.length}`;
                GM_setValue('stealth.status', 'STARTED');
                if (isMobile) {
                    this.worker = window.open(nextOwner.url, '_blank');
                } else {
                    this.worker.src = nextOwner.url;
                }

                let timeout = 60;
                while (timeout > 0) {
                    const status = GM_getValue('stealth.status', 'STARTED');
                    if (status !== 'STARTED') {
                        console.log(`[Stealth Controller] Итерация для ${ownerName} (ID: ${ownerId}) завершена: ${status}`);
                        if (status === 'FAILED_CANNOT_FIND_OFFER_CARD') {
                            this.highlightOwner(ownerId, 'FAILED');
                            if (this.statusDiv) this.statusDiv.innerHTML = `<b>Остановлено:</b><br>Карты для обмена не найдены.`;
                            TradeHelper.clearTradeState();
                            if (this.worker && !isMobile) this.worker.remove();
                            if (this.startBtn) {
                                this.startBtn.style.display = 'flex';
                                this.cancelBtn.style.display = 'none';
                                this.modeBtn.style.display = 'flex';
                            }
                            return;
                        }

                        if (status === 'SUCCESS') this.highlightOwner(ownerId, 'SUCCESS');
                        else if (status === 'FAILED_TRADE_LIMIT') this.highlightOwner(ownerId, 'SKIPPED');
                        else this.highlightOwner(ownerId, 'FAILED');

                        setTimeout(() => this.processQueue(), 500);
                        return;
                    }

                    if (this.statusDiv) this.statusDiv.innerHTML = `Отправка: ${ownerName}<br>Осталось карт: ${availableCardsCount}.`;
                    await wait(1000);
                    timeout--;
                }

                console.error(`[Stealth Controller] Истекло время ожидания для ${ownerName}.`);
                this.highlightOwner(ownerId, 'FAILED');
                if (isMobile && this.worker && !this.worker.closed) this.worker.close();
                setTimeout(() => this.processQueue(), 500);
            }
        },

        initialize: function() {
            const path = window.location.pathname;
            const isTradeActive = GM_getValue('stealth.tradeActive', false);

            if (isTradeActive) {
                if (path.includes('/cards/users/')) {
                    const panel = document.getElementById('super-helper-panel');
                    if (panel) panel.innerHTML = '';
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'stealth_status_div';
                    statusDiv.style.cssText = 'padding: 10px; background: rgba(0,0,0,0.75); border-radius: 8px; color: white; font-size: 14px; white-space: nowrap;';
                    if (panel) panel.appendChild(statusDiv);
                    this.StealthTradeController.statusDiv = statusDiv;
                    createStyledButton('cancelStealthTradeBtn', 'Остановить автообмен', ICONS.CANCEL_TRADE, () => {
                        if (isMobile && this.StealthTradeController.worker && !this.StealthTradeController.worker.closed) {
                            this.StealthTradeController.worker.close();
                        }


                        const returnUrl = GM_getValue('stealth.returnUrl');
                        this.clearTradeState();
                        if (returnUrl) {
                            window.location.href = returnUrl;



                        } else {
                            window.location.reload();
                        }
                    });
                    if (!isMobile) {
                        this.StealthTradeController.worker = document.getElementById('stealth_iframe');
                        if (!this.StealthTradeController.worker) {
                            this.StealthTradeController.worker = document.createElement('iframe');
                            this.StealthTradeController.worker.id = 'stealth_iframe';
                            this.StealthTradeController.worker.style.cssText = 'display: none; width: 0; height: 0; border: none; position: absolute;';
                            const iframeContainer = this.StealthTradeController.findIframeContainer();
                            iframeContainer.appendChild(this.StealthTradeController.worker);
                        }
                    }

                    this.StealthTradeController.processQueue();
                } else {
                    const panel = document.getElementById('super-helper-panel');
                    if (panel) panel.innerHTML = '';

                    createStyledButton('cancelStealthTradeBtn', 'Остановить и закрыть', ICONS.CANCEL_TRADE, () => {
                        this.clearTradeState();
                        window.close();
                    });
                }
            } else {
                if (path.includes('/cards/users/')) {
                    const statusDiv = document.createElement('div');
                    statusDiv.id = 'stealth_status_div';
                    statusDiv.style.cssText = 'font-size: 14px; color: #fff;';
                    document.getElementById('super-helper-panel')?.appendChild(statusDiv);
                    this.StealthTradeController.statusDiv = statusDiv;
                    const startBtn = createStyledButton('startStealthTradeBtn', 'Начать автообмен', ICONS.START_TRADE, () => this.StealthTradeController.startTradeProcess());
                    const cancelBtn = createStyledButton('cancelStealthTradeBtn', 'Остановить автообмен', ICONS.CANCEL_TRADE, () => {
                        this.clearTradeState();
                        window.location.reload();
                    });
                    cancelBtn.style.display = 'none';

                    this.StealthTradeController.startBtn = startBtn;
                    this.StealthTradeController.cancelBtn = cancelBtn;

                    const modeBtn = createStyledButton('tradeModeBtn', `Режим обмена`, ICONS[`MODE_${GM_getValue('stealth.tradeOfferCount', 1)}`], () => {
                        let mode = GM_getValue('stealth.tradeOfferCount', 1);
                        mode = mode >= 3 ? 1 : mode + 1;



                        GM_setValue('stealth.tradeOfferCount', mode);
                        modeBtn.querySelector('img').src = ICONS[`MODE_${mode}`];
                        addTooltipRight(modeBtn, `Предлагать ${mode} карт(ы)`);
                    });
                    this.StealthTradeController.modeBtn = modeBtn;

                    createStyledButton('toggleOnlyOnlineBtn', SCRIPT_STATE.onlyOnlineEnabled ? 'Только онлайн ВКЛ' : 'Только онлайн ВЫКЛ', SCRIPT_STATE.onlyOnlineEnabled ? ICONS.ONLY_ONLINE_ON : ICONS.ONLY_ONLINE_OFF, (e) => {
                        const btn = e.currentTarget;
                        SCRIPT_STATE.onlyOnlineEnabled = !SCRIPT_STATE.onlyOnlineEnabled;
                        GM_setValue('onlyOnlineEnabled', SCRIPT_STATE.onlyOnlineEnabled);



                        const img = btn.querySelector('img');
                        img.src = SCRIPT_STATE.onlyOnlineEnabled ? ICONS.ONLY_ONLINE_ON : ICONS.ONLY_ONLINE_OFF;
                        addTooltipRight(btn, SCRIPT_STATE.onlyOnlineEnabled ? 'Только онлайн ВКЛ' : 'Только онлайн ВЫКЛ');



                    });
                    createToggleButton({
                        id: 'toggleLogoBtn',
                        tooltipOn: 'Лого клубов ВКЛ',
                        tooltipOff: 'Лого клубов ВЫКЛ',
                        stateKey: 'logoEnabled',
                        onToggle: (isEnabled) => {
                            localStorage.removeItem('clubLogosCache-v2');
                            SCRIPT_STATE.logoCache = {};
                            this.LogoModule.clearLogos();
                            if (isEnabled) this.LogoModule.processAllOwners();
                        },
                        iconOn: ICONS.BOOST_ON,
                        iconOff: ICONS.BOOST_OFF
                    });
                    createToggleButton({
                        id: 'toggleHelperBtn',
                        tooltipOn: 'Авто-переход ВКЛ',
                        tooltipOff: 'Авто-переход ВЫКЛ',
                        stateKey: 'helperEnabled',
                        onToggle: null,
                        iconOn: ICONS.BOOST_ON,
                        iconOff: ICONS.BOOST_OFF
                    });
                    this.LogoModule.run();
                } else if (path.includes('/user/cards')) {
                    this.initializeHelperButtons();
                }
                this.HelperModule.run();
            }
        },

        LogoModule: {
            run() {
                if (SCRIPT_STATE.logoEnabled) this.processAllOwners();
                else this.clearLogos();
            },
            clearLogos() {
                document.querySelectorAll('.club-logo-trade-helper').forEach(el => el.remove());
            },
            processAllOwners() {
                this.clearLogos();
                document.querySelectorAll('.card-show__owner').forEach(owner => {
                    const nameEl = owner.querySelector('.card-show__owner-name');
                    if (!nameEl) return;
                    const username = nameEl.textContent.trim();
                    if (SCRIPT_STATE.logoCache[username]) {



                        this.injectLogo(owner, SCRIPT_STATE.logoCache[username]);
                    } else {
                        this.fetchUserClubData(username).then(data => {
                            if (data) {



                                SCRIPT_STATE.logoCache[username] = data;
                                localStorage.setItem('clubLogosCache-v2', JSON.stringify(SCRIPT_STATE.logoCache));
                                this.injectLogo(owner, data);



                            }
                        });
                    }
                });
            },
            injectLogo(ownerEl, clubData) {
                if (ownerEl.querySelector('.club-logo-trade-helper')) return;
                const logoContainer = document.createElement('div');
                logoContainer.className = 'club-logo-trade-helper';
                logoContainer.style.cssText = `position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; z-index: 10;`;
                const tooltipTarget = document.createElement('div');
                tooltipTarget.style.cssText = `width: 100%; height: 100%;`;
                const img = document.createElement('img');
                img.src = clubData.logo;
                img.style.cssText = `width: 100%; height: 100%; border-radius: 4px; background: #222; padding: 1px; box-shadow: 0 0 3px rgba(0,0,0,0.5);`;
                ownerEl.style.position = 'relative';
                tooltipTarget.appendChild(img);
                logoContainer.appendChild(tooltipTarget);
                ownerEl.appendChild(logoContainer);
                addTooltipRight(tooltipTarget, clubData.name);
            },
            fetchUserClubData(username) {
                return new Promise(resolve => {
                    GM_xmlhttpRequest({
                        method: 'GET',



                        url: `${CURRENT_ORIGIN}/user/${username}/`,
                        onload: (response) => {
                            const clubLinkMatch = response.responseText.match(/<a href="\/clubs\/(\d+)\/">[^<]+<\/a>/);
                            if (!clubLinkMatch) return resolve(null);



                            const clubId = clubLinkMatch[1];
                            GM_xmlhttpRequest({
                                method: 'GET',



                                url: `${CURRENT_ORIGIN}/clubs/${clubId}/`,
                                onload: (clubResp) => {
                                    const clubHtml = clubResp.responseText;



                                    const logoMatch = clubHtml.match(/<img src="(\/uploads\/clubs\/icon_[^"]+)"/);
                                    const nameMatch = clubHtml.match(/<div class="nclub-enter__main-name[^>]*>\s*<div>([^<]+)<\/div>/);
                                    if (logoMatch && nameMatch) {
                                        resolve({
                                            logo: `${CURRENT_ORIGIN}${logoMatch[1]}`,


                                            name: nameMatch[1].trim()
                                        });
                                    } else {
                                        resolve(null);
                                    }
                                }
                            });
                        }
                    });
                });
            }
        },
        HelperModule: {
            run() {
                const path = window.location.pathname;
                if (path.includes('/cards/users/')) {
                    if (SCRIPT_STATE.helperEnabled) this.prepareOwnerLinks();
                } else if (path.includes('/user/cards/')) {
                    if (SCRIPT_STATE.helperEnabled) this.initiateTradeOnUserPage();
                } else if (path.includes('/cards/') && path.endsWith('/trade/')) {
                    this.initializeTradePageUI();
                    if (SCRIPT_STATE.helperAutoSendEnabled) this.setupAutoSendObserver();
                }
            },
            prepareOwnerLinks() {
                const mainCardImage = document.querySelector('.ncard__img img');
                if (!mainCardImage) return;
                const cardId = TradeHelper.getCardIdFromImageUrl(mainCardImage.src);
                if (!cardId) return;
                document.querySelectorAll('a.card-show__owner').forEach(link => {
                    const url = new URL(link.href);
                    url.searchParams.set('trade_card_id', cardId);
                    link.href = url.toString();
                });
            },
            initiateTradeOnUserPage() {
                const cardId = new URLSearchParams(window.location.search).get('trade_card_id');
                if (!cardId) return;
                const cardSelector = `div.anime-cards__item[data-image*="/cards_image/${cardId}/"]`;
                waitForElement(cardSelector, (cardContainer) => {
                    const observer = new MutationObserver((mutations, obs) => {
                        const tradeButton = document.querySelector('.all-owners[href*="/trade/"]');
                        if (tradeButton) {



                            obs.disconnect();
                            window.location.href = tradeButton.href;
                        }
                    });




                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });



                    cardContainer.click();
                });
            },
            initializeTradePageUI() {
                createToggleButton({
                    id: 'toggleAutoSendBtn',
                    tooltipOn: 'Автоотправка ВКЛ',
                    tooltipOff: 'Автоотправка ВЫКЛ',



                    stateKey: 'helperAutoSendEnabled',
                    onToggle: (isEnabled) => {
                        if (isEnabled) this.setupAutoSendObserver();
                    },
                    iconOn: ICONS.BOOST_ON,
                    iconOff: ICONS.BOOST_OFF

                });
                const modeBtn = createStyledButton('changeModeBtn', `Отправлять ${SCRIPT_STATE.helperAutoSendMode} карты`, ICONS[`MODE_${SCRIPT_STATE.helperAutoSendMode}`], () => {
                    let mode = SCRIPT_STATE.helperAutoSendMode % 3 + 1;
                    SCRIPT_STATE.helperAutoSendMode = mode;
                    GM_setValue('helperAutoSendMode', mode);




                    modeBtn.querySelector('img').src = ICONS[`MODE_${mode}`];
                    addTooltipRight(modeBtn, `Отправлять ${mode} карты`);
                });
            },
            setupAutoSendObserver() {
                const tradeContainer = document.querySelector('.trade__main-items[data-type="creator"]');
                if (!tradeContainer || tradeContainer.dataset.observerAttached) return;
                const observer = new MutationObserver(() => {
                    if (SCRIPT_STATE.helperAutoSendEnabled) {
                        const selectedCount = document.querySelectorAll('.trade__main-items[data-type="creator"] .trade__main-item').length;
                        if (selectedCount === SCRIPT_STATE.helperAutoSendMode) {



                            document.querySelector('.trade__send-trade-btn')?.click();
                        }
                    }
                });
                observer.observe(tradeContainer, {
                    childList: true
                });
                tradeContainer.dataset.observerAttached = 'true';
            }
        },
        // ##################################################################
        // ############# НАЧАЛО ИСПРАВЛЕННОЙ ФУНКЦИИ С КНОПКАМИ #############
        // ##################################################################
        initializeHelperButtons: function() {
            const path = window.location.pathname;
            const loggedInUser = document.querySelector('.lgn__name span')?.textContent.trim();

            if (path.includes('/user/cards') && !path.includes('/trade')) {
                if (loggedInUser && (new URLSearchParams(window.location.search).get('name') === null || new URLSearchParams(window.location.search).get('name') === loggedInUser)) {

                    const panel = document.getElementById('super-helper-panel');
                    if (!panel) return;

                    const masterAddBtn = document.createElement('button');
                    const addAllBtn = document.createElement('button');
                    const addDuplicatesBtn = document.createElement('button');
                    const backBtn = document.createElement('button');
                    const runningCancelBtn = document.createElement('button');

                    const styleAsHelperButton = (btn) => {
                        btn.style.cssText = `background-color: rgb(108, 92, 231); transition: transform 0.2s, box-shadow 0.2s; box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 3px; position: relative; transform: scale(1); animation: 2.5s ease-in-out 0s infinite normal none running breatheShadowInteractive; border-radius: 50%; width: 40px; height: 40px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 4px;`;
                        applyHoverEffect(btn);
                    };

                    styleAsHelperButton(masterAddBtn);
                    masterAddBtn.innerHTML = `<img src="${ICONS.ADD}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(masterAddBtn, 'Добавить карты в обмен');

                    styleAsHelperButton(addAllBtn);
                    addAllBtn.innerHTML = `<img src="${ICONS.ADD_ALL}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(addAllBtn, 'Добавить ВСЕ в обмен');

                    styleAsHelperButton(addDuplicatesBtn);
                    addDuplicatesBtn.innerHTML = `<img src="${ICONS.ADD_DUPLICATES}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(addDuplicatesBtn, 'Добавить ДУБЛИ в обмен');

                    styleAsHelperButton(backBtn);
                    backBtn.innerHTML = `<img src="${ICONS.CANCEL_TRADE}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(backBtn, 'Назад');

                    styleAsHelperButton(runningCancelBtn);
                    runningCancelBtn.innerHTML = `<img src="${ICONS.CANCEL_TRADE}" style="width: 28px; height: 28px; object-fit: contain; pointer-events: none;">`;
                    addTooltipRight(runningCancelBtn, 'Остановить процесс');
                    const setUIMode = (mode) => {
                        masterAddBtn.style.display = (mode === 'idle') ? 'flex' : 'none';
                        addAllBtn.style.display = (mode === 'menu') ? 'flex' : 'none';
                        addDuplicatesBtn.style.display = (mode === 'menu') ? 'flex' : 'none';
                        backBtn.style.display = (mode === 'menu') ? 'flex' : 'none';
                        runningCancelBtn.style.display = (mode === 'running') ? 'flex' : 'none';
                    };

                    const cleanupState = () => {
                        console.log('[AS Helper] Процесс остановлен и состояние очищено.');
                        SCRIPT_STATE.isAddingInProgress = false;
                        SCRIPT_STATE.isAddingDuplicatesInProgress = false;
                        GM_deleteValue('massAddInProgress');
                        GM_deleteValue('massAddDuplicatesInProgress');
                        GM_deleteValue('totalAddedAllCount');
                        GM_deleteValue('totalAddedDuplicatesCount');
                        document.body.classList.remove('mass-adding-active');
                        setUIMode('idle');
                    };

                    masterAddBtn.onclick = () => setUIMode('menu');
                    backBtn.onclick = () => setUIMode('idle');
                    runningCancelBtn.onclick = cleanupState;


                    panel.appendChild(masterAddBtn);
                    panel.appendChild(addAllBtn);
                    panel.appendChild(addDuplicatesBtn);
                    panel.appendChild(backBtn);
                    panel.appendChild(runningCancelBtn);
                    const highlightCard = (cardElement, status) => {
                        if (!cardElement) return;
                        let bgColor, borderColor;
                        switch (status) {
                            case 'SUCCESS':
                                bgColor = 'rgba(40, 167, 69, 0.4)';
                                borderColor = 'rgba(40, 167, 69, 0.7)';
                                break;
                            case 'SKIPPED':
                                bgColor = 'rgba(255, 193, 7, 0.4)';
                                borderColor = 'rgba(255, 193, 7, 0.7)';
                                break;
                            default:
                                return;
                        }
                        cardElement.style.backgroundColor = bgColor;
                        cardElement.style.borderRadius = '8px';
                        cardElement.style.border = `2px solid ${borderColor}`;
                        cardElement.style.boxSizing = 'border-box';
                    };
                    const focusHijack = {
                        originalFocus: null,
                        disable: function() {
                            this.originalFocus = HTMLElement.prototype.focus;
                            HTMLElement.prototype.focus = () => {};
                        },
                        enable: function() {
                            if (this.originalFocus) {
                                HTMLElement.prototype.focus = this.originalFocus;
                            }
                        }
                    };
                    const fetchCardsInTradeList = (username) => {
                        return new Promise((resolve, reject) => {
                            const iframe = document.createElement('iframe');
                            iframe.style.display = 'none';

                            document.body.appendChild(iframe);
                            let offeredCardIds = new Set();
                            let pageUrl = `/user/cards/trade/?name=${username}`;

                            const processPage = () => {
                                try {
                                    const doc = iframe.contentDocument;

                                    if (!doc) throw new Error("Could not access iframe content for trade list.");
                                    doc.querySelectorAll('.anime-cards__item[data-id]').forEach(card => offeredCardIds.add(card.dataset.id));

                                    const nextPageLink = doc.querySelector('.pagination__pages-btn a[href]');
                                    if (nextPageLink) {
                                        iframe.src = new URL(nextPageLink.href, window.location.origin).href;
                                    } else {
                                        document.body.removeChild(iframe);
                                        resolve(offeredCardIds);
                                    }
                                } catch (error) {
                                    document.body.removeChild(iframe);
                                    reject(error);
                                }
                            };
                            iframe.onload = processPage;
                            iframe.onerror = () => {
                                document.body.removeChild(iframe);
                                reject(new Error("Iframe loading error while fetching trade list."));
                            };
                            iframe.src = pageUrl;
                        });
                    };
                    const startAddingProcess = async () => {
                        setUIMode('running');
                        document.body.classList.add('mass-adding-active');
                        let addedCount = GM_getValue('totalAddedAllCount', 0);
                        const cardsOnPage = document.querySelectorAll('.anime-cards__item');
                        for (const card of cardsOnPage) {
                            if (!SCRIPT_STATE.isAddingInProgress) break;
                            try {
                                focusHijack.disable();
                                card.click();

                                await new Promise((resolve, reject) => {
                                    const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);
                                    const interval = setInterval(() => {

                                        const tradeBtn = document.querySelector('#card-modal .all-owners[onclick*="ProposeAdd.call"]');
                                        if (tradeBtn) {

                                            clearInterval(interval);
                                            clearTimeout(timeout);

                                            tradeBtn.click();
                                            addedCount++;
                                            console.log(`[AS Helper] Успешно добавлено. Total: ${addedCount}`);
                                            highlightCard(card, 'SUCCESS');
                                            resolve();

                                        }
                                    }, 100);
                                });
                            } catch (error) {
                                console.log('[AS Helper] Карта уже в обмене или кнопка не найдена. Пропуск.');
                                highlightCard(card, 'SKIPPED');
                                document.dispatchEvent(new KeyboardEvent('keydown', {
                                    key: 'Escape'
                                }));
                            } finally {
                                focusHijack.enable();
                            }
                            await wait(700);
                        }

                        if (!SCRIPT_STATE.isAddingInProgress) {
                            cleanupState();
                            return;
                        }

                        GM_setValue('totalAddedAllCount', addedCount);
                        const currentPageEl = document.querySelector('.pagination__pages > span:not([class])');
                        const nextPageA = currentPageEl ? currentPageEl.nextElementSibling : null;
                        if (nextPageA && nextPageA.tagName === 'A') {
                            window.location.href = nextPageA.href;
                        } else {
                            alert(`Процесс завершен. Всего добавлено карт: ${addedCount}`);
                            cleanupState();
                        }
                    };
                    const startAddingDuplicatesProcess = async () => {
                        setUIMode('running');
                        document.body.classList.add('mass-adding-active');

                        try {
                            const offeredCardIds = await fetchCardsInTradeList(loggedInUser);
                            console.log(`[AS Helper] Найдено ${offeredCardIds.size} карт в обмене. Начинаю добавление дублей.`);
                            let totalAddedCount = GM_getValue('totalAddedDuplicatesCount', 0);

                            const cardsOnPageMap = new Map();
                            for (const cardEl of document.querySelectorAll('.anime-cards__item')) {
                                const imagePath = cardEl.dataset.image;
                                if (!imagePath) continue;
                                if (!cardsOnPageMap.has(imagePath)) {
                                    cardsOnPageMap.set(imagePath, []);
                                }
                                cardsOnPageMap.get(imagePath).push(cardEl);
                            }

                            for (const cardGroup of cardsOnPageMap.values()) {
                                if (!SCRIPT_STATE.isAddingDuplicatesInProgress) break;
                                if (cardGroup.length <= 1) continue;

                                const cardId = cardGroup[0].dataset.id;
                                if (cardId && offeredCardIds.has(cardId)) {
                                    console.log(`[AS Helper] Карта ID ${cardId} уже в обмене, пропуск.`);
                                    highlightCard(cardGroup[0], 'SKIPPED');
                                    continue;
                                }

                                const duplicatesToAdd = cardGroup.slice(1);
                                console.log(`[AS Helper] Карта ID ${cardId}: найдено ${duplicatesToAdd.length} дублей для добавления.`);
                                for (const cardToAdd of duplicatesToAdd) {
                                    if (!SCRIPT_STATE.isAddingDuplicatesInProgress) break;
                                    try {
                                        focusHijack.disable();
                                        cardToAdd.click();
                                        await new Promise((resolve, reject) => {
                                            const timeout = setTimeout(() => reject(new Error('Timeout')), 3000);

                                            const interval = setInterval(() => {
                                                const tradeBtn = document.querySelector('#card-modal .all-owners[onclick*="ProposeAdd.call"]');

                                                if (tradeBtn) {
                                                    clearInterval(interval);

                                                    clearTimeout(timeout);
                                                    tradeBtn.click();

                                                    totalAddedCount++;
                                                    console.log(`[AS Helper] Всего добавлено дублей: ${totalAddedCount}`);

                                                    highlightCard(cardToAdd, 'SUCCESS');
                                                    resolve();
                                                }
                                            }, 100);
                                        });
                                    } catch (error) {
                                        console.log('[AS Helper] Дубль уже в обмене или кнопка не найдена. Пропуск.');
                                        highlightCard(cardToAdd, 'SKIPPED');
                                        document.dispatchEvent(new KeyboardEvent('keydown', {
                                            key: 'Escape'
                                        }));
                                    } finally {
                                        focusHijack.enable();
                                    }
                                    await wait(700);
                                }
                                if (cardId) offeredCardIds.add(cardId);
                            }

                            if (!SCRIPT_STATE.isAddingDuplicatesInProgress) {
                                cleanupState();
                                return;
                            }

                            GM_setValue('totalAddedDuplicatesCount', totalAddedCount);
                            const currentPageEl = document.querySelector('.pagination__pages > span:not([class])');
                            const nextPageA = currentPageEl ? currentPageEl.nextElementSibling : null;
                            if (nextPageA && nextPageA.tagName === 'A') {
                                window.location.href = nextPageA.href;
                            } else {
                                alert(`Процесс завершен. Всего добавлено дублей: ${totalAddedCount}`);
                                cleanupState();
                            }

                        } catch (error) {
                            console.error('[AS Helper] Ошибка при добавлении дублей:', error);
                            alert(`Произошла ошибка: ${error.message}`);
                            cleanupState();
                        }
                    };
                    addAllBtn.onclick = () => {
                        SCRIPT_STATE.isAddingInProgress = true;
                        GM_setValue('massAddInProgress', true);
                        GM_deleteValue('totalAddedAllCount');
                        startAddingProcess();
                    };

                    addDuplicatesBtn.onclick = () => {
                        SCRIPT_STATE.isAddingDuplicatesInProgress = true;
                        GM_setValue('massAddDuplicatesInProgress', true);
                        GM_deleteValue('totalAddedDuplicatesCount');
                        startAddingDuplicatesProcess();
                    };

                    if (GM_getValue('massAddInProgress', false)) {
                        SCRIPT_STATE.isAddingInProgress = true;
                        startAddingProcess();
                    } else if (GM_getValue('massAddDuplicatesInProgress', false)) {
                        SCRIPT_STATE.isAddingDuplicatesInProgress = true;
                        startAddingDuplicatesProcess();
                    } else {
                        setUIMode('idle');
                    }
                }
            }

            if (path.includes('/user/cards/trade')) {
                if (loggedInUser && new URLSearchParams(window.location.search).get('name') === loggedInUser) {
                    const setButtonState = (btn, state) => {

                        const img = btn.querySelector('img');
                        if (state === 'running') {
                            img.src = ICONS.CANCEL_TRADE;
                            addTooltipRight(btn, 'Остановить удаление');
                        } else {
                            img.src = ICONS.REMOVE;
                            addTooltipRight(btn, 'Удалить все из обмена');
                        }
                    };
                    const startRemovingProcess = async (btn) => {
                        if (btn) setButtonState(btn, 'running');
                        const removeBtns = document.querySelectorAll('button.card-offer-remove-btn');
                        if (removeBtns.length === 0) {
                            alert('Нет карт для удаления.');
                            SCRIPT_STATE.isRemovingInProgress = false;
                            if (btn) setButtonState(btn, 'stopped');
                            return;
                        }
                        for (const r_btn of removeBtns) {
                            if (!SCRIPT_STATE.isRemovingInProgress) {

                                console.log('[AS Helper] Процесс удаления остановлен пользователем.');
                                return;
                            }
                            r_btn.click();
                            await wait(250);
                        }
                        if (SCRIPT_STATE.isRemovingInProgress) {
                            alert(`Отправлено ${removeBtns.length} запросов на удаление. Страница перезагрузится.`);
                            SCRIPT_STATE.isRemovingInProgress = false;
                            window.location.reload();
                        }
                    };
                    const removeBtn = createStyledButton('removeAllFromTradeBtn', 'Удалить все из обмена', ICONS.REMOVE, () => {
                        SCRIPT_STATE.isRemovingInProgress = !SCRIPT_STATE.isRemovingInProgress;
                        if (SCRIPT_STATE.isRemovingInProgress) {
                            console.log('[AS Helper] Запущен процесс удаления всех карт.');



                            startRemovingProcess(removeBtn);
                        } else {
                            console.log('[AS Helper] Процесс удаления будет остановлен.');



                            setButtonState(removeBtn, 'stopped');
                        }
                    });
                }
            }
        }
        // ##################################################################
        // ############## КОНЕЦ ИСПРАВЛЕННОЙ ФУНКЦИИ С КНОПКАМИ #############
        // ##################################################################
    };
    const BoostHelper = {
        mainInterval: null,
        skipInterval: null,
        lastCardImageUrl: null,
        cardUnchangedSince: null,
        limitObserver: null,
        mainClicker: function() {
            const boostBtn = document.querySelector('.club__boost-btn, .club__boost__refresh-btn');
            if (boostBtn) {
                boostBtn.click();
            }
        },
        cardSkipper: function() {
            const replaceBtn = document.querySelector('button.club-boost__replace-btn');
            if (!replaceBtn) return;
            const noOwnersMessage = document.querySelector('.club-boost__text');
            if (noOwnersMessage && noOwnersMessage.textContent.includes('Карты ни у кого из клуба нет')) {
                console.log('[Boost Helper] Сообщение "Карты ни у кого нет". Пропускаем...');
                replaceBtn.click();
                this.cardUnchangedSince = Date.now();
                return;
            }
            const cardImage = document.querySelector('.club-boost__image img');
            const currentCardImageUrl = cardImage ? cardImage.src : null;
            if (currentCardImageUrl && currentCardImageUrl !== this.lastCardImageUrl) {
                this.lastCardImageUrl = currentCardImageUrl;
                this.cardUnchangedSince = Date.now();
            } else if (currentCardImageUrl) {
                if (Date.now() - this.cardUnchangedSince > 1000) {
                    replaceBtn.click();
                    this.cardUnchangedSince = Date.now();
                }
            }
        },
        handleMainToggle: function() {
            if (SCRIPT_STATE.boostMainEnabled) {
                if (this.mainInterval) return;
                this.mainInterval = setInterval(() => this.mainClicker(), 10);
                console.log('[Boost Helper] Основной кликер ЗАПУЩЕН.');
            } else {
                if (!this.mainInterval) return;
                clearInterval(this.mainInterval);
                this.mainInterval = null;
                console.log('[Boost Helper] Основной кликер ОСТАНОВЛЕН.');
            }
        },
        handleSkipToggle: function() {
            if (SCRIPT_STATE.boostSkipEnabled) {
                if (this.skipInterval) return;
                this.skipInterval = setInterval(() => this.cardSkipper(), 500);
                console.log('[Boost Helper] Скрипт пропуска карт ЗАПУЩЕН.');
            } else {
                if (!this.skipInterval) return;
                clearInterval(this.skipInterval);
                this.skipInterval = null;
                this.lastCardImageUrl = null;
                console.log('[Boost Helper] Скрипт пропуска карт ОСТАНОВЛЕН.');
            }
        },
        limitWatcher: function() {
            const targetNode = document.querySelector('main');
            if (!targetNode) return;
            const checkLimit = (node) => {
                if (node && node.nodeType === 1 && node.textContent.includes('В день можно пожертвовать до 600/600 карт.')) {
                    console.log('[Boost Helper] Дневной лимит 600/600 достигнут. Отключаю автокликер и скип.');
                    if (SCRIPT_STATE.boostMainEnabled) {
                        const mainToggle = document.getElementById('toggleMainBoost');
                        if (mainToggle) mainToggle.click();
                    }
                    if (SCRIPT_STATE.boostSkipEnabled) {
                        const skipToggle = document.getElementById('toggleSkipBoost');
                        if (skipToggle) skipToggle.click();
                    }
                }
            };
            checkLimit(targetNode);
            this.limitObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => checkLimit(node));
                    } else if
                    (mutation.type === 'characterData') {
                        checkLimit(mutation.target.parentElement);
                    }
                }
            });
            this.limitObserver.observe(targetNode, {
                childList: true,
                subtree: true,
                characterData: true
            });
        },
        scheduleAutoBoost: function() {
            const now = new Date();
            let targetTime = new Date();
            targetTime.setUTCHours(18, 1, 2, 50);
            if (now.getTime() > targetTime.getTime()) {
                targetTime.setDate(targetTime.getDate() + 1);
            }
            const delay = targetTime.getTime() - now.getTime();
            console.log(`[Boost Helper] Автокликер запланирован на ${targetTime.toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })} (МСК)`);
            setTimeout(() => {
                console.log('[Boost Helper] Запуск запланированного автокликера.');
                if (!SCRIPT_STATE.boostMainEnabled) {
                    const mainToggle = document.getElementById('toggleMainBoost');
                    if (mainToggle) {


                        mainToggle.click();
                    }
                }
            }, delay);
        },
        initialize: function() {
            createToggleButton({
                id: 'toggleMainBoost',
                tooltipOn: 'Автокликер ВКЛ',
                tooltipOff: 'Автокликер ВЫКЛ',
                stateKey: 'boostMainEnabled',
                onToggle: () => this.handleMainToggle(),
                iconOn: ICONS.BOOST_ON,
                iconOff: ICONS.BOOST_OFF
            });
            if (document.querySelector('button.club-boost__replace-btn')) {
                createToggleButton({
                    id: 'toggleSkipBoost',
                    tooltipOn: 'Авто скип ВКЛ',
                    tooltipOff: 'Авто скип ВЫКЛ',
                    stateKey: 'boostSkipEnabled',
                    onToggle: () => this.handleSkipToggle(),
                    iconOn: ICONS.BOOST_ON,
                    iconOff: ICONS.BOOST_OFF
                });
            }
            this.scheduleAutoBoost();
            this.limitWatcher();
        }
    };
    const NotificationHider = {
        observer: null,
        spamTexts: [
            "Нужная клубу карта изменилась",
            "Нужная клубу карта не менялась",
            "Слишком часто. Ваше мастерство превосходно - но замедлитесь, познайте просветление"
        ],
        dailyLimitText: "Достигнут дневной лимит пожертвований в клуб, подождите до завтра",


        processNotification: function(node) {
            if (node.nodeType === 1 && node.matches('.DLEPush-notification, .custom-card-notification')) {
                const messageElement = node.querySelector('.DLEPush-message') ||
                    node;
                if (messageElement) {
                    const notificationText = messageElement.textContent.trim();
                    if (this.spamTexts.includes(notificationText)) {
                        node.style.display = 'none';
                        return;
                    }
                    if (notificationText === this.dailyLimitText) {
                        console.log('[Notification Hider] Обнаружен дневной лимит пожертвований. Отключение модулей...');
                        if (SCRIPT_STATE.boostMainEnabled) {
                            document.getElementById('toggleMainBoost')?.click();
                        }
                        if (SCRIPT_STATE.boostSkipEnabled) {
                            document.getElementById('toggleSkipBoost')?.click();
                        }
                    }
                }
            }
        },
        initialize: function() {
            document.querySelectorAll('.DLEPush-notification, .custom-card-notification').forEach(notification => this.processNotification(notification));
            this.observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {



                            if (node.nodeType === 1) {
                                if (node.matches('.DLEPush-notification, .custom-card-notification')) {
                                    this.processNotification(node);


                                }
                                node.querySelectorAll('.DLEPush-notification, .custom-card-notification').forEach(notification => this.processNotification(notification));
                            }
                        });


                    }
                }
            });
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    const ClubInfoHelper = {
        config: {
            injectionPointSelector: '.secondary-title.text-center',
            nicknameSelector: '.lgn__name span',
            clubInfoStorageKey: 'clubInfoHelper_clubData',
            userInfoStorageKey: 'clubInfoHelper_userData',
        },
        calculateDuration(endTimeString) {
            try {

                const startTime = new Date();
                startTime.setHours(21, 1, 0, 0);
                const endTimeParts = endTimeString.split('(')[0].split(':');
                const endTime = new Date();
                endTime.setHours(
                    parseInt(endTimeParts[0], 10), parseInt(endTimeParts[1], 10), parseInt(endTimeParts[2], 10), 0
                );

                const diffMs =
                    endTime - startTime;
                if (diffMs < 0) return "Ошибка расчета";
                const totalSeconds = Math.floor(diffMs / 1000);
                const minutes = Math.floor(totalSeconds / 60);


                const seconds = totalSeconds % 60;

                return `${minutes} мин ${seconds.toString().padStart(2, '0')} сек`;
            } catch (error) {
                console.error('[AS Helper] Ошибка при расчете времени:', error);
                return "Ошибка";
            }
        },
        updateDisplay: function() {

            const clubContainer = document.getElementById('club-rank-info');
            const userContainer = document.getElementById('user-contribution-info');
            if (!clubContainer || !userContainer) return;
            const clubData = GM_getValue(this.config.clubInfoStorageKey, null);
            const userData = GM_getValue(this.config.userInfoStorageKey, null);
            clubContainer.innerHTML = clubData ?
                `Место клуба: ${clubData.place} | Закрыли за: ${clubData.displayTime}` : '';
            userContainer.innerHTML = userData ? `Моё место: №${userData.position} |
Внесено карт: ${userData.contribution}` : '';
        },
        fetchClubInfo: function() {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${CURRENT_ORIGIN}/clubs/`,
                    onload: (response) => {

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const clubLink = Array.from(doc.querySelectorAll('.club-top-list__name')).find(a => a.textContent.trim() === 'Oni no Kage');

                        if (!clubLink) return resolve();
                        const clubContainer = clubLink.closest('.club-top-list__item');
                        if (!clubContainer) return resolve();

                        const place = clubContainer.querySelector('.club-top-list__place div')?.textContent.trim() || 'не найдено';

                        let displayTime = 'не найдено';
                        const timeMatch = clubContainer.querySelector('.club-top-list__count')?.textContent.match(/Время\s*([\d:()msa-z]+)/i);
                        if (timeMatch && timeMatch[1]) displayTime = this.calculateDuration(timeMatch[1]);
                        const data = {
                            place,
                            displayTime
                        };
                        GM_setValue(this.config.clubInfoStorageKey, data);
                        resolve();
                    }
                });
            });
        },
        fetchUserContributionInfo: function(nickname) {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `${CURRENT_ORIGIN}/clubs/boost/?id=71`,
                    onload: (response) => {

                        const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                        let userRow;
                        for (const row of doc.querySelectorAll('.club-boost__top-item')) {

                            if (row.querySelector('.club-boost__top-name')?.textContent.trim() === nickname) {
                                userRow = row;
                                break;
                            }

                        }
                        if (userRow) {
                            const position = userRow.querySelector('.club-boost__top-position').textContent.trim();


                            const contribution = userRow.querySelector('.club-boost__top-contribution').textContent.trim();
                            const data = {
                                position,
                                contribution
                            };
                            GM_setValue(this.config.userInfoStorageKey, data);
                        }
                        resolve();
                    }
                });
            });
        },
        initialize: function() {
            const injectionPoint = document.querySelector(this.config.injectionPointSelector);
            if (injectionPoint) {
                if (!document.getElementById('club-rank-info')) {
                    const clubDiv = document.createElement('div');
                    clubDiv.id = 'club-rank-info';
                    injectionPoint.parentNode.insertBefore(clubDiv, injectionPoint);
                }
                if (!document.getElementById('user-contribution-info')) {
                    const userDiv = document.createElement('div');
                    userDiv.id = 'user-contribution-info';
                    const clubDiv = document.getElementById('club-rank-info');
                    clubDiv.parentNode.insertBefore(userDiv, clubDiv.nextSibling);
                }
            }
            this.updateDisplay();
            createStyledButton('refreshClubInfoBtn', 'Обновить информацию', ICONS.REFRESH, async (e) => {
                const btn = e.currentTarget;
                const img = btn.querySelector('img');
                addTooltipRight(btn, 'Обновление...');
                img.style.animation = 'cardHelperSpin 1.2s linear infinite';
                btn.disabled
                = true;
                const nicknameElement = document.querySelector(this.config.nicknameSelector);
                if (nicknameElement) {
                    const nickname = nicknameElement.textContent.trim();

                    await Promise.all([


                        this.fetchClubInfo(),
                        this.fetchUserContributionInfo(nickname)
                    ]);
                    this.updateDisplay();
                }



                btn.disabled = false;
                img.style.animation = '';
                addTooltipRight(btn, 'Обновить информацию');
            });
        }
    };
    const ImageZoomHelper = {
        initialize: function() {
            const addZoomFunctionality = (imageElement) => {
                if (imageElement.dataset.zoomListenerAdded) {
                    return;
                }
                imageElement.dataset.zoomListenerAdded = 'true';
                imageElement.addEventListener('click', function() {
                    const modalContent = this.closest('#card-modal');
                    const placeholder = this.closest('.anime-cards__placeholder');
                    this.classList.toggle('enlarged');
                    if (placeholder) {



                        placeholder.classList.toggle('is-zoomed');
                    }
                    if (modalContent) {
                        if (this.classList.contains('enlarged')) {



                            modalContent.style.overflow = 'visible';
                        } else {
                            modalContent.style.overflow = 'auto';
                        }



                    }
                });
            };
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        const image = document.querySelector('.anime-cards__placeholder img:not([data-zoom-listener-added])');



                        if (image) {
                            addZoomFunctionality(image);
                        }
                    }
                }



            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    const PackButtonHelper = {
        initialize: function() {
            const loggedInUser = document.querySelector('.lgn__name span')?.textContent.trim();
            const pageUser = new URLSearchParams(window.location.search).get('name');
            const isCorrectPath = window.location.pathname === '/user/cards/';
            if (!loggedInUser || !isCorrectPath || (pageUser !== null && pageUser !== loggedInUser)) {
                return;
            }
            const containerSelector = '.ncard__tabs-btns';
            waitForElement(containerSelector, (firstContainer) => {
                const allContainers = document.querySelectorAll(containerSelector);
                let targetContainer = null;
                if (allContainers.length > 1) {
                    targetContainer = allContainers[1];
                } else if (allContainers.length === 1) {
                    targetContainer = allContainers[0];
                } else {
                    return;
                }
                if (targetContainer.querySelector('#pack-button-helper')) {



                    return;
                }
                const packButton = document.createElement('a');
                packButton.id = 'pack-button-helper';
                packButton.className = 'ncard__tabs-btn btn c-gap-10';



                packButton.href = `${CURRENT_ORIGIN}/cards/pack/`;
                packButton.textContent = 'Паки карт';
                targetContainer.appendChild(packButton);
            });
        }
    };
    const UpgradeHelper = {
        currentNotification: {
            element: null,
            id: null,
            type: null,
            timeoutId: null
        },
        initialize: function() {
            if
            (!window.location.search.includes('sort=duplicates')) return;
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length && document.querySelector('.modal__body .anime-cards__wrapper:not(.--processed-upgrade)')) {
                        const modalBody = document.querySelector('.modal__body .anime-cards__wrapper');



                        modalBody.classList.add('--processed-upgrade');
                        this.addUpgradeButton(modalBody);
                    }
                });
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },
        addUpgradeButton: function(modalBody) {
            const nameElement = modalBody.querySelector('.anime-cards__name');
            if (!nameElement) return;
            const button = document.createElement('button');
            button.className = 'upgrade-star-btn';
            button.innerHTML = '<i class="fas fa-star"></i>';
            addTooltipTop(button, 'Повысить звёздность');
            button.onclick = (event) => this.handleUpgrade(event);
            nameElement.appendChild(button);
        },
        handleUpgrade: async function(event) {
            event.stopPropagation();
            event.preventDefault();
            const notificationId = 'upgradeProcess';
            const modal = event.target.closest('.modal__body');
            const username = new URLSearchParams(window.location.search).get('name');
            if (!username) return this.showTemporaryMessage('userError', 'Не удалось определить имя пользователя.', false);
            const animeTitle = modal.querySelector('.anime-cards__link span').textContent.trim();
            const imageUrl = modal.querySelector('.anime-cards__placeholder img').src;
            const characterName = modal.querySelector('.anime-cards__name').firstChild.textContent.trim();
            const rank = modal.querySelector('.ncard__rank[class*="rank-"]').className.match(/rank-([sabcde])/)[1];
            const imageRelativePath = new URL(imageUrl).pathname;
            const cardElementOnPage = document.querySelector(`.anime-cards__item[data-image="${imageRelativePath}"]`);
            if (!cardElementOnPage) {
                return this.showTemporaryMessage('criticalError', 'Критическая ошибка: не удалось найти карту на странице.', false);
            }
            const totalCardCount = parseInt(cardElementOnPage.querySelector('.dupl-count')?.textContent || '0', 10);
            const progressUrl = `${CURRENT_ORIGIN}/user/${username}/cards_progress/`;

            this.displayNotification(notificationId, 'Начинаю процесс улучшения...', 'progress', {
                sticky: true
            });
            if (isMobile) {
                GM_setValue('upgrade.isActive', true);
                GM_setValue('upgrade.step', 'searchForAnime'); // Start with the first logical step
                GM_setValue('upgrade.username', username);
                GM_setValue('upgrade.animeTitle', animeTitle);
                GM_setValue('upgrade.rank', rank);
                GM_setValue('upgrade.characterName', characterName);
                GM_setValue('upgrade.imageUrl', imageUrl);
                GM_setValue('upgrade.totalCardCount', totalCardCount);
                GM_setValue('upgrade.progressUrl', progressUrl);
                GM_setValue('upgrade.returnUrl', window.location.href);
                GM_setValue('upgrade.wasFixed', false);
                GM_setValue('upgrade.status', 'STARTED');

                window.open(progressUrl, '_blank');
                const interval = setInterval(() => {
                    const status = GM_getValue('upgrade.status', 'STARTED');
                    if (status !== 'STARTED') {
                        clearInterval(interval);


                        if (status === 'SUCCESS') {
                            this.completeProgressNotification(notificationId, 'Карта успешно улучшена!', true, 5000);
                            setTimeout(() => window.location.reload(), 2000);
                        } else {


                            this.completeProgressNotification(notificationId, `Ошибка: ${status}`, false, 5000);
                        }
                        this.clearWorkerState();
                    }


                }, 1000);
            } else {
                const iframe = document.createElement('iframe');
                iframe.id = 'upgrade-task-iframe';
                document.body.appendChild(iframe);
                let wasFixed = false;
                let upgradeSucceeded = false;
                try {
                    wasFixed = await this.unfixCollection(iframe, progressUrl, animeTitle, notificationId);
                    const resultMessage = await this.attemptUpgrade(iframe, rank, characterName, imageUrl, totalCardCount, notificationId);
                    if (resultMessage === 'success') {
                        upgradeSucceeded = true;
                        this.completeProgressNotification(notificationId, 'Карта успешно улучшена!', true, 5000);
                    } else {
                        this.completeProgressNotification(notificationId, resultMessage, false, 5000);
                    }
                } catch (error) {
                    this.completeProgressNotification(notificationId, `Произошла ошибка: ${error.message}`, false, 5000);
                    console.error('[Upgrade Helper] Ошибка в процессе повышения:', error);
                } finally {
                    if (wasFixed) {
                        try {
                            await this.fixCollection(iframe, progressUrl, animeTitle, notificationId);
                        } catch (fixError) {
                            this.showTemporaryMessage('fixError', 'Не удалось вернуть фиксацию коллекции.', false, 5000);
                            console.error('[Upgrade Helper] Ошибка при возврате фиксации:', fixError);
                        }
                    }
                    if (upgradeSucceeded) {
                        setTimeout(() => window.location.reload(), 2000);
                    } else {
                        setTimeout(() => {
                            if (iframe && iframe.parentNode) iframe.remove();
                        }, 6000);
                    }
                }
            }
        },
        attemptUpgrade: async function(context, rank, characterName, imageUrl, totalCards, notificationId) {
            this.updateNotificationProgress(notificationId, "Загрузка страницы улучшения...");
            let doc = await this._loadPageWithScripts(context, `${CURRENT_ORIGIN}/update_stars/`);
            const rankButton = await this._waitForElement(doc, `.tabs__item.tabs__navigate__rank[data-rank="${rank}"]`);
            if (!rankButton.classList.contains('tabs__item--active')) {
                rankButton.click();
                doc = await this._waitForNextPageLoad(context);
            }
            const searchInput = await this._waitForElement(doc, 'input.form__field[placeholder="Имя персонажа..."]');
            searchInput.value = characterName;
            doc.querySelector('.card-stars-form__search-btn').click();
            doc = await this._waitForNextPageLoad(context);
            await this._waitForElement(doc, '.card-stars-list__items, .pagination__pages', 10000);
            const urlParts = imageUrl.split('/');
            const uniqueImageFilename = urlParts[urlParts.length - 1];
            if (!uniqueImageFilename) throw new Error(`Не удалось извлечь имя файла из URL изображения: ${imageUrl}`);
            const cardSelector = `.card-stars-list__items .card-stars-list__card img[src$="${uniqueImageFilename}"]`;
            let cardImg = null;
            let currentPage = 1;
            const maxPagesToScan = 20;
            while (currentPage <= maxPagesToScan) {
                this.updateNotificationProgress(notificationId, `Поиск карты на странице ${currentPage}...`);
                cardImg = doc.querySelector(cardSelector);
                if (cardImg) break;
                const nextPageLink = doc.querySelector('.pagination__pages-btn a');
                if (nextPageLink) {
                    const nextPageUrl = new URL(nextPageLink.href, doc.location.origin).href;
                    try {
                        doc = await this._loadIframePage(context, nextPageUrl);
                        currentPage++;
                    } catch (error) {
                        throw new Error(`Не удалось загрузить следующую страницу. ${error.message}`);
                    }
                } else {
                    break;
                }
            }
            if (!cardImg) throw new Error(`Карта не найдена ни на одной из страниц поиска (проверено ${currentPage} стр.).`);
            this.updateNotificationProgress(notificationId, "Карта найдена, проверка стоимости...");
            cardImg.parentElement.click();
            const infoDiv = await this._waitForTextInElement(doc, '.card-level-up__info', 'потребуется', 10000);
            const requiredMatch = infoDiv.textContent.match(/потребуется (\d+) дублей карт/);
            if (!requiredMatch) throw new Error('Не удалось определить стоимость улучшения.');
            const requiredCount = parseInt(requiredMatch[1], 10);
            const actualDuplicates = totalCards - 1;
            if (actualDuplicates < requiredCount) {
                const needed = requiredCount - actualDuplicates;
                return `Не хватает дублей. Нужно еще ${needed} шт.`;
            }
            this.updateNotificationProgress(notificationId, "Начинаю улучшение...");
            const startBtn = await this._waitForElement(doc, '.card-level-up__start-btn');
            startBtn.click();
            const pushMessage = await this._waitForElement(doc, '.DLEPush-message', 15000);
            return pushMessage.textContent.toLowerCase().includes('успешно') ? 'success' : `${pushMessage.textContent}`;
        },
        unfixCollection: async function(context, url, title, notificationId) {
            this.updateNotificationProgress(notificationId, "Проверка фиксации коллекции...");
            let doc = await this._loadPageWithScripts(context, url);
            const searchInput = await this._waitForElement(doc, 'input.form__field[placeholder="Название аниме..."]');
            searchInput.value = title;
            doc.querySelector('.progress__search-btn').click();
            doc = await this._waitForNextPageLoad(context);
            const animeLink = await this._waitForAnimeTitle(doc, title);
            const fixButton = animeLink.closest('.user-anime').querySelector('.fix-my-progress');
            const wasFixed = fixButton.getAttribute('data-fixed') === '1';
            if (wasFixed) {
                this.updateNotificationProgress(notificationId, "Снимаю фиксацию коллекции...");
                fixButton.click();
                const confirmDialog = await this._waitForElement(doc, '.ui-dialog.dle-popup-confirm');
                const confirmButton = Array.from(confirmDialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                if (!confirmButton) throw new Error('Кнопка "Подтвердить" не найдена.');
                confirmButton.click();
                await this._waitForElementDisappear(doc, '.ui-dialog.dle-popup-confirm');
                await this._waitForAttribute(fixButton, 'data-fixed', '0');
            }
            return wasFixed;
        },
        fixCollection: async function(context, url, title, notificationId) {
            let doc = await this._loadPageWithScripts(context, url);
            const searchInput = await this._waitForElement(doc, 'input.form__field[placeholder="Название аниме..."]');
            searchInput.value = title;
            doc.querySelector('.progress__search-btn').click();
            doc = await this._waitForNextPageLoad(context);
            const animeLink = await this._waitForAnimeTitle(doc, title);
            const fixButton = animeLink.closest('.user-anime').querySelector('.fix-my-progress');
            const isUnfixed = fixButton.getAttribute('data-fixed') === '0';
            if (isUnfixed) {
                fixButton.click();
                const confirmDialog = await this._waitForElement(doc, '.ui-dialog.dle-popup-confirm');
                const confirmButton = Array.from(confirmDialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                if (!confirmButton) throw new Error('Кнопка "Подтвердить" (фиксация) не найдена.');
                confirmButton.click();
                await this._waitForElementDisappear(doc, '.ui-dialog.dle-popup-confirm');
                await this._waitForAttribute(fixButton, 'data-fixed', '1');
            }
        },
        _loadPageWithScripts: (context, url) => new Promise(resolve => {
            if (context.tagName === 'IFRAME') {
                context.onload = () => resolve(context.contentWindow.document);
                context.src = url;
            } else {

                resolve(context);
            }
        }),
        _waitForNextPageLoad: (context) => new Promise(resolve => {
            if (context.tagName === 'IFRAME') {
                context.onload = () => resolve(context.contentWindow.document);
            } else {

                resolve(context);
            }
        }),

        _loadIframePage: (iframe, url, timeout = 15000) => {
            return new Promise((resolve, reject) => {
                const timer = setTimeout(() => {


                    iframe.onload = null;
                    reject(new Error(`Загрузка iframe превысила таймаут: ${url}`));

                }, timeout);
                iframe.onload = () => {
                    clearTimeout(timer);
                    iframe.onload = null;
                    resolve(iframe.contentWindow.document);

                };
                iframe.onerror = () => {
                    clearTimeout(timer);
                    iframe.onerror = null;
                    reject(new Error(`Iframe не смог загрузить: ${url}`));
                };
                iframe.src = url;
            });
        },
        _waitForElement: (doc, selector, timeout = 7000) => new Promise((resolve, reject) => {
            const el = doc.querySelector(selector);
            if (el) return resolve(el);
            const observer = new MutationObserver(() => {
                const foundEl = doc.querySelector(selector);


                if (foundEl) {
                    observer.disconnect();
                    clearTimeout(id);
                    resolve(foundEl);
                }
            });


            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Элемент не найден: ${selector}`));
            }, timeout);
            observer.observe(doc.body, {
                childList: true,
                subtree: true
            });
        }),
        _waitForAttribute: (element, attrName, expectedValue, timeout = 3000) => new Promise((resolve, reject) => {
            if (element.getAttribute(attrName) === expectedValue) return resolve();
            const observer = new MutationObserver(() => {
                if (element.getAttribute(attrName) === expectedValue) {
                    observer.disconnect();
                    clearTimeout(id);
                    resolve();

                }
            });
            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Атрибут '${attrName}' не стал равен '${expectedValue}'`));
            }, timeout);
            observer.observe(element, {
                attributes: true
            });
        }),
        _waitForTextInElement: (doc, selector, text, timeout = 3000) => new Promise((resolve, reject) => {
            let observer;
            const checkText = () => {
                const element = doc.querySelector(selector);
                if (element && element.textContent.includes(text)) {



                    if (observer) observer.disconnect();
                    clearTimeout(id);
                    resolve(element);
                    return true;
                }



                return false;
            };
            const id = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(new Error(`Текст "${text}" не появился в "${selector}"`));
            }, timeout);

            if
            (!checkText()) {
                observer = new MutationObserver(checkText);
                observer.observe(doc.body, {
                    childList: true,
                    subtree: true
                });

            }
        }),
        _waitForElementDisappear: (doc, selector, timeout = 3000) => new Promise((resolve, reject) => {
            if (!doc.querySelector(selector))
                return resolve();
            const observer = new MutationObserver(() => {
                if (!doc.querySelector(selector)) {
                    observer.disconnect();
                    clearTimeout(id);
                    resolve();

                }
            });

            const id = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Элемент "${selector}" не исчез`));
            }, timeout);
            observer.observe(doc.body, {
                childList: true,
                subtree: true
            });
        }),
        _waitForAnimeTitle: (doc, title, timeout = 3000) => new Promise((resolve, reject) => {
            let observer;
            const check = () => {
                const animeLink = Array.from(doc.querySelectorAll('.user-anime__title')).find(a => a.textContent.trim() === title);
                if (animeLink) {



                    if (observer) observer.disconnect();
                    clearTimeout(id);
                    resolve(animeLink);
                    return true;
                }



                return false;
            };
            const id = setTimeout(() => {
                if (observer) observer.disconnect();
                reject(new Error(`Аниме "${title}" не найдено`));
            }, timeout);
            if (!check()) {
                observer = new MutationObserver(check);
                observer.observe(doc.body, {
                    childList: true,
                    subtree: true
                });
            }
        }),
        displayNotification: function(id, message, type = 'temporary', options = {}) {
            const {
                isSuccess = true, duration = 3500, sticky = false
            } = options;
            if (this.currentNotification.element && this.currentNotification.id !== id) {
                if (this.currentNotification.timeoutId) clearTimeout(this.currentNotification.timeoutId);
                if (this.currentNotification.element.parentNode) this.currentNotification.element.remove();
                this.currentNotification.element = null;
                this.currentNotification.id = null;
            }
            let notificationElement = this.currentNotification.element;
            if (!notificationElement || this.currentNotification.id !== id || (this.currentNotification.type === 'progress' && type !== 'progress')) {
                if (notificationElement && notificationElement.parentNode) notificationElement.remove();
                notificationElement = document.createElement('div');
                notificationElement.className = 'card-helper-status-notification';
                document.body.appendChild(notificationElement);
                this.currentNotification.element = notificationElement;
                this.currentNotification.id = id;
            }
            this.currentNotification.type = type;
            let finalHtml = '';
            if (type === 'progress') {
                finalHtml = `<div class="ch-status-icon-container"><div class="card-helper-spinner"></div></div><span class="card-helper-status-text">${message}</span>`;
            } else if (type === 'completion' || type === 'temporary') {
                const iconChar = isSuccess ?
                    '✔' : '✖';
                const iconColor = isSuccess ? '#76c779' : '#e57373';
                finalHtml = `<div class="ch-status-icon-container"><span style="color: ${iconColor}; font-size: 18px; line-height: 1;">${iconChar}</span></div><span class="card-helper-status-text">${message}</span>`;
            } else {
                finalHtml = `<span class="card-helper-status-text">${message}</span>`;
            }
            notificationElement.innerHTML = finalHtml;
            requestAnimationFrame(() => notificationElement.classList.add('show'));
            if (this.currentNotification.timeoutId) {
                clearTimeout(this.currentNotification.timeoutId);
                this.currentNotification.timeoutId = null;
            }
            if (!sticky && (type === 'completion' || type === 'temporary')) {
                this.currentNotification.timeoutId = setTimeout(() => this.hideCurrentNotification(id), duration);
            }
        },
        updateNotificationProgress: function(id, messagePrefix) {
            if (this.currentNotification.id === id && this.currentNotification.type === 'progress') {
                const textElement = this.currentNotification.element.querySelector('.card-helper-status-text');
                if (textElement && textElement.textContent !== messagePrefix) textElement.textContent = messagePrefix;
            } else {
                this.displayNotification(id, messagePrefix, 'progress', {
                    sticky: true
                });
            }
        },
        completeProgressNotification: function(id, message, isSuccess = true, duration = 3500) {
            if (message === 'Карта успешно улучшена!') {
                isSuccess = true;
            }
            this.displayNotification(id, message, 'completion', {
                isSuccess,
                duration
            });
        },
        showTemporaryMessage: function(id, message, isSuccess = true, duration = 3500) {
            this.displayNotification(id, message, 'temporary', {
                isSuccess,
                duration
            });
        },
        hideCurrentNotification: function(idToHide) {
            if (this.currentNotification.element && this.currentNotification.id === idToHide) {
                const element = this.currentNotification.element;
                element.classList.remove('show');
                if (this.currentNotification.timeoutId) {
                    clearTimeout(this.currentNotification.timeoutId);
                    this.currentNotification.timeoutId = null;
                }
                setTimeout(() => {
                    if (element.parentNode) element.remove();
                    if (this.currentNotification.element === element) {
                        this.currentNotification.element = null;


                        this.currentNotification.id = null;
                        this.currentNotification.type = null;
                    }
                }, 400);
            }
        },
        clearWorkerState: function() {
            GM_deleteValue('upgrade.isActive');
            GM_deleteValue('upgrade.step');
            GM_deleteValue('upgrade.username');
            GM_deleteValue('upgrade.animeTitle');
            GM_deleteValue('upgrade.rank');
            GM_deleteValue('upgrade.characterName');
            GM_deleteValue('upgrade.imageUrl');
            GM_deleteValue('upgrade.totalCardCount');
            GM_deleteValue('upgrade.progressUrl');
            GM_deleteValue('upgrade.returnUrl');
            GM_deleteValue('upgrade.wasFixed');
            GM_deleteValue('upgrade.status');
        },
        // ###############################################################
        // ############# НАЧАЛО ИСПРАВЛЕННОЙ ЛОГИКИ ДЛЯ МОБАЙЛ #############
        // ###############################################################
        runWorker: async function() {
            if (!GM_getValue('upgrade.isActive', false)) return;
            waitForElement('body', async () => {
                const step = GM_getValue('upgrade.step');
                const path = window.location.pathname;
                console.log(`[Upgrade Worker] Active. Step: ${step}, Path: ${path}`);

                try {

                    // Step 1: На странице прогресса, найти нужное аниме
                    if (step === 'searchForAnime' && path.includes('/cards_progress')) {
                        console.log('[Upgrade Worker] Step 1: Searching for anime...');
                        const searchInput = await this._waitForElement(document, 'input.form__field[placeholder="Название аниме..."]');
                        searchInput.value = GM_getValue('upgrade.animeTitle');
                        GM_setValue('upgrade.step', 'handleFix');
                        document.querySelector('.progress__search-btn').click();
                    }


                    // Step 2 & 7: Обработка фиксации (и снятие, и возврат)
                    else if (step === 'handleFix' && path.includes('/cards_progress')) {
                        const wasFixed = GM_getValue('upgrade.wasFixed', false);
                        const expectedState = wasFixed ? '0' : '1'; // Целевое состояние для возврата фиксации
                        const action = wasFixed ?
                            're-fixing' : 'unfixing';
                        console.log(`[Upgrade Worker] Step 2/7: Handling collection ${action}.`);

                        const animeLink = await this._waitForAnimeTitle(document, GM_getValue('upgrade.animeTitle'));
                        const userAnimeContainer = animeLink.closest('.user-anime');
                        if (!userAnimeContainer) throw new Error(`Не найден контейнер коллекции аниме для ${action}.`);

                        const fixButton = await this._waitForElement(userAnimeContainer, '.fix-my-progress');
                        const currentState = fixButton.getAttribute('data-fixed');

                        // Если состояние уже правильное (для возврата фиксации), завершаем
                        if (wasFixed && currentState === expectedState) {
                            console.log('[Upgrade Worker] Re-fix is already complete.');
                            GM_setValue('upgrade.status', 'SUCCESS');
                            this.clearWorkerState();
                            window.close();
                            return;
                        }

                        // Если состояние НЕ правильное (требуется действие)
                        if (currentState !== expectedState) {
                            return new Promise((resolve, reject) => {
                                const observer = new MutationObserver(() => {
                                    if (fixButton.getAttribute('data-fixed') === expectedState) {
                                        console.log(`[Upgrade Worker] Attribute changed to '${expectedState}'. ${action} successful.`);
                                        observer.disconnect();
                                        clearTimeout(timeoutId);
                                        // Определяем следующий шаг
                                        if (!wasFixed) { // Если это было снятие фиксации
                                            GM_setValue('upgrade.wasFixed', true); // Отмечаем, что мы сняли фиксацию
                                            GM_setValue('upgrade.step', 'navigateToUpgradePage');
                                            window.location.href = `${CURRENT_ORIGIN}/update_stars/`;
                                        } else { // Если это был возврат фиксации
                                            GM_setValue('upgrade.status', 'SUCCESS');
                                            this.clearWorkerState();
                                            window.close();
                                        }
                                        resolve();
                                    }
                                });
                                const timeoutId = setTimeout(() => {
                                    observer.disconnect();
                                    reject(new Error(`Таймаут ожидания изменения атрибута для ${action}.`));
                                }, 10000);
                                observer.observe(fixButton, {
                                    attributes: true
                                });

                                console.log(`[Upgrade Worker] Dispatching click to perform ${action}.`);
                                fixButton.dispatchEvent(new MouseEvent('click', {
                                    bubbles: true,
                                    cancelable: true,
                                    view: window
                                }));
                                this._waitForElement(document, '.dle-popup-confirm').then(dialog => {
                                    const confirmBtn = Array.from(dialog.querySelectorAll('.ui-dialog-buttonset button')).find(btn => btn.textContent.trim() === 'Подтвердить');
                                    if (confirmBtn) confirmBtn.dispatchEvent(new MouseEvent('click', {
                                        bubbles: true,
                                        cancelable: true,
                                        view: window
                                    }));
                                });
                            });
                        } else {
                            // Состояние уже правильное, можно идти дальше (актуально для снятия фиксации)
                            console.log(`[Upgrade Worker] Collection is already in the desired state for ${action}. Proceeding.`);
                            if (!wasFixed) {
                                GM_setValue('upgrade.wasFixed', true);
                                GM_setValue('upgrade.step', 'navigateToUpgradePage');
                                window.location.href = `${CURRENT_ORIGIN}/update_stars/`;
                            }
                        }
                    }

                    // Step 3: На странице улучшения, выбрать ранг карты
                    else if (step
                        === 'navigateToUpgradePage' && path.includes('/update_stars')) {
                        console.log('[Upgrade Worker] Step 3: Selecting rank on upgrade page.');
                        const rank = GM_getValue('upgrade.rank');
                        const rankButton = await this._waitForElement(document, `.tabs__item.tabs__navigate__rank[data-rank="${rank}"]`);
                        if (!rankButton.classList.contains('tabs__item--active')) {
                            GM_setValue('upgrade.step', 'searchForCharacter');
                            rankButton.click();
                        } else {
                            GM_setValue('upgrade.step', 'searchForCharacter');
                            window.location.reload();
                        }
                    }

                    // Step 4: После выбора ранга, найти персонажа
                    else if (step === 'searchForCharacter' && path.includes('/update_stars')) {
                        console.log('[Upgrade Worker] Step 4: Searching for character.');
                        const searchInput = await this._waitForElement(document, 'input.form__field[placeholder="Имя персонажа..."]');
                        searchInput.value = GM_getValue('upgrade.characterName');
                        GM_setValue('upgrade.step', 'findCardInList');
                        document.querySelector('.card-stars-form__search-btn').click();
                    }

                    // Step 5: В результатах поиска найти нужную карту и улучшить
                    else if (step === 'findCardInList' && path.includes('/update_stars')) {
                        console.log('[Upgrade Worker] Step 5: Finding card in search results.');
                        const imageUrl = GM_getValue('upgrade.imageUrl');
                        const urlParts = imageUrl.split('/');
                        const uniqueImageFilename = urlParts[urlParts.length - 1];
                        if (!uniqueImageFilename) throw new Error('Не удалось извлечь имя файла из URL.');

                        const cardSelector = `.card-stars-list__items .card-stars-list__card img[src$="${uniqueImageFilename}"]`;
                        let cardImg = document.querySelector(cardSelector);

                        if (cardImg) {
                            console.log('[Upgrade Worker] Card found. Checking upgrade cost.');
                            cardImg.parentElement.click();

                            const infoDiv = await this._waitForTextInElement(document, '.card-level-up__info', 'потребуется', 10000);
                            const requiredMatch = infoDiv.textContent.match(/потребуется (\d+) дублей карт/);
                            if (!requiredMatch) throw new Error('Не удалось определить стоимость улучшения.');

                            const requiredCount = parseInt(requiredMatch[1], 10);
                            const actualDuplicates = GM_getValue('upgrade.totalCardCount', 0) - 1;
                            if (actualDuplicates < requiredCount) {
                                const needed = requiredCount - actualDuplicates;
                                throw new Error(`Не хватает дублей. Нужно еще ${needed} шт.`);
                            }

                            console.log('[Upgrade Worker] Enough duplicates. Starting upgrade.');
                            const startBtn = await this._waitForElement(document, '.card-level-up__start-btn');
                            startBtn.click();

                            const pushMessage = await this._waitForElement(document, '.DLEPush-message', 15000);
                            if (!pushMessage.textContent.toLowerCase().includes('успешно')) {
                                throw new Error(pushMessage.textContent);
                            }

                            console.log('[Upgrade Worker] Upgrade successful.');
                            if (GM_getValue('upgrade.wasFixed', false)) {
                                GM_setValue('upgrade.step', 'handleFix');
                                // Возвращаемся к универсальному обработчику фиксации
                                window.location.href = GM_getValue('upgrade.progressUrl');
                            } else {
                                GM_setValue('upgrade.status', 'SUCCESS');
                                this.clearWorkerState();
                                window.close();
                            }
                        } else {
                            console.log('[Upgrade Worker] Card not found on this page. Checking for pagination.');
                            const nextPageLink = document.querySelector('.pagination__pages-btn a');
                            if (nextPageLink) {
                                window.location.href = nextPageLink.href;
                            } else {
                                throw new Error('Карта для улучшения не найдена на страницах поиска.');
                            }
                        }
                    }

                } catch (e) {
                    console.error(`[Upgrade Worker] Ошибка на шаге ${step}:`, e);
                    GM_setValue('upgrade.status', e.message || 'Неизвестная ошибка');
                    this.clearWorkerState();
                    if (window.opener) window.close();
                }
            });
        }
        // #############################################################
        // ############# КОНЕЦ ИСПРАВЛЕННОЙ ЛОГИКИ ДЛЯ МОБАЙЛ #############
        // #############################################################
    };
    const TradePreviewHelper = {
        PREVIEW_STORAGE_KEY: 'as_trade_preview_size',
        initialize: function() {
            this.addPreviewStyles();
            this.createSizeSlider();
            this.initTradePreview();
            const observer = new MutationObserver(() => {
                this.initTradePreview();
                if (!document.getElementById('size-control-container')) {
                    this.createSizeSlider();
                }
            });
            const targetNode = document.querySelector('body');
            if (targetNode) {
                observer.observe(targetNode, {
                    childList: true,
                    subtree: true
                });
            }
        },
        addPreviewStyles: function() {
            GM_addStyle(`
                #size-control-container { display: flex; justify-content: center; align-items: center; gap: 10px; margin-bottom: 10px; padding: 0; background-color: transparent; color: #ccc; font-size: 14px; }
                #trade-preview-popup { position: absolute; background-color: #282828; border: 1px solid #4a4a4a; z-index: 99999; display: flex; align-items: center; pointer-events: none;

padding: var(--popup-padding, 10px); border-radius: var(--card-border-radius, 6px); gap: var(--popup-gap, 12px); visibility: hidden; }
                .trade-preview-section { display: flex; flex-wrap: nowrap; gap: var(--section-gap, 8px); flex-shrink: 0; }
                #trade-preview-popup img { height: var(--card-height, 110px); border-radius: var(--card-border-radius, 6px); background-color: #1a1a1a; }
                .trade-separator { color: #888; font-weight: bold; font-size: var(--separator-font-size, 24px);
flex-shrink: 0; }
                #trade-preview-popup .loading-text { color: #ccc;
font-size: 14px; visibility: visible; }
                #size-control-container input[type="range"] { -webkit-appearance: none;
appearance: none; width: 120px; height: 5px; background: #444; border-radius: 5px; outline: none;
}
                #size-control-container input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none;
appearance: none; width: 15px; height: 15px; background: #e53935; cursor: pointer; border-radius: 50%;
}
                #size-control-container input[type="range"]::-moz-range-thumb { width: 15px;
height: 15px; background: #e53935; cursor: pointer; border-radius: 50%; }
            `);
        },
        updateDynamicStyles: function(baseHeight) {
            const height = Number(baseHeight);
            const rootStyle = document.documentElement.style;
            rootStyle.setProperty('--card-height', `${height}px`);
            rootStyle.setProperty('--card-border-radius', `${Math.round(height * 0.06)}px`);
            rootStyle.setProperty('--popup-padding', `${Math.round(height * 0.1)}px`);
            rootStyle.setProperty('--popup-gap', `${Math.round(height * 0.12)}px`);
            rootStyle.setProperty('--section-gap', `${Math.round(height * 0.08)}px`);
            rootStyle.setProperty('--separator-font-size', `${Math.round(height * 0.22)}px`);
        },
        createSizeSlider: function() {
            const tradeContainer = document.querySelector('.trade');
            if (!tradeContainer || document.getElementById('size-control-container')) return;
            const controlContainer = document.createElement('div');
            controlContainer.id = 'size-control-container';
            const label = document.createElement('label');
            label.textContent = 'Размер превью:';
            label.htmlFor = 'size-slider';
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = 'size-slider';
            slider.min = '80';
            slider.max = '250';
            slider.step = '1';
            slider.value = GM_getValue(this.PREVIEW_STORAGE_KEY, 110);
            slider.addEventListener('input', () => {
                const newSize = slider.value;
                this.updateDynamicStyles(newSize);
                GM_setValue(this.PREVIEW_STORAGE_KEY, newSize);
            });
            controlContainer.appendChild(label);
            controlContainer.appendChild(slider);
            tradeContainer.parentNode.insertBefore(controlContainer, tradeContainer);
            slider.dispatchEvent(new Event('input', {
                bubbles: true
            }));
        },
        handleMouseEnter: function(e) {
            const tradeItem = e.currentTarget;
            const tradeUrl = tradeItem.href || tradeItem.querySelector('a')?.href;
            if (!tradeUrl) return;
            const cursorX = e.pageX;
            const cursorY = e.pageY;
            const popup = document.createElement('div');
            popup.id = 'trade-preview-popup';
            popup.innerHTML = '<span class="loading-text">Загрузка...</span>';
            document.body.appendChild(popup);
            popup.style.left = `${cursorX + 20}px`;
            popup.style.top = `${cursorY + 20}px`;
            popup.style.visibility = 'visible';
            GM_xmlhttpRequest({
                method: 'GET',
                url: tradeUrl,
                onload: (response) => {
                    const existingPopup = document.getElementById('trade-preview-popup');


                    if (!existingPopup) return;
                    const parser = new DOMParser();
                    const tradeDoc = parser.parseFromString(response.responseText, 'text/html');
                    const itemContainers = tradeDoc.querySelectorAll('.trade__main-items');
                    existingPopup.innerHTML = '';


                    if (itemContainers.length > 0) {
                        const offeredDiv = document.createElement('div');
                        offeredDiv.className = 'trade-preview-section';


                        const separatorSpan = document.createElement('span');
                        separatorSpan.className = 'trade-separator';
                        separatorSpan.textContent = '⇄';
                        const requestedDiv = document.createElement('div');
                        requestedDiv.className = 'trade-preview-section';
                        itemContainers[0].querySelectorAll('img').forEach(img => {
                            const i = document.createElement('img');
                            i.src = img.dataset.src || img.src;
                            offeredDiv.appendChild(i);


                        });
                        if (itemContainers.length > 1) {
                            itemContainers[1].querySelectorAll('img').forEach(img => {
                                const i = document.createElement('img');


                                i.src = img.dataset.src || img.src;
                                requestedDiv.appendChild(i);
                            });
                        }
                        if (offeredDiv.hasChildNodes()) existingPopup.appendChild(offeredDiv);
                        if (offeredDiv.hasChildNodes() && requestedDiv.hasChildNodes()) existingPopup.appendChild(separatorSpan);
                        if (requestedDiv.hasChildNodes()) existingPopup.appendChild(requestedDiv);
                        const popupWidth = existingPopup.offsetWidth;
                        const popupHeight = existingPopup.offsetHeight;
                        const viewportWidth = window.innerWidth;
                        const viewportHeight = window.innerHeight;
                        const margin = 20;
                        let newLeft = cursorX + margin;
                        let newTop = cursorY + margin;
                        if (newLeft + popupWidth > viewportWidth + window.scrollX) {
                            newLeft = cursorX - popupWidth - margin;
                        }
                        if (newLeft < window.scrollX) {
                            newLeft = window.scrollX + margin;
                        }
                        if (newTop + popupHeight > viewportHeight + window.scrollY) {
                            newTop = cursorY - popupHeight - margin;
                        }
                        if (newTop < window.scrollY) {
                            newTop = window.scrollY + margin;
                        }
                        existingPopup.style.left = `${newLeft}px`;
                        existingPopup.style.top = `${newTop}px`;
                        existingPopup.style.visibility = 'visible';
                    } else {
                        existingPopup.innerHTML = '<span class="loading-text">Не удалось найти карты</span>';
                    }
                },
                onerror: function() {
                    const existingPopup = document.getElementById('trade-preview-popup');
                    if (existingPopup) {
                        existingPopup.innerHTML = '<span class="loading-text">Ошибка сети</span>';
                    }
                }
            });
        },
        handleMouseLeave: function() {
            const popup = document.getElementById('trade-preview-popup');
            if (popup) {
                popup.remove();
            }
        },
        initTradePreview: function() {
            const tradeItems = document.querySelectorAll('.trade__list-item');
            tradeItems.forEach(item => {
                if (item.dataset.previewListenerAttached) return;
                item.dataset.previewListenerAttached = 'true';
                item.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
                item.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
            });
        }
    };


    // =================================================================================
    // SCRIPT ENTRY POINT & ROUTER
    // =================================================================================

    if (isIframe) {
        TradeHelper.runWorker();
    } else {
        waitForElement('body', () => {
            TradeHelper.runWorker();
            UpgradeHelper.runWorker();

            const path = window.location.pathname;
            createMainPanel();

            if (path.includes('/clubs/boost/')) {
                BoostHelper.initialize();

                NotificationHider.initialize();
                ClubInfoHelper.initialize();

            } else if (path.includes('/cards/') || path.includes('/user/cards')) {
                TradeHelper.initialize();
                ImageZoomHelper.initialize();
                UpgradeHelper.initialize();


                if (path.includes('/user/cards')) {
                    PackButtonHelper.initialize();

                }
            } else if (path.includes('/trades')) {
                TradePreviewHelper.initialize();
            }
        });
    }

})();