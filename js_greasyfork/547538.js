// ==UserScript==
// @name         Queens Solver
// @namespace    ViolentmonkeyScripts
// @version      1.0
// @description  Solves a color-based N-Queens puzzle.
// @author       Zach Kosove
// @match        https://www.playqueensgame.com/puzzles/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547538/Queens%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/547538/Queens%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const board = [];

    const blocked = [];

    function initBoard() {
        document.querySelectorAll('.grid .aspect-square').forEach(square => {
            const row = +square.dataset.row;
            const col = +square.dataset.col;
            const color = square.style.backgroundColor.trim();

            if (!board[row]) board[row] = [];
            board[row][col] = color || null;

            if (!blocked[row]) blocked[row] = [];
            blocked[row][col] = new Set();
        });

        console.table(board);
    }

    initBoard();

    let queens = [];

    let queenId = 0;

    function updateBlocked(row, col, color, id, add = true, heuristic = false) {
        if (!add && heuristic) return;
        const size = board.length;
        const method = add ? 'add' : 'delete';
        const action = add ? 'Blocking' : 'Unblocking';

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                if (r === row || c === col || board[r][c] === color) {
                    const tag = `q:${id}`;
                    blocked[r][c][method](tag);
                    console.log(`${action} (${r}, ${c}) due to queen ${id} at (${row}, ${col}) [${r === row ? 'row' : c === col ? 'col' : 'color'} match]`);
                }
            }
        }

        [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
        ].forEach(([dr, dc]) => {
            const nr = row + dr,
                nc = col + dc;
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
                const tag = `q:${id}`;
                blocked[nr][nc][method](tag);
                console.log(`${action} diagonal (${nr}, ${nc}) from queen ${id}`);
            }
        });
    }

    function placeQueen(row, col, heuristic = false) {
        const id = queenId++;
        queens.push({
            id,
            row,
            col,
            heuristic
        });
        updateBlocked(row, col, board[row][col], id, true, heuristic);
        console.log(`♛ Placed Queen ${id} at (${row}, ${col}) [Color: ${board[row][col]}]${heuristic ? " [Heuristic]" : ""}`);
    }

    function removeQueen(row, col, heuristic = false) {
        const q = queens.find(q => q.row === row && q.col === col);
        // if (!q || q.heuristic) return; // 🔒 Never remove heuristic queens
        updateBlocked(row, col, board[row][col], q.id, false, heuristic);
        queens = queens.filter(queen => queen.id !== q.id);
        console.log(`🟥 Removed Queen ${q.id} from (${row}, ${col})`);
    }

    function isValid(row, col) {
        const tags = [...blocked[row][col]];

        // 🔍 Check if any tag corresponds to a heuristic queen
        const blockedByHeuristic = tags.some(tag => {
            if (!tag.startsWith('q:')) return false;
            const id = parseInt(tag.slice(2));
            const q = queens.find(q => q.id === id);
            return q?.heuristic;
        });

        const reason = tags.length > 0 ?
            `⛔ Blocked by ${tags.join(', ')}${blockedByHeuristic ? ' (Heuristic Blocked)' : ''}` :
            '✅ Valid';

        console.log(`Checking cell (${row}, ${col}) → ${reason}`);

        return !blockedByHeuristic && tags.length === 0;
    }

    function applyColorHeuristic() {
        const n = board.length;
        let placed = false;

        // --- tiny helpers ---
        const ensure = (map, key, init) => (map.has(key) ? map.get(key) : (map.set(key, init()), map.get(key)));
        const tag = (r, c, reason) => blocked[r][c].add(reason);
        const addSpan = (map, key, color) => {
            const e = ensure(map, key, () => ({
                count: 0,
                colors: new Set()
            }));
            e.count++;
            e.colors.add(color);
        };

        // byColor: color -> array of valid [r,c] cells
        const byColor = new Map();
        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (!isValid(r, c)) continue;
                const color = board[r][c];
                if (!color) continue;
                ensure(byColor, color, () => []).push([r, c]);
            }
        }

        // Span aggregators: "<min>-<max>" -> { count, colors:Set }
        const rowSpans = new Map();
        const colSpans = new Map();

        // --- pass 1: compute spans per color + handle forced single-cell placements ---
        for (const [color, cells] of byColor) {
            if (cells.length === 0) continue;

            // Find min/max rows/cols for this color
            let minR = Infinity,
                maxR = -Infinity,
                minC = Infinity,
                maxC = -Infinity;
            for (const [r, c] of cells) {
                if (r < minR) minR = r;
                if (r > maxR) maxR = r;
                if (c < minC) minC = c;
                if (c > maxC) maxC = c;
            }
            const rowSpan = maxR - minR + 1;
            const colSpan = maxC - minC + 1;

            // Record spans keyed by "<min>-<max>"
            addSpan(rowSpans, `${minR}-${maxR}`, color);
            addSpan(colSpans, `${minC}-${maxC}`, color);

            // Single cell => forced queen
            if (cells.length === 1 || (rowSpan === 1 && colSpan === 1)) {
                const [r, c] = cells[0];
                placeQueen(r, c, true);
                placed = true;
            }
        }

        // --- pass 2: lock spans when (#colors == span length), then block non-matching cells ---
        const lockRowSpan = (key, entry) => {
            const [minR, maxR] = key.split('-').map(Number);
            const spanLen = maxR - minR + 1;
            if (entry.count !== spanLen) return;

            const colors = entry.colors; // Set
            let blocks = 0;
            for (let r = minR; r <= maxR; r++) {
                for (let c = 0; c < n; c++) {
                    const cellColor = board[r][c];
                    if (!colors.has(cellColor)) {
                        tag(r, c, `row-span-${key}`);
                        blocks++;
                    }
                }
            }
            console.log(`⛔ Row span ${key} locked by ${[...colors].join(", ")} ["Heuristic"] → Blocked ${blocks} non-matching cells`);
        };

        const lockColSpan = (key, entry) => {
            const [minC, maxC] = key.split('-').map(Number);
            const spanLen = maxC - minC + 1;
            if (entry.count !== spanLen) return;

            const colors = entry.colors; // Set
            let blocks = 0;
            for (let c = minC; c <= maxC; c++) {
                for (let r = 0; r < n; r++) {
                    const cellColor = board[r][c];
                    if (!colors.has(cellColor)) {
                        tag(r, c, `col-span-${key}`);
                        blocks++;
                    }
                }
            }
            console.log(`⛔ Col span ${key} locked by ${[...colors].join(", ")} ["Heuristic"] → Blocked ${blocks} non-matching cells`);
        };

        for (const [key, entry] of rowSpans) lockRowSpan(key, entry);
        for (const [key, entry] of colSpans) lockColSpan(key, entry);

        return placed;
    }




    function solve(row = 0) {
        if (row === board.length) {
            console.log("🎯 All queens placed successfully.");
            return true;
        }

        // ✅ Skip if row already has a heuristic queen
        const existing = queens.find(q => q.row === row);
        if (existing?.heuristic) {
            console.log(`✅ Row ${row} already solved by heuristic queen. Skipping.`);
            return solve(row + 1);
        }

        console.log(`\n➡️ Solving row ${row}...`);

        for (let col = 0; col < board.length; col++) {
            if (!isValid(row, col)) continue;

            placeQueen(row, col); // ← heuristic: false by default
            if (solve(row + 1)) return true;
            removeQueen(row, col); // ✅ Heuristic queens are NOT removed
        }

        console.log(`↩️ Backtracking from row ${row}`);
        return false;
    }


    function printFinalBoard() {
        const size = board.length;
        const grid = Array.from({
            length: size
        }, () => Array(size).fill(' '));

        queens.forEach(({
            row,
            col
        }) => {
            grid[row][col] = '♛';
        });

        console.log("📋 Final Board Layout:");
        console.table(grid);
    }

    function autoSolve() {
        console.log("🧠 Starting N-Queens AutoSolver with logging...");

        // Apply heuristic queen placements BEFORE solving
        const heuristicPlaced = applyColorHeuristic();

        if (heuristicPlaced) {
            console.log("🧩 Heuristic queens placed, starting solver with partial board...");
        } else {
            console.log("🔎 No heuristic queens placed, starting full solver...");
        }

        if (solve()) {
            console.log("🎉 Puzzle solved. Queens placed:");
            printFinalBoard();
        } else {
            console.warn("❌ No solution found for this board.");
        }
    }


    autoSolve();
    const sleep = ms => new Promise(r => setTimeout(r, ms));

    async function clickQueenCells() {
        for (const {
                row,
                col
            }
            of queens) {
            const cell = document.querySelector(`.grid [data-row="${row}"][data-col="${col}"]`);
            if (!cell) continue;

            cell.click();
            await sleep(250 + Math.random() * 150);
            cell.click();

            await sleep(600 + Math.random() * 500);
        }
    }

    clickQueenCells();

})();