// ==UserScript==
// @name         RiverHelper
// @namespace    https://example.com
// @version      1.6
// @description  使用事件委派，讓 Location 功能在不同子頁都穩定運作；Insert按鈕只在初始頁面出現，外觀與Save相同但顏色較淡。
// @match        https://app.us2.chromeriver.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528108/RiverHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/528108/RiverHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 工具函式：以 XPath 查找第一個符合的節點
     */
    function findElementByXPath(xpath) {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        return result.singleNodeValue;
    }

    /**
     * 幫可點擊的 label 加上 hover 效果（滑鼠移入/移出）
     * （選用：若你要移除 hover 效果，可刪除這整段）
     */
    function addHoverStyle(label) {
        if (label.dataset.hoverStyleAdded) return;
        label.dataset.hoverStyleAdded = '1';

        label.style.cursor = 'pointer';
        label.addEventListener('mouseover', () => {
            label.style.textDecoration = 'underline';
        });
        label.addEventListener('mouseout', () => {
            label.style.textDecoration = '';
        });
    }

    /**
     * （1）在 Cancel / Save 間插入 Insert 按鈕 (改為淺藍色)：
     *     僅在同一容器中同時存在 #cancelBtn 與 #saveBtn，且 URL hash 包含 #expense/new/details 時才插入。
     */
    function tryInsertButton() {
        // 僅在初始資訊頁面才插入
        if (!window.location.hash.includes("#expense/new/details")) {
            return;
        }

        const containers = document.querySelectorAll('div.pull-right');
        for (const container of containers) {
            const cancelBtn = container.querySelector('#cancelBtn');
            const saveBtn   = container.querySelector('#saveBtn');
            if (cancelBtn && saveBtn) {
                // 如果已經存在 insertBtn，就不重複插入
                if (document.getElementById('insertBtn')) {
                    break;
                }
                const insertBtn = document.createElement('li');
                insertBtn.id = 'insertBtn';
                insertBtn.textContent = 'Insert';
                insertBtn.setAttribute('role', 'button');
                insertBtn.setAttribute('tabindex', '0');
                insertBtn.setAttribute('title', 'Insert');
                // 這裡套用與 Save 相同的造型，只是顏色較淡
                insertBtn.setAttribute('style', `
                    -webkit-text-size-adjust: 100%;
                    -webkit-tap-highlight-color: transparent;
                    font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                    list-style: none;
                    box-sizing: border-box;
                    border: 1px solid #5cb8ff;
                    padding: 10px 22px;
                    font-weight: 400!important;
                    line-height: 1em!important;
                    text-align: center;
                    vertical-align: middle;
                    background-image: none!important;
                    text-shadow: none!important;
                    height: 36px!important;
                    width: auto;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    border-radius: 2px!important;
                    box-shadow: none;
                    appearance: none;
                    user-select: none;
                    cursor: pointer;
                    float: left;
                    margin: 7px 5px;
                    outline: 0;
                    font-size: 13px;
                    max-width: 150px;
                    min-width: 52px;
                    display: inline-block;
                    background-color: #5cb8ff;
                    color: #fff;
                `);

                container.insertBefore(insertBtn, saveBtn);

                insertBtn.addEventListener('click', async () => {
                    const today = new Date();
                    const yyyy = String(today.getFullYear());
                    const mm   = String(today.getMonth() + 1).padStart(2, '0');
                    const dd   = String(today.getDate()).padStart(2, '0');
                    const dateStr = yyyy + mm + dd;

                    const reportNameInput = document.querySelector('#name');
                    if (reportNameInput) {
                        reportNameInput.value = 'Training Support ' + dateStr;
                        reportNameInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    const reportTypeInput = document.querySelector('#ReportType');
                    if (reportTypeInput) {
                        reportTypeInput.focus();
                        reportTypeInput.dispatchEvent(new Event('focus', { bubbles: true }));
                        reportTypeInput.value = 'Travel & Entertainment';
                        reportTypeInput.dispatchEvent(new Event('input', { bubbles: true }));
                        await new Promise(r => setTimeout(r, 300));
                        // 模擬按下 Enter
                        reportTypeInput.dispatchEvent(new KeyboardEvent('keydown', {
                            key: 'Enter', code: 'Enter', which: 13, keyCode: 13,
                            bubbles: true, cancelable: true
                        }));
                        reportTypeInput.dispatchEvent(new KeyboardEvent('keyup', {
                            key: 'Enter', code: 'Enter', which: 13, keyCode: 13,
                            bubbles: true, cancelable: true
                        }));
                        reportTypeInput.blur();
                        reportTypeInput.dispatchEvent(new Event('blur', { bubbles: true }));
                    }
                    console.log('[Tampermonkey] Insert 按鈕被點擊，已自動填入。');
                });

                console.log('[Tampermonkey] Insert 按鈕已插入');
                break;
            }
        }
    }

    /**
     * （2）當 #amountSpentFormLabel 出現後，監聽其他 label 的點擊事件
     */
    function checkSpentLabelAndAttachListeners() {
        const spentLabel = document.querySelector('#amountSpentFormLabel');
        if (!spentLabel) return;

        // 2.1 Business Purpose label：點擊後填入 "Training Support"
        const bpLabel = document.querySelector('#businessPurposeFormLabel');
        if (bpLabel && !bpLabel.dataset.bindClick) {
            bpLabel.dataset.bindClick = '1';
            addHoverStyle(bpLabel);
            bpLabel.addEventListener('click', () => {
                const bpInput = document.querySelector('#businessPurpose');
                if (bpInput) {
                    bpInput.value = 'Training Support';
                    bpInput.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        }

        // 2.2 Expense Type label：點擊後輸入值並模擬 Enter
        const expenseTypeLabel = findElementByXPath('//*[@id="right-region"]/div/article/div/div/form/section[5]/div/div/span[31]/div/label');
        if (expenseTypeLabel && !expenseTypeLabel.dataset.bindClick) {
            expenseTypeLabel.dataset.bindClick = '1';
            addHoverStyle(expenseTypeLabel);
            expenseTypeLabel.addEventListener('click', async () => {
                const mealTypeInput = document.querySelector('#MealType');
                if (!mealTypeInput) return;
                mealTypeInput.focus();
                mealTypeInput.dispatchEvent(new Event('focus', { bubbles: true }));
                mealTypeInput.value = 'Individual Travel Meal (TW)';
                mealTypeInput.dispatchEvent(new Event('input', { bubbles: true }));
                await new Promise(r => setTimeout(r, 300));
                // 模擬按下 Enter
                mealTypeInput.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter', code: 'Enter', which: 13, keyCode: 13,
                    bubbles: true, cancelable: true
                }));
                mealTypeInput.dispatchEvent(new KeyboardEvent('keyup', {
                    key: 'Enter', code: 'Enter', which: 13, keyCode: 13,
                    bubbles: true, cancelable: true
                }));
                mealTypeInput.blur();
                mealTypeInput.dispatchEvent(new Event('blur', { bubbles: true }));
            });
        }

        // 2.3 Type label：點擊後循環切換 Breakfast / Lunch / Dinner
        const typeLabel = findElementByXPath('//*[@id="right-region"]/div/article/div/div/form/section[5]/div/div/span[32]/div/label');
        if (typeLabel && !typeLabel.dataset.bindClick) {
            typeLabel.dataset.bindClick = '1';
            addHoverStyle(typeLabel);
            typeLabel.addEventListener('click', () => {
                const mealTypeBLD = document.querySelector('#MealTypeBLD');
                if (!mealTypeBLD) return;
                const cycle = ['Breakfast', 'Lunch', 'Dinner'];
                let current = mealTypeBLD.getAttribute('data-cycle-index');
                if (current === null) {
                    mealTypeBLD.setAttribute('data-cycle-index', 0);
                    mealTypeBLD.value = 'Breakfast';
                } else {
                    let idx = parseInt(current, 10);
                    idx = (idx + 1) % cycle.length;
                    mealTypeBLD.setAttribute('data-cycle-index', idx);
                    mealTypeBLD.value = cycle[idx];
                }
                mealTypeBLD.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }

    /* === Location 相關代碼：使用「事件委派」解決子頁失效問題 === */

    // 4個城市輪詢清單
    const cityCycle = [
        'Taipei, TAIWAN',
        'New Taipei City, TAIWAN',
        'Taichung, TAIWAN',
        'Kaohsiung, TAIWAN'
    ];

    let isLocationTyping = false;

    /**
     * 優化版逐字輸入，避免首字母消失
     */
    async function simulateTypingOptimized(inputElem, text, delayChar = 30) {
        inputElem.focus();
        inputElem.dispatchEvent(new Event('focus', { bubbles: true }));
        // 等待片刻以確保上次輸入完成
        await new Promise(r => setTimeout(r, 50));
        inputElem.value = '';
        // 確保光標位於文字尾端
        inputElem.setSelectionRange(text.length, text.length);

        for (const char of text) {
            inputElem.dispatchEvent(new KeyboardEvent('keydown', {
                key: char, code: char,
                which: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                bubbles: true, cancelable: true
            }));
            inputElem.value += char;
            inputElem.dispatchEvent(new Event('input', { bubbles: true }));
            inputElem.dispatchEvent(new KeyboardEvent('keyup', {
                key: char, code: char,
                which: char.charCodeAt(0),
                keyCode: char.charCodeAt(0),
                bubbles: true, cancelable: true
            }));
            await new Promise(r => setTimeout(r, delayChar));
        }
    }

    /**
     * 模擬按下 Enter 鍵
     */
    function pressEnter(inputElem) {
        inputElem.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter', code: 'Enter', which: 13, keyCode: 13,
            bubbles: true, cancelable: true
        }));
        inputElem.dispatchEvent(new KeyboardEvent('keyup', {
            key: 'Enter', code: 'Enter', which: 13, keyCode: 13,
            bubbles: true, cancelable: true
        }));
    }

    /**
     * 在 document 上監聽 click 事件，只要點到 label[for="MerchantLocationCity"] 就自動輪入城市
     */
    function setupLocationEventDelegation() {
        // 這裡也可以做一次性綁定，避免重複加
        if (document.body.dataset.locationDelegateBound === '1') {
            return;
        }
        document.body.dataset.locationDelegateBound = '1';

        // 幫 label[for="MerchantLocationCity"] 顯示指標 (hover 效果可選)
        document.addEventListener('mouseover', e => {
            const label = e.target.closest('label[for="MerchantLocationCity"]');
            if (label) {
                addHoverStyle(label);
            }
        });

        // 監聽 click
        document.addEventListener('click', async e => {
            // 判斷使用者點擊的是不是我們想要的 label
            const label = e.target.closest('label[for="MerchantLocationCity"]');
            if (!label) return; // 點擊的不是 label

            // 如果正在輸入中，避免重複
            if (isLocationTyping) {
                console.log('[Tampermonkey] 正在輸入中，忽略本次點擊');
                return;
            }
            isLocationTyping = true;
            console.log('[Tampermonkey] Location label 被點擊');

            // 透過 for 屬性找到對應的 input
            const locationInput = document.getElementById('MerchantLocationCity');
            if (!locationInput) {
                console.log('[Tampermonkey] 找不到 #MerchantLocationCity 輸入框');
                isLocationTyping = false;
                return;
            }

            // 取得目前輪到第幾個城市
            let currentIndex = locationInput.getAttribute('data-loc-index');
            if (currentIndex === null) {
                currentIndex = 0;
            } else {
                currentIndex = parseInt(currentIndex, 10);
                currentIndex = (currentIndex + 1) % cityCycle.length;
            }
            locationInput.setAttribute('data-loc-index', currentIndex);

            const cityName = cityCycle[currentIndex];

            // 1) 逐字輸入城市名稱
            await simulateTypingOptimized(locationInput, cityName, 30);

            // 2) 透過 aria-owns 找到 comboBox 的下拉清單
            const listBoxId = locationInput.getAttribute('aria-owns');
            let foundSingleItem = false;

            if (listBoxId) {
                // 輪詢檢查該下拉清單是否只剩1個選項
                for (let i = 0; i < 10; i++) {
                    const comboList = document.getElementById(listBoxId);
                    if (comboList) {
                        const items = comboList.querySelectorAll('li[data-qa="comboBoxListItem"]');
                        if (items.length === 1) {
                            pressEnter(locationInput);
                            foundSingleItem = true;
                            console.log('[Tampermonkey] comboBox 中只剩1個選項，按下Enter');
                            break;
                        }
                    }
                    await new Promise(r => setTimeout(r, 300));
                }
            } else {
                console.log('[Tampermonkey] aria-owns 不存在，無法自動偵測下拉清單');
            }

            if (!foundSingleItem) {
                console.log(`[Tampermonkey] 未在期限內等到只剩1個選項: ${cityName}`);
            }

            // 3) blur 輸入框
            locationInput.blur();
            locationInput.dispatchEvent(new Event('blur', { bubbles: true }));

            isLocationTyping = false;
        });
    }

    // ---- 監聽 DOM 變化，並執行上述功能 ----
    const observer = new MutationObserver(() => {
        tryInsertButton();
        checkSpentLabelAndAttachListeners();
        setupLocationEventDelegation();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 頁面載入後先嘗試一次各項功能
    tryInsertButton();
    checkSpentLabelAndAttachListeners();
    setupLocationEventDelegation();

})();
