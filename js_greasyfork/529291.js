// ==UserScript==
// @name         柠檬云进销存输入框自动计算箱盒转换
// @namespace    https://jxc.ningmengyun.com/zhuanhuan
// @version      2.2
// @description  自动将备注栏或其他自定义列中输入格式如“26=”或“26+”转换为“1箱2盒”（需设置商品规格格式为：200ml×24盒，脚本会捕获“×24盒”来计算），支持动态规格解析和Vue数据绑定
// @author       偶然好看
// @license MIT
// @match        https://jxc.ningmengyun.com/*
// @match        https://jxcpro.ningmengyun.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529291/%E6%9F%A0%E6%AA%AC%E4%BA%91%E8%BF%9B%E9%94%80%E5%AD%98%E8%BE%93%E5%85%A5%E6%A1%86%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E7%AE%B1%E7%9B%92%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/529291/%E6%9F%A0%E6%AA%AC%E4%BA%91%E8%BF%9B%E9%94%80%E5%AD%98%E8%BE%93%E5%85%A5%E6%A1%86%E8%87%AA%E5%8A%A8%E8%AE%A1%E7%AE%97%E7%AE%B1%E7%9B%92%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const CONFIG = {
        inputSelector: '.el-input__inner',
        pattern: /^(\d+)[=+]$/,                // 新输入格式正则
        errorTimeout: 2000,
        specPattern: /×\s*(\d{2,3})\s*([\u4e00-\u9fa5]+)/  // 规格解析正则
    };

    // 提取规格信息函数
    function extractSpecInfo(input) {
        try {
            // 查找最近的表格行
            const tr = input.closest('tr');
            if (!tr) throw new Error('未找到商品行');

            // 使用XPath查找包含规格的单元格
            const xpath = './/td[contains(., "×")]';
            const result = document.evaluate(xpath, tr, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const specTd = result.singleNodeValue;

            if (!specTd) throw new Error('未找到规格信息');

            // 解析规格信息
            const match = specTd.textContent.match(CONFIG.specPattern);
            if (!match) throw new Error('规格格式错误');

            return {
                denominator: parseInt(match[1], 10),
                unit: match[2].trim()
            };
        } catch (error) {
            console.warn('规格解析失败:', error.message);
            return null;
        }
    }

    // 输入处理函数
    function handleInputConversion(event) {
        const input = event.target;
        const value = input.value.trim();

        if (CONFIG.pattern.test(value)) {
            // 获取规格信息
            const spec = extractSpecInfo(input) || {};
            if (!spec.denominator) {
                showTemporaryError(input, '规格信息缺失');
                return;
            }

            const numerator = parseInt(value.match(CONFIG.pattern)[1], 10);
            const total = numerator / spec.denominator;

            // 异常处理
            if (spec.denominator === 0) {
                showTemporaryError(input, '规格数量不能为0');
                return;
            }
            if (total < 0.01) {
                showTemporaryError(input, '输入数值过小');
                return;
            }

            // 计算结果
            const cases = Math.floor(total);
            const boxes = Math.round((total - cases) * spec.denominator);

            // 格式化输出
            const result = `${cases}箱${boxes}${spec.unit}`;
            updateVueInput(input, result);
        }
    }


    // 显示临时错误提示
    function showTemporaryError(input, message) {
        const originalValue = input.value;
        input.value = message;
        setTimeout(() => {
            input.value = originalValue.replace(/=$/, '');
            input.focus();
        }, CONFIG.errorTimeout);
    }

    // Vue兼容性更新（触发数据绑定）
    function updateVueInput(input, newValue) {
        input.value = newValue;
        const vueInputEvent = new Event('input', {
            bubbles: true,
            cancelable: true
        });
        input.dispatchEvent(vueInputEvent);
    }


    // 初始化逻辑增加规格数据绑定
    const observer = new MutationObserver(mutations => {
        mutations.forEach(() => {
            document.querySelectorAll(CONFIG.inputSelector).forEach(input => {
                if (!input.dataset.autoConvertAdded) {
                    // 预绑定规格信息
                    const spec = extractSpecInfo(input);
                    if (spec) {
                        input.dataset.denominator = spec.denominator;
                        input.dataset.unit = spec.unit;
                    }

                    input.addEventListener('input', handleInputConversion);
                    input.dataset.autoConvertAdded = 'true';
                }
            });
        });
    });

    // 启动监听
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });

    // 初始绑定（处理页面加载时已存在的元素）
    document.querySelectorAll(CONFIG.inputSelector).forEach(input => {
        input.addEventListener('input', handleInputConversion);
        input.dataset.autoConvertAdded = 'true';
    });
})();