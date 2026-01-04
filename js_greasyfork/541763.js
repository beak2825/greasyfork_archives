// ==UserScript==
// @name         Hellcase Auto Free Giveaway
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Also check my profile for Honeygain Auto Collect Daily bouns,and welocme to use my ref link: https://r.honeygain.me/TIGER75692
// @author       Your Name
// @match        https://hellcase.com/giveaways/*
// @match        https://hellcase.com/giveaways
// @grant        none
// @run-at       document-end
// @license      Tiger
// @downloadURL https://update.greasyfork.org/scripts/541763/Hellcase%20Auto%20Free%20Giveaway.user.js
// @updateURL https://update.greasyfork.org/scripts/541763/Hellcase%20Auto%20Free%20Giveaway.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const refreshInterval = 7200000; // 設置自動刷新間隔（2 * 60 * 60 * 1000毫秒 = 2 小時）

    let filterButtonClicked = false;
    let typeClicked = false;
    let freeGiveawayChecked = false;
    let applyButtonClicked = false;
    let joinNowClicked = false;
    let joinForFreeBClicked = false;
    // 檢查並點擊過濾按鈕的函數
    function checkAndClickFilterButton() {
        const buttons = document.querySelectorAll('button'); // 獲取所有按鈕
        if (typeClicked){
            filterButtonClicked = true;
            return
        }
        buttons.forEach(button => {
            if (button.textContent.trim().toLowerCase() === 'filter' &&
                button.classList.contains('items-filter-button__button')) {
                button.click();
                filterButtonClicked = true; // 設置為已點擊
                console.log('Clicked the filter button using text content.');
            }
        });

        if (!filterButtonClicked) {
            console.warn('Filter button not found, checking again...');
        }
}

    function clickTypeElement() {
        const allDivs = document.querySelectorAll('div');
        const allButtons = document.querySelectorAll('button');
        let typeFound = false;

        // 檢查所有 div 元素
        allDivs.forEach(div => {
            if (div.textContent.trim() === 'Type') {
                div.click();
                typeFound = true;
                typeClicked = true; // 設置為已點擊
                console.log('Clicked the Type element in div using text content.');
            }
        });

        // 檢查所有 button 元素
        allButtons.forEach(button => {
            if (button.textContent.trim() === 'Type') {
                button.click();
                typeFound = true;
                typeClicked = true; // 設置為已點擊
                console.log('Clicked the Type element in button using text content.');
            }
        });

        if (!typeFound) {
            console.warn('Type element not found in div or button using text content.');
        }
    }

    // 檢查並點擊 "Free Giveaway" 的復選框
    function checkAndClickFreeGiveawayCheckbox() {
        // 查找所有符合條件的 label 元素
        document.querySelectorAll('label.core-checkbox').forEach(label => {
            const textDiv = label.querySelector('div._text_eu9p4_25');

            // 檢查是否有符合條件的文本
            if (textDiv && textDiv.textContent.trim() === 'Free Giveaway') {
                const checkbox = label.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.click();
                    freeGiveawayChecked = true; // 設置為已選中
                    console.log('Clicked the Free Giveaway checkbox using attribute.');
                } else {
                    console.warn('Checkbox input not found for Free Giveaway.');
                }
            }
        });

        if (!freeGiveawayChecked) {
            console.warn('Free Giveaway checkbox not found using attribute.');
        }
    }

    // 點擊 Apply 按鈕
    function clickApplyButton() {
        const buttons = document.querySelectorAll('button.core-button--preset--giveaway-orange');
        buttons.forEach(button => {
            if (button.textContent.trim() === 'Apply' && !button.classList.contains('core-button--disabled')) {
                button.click(); // 點擊按鈕
                applyButtonClicked = true; // 設置為已點擊
                console.log('Clicked the Apply button.');
            }
        });

        if (!applyButtonClicked) {
            console.warn('Apply button not found or disabled, checking again...');
        }
    }

    // 點擊 Join now 按鈕
    function clickJoinNowButton() {
        const card = document.querySelector('.giveaway-card.giveaway-card-active.is-free'); // 查找第一個符合條件的元素
        if (card) {
            const joinNowElements = card.querySelectorAll('*'); // 查找該卡片下的所有子元素
            let joinNowElement = null;

            joinNowElements.forEach(element => {
                if (element.textContent.includes("Join now")) {
                    joinNowElement = element; // 找到包含 "Join now" 的元素
                }
            });

            if (joinNowElement) {
                console.log('Found "Join now" button:', joinNowElement);
                joinNowElement.click(); // 直接點擊該元素
                console.log('Clicked the Join now button.');
                joinNowClicked = true; // 設置為已點擊
            }
        } else {
            console.log('No active free giveaway cards found.');
        }
    }

    function checkAndClickJoinButton() {
        const joinButton = document.querySelector('button.req-bar__button');
        if (joinButton && !joinButton.disabled) {
            joinButton.click();
            joinForFreeBClicked = true;
            console.log('Clicked the Join for free button.');
            // 等待一分鐘後跳轉
            setTimeout(() => {
                window.location.href = 'https://hellcase.com/giveaways';
            }, 60000); // 60000 毫秒 = 1 分鐘
        } else {
            console.warn('Join for free button not found or is disabled. Checking again...');
            setTimeout(checkAndClickJoinButton, 5000); // 每 5 秒檢查一次
        }
    }
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('zh-HK', { timeZone: 'Asia/Hong_Kong', hour12: true });
    }
    // 主函數
    async function main() {
        console.log('Work starts at', getCurrentTime());

        setInterval(() => {
            location.reload();
        }, refreshInterval);

        // 持續檢查過濾按鈕和復選框
        const intervalId = setInterval(() => {
            if (!filterButtonClicked || !typeClicked) {
                clickTypeElement();
                checkAndClickFilterButton(); // 點擊 fliter 按鈕
            } else if (!typeClicked) {
                clickTypeElement(); // 點擊 Type 元素
            } else if (!freeGiveawayChecked) {
                checkAndClickFreeGiveawayCheckbox(); // 檢查復選框
            } else if (!applyButtonClicked) {
                clickApplyButton(); // 點擊 Apply 按鈕
            } else if (!joinNowClicked) {
                // 確保在 DOM 加載後運行函數
               clickJoinNowButton();// 點擊 Join now 按鈕
            } else if (!joinForFreeBClicked) {
                checkAndClickJoinButton(); // 點擊 Join now 按鈕
                if (joinForFreeBClicked){
                    setTimeout(7200000);
                }
            } else {
                clearInterval(intervalId); // 如果所有操作都已完成，停止檢查
                console.log('All actions completed.');

                // 返回指定的 URL
                window.location.href = 'https://hellcase.com/giveaways';
            }
        }, 1000); // 每 5 秒檢查一次
    }

    // 啟動主函數
    main();
})();