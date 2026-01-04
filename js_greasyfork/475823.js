// ==UserScript==
// @name               合歡山自動訂房
// @name:zh-TW         合歡山自動訂房
// @name:en            Auto Select Value for HeHuanLine
// @namespace          http://tampermonkey.net/
// @version            0.1
// @description        自動選擇房型，並送出訂單
// @description:zh-TW  自動選擇房型，並送出訂單
// @description:en     Automate form selection for room booking on HeHuanLine
// @author             YC白白
// @match              https://hehuanline.forest.gov.tw/room/index.php
// @icon               https://www.google.com/s2/favicons?sz=64&domain=gov.tw
// @grant              none
// @license            All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/475823/%E5%90%88%E6%AD%A1%E5%B1%B1%E8%87%AA%E5%8B%95%E8%A8%82%E6%88%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/475823/%E5%90%88%E6%AD%A1%E5%B1%B1%E8%87%AA%E5%8B%95%E8%A8%82%E6%88%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========自訂==========
    // "松雪樓房型不能超過2間"，超過會跳前面這句的通知
    const selectValues = {
        'num[90]': '0',  // 四人套房/間
        'num[134]': '2', // 景觀雙人套房/間
        'num[212]': '0', // 滑雪山莊/人
        'num[170]': '0'  // 精緻雙人套房/間
    };

    // 1.補上"訂房數選項"(四人套房、景觀雙人套房、滑雪山莊、滑雪山莊)
    function addOptions(selectElement, max) {
        const existingOption = selectElement.querySelector('option[value="1"]');
        if (!existingOption) {
            for (let i = 1; i <= max; i++) {
                const optionElement = document.createElement('option');
                optionElement.textContent = i.toString();
                optionElement.value = i.toString();
                selectElement.appendChild(optionElement);
            }
        }
    }

    // 指定要檢查的 <select> 元素的 name 屬性值以及要添加的選項數量
    const optionsToAdd = {
        'num[90]': 2,
        'num[134]': 2,
        'num[212]': 10,
        'num[170]': 2
    };

    for (const name in optionsToAdd) {
        const selectElement = document.querySelector(`select[name="${name}"]`);
        if (selectElement) {
            addOptions(selectElement, optionsToAdd[name]);
        }
    }

    // 2.分別選擇"訂房數"
    function setSelectValue(name, value) {
        const selectElement = document.querySelector(`select[name="${name}"]`);
        if (selectElement) {
            try {
                selectElement.value = value;
                const event = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(event);
            } catch (error) {
                console.error(`Error setting value for ${name}: `, error);
            }
        }
    }

    for (const name in selectValues) {
        setSelectValue(name, selectValues[name]);
    }

    // 3.點擊"確認數量"
    const confirmButton = document.getElementById('button_roomsubmit');
    if (confirmButton) {
        confirmButton.click();
    }

    // 4.點"銀行匯款" 並 "送出訂單"
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                const radioBtn = document.querySelector('input#payment_24[type="radio"]');
                if (radioBtn) {
                    console.log('有找到"銀行匯款"!');
                    radioBtn.click();

                    const submitButton = document.querySelector('button.update_button.button.button-3d.button-mini.button-rounded.button-red');
                    if (submitButton) {
                        console.log('有找到"送出訂單"按鈕!');
                        submitButton.click();
                    } else {
                        console.log('未找到"送出訂單"按鈕!');
                    }

                    observer.disconnect();
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
