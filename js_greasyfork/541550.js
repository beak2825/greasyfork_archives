// ==UserScript==
// @name         三采行动计算器
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在网站上显示一个可隐藏的操作面板，计算三采行动所需次数，支持回车切换输入框，自动替换中文句号为英文小数点，输入文字为黑色
// @author       You
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541550/%E4%B8%89%E9%87%87%E8%A1%8C%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/541550/%E4%B8%89%E9%87%87%E8%A1%8C%E5%8A%A8%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        #mining-calculator-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: #ffffff;
            border: 2px solid #4CAF50;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            transition: all 0.3s ease;
        }

        .panel-header {
            background: #4CAF50;
            color: white;
            padding: 8px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 6px 6px 0 0;
            font-weight: bold;
        }

        .hide-btn {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 3px;
        }

        .hide-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .panel-content {
            padding: 15px;
        }

        .input-row {
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }

        .input-row label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
            color: #333;
            min-width: 80px;
        }

        .range-inputs {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        }

        .range-inputs input,
        input[type="number"] {
            padding: 8px;
            border: 1px solid #000;
            border-radius: 4px;
            font-size: 14px;
            background: #fff;
            color: #000;
            text-align: center;
        }

        input[type="number"] {
            width: 100%;
        }

        input[type="number"]:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 5px rgba(76, 175, 80, 0.3);
        }

        .confirm-btn {
            width: 100%;
            padding: 10px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s;
        }

        .confirm-btn:hover {
            background: #45a049;
        }

        .result-area {
            margin-top: 12px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            border: 1px solid #ddd;
            min-height: 20px;
            color: #333;
            font-weight: bold;
        }

        .result-area.error {
            background: #ffebee;
            border-color: #f44336;
            color: #d32f2f;
        }

        .result-area.success {
            background: #e8f5e8;
            border-color: #4CAF50;
            color: #2e7d32;
        }

        .show-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 18px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
            align-items: center;
            justify-content: center;
        }

        .show-btn:hover {
            background: #45a049;
            transform: scale(1.1);
        }
    `;
    document.head.appendChild(style);

    // 插入HTML
    const panelHTML = `
        <div id="mining-calculator-panel">
            <div class="panel-header">
                <span>三采行动计算器</span>
                <button class="hide-btn" id="hide-panel">−</button>
            </div>
            <div class="panel-content">
                <div class="input-row">
                    <label>物品产出</label>
                    <div class="range-inputs">
                        <input type="number" id="range-min" placeholder="下限" step="0.1">
                        <span class="wave-symbol">~</span>
                        <input type="number" id="range-max" placeholder="上限" step="0.1">
                    </div>
                </div>
                <div class="input-row">
                    <label>效率加成:</label>
                    <input type="number" id="efficiency" placeholder="效率加成" step="0.1">
                </div>
                <div class="input-row">
                    <label>目标数量</label>
                    <input type="number" id="target-amount" placeholder="目标数量" step="0.1">
                </div>
                <div class="input-row">
                    <button class="confirm-btn" id="calculate-btn">确认计算</button>
                </div>
                <div class="result-area" id="result-area">回车可快捷切换输入框</div>
            </div>
        </div>
        <button class="show-btn" id="show-panel">+</button>
    `;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // 获取元素
    const panel = document.getElementById('mining-calculator-panel');
    const showBtn = document.getElementById('show-panel');
    const hideBtn = document.getElementById('hide-panel');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultArea = document.getElementById('result-area');
    panel.style.display = 'none';
    showBtn.style.display = 'flex';

    // 显示/隐藏逻辑
    hideBtn.addEventListener('click', () => {
        panel.style.display = 'none';
        showBtn.style.display = 'flex';
    });
    showBtn.addEventListener('click', () => {
        panel.style.display = 'block';
        showBtn.style.display = 'none';
    });

    // 输入验证
    function validateInputs() {
        const rangeMin = parseFloat(document.getElementById('range-min').value);
        const rangeMax = parseFloat(document.getElementById('range-max').value);
        const efficiency = parseFloat(document.getElementById('efficiency').value);
        const targetAmount = parseFloat(document.getElementById('target-amount').value);
        const errors = [];

        if (isNaN(rangeMin) || rangeMin < 0) errors.push('下限必须是非负数');
        if (isNaN(rangeMax) || rangeMax < 0) errors.push('上限必须是非负数');
        if (!isNaN(rangeMin) && !isNaN(rangeMax) && rangeMin > rangeMax) errors.push('下限不能大于上限');
        if (isNaN(efficiency) || efficiency < -100) errors.push('效率加成不能小于-100%');
        if (isNaN(targetAmount) || targetAmount <= 0) errors.push('目标数量必须是正数');
        if (!isNaN(rangeMin) && !isNaN(rangeMax) && (rangeMin + rangeMax) === 0) errors.push('区间下限和上限不能都为0');
        if (efficiency === -100) errors.push('效率加成不能为-100%（会导致除零错误）');

        return { isValid: errors.length === 0, errors, values: { rangeMin, rangeMax, efficiency, targetAmount } };
    }

    // 执行计算
    function calculateResult() {
        const validation = validateInputs();
        if (!validation.isValid) {
            resultArea.className = 'result-area error';
            resultArea.textContent = '错误: ' + validation.errors.join('； ');
            return;
        }
        const { rangeMin, rangeMax, efficiency, targetAmount } = validation.values;
        const averageAmount = (rangeMin + rangeMax) / 2;
        const effectiveRate = (efficiency + 100) / 100;
        const actionsNeeded = targetAmount / averageAmount / effectiveRate;

        resultArea.className = 'result-area success';
        resultArea.textContent = `需要行动次数: ${actionsNeeded.toFixed(2)}`;
    }

    // 输入框行为：回车切换 + 替换中文句号
    const inputs = panel.querySelectorAll('input[type="number"]');
    inputs.forEach((input, idx) => {
        input.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (idx < inputs.length - 1) {
                    inputs[idx + 1].focus();
                } else {
                    calculateResult();
                    calculateBtn.focus();
                }
            }
        });

        input.addEventListener('input', () => {
            if (input.value.includes('。')) {
                input.value = input.value.replace(/。/g, '.');
            }
        });
    });

    calculateBtn.addEventListener('click', calculateResult);

    console.log('三采行动计算器 v2.0 已加载');
})();
