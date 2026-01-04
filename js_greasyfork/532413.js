// ==UserScript==
// @name         订单差价一键核算(YPYS)
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  一键计算克差、差价、复称差金额，如果未显示功能模块需开启查询池功能
// @author       wx：RakuRai
// @match        *://dopre.jushuitan.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532413/%E8%AE%A2%E5%8D%95%E5%B7%AE%E4%BB%B7%E4%B8%80%E9%94%AE%E6%A0%B8%E7%AE%97%28YPYS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532413/%E8%AE%A2%E5%8D%95%E5%B7%AE%E4%BB%B7%E4%B8%80%E9%94%AE%E6%A0%B8%E7%AE%97%28YPYS%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ***************************
     * 1. 创建自定义提示框组件
     *************************** */
    const createToast = () => {
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            zIndex: 999999,
            opacity: 0,
            transition: 'opacity 0.3s',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            whiteSpace: 'pre-wrap',
            maxWidth: '80vw',
            textAlign: 'center'
        });
        document.body.appendChild(toast);
        return toast;
    };

    let toastElement = null;
    const showToast = (message) => {
        if (!toastElement) toastElement = createToast();

        toastElement.style.opacity = 0;
        toastElement.textContent = message;

        setTimeout(() => {
            toastElement.style.opacity = 1;
        }, 10);

        setTimeout(() => {
            toastElement.style.opacity = 0;
        }, 2000);
    };

    /* ***************************
     * 2. 数据处理核心函数（修复DOM引用）
     *************************** */
    function processWeightData() {
        return Array.from(document.querySelectorAll('._jt_cell._jt_ch._jt_cell_weight')).map(container => {
            const getOrderWeightElement = () => container.querySelector('div:first-child:not([name])');
            const getRealWeightElement = () => container.querySelector('div[name="realweight"]');

            const formatDisplayText = (element) => {
                if (!element) return '未知';
                let text = element.textContent.trim();
                return text.endsWith('g') ? text : text.replace(/(\d+\.?\d*)/g, '$1g');
            };

            return {
                orderWeight: parseFloat(getOrderWeightElement()?.textContent.match(/\d+\.?\d*/)?.[0]) || 0,
                realWeight: parseFloat(getRealWeightElement()?.textContent.match(/\d+\.?\d*/)?.[0]) || 0,
                originalText: `下单克重${formatDisplayText(getOrderWeightElement())}，订单实称重量${formatDisplayText(getRealWeightElement())}`
            };
        });
    }

    /* ***************************
     * 3. 主处理逻辑（修复输入问题）
     *************************** */
    window.addEventListener('load', function() {
        const rightContainer = document.querySelector('.right');
        if (!rightContainer) return;

        // 创建复称输入框
        const weightInput = Object.assign(document.createElement('input'), {
            type: 'text',
            placeholder: '复称克重',
            style: {
                marginLeft: '10px',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                width: '20px',
                boxSizing: 'border-box',
                fontSize: '14px',
                transition: 'border-color 0.3s'
            }
        });

        // 创建处理按钮
        const processBtn = Object.assign(document.createElement('button'), {
            textContent: '处理当前差价',
            style: {
                marginLeft: '10px',
                padding: '8px 16px',
                backgroundColor: '#79FF79',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s'
            }
        });

        // 输入框回车事件处理（核心修复部分）
        weightInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const inputValue = parseFloat(weightInput.value.trim());
                if (isNaN(inputValue)) {
                    showToast('请输入有效数字');
                    weightInput.style.borderColor = '#ff5252';
                    setTimeout(() => weightInput.style.borderColor = '#ccc', 2000);
                } else {
                    const formattedValue = `${inputValue}g`;

                    // 直接实时查询DOM元素（不再依赖缓存数组）
                    document.querySelectorAll('div[name="realweight"]').forEach(el => {
                        el.textContent = formattedValue;
                        // 添加视觉反馈
                        el.style.transition = 'background-color 0.3s';
                        el.style.backgroundColor = '#ffffcc';
                        setTimeout(() => el.style.backgroundColor = '', 500);
                    });

                    weightInput.value = ''; // 清空输入框
                    processBtn.click(); // 触发计算
                }
            }
        });

        // 按钮交互效果
        processBtn.addEventListener('mouseenter', () => {
            processBtn.style.backgroundColor = '#ff5252';
            processBtn.style.transform = 'scale(1.05)';
        });
        processBtn.addEventListener('mouseleave', () => {
            processBtn.style.backgroundColor = '#79FF79';
            processBtn.style.transform = 'scale(1)';
        });

        // 核心处理逻辑
        processBtn.addEventListener('click', () => {
            try {
                const expressNumbers = processExpressData();
                const weightData = processWeightData(); // 重新获取最新DOM数据
                const amountData = processAmountData();

                const filteredData = weightData
                    .map((weight, index) => ({
                        express: expressNumbers[index] || '未知',
                        weight,
                        amount: amountData[index] || { amount: 0, originalText: '金额：未知' }
                    }))
                    .filter(item => item.express !== '未知');

                let results = filteredData.map(item => {
                    const orderWeight = item.weight.orderWeight || 0;
                    const realWeight = item.weight.realWeight || 0;
                    const amountValue = item.amount.amount || 0;

                    const weightDiff = (orderWeight - realWeight).toFixed(3);
                    const goldPrice = (amountValue / orderWeight || 0).toFixed(2);
                    const diffAmount = (parseFloat(goldPrice) * parseFloat(weightDiff)).toFixed(2);

                    return `
快递单号：${item.express}
下单克重${orderWeight}g，订单实称重量${realWeight}g
金额：${item.amount.amount}元
克差：${weightDiff}g
销售金价：${goldPrice}元/g
差价金额：${diffAmount}元
`.trim();
                }).join('\n\n');

                // 生成话术
                let message = '';
                if (filteredData.length > 0) {
                    const diffAmounts = filteredData.map(item => {
                        const orderWeight = item.weight.orderWeight || 0;
                        const realWeight = item.weight.realWeight || 0;
                        const amountValue = item.amount.amount || 0;
                        const goldPrice = (amountValue / orderWeight || 0).toFixed(2);
                        const weightDiff = (orderWeight - realWeight).toFixed(3);
                        return (parseFloat(goldPrice) * parseFloat(weightDiff)).toFixed(2);
                    });

                    message = `
【亲 ，麻烦您核实一下差价金额，核实无误后，确认收货后这边给您小额打款。您的订单退差金额是：${diffAmounts.join('元、')}元】`;
                }

                copyToClipboard(results + message);

            } catch (e) {
                showToast(`处理失败：${e.message}`);
            }
        });

        // 添加元素到页面
        rightContainer.appendChild(weightInput);
        rightContainer.appendChild(processBtn);
    });

    /* ***************************
     * 4. 基础函数（增强容错）
     *************************** */
    function processExpressData() {
        return Array.from(document.querySelectorAll('.a.look_express')).map(el =>
            el.textContent.trim().replace(/[\s\n]+/g, '') || '未知'
        );
    }

    function processAmountData() {
        return Array.from(document.querySelectorAll('._jt_cell._jt_ch._jt_cell_paid_amount')).map(cell => {
            const amountStr = cell.textContent.match(/\d+\.?\d*/)?.[0] || '未知';
            return {
                amount: parseFloat(amountStr) || 0,
                originalText: `金额：${amountStr}元`
            };
        });
    }

    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => showToast('数据已复制到剪贴板，请自行核对'))
                .catch(() => fallbackCopy(text));
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast('数据已复制到剪贴板');
        } catch (e) {
            showToast('复制失败，请重试如需更新脚本联系wx:RakuRai');
        } finally {
            document.body.removeChild(textarea);
        }
    }
})();