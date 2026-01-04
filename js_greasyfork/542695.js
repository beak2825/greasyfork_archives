// ==UserScript==
// @name         linuxDo 2048 AI玩家
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Advanced AI with expert strategies and 2-step lookahead
// @match        https://2048.linux.do/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542695/linuxDo%202048%20AI%E7%8E%A9%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/542695/linuxDo%202048%20AI%E7%8E%A9%E5%AE%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 防止密码管理器干扰
    document.addEventListener('keydown', function(e) {
        e.stopImmediatePropagation();
    }, true);

    // ===================================================================================
    // CONFIGURATION
    // ===================================================================================
    const MOVE_INTERVAL = 150;
    const TIMEOUT_FOR_INVALID_MOVE = 500;
    let moveSpeed = MOVE_INTERVAL;
    
    // 高级策略系统
    const strategies = {
        default: {
            weights: [
                [6, 5, 4, 3],
                [5, 4, 3, 2],
                [4, 3, 2, 1],
                [3, 2, 1, 0]
            ],
            emptyWeight: 2.7
        },
        aggressive: {
            weights: [
                [10, 8, 6, 4],
                [8, 6, 4, 2],
                [6, 4, 2, 1],
                [4, 2, 1, 0]
            ],
            emptyWeight: 2.0
        },
        expert: {
            weights: [
                [15, 14, 13, 12],
                [8,  9,  10, 11],
                [7,  6,  5,  4],
                [0,  1,  2,  3]
            ],
            emptyWeight: 4.0
        }
    };
    
    let currentStrategy = 'expert'; // 默认使用专家策略
    let isAiRunning = false;
    let isThinking = false;
    let gameLoopInterval = null;
    
    // 游戏统计
    let gamesPlayed = 0;
    let highestScore = 0;
    let highestTile = 0;

    // ===================================================================================
    // AI CORE: 增强版移动模拟和评估
    // ===================================================================================
    function simulateMove(board, direction) {
        let moved = false;
        const tempBoard = JSON.parse(JSON.stringify(board));

        function slide(row) {
            const arr = row.filter(val => val);
            const missing = 4 - arr.length;
            const zeros = Array(missing).fill(0);
            return arr.concat(zeros);
        }

        function combine(row) {
            for (let i = 0; i < 3; i++) {
                if (row[i] !== 0 && row[i] === row[i + 1]) {
                    row[i] *= 2;
                    row[i + 1] = 0;
                    moved = true;
                }
            }
            return row;
        }

        function operate(row) {
            row = slide(row);
            row = combine(row);
            return slide(row);
        }

        // 优化方向处理
        switch (direction) {
            case 'left':
                for (let r = 0; r < 4; r++) tempBoard[r] = operate(tempBoard[r]);
                break;
            case 'right':
                for (let r = 0; r < 4; r++) tempBoard[r] = operate(tempBoard[r].reverse()).reverse();
                break;
            case 'up':
                for (let c = 0; c < 4; c++) {
                    const column = [
                        tempBoard[0][c],
                        tempBoard[1][c],
                        tempBoard[2][c],
                        tempBoard[3][c]
                    ];
                    const newColumn = operate(column);
                    for (let r = 0; r < 4; r++) {
                        tempBoard[r][c] = newColumn[r];
                    }
                }
                break;
            case 'down':
                for (let c = 0; c < 4; c++) {
                    const column = [
                        tempBoard[3][c],
                        tempBoard[2][c],
                        tempBoard[1][c],
                        tempBoard[0][c]
                    ];
                    const newColumn = operate(column).reverse();
                    for (let r = 0; r < 4; r++) {
                        tempBoard[r][c] = newColumn[r];
                    }
                }
                break;
        }

        if (JSON.stringify(board) !== JSON.stringify(tempBoard)) {
            moved = true;
            Object.assign(board, tempBoard);
        }
        return moved;
    }

    // 增强版评估函数（加入2步前瞻）
    function enhancedEvaluate(b) {
        const strategy = strategies[currentStrategy];
        let score = 0;
        let emptyCount = 0;
        let smoothness = 0;
        let monotonicity = 0;
        let maxTile = 0;
        let mergePossible = 0;

        // 基本评估
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (b[r][c] === 0) {
                    emptyCount++;
                } else {
                    const tileValue = b[r][c];
                    if (tileValue > maxTile) maxTile = tileValue;
                    score += Math.log2(tileValue) * strategy.weights[r][c];
                    
                    // 平滑度评估
                    if (c < 3 && b[r][c+1] !== 0) {
                        const diff = Math.abs(Math.log2(tileValue) - Math.log2(b[r][c+1]));
                        smoothness -= diff;
                        if (diff === 0) mergePossible++;
                    }
                    if (r < 3 && b[r+1][c] !== 0) {
                        const diff = Math.abs(Math.log2(tileValue) - Math.log2(b[r+1][c]));
                        smoothness -= diff;
                        if (diff === 0) mergePossible++;
                    }
                }
            }
        }
        
        // 单调性评估（专业技巧）
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) {
                const current = b[r][c] || 0;
                const next = b[r][c+1] || 0;
                if (current > next) monotonicity++;
            }
        }
        
        // 两步骤前瞻（模拟下一步可能的最佳移动）
        let futureBonus = 0;
        if (emptyCount > 0) {
            const directions = ['left', 'right', 'up', 'down'];
            for (const dir of directions) {
                const simBoard = JSON.parse(JSON.stringify(b));
                if (simulateMove(simBoard, dir)) {
                    // 评估移动后的空格数
                    let newEmpties = 0;
                    for (let r = 0; r < 4; r++) {
                        for (let c = 0; c < 4; c++) {
                            if (simBoard[r][c] === 0) newEmpties++;
                        }
                    }
                    futureBonus += newEmpties * 0.5;
                }
            }
        }
        
        // 最终评分公式（专业调整）
        return score + 
               smoothness * 1.5 + 
               emptyCount * strategy.emptyWeight + 
               mergePossible * 3.0 + 
               monotonicity * 0.8 +
               futureBonus;
    }

    function getNextMove(board) {
        const directions = {up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown', left: 'ArrowLeft'};
        let bestScore = -Infinity;
        let bestDirection = 'ArrowRight';

        for (const dirKey in directions) {
            const simBoard = JSON.parse(JSON.stringify(board));
            if (simulateMove(simBoard, dirKey)) {
                const moveScore = enhancedEvaluate(simBoard);
                if (moveScore > bestScore) {
                    bestScore = moveScore;
                    bestDirection = directions[dirKey];
                }
            }
        }
        return bestDirection;
    }

    // =====================================================================
    // EXECUTION ENGINE
    // =====================================================================
    async function attemptMove(direction) {
        const stateBefore = JSON.stringify(window.canvasGame.board);
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: direction, bubbles: true }));
        return new Promise(resolve => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                if (JSON.stringify(window.canvasGame.board) !== stateBefore) {
                    clearInterval(checkInterval);
                    resolve(true);
                } else if (Date.now() - startTime > TIMEOUT_FOR_INVALID_MOVE) {
                    clearInterval(checkInterval);
                    resolve(false);
                }
            }, 50);
        });
    }

    async function executeThinkCycle() {
        if (isThinking || !isAiRunning) return;
        
        // 游戏结束检测
        if (window.canvasGame.gameOver || (window.canvasGame.victory && !window.canvasGame.keepPlaying)) {
            console.log("🎉 游戏结束! 最终得分: " + window.canvasGame.score);
            console.log("最大方块: " + window.canvasGame.maxTile);
            
            // 更新统计
            gamesPlayed++;
            if (window.canvasGame.score > highestScore) {
                highestScore = window.canvasGame.score;
            }
            if (window.canvasGame.maxTile > highestTile) {
                highestTile = window.canvasGame.maxTile;
            }
            
            // 停止AI
            isAiRunning = false;
            clearInterval(gameLoopInterval);
            
            // 更新UI
            const autoPlayBtn = document.getElementById('auto-play-btn');
            if (autoPlayBtn) {
                autoPlayBtn.disabled = false;
                autoPlayBtn.style.backgroundColor = '#27ae60';
                autoPlayBtn.textContent = 'AI自动游戏';
                autoPlayBtn.title = `游戏次数: ${gamesPlayed} | 最高分: ${highestScore} | 最大方块: ${highestTile}`;
            }
            
            return;
        }

        isThinking = true;

        try {
            const board = window.canvasGame.board;
            const bestMove = getNextMove(board);
            
            if (!await attemptMove(bestMove)) {
                console.warn(`最佳移动 ${bestMove} 无效，尝试备选方案...`);
                const fallbackMoves = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].filter(m => m !== bestMove);
                for(const move of fallbackMoves) {
                    if (await attemptMove(move)) break;
                }
            }
        } catch (e) {
            console.error("AI执行错误:", e);
        } finally {
            isThinking = false;
        }
    }
    
    // =====================================================================
    // UI 控制面板
    // =====================================================================
    function addControlPanel() {
        if (document.getElementById('ai-control-panel')) return;
        const gameControls = document.querySelector('.game-controls');
        if (!gameControls) { 
            setTimeout(addControlPanel, 500); 
            return; 
        };
        
        // 创建面板
        const panel = document.createElement('div');
        panel.id = 'ai-control-panel';
        panel.style.display = 'flex';
        panel.style.gap = '10px';
        panel.style.marginTop = '15px';
        panel.style.flexWrap = 'wrap';
        
        // 自动游戏按钮
        const autoPlayBtn = document.createElement('button');
        autoPlayBtn.id = 'auto-play-btn';
        autoPlayBtn.className = 'new-game-btn';
        autoPlayBtn.style.backgroundColor = '#27ae60';
        autoPlayBtn.textContent = 'AI自动游戏';
        autoPlayBtn.title = `游戏次数: 0 | 最高分: 0 | 最大方块: 0`;
        
        autoPlayBtn.onclick = function() {
            if (!isAiRunning) {
                if (window.canvasGame.gameOver || window.canvasGame.victory) {
                    alert("游戏已结束! 请先开始新游戏");
                    return;
                }

                isAiRunning = true;
                this.disabled = true;
                this.style.backgroundColor = '#7f8c8d';
                this.textContent = 'AI运行中...';
                gameLoopInterval = setInterval(executeThinkCycle, moveSpeed);
            }
        };
        
        // 速度控制
        const speedContainer = document.createElement('div');
        speedContainer.style.display = 'flex';
        speedContainer.style.alignItems = 'center';
        speedContainer.style.gap = '5px';
        
        const speedLabel = document.createElement('span');
        speedLabel.textContent = '速度:';
        
        const speedSlider = document.createElement('input');
        speedSlider.type = 'range';
        speedSlider.min = '50';
        speedSlider.max = '500';
        speedSlider.value = moveSpeed;
        speedSlider.style.width = '100px';
        
        speedSlider.oninput = function() {
            moveSpeed = parseInt(this.value);
            if (isAiRunning) {
                clearInterval(gameLoopInterval);
                gameLoopInterval = setInterval(executeThinkCycle, moveSpeed);
            }
        };
        
        speedContainer.appendChild(speedLabel);
        speedContainer.appendChild(speedSlider);
        
        // 策略选择
        const strategyContainer = document.createElement('div');
        strategyContainer.style.display = 'flex';
        strategyContainer.style.alignItems = 'center';
        strategyContainer.style.gap = '5px';
        
        const strategyLabel = document.createElement('span');
        strategyLabel.textContent = '策略:';
        
        const strategySelect = document.createElement('select');
        for (const strategy in strategies) {
            const option = document.createElement('option');
            option.value = strategy;
            option.textContent = strategy.charAt(0).toUpperCase() + strategy.slice(1);
            strategySelect.appendChild(option);
        }
        strategySelect.value = currentStrategy;
        
        strategySelect.onchange = function() {
            currentStrategy = this.value;
        };
        
        strategyContainer.appendChild(strategyLabel);
        strategyContainer.appendChild(strategySelect);
        
        // 统计显示
        const statsDisplay = document.createElement('div');
        statsDisplay.id = 'ai-stats';
        statsDisplay.style.marginLeft = '15px';
        statsDisplay.style.color = '#776e65';
        statsDisplay.textContent = '游戏次数: 0 | 最高分: 0 | 最大方块: 0';
        
        // 组装面板
        panel.appendChild(autoPlayBtn);
        panel.appendChild(speedContainer);
        panel.appendChild(strategyContainer);
        gameControls.appendChild(panel);
        gameControls.appendChild(statsDisplay);
    }

    // 初始化
    console.log('2048 Ultimate AI initialized');
    setTimeout(addControlPanel, 1000);
})();