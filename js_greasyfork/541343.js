(function() {
    const ac_prefix = 'ac_';

    // 获取DOM元素 v20250806
    const ac_getElement = (id) => document.getElementById(id);
    let totalButtonClicks = 0;
    let positiveProfitClicks = 0;
    let maxProfit = 0;
    let maxLoss = 0;
    // 盈亏管理器
    const profitMonitor = {
    // 更新最大盈亏 + 利润率
    update: function(currentProfit, totalCost) {
        const byProfitElement = ac_getElement('byprofit');
        const byLossElement = ac_getElement('byLoss');
        const ratioElement = ac_getElement('profit_loss_ratio');
        // 1. 更新最大盈利/亏损（原有逻辑）
        if (currentProfit > maxProfit) {
            maxProfit = currentProfit;
            byProfitElement.textContent = maxProfit.toLocaleString();
            byProfitElement.className = 'result-value profit';
        }
        if (currentProfit < maxLoss) {
            maxLoss = currentProfit;
            byLossElement.textContent = maxLoss.toLocaleString();
            byLossElement.className = 'result-value loss';
        }
        // 2. 新增：计算并显示合并利润率
        const profitRatio = totalCost > 0 ? (maxProfit / totalCost) * 100 : 0;
        const lossRatio = totalCost > 0 ? (maxLoss / totalCost) * 100 : 0;
        ratioElement.innerHTML = `
            <span class="${profitRatio >= 0 ? 'profit' : 'loss'}">${profitRatio.toFixed(1)}%</span>|
            <span class="${lossRatio <= 0 ? 'loss' : 'profit'}">-${Math.abs(lossRatio).toFixed(1)}%</span>
        `;
        // 3新增：更新期望利润的颜色
        const expectationElement = ac_getElement('expectation');
        const expectationValue = parseFloat(expectationElement.textContent) || 0;
        expectationElement.className = 'result-value ' + (expectationValue >= 0 ? 'profit' : 'loss');
    },
    // 重置所有数据
    reset: function() {
        maxProfit = 0;
        maxLoss = 0;
        ac_getElement('byprofit').textContent = '0';
        ac_getElement('byLoss').textContent = '0';
        ac_getElement('profit_loss_ratio').innerHTML = '0%|0%';
    }
};
    function bindProfitUpdates() {
    // 保存原始函数
    const originalSimulateAlchemy = window.alchemyCalculator.simulateAlchemy;
    const originalSimulateRecursive = window.alchemyCalculator.simulateRecursiveAlchemy;
    const originalSimulateUntilTarget = window.alchemyCalculator.simulateUntilTarget;
    // 重写函数，添加监控逻辑
    window.alchemyCalculator.simulateAlchemy = function() {
        const result = originalSimulateAlchemy.apply(this, arguments);
        const profitText = ac_getElement('profitLoss').textContent.replace(/,/g, '');
        profitMonitor.update(parseFloat(profitText) || 0);
        return result;
    };
    window.alchemyCalculator.simulateRecursiveAlchemy = function() {
        const result = originalSimulateRecursive.apply(this, arguments);
        const profitText = ac_getElement('profitLoss').textContent.replace(/,/g, '');
        profitMonitor.update(parseFloat(profitText) || 0);
        return result;
    };
    window.alchemyCalculator.simulateUntilTarget = function() {
        const result = originalSimulateUntilTarget.apply(this, arguments);
        const profitText = ac_getElement('profitLoss').textContent.replace(/,/g, '');
        profitMonitor.update(parseFloat(profitText) || 0);
        return result;
    };
}
    // 格式化时间显示（秒 → 分钟/小时）
    function ac_formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds.toFixed(1)}秒`;
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes < 60) {
            return `${minutes}分${remainingSeconds > 0 ? remainingSeconds.toFixed(1) + '秒' : ''}`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}小时${remainingMinutes > 0 ? remainingMinutes + '分' : ''}`;
    }
	// 新增函数：计算实际动作次数
	function calculateActualAttempts(baseAttempts, efficiencyRate) {
    let actualAttempts = 0;
    for (let i = 0; i < baseAttempts; i++) {
        // 基础动作
        actualAttempts += 1;
        // 基础重复（效率≤100%部分）
        if (efficiencyRate > 0) {
            const baseChance = Math.min(efficiencyRate, 100) / 100;
            if (Math.random() < baseChance) {
                actualAttempts += 1;
            }
            // 额外重复（效率>100%部分）
            if (efficiencyRate > 100) {
                const extraChance = (efficiencyRate - 100) / 100;
                if (Math.random() < extraChance) {
                    actualAttempts += 1;
                }
            }
        }
    }
    return actualAttempts;
}

    // 模拟炼金过程
    function ac_simulateAlchemy() {
		document.querySelectorAll('.output-allquantity').forEach(input => {
        input.value = '0';
    });
        const simulateTimes = parseInt(ac_getElement('simulateTimes').value) || 0;
		const efficiencyRate = parseInt(ac_getElement('efficiencyRate').value) || 0;
		const successRate = parseFloat(ac_getElement('successRate').value) || 0;
		const baseTimePerTry = parseInt(ac_getElement('timePerTry').value) || 0;

        // 验证输入
        if (simulateTimes <= 0 || simulateTimes > 1000000) {
            alert('请输入1-1000000之间的模拟次数');
            return;
        }

        if (successRate < 0 || successRate > 100) {
            alert('成功率必须在0-100之间');
            return;
        }

        if (efficiencyRate < 0 || efficiencyRate > 200) {
            alert('效率必须在0-200之间');
            return;
        }


        // 获取产出物品信息
        const outputRows = document.querySelectorAll('#outputItems tr');
        const items = [];
        let totalProbability = 0;
        let maxValueItem = null;
        let maxValue = 0;

        outputRows.forEach(row => {
            const probability = parseFloat(row.querySelector('.output-probability').value) || 0;
            const itemName = row.querySelector('.output-item').value;
            const price = parseInt(row.querySelector('.output-price').value) || 0;
			const baseQuantity = parseInt(row.querySelector('.output-quantity').value) || 1;

            items.push({
                name: itemName,
				probability,
				price,
				baseQuantity, // 单次掉落数量（output-quantity）
				currentQuantity: 0, // 本次模拟的数量
				total: 0
            });
            totalProbability += probability;
            const itemValue = price * baseQuantity;
            if (itemValue > maxValue) {
                maxValue = itemValue;
                maxValueItem = items[items.length - 1]; // 指向刚添加的item
            }
        });

        // 验证概率总和
        const roundedTotal = Math.round(totalProbability * 100) / 100;
        if (roundedTotal !== 100) {
            alert(`所有物品的概率总和必须为100%，当前为${totalProbability.toFixed(2)}%`);
            return;
        }

        // 重置物品数量
        items.forEach(item => {
            item.quantity = 0;
            item.total = 0;
        });

        // 开始模拟
		const totalActions = calculateActualAttempts(simulateTimes, efficiencyRate);
		const baseTotalTime = simulateTimes * baseTimePerTry;
		const totalTime = baseTotalTime * (simulateTimes / totalActions);
		let successCount = 0;
        let totalAttempts = 0;
        let highValueSuccess = 0;
		for (let i = 0; i < simulateTimes; i++) { 
            totalAttempts++; // 无论成功与否，都算一次尝试
        if (Math.random() * 100 < successRate) {
            successCount++;
            // 随机选择产出物品（保持不变）
            let random = Math.random() * 100;
            let accumulated = 0;
            for (const item of items) {
                accumulated += item.probability;
                if (random <= accumulated) {
                item.currentQuantity += item.baseQuantity;
                item.total += item.price * item.baseQuantity;
                // 新增：检查是否获得最高价值物品
                if (item === maxValueItem) {
                    highValueSuccess++;
                }
                break;
                }
            }
        }
    }
         const ac_allCostPerTry = parseFloat(ac_getElement('allcostPerTry').value) || 0;
        const ac_catalystCost = parseFloat(ac_getElement('Catalyst').value) || 0;

        // 计算期望利润
        let expectedProfit = 0;
        items.forEach(item => {
            const expectedQuantity = (successRate / 100) * (item.probability / 100) * simulateTimes * item.baseQuantity;
            expectedProfit += expectedQuantity * item.price;
        });
        const expectedCost = simulateTimes * ac_allCostPerTry - (simulateTimes * (1 - successRate / 100) * ac_catalystCost);
        const expectedValue = expectedProfit - expectedCost;
        // 计算标准差（需要计算方差）
        let variance = 0;
        items.forEach(item => {
            const p = (successRate / 100) * (item.probability / 100);
            const value = item.price * item.baseQuantity;
            variance += p * (1 - p) * Math.pow(value, 2) * simulateTimes;
        });
        // 添加催化剂返还的方差（假设是固定返还）
        const catalystVariance = (successRate / 100) * (1 - successRate / 100) * Math.pow(ac_catalystCost, 2) * simulateTimes;
        variance += catalystVariance;
        const stdDeviation = Math.sqrt(variance);
        // 更新UI
        ac_getElement('expectation').textContent = Math.round(expectedValue).toLocaleString();
        ac_getElement('stdDeviation').textContent = Math.round(stdDeviation).toLocaleString();


        // 更新UI显示物品数量
        outputRows.forEach((row, index) => {
			const item = items[index];
            // 显示本次模拟结果
			row.querySelector('.output-allquantity').value =
            (parseInt(row.querySelector('.output-allquantity').value) || 0) + item.currentQuantity;
            // 显示本次模拟的总价
			row.querySelector('.output-total').value = item.total;
        });
        // 计算并显示结果
        ac_getElement('timeCost').textContent = ac_formatTime(totalTime);
        // 存储成功次数
        if (!ac_getElement('successCount')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'successCount';
        document.body.appendChild(hiddenInput);
    }
        ac_getElement('successCount').value = successCount;
        // 触发盈亏计算
        ac_calculateProfit();
        const profitText = ac_getElement('profitLoss').textContent.replace(/,/g, '');
        const currentProfit = parseFloat(profitText) || 0;
        // 更新统计
        totalButtonClicks++;
        if (currentProfit > 0) positiveProfitClicks++;
        // 显示统计结果
        ac_getElement('Besimulationsisk').textContent = `${positiveProfitClicks}|${totalButtonClicks}`;
        ac_getElement('positivereturn').textContent = `${((positiveProfitClicks / totalButtonClicks) * 100).toFixed(2)}%`;
        // 在
        const actualSuccessRate = (successCount / simulateTimes) * 100;
        const actualHighValueRate = (highValueSuccess / simulateTimes) * 100;
        ac_getElement('ActualSuccessrate').textContent = `${actualSuccessRate.toFixed(2)}% | ${actualHighValueRate.toFixed(2)}%`;
        // 同时更新消耗显示
        const catalystConsumed = successCount;
        ac_getElement('Consumable').textContent = `${successCount}|${totalAttempts}`;
        // 计算变异系数(CV) = 标准差/期望值
        let cv, riskLevel, riskClass;
        if (expectedValue > 0) {
            cv = stdDeviation / expectedValue;
            if (cv < 1) {
                riskLevel = "低风险";
                riskClass = "profit";
            } else if (cv < 2) {
                riskLevel = "较高风险";
                riskClass = "loss";
            } else {
                riskLevel = "高风险";
                riskClass = "high-risk";
            }
        } else {
            // 负期望值直接标记为极高风险
            cv = Infinity;
            riskLevel = "超高风险";
            riskClass = "extreme-risk";
        }
        // 更新风险显示
        const riskElement = ac_getElement('Risk');
        riskElement.textContent = `${riskLevel} (CV: ${cv.toFixed(2)})`;
        riskElement.className = 'result-value ' + riskClass;
    }
    // 模拟炼金过程2
    // 模拟炼金过程2
    function ac_simulateUntilTarget() {
    // 重置输出数量
    document.querySelectorAll('.output-allquantity').forEach(input => {
        input.value = '0';
    });
    // 获取输入参数
    const efficiencyRate = parseInt(ac_getElement('efficiencyRate').value) || 0;
    const successRate = parseFloat(ac_getElement('successRate').value) || 0;
    const baseTimePerTry = parseInt(ac_getElement('timePerTry').value) || 0;
    // 获取产出物品信息
    const outputRows = document.querySelectorAll('#outputItems tr');
    const items = [];
    let totalProbability = 0;
    let maxValueItem = null;
    let maxValue = 0;
    outputRows.forEach(row => {
        const probability = parseFloat(row.querySelector('.output-probability').value) || 0;
        const itemName = row.querySelector('.output-item').value;
        const price = parseInt(row.querySelector('.output-price').value) || 0;
        const baseQuantity = parseInt(row.querySelector('.output-quantity').value) || 1;
        const item = {
            name: itemName,
            probability,
            price,
            baseQuantity,
            currentQuantity: 0,
            total: 0,
            row: row
        };
        items.push(item);
        totalProbability += probability;
        // 找出价值最高的物品
        const itemValue = price * baseQuantity;
        if (itemValue > maxValue) {
            maxValue = itemValue;
            maxValueItem = item;
        }
    });
    // 验证概率总和
    const roundedTotal = Math.round(totalProbability * 100) / 100;
    if (roundedTotal !== 100) {
        alert(`所有物品的概率总和必须为100%，当前为${totalProbability.toFixed(2)}%`);
        return;
    }
    // 开始模拟直到获得最高价值物品
    let totalSuccess = 0;      // 所有成功次数（包括非高价值）
    let highValueSuccess = 0;  // 仅高价值物品成功次数
    let totalAttempts = 0;     // 炼金动作次数（每次点击按钮算 1 次）
    let gotMaxValueItem = false;
    let totalTime = 0;
    while (!gotMaxValueItem) {
        totalAttempts++; // 每次循环代表 1 次基础炼金动作
        if (Math.random() * 100 < successRate) {
            totalSuccess++; // 成功次数+1
            // 随机选择产出物品
            let random = Math.random() * 100;
            let accumulated = 0;
            for (const item of items) {
                accumulated += item.probability;
                if (random <= accumulated) {
                    item.currentQuantity += item.baseQuantity;
                    item.total += item.price * item.baseQuantity;
                    // 检查是否获得最高价值物品
                    if (item === maxValueItem) {
                        highValueSuccess++;
                        gotMaxValueItem = true;
                    }
                    break;
                }
            }
        }
    }
    // 效率系数 = 1 + (efficiencyRate / 100)
    const efficiencyFactor = 1 + (efficiencyRate / 100);
    totalTime = (totalAttempts * baseTimePerTry) / efficiencyFactor;
    // 更新UI显示物品数量
    items.forEach(item => {
        item.row.querySelector('.output-allquantity').value = item.currentQuantity;
        item.row.querySelector('.output-total').value = item.total;
    });
    // 计算成本（总炼金动作次数 * 物品价格 + 总成功次数 * 催化剂价格）
    const itemPrice = parseFloat(ac_getElement('itemPrice').value) || 0;
    const catalystPrice = parseFloat(ac_getElement('Catalyst').value) || 0;
    const newTotalCost = totalAttempts * itemPrice + totalSuccess * catalystPrice;
    // 计算产出物品总价
    let totalOutputValue = 0;
    items.forEach(item => {
        totalOutputValue += item.total;
    });
    // 计算盈亏
    const profitLoss = totalOutputValue - newTotalCost;
    if (!ac_getElement('successCount')) {
    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.id = 'successCount';
    document.body.appendChild(hiddenInput);
}
    // 更新UI显示
    ac_getElement('timeCost').textContent = ac_formatTime(totalTime);
    ac_getElement('successCount').value = highValueSuccess;
    ac_getElement('Consumable').textContent = `${totalSuccess}|${totalAttempts}`;
    ac_getElement('totalCost').textContent = newTotalCost.toLocaleString();
    const profitElement = ac_getElement('profitLoss');
    profitElement.textContent = profitLoss.toLocaleString();
    profitElement.className = 'result-value ' + (profitLoss >= 0 ? 'profit' : 'loss');
    // 新增：更新最大盈亏记录
    profitMonitor.update(profitLoss,newTotalCost);
    // 显示两种成功率
    const actualTotalSuccessRate = (totalSuccess / totalAttempts) * 100;
    const actualHighValueRate = (highValueSuccess / totalAttempts) * 100;
    ac_getElement('ActualSuccessrate').textContent =
        ` ${actualTotalSuccessRate.toFixed(2)}% |  ${actualHighValueRate.toFixed(2)}%`;
}
    // 模拟递归
    function ac_simulateRecursiveAlchemy() {
    // 重置所有数量
    document.querySelectorAll('.output-allquantity').forEach(input => {
        input.value = '0';
    });
    const simulateTimes = parseInt(ac_getElement('simulateTimes').value) || 0;
    const efficiencyRate = parseInt(ac_getElement('efficiencyRate').value) || 0;
    const successRate = parseFloat(ac_getElement('successRate').value) || 0;
    const baseTimePerTry = parseInt(ac_getElement('timePerTry').value) || 0;
    const inputItemName = ac_getElement('alchemyitem').value;
    // 验证输入
    if (simulateTimes <= 0 || simulateTimes > 1000000) {
        alert('请输入1-1000000之间的模拟次数');
        return;
    }
    if (successRate < 0 || successRate > 100) {
        alert('成功率必须在0-100之间');
        return;
    }
    if (efficiencyRate < 0 || efficiencyRate > 200) {
        alert('效率必须在0-200之间');
        return;
    }
    // 获取产出物品信息
    const outputRows = document.querySelectorAll('#outputItems tr');
    const items = [];
    let totalProbability = 0;
    let inputItemInOutput = false; // 标记输入物品是否在产出列表中
    let maxValueItem = null;
    let maxValue = 0;
    outputRows.forEach(row => {
    const probability = parseFloat(row.querySelector('.output-probability').value) || 0;
    const itemName = row.querySelector('.output-item').value;
    const price = parseInt(row.querySelector('.output-price').value) || 0;
    const baseQuantity = parseInt(row.querySelector('.output-quantity').value) || 1;
    const newItem = {
        name: itemName,
        probability,
        price,
        baseQuantity,
        currentQuantity: 0,
        total: 0,
        row: row
    };
    items.push(newItem);
    totalProbability += probability;
    const itemValue = price * baseQuantity;
    if (itemValue > maxValue) {
        maxValue = itemValue;
        maxValueItem = newItem;
    }
    if (itemName === inputItemName) {
        inputItemInOutput = true;
    }
});
    // 验证概率总和
    const roundedTotal = Math.round(totalProbability * 100) / 100;
    if (roundedTotal !== 100) {
        alert(`所有物品的概率总和必须为100%，当前为${totalProbability.toFixed(2)}%`);
        return;
    }
    // 如果没有递归转换的可能，则使用普通模拟
    if (!inputItemInOutput) {
        return ac_simulateAlchemy();
    }
    // 开始递归模拟
    let totalSuccess = 0;
    let totalAttempts = 0;
    let totalTime = 0;
    let remainingInputItems = simulateTimes;

    // 递归转换函数
    let highValueSuccess = 0;
    function recursiveConversion() {
        if (remainingInputItems <= 0) return;
        remainingInputItems--;
        totalAttempts++;
        const actualAttempts = calculateActualAttempts(1, efficiencyRate);
        totalTime += baseTimePerTry * (1 / actualAttempts);
        if (Math.random() * 100 < successRate) {
            totalSuccess++;
            let random = Math.random() * 100;
            let accumulated = 0;
            for (const item of items) {
                accumulated += item.probability;
                if (random <= accumulated) {
                    if (item.name === inputItemName) {
                        item.currentQuantity += item.baseQuantity;
                        remainingInputItems += item.baseQuantity;
                    } else {
                        item.currentQuantity += item.baseQuantity;
                        item.total += item.price * item.baseQuantity;
                        // 新增：检查是否获得最高价值物品
                        if (item === maxValueItem) {
                            highValueSuccess++;
                        }
                    }
                    break;
                }
            }
            recursiveConversion();
        }
    }
    // 初始模拟
    for (let i = 0; i < simulateTimes; i++) {
        recursiveConversion();
    }
    // 更新UI显示物品数量
    items.forEach(item => {
        item.row.querySelector('.output-allquantity').value = item.currentQuantity;
        item.row.querySelector('.output-total').value = item.total;
    });
    // 计算成本（输入物品*初始次数 + (金币+催化剂)*成功次数）
    const itemPrice = parseFloat(ac_getElement('itemPrice').value) || 0;
    const catalystPrice = parseFloat(ac_getElement('Catalyst').value) || 0;
    const goldCost = parseFloat(ac_getElement('costPerTry').value) || 0;
    const totalCost = (simulateTimes * itemPrice) + (totalSuccess * (goldCost + catalystPrice));
    // 计算产出物品总价（不包括递归物品）
    let totalOutputValue = 0;
    items.forEach(item => {
        if (item.name !== inputItemName) {
            totalOutputValue += item.total;
        }
    });
    // 计算盈亏
    const profitLoss = totalOutputValue - totalCost;
    totalButtonClicks++;
    if (profitLoss > 0) positiveProfitClicks++;
    // 更新统计显示
    ac_getElement('Besimulationsisk').textContent = `${positiveProfitClicks}|${totalButtonClicks}`;
    ac_getElement('positivereturn').textContent = `${((positiveProfitClicks / totalButtonClicks) * 100).toFixed(2)}%`;
    // 更新UI显示
    ac_getElement('timeCost').textContent = ac_formatTime(totalTime);
    ac_getElement('Consumable').textContent = `${totalSuccess}|${totalAttempts}`;
    ac_getElement('totalCost').textContent = totalCost.toLocaleString();
    const profitElement = ac_getElement('profitLoss');
    profitElement.textContent = profitLoss.toLocaleString();
    profitElement.className = 'result-value ' + (profitLoss >= 0 ? 'profit' : 'loss');
     // 新增：更新最大盈亏记录
    profitMonitor.update(profitLoss,totalCost);
    // 计算实际成功率
    const actualSuccessRate = (totalSuccess / totalAttempts) * 100;
    const actualHighValueRate = (highValueSuccess / totalAttempts) * 100;
    ac_getElement('ActualSuccessrate').textContent = `${actualSuccessRate.toFixed(2)}% | ${actualHighValueRate.toFixed(2)}%`;
    // 计算期望利润和标准差
    let expectedProfit = 0;
    items.forEach(item => {
        if (item.name !== inputItemName) {
            const expectedQuantity = (successRate / 100) * (item.probability / 100) * simulateTimes * item.baseQuantity;
            expectedProfit += expectedQuantity * item.price;
        }
    });
    const expectedCost = simulateTimes * itemPrice + (successRate / 100 * simulateTimes * (goldCost + catalystPrice));
    const expectedValue = expectedProfit - expectedCost;
    // 计算标准差（需要计算方差）
    let variance = 0;
    items.forEach(item => {
        if (item.name !== inputItemName) {
            const p = (successRate / 100) * (item.probability / 100);
            const value = item.price * item.baseQuantity;
            variance += p * (1 - p) * Math.pow(value, 2) * simulateTimes;
        }
    });
    const stdDeviation = Math.sqrt(variance);
    // 更新期望和标准差显示
    ac_getElement('expectation').textContent = Math.round(expectedValue).toLocaleString();
    ac_getElement('stdDeviation').textContent = Math.round(stdDeviation).toLocaleString();
    // 计算变异系数(CV) = 标准差/期望值
    let cv, riskLevel, riskClass;
    if (expectedValue > 0) {
        cv = stdDeviation / expectedValue;
        if (cv < 1) {
            riskLevel = "低风险";
            riskClass = "profit";
        } else if (cv < 2) {
            riskLevel = "较高风险";
            riskClass = "loss";
        } else {
            riskLevel = "高风险";
            riskClass = "high-risk";
        }
    } else {
        // 负期望值直接标记为极高风险
        cv = Infinity;
        riskLevel = "超高风险";
        riskClass = "extreme-risk";
    }
    // 更新风险显示
    const riskElement = ac_getElement('Risk');
    riskElement.textContent = `${riskLevel} (CV: ${cv.toFixed(2)})`;
    riskElement.className = 'result-value ' + riskClass;
}

    // 计算盈亏
    // 计算盈亏
    // 计算盈亏
    function ac_calculateProfit() {
        // 计算总成本
        const ac_simulateTimes = parseFloat(ac_getElement('simulateTimes').value) || 0;
        const ac_allCostPerTry = parseFloat(ac_getElement('allcostPerTry').value) || 0;
        const ac_catalystCost = parseFloat(ac_getElement('Catalyst').value) || 0;
        // 获取成功次数（从模拟结果中获取）
        const successCount = parseInt(ac_getElement('successCount')?.value) || 0;
        const failCount = ac_simulateTimes - successCount;
        const ac_totalCost = (ac_simulateTimes * ac_allCostPerTry) - (failCount * ac_catalystCost);
        ac_getElement('totalCost').textContent = ac_totalCost.toLocaleString();
        // 计算产出物品总价
        let ac_totalOutputValue = 0;
		document.querySelectorAll('#outputItems tr').forEach(row => {
        const quantity = parseInt(row.querySelector('.output-allquantity').value) || 0;
        const price = parseInt(row.querySelector('.output-price').value) || 0;
        ac_totalOutputValue += quantity * price;
    });
        // 计算盈亏
        const ac_profitLoss = ac_totalOutputValue - ac_totalCost;
		const ac_profitElement = ac_getElement('profitLoss');
        ac_profitElement.textContent = ac_profitLoss.toLocaleString();
		ac_profitElement.className = 'result-value ' + (ac_profitLoss >= 0 ? 'profit' : 'loss');
        profitMonitor.update(ac_profitLoss,ac_totalCost);
    }
    // 计算单次成本
    function ac_calculateSingleCost() {
        const ac_itemPrice = parseFloat(ac_getElement('itemPrice').value) || 0;
        const ac_catalystCost = parseFloat(ac_getElement('Catalyst').value) || 0;
        const ac_costPerTry = parseFloat(ac_getElement('costPerTry').value) || 0;
        const ac_singleCost = ac_itemPrice + ac_catalystCost + ac_costPerTry;
        ac_getElement('allcostPerTry').value = ac_singleCost;
        // 触发重新计算
        ac_calculateProfit();
    }
    // 初始化事件监听器
    function ac_initEventListeners() {
        // 监听所有相关输入的变化
        const ac_inputsToWatch = [
            'simulateTimes', 'itemPrice', 'Catalyst', 'costPerTry',
            'timePerTry', 'successRate', 'efficiencyRate'
        ];

        ac_inputsToWatch.forEach(id => {
            ac_getElement(id).addEventListener('input', ac_calculateSingleCost);
        });

        // 监听产出物品表格的变化
        document.querySelectorAll('#outputItems .output-price, #outputItems .output-probability').forEach(input => {
            input.addEventListener('input', ac_calculateProfit);
        });

        // 监听开始炼金按钮
        ac_getElement('startBtn').addEventListener('click', ac_simulateAlchemy);
        ac_getElement('startBtnEQ').addEventListener('click', ac_simulateRecursiveAlchemy);
    }

    // 初始化计算器
    function ac_initCalculator() {
        ac_initEventListeners();
        ac_calculateSingleCost(); // 初始计算
        ac_getElement('restart').addEventListener('click', ac_resetResults);
        bindProfitUpdates(); // 初始化时绑定监控
    }
    function ac_resetResults() {
    // 重置所有结果框
    document.querySelectorAll('.result-box .result-value').forEach(el => {
        el.textContent = '0';
        el.className = 'result-value'; // 移除所有颜色类
    });
    // 重置风险等级显示
    const riskElement = ac_getElement('Risk');
    riskElement.textContent = '0';
    riskElement.className = 'result-value';
    // 重置产出表格
    document.querySelectorAll('.output-allquantity, .output-total').forEach(input => {
        input.value = '0';
    });
    // 重置统计计数（可选）
    totalButtonClicks = 0;
    positiveProfitClicks = 0;
    console.log('所有结果已重置');
    // 重置统计和最大盈亏
    totalButtonClicks = 0;
    positiveProfitClicks = 0;
    profitMonitor.reset(); // 调用 profitMonitor.reset() 会触发 bindProfitUpdates()
}

    // 当DOM加载完成后初始化
    document.addEventListener('DOMContentLoaded', ac_initCalculator);

    // 暴露必要的函数到全局
    window.alchemyCalculator = {
        simulateAlchemy: ac_simulateAlchemy,
        simulateUntilTarget: ac_simulateUntilTarget,
        calculateProfit: ac_calculateProfit,
        calculateSingleCost: ac_calculateSingleCost,
        formatTime: ac_formatTime,
        simulateRecursiveAlchemy: ac_simulateRecursiveAlchemy,
        resetResults: ac_resetResults
    };
})();