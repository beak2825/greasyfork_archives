// ==UserScript==
// @name        Neopets - Negg Cave Advanced Solver
// @namespace   Neopets
// @match       *://www.neopets.com/shenkuu/neggcave/
// @license      MIT
// @version     1.0
// @author      God
// @description Dynamically solves the Negg Cave puzzle
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/537846/Neopets%20-%20Negg%20Cave%20Advanced%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/537846/Neopets%20-%20Negg%20Cave%20Advanced%20Solver.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    if (!window.location.href.includes('neopets.com/shenkuu/neggcave')) {
        return;
    }

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 200));

    async function waitForElement(selector, timeout = 15000) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await delay(100);
        }
        return null;
    }

    async function simulateClick(element) {
        if (!element) return false;
        try {
            const rect = element.getBoundingClientRect();
            const clientX = rect.left + rect.width / 2;
            const clientY = rect.top + rect.height / 2;

            const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX, clientY });
            const mouseUp = new MouseEvent('mouseup', { bubbles: true, cancelable: true, clientX, clientY });
            const click = new MouseEvent('click', { bubbles: true, cancelable: true, clientX, clientY });

            element.dispatchEvent(mouseDown);
            await delay(50);
            element.dispatchEvent(mouseUp);
            await delay(50);
            element.dispatchEvent(click);
            await delay(300 + Math.random() * 200);
            return true;
        } catch {
            return false;
        }
    }

    async function clickElement(selector, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            const element = await waitForElement(selector);
            if (!element) {
                if (attempt === retries) return false;
                await delay(500);
                continue;
            }
            if (await simulateClick(element)) {
                return true;
            }
            if (attempt === retries) return false;
            await delay(500);
        }
        return false;
    }

    async function fillCell(row, col, symbol, color) {
        if (!await clickElement(`#mnc_parch_ui_symbol_${symbol}`)) return false;
        if (!await clickElement(`#mnc_parch_ui_color_${color}`)) return false;
        if (!await clickElement(`#mnc_grid_cell_${row}_${col}`)) return false;
        if (!await clickElement('#mnc_parch_ui_clear')) return false;

        const cell = await waitForElement(`#mnc_grid_cell_${row}_${col}`);
        if (!cell) return false;
        const expectedClass = `mnc_negg_cell_s${symbol}c${color}`;
        if (!cell.classList.contains(expectedClass)) return false;
        return true;
    }

    async function resetGrid() {
        if (!await clickElement('#mnc_parch_ui_reset')) return false;
        window.confirm = () => true;
        await delay(1000);
        return true;
    }

    async function submitGrid() {
        const submitButton = await waitForElement('#mnc_negg_submit_text');
        if (!submitButton || submitButton.classList.contains('disabled')) return false;
        return await simulateClick(submitButton);
    }

    function parseClues() {
        const clueTables = document.querySelectorAll('#mnc_parch_clues .mnc_clue_table');
        const clues = [];
        clueTables.forEach(table => {
            const rows = table.querySelectorAll('tbody tr');
            const clue = [];
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                const clueRow = [];
                cells.forEach(cell => {
                    const div = cell.querySelector('div');
                    if (!div) {
                        clueRow.push({ symbol: -1, color: -1 });
                        return;
                    }
                    const className = div.className;
                    const symbolMatch = className.match(/s([0-2X])c/);
                    const colorMatch = className.match(/c([0-2X])/);
                    const symbol = symbolMatch[1] === 'X' ? -1 : parseInt(symbolMatch[1]);
                    const color = colorMatch[1] === 'X' ? -1 : parseInt(colorMatch[1]);
                    clueRow.push({ symbol, color });
                });
                clue.push(clueRow);
            });
            clues.push(clue);
        });
        return clues;
    }

    function canPlaceClue(grid, clue, rowOffset, colOffset) {
        for (let r = 0; r < clue.length; r++) {
            for (let c = 0; c < clue[r].length; c++) {
                const gridRow = rowOffset + r;
                const gridCol = colOffset + c;
                if (gridRow >= 3 || gridCol >= 3) return false;
                const clueCell = clue[r][c];
                const gridCell = grid[gridRow][gridCol];
                if (clueCell.symbol === -1 && clueCell.color === -1) continue;
                if (clueCell.symbol !== -1 && gridCell.symbol !== -1 && gridCell.symbol !== clueCell.symbol) return false;
                if (clueCell.color !== -1 && gridCell.color !== -1 && gridCell.color !== clueCell.color) return false;
            }
        }
        return true;
    }

    function placeClue(grid, clue, rowOffset, colOffset) {
        const newGrid = JSON.parse(JSON.stringify(grid));
        for (let r = 0; r < clue.length; r++) {
            for (let c = 0; c < clue[r].length; c++) {
                const gridRow = rowOffset + r;
                const gridCol = colOffset + c;
                if (gridRow >= 3 || gridCol >= 3) continue;
                const clueCell = clue[r][c];
                if (clueCell.symbol !== -1) newGrid[gridRow][gridCol].symbol = clueCell.symbol;
                if (clueCell.color !== -1) newGrid[gridRow][gridCol].color = clueCell.color;
            }
        }
        return newGrid;
    }

    function countOccurrences(grid) {
        const symbolCount = { 0: 0, 1: 0, 2: 0 };
        const colorCount = { 0: 0, 1: 0, 2: 0 };
        const symbolColorCount = {
            0: { 0: 0, 1: 0, 2: 0 },
            1: { 0: 0, 1: 0, 2: 0 },
            2: { 0: 0, 1: 0, 2: 0 }
        };
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const cell = grid[r][c];
                if (cell.symbol !== -1) symbolCount[cell.symbol]++;
                if (cell.color !== -1) colorCount[cell.color]++;
                if (cell.symbol !== -1 && cell.color !== -1) symbolColorCount[cell.symbol][cell.color]++;
            }
        }
        return { symbolCount, colorCount, symbolColorCount };
    }

    function solvePuzzle(clues) {
        let grid = Array(3).fill().map(() => Array(3).fill().map(() => ({ symbol: -1, color: -1 })));
        clues.sort((a, b) => (b.length * b[0].length) - (a.length * a[0].length));

        function placeCluesRecursively(clueIndex) {
            if (clueIndex === clues.length) {
                return fillRemainingCells(grid);
            }

            const clue = clues[clueIndex];
            const clueRows = clue.length;
            const clueCols = clue[0].length;

            for (let row = 0; row <= 3 - clueRows; row++) {
                for (let col = 0; col <= 3 - clueCols; col++) {
                    if (canPlaceClue(grid, clue, row, col)) {
                        const newGrid = placeClue(grid, clue, row, col);
                        const savedGrid = JSON.parse(JSON.stringify(grid));
                        grid = newGrid;
                        const result = placeCluesRecursively(clueIndex + 1);
                        if (result) return result;
                        grid = savedGrid;
                    }
                }
            }
            return null;
        }

        function fillRemainingCells(tempGrid) {
            let grid = JSON.parse(JSON.stringify(tempGrid));
            let attempts = 0;
            const maxAttempts = 100;

            while (attempts < maxAttempts) {
                attempts++;
                let changes = false;
                const { symbolCount, colorCount, symbolColorCount } = countOccurrences(grid);

                let isFullyFilled = true;
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (grid[r][c].symbol === -1 || grid[r][c].color === -1) {
                            isFullyFilled = false;
                            break;
                        }
                    }
                    if (!isFullyFilled) break;
                }

                if (isFullyFilled) {
                    if (Object.values(symbolCount).every(count => count === 3) &&
                        Object.values(colorCount).every(count => count === 3)) {
                        return grid;
                    }
                    return null;
                }

                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        let cell = grid[r][c];
                        if (cell.symbol !== -1 && cell.color === -1) {
                            const symbol = cell.symbol;
                            const usedColors = Object.keys(symbolColorCount[symbol])
                                .filter(color => symbolColorCount[symbol][color] > 0)
                                .map(Number);
                            const availableColors = [0, 1, 2].filter(color => !usedColors.includes(color) && colorCount[color] < 3);
                            if (availableColors.length === 1) {
                                cell.color = availableColors[0];
                                changes = true;
                            } else if (availableColors.length === 0) {
                                return null;
                            }
                        } else if (cell.color !== -1 && cell.symbol === -1) {
                            const color = cell.color;
                            const usedSymbols = Object.keys(symbolColorCount)
                                .filter(symbol => symbolColorCount[symbol][color] > 0)
                                .map(Number);
                            const availableSymbols = [0, 1, 2].filter(symbol => !usedSymbols.includes(symbol) && symbolCount[symbol] < 3);
                            if (availableSymbols.length === 1) {
                                cell.symbol = availableSymbols[0];
                                changes = true;
                            } else if (availableSymbols.length === 0) {
                                return null;
                            }
                        } else if (cell.symbol === -1 && cell.color === -1) {
                            const missingSymbols = Object.keys(symbolCount).filter(s => symbolCount[s] < 3).map(Number);
                            const missingColors = Object.keys(colorCount).filter(c => colorCount[c] < 3).map(Number);
                            const possiblePairs = [];
                            for (const s of missingSymbols) {
                                for (const c of missingColors) {
                                    if (symbolColorCount[s][c] === 0) {
                                        possiblePairs.push({ symbol: s, color: c });
                                    }
                                }
                            }
                            if (possiblePairs.length === 1) {
                                cell.symbol = possiblePairs[0].symbol;
                                cell.color = possiblePairs[0].color;
                                changes = true;
                            }
                        }
                        grid[r][c] = cell;
                    }
                }

                if (!changes) {
                    for (let r = 0; r < 3; r++) {
                        for (let c = 0; c < 3; c++) {
                            if (grid[r][c].symbol === -1 && grid[r][c].color === -1) {
                                const { symbolCount: sc, colorCount: cc, symbolColorCount: scc } = countOccurrences(grid);
                                const missingSymbols = Object.keys(sc).filter(s => sc[s] < 3).map(Number);
                                const missingColors = Object.keys(cc).filter(c => cc[c] < 3).map(Number);
                                for (const s of missingSymbols) {
                                    for (const c of missingColors) {
                                        if (scc[s][c] === 0) {
                                            const newGrid = JSON.parse(JSON.stringify(grid));
                                            newGrid[r][c] = { symbol: s, color: c };
                                            const result = fillRemainingCells(newGrid);
                                            if (result) return result;
                                        }
                                    }
                                }
                                return null;
                            }
                        }
                    }
                }
            }
            return null;
        }

        return placeCluesRecursively(0);
    }

    let maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const grid = await waitForElement('#mnc_negg_grid');
        if (!grid) return;

        if (!await resetGrid()) continue;

        const clues = parseClues();
        if (!clues.length) continue;

        const solution = solvePuzzle(clues);
        if (!solution) continue;

        let fillSuccess = true;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = solution[row][col];
                if (!await fillCell(row, col, cell.symbol, cell.color)) {
                    fillSuccess = false;
                    break;
                }
            }
            if (!fillSuccess) break;
        }

        if (!fillSuccess) continue;

        await delay(3000 + Math.random() * 1000);
        if (await submitGrid()) {
            return;
        }
    }
})();