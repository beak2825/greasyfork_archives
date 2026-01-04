// ==UserScript==
// @name         北邮教务评教自动选择器
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动选择评教选项以达到目标分数
// @author       YouXam
// @match        https://jwgl.bupt.edu.cn/jsxsd/xspj/xspj_edit.do*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540340/%E5%8C%97%E9%82%AE%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540340/%E5%8C%97%E9%82%AE%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加控制面板样式
    const style = document.createElement('style');
    style.textContent = `
        #auto-eval-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            width: 320px;
        }
        #auto-eval-panel h3 {
            margin: 0 0 20px 0;
            color: #1a1a1a;
            font-size: 18px;
            font-weight: 600;
            text-align: center;
        }
        #auto-eval-panel .input-group {
            margin-bottom: 16px;
        }
        #auto-eval-panel label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #4a4a4a;
            font-size: 14px;
        }
        #auto-eval-panel input[type="number"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #d0d0d0;
            border-radius: 8px;
            box-sizing: border-box;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        #auto-eval-panel input[type="number"]:focus {
            outline: none;
            border-color: #007cba;
        }
        #auto-eval-panel .button-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 16px;
        }
        #auto-eval-panel button {
            background: #007cba;
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
        }
        #auto-eval-panel button:hover {
            background: #005a8b;
        }
        #auto-eval-panel .info {
            font-size: 13px;
            color: #666;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 12px;
            line-height: 1.4;
        }
        #auto-eval-panel .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        #auto-eval-panel .close-btn {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #999;
            padding: 4px;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #auto-eval-panel .close-btn:hover {
            background: #f0f0f0;
        }
        #auto-eval-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007cba;
            color: white;
            border: none;
            border-radius: 50%;
            width: 64px;
            height: 64px;
            cursor: pointer;
            z-index: 10001;
            font-size: 13px;
            font-weight: 600;
            display: none;
            box-shadow: 0 4px 20px rgba(0,124,186,0.3);
            transition: transform 0.2s;
        }
        #auto-eval-toggle:hover {
            transform: scale(1.05);
        }
    `;
    document.head.appendChild(style);

    // 创建最小化切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'auto-eval-toggle';
    toggleBtn.innerHTML = '0';
    toggleBtn.title = '当前分数 - 点击打开评教自动选择器';
    toggleBtn.onclick = function() {
        showPanel();
    };
    document.body.appendChild(toggleBtn);

    // 创建控制面板
    const panel = document.createElement('div');
    panel.id = 'auto-eval-panel';
    panel.innerHTML = `
        <button class="close-btn" onclick="hidePanel()">&times;</button>
        <h3>评教自动选择器</h3>
        <div class="input-group">
            <label for="target-score">目标分数</label>
            <input type="number" id="target-score" min="0" max="100" step="0.1" placeholder="输入目标分数">
        </div>
        <div class="button-group">
            <button onclick="autoSelectEvaluation()">智能选择</button>
            <button onclick="clearSelections()">清除选择</button>
        </div>
        <div class="info">
            <div class="info-row">
                <span>当前总分:</span>
                <span id="current-score">0</span>
            </div>
            <div class="info-row">
                <span>分数范围:</span>
                <span><span id="min-score">0</span> - <span id="max-score">0</span></span>
            </div>
            <div class="info-row">
                <span>评价项目:</span>
                <span id="item-count">0</span>
            </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 获取所有评价项目信息
    function getEvaluationItems() {
        const items = [];
        const pj06xhInputs = document.querySelectorAll('input[name="pj06xh"]');

        pj06xhInputs.forEach(input => {
            const itemId = input.value;
            const radioButtons = document.querySelectorAll(`input[name="pj0601id_${itemId}"]`);
            const options = [];

            radioButtons.forEach(radio => {
                const scoreInput = document.querySelector(`input[name="pj0601fz_${itemId}_${radio.value}"]`);
                if (scoreInput) {
                    options.push({
                        radio: radio,
                        score: parseFloat(scoreInput.value),
                        value: radio.value
                    });
                }
            });

            // 按分数从高到低排序
            options.sort((a, b) => b.score - a.score);

            if (options.length > 0) {
                items.push({
                    id: itemId,
                    options: options,
                    maxScore: options[0].score,
                    minScore: options[options.length - 1].score
                });
            }
        });

        return items;
    }

    // 更新悬浮球显示的分数
    function updateToggleButtonScore(score) {
        const toggleBtn = document.getElementById('auto-eval-toggle');
        if (toggleBtn) {
            let displayScore;
            if (score === 0) {
                displayScore = '0';
            } else if (score < 100) {
                displayScore = score.toFixed(1);
            } else {
                displayScore = Math.round(score).toString();
            }

            // 创建更美观的显示格式
            toggleBtn.innerHTML = `
                <div style="font-size: 16px; font-weight: bold; margin-bottom: -2px;">${displayScore}</div>
                <div style="font-size: 8px; opacity: 0.8;">分</div>
            `;
            toggleBtn.title = `当前分数: ${score.toFixed(2)} - 点击打开评教自动选择器`;
        }
    }

    // 计算当前总分
    function calculateCurrentScore() {
        const items = getEvaluationItems();
        let totalScore = 0;

        items.forEach(item => {
            const selectedOption = item.options.find(opt => opt.radio.checked);
            if (selectedOption) {
                totalScore += selectedOption.score;
            }
        });

        document.getElementById('current-score').textContent = totalScore.toFixed(2);
        updateToggleButtonScore(totalScore);
        return totalScore;
    }

    // 计算最高可能分数
    function calculateMaxScore() {
        const items = getEvaluationItems();
        const maxScore = items.reduce((sum, item) => sum + item.maxScore, 0);
        const minScore = items.reduce((sum, item) => sum + item.minScore, 0);
        document.getElementById('max-score').textContent = maxScore.toFixed(2);
        document.getElementById('min-score').textContent = minScore.toFixed(2);
        document.getElementById('item-count').textContent = items.length;
        return maxScore;
    }



    // 智能选择评价选项 - 优化分布均匀性
    function autoSelectEvaluation() {
        const targetScore = parseFloat(document.getElementById('target-score').value);
        if (isNaN(targetScore)) {
            alert('请输入有效的目标分数！');
            return;
        }

        const items = getEvaluationItems();
        const maxPossibleScore = items.reduce((sum, item) => sum + item.maxScore, 0);
        const minPossibleScore = items.reduce((sum, item) => sum + item.minScore, 0);

        if (targetScore > maxPossibleScore) {
            alert(`目标分数 ${targetScore} 超过最高可能分数 ${maxPossibleScore.toFixed(2)}！`);
            return;
        }

        if (targetScore < minPossibleScore) {
            alert(`目标分数 ${targetScore} 低于最低可能分数 ${minPossibleScore.toFixed(2)}！`);
            return;
        }

        clearSelections();

        // 使用优化的均匀分布算法
        const bestCombination = findBalancedCombination(items, targetScore);

        if (bestCombination) {
            // 应用选择
            bestCombination.forEach((optionIndex, itemIndex) => {
                const item = items[itemIndex];
                const option = item.options[optionIndex];
                option.radio.checked = true;
            });

            if (typeof jsfs === 'function') {
                jsfs();
            }

            calculateCurrentScore();
        } else {
            alert('无法找到合适的选项组合！');
        }
    }

    // 寻找均匀分布的最佳组合
    function findBalancedCombination(items, targetScore) {
        if (items.length === 0) return [];

        // 直接使用基于等级的算法，适用于所有情况
        return findBalancedCombinationGreedy(items, targetScore);
    }

    // 改进的均匀分布算法：精确性 + 均匀性
    function findBalancedCombinationGreedy(items, targetScore) {
        const totalMaxScore = items.reduce((sum, item) => sum + Math.max(...item.options.map(opt => opt.score)), 0);
        const totalMinScore = items.reduce((sum, item) => sum + Math.min(...item.options.map(opt => opt.score)), 0);

        // 如果目标分数超出范围，直接返回边界值
        if (targetScore >= totalMaxScore) {
            return items.map(() => 0); // 全选最高分
        }
        if (targetScore <= totalMinScore) {
            return items.map(item => item.options.length - 1); // 全选最低分
        }

        // 尝试所有可能的基础等级组合
        const bestCombinations = [];

        // 尝试所有题目选择相同等级的组合
        for (let baseLevel = 0; baseLevel < 5; baseLevel++) {
            const baseCombination = items.map(item => Math.min(baseLevel, item.options.length - 1));
            const baseScore = baseCombination.reduce((sum, level, i) => sum + items[i].options[level].score, 0);

            bestCombinations.push({
                combination: [...baseCombination],
                score: baseScore,
                uniformity: 0 // 完全均匀
            });

            // 在基础等级上进行更多调整以提高精确性
            for (let adjustments = 1; adjustments <= 5; adjustments++) {
                const adjustedCombinations = generateAdjustedCombinations(items, baseCombination, adjustments, targetScore);
                bestCombinations.push(...adjustedCombinations);
            }
        }

        // 选择最接近目标分数且均匀性最好的组合
        let bestCombination = null;
        let bestScore = Infinity;
        let bestUniformity = Infinity;

        bestCombinations.forEach(({ combination, score, uniformity }) => {
            const scoreDiff = Math.abs(score - targetScore);

            // 优先选择分数更接近的，只有在分数完全相同时才考虑均匀性
            if (scoreDiff < bestScore ||
                (scoreDiff === bestScore && uniformity < bestUniformity)) {
                bestScore = scoreDiff;
                bestUniformity = uniformity;
                bestCombination = combination;
            }
        });

        return bestCombination || items.map(() => 0);
    }

    // 生成调整后的组合
    function generateAdjustedCombinations(items, baseCombination, maxAdjustments, targetScore) {
        const combinations = [];
        const baseScore = baseCombination.reduce((sum, level, i) => sum + items[i].options[level].score, 0);
        const scoreDiff = targetScore - baseScore;

        // 生成所有可能的调整组合
        function generateAdjustments(itemIndex, currentCombination, adjustmentsLeft, currentScore) {
            if (adjustmentsLeft === 0 || itemIndex >= items.length) {
                if (adjustmentsLeft === 0) {
                    const uniformity = calculateVariance(currentCombination, currentCombination.reduce((a,b) => a+b)/currentCombination.length);
                    combinations.push({
                        combination: [...currentCombination],
                        score: currentScore,
                        uniformity: uniformity
                    });
                }
                return;
            }

            // 不调整当前项目
            generateAdjustments(itemIndex + 1, currentCombination, adjustmentsLeft, currentScore);

            // 调整当前项目
            const currentLevel = currentCombination[itemIndex];
            const item = items[itemIndex];

            // 尝试向上或向下调整一级
            [-1, 1].forEach(direction => {
                const newLevel = currentLevel + direction;
                if (newLevel >= 0 && newLevel < item.options.length) {
                    const scoreChange = item.options[newLevel].score - item.options[currentLevel].score;

                                    // 允许所有方向的调整，优先考虑分数精确性
                currentCombination[itemIndex] = newLevel;
                generateAdjustments(itemIndex + 1, currentCombination, adjustmentsLeft - 1, currentScore + scoreChange);
                currentCombination[itemIndex] = currentLevel; // 恢复
                }
            });
        }

        generateAdjustments(0, [...baseCombination], maxAdjustments, baseScore);
        return combinations;
    }

    // 计算方差（衡量分布均匀性）
    function calculateVariance(scores, average) {
        const squaredDiffs = scores.map(score => Math.pow(score - average, 2));
        return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
    }

    // 清除所有选择
    function clearSelections() {
        const items = getEvaluationItems();
        items.forEach(item => {
            item.options.forEach(option => {
                option.radio.checked = false;
            });
        });
        calculateCurrentScore();
    }

    // 自动选择主观评语（选择正面评价）
    function autoSelectSubjectiveComments() {
        const zgpyCheckboxes = document.querySelectorAll('input[name="zgpyids"]');
        const positiveKeywords = ['认真负责', '有耐心', '教学水平高', '调动积极性', '思路清晰', '治学严谨', '案例丰富', '内容充实', '理论实际结合', '氛围轻松'];

        // 清除所有现有选择
        zgpyCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // 选择正面评价
        let selectedCount = 0;
        zgpyCheckboxes.forEach(checkbox => {
            const label = checkbox.parentElement.textContent.trim();
            const isPositive = positiveKeywords.some(keyword => label.includes(keyword));
            if (isPositive && selectedCount < 3) { // 最多选择3个正面评价
                checkbox.checked = true;
                selectedCount++;
            }
        });

        // 如果没有找到正面评价，至少选择第一个
        if (selectedCount === 0 && zgpyCheckboxes.length > 0) {
            zgpyCheckboxes[0].checked = true;
        }

        console.log(`已自动选择 ${selectedCount} 个主观评语指标`);
    }

    // 清除主观评语选择
    function clearSubjectiveComments() {
        const zgpyCheckboxes = document.querySelectorAll('input[name="zgpyids"]');
        zgpyCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        console.log('已清除所有主观评语选择');
    }

    // 自动填写建议内容
    function autoFillSuggestions() {
        const jynrTextareas = document.querySelectorAll('textarea[name="jynr"]');
        let filledCount = 0;

        jynrTextareas.forEach((textarea, index) => {
            if (!textarea.value || textarea.value.trim() === '') {
                // 根据文本框的上下文确定填写内容
                const parentText = textarea.closest('tr')?.textContent || '';

                textarea.value = '没有什么想说的';
                filledCount++;
            }
        });

        console.log(`已自动填写 ${filledCount} 个建议文本框`);
        if (filledCount > 0) {
            alert(`已自动填写 ${filledCount} 个建议内容`);
        } else {
            alert('所有建议内容已填写，无需自动填写');
        }
    }

    // 清除建议内容
    function clearSuggestions() {
        const jynrTextareas = document.querySelectorAll('textarea[name="jynr"]');
        let clearedCount = 0;

        jynrTextareas.forEach(textarea => {
            if (textarea.value && textarea.value.trim() !== '') {
                textarea.value = '';
                clearedCount++;
            }
        });

        console.log(`已清除 ${clearedCount} 个建议文本框`);
        if (clearedCount > 0) {
            alert(`已清除 ${clearedCount} 个建议内容`);
        } else {
            alert('建议内容已为空，无需清除');
        }
    }

    // 显示控制面板
    function showPanel() {
        document.getElementById('auto-eval-panel').style.display = 'block';
        document.getElementById('auto-eval-toggle').style.display = 'none';
        // 保存状态到本地存储
        localStorage.setItem('evalPanelVisible', 'true');
    }

    // 隐藏控制面板
    function hidePanel() {
        document.getElementById('auto-eval-panel').style.display = 'none';
        const toggleBtn = document.getElementById('auto-eval-toggle');
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.flexDirection = 'column';
        // 保存状态到本地存储
        localStorage.setItem('evalPanelVisible', 'false');
    }
    hidePanel();

    // 恢复面板状态
    function restorePanelState() {
        const isVisible = localStorage.getItem('evalPanelVisible');
        // 只有明确设置为隐藏时才隐藏，否则默认显示
        if (isVisible === 'false') {
            hidePanel();
        }
        // 默认情况下面板是显示的，不需要调用showPanel()

        // 恢复上次输入的目标分数
        const lastTargetScore = localStorage.getItem('evalTargetScore');
        if (lastTargetScore) {
            document.getElementById('target-score').value = lastTargetScore;
        }
    }

    // 保存目标分数
    function saveTargetScore() {
        const targetScore = document.getElementById('target-score').value;
        if (targetScore) {
            localStorage.setItem('evalTargetScore', targetScore);
        }
    }

    // 将函数添加到全局作用域
    window.autoSelectEvaluation = autoSelectEvaluation;
    window.clearSelections = clearSelections;
    window.autoSelectSubjectiveComments = autoSelectSubjectiveComments;
    window.clearSubjectiveComments = clearSubjectiveComments;
    window.autoFillSuggestions = autoFillSuggestions;
    window.clearSuggestions = clearSuggestions;
    window.showPanel = showPanel;
    window.hidePanel = hidePanel;

    // 初始化显示
    setTimeout(() => {
        calculateMaxScore();
        calculateCurrentScore();
        restorePanelState();
    }, 1000);

    // 监听目标分数输入变化
    document.addEventListener('input', function(e) {
        if (e.target.id === 'target-score') {
            saveTargetScore();
        }
    });

    // 监听选择变化
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio' && e.target.name.startsWith('pj0601id_')) {
            setTimeout(calculateCurrentScore, 100);
        }
    });

    // 键盘快捷键支持
    document.addEventListener('keydown', function(e) {
        // Ctrl + E 切换面板显示/隐藏
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            const panel = document.getElementById('auto-eval-panel');
            if (panel.style.display === 'none') {
                showPanel();
            } else {
                hidePanel();
            }
        }
    });

    // 禁用各种检查限制
    function disableSameOptionCheck() {
        // 方法1: 设置isxtjg为0来禁用相同选项检查
        const isxtjgInput = document.getElementById('isxtjg');
        if (isxtjgInput) {
            isxtjgInput.value = '0';
            console.log('已禁用相同选项检查限制');
        }

        // 方法2: 重写原始的saveData函数来绕过所有限制
        if (typeof window.saveData === 'function') {
            const originalSaveData = window.saveData;
            window.saveData = function(obj, status) {
                // 临时禁用相同选项检查
                const isxtjgInput = document.getElementById('isxtjg');
                const originalValue = isxtjgInput ? isxtjgInput.value : null;

                if (isxtjgInput) {
                    isxtjgInput.value = '0';
                }

                // 临时自动选择一个主观评语指标以绕过必选检查
                const zgpyCheckboxes = document.querySelectorAll('input[name="zgpyids"]');
                const checkedZgpy = [];
                zgpyCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        checkedZgpy.push(checkbox);
                    }
                });

                // 如果没有选择任何主观评语，自动选择第一个
                let autoSelectedZgpy = null;
                if (checkedZgpy.length === 0 && zgpyCheckboxes.length > 0) {
                    autoSelectedZgpy = zgpyCheckboxes[0];
                    autoSelectedZgpy.checked = true;
                    console.log('自动选择了第一个主观评语指标以绕过必选限制');
                }

                // 处理建议必填限制
                const jynrTextareas = document.querySelectorAll('textarea[name="jynr"]');
                const autoFilledTextareas = [];

                jynrTextareas.forEach(textarea => {
                    if (!textarea.value || textarea.value.trim() === '') {
                        textarea.value = '没有什么想说的';
                        autoFilledTextareas.push(textarea);
                        console.log('自动填写了建议内容以绕过必填限制');
                    }
                });

                try {
                    return originalSaveData.call(this, obj, status);
                } finally {
                    // 保持为0，不恢复原值，这样就永久禁用了检查
                    if (isxtjgInput && originalValue !== null) {
                        // 不恢复原值，保持禁用状态
                    }

                    // 恢复主观评语的原始状态（如果是自动选择的话）
                    if (autoSelectedZgpy && checkedZgpy.length === 0) {
                        // 可以选择保持选中状态，或者取消选中
                        // autoSelectedZgpy.checked = false;
                    }

                    // 恢复建议内容的原始状态（如果是自动填写的话）
                    autoFilledTextareas.forEach(textarea => {
                        // 可以选择保持填写状态，或者清空内容
                        // textarea.value = '';
                    });
                }
            };
        }

        // 方法3: 直接修改页面中的JavaScript代码逻辑
        try {
            // 查找并替换页面中的限制代码
            const scripts = document.getElementsByTagName('script');
            for (let script of scripts) {
                if (script.innerHTML && script.innerHTML.includes('请不要选相同一项')) {
                    // 替换限制逻辑
                    script.innerHTML = script.innerHTML.replace(
                        /if\(flag&&isxtjg=="1"\)\s*{\s*alert\("请不要选相同一项！"\);\s*return false;\s*}/g,
                        '// 已禁用相同选项检查限制'
                    );
                    console.log('已修改页面JavaScript代码，移除相同选项限制');
                    break;
                }
            }
        } catch (e) {
            console.log('无法直接修改页面代码，使用其他方法');
        }
    }

    // 拦截并阻止限制相关的alert弹窗
    function interceptAlert() {
        const originalAlert = window.alert;
        window.alert = function(message) {
            if (typeof message === 'string') {
                // 阻止相同选项限制弹窗
                if (message.includes('请不要选相同一项')) {
                    console.log('已拦截相同选项限制弹窗:', message);
                    return;
                }
                // 阻止主观评语必选限制弹窗
                if (message.includes('请选择主观评语指标')) {
                    console.log('已拦截主观评语必选限制弹窗:', message);
                    return;
                }
                // 阻止建议必填限制弹窗
                if (message.includes('分以下请填写意见建议') || message.includes('学生建议不能为空')) {
                    console.log('已拦截建议必填限制弹窗:', message);
                    return;
                }
            }
            return originalAlert.call(this, message);
        };
    }


    // 页面加载完成后禁用限制
    setTimeout(() => {
        disableSameOptionCheck();
        interceptAlert();
        console.log('所有评教限制已完全禁用');
    }, 500);

    // 持续监控并禁用限制
    setInterval(() => {
        const isxtjgInput = document.getElementById('isxtjg');
        if (isxtjgInput && isxtjgInput.value !== '0') {
            isxtjgInput.value = '0';
        }
    }, 1000);

    console.log('评教自动选择器已加载');
})();