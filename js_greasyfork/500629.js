// ==UserScript==
// @name                HqPCB-MMImpedance
// @name:zh-CN          HqPCB-毫米计算阻抗
// @namespace           https://github.com/Mehver
// @version             1.1
// @description         华秋PCB阻抗计算页面本来只有mil，添加单位选择，可以切换到mm。
// @description:zh-CN   华秋PCB阻抗计算页面本来只有mil，添加单位选择，可以切换到mm。
// @author              https://github.com/Mehver
// @icon                data:image/png;base64,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
// @match               https://www.hqpcb.com/quote/impedance
// @license             MPL-2.0
// @license             Mozilla Public License 2.0
// @charset		        UTF-8
// @homepageURL         https://github.com/SynRGB/HqPCB-MMImpedance
// @contributionURL     https://github.com/SynRGB/HqPCB-MMImpedance
// @downloadURL https://update.greasyfork.org/scripts/500629/HqPCB-MMImpedance.user.js
// @updateURL https://update.greasyfork.org/scripts/500629/HqPCB-MMImpedance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 添加单位选择下拉菜单
     */
    function addUnitSelector() {
        let impedanceParams = document.querySelector("body > div.impedance > div > div.impedance__content > div.impedance__params > ul");
        let li = document.createElement("li");
        li.innerHTML = "<span>计算单位</span><span>&nbsp;<select id='unit-select' style='width: 100px;border: 7px solid #FFF;color: #777;'><option value='mil' style='color: #777;'>mil</option><option value='mm' style='color: #777;'>mm</option></select></span>";
        impedanceParams.appendChild(li);
    }

    /**
     * 更新表头文本
     */
    function updateTableHeaders() {
        const headers = [
            "body > div.impedance > div > div.impedance__content > div.impedance__params > div > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition.impedance__params__list.impedance-table > div.el-table__header-wrapper > table > thead > tr > th.el-table_1_column_7.is-leaf > div",
            "body > div.impedance > div > div.impedance__content > div.impedance__params > div > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition.impedance__params__list.impedance-table > div.el-table__header-wrapper > table > thead > tr > th.el-table_1_column_8.is-leaf > div",
            "body > div.impedance > div > div.impedance__content > div.impedance__params > div > div.el-table.el-table--fit.el-table--border.el-table--enable-row-hover.el-table--enable-row-transition.impedance__params__list.impedance-table > div.el-table__header-wrapper > table > thead > tr > th.el-table_1_column_9.is-leaf > div"
        ];

        const unit = document.getElementById('unit-select').value;

        headers.forEach(selector => {
            const header = document.querySelector(selector);
            if (header) {
                if (header.innerText.includes('（mil）')) {
                    header.innerText = header.innerText.replace('（mil）', ` (mil)`);
                } else if (header.innerText.includes('（mm）')) {
                    header.innerText = header.innerText.replace('（mm）', ` (mm)`);
                }
                if (header.innerText.includes('(mil)')) {
                    header.innerText = header.innerText.replace('(mil)', ` (${unit})`);
                } else if (header.innerText.includes('(mm)')) {
                    header.innerText = header.innerText.replace('(mm)', ` (${unit})`);
                }
            }
        });
    }

    /**
     * 根据单位选择进行转换
     */
    function resultConverter() {
        const unit = document.getElementById('unit-select').value;
        const listItems = document.querySelectorAll('div.impedance__list__item');

        listItems.forEach(item => {
            const rows = item.querySelectorAll('.el-table__row');
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                if (unit === 'mm') {
                    [4, 5, 6].forEach(tdIndex => {
                        if (tds[tdIndex]) {
                            const div = tds[tdIndex].querySelector('div');
                            if (div && div.innerText && div.innerText !== '/' && !isNaN(parseFloat(div.innerText))) {
                                const value = parseFloat(div.innerText);
                                div.innerText = (value * 0.0254).toFixed(3);
                            }
                        }
                    });
                    [9, 10, 11].forEach(tdIndex => {
                        if (tds[tdIndex]) {
                            const div = tds[tdIndex].querySelector('div > div');
                            if (div && div.innerText && div.innerText !== '/' && !isNaN(parseFloat(div.innerText))) {
                                const value = parseFloat(div.innerText);
                                div.innerText = (value * 0.0254).toFixed(3);
                            }
                        }
                    });
                } else {
                    [4, 5, 6].forEach(tdIndex => {
                        if (tds[tdIndex]) {
                            const div = tds[tdIndex].querySelector('div');
                            if (div && div.innerText && div.innerText !== '/' && !isNaN(parseFloat(div.innerText))) {
                                const value = parseFloat(div.innerText);
                                div.innerText = (value).toFixed(3);
                            }
                        }
                    });
                    [9, 10, 11].forEach(tdIndex => {
                        if (tds[tdIndex]) {
                            const div = tds[tdIndex].querySelector('div > div');
                            if (div && div.innerText && div.innerText !== '/' && !isNaN(parseFloat(div.innerText))) {
                                const value = parseFloat(div.innerText);
                                div.innerText = (value).toFixed(3);
                            }
                        }
                    });
                }
            });

            // 处理表头部分，添加单位
            const firstThs = item.querySelectorAll('th');
            [4, 5, 6, 11].forEach(thIndex => {
                if (firstThs[thIndex]) {
                    const div = firstThs[thIndex].querySelector('div');
                    if (div && !div.innerText.includes('(')) { // 防止重复添加
                        div.innerText = div.innerText + `\n(${unit})`;
                    } else if (div) {
                        div.innerText = div.innerText.replace(/\((mil|mm)\)/, `(${unit})`);
                    }
                }
            });
            [9, 10].forEach(thIndex => {
                if (firstThs[thIndex]) {
                    const div = firstThs[thIndex].querySelector('div');
                    if (div && !div.innerText.includes('(')) { // 防止重复添加
                        div.innerText = div.innerText + ` (${unit})`;
                    } else if (div) {
                        div.innerText = div.innerText.replace(/\((mil|mm)\)/, `(${unit})`);
                    }
                }
            });
            if (firstThs[12]) {
                const div = firstThs[12].querySelector('div');
                if (div && !div.innerText.includes('(')) { // 防止重复添加
                    div.innerText = div.innerText + `\n(ohm)`;
                }
            }
        });

        // 更新表头单位
        updateTableHeaders();
    }

    /**
     * 某些情况下原始值是mm，需要转换为mil
     */
    function resultReverseConverter() {
        const listItems = document.querySelectorAll('div.impedance__list__item');
        listItems.forEach(item => {
            const rows = item.querySelectorAll('.el-table__row');
            rows.forEach(row => {
                const tds = row.querySelectorAll('td');
                [4, 5, 6].forEach(tdIndex => {
                    if (tds[tdIndex]) {
                        const div = tds[tdIndex].querySelector('div');
                        if (div && div.innerText && div.innerText !== '/' && !isNaN(parseFloat(div.innerText))) {
                            const value = parseFloat(div.innerText);
                            div.innerText = (value / 0.0254).toFixed(3);
                        }
                    }
                });
                [9, 10, 11].forEach(tdIndex => {
                    if (tds[tdIndex]) {
                        const div = tds[tdIndex].querySelector('div > div');
                        if (div && div.innerText && div.innerText !== '/' && !isNaN(parseFloat(div.innerText))) {
                            const value = parseFloat(div.innerText);
                            div.innerText = (value / 0.0254).toFixed(3);
                        }
                    }
                });
            });
        });
    }

    /**
     * 模拟用户输入事件
     * @param {HTMLElement} element 目标输入框
     * @param {string} value 输入的值
     */
    function simulateInput(element, value) {
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
    }

    /**
     * 创建并返回自定义输入框
     * @param {HTMLElement} originalInput 原输入框
     * @returns {HTMLElement} 自定义输入框
     */
    function createCustomInput(originalInput) {
        const customInputWrapper = document.createElement('div');
        customInputWrapper.style.display = 'inline-block';
        customInputWrapper.style.paddingLeft = '5px'; // 左边添加空格

        const customInput = document.createElement('input');
        customInput.type = 'text';
        customInput.className = 'custom-input';
        customInput.style = originalInput.style.cssText + 'border: none; background: none;';
        customInput.placeholder = '请输入';
        customInput.value = originalInput.value;
        originalInput.style.display = 'none';

        customInput.addEventListener('blur', () => {
            const unit = document.getElementById('unit-select').value;
            let value = parseFloat(customInput.value);
            if (!isNaN(value)) {
                const milValue = unit === 'mm' ? (value / 0.0254).toFixed(3) : value.toFixed(3);
                simulateInput(originalInput, milValue);
            }
        });

        customInput.addEventListener('input', () => {
            const unit = document.getElementById('unit-select').value;
            let value = parseFloat(customInput.value);
            if (!isNaN(value)) {
                const milValue = unit === 'mm' ? (value / 0.0254).toFixed(3) : value.toFixed(3);
                originalInput.value = milValue;
            }
        });

        // 监听单位选择变化，更新输入框的值
        document.getElementById('unit-select').addEventListener('change', () => {
            const unit = document.getElementById('unit-select').value;
            let value = parseFloat(originalInput.value);

            if (!isNaN(value)) {
                const displayValue = unit === 'mm' ? (value * 0.0254).toFixed(3) : value.toFixed(3);
                customInput.value = displayValue;
            }
        });

        customInputWrapper.appendChild(customInput);
        originalInput.parentElement.appendChild(customInputWrapper);
        return customInput;
    }

    /**
     * 替换原输入框为自定义输入框并处理单位转换
     */
    function replaceInputs() {
        const rows = document.querySelectorAll('.el-table__row');
        rows.forEach(row => {
            const tds = row.querySelectorAll('td');
            for (let i = 5; i < tds.length; i++) {
                const input = tds[i].querySelector('.el-input-number.el-input-number--mini.is-without-controls input');
                if (input && !input.parentElement.querySelector('.custom-input')) {
                    createCustomInput(input);
                }
            }
        });
    }

    /**
     * 监控特定元素的变化并动态替换输入框
     */
    function monitorChanges() {
        const target = document.querySelector("body > div.impedance > div > div.impedance__content > div.impedance__params");
        if (target) {
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length || mutation.removedNodes.length) {
                        replaceInputs();
                    }
                });
            });

            observer.observe(target, { childList: true, subtree: true });
        }
    }

    /**
     * 初始化脚本
     */
    function init() {
        addUnitSelector();
        replaceInputs();
        monitorChanges();

        // 监听单位选择变化，重新匹配
        document.getElementById('unit-select').addEventListener('change', () => {
            resultConverter(); // 重新转换所有值
            if (document.getElementById('unit-select').value === 'mil') {
                resultReverseConverter();
            }
        });

        // 监听按钮点击事件，重新匹配
        const button = document.querySelector("body > div.impedance > div > div.impedance__content > div.impedance__params > div > div.impedance__params__btns > div > button.el-button.el-button--primary.el-button--mini");
        if (button) {
            button.addEventListener('click', function () {
                setTimeout(() => {
                    resultConverter();
                    replaceInputs();
                }, 1500);
            });
        }
    }

    // 初始化脚本
    init();
})();

console.log("Userscript HqPCB-MMImpedance (HqPCB-毫米计算阻抗) loaded. See more details at https://github.com/SynRGB/HqPCB-MMImpedance");
