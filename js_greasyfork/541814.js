// ==UserScript==
// @name         Chimera AI for 2048 (Worker Pro Enhanced)
// @name:zh-CN   2048 奇美拉AI (超级增强版)
// @namespace    http://tampermonkey.net/
// @version      8.0.0
// @description  An enhanced, highly optimized AI for 2048 with dynamic configuration, improved heuristics, and universal compatibility
// @description:zh-CN 增强版2048深度优化AI，支持动态配置、改进启发式算法和通用兼容性
// @author       AI Fusion & Human Refinement - Enhanced Edition
// @match        https://2048.linux.do/*
// @match        https://play2048.co/*
// @match        https://gabrielecirulli.github.io/2048/*
// @match        https://2048game.com/*
// @match        https://www.2048.org/*
// @match        https://elgoog.im/2048/*
// @match        https://www.mathsisfun.com/games/2048.html*
// @match        https://2048-online.io/*
// @match        https://www.crazygames.com/game/2048*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541814/Chimera%20AI%20for%202048%20%28Worker%20Pro%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541814/Chimera%20AI%20for%202048%20%28Worker%20Pro%20Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================================================================================
    // ENHANCED AI CONFIGURATION - 增强AI配置
    // ===================================================================================
    const CONFIG = {
        AI_SEARCH_DEPTH: 5,
        AUTO_PLAY_INTERVAL: 20,
        AI_DELAY_AFTER_MOVE: 20,
        BUTTON_INIT_DELAY: 500,
        MAX_SEARCH_TIME: 300, // Maximum time for iterative deepening in ms
        ENABLE_ITERATIVE_DEEPENING: true,
        ENABLE_ADVANCED_HEURISTICS: true,
    };

    // ===================================================================================
    // ENHANCED WEB WORKER SCRIPT - 增强版后台工作线程脚本
    // ===================================================================================
    const workerCode = `
        // Enhanced constants with more precise weights
        const HEURISTIC_WEIGHTS = {
            THRONE_REWARD: 1e10,
            GAME_OVER_PENALTY: -1e12,
            ESCAPE_ROUTE_PENALTY: 1e8,
            SNAKE_PATTERN_REWARD: 1000,
            EMPTY_CELLS_REWARD: 400,
            POTENTIAL_MERGE_REWARD: 15,
            SMOOTHNESS_PENALTY: 25,
            MONOTONICITY_PENALTY: 70,
            ISLAND_PENALTY: 500,        // NEW: Penalty for isolated tiles
            MERGE_BARRIER_PENALTY: 300, // NEW: Penalty for merge barriers
            EDGE_BONUS: 200,            // NEW: Bonus for keeping large tiles on edges
        };

        // Enhanced snake pattern with better progression
        const SNAKE_PATTERN_MATRIX = (() => {
            const matrix = Array.from({ length: 4 }, () => new Array(4));
            const weights = [
                [15, 14, 13, 12],
                [8, 9, 10, 11],
                [7, 6, 5, 4],
                [0, 1, 2, 3]
            ];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    matrix[r][c] = Math.pow(4.2, weights[r][c]); // Slightly steeper progression
                }
            }
            return matrix;
        })();

        const CORNERS = [ { r: 0, c: 0 }, { r: 0, c: 3 }, { r: 3, c: 0 }, { r: 3, c: 3 } ];
        const EDGES = [
            ...Array.from({length: 4}, (_, i) => ({r: 0, c: i})), // Top edge
            ...Array.from({length: 4}, (_, i) => ({r: 3, c: i})), // Bottom edge
            ...Array.from({length: 4}, (_, i) => ({r: i, c: 0})), // Left edge
            ...Array.from({length: 4}, (_, i) => ({r: i, c: 3})), // Right edge
        ];

        // Utility Functions
        const deepCopyGrid = (grid) => grid.map(row => [...row]);

        function areGridsEqual(grid1, grid2) {
            if (!grid1 || !grid2) return false;
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (grid1[r][c] !== grid2[r][c]) return false;
                }
            }
            return true;
        }

        const getLogValue = (() => {
            const cache = new Map();
            return (value) => {
                if (value === 0) return 0;
                if (!cache.has(value)) cache.set(value, Math.log2(value));
                return cache.get(value);
            };
        })();

        // Enhanced Board Logic
        class Board {
            constructor(grid = null) {
                this.size = 4;
                this.grid = grid ? deepCopyGrid(grid) : Array.from({ length: 4 }, () => new Array(4).fill(0));
            }

            copy = () => new Board(this.grid);
            placeTile = (cell, value) => { this.grid[cell.r][cell.c] = value; };

            processLine(line) {
                const nonZero = line.filter(val => val !== 0);
                const result = [];
                let score = 0, i = 0;
                while (i < nonZero.length) {
                    if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
                        const merged = nonZero[i] * 2;
                        result.push(merged);
                        score += merged;
                        i += 2;
                    } else {
                        result.push(nonZero[i]);
                        i++;
                    }
                }
                while (result.length < this.size) result.push(0);
                return { line: result, score };
            }

            transpose() {
                const newGrid = Array.from({ length: 4 }, () => new Array(4).fill(0));
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        newGrid[c][r] = this.grid[r][c];
                    }
                }
                this.grid = newGrid;
            }

            swipe(direction) {
                const originalGrid = deepCopyGrid(this.grid);
                let totalScore = 0;
                if (direction === 0 || direction === 2) this.transpose();
                if (direction === 1 || direction === 2) this.grid.forEach(row => row.reverse());

                for (let i = 0; i < this.size; i++) {
                    const { line, score } = this.processLine(this.grid[i]);
                    this.grid[i] = line;
                    totalScore += score;
                }

                if (direction === 1 || direction === 2) this.grid.forEach(row => row.reverse());
                if (direction === 0 || direction === 2) this.transpose();
                return { moved: !areGridsEqual(originalGrid, this.grid), score: totalScore };
            }

            getEmptyCells() {
                const cells = [];
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        if (this.grid[r][c] === 0) cells.push({ r, c });
                    }
                }
                return cells;
            }

            isGameOver() {
                if (this.getEmptyCells().length > 0) return false;
                for (let r = 0; r < this.size; r++) {
                    for (let c = 0; c < this.size; c++) {
                        const current = this.grid[r][c];
                        if ((c + 1 < this.size && current === this.grid[r][c + 1]) ||
                            (r + 1 < this.size && current === this.grid[r + 1][c])) {
                            return false;
                        }
                    }
                }
                return true;
            }

            getValidMoves = () => [0, 1, 2, 3].filter(dir => this.copy().swipe(dir).moved);

            static transformGrid(grid, targetCorner) {
                let newGrid = deepCopyGrid(grid);
                const size = grid.length;
                switch (\`\${targetCorner.r}-\${targetCorner.c}\`) {
                    case \`0-\${size - 1}\`: return newGrid.map(row => row.reverse());
                    case \`\${size - 1}-0\`: return newGrid.reverse();
                    case \`\${size - 1}-\${size - 1}\`:
                        newGrid.reverse();
                        return newGrid.map(row => row.reverse());
                    default: return newGrid;
                }
            }
        }

        // Enhanced AI with Iterative Deepening and Advanced Heuristics
        class EnhancedAI {
            constructor(depth, enableIterativeDeepening = true, enableAdvancedHeuristics = true) {
                this.depth = depth;
                this.enableIterativeDeepening = enableIterativeDeepening;
                this.enableAdvancedHeuristics = enableAdvancedHeuristics;
                this.memo = new Map();
                this.searchStartTime = 0;
                this.maxSearchTime = 300;
            }

            clearMemo = () => this.memo.clear();
            generateBoardKey = (grid) => grid.map(row => row.join('-')).join(',');

            // Enhanced heuristic with new features
            static heuristic(board, enableAdvanced = true) {
                if (board.isGameOver()) return HEURISTIC_WEIGHTS.GAME_OVER_PENALTY;

                let maxTile = 0, maxTilePos = { r: -1, c: -1 };
                for (let r = 0; r < board.size; r++) {
                    for (let c = 0; c < board.size; c++) {
                        if (board.grid[r][c] > maxTile) {
                            maxTile = board.grid[r][c];
                            maxTilePos = { r, c };
                        }
                    }
                }

                const isCornered = CORNERS.some(c => c.r === maxTilePos.r && c.c === maxTilePos.c);
                if (isCornered) {
                    return EnhancedAI.calculateStaticHeuristic(
                        new Board(Board.transformGrid(board.grid, maxTilePos)),
                        enableAdvanced
                    );
                }

                let maxScore = -Infinity;
                for (const corner of CORNERS) {
                    maxScore = Math.max(maxScore, EnhancedAI.calculateStaticHeuristic(
                        new Board(Board.transformGrid(board.grid, corner)),
                        enableAdvanced
                    ));
                }
                return maxScore;
            }

            static calculateStaticHeuristic(board, enableAdvanced = true) {
                let score = 0;
                let emptyCells = 0, mergeOpportunities = 0, monoPenalty = 0, smoothPenalty = 0;
                let snakePatternScore = 0, islandPenalty = 0, mergeBarrierPenalty = 0, edgeBonus = 0;

                for (let r = 0; r < board.size; r++) {
                    for (let c = 0; c < board.size; c++) {
                        const tile = board.grid[r][c];
                        if (tile === 0) {
                            emptyCells++;
                            continue;
                        }

                        snakePatternScore += tile * SNAKE_PATTERN_MATRIX[r][c];
                        const logValue = getLogValue(tile);

                        // Enhanced analysis for advanced heuristics
                        if (enableAdvanced) {
                            // Check if tile is on edge (bonus for large tiles)
                            const isOnEdge = EDGES.some(edge => edge.r === r && edge.c === c);
                            if (isOnEdge && tile >= 32) {
                                edgeBonus += tile * 0.1;
                            }

                            // Island detection (isolated high-value tiles)
                            if (tile >= 16) {
                                let neighbors = 0;
                                let highValueNeighbors = 0;
                                const directions = [[-1,0], [1,0], [0,-1], [0,1]];

                                for (const [dr, dc] of directions) {
                                    const nr = r + dr, nc = c + dc;
                                    if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4) {
                                        neighbors++;
                                        if (board.grid[nr][nc] >= tile / 4) {
                                            highValueNeighbors++;
                                        }
                                    }
                                }

                                if (neighbors > 0 && highValueNeighbors === 0) {
                                    islandPenalty += tile * 0.5; // Penalize isolated high tiles
                                }
                            }
                        }

                        // Standard neighbor analysis
                        if (c + 1 < board.size) {
                            const rightNeighbor = board.grid[r][c + 1];
                            if (rightNeighbor > 0) {
                                smoothPenalty += Math.abs(logValue - getLogValue(rightNeighbor));
                                if (tile === rightNeighbor) mergeOpportunities++;

                                // Merge barrier detection
                                if (enableAdvanced && c + 2 < board.size) {
                                    const farRightNeighbor = board.grid[r][c + 2];
                                    if (tile === farRightNeighbor && rightNeighbor !== tile && rightNeighbor > 0) {
                                        mergeBarrierPenalty += tile * 0.3;
                                    }
                                }
                            }
                            if (tile < rightNeighbor) monoPenalty += getLogValue(rightNeighbor) - logValue;
                        }

                        if (r + 1 < board.size) {
                            const downNeighbor = board.grid[r + 1][c];
                            if (downNeighbor > 0) {
                                smoothPenalty += Math.abs(logValue - getLogValue(downNeighbor));
                                if (tile === downNeighbor) mergeOpportunities++;

                                // Merge barrier detection (vertical)
                                if (enableAdvanced && r + 2 < board.size) {
                                    const farDownNeighbor = board.grid[r + 2][c];
                                    if (tile === farDownNeighbor && downNeighbor !== tile && downNeighbor > 0) {
                                        mergeBarrierPenalty += tile * 0.3;
                                    }
                                }
                            }
                            if (tile < downNeighbor) monoPenalty += getLogValue(downNeighbor) - logValue;
                        }
                    }
                }

                // Throne reward
                const maxTileInGrid = board.grid.flat().reduce((a, b) => Math.max(a, b), 0);
                score += (board.grid[0][0] === maxTileInGrid) ?
                    HEURISTIC_WEIGHTS.THRONE_REWARD : -HEURISTIC_WEIGHTS.THRONE_REWARD;

                // Escape route penalty
                if (!board.copy().swipe(0).moved && !board.copy().swipe(3).moved) {
                    score -= HEURISTIC_WEIGHTS.ESCAPE_ROUTE_PENALTY;
                }

                // Apply all scoring components
                score += emptyCells * HEURISTIC_WEIGHTS.EMPTY_CELLS_REWARD;
                score += mergeOpportunities * HEURISTIC_WEIGHTS.POTENTIAL_MERGE_REWARD;
                score += snakePatternScore * HEURISTIC_WEIGHTS.SNAKE_PATTERN_REWARD;
                score -= monoPenalty * HEURISTIC_WEIGHTS.MONOTONICITY_PENALTY;
                score -= smoothPenalty * HEURISTIC_WEIGHTS.SMOOTHNESS_PENALTY;

                if (enableAdvanced) {
                    score -= islandPenalty * HEURISTIC_WEIGHTS.ISLAND_PENALTY;
                    score -= mergeBarrierPenalty * HEURISTIC_WEIGHTS.MERGE_BARRIER_PENALTY;
                    score += edgeBonus * HEURISTIC_WEIGHTS.EDGE_BONUS;
                }

                return score;
            }

            expectimax(board, depth, isMaxNode) {
                // Time check for iterative deepening
                if (this.enableIterativeDeepening && Date.now() - this.searchStartTime > this.maxSearchTime) {
                    return { score: EnhancedAI.heuristic(board, this.enableAdvancedHeuristics), move: null };
                }

                const memoKey = \`\${this.generateBoardKey(board.grid)}-\${depth}-\${isMaxNode}\`;
                if (this.memo.has(memoKey)) return this.memo.get(memoKey);

                if (depth === 0 || board.isGameOver()) {
                    return { score: EnhancedAI.heuristic(board, this.enableAdvancedHeuristics), move: null };
                }

                const result = isMaxNode ? this.handleMaxNode(board, depth) : this.handleChanceNode(board, depth);
                this.memo.set(memoKey, result);
                return result;
            }

            handleMaxNode(board, depth) {
                let maxScore = -Infinity, bestMove = null;
                const validMoves = board.getValidMoves();
                if (validMoves.length === 0) {
                    return { score: EnhancedAI.heuristic(board, this.enableAdvancedHeuristics), move: null };
                }

                bestMove = validMoves[0];
                for (const move of validMoves) {
                    const newBoard = board.copy();
                    const { score: moveScore } = newBoard.swipe(move);
                    const { score } = this.expectimax(newBoard, depth - 1, false);
                    const totalScore = score + moveScore;

                    if (totalScore > maxScore) {
                        maxScore = totalScore;
                        bestMove = move;
                    }
                }
                return { score: maxScore, move: bestMove };
            }

            handleChanceNode(board, depth) {
                const emptyCells = board.getEmptyCells();
                if (emptyCells.length === 0) {
                    return { score: EnhancedAI.heuristic(board, this.enableAdvancedHeuristics), move: null };
                }

                let totalScore = 0;
                for (const cell of emptyCells) {
                    const board2 = board.copy();
                    board2.placeTile(cell, 2);
                    totalScore += 0.9 * this.expectimax(board2, depth - 1, true).score;

                    const board4 = board.copy();
                    board4.placeTile(cell, 4);
                    totalScore += 0.1 * this.expectimax(board4, depth - 1, true).score;
                }
                return { score: totalScore / emptyCells.length, move: null };
            }

            getBestMove(grid) {
                this.clearMemo();
                this.searchStartTime = Date.now();
                const board = new Board(grid);

                if (this.enableIterativeDeepening) {
                    let bestMove = null;
                    let currentDepth = 1;

                    while (currentDepth <= this.depth && Date.now() - this.searchStartTime < this.maxSearchTime) {
                        const result = this.expectimax(board, currentDepth, true);
                        if (result.move !== null) {
                            bestMove = result.move;
                        }
                        currentDepth++;
                    }
                    return bestMove;
                } else {
                    return this.expectimax(board, this.depth, true).move;
                }
            }
        }

        let aiInstance;

        // Worker Message Handler
        self.onmessage = function(e) {
            const { type, payload } = e.data;
            if (type === 'init') {
                aiInstance = new EnhancedAI(
                    payload.depth,
                    payload.enableIterativeDeepening || false,
                    payload.enableAdvancedHeuristics || false
                );
                if (payload.maxSearchTime) {
                    aiInstance.maxSearchTime = payload.maxSearchTime;
                }
                self.postMessage({ type: 'initialized' });
            } else if (type === 'calculateMove') {
                if (!aiInstance) return;
                const bestMove = aiInstance.getBestMove(payload.grid);
                self.postMessage({ type: 'moveCalculated', payload: { move: bestMove } });
            }
        };
    `;

    // ===================================================================================
    // ENHANCED UTILITY FUNCTIONS - 增强工具函数
    // ===================================================================================
    const deepCopyGrid = (grid) => grid.map(row => [...row]);

    function areGridsEqual(grid1, grid2) {
        if (!grid1 || !grid2 || grid1.length !== grid2.length) return false;
        for (let r = 0; r < grid1.length; r++) {
            for (let c = 0; c < grid1[r].length; c++) {
                if (grid1[r][c] !== grid2[r][c]) return false;
            }
        }
        return true;
    }

    // ===================================================================================
    // ENHANCED GAME CONTROLLER - 增强游戏控制器
    // ===================================================================================
    class EnhancedGameController {
        constructor() {
            this.gameInstance = null;
            this.aiPlaying = false;
            this.aiTimer = null;
            this.isCalculating = false;
            this.lastBoardState = null;
            this.button = null;
            this.settingsPanel = null;
            this.aiWorker = null;
            this.DIRECTION_MAP = Object.freeze({ 0: 'up', 1: 'right', 2: 'down', 3: 'left' });
            this.stats = {
                totalMoves: 0,
                startTime: null,
                bestTile: 0,
                currentScore: 0
            };
        }

        init() {
            try {
                const blob = new Blob([workerCode], { type: 'application/javascript' });
                this.aiWorker = new Worker(URL.createObjectURL(blob));
                this.aiWorker.onmessage = this.handleWorkerMessage.bind(this);

                this.initializeWorker();
                setTimeout(() => this.createEnhancedUI(), CONFIG.BUTTON_INIT_DELAY);
            } catch (e) {
                console.error("Failed to initialize Enhanced AI Worker:", e);
                this.showNotification("Error: Could not create the background AI worker.", "error");
            }
        }

        initializeWorker() {
            this.aiWorker.postMessage({
                type: 'init',
                payload: {
                    depth: CONFIG.AI_SEARCH_DEPTH,
                    enableIterativeDeepening: CONFIG.ENABLE_ITERATIVE_DEEPENING,
                    enableAdvancedHeuristics: CONFIG.ENABLE_ADVANCED_HEURISTICS,
                    maxSearchTime: CONFIG.MAX_SEARCH_TIME
                }
            });
        }

        handleWorkerMessage(e) {
            const { type, payload } = e.data;
            if (type === 'moveCalculated') {
                this.executeMove(payload.move);
                this.isCalculating = false;
                if (this.aiPlaying) {
                    this.scheduleNext(CONFIG.AI_DELAY_AFTER_MOVE);
                }
            } else if (type === 'initialized') {
                console.log("Enhanced AI Worker initialized successfully.");
            }
        }

        // Enhanced game instance detection
        findGameInstance() {
            // Priority order of detection methods
            const detectionMethods = [
                () => window.canvasGame?.board ? window.canvasGame : null,
                () => window.gameManager?.grid?.cells ? window.gameManager : null,
                () => window.game?.grid ? window.game : null,
                () => {
                    // Generic detection for common 2048 implementations
                    for (const key in window) {
                        try {
                            const obj = window[key];
                            if (obj && typeof obj === 'object') {
                                // Check for common 2048 game properties
                                if ((obj.board || obj.grid || obj.cells) &&
                                    (obj.handleMove || obj.move || obj.addRandomTile)) {
                                    return obj;
                                }
                            }
                        } catch (e) { /* ignore */ }
                    }
                    return null;
                },
                () => {
                    // HTML element based detection
                    const gameContainers = document.querySelectorAll('.game-container, .grid-container, .game, #game-container');
                    for (const container of gameContainers) {
                        const tiles = container.querySelectorAll('.tile, .grid-cell');
                        if (tiles.length >= 16) { // 4x4 grid
                            return this.createHTMLGameInterface(container);
                        }
                    }
                    return null;
                }
            ];

            for (const method of detectionMethods) {
                const result = method();
                if (result) return result;
            }

            return null;
        }

        // Create interface for HTML-based games
        createHTMLGameInterface(container) {
            return {
                board: this.extractBoardFromHTML(container),
                handleMove: (direction) => this.simulateKeyPress(direction),
                gameOver: false,
                victory: false
            };
        }

        extractBoardFromHTML(container) {
            const board = Array.from({ length: 4 }, () => new Array(4).fill(0));
            const tiles = container.querySelectorAll('.tile:not(.tile-new)');

            tiles.forEach(tile => {
                const classList = Array.from(tile.classList);
                const positionClass = classList.find(cls => cls.startsWith('tile-position-'));
                const valueClass = classList.find(cls => cls.startsWith('tile-') && cls !== positionClass);

                if (positionClass && valueClass) {
                    const [, , col, row] = positionClass.split('-').map(Number);
                    const value = parseInt(valueClass.replace('tile-', '')) || 0;
                    if (row >= 1 && row <= 4 && col >= 1 && col <= 4) {
                        board[row - 1][col - 1] = value;
                    }
                }
            });

            return board;
        }

        simulateKeyPress(direction) {
            const keyMap = {
                'up': 'ArrowUp',
                'down': 'ArrowDown',
                'left': 'ArrowLeft',
                'right': 'ArrowRight'
            };

            const event = new KeyboardEvent('keydown', {
                key: keyMap[direction],
                code: keyMap[direction],
                which: { ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39 }[keyMap[direction]]
            });

            document.dispatchEvent(event);
        }

        executeMove(moveCode) {
            if (moveCode === null || typeof moveCode === 'undefined') {
                this.stopAI("Game Over");
                return;
            }

            const direction = this.DIRECTION_MAP[moveCode];
            if (direction && this.gameInstance) {
                if (this.gameInstance.handleMove) {
                    this.gameInstance.handleMove(direction);
                } else {
                    this.simulateKeyPress(direction);
                }

                this.stats.totalMoves++;
                this.updateStats();
            }
        }

        updateStats() {
            if (!this.gameInstance) return;

            // Update current score and best tile
            if (this.gameInstance.score !== undefined) {
                this.stats.currentScore = this.gameInstance.score;
            }

            if (this.gameInstance.board) {
                const maxTile = Math.max(...this.gameInstance.board.flat());
                this.stats.bestTile = Math.max(this.stats.bestTile, maxTile);
            }

            // Update stats display if visible
            const statsElement = document.getElementById('ai-stats');
            if (statsElement && this.stats.startTime) {
                const elapsed = Math.floor((Date.now() - this.stats.startTime) / 1000);
                const movesPerSecond = (this.stats.totalMoves / Math.max(elapsed, 1)).toFixed(1);

                statsElement.innerHTML = `
                    <div style="font-size: 12px; color: #776e65; margin-top: 5px;">
                        Moves: ${this.stats.totalMoves} | Best: ${this.stats.bestTile} | ${movesPerSecond} moves/s
                    </div>
                `;
            }
        }

        autoPlay() {
            if (!this.aiPlaying || this.isCalculating || !this.gameInstance) return;

            // Check game state
            if (this.gameInstance.gameOver || this.gameInstance.victory) {
                this.stopAI(this.gameInstance.victory ? "🏆 Victory!" : "Game Over");
                return;
            }

            // Get current board state
            let currentBoard = this.gameInstance.board;
            if (!currentBoard && this.gameInstance.grid) {
                currentBoard = this.gameInstance.grid.cells || this.gameInstance.grid;
            }

            if (!currentBoard) {
                // Try HTML extraction for web-based games
                const container = document.querySelector('.game-container, .grid-container, .game, #game-container');
                if (container) {
                    currentBoard = this.extractBoardFromHTML(container);
                }
            }

            if (!currentBoard) {
                this.scheduleNext(CONFIG.AUTO_PLAY_INTERVAL);
                return;
            }

            // Check if board has changed
            if (areGridsEqual(currentBoard, this.lastBoardState)) {
                this.scheduleNext(CONFIG.AUTO_PLAY_INTERVAL);
                return;
            }

            this.lastBoardState = deepCopyGrid(currentBoard);
            this.isCalculating = true;
            this.aiWorker.postMessage({
                type: 'calculateMove',
                payload: { grid: this.lastBoardState }
            });
        }

        scheduleNext(delay) {
            clearTimeout(this.aiTimer);
            if (this.aiPlaying) {
                this.aiTimer = setTimeout(() => this.autoPlay(), delay);
            }
        }

        startAI() {
            if (this.aiPlaying) return;

            this.gameInstance = this.findGameInstance();
            if (!this.gameInstance) {
                this.showNotification("Could not find game instance! Please reload the page.", "error");
                return;
            }

            this.aiPlaying = true;
            this.isCalculating = false;
            this.lastBoardState = null;
            this.stats.totalMoves = 0;
            this.stats.startTime = Date.now();
            this.stats.bestTile = 0;

            console.log(`%cChimera AI Enhanced v${GM_info.script.version} Started`, "color: #4CAF50; font-weight: bold;");
            this.scheduleNext(300);
            this.updateButton('Stop AI', '#f65e3b');
            this.showNotification("AI Started!", "success");
        }

        stopAI(endText = 'Start AI') {
            this.aiPlaying = false;
            this.isCalculating = false;
            clearTimeout(this.aiTimer);

            if (this.stats.startTime) {
                const elapsed = Math.floor((Date.now() - this.stats.startTime) / 1000);
                console.log(`%cChimera AI Stopped. Stats: ${this.stats.totalMoves} moves in ${elapsed}s, Best tile: ${this.stats.bestTile}`,
                           "color: #f65e3b; font-weight: bold;");
            }

            this.updateButton(endText, '#8f7a66');
            this.showNotification(endText === 'Start AI' ? "AI Stopped" : endText, "info");
        }

        updateButton(text, color) {
            if (this.button) {
                this.button.textContent = text;
                this.button.style.backgroundColor = color;
            }
        }

        showNotification(message, type = "info") {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed; top: 70px; right: 10px; z-index: 10001;
                padding: 10px 15px; border-radius: 5px; color: white; font-weight: bold;
                background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
                box-shadow: 0 2px 10px rgba(0,0,0,0.3); transform: translateX(100%);
                transition: transform 0.3s ease; font-family: 'Clear Sans', sans-serif;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => notification.style.transform = 'translateX(0)', 100);
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        }

        createEnhancedUI() {
            if (document.getElementById('ai-control-panel')) return;

            // Main container
            const container = document.createElement('div');
            container.id = 'ai-control-panel';
            container.style.cssText = `
                position: fixed; top: 10px; right: 10px; z-index: 10000;
                font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
            `;

            // Main button
            this.button = document.createElement('button');
            this.button.textContent = 'Start AI';
            this.button.style.cssText = `
                padding: 12px 18px; fontSize: 16px; fontWeight: bold; cursor: pointer;
                backgroundColor: #8f7a66; color: #f9f6f2; border: 2px solid #776e65;
                borderRadius: 6px; boxShadow: 0 3px 8px rgba(0,0,0,0.3);
                transition: all 0.2s ease; userSelect: none; marginRight: 5px;
            `;

            // Settings button
            const settingsButton = document.createElement('button');
            settingsButton.textContent = '⚙️';
            settingsButton.style.cssText = `
                padding: 12px 10px; fontSize: 16px; cursor: pointer;
                backgroundColor: #8f7a66; color: #f9f6f2; border: 2px solid #776e65;
                borderRadius: 6px; boxShadow: 0 3px 8px rgba(0,0,0,0.3);
                transition: all 0.2s ease; userSelect: none;
            `;

            // Settings panel
            this.settingsPanel = document.createElement('div');
            this.settingsPanel.style.cssText = `
                display: none; position: absolute; top: 100%; right: 0; marginTop: 5px;
                backgroundColor: #faf8ef; padding: 15px; border: 2px solid #776e65;
                borderRadius: 6px; boxShadow: 0 5px 15px rgba(0,0,0,0.3);
                minWidth: 250px; fontSize: 14px; color: #776e65;
            `;

            this.settingsPanel.innerHTML = `
                <div style="marginBottom: 10px; fontWeight: bold;">AI Configuration</div>

                <label style="display: block; marginBottom: 5px;">
                    Search Depth: <span id="depth-val">${CONFIG.AI_SEARCH_DEPTH}</span>
                </label>
                <input type="range" id="depth-slider" min="2" max="8" value="${CONFIG.AI_SEARCH_DEPTH}"
                       style="width: 100%; marginBottom: 10px;">

                <label style="display: block; marginBottom: 5px;">
                    Move Interval (ms): <span id="interval-val">${CONFIG.AUTO_PLAY_INTERVAL}</span>
                </label>
                <input type="range" id="interval-slider" min="0" max="200" step="10" value="${CONFIG.AUTO_PLAY_INTERVAL}"
                       style="width: 100%; marginBottom: 10px;">

                <label style="display: block; marginBottom: 5px;">
                    Max Search Time (ms): <span id="time-val">${CONFIG.MAX_SEARCH_TIME}</span>
                </label>
                <input type="range" id="time-slider" min="100" max="1000" step="50" value="${CONFIG.MAX_SEARCH_TIME}"
                       style="width: 100%; marginBottom: 10px;">

                <label style="display: block; marginBottom: 10px;">
                    <input type="checkbox" id="iterative-cb" ${CONFIG.ENABLE_ITERATIVE_DEEPENING ? 'checked' : ''}>
                    Iterative Deepening
                </label>

                <label style="display: block; marginBottom: 10px;">
                    <input type="checkbox" id="advanced-cb" ${CONFIG.ENABLE_ADVANCED_HEURISTICS ? 'checked' : ''}>
                    Advanced Heuristics
                </label>

                <div id="ai-stats"></div>
            `;

            // Event listeners
            this.button.onclick = () => this.aiPlaying ? this.stopAI() : this.startAI();

            settingsButton.onclick = (e) => {
                e.stopPropagation();
                this.settingsPanel.style.display =
                    this.settingsPanel.style.display === 'none' ? 'block' : 'none';
            };

            // Settings event handlers
            this.setupSettingsHandlers();

            // Hover effects
            [this.button, settingsButton].forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transform = 'translateY(-1px)';
                    btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.transform = 'translateY(0)';
                    btn.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
                });
            });

            // Close panel on outside click
            document.addEventListener('click', () => this.settingsPanel.style.display = 'none');
            container.addEventListener('click', (e) => e.stopPropagation());

            // Assemble and add to page
            container.appendChild(this.button);
            container.appendChild(settingsButton);
            container.appendChild(this.settingsPanel);
            document.body.appendChild(container);
        }

        setupSettingsHandlers() {
            const depthSlider = this.settingsPanel.querySelector('#depth-slider');
            const intervalSlider = this.settingsPanel.querySelector('#interval-slider');
            const timeSlider = this.settingsPanel.querySelector('#time-slider');
            const iterativeCb = this.settingsPanel.querySelector('#iterative-cb');
            const advancedCb = this.settingsPanel.querySelector('#advanced-cb');

            depthSlider.oninput = () => {
                const newDepth = parseInt(depthSlider.value, 10);
                CONFIG.AI_SEARCH_DEPTH = newDepth;
                this.settingsPanel.querySelector('#depth-val').textContent = newDepth;
                this.initializeWorker();
            };

            intervalSlider.oninput = () => {
                const newInterval = parseInt(intervalSlider.value, 10);
                CONFIG.AUTO_PLAY_INTERVAL = newInterval;
                this.settingsPanel.querySelector('#interval-val').textContent = newInterval;
            };

            timeSlider.oninput = () => {
                const newTime = parseInt(timeSlider.value, 10);
                CONFIG.MAX_SEARCH_TIME = newTime;
                this.settingsPanel.querySelector('#time-val').textContent = newTime;
                this.initializeWorker();
            };

            iterativeCb.onchange = () => {
                CONFIG.ENABLE_ITERATIVE_DEEPENING = iterativeCb.checked;
                this.initializeWorker();
            };

            advancedCb.onchange = () => {
                CONFIG.ENABLE_ADVANCED_HEURISTICS = advancedCb.checked;
                this.initializeWorker();
            };
        }
    }

    // ===================================================================================
    // INITIALIZATION - 初始化
    // ===================================================================================
    const enhancedGameController = new EnhancedGameController();
    enhancedGameController.init();

    // Global exposure for debugging
    window.ChimeraAI = {
        controller: enhancedGameController,
        config: CONFIG,
        version: "8.0.0 Enhanced"
    };

    console.log("%cChimera AI Enhanced Edition Loaded! 🚀", "color: #4CAF50; font-size: 16px; font-weight: bold;");
})();