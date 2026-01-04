// ==UserScript==
// @name         Auto check "Non-Corrupted" for path of exile1 trade site 流放之路交易网站自动选择未腐化
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  自动选择未腐化,Auto uncheck "Corrupted", path of exile, 流放之路，支持Clear按钮后重新选择
// @author       Znm
// @match        https://www.pathofexile.com/trade
// @match        https://www.pathofexile.com/trade/search/*
// @exclude      https://www.pathofexile.com/trade/search/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539703/Auto%20check%20%22Non-Corrupted%22%20for%20path%20of%20exile1%20trade%20site%20%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF%E4%BA%A4%E6%98%93%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%AA%E8%85%90%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539703/Auto%20check%20%22Non-Corrupted%22%20for%20path%20of%20exile1%20trade%20site%20%E6%B5%81%E6%94%BE%E4%B9%8B%E8%B7%AF%E4%BA%A4%E6%98%93%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%9C%AA%E8%85%90%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        setTimeout(function() {
            selectCorruptedDropdownOption();
            addClearButtonListener();
        }, 1500);
    });

    // 选择Corrupted下拉列表中的"No"选项
    function selectCorruptedDropdownOption() {
        const filterTitles = document.querySelectorAll('div.filter-title');
        const targetFilterTitle = Array.from(filterTitles).find(title =>
            title.innerText.trim() === 'Corrupted'
        );

        if (!targetFilterTitle) {
            return;
        }

        const filterBody = targetFilterTitle.closest('.filter-body');
        if (!filterBody) {
            return;
        }

        const dropdownContainer = filterBody.querySelector('div.multiselect.filter-select');
        if (!dropdownContainer) {
            return;
        }

        const multiselectInput = dropdownContainer.querySelector('input.multiselect__input[placeholder="Any"]');
        if (!multiselectInput) {
            return;
        }

        multiselectInput.click();

        setTimeout(function() {
            const targetOptionText = 'No';
            const optionsList = dropdownContainer.querySelector('ul.multiselect__content');
            if (!optionsList) {
                return;
            }

            const options = optionsList.querySelectorAll('li.multiselect__element span.multiselect__option');
            const foundOption = Array.from(options).find(option =>
                option.innerText.trim() === targetOptionText
            );

            if (foundOption) {
                foundOption.click();
            }
        }, 500);
    }

    // 添加Clear按钮监听器
    function addClearButtonListener(retryCount = 0) {
        const clearButton = document.querySelector('button.btn.clear-btn');

        if (clearButton) {
            clearButton.addEventListener('click', function() {
                setTimeout(function() {
                    selectCorruptedDropdownOption();
                }, 1000);
            });
        } else if (retryCount < 3) {
            setTimeout(function() {
                addClearButtonListener(retryCount + 1);
            }, 2000);
        } else {
            console.error('未找到Clear按钮，已停止尝试');
        }
    }
})();