// ==UserScript==
// @name         Upgrades fromの素材のMarketplaceに直接飛ぶボタン
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Adds buttons to open the crafting screen and Marketplace of the upgrade item in Milky Way Idle
// @author       Osyaburiman
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535652/Upgrades%20from%E3%81%AE%E7%B4%A0%E6%9D%90%E3%81%AEMarketplace%E3%81%AB%E7%9B%B4%E6%8E%A5%E9%A3%9B%E3%81%B6%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/535652/Upgrades%20from%E3%81%AE%E7%B4%A0%E6%9D%90%E3%81%AEMarketplace%E3%81%AB%E7%9B%B4%E6%8E%A5%E9%A3%9B%E3%81%B6%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Milky Way Idle Script: Initialized');

    // 遅延設定（ミリ秒）
    const DELAYS = {
        INITIAL_CHECK: 2000, // ページロード後の初回ボタン追加チェック
        MARKET_PANEL: 100,   // マーケットパネル表示後の検索ボックス入力
        FALLBACK: 100,       // フォールバック時のタブ選択後のアイテム検索
        SEARCH_POLL: 50,    // 検索結果ポーリングの間隔
        SEARCH_MAX: 8,       // 検索ポーリングの最大試行回数
        CLEAR_SEARCH: 50     // 検索ボックスクリアの遅延（取引画面オープン後）
    };

    // アイテムとタブのマッピング（フォールバック用）
    const itemTabMap = {
        'Cedar Bow': 'Equipment',
        'Birch Bow': 'Equipment',
        'Cheese Brush': 'Tools',
        'Verdant Hammer': 'Tools',
        'Milking Tea': 'Consumables',
        'Foraging Tea': 'Consumables',
        // 他のアイテムは必要に応じて追加
    };

    // MutationObserverで動的コンテンツを監視
    const observer = new MutationObserver((mutations, obs) => {
        obs.disconnect();
        try {
            const detailContainer = document.querySelector('.SkillActionDetail_skillActionDetail__1jHU4');
            if (detailContainer) {
                console.log('Milky Way Idle Script: Detected SkillActionDetail, attempting to add/update buttons');
                addOrUpdateUpgradeButtons(detailContainer);
            }
        } catch (error) {
            console.error('Milky Way Idle Script: Error in MutationObserver callback', error);
        }
        obs.observe(document.body, { childList: true, subtree: true });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // ページロード後の初回チェック
    setTimeout(() => {
        try {
            const detailContainer = document.querySelector('.SkillActionDetail_skillActionDetail__1jHU4');
            if (detailContainer) {
                console.log('Milky Way Idle Script: Initial check, attempting to add/update buttons');
                addOrUpdateUpgradeButtons(detailContainer);
            }
        } catch (error) {
            console.error('Milky Way Idle Script: Error in initial check', error);
        }
    }, DELAYS.INITIAL_CHECK);

    function addOrUpdateUpgradeButtons(container) {
        try {
            // 既存のボタンコンテナを削除
            const existingButtonContainer = container.querySelector('#upgradeButtonContainer');
            if (existingButtonContainer) {
                existingButtonContainer.remove();
                console.log('Milky Way Idle Script: Removed existing button container');
            }

            // 「Upgrades From」ラベルを検索
            const labels = container.querySelectorAll('.SkillActionDetail_label__1mGQJ');
            console.log(`Milky Way Idle Script: Found ${labels.length} labels, searching for 'Upgrades From'`);
            let upgradesLabel = null;
            for (const label of labels) {
                if (label.textContent.includes('Upgrades') && label.textContent.includes('From')) {
                    upgradesLabel = label;
                    break;
                }
            }

            if (!upgradesLabel) {
                console.log('Milky Way Idle Script: "Upgrades From" label not found');
                return;
            }
            console.log('Milky Way Idle Script: Found "Upgrades From" label');

            // 素材アイテムのコンテナを取得
            const upgradeItemContainer = container.querySelector('.ItemSelector_itemContainer__3olqe .Item_item__2De2O');
            if (!upgradeItemContainer) {
                console.log('Milky Way Idle Script: Upgrade item container not found');
                return;
            }

            // 素材アイテムの名前を取得
            const itemIcon = upgradeItemContainer.querySelector('svg[aria-label]');
            if (!itemIcon) {
                console.log('Milky Way Idle Script: Item icon with aria-label not found');
                return;
            }
            const itemName = itemIcon.getAttribute('aria-label');
            if (!itemName) {
                console.log('Milky Way Idle Script: Item name not found in aria-label');
                return;
            }
            console.log(`Milky Way Idle Script: Detected upgrade item: ${itemName}`);

            // ボタンコンテナを作成
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'upgradeButtonContainer';
            buttonContainer.style.display = 'flex';
            buttonContainer.style.flexDirection = 'column';
            buttonContainer.style.gap = '4px';
            buttonContainer.style.marginTop = '4px';

            // クラフトボタンを作成
            const craftingButton = document.createElement('button');
            craftingButton.id = 'upgradeItemButton';
            craftingButton.textContent = `Open ${itemName} Crafting`;
            craftingButton.style.padding = '4px 8px';
            craftingButton.style.backgroundColor = '#4CAF50';
            craftingButton.style.color = 'white';
            craftingButton.style.border = 'none';
            craftingButton.style.borderRadius = '4px';
            craftingButton.style.cursor = 'pointer';
            craftingButton.style.display = 'block';
            craftingButton.style.position = 'relative';
            craftingButton.style.zIndex = '1000';

            craftingButton.addEventListener('click', () => {
                console.log(`Milky Way Idle Script: Crafting button clicked for ${itemName}`);
                try {
                    const itemElements = document.querySelectorAll('.SkillAction_skillAction__1esCp');
                    for (const elem of itemElements) {
                        const nameElem = elem.querySelector('.SkillAction_name__2VPXa');
                        if (nameElem && nameElem.textContent === itemName) {
                            console.log(`Milky Way Idle Script: Found matching item element for ${itemName}, clicking`);
                            elem.click();
                            break;
                        }
                    }
                } catch (error) {
                    console.error(`Milky Way Idle Script: Error clicking crafting item ${itemName}`, error);
                }
            });

            // マーケットボタンを作成
            const marketButton = document.createElement('button');
            marketButton.id = 'marketItemButton';
            marketButton.textContent = `Open ${itemName} Market`;
            marketButton.style.padding = '4px 8px';
            marketButton.style.backgroundColor = '#2196F3';
            marketButton.style.color = 'white';
            marketButton.style.border = 'none';
            marketButton.style.borderRadius = '4px';
            marketButton.style.cursor = 'pointer';
            marketButton.style.display = 'block';
            marketButton.style.position = 'relative';
            marketButton.style.zIndex = '1000';

            marketButton.addEventListener('click', () => {
                console.log(`Milky Way Idle Script: Market button clicked for ${itemName}`);
                try {
                    // 作成画面を閉じる
                    const skillPanelContainer = document.querySelector('.MainPanel_subPanelContainer__1i-H9:has(.GatheringProductionSkillPanel_gatheringProductionSkillPanel__vG4M7)');
                    if (skillPanelContainer) {
                        skillPanelContainer.remove();
                        console.log('Milky Way Idle Script: Removed skill panel container to close crafting screen');
                    } else {
                        console.warn('Milky Way Idle Script: Skill panel container not found');
                    }

                    // ナビゲーションバーのMarketplaceリンクを選択
                    const marketplaceLink = Array.from(document.querySelectorAll('.NavigationBar_navigationLink__3eAHA')).find(link => {
                        const label = link.querySelector('span.NavigationBar_label__1uH-y');
                        return label && label.textContent === 'Marketplace';
                    });
                    if (marketplaceLink && !marketplaceLink.classList.contains('NavigationBar_active__3R-QS')) {
                        marketplaceLink.click();
                        console.log(`Milky Way Idle Script: Clicked Marketplace link for ${itemName}`);
                    } else if (marketplaceLink) {
                        console.log(`Milky Way Idle Script: Marketplace link already active for ${itemName}`);
                    } else {
                        console.warn('Milky Way Idle Script: Marketplace link not found');
                    }

                    // マーケットパネルを表示（遅延を適用）
                    setTimeout(() => {
                        const marketPanelContainer = document.querySelector('.MainPanel_subPanelContainer__1i-H9.MainPanel_hidden__3auSh');
                        if (marketPanelContainer) {
                            marketPanelContainer.classList.remove('MainPanel_hidden__3auSh');
                            console.log('Milky Way Idle Script: Removed MainPanel_hidden__3auSh to show market panel');
                        } else {
                            console.warn('Milky Way Idle Script: Market panel container not found');
                        }

                        // 検索ボックスにアイテム名を入力
                        const searchInput = document.querySelector('.MarketplacePanel_itemFilterContainer__3F3td .Input_input__2-t98');
                        if (searchInput) {
                            // React向け入力シミュレーション
                            const setInputValue = (input, value) => {
                                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                const inputEvent = new Event('input', { bubbles: true });
                                nativeInputValueSetter.call(input, value);
                                input.dispatchEvent(inputEvent);
                                const pasteEvent = new Event('paste', { bubbles: true });
                                input.dispatchEvent(pasteEvent);
                            };

                            const searchValue = itemName; // スペースあり、svg[aria-label]と一致
                            console.log(`Milky Way Idle Script: Set search input to: ${searchValue}`);
                            setInputValue(searchInput, searchValue);
                            console.log('Milky Way Idle Script: Dispatched input/paste events');

                            // 検索結果を待つ
                            const waitForSearchResults = (callback, maxAttempts = DELAYS.SEARCH_MAX, interval = DELAYS.SEARCH_POLL) => {
                                let attempts = 0;
                                const check = setInterval(() => {
                                    const marketElements = document.querySelectorAll('.MarketplacePanel_itemSelection__3jDb- .MarketplacePanel_marketItems__D4k7e .Item_itemContainer__x7kH1 .Item_item__2De2O.Item_clickable__3viV6');
                                    console.log(`Milky Way Idle Script: Found ${marketElements.length} search results for ${itemName}`);
                                    console.log('Search results:', Array.from(marketElements).map(e => e.querySelector('svg[aria-label]')?.getAttribute('aria-label')));
                                    if (marketElements.length > 0 || attempts >= maxAttempts) {
                                        clearInterval(check);
                                        callback(marketElements);
                                    }
                                    attempts++;
                                }, interval);
                            };

                            waitForSearchResults((marketElements) => {
                                try {
                                    let found = false;
                                    for (const elem of marketElements) {
                                        const iconElem = elem.querySelector('svg[aria-label]');
                                        if (iconElem && iconElem.getAttribute('aria-label') === itemName) {
                                            console.log(`Milky Way Idle Script: Found matching market element for ${itemName}, clicking`);
                                            elem.click();
                                            found = true;

                                            // 検索ボックスをクリア（取引画面オープン後）
                                            setTimeout(() => {
                                                if (searchInput) {
                                                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                                    const inputEvent = new Event('input', { bubbles: true });
                                                    nativeInputValueSetter.call(searchInput, '');
                                                    searchInput.dispatchEvent(inputEvent);
                                                    searchInput.dispatchEvent(new Event('paste', { bubbles: true }));
                                                    console.log('Milky Way Idle Script: Cleared search input');
                                                } else {
                                                    console.warn('Milky Way Idle Script: Search input not found for clearing');
                                                }
                                            }, DELAYS.CLEAR_SEARCH);

                                            break;
                                        }
                                    }
                                    if (!found) {
                                        console.warn(`Milky Way Idle Script: No matching market element found for ${itemName}`);
                                        // フォールバック: タブ選択を試す
                                        console.log(`Milky Way Idle Script: Attempting fallback to tab selection for ${itemName}`);
                                        const tabName = itemTabMap[itemName] || 'Equipment';
                                        const tab = Array.from(document.querySelectorAll('.MuiTab-root')).find(tab => {
                                            const label = tab.querySelector('span.MuiBadge-root');
                                            return label && label.textContent.includes(tabName);
                                        });
                                        if (tab && tab.getAttribute('aria-selected') !== 'true') {
                                            tab.click();
                                            console.log(`Milky Way Idle Script: Clicked ${tabName} tab for ${itemName}`);
                                            setTimeout(() => {
                                                const tabMarketElements = document.querySelectorAll('.TabPanel_tabPanel__tXMJF .MarketplacePanel_marketItems__D4k7e .Item_itemContainer__x7kH1 .Item_item__2De2O.Item_clickable__3viV6');
                                                for (const elem of tabMarketElements) {
                                                    const iconElem = elem.querySelector('svg[aria-label]');
                                                    if (iconElem && iconElem.getAttribute('aria-label') === itemName) {
                                                        console.log(`Milky Way Idle Script: Found matching market element in ${tabName} tab for ${itemName}, clicking`);
                                                        elem.click();
                                                        found = true;

                                                        // 検索ボックスをクリア（フォールバック時）
                                                        setTimeout(() => {
                                                            if (searchInput) {
                                                                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                                                const inputEvent = new Event('input', { bubbles: true });
                                                                nativeInputValueSetter.call(searchInput, '');
                                                                searchInput.dispatchEvent(inputEvent);
                                                                searchInput.dispatchEvent(new Event('paste', { bubbles: true }));
                                                                console.log('Milky Way Idle Script: Cleared search input (fallback)');
                                                            } else {
                                                                console.warn('Milky Way Idle Script: Search input not found for clearing (fallback)');
                                                            }
                                                        }, DELAYS.CLEAR_SEARCH);

                                                        break;
                                                    }
                                                }
                                                if (!found) {
                                                    console.warn(`Milky Way Idle Script: No matching market element found in ${tabName} tab for ${itemName}`);
                                                }
                                            }, DELAYS.FALLBACK);
                                        } else if (tab) {
                                            console.log(`Milky Way Idle Script: ${tabName} tab already selected for ${itemName}`);
                                        } else {
                                            console.warn(`Milky Way Idle Script: ${tabName} tab not found for ${itemName}`);
                                        }
                                    }
                                } catch (error) {
                                    console.error(`Milky Way Idle Script: Error searching market elements for ${itemName}`, error);
                                }
                            });
                        } else {
                            console.warn('Milky Way Idle Script: Search input not found');
                            // フォールバック
                            const tabName = itemTabMap[itemName] || 'Equipment';
                            const tab = Array.from(document.querySelectorAll('.MuiTab-root')).find(tab => {
                                const label = tab.querySelector('span.MuiBadge-root');
                                return label && label.textContent.includes(tabName);
                            });
                            if (tab && tab.getAttribute('aria-selected') !== 'true') {
                                tab.click();
                                console.log(`Milky Way Idle Script: Clicked ${tabName} tab for ${itemName}`);
                                setTimeout(() => {
                                    const tabMarketElements = document.querySelectorAll('.TabPanel_tabPanel__tXMJF .MarketplacePanel_marketItems__D4k7e .Item_itemContainer__x7kH1 .Item_item__2De2O.Item_clickable__3viV6');
                                    for (const elem of tabMarketElements) {
                                        const iconElem = elem.querySelector('svg[aria-label]');
                                        if (iconElem && iconElem.getAttribute('aria-label') === itemName) {
                                            console.log(`Milky Way Idle Script: Found matching market element in ${tabName} tab for ${itemName}, clicking`);
                                            elem.click();

                                            // 検索ボックスをクリア（フォールバック時）
                                            setTimeout(() => {
                                                const searchInput = document.querySelector('.MarketplacePanel_itemFilterContainer__3F3td .Input_input__2-t98');
                                                if (searchInput) {
                                                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                                                    const inputEvent = new Event('input', { bubbles: true });
                                                    nativeInputValueSetter.call(searchInput, '');
                                                    searchInput.dispatchEvent(inputEvent);
                                                    searchInput.dispatchEvent(new Event('paste', { bubbles: true }));
                                                    console.log('Milky Way Idle Script: Cleared search input (fallback)');
                                                } else {
                                                    console.warn('Milky Way Idle Script: Search input not found for clearing (fallback)');
                                                }
                                            }, DELAYS.CLEAR_SEARCH);

                                            break;
                                        }
                                    }
                                    console.warn(`Milky Way Idle Script: No matching market element found in ${tabName} tab for ${itemName}`);
                                }, DELAYS.FALLBACK);
                            }
                        }
                    }, DELAYS.MARKET_PANEL); // マーケットパネル表示の遅延
                } catch (error) {
                    console.error(`Milky Way Idle Script: Error clicking market item ${itemName}`, error);
                }
            });

            // ボタンをコンテナに追加
            buttonContainer.appendChild(craftingButton);
            buttonContainer.appendChild(marketButton);

            // ボタンコンテナを「Upgrades From」の下に追加
            const valueContainer = upgradesLabel.nextElementSibling;
            if (valueContainer) {
                valueContainer.appendChild(buttonContainer);
                console.log(`Milky Way Idle Script: Buttons added for ${itemName} (Crafting and Market)`);
            } else {
                console.log('Milky Way Idle Script: Value container not found, buttons not added');
            }
        } catch (error) {
            console.error('Milky Way Idle Script: Error in addOrUpdateUpgradeButtons', error);
        }
    }
})();