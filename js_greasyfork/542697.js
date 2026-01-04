// ==UserScript==
// @name         linuxDo 2048 AI玩家 Plus
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  专为2048.linux.do设计的高性能AI
// @author       littleleo
// @match        https://2048.linux.do/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542697/linuxDo%202048%20AI%E7%8E%A9%E5%AE%B6%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/542697/linuxDo%202048%20AI%E7%8E%A9%E5%AE%B6%20Plus.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // ======================== 核心配置 ========================
    const AI_VERSION = "v2.0";
    const TARGET_SCORE = 250000;
    let moveSpeed = 100; // 默认移动延迟(ms)
    
    // ======================== AI状态变量 ========================
    let isAiRunning = false;
    let isThinking = false;
    let gameLoopInterval = null;
    let gamesPlayed = 0;
    let highestScore = 0;
    let highestTile = 0;

    // ======================== 核心AI算法 ========================
    function simulateMove(board, direction) {
        const tempBoard = JSON.parse(JSON.stringify(board));
        let moved = false;

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
            const originalJson = JSON.stringify(row);
            let newRow = slide(row);
            newRow = combine(newRow);
            newRow = slide(newRow);
            return newRow;
        }

        switch (direction) {
            case 'left':
                for (let r = 0; r < 4; r++) {
                    tempBoard[r] = operate(tempBoard[r]);
                }
                break;
            case 'right':
                for (let r = 0; r < 4; r++) {
                    tempBoard[r] = operate(tempBoard[r].reverse()).reverse();
                }
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

    function getGameStage(board) {
        let maxTile = 0;
        let emptyCells = 0;
        
        for (let r = 0; r < 4; r++) { 
            for (let c = 0; c < 4; c++) { 
                if (board[r][c] > maxTile) maxTile = board[r][c]; 
                if (board[r][c] === 0) emptyCells++; 
            } 
        }
        
        if (emptyCells <= 3) return 'survival';
        if (maxTile >= 8192) return 'endgame';
        if (maxTile >= 2048) return 'late';
        if (maxTile >= 512) return 'middle';
        return 'early';
    }

    function evaluateByStage(b) {
        const stage = getGameStage(b);
        let score = 0;
        let emptyCount = 0, smoothness = 0, maxTile = 0;
        let potentialMerges = 0;
        const weights = [[15, 14, 13, 12], [8, 9, 10, 11], [7, 6, 5, 4], [0, 1, 2, 3]];

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                const tileValue = b[r][c];
                if (tileValue === 0) {
                    emptyCount++;
                } else {
                    if (tileValue > maxTile) maxTile = tileValue;
                    score += Math.log2(tileValue) * weights[r][c];
                    
                    // 检查右侧
                    if (c < 3) { 
                        const rightVal = b[r][c+1]; 
                        if (rightVal !== 0) { 
                            if (rightVal === tileValue) potentialMerges++; 
                            smoothness -= Math.abs(Math.log2(tileValue) - Math.log2(rightVal)); 
                        } 
                    }
                    
                    // 检查下方
                    if (r < 3) { 
                        const downVal = b[r+1][c]; 
                        if (downVal !== 0) { 
                            if (downVal === tileValue) potentialMerges++; 
                            smoothness -= Math.abs(Math.log2(tileValue) - Math.log2(downVal)); 
                        } 
                    }
                }
            }
        }
        
        // 阶段特定策略
        switch (stage) {
            case 'survival': 
                score += emptyCount * 20 + potentialMerges * 10; 
                break;
            case 'endgame': 
            case 'late': 
                score += emptyCount * 5 + smoothness * 2.0; 
                break;
            case 'middle': 
                score += emptyCount * 3.0 + smoothness * 1.5; 
                break;
            case 'early': 
                score += emptyCount * 2.0 + smoothness * 1.0; 
                break;
        }
        
        return score;
    }

    function getNextMove(board) {
        const directions = { up: 'ArrowUp', right: 'ArrowRight', down: 'ArrowDown', left: 'ArrowLeft' };
        let bestScore = -Infinity;
        let bestDirection = 'ArrowRight';

        for (const dirKey in directions) {
            const simBoard = JSON.parse(JSON.stringify(board));
            if (simulateMove(simBoard, dirKey)) {
                const moveScore = evaluateByStage(simBoard);
                if (moveScore > bestScore) {
                    bestScore = moveScore;
                    bestDirection = directions[dirKey];
                }
            }
        }

        return bestDirection;
    }

    // ======================== 游戏执行引擎 ========================
    async function attemptMove(direction) {
        const stateBefore = JSON.stringify(window.canvasGame.board);
        document.body.dispatchEvent(new KeyboardEvent('keydown', { key: direction, bubbles: true }));
        
        return new Promise(resolve => {
            const startTime = Date.now();
            const checkInterval = setInterval(() => {
                // 检测棋盘是否发生变化
                if (JSON.stringify(window.canvasGame.board) !== stateBefore) {
                    clearInterval(checkInterval);
                    resolve(true);
                } 
                // 超时处理（500ms无变化认为移动失败）
                else if (Date.now() - startTime > 500) {
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
            endGame();
            return;
        }

        isThinking = true;

        try {
            const board = window.canvasGame.board;
            const bestMove = getNextMove(board);
            
            if (!await attemptMove(bestMove)) {
                // 备用移动方案
                const fallbackMoves = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'];
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
    
    function endGame() {
        if (!isAiRunning) return;
        
        const score = window.canvasGame.score;
        const maxTile = window.canvasGame.maxTile;
        
        // 更新统计
        gamesPlayed++;
        if (score > highestScore) highestScore = score;
        if (maxTile > highestTile) highestTile = maxTile;
        
        updateStatsUI();
        
        // 停止AI
        isAiRunning = false;
        clearInterval(gameLoopInterval);
        
        // 更新按钮状态
        const button = document.getElementById('auto-play-btn');
        if (button) {
            button.disabled = false;
            button.style.backgroundColor = '#27ae60';
            button.textContent = '▶ 启动AI';
        }
        
        console.log("游戏结束! 得分: " + score);
    }

    // ======================== 用户界面与控制 ========================
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'ai-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.95);
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-width: 250px;
            border: 1px solid #ddd;
        `;
        
        panel.innerHTML = `
            <h3 style="margin-top:0; color: #776e65; border-bottom: 1px solid #eee; padding-bottom: 10px;">2048 AI ${AI_VERSION}</h3>
            <div style="margin-bottom:15px;">
                <button id="auto-play-btn" style="padding:10px 15px; width:100%; background:#27ae60; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold; font-size:16px;">
                    ▶ 启动AI
                </button>
            </div>
            <div id="ai-stats" style="font-size:14px; line-height:1.8; margin-bottom:15px; background:#f9f9f9; padding:10px; border-radius:5px;">
                <div>游戏次数: <span id="games-count" style="float:right;">0</span></div>
                <div>最高分数: <span id="high-score" style="float:right;">0</span></div>
                <div>最大方块: <span id="max-tile" style="float:right;">0</span></div>
                <div style="font-weight:bold;">目标进度: <span id="target-progress" style="float:right; color:#e74c3c;">0%</span></div>
            </div>
            <div>
                <label style="display:block; margin-bottom:12px;">
                    <div style="margin-bottom:5px; font-weight:bold;">速度控制 (ms/步):</div>
                    <input type="range" id="speed-slider" min="50" max="500" value="${moveSpeed}" style="width:100%;">
                    <div style="text-align:center; font-size:12px; color:#776e65"><span id="speed-value">${moveSpeed}</span></div>
                </label>
            </div>`;
        
        return panel;
    }

    function updateStatsUI() {
        if (!document.getElementById('games-count')) return;
        
        const score = window.canvasGame.score || 0;
        const maxTileVal = Math.max(0, ...window.canvasGame.board.flat());
        
        if (score > highestScore) highestScore = score;
        if (maxTileVal > highestTile) highestTile = maxTileVal;
        
        const progress = Math.min(100, Math.round((score / TARGET_SCORE) * 100));
        
        document.getElementById('games-count').textContent = gamesPlayed;
        document.getElementById('high-score').textContent = highestScore;
        document.getElementById('max-tile').textContent = highestTile || 0;
        
        const progressEl = document.getElementById('target-progress');
        progressEl.textContent = `${progress}%`;
        progressEl.style.color = progress > 90 ? '#27ae60' : 
                               progress > 50 ? '#f39c12' : '#e74c3c';
    }
    
    function toggleAI() {
        const button = document.getElementById('auto-play-btn');
        
        if (!button) {
            console.error("未找到AI按钮!");
            return;
        }
        
        if (isAiRunning) {
            // 停止AI
            isAiRunning = false;
            clearInterval(gameLoopInterval);
            button.style.backgroundColor = '#27ae60';
            button.textContent = '▶ 启动AI';
            console.log('AI已停止');
        } else {
            // 检查游戏状态
            if (window.canvasGame.gameOver || (window.canvasGame.victory && !window.canvasGame.keepPlaying)) {
                alert("游戏已结束! 请先点击'新游戏'按钮");
                return;
            }
            
            // 启动AI
            isAiRunning = true;
            button.style.backgroundColor = '#e74c3c';
            button.textContent = '■ 停止AI';
            console.log('AI开始运行...');
            gameLoopInterval = setInterval(executeThinkCycle, moveSpeed);
        }
    }
    
    function handleSpeedChange() {
        moveSpeed = parseInt(this.value);
        document.getElementById('speed-value').textContent = moveSpeed;
        if (isAiRunning) {
            clearInterval(gameLoopInterval);
            gameLoopInterval = setInterval(executeThinkCycle, moveSpeed);
        }
    }

    // ======================== 初始化函数 ========================
    function initializeAI() {
        // 确保游戏对象已加载
        if (!window.canvasGame || !window.canvasGame.board) {
            setTimeout(initializeAI, 500);
            return;
        }
        
        // 确保游戏容器存在
        const gameContainer = document.querySelector('.game-container');
        if (!gameContainer) {
            setTimeout(initializeAI, 500);
            return;
        }
        
        // 创建并添加控制面板
        if (!document.getElementById('ai-control-panel')) {
            const panel = createControlPanel();
            gameContainer.appendChild(panel);
            
            // 添加事件监听
            document.getElementById('auto-play-btn').addEventListener('click', toggleAI);
            document.getElementById('speed-slider').addEventListener('input', handleSpeedChange);
            
            console.log("AI控制面板已添加");
        }
        
        // 添加新游戏监听
        document.querySelector('.new-game-btn')?.addEventListener('click', () => {
            if (isAiRunning) {
                isAiRunning = false;
                clearInterval(gameLoopInterval);
                const button = document.getElementById('auto-play-btn');
                if (button) {
                    button.style.backgroundColor = '#27ae60';
                    button.textContent = '▶ 启动AI';
                }
            }
        });
        
        // 初始化统计
        updateStatsUI();
        console.log(`2048 AI ${AI_VERSION} 初始化完成`);
    }

    // ======================== 启动脚本 ========================
    (function() {
        // 防止重复初始化
        if (window.AI_LOADED) return;
        window.AI_LOADED = true;
        
        console.log(`2048 AI ${AI_VERSION} 加载中`);
        
        // 确保页面完全加载
        if (document.readyState === 'complete') {
            initializeAI();
        } else {
            window.addEventListener('load', function() {
                setTimeout(initializeAI, 1000);
            });
        }
    })();
})();