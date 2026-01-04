// ==UserScript==
// @name 必应自动拼图
// @namespace 自动
// @match *://*.bing.*/spotlight/*
// @grant none
// @version 1.1
// @author auuuu
// @license MIT
// @description 2024/8/9 17:27:30
// python 版本 已经发布在 52pj上面了
// @downloadURL https://update.greasyfork.org/scripts/503382/%E5%BF%85%E5%BA%94%E8%87%AA%E5%8A%A8%E6%8B%BC%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/503382/%E5%BF%85%E5%BA%94%E8%87%AA%E5%8A%A8%E6%8B%BC%E5%9B%BE.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let tiles;
    const loadElements = () => {
        tiles = document.getElementById("tiles").children; // 加载拼图元素
        console.log(tiles);
    };

    const inputArrowUp = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i - 3; // 上移
            if (checkTileByIndex(next)) {
                tiles[i].click(); // 点击移动
                break;
            }
        }
    };

    const inputArrowDown = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i + 3; // 下移
            if (checkTileByIndex(next)) {
                tiles[i].click(); // 点击移动
                break;
            }
        }
    };

    const inputArrowLeft = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i - 1; // 左移
            if (checkTileByIndex(next)) {
                tiles[i].click(); // 点击移动
                break;
            }
        }
    };

    const inputArrowRight = () => {
        for (let i = 0; i < tiles.length; i++) {
            const next = i + 1; // 右移
            if (checkTileByIndex(next)) {
                tiles[i].click(); // 点击移动
                break;
            }
        }
    };

    const checkTileByIndex = (index) => {
        if (index < 0 || index >= tiles.length) {
            return false; // 超出边界
        }
        const targetChildren = tiles[index].children;
        return targetChildren.length === 0; // 返回是否为空白
    };

    // 添加按钮到 Tampermonkey 菜单
    const addButtonToMenu = () => {
        const button = document.createElement('button');
        button.innerText = '开始自动拼图';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = 1000;
        button.style.padding = '10px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.onclick = () => {
            main(); // 点击按钮时调用主函数
        };

        document.body.appendChild(button);
    };

    // 拼图状态类
    class PuzzleState {
        constructor(board, zeroPos, moves) {
            this.board = board; // 当前拼图状态
            this.zeroPos = zeroPos; // 空白位置
            this.moves = moves; // 移动记录
            this.cost = this.calculateCost(); // 计算总代价 (g + h)
        }

        // 计算总代价 (g + h)
        calculateCost() {
            return this.moves.length + this.heuristic(); // g + h
        }

        // 启发式：曼哈顿距离
        heuristic() {
            let distance = 0;
            const targetPositions = {
                1: [0, 0], 2: [0, 1], 3: [0, 2],
                4: [1, 0], 5: [1, 1], 6: [1, 2],
                7: [2, 0], 8: [2, 1], 0: [2, 2]
            };
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const value = this.board[i][j];
                    if (value !== 0) {
                        const [targetX, targetY] = targetPositions[value];
                        distance += Math.abs(targetX - i) + Math.abs(targetY - j);
                    }
                }
            }
            return distance; // 返回总距离
        }

        // 优先队列比较函数
        compareTo(other) {
            return this.cost - other.cost; // 比较总代价
        }
    }

    // 打印矩阵
    function printMatrix(matrix) {
        matrix.forEach(row => {
            console.log(row.join(', ')); // 打印每一行
        });
    }

    // 查找空白位置
    function findBlankPosition(matrix) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (matrix[i][j] === 0) {
                    return [i, j]; // 返回空白位置
                }
            }
        }
        return null;
    }

    // 检查拼图是否可解
    function isSolvable(puzzle) {
        let inversions = 0;
        const flatPuzzle = puzzle.flat().filter(num => num !== 0);
        for (let i = 0; i < flatPuzzle.length; i++) {
            for (let j = i + 1; j < flatPuzzle.length; j++) {
                if (flatPuzzle[i] > flatPuzzle[j]) {
                    inversions++; // 计算逆序对
                }
            }
        }
        return inversions % 2 === 0; // 可解条件
    }

    // 获取邻居状态
    function getNeighbors(state) {
        const neighbors = [];
        const [x, y] = state.zeroPos; // 当前空白位置
        const directions = [[-1, 0, '下'], [1, 0, '上'], [0, -1, '右'], [0, 1, '左']];

        for (const [dx, dy, move] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < 3 && newY >= 0 && newY < 3) {
                const newBoard = state.board.map(row => row.slice());
                [newBoard[x][y], newBoard[newX][newY]] = [newBoard[newX][newY], newBoard[x][y]];
                neighbors.push(new PuzzleState(newBoard, [newX, newY], [...state.moves, move])); // 添加邻居状态
            }
        }
        return neighbors;
    }

    // A* 算法
    function aStar(start) {
        const target = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]; // 目标状态
        const startState = new PuzzleState(start, findBlankPosition(start), []);
        const priorityQueue = [startState];
        const visited = new Set();

        while (priorityQueue.length > 0) {
            // 根据总代价排序优先队列
            priorityQueue.sort((a, b) => a.compareTo(b));

            const currentState = priorityQueue.shift(); // 取出当前状态
            const currentTuple = JSON.stringify(currentState.board);

            if (JSON.stringify(currentState.board) === JSON.stringify(target)) {
                return currentState.moves; // 返回移动步骤
            }

            if (visited.has(currentTuple)) {
                continue; // 如果已访问，跳过
            }
            visited.add(currentTuple);

            for (const neighbor of getNeighbors(currentState)) {
                priorityQueue.push(neighbor); // 添加邻居状态到优先队列
            }
        }

        return []; // 如果没有找到解决方案，返回空数组
    }

    // 主函数
    function main() {
        // 获取 id 为 tiles 的 div
        const tilesContainer = document.getElementById('tiles');
        const results = [];

        // 获取 tilesContainer 下的所有子 div
        const childDivs = tilesContainer.children;

        Array.from(childDivs).forEach(child => {
            // 查找 .parentTile
            const parentTiles = child.querySelectorAll('.parentTile');

            if (parentTiles.length === 0) {
                results.push('0'); // 如果没有 .parentTile，返回 0
            } else {
                let tileValues = [];

                parentTiles.forEach(parent => {
                    // 查找 .tileNumber
                    const tileNumbers = parent.querySelectorAll('.tileNumber');
                    if (tileNumbers.length === 0) {
                        tileValues.push('0'); // 如果没有 .tileNumber，返回 0
                    } else {
                        // 获取 .tileNumber 的值
                        tileNumbers.forEach(tile => {
                            const value = tile.textContent.trim();
                            tileValues.push(value); // 收集每个 tileNumber 的值
                            console.log(`.tileNumber: ${value}`); // 打印每个 .tileNumber 的结果
                        });
                    }
                });

                // 拼接 tileNumber 的值
                const tileResult = tileValues.join(',');
                results.push(tileResult); // 将结果添加到结果数组中
                console.log(`.parentTile: ${tileResult}`); // 打印对应的 .parentTile 的结果
            }
        });
        const inputList = results.map(Number);
        const puzzle = [];
        for (let i = 0; i < 3; i++) {
            puzzle.push(inputList.slice(i * 3, i * 3 + 3)); // 生成拼图矩阵
        }

        console.log("原始矩阵：");
        printMatrix(puzzle);

        if (!isSolvable(puzzle)) {
            console.log("这个拼图无法解决。");
            return; // 如果拼图不可解，结束
        }

        const moves = aStar(puzzle); // 获取还原步骤
        console.log("还原步骤：");
        moves.forEach((move, index) => {
            setTimeout(() => {
                console.log(move); // 打印每一步的移动
                // 这里可以调用处理方法来执行每一步的移动
                // 例如：executeMove(move);
                if (move == "上") {
                    console.log("向上移动");
                    inputArrowUp();
                }
                if (move == "下") {
                    console.log("向下移动");
                    inputArrowDown();
                }
                if (move == "左") {
                    console.log("向左移动");
                    inputArrowLeft();
                }
                if (move == "右") {
                    console.log("向右移动");
                    inputArrowRight();
                }
            }, index * 10); // 每个移动之间停顿500ms
        });
    }
    loadElements();
    addButtonToMenu(); // 添加按钮
})();
