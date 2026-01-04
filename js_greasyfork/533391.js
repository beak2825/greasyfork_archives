// ==UserScript==
// @name         卓大爷-报活动
// @namespace    http://your-namespace.com
// @version      8.7.2
// @description  悬停滚动优化+操作提示+状态同步
// @author       卓大爷
// @match        https://seller.kuajingmaihuo.com/*
// @run-at       document-end
// @grant        none
// @icon         https://www.example.com/hisoka-official-art.png
// @downloadURL https://update.greasyfork.org/scripts/533391/%E5%8D%93%E5%A4%A7%E7%88%B7-%E6%8A%A5%E6%B4%BB%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533391/%E5%8D%93%E5%A4%A7%E7%88%B7-%E6%8A%A5%E6%B4%BB%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let calculatorInitialized = false;
    let currentZIndex = 1000000;
    const MATERIAL_CONFIG = {
        '丝印钢化膜 0.55元': {
            base: 0.55,
            material: [0.40, 0.45+0.55*1, 0.49+0.55*2, 0.54+0.55*3, 0.58+0.55*4],
            unit: '张'
        },
        '水凝膜 0.5元': {
            base: 0.50,
            material: [0.40, 0.45+0.50*1, 0.49+0.50*2, 0.54+0.50*3, 0.58+0.50*4],
            unit: '张'
        },
        '白片 0.35元': {
            base: 0.35,
            material: [0.40, 0.45+0.35*1, 0.49+0.35*2, 0.54+0.35*3, 0.58+0.35*4],
            unit: '张'
        },
        '透明手机壳 1元': {
            base: 1.00,
            material: [0.12, 0.14+1*1, 0.16+1*2, 0.18+1*3, 0.20+1*4],
            unit: '个'
        },
        '备用1': {
            base: 1.20,
            material: [0.15, 0.18+1.2*1, 0.20+1.2*2, 0.22+1.2*3, 0.25+1.2*4],
            unit: '个'
        },
        '备用2': {
            base: 1.20,
            material: [0.15, 0.18+1.2*1, 0.20+1.2*2, 0.22+1.2*3, 0.25+1.2*4],
            unit: '个'
        }
    };

    // 创建悬浮球
    function createFloatingBall() {
        const floatingBall = document.createElement('div');
        floatingBall.id = 'hisoka-floating-ball';
        floatingBall.style.cssText = `
            position: fixed;
            bottom: 40px;
            right: 40px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            border-radius: 13%;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            z-index: ${currentZIndex + 1};
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 15px;
            user-select: none;
            transition: all 0.2s;
        `;
        floatingBall.textContent = '来💰财';

        floatingBall.addEventListener('mousedown', () => floatingBall.style.transform = 'scale(0.9)');
        floatingBall.addEventListener('mouseup', () => floatingBall.style.transform = 'scale(1)');
        floatingBall.addEventListener('click', toggleCalculator);
        document.body.appendChild(floatingBall);
    }

    // 切换计算器显示
    function toggleCalculator() {
        const container = document.getElementById('profit-calculator-container');
        if (!container) return initCalculator();

        if (container.style.display === 'none') {
            currentZIndex += 2;
            container.style.cssText = `
                display: block;
                z-index: ${currentZIndex};
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            `;
            document.getElementById('hisoka-floating-ball').style.zIndex = currentZIndex + 1;
        } else {
            container.style.display = 'none';
        }
    }

    // 双击处理函数
    function handleDoubleClick(e) {
        const container = document.getElementById('profit-calculator-container');
        if (!container || container.style.display === 'none') return;
        if (e.target.closest('input, button, select')) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const clickedText = selection.toString().trim();
        const numberMatch = clickedText.match(/(-?\d+\.?\d*)/);
        if (!numberMatch) return;

        const parsedNumber = parseFloat(numberMatch[0]);
        if (isNaN(parsedNumber)) return;

        const priceInput = document.getElementById('profit-price-input');
        priceInput.value = Math.max(0, parsedNumber).toFixed(2);
        priceInput.dispatchEvent(new Event('input', { bubbles: true }));

        document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));

        e.stopPropagation();
        e.preventDefault();
    }

    function initCalculator() {
        if (calculatorInitialized) return;
        calculatorInitialized = true;

        // 防覆盖样式
        const antiCoverStyle = document.createElement('style');
        antiCoverStyle.textContent = `
            div[style*="z-index: 999999"] { z-index: 99999 !important; }
            #profit-calculator-container { z-index: ${currentZIndex} !important; }
            #hisoka-floating-ball { z-index: ${currentZIndex + 1} !important; }
        `;
        document.head.appendChild(antiCoverStyle);

        // 主样式
        const style = document.createElement('style');
        style.textContent = `
            #profit-calculator-container {
                position: fixed;
                width: 400px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                font-family: "Microsoft YaHei", sans-serif;
                border: 1px solid #4CAF50;
                transition: all 0.3s;
            }
            #profit-calculator-header {
                padding: 12px;
                background: #4CAF50;
                color: white;
                cursor: move;
                user-select: none;
                border-radius: 8px 8px 0 0;
            }
            .header-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .window-controls button {
                background: transparent;
                border: none;
                color: white;
                cursor: pointer;
                padding: 3px 3px;
                font-size: 35px;
            }
            .profit-input-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 12px;
                padding: 20px;
            }
            .profit-input-field {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .profit-result-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            .profit-result-table td {
                padding: 12px;
                border: 1px solid #ddd;
                text-align: center;
                cursor: ns-resize;
            }
            .profit-high { color: #28a745; }
            .profit-medium { color: #1f618d; }
            .profit-lingyuangou { color: #8A2BE2; }
            .profit-low { color: #dc3545; }
            .preset-buttons-container {
                padding: 0 20px 10px;
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            .preset-profit-btn {
                flex: 1 1 15%;
                min-width: 60px;
                padding: 6px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: #f8f9fa;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 12px;
            }
            .preset-profit-btn.clear-btn {
                background-color: #dc3545 !important;
                color: white !important;
                border-color: #bd2130 !important;
            }
            .preset-profit-btn.clear-btn:hover {
                background-color: #c82333 !important;
            }
            .preset-profit-btn.active {
                background: #4CAF50 !important;
                color: white;
                border-color: #45a049;
            }
            .preset-profit-btn:hover {
                background: #e9ecef;
            }
            .tip-icon {
                margin-right: 5px;
                font-size: 14px;
            }
            .image-tip {
                font-size: 12px;
                color: #666;
                padding: 8px 12px;
                border-top: 1px solid #eee;
                background: #f8f8f8;
            }
        `;
        document.head.appendChild(style);

        // 容器结构
        const container = document.createElement('div');
        container.id = 'profit-calculator-container';
        container.innerHTML = `
            <div id="profit-calculator-header">
                <div class="header-controls">
                    <span>   报活动利润检查器 上架选200% 三倍报价</span>
                    <div class="window-controls">
                        <button id="profit-close-btn">×</button>
                    </div>
                </div>
                <div class="image-tip">
                    <span class="tip-icon">ℹ️</span>鼠标悬停可滚轮调价，双击数字自动填充ℹ️卓大爷
                </div>
            </div>
            <div class="profit-input-grid">
                <div>
                    <select id="profit-material-type" class="profit-input-field">
                        <option value="">选择产品款式</option>
                        ${Object.keys(MATERIAL_CONFIG).map(k => `<option value="${k}">${k}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <select id="profit-quantity" class="profit-input-field">
                        <option value="">选择数量</option>
                        ${[1,2,3,4,5].map(n => `<option value="${n}">${n}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <input type="number" id="profit-price-input" class="profit-input-field" placeholder="活动申报价 (¥)" step="0.01">
                </div>
                <div>
                    <input type="number" id="profit-cost-input" class="profit-input-field" placeholder="总成本 (¥)" readonly>
                </div>
            </div>
            <div class="preset-buttons-container" id="preset-buttons"></div>
            <table class="profit-result-table">
                <tr>
                    <td id="profit-rate">利润率%</td>
                    <td id="profit-amount">利润额人民币</td>
                    <td id="profit-suggestion">建议</td>
                </tr>
            </table>
        `;
        document.body.appendChild(container);

        // 添加预设按钮
        const presetPercentages = [0,5,10,15,20,25,30,35,40,45,50,100,"上架>",200,"<三倍"];

        const buttonsContainer = document.getElementById('preset-buttons');
        presetPercentages.forEach(pct => {
            const btn = document.createElement('button');
            btn.className = 'preset-profit-btn';
            btn.textContent = `${pct}%`;
            btn.dataset.percentage = pct;
            buttonsContainer.appendChild(btn);
        });
        const clearBtn = document.createElement('button');
        clearBtn.className = 'preset-profit-btn clear-btn';
        clearBtn.textContent = '清空申报价';
        clearBtn.onclick = () => {
            document.getElementById('profit-price-input').value = '';
            calculateProfit();
            document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));
        };
        buttonsContainer.appendChild(clearBtn);

        // 拖拽功能
        let isDragging = false;
        let startX = 0, startY = 0;
        let initialX = 0, initialY = 0;

        document.getElementById('profit-calculator-header').addEventListener('mousedown', (e) => {
            if (e.target.closest('button')) return;

            isDragging = true;
            const rect = container.getBoundingClientRect();
            startX = e.clientX;
            startY = e.clientY;
            initialX = rect.left;
            initialY = rect.top;

            currentZIndex += 2;
            container.style.zIndex = currentZIndex;
            document.body.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
            container.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const newX = initialX + (e.clientX - startX);
            const newY = initialY + (e.clientY - startY);
            const maxX = window.innerWidth - container.offsetWidth;

            container.style.left = `${Math.max(-20, Math.min(newX, maxX + 20))}px`;
            container.style.top = `${Math.max(0, newY)}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;

            const rect = container.getBoundingClientRect();
            const finalX = Math.max(0, Math.min(rect.left, window.innerWidth - container.offsetWidth));

            container.style.cssText = `
                left: ${finalX}px;
                top: ${rect.top}px;
                transition: all 0.3s;
                z-index: ${currentZIndex};
            `;
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        });

        // 核心业务逻辑
        function updateCost() {
            const material = document.getElementById('profit-material-type').value;
            const quantity = document.getElementById('profit-quantity').value;
            if (!material || !quantity) {
                document.getElementById('profit-cost-input').value = '';
                return;
            }

            const config = MATERIAL_CONFIG[material];
            if (!config || !config.material[quantity-1]) return;

            const totalCost = (config.base + config.material[quantity-1]).toFixed(2);
            document.getElementById('profit-cost-input').value = totalCost;
            calculateProfit();
        }

        function calculateProfit() {
            const price = parseFloat(document.getElementById('profit-price-input').value);
            const cost = parseFloat(document.getElementById('profit-cost-input').value);

            if (isNaN(price)) {
                document.getElementById('profit-rate').textContent = '-';
                document.getElementById('profit-amount').textContent = '-';
                document.getElementById('profit-suggestion').textContent = '-';
                return;
            }

            if (isNaN(cost)) return;

            const profit = (price - cost).toFixed(2);
            const profitRate = cost ? ((profit / cost) * 100).toFixed(2) : 0;

            document.getElementById('profit-rate').textContent = `${profitRate}%`;
            document.getElementById('profit-amount').textContent = profit;

            const suggestion = document.getElementById('profit-suggestion');
            suggestion.className = '';
            if (profit < 0) {
                suggestion.textContent = '❌ 亏损 狗都不做';
                suggestion.classList.add('profit-low');
            } else if (profitRate >= 30) {
                suggestion.textContent = '✅ 吃鸡 大吉大利';
                suggestion.classList.add('profit-high');
            } else if (profitRate >= 15) {
                suggestion.textContent = '⚠️ 及时提高利润';
                suggestion.classList.add('profit-medium');
            } else {
                suggestion.textContent = '❗ 零元购 主打陪伴吗？';
                suggestion.classList.add('profit-lingyuangou');
            }
        }

        // 新增悬停滚动选择功能
        const productSelect = document.getElementById('profit-material-type');
        const quantitySelect = document.getElementById('profit-quantity');

        function setupScrollSelect(selectElement) {
            const handleWheel = (e) => {
                e.preventDefault();
                const validOptions = Array.from(selectElement.options)
                    .filter(opt => opt.value !== '');

                if (validOptions.length === 0) return;

                let currentIndex = validOptions.findIndex(opt =>
                    opt === selectElement.options[selectElement.selectedIndex]
                );

                // 处理初始未选择状态
                if (currentIndex === -1) {
                    selectElement.selectedIndex = validOptions[0].index;
                    currentIndex = 0;
                } else {
                    const delta = e.deltaY > 0 ? 1 : -1;
                    currentIndex = (currentIndex + delta + validOptions.length) % validOptions.length;
                }

                selectElement.selectedIndex = validOptions[currentIndex].index;
                selectElement.dispatchEvent(new Event('change'));
            };

            selectElement.addEventListener('mouseenter', () => {
                selectElement.addEventListener('wheel', handleWheel);
            });

            selectElement.addEventListener('mouseleave', () => {
                selectElement.removeEventListener('wheel', handleWheel);
            });
        }

        // 启用滚动选择
        setupScrollSelect(productSelect);
        setupScrollSelect(quantitySelect);

        // 增强版滚轮处理
        function handleWheel(e, step) {
            e.preventDefault();
            const priceInput = document.getElementById('profit-price-input');
            let price = parseFloat(priceInput.value) || 0;
            price = (price + step).toFixed(2);
            priceInput.value = Math.max(0, price);

            document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));
            calculateProfit();
        }

        // 优化事件绑定
        const priceInputContainer = document.querySelector('.profit-input-grid > div:nth-child(3)');
        priceInputContainer.addEventListener('wheel', (e) => {
            if (!document.activeElement.matches('#profit-price-input')) {
                handleWheel(e, e.deltaY > 0 ? -0.01 : 0.01);
            }
        });

        // 保持原有单元格滚动
        document.getElementById('profit-rate').addEventListener('wheel', (e) => handleWheel(e, e.deltaY > 0 ? -0.01 : 0.01));
        document.getElementById('profit-amount').addEventListener('wheel', (e) => handleWheel(e, e.deltaY > 0 ? -0.01 : 0.01));

        // 输入框聚焦状态处理
        document.getElementById('profit-price-input').addEventListener('focus', () => {
            priceInputContainer.style.pointerEvents = 'none';
        });
        document.getElementById('profit-price-input').addEventListener('blur', () => {
            priceInputContainer.style.pointerEvents = 'auto';
        });

        // 事件绑定
        document.addEventListener('dblclick', handleDoubleClick);

        buttonsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.preset-profit-btn');
            if (!btn) return;

            document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));

            const material = document.getElementById('profit-material-type').value;
            const quantity = document.getElementById('profit-quantity').value;
            const costInput = document.getElementById('profit-cost-input');

            if (!material || !quantity) return alert('请先选择产品和数量');
            if (!costInput.value) return alert('无法获取成本信息');

            const cost = parseFloat(costInput.value);
            const percentage = parseFloat(btn.dataset.percentage) / 100;
            const suggestedPrice = (cost * (1 + percentage)).toFixed(2);

            document.getElementById('profit-price-input').value = suggestedPrice;
            calculateProfit();
            btn.classList.add('active');
        });

        buttonsContainer.addEventListener('dblclick', (e) => {
            const btn = e.target.closest('.preset-profit-btn');
            if (btn) btn.classList.remove('active');
        });

        document.getElementById('profit-price-input').addEventListener('input', function() {
            document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));
            calculateProfit();
        });

        document.getElementById('profit-material-type').addEventListener('change', function() {
            document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));
            const unit = MATERIAL_CONFIG[this.value]?.unit || '';
            Array.from(document.getElementById('profit-quantity').options).forEach(opt => {
                if (opt.value) opt.text = `${opt.value} ${unit}`;
            });
            updateCost();
        });

        document.getElementById('profit-quantity').addEventListener('change', function() {
            document.querySelectorAll('.preset-profit-btn').forEach(b => b.classList.remove('active'));
            updateCost();
        });

        document.getElementById('profit-close-btn').addEventListener('click', () => container.style.display = 'none');

        // 初始化计算
        updateCost();
        container.style.display = 'block';
    }

    window.addEventListener('load', createFloatingBall);
})();