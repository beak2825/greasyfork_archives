// ==UserScript==
// @name         gooboo画廊形状移动脚本
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  统计画廊形状，点击形状可以自动移动,增加全自动按钮
// @author       zding
// @match        *://*/gooboo/
// @match        https://gooboo.g8hh.com.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533479/gooboo%E7%94%BB%E5%BB%8A%E5%BD%A2%E7%8A%B6%E7%A7%BB%E5%8A%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/533479/gooboo%E7%94%BB%E5%BB%8A%E5%BD%A2%E7%8A%B6%E7%A7%BB%E5%8A%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MODES = [
        { name: 'LS', sortAsc: true,  stopLow: true,  description: '最少优先, 低资源停止' },
        { name: 'LC', sortAsc: true,  stopLow: false, description: '最少优先, 低资源继续' },
        { name: 'MS', sortAsc: false, stopLow: true,  description: '最多优先, 低资源停止' },
        { name: 'MC', sortAsc: false, stopLow: false, description: '最多优先, 低资源继续' }
    ];
    const MODE_STORAGE_KEY = 'gooboo_gallery_sort_mode_v1';
    let currentModeIndex = 0;

    const CONFIG = {
        MOVE_DELAY_MS: 10,
        DOM_UPDATE_WAIT_MS: 20,
        ENABLE_STATE_SYNC_CHECK: false,
        AUTO_SORT_INTERVAL_MS: 350,
        MIN_SHAPE_COUNT_FOR_AUTO_SORT: 5,//最低整理数
        REROLL_COST_THRESHOLD: 36
    };

    const MDI_PREFIX = "mdi-";
    const TEXT_COLOR_SUFFIX = "--text";
    const GREY_COLOR = 'grey';
    const SHAPE_BG_SELECTOR = ".shape-bg";
    const CELL_SELECTOR = "td[id^='galleryShape_']";
    const TABLE_LG_SELECTOR = ".mx-auto.shape-table-lg";
    const TABLE_SM_SELECTOR = ".mx-auto.shape-table-sm";
    const ALL_CELLS_SELECTOR = '.shape-cell';
    const CELL_ID_REGEX = /galleryShape_(\d+)_(\d+)/;
    const ALLOWED_SHAPES = ['circle', 'rectangle', 'triangle', 'star', 'ellipse', 'heart', 'square', 'octagon', 'pentagon', 'hexagon'];
    const GALLERY_MOTIVATION_KEY = 'gallery_motivation';
    const AUTO_SORT_BUTTON_ID = 'auto-sort-button';
    const STATS_CONTAINER_CLASS = 'shape-stats';
    const SHAPE_CHIP_CLASS = 'shape-chip';

    let isAutoSorting = false;
    let autoSortIntervalId = null;

    const coordsToString = ({ x, y }) => `${x},${y}`;
    const stringToCoords = (str) => {
        const [x, y] = str.split(',').map(Number);
        return { x, y };
    };
    const coordsToId = ({ x, y }) => `galleryShape_${x}_${y}`;
    const getAdjacentCoords = ({ x, y }) => [{ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 }];
    const manhattanDistance = (coords1, coords2) => Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);

    function applyModeSettings(modeIndex) {
        const mode = MODES[modeIndex];
        if (mode) {
            CONFIG.SORT_ASCENDING = mode.sortAsc;
            CONFIG.STOP_ON_CURRENCY_LOW = mode.stopLow;
            console.log(`应用模式: ${mode.name} (${mode.description})`);
        } else {
            console.warn(`无效的模式索引: ${modeIndex}, 使用默认模式 LS`);
            applyModeSettings(MODES.findIndex(m => m.name === 'LS'));
        }
    }

    let savedModeIndex = GM_getValue(MODE_STORAGE_KEY, MODES.findIndex(m => m.name === 'MC'));
    if (typeof savedModeIndex !== 'number' || savedModeIndex < 0 || savedModeIndex >= MODES.length) {
        console.warn(`存储的模式索引无效 (${savedModeIndex}), 重置为默认模式 LS`);
        savedModeIndex = MODES.findIndex(m => m.name === 'LS');
        GM_setValue(MODE_STORAGE_KEY, savedModeIndex);
    }
    currentModeIndex = savedModeIndex;
    applyModeSettings(currentModeIndex);

    let modeButtonElement = null;
    function updateModeButtonDisplay() {
        if (modeButtonElement) {
            const currentMode = MODES[currentModeIndex];
            modeButtonElement.textContent = `${currentMode.name}`;
            let tooltipTitle = `点击切换模式. 当前: ${currentMode.name}\n\n可用模式:\n`;
            MODES.forEach((mode, index) => {
                const prefix = (index === currentModeIndex) ? '-> ' : '   ';
                tooltipTitle += `${prefix}${mode.name}: ${mode.description}\n`;
            });
            modeButtonElement.title = tooltipTitle.trim();
        }
    }
    function switchMode() {
        currentModeIndex = (currentModeIndex + 1) % MODES.length;
        applyModeSettings(currentModeIndex);
        GM_setValue(MODE_STORAGE_KEY, currentModeIndex);
        updateModeButtonDisplay();
    }
    function createModeButton() {
        const button = document.createElement('button');
        button.className = 'v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default';
        button.style.margin = '5px';
        button.id = 'mode-switch-button';
        button.style.backgroundColor = '#ef6c00';
        button.style.color = 'white';
        button.addEventListener('click', switchMode);
        modeButtonElement = button;
        updateModeButtonDisplay();
        return button;
    }

    function checkAndUpdateStats() {
        const tableElement = document.querySelector(TABLE_LG_SELECTOR) || document.querySelector(TABLE_SM_SELECTOR);
        if (!tableElement) return;

        const tableParent = tableElement.parentNode;
        let statsContainer = tableParent.querySelector(`.${STATS_CONTAINER_CLASS}`);

        if (!statsContainer) {
            statsContainer = document.createElement("div");
            statsContainer.className = `d-flex flex-wrap justify-center align-center ma-1 ${STATS_CONTAINER_CLASS}`;
            const autoButton = createAutoButton();
            statsContainer.appendChild(autoButton);
            const modeButton = createModeButton();
            statsContainer.appendChild(modeButton);
            tableParent.insertBefore(statsContainer, tableElement.nextSibling);
        }

        const shapeCounts = {};
        const cells = tableElement.querySelectorAll(CELL_SELECTOR);

        cells.forEach(cell => {
            const hasShapeBackground = cell.querySelector(SHAPE_BG_SELECTOR) !== null;
            const iconElement = cell.querySelector("i.mdi");
            if (iconElement) {
                const classList = iconElement.classList;
                let color = null;
                let shape = null;
                let skipThisIcon = false;
                for (const className of classList) {
                    if (className.startsWith(MDI_PREFIX)) {
                        shape = className.substring(MDI_PREFIX.length);
                        if (!ALLOWED_SHAPES.includes(shape)) {
                            skipThisIcon = true;
                            break;
                        }
                    } else if (className.endsWith(TEXT_COLOR_SUFFIX)) {
                        color = className.slice(0, -TEXT_COLOR_SUFFIX.length).replace(/^light-/, '');
                    }
                }
                if (skipThisIcon) return;
                if (!hasShapeBackground) {
                    color = GREY_COLOR;
                }
                if (color && shape) {
                    const key = `${color}-${shape}`;
                    shapeCounts[key] = (shapeCounts[key] || 0) + 1;
                }
            }
        });

        const existingChips = Array.from(statsContainer.querySelectorAll(`.${SHAPE_CHIP_CLASS}`));
        const processedKeys = new Set();

        existingChips.forEach(chip => {
            const shape = chip.dataset.shape;
            const color = chip.dataset.color;
            const key = `${color}-${shape}`;
            const count = shapeCounts[key] || 0;
            const countSpan = chip.querySelector("span");
             if (countSpan) {
                countSpan.textContent = count;
            }
            if (count > 0) {
                 processedKeys.add(key);
            } else {
                 // Optionally remove the chip if count is 0
                 // chip.parentNode.remove(); // This removes the badge wrapper
            }
        });

        for (const key in shapeCounts) {
            if (Object.hasOwnProperty.call(shapeCounts, key) && !processedKeys.has(key)) {
                const [color, shape] = key.split("-");
                const count = shapeCounts[key];

                // Merged createStatElement logic
                const badge = document.createElement("span");
                badge.className = "v-badge v-badge--bordered v-badge--dot v-badge--overlap theme--dark";
                const chip = document.createElement("div");
                const isGrey = color === GREY_COLOR;
                chip.className = `v-chip v-chip--label v-size--small px-2 balloon-text-dynamic theme--dark darken-3 ${color} ma-1 ${SHAPE_CHIP_CLASS}`;
                chip.setAttribute("aria-haspopup", "true");
                chip.setAttribute("aria-expanded", "false");
                chip.dataset.shape = shape;
                chip.dataset.color = color;
                const icon = document.createElement("i");
                icon.className = `v-icon notranslate mr-2 mdi ${MDI_PREFIX}${shape} theme--dark ${isGrey ? 'shape-icon-disabled' : color + TEXT_COLOR_SUFFIX}`;
                icon.setAttribute("aria-hidden", "true");
                icon.setAttribute("aria-label", shape);
                icon.style.fontSize = "16px";
                const countSpan = document.createElement("span");
                countSpan.textContent = count;
                chip.append(icon, countSpan);
                if (!isGrey) {
                    chip.addEventListener("click", () => triggerSort(chip.dataset.shape));
                }
                badge.appendChild(chip);
                statsContainer.appendChild(badge);
            }
        }
    }

    function checkGameBoardExists() {
        return document.querySelector(ALL_CELLS_SELECTOR) !== null;
    }

    const simulateDragDrop = async (sourceId, targetId) => {
        if (!checkGameBoardExists()) {
            stopAutoSort();
            return false;
        }
        if (getCurrencyValue(GALLERY_MOTIVATION_KEY) < 1) {
             if (CONFIG.STOP_ON_CURRENCY_LOW) {
               stopAutoSort();
            }
            return false;
        }

        const sourceElement = document.getElementById(sourceId);
        const targetElement = document.getElementById(targetId);

        if (!sourceElement || !targetElement) {
            return false;
        }

        try {
            const dataTransfer = new DataTransfer();
            sourceElement.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: dataTransfer }));
            targetElement.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer: dataTransfer }));
            targetElement.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dataTransfer }));
            sourceElement.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer: dataTransfer }));
            return true;
        } catch (error) {
            return false;
        }
    };

    const getShapeCells = (shapeName) => {
        const iconClass = `${MDI_PREFIX}${shapeName}`;
        return Array.from(document.querySelectorAll(`td${ALL_CELLS_SELECTOR}`))
            .filter(cell => cell.querySelector(`i.${iconClass}`) && cell.querySelector(SHAPE_BG_SELECTOR))
            .map(cell => {
                const match = cell.id.match(CELL_ID_REGEX);
                return match ? { id: cell.id, x: parseInt(match[1]), y: parseInt(match[2]) } : null;
            })
            .filter(Boolean);
    };

    const getAllCellCoordsSet = () => {
        return new Set(
            Array.from(document.querySelectorAll(ALL_CELLS_SELECTOR))
                .map(cell => {
                    const match = cell.id.match(CELL_ID_REGEX);
                    return match ? coordsToString({ x: parseInt(match[1]), y: parseInt(match[2]) }) : null;
                })
                .filter(Boolean)
        );
    };

    const isConnected = (coordSet) => {
        if (coordSet.size <= 1) return true;
        const startNode = coordSet.values().next().value;
        const visited = new Set([startNode]);
        const queue = [startNode];
        while (queue.length > 0) {
            const currentCoordString = queue.shift();
            const currentCoords = stringToCoords(currentCoordString);
            for (const adjacentCoords of getAdjacentCoords(currentCoords)) {
                const adjacentCoordString = coordsToString(adjacentCoords);
                if (coordSet.has(adjacentCoordString) && !visited.has(adjacentCoordString)) {
                    visited.add(adjacentCoordString);
                    queue.push(adjacentCoordString);
                }
            }
        }
        return visited.size === coordSet.size;
    };

    const calculateCenterOfMass = (coordSet) => {
        if (coordSet.size === 0) return null;
        let sumX = 0, sumY = 0;
        coordSet.forEach(coordString => {
            const { x, y } = stringToCoords(coordString);
            sumX += x;
            sumY += y;
        });
        return {
            x: Math.round(sumX / coordSet.size),
            y: Math.round(sumY / coordSet.size)
        };
    };

    const findComponents = (coordSet) => {
        const components = [];
        const visited = new Set();
        coordSet.forEach(startNode => {
            if (!visited.has(startNode)) {
                const currentComponent = new Set();
                const queue = [startNode];
                visited.add(startNode);
                currentComponent.add(startNode);
                while (queue.length > 0) {
                    const currentCoordString = queue.shift();
                    const currentCoords = stringToCoords(currentCoordString);
                    for (const adjacentCoords of getAdjacentCoords(currentCoords)) {
                        const adjacentCoordString = coordsToString(adjacentCoords);
                        if (coordSet.has(adjacentCoordString) && !visited.has(adjacentCoordString)) {
                            visited.add(adjacentCoordString);
                            currentComponent.add(adjacentCoordString);
                            queue.push(adjacentCoordString);
                        }
                    }
                }
                components.push(currentComponent);
            }
        });
        return components;
    };

    function findBestMove(targetShapeCoordsSet, allCellCoordsSet, centerCoords, componentMap) {
        let bestMove = null;
        let neutralMove = null;
        let maxScore = -Infinity;
        const CONNECTIVITY_BONUS = 1000; // Defined locally or pass as argument if needed elsewhere

        for (const sourceCoordString of targetShapeCoordsSet) {
            const sourceCoords = stringToCoords(sourceCoordString);
            const currentDistance = manhattanDistance(sourceCoords, centerCoords);
            const sourceComponentId = componentMap.get(sourceCoordString);

            for (const adjacentCoords of getAdjacentCoords(sourceCoords)) {
                const adjacentCoordString = coordsToString(adjacentCoords);
                if (allCellCoordsSet.has(adjacentCoordString) && !targetShapeCoordsSet.has(adjacentCoordString)) {
                    const targetCoords = adjacentCoords;
                    const newDistance = manhattanDistance(targetCoords, centerCoords);
                    const distanceReduction = currentDistance - newDistance;
                    let connectivityBonus = 0;

                    for (const neighborCoords of getAdjacentCoords(targetCoords)) {
                        const neighborCoordString = coordsToString(neighborCoords);
                        if (targetShapeCoordsSet.has(neighborCoordString) &&
                            neighborCoordString !== sourceCoordString &&
                            componentMap.get(neighborCoordString) !== sourceComponentId)
                        {
                            connectivityBonus = CONNECTIVITY_BONUS;
                            break;
                        }
                    }
                    const totalScore = distanceReduction + connectivityBonus;

                    if (totalScore > maxScore) {
                        maxScore = totalScore;
                        bestMove = {
                            srcId: coordsToId(sourceCoords),
                            tgtId: coordsToId(targetCoords),
                            srcStr: sourceCoordString,
                            tgtStr: adjacentCoordString,
                            score: totalScore,
                            bonus: connectivityBonus > 0
                        };
                    } else if (totalScore === 0 && !neutralMove) {
                         neutralMove = {
                            srcId: coordsToId(sourceCoords),
                            tgtId: coordsToId(targetCoords),
                            srcStr: sourceCoordString,
                            tgtStr: adjacentCoordString,
                            score: 0,
                            bonus: false
                        };
                    }
                }
            }
        }
        return (bestMove && maxScore > 0) ? bestMove : neutralMove;
    }

    async function triggerSort(shapeName) {
        try {
            const initialShapeCells = getShapeCells(shapeName);
            if (!initialShapeCells || initialShapeCells.length === 0) return;

            const allCellCoordsSet = getAllCellCoordsSet();
            if (allCellCoordsSet.size === 0) return;

            let targetShapeCoordsSet = new Set(initialShapeCells.map(cell => coordsToString({ x: cell.x, y: cell.y })));

            if (isConnected(targetShapeCoordsSet)) return;

            const centerCoords = calculateCenterOfMass(targetShapeCoordsSet);
            if (!centerCoords) return;

            const history = [];
            let iterations = 0;
            const MAX_ITERATIONS_FACTOR = 80; // Defined locally
            const maxIterations = targetShapeCoordsSet.size * MAX_ITERATIONS_FACTOR;

            while (!isConnected(targetShapeCoordsSet)) {
                iterations++;
                if (iterations > maxIterations) return;

                if (getCurrencyValue(GALLERY_MOTIVATION_KEY) < 1) {
                     if (CONFIG.STOP_ON_CURRENCY_LOW) stopAutoSort();
                    return;
                }

                const components = findComponents(targetShapeCoordsSet);
                const componentMap = new Map(components.flatMap((componentSet, index) =>
                    [...componentSet].map(coordStr => [coordStr, index])
                ));

                const move = findBestMove(targetShapeCoordsSet, allCellCoordsSet, centerCoords, componentMap);

                if (!move) {
                    if (isConnected(targetShapeCoordsSet)) break;
                    return;
                }

                const success = await simulateDragDrop(move.srcId, move.tgtId);
                if (!success) return;

                if (CONFIG.DOM_UPDATE_WAIT_MS > 0) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.DOM_UPDATE_WAIT_MS));
                }

                targetShapeCoordsSet.delete(move.srcStr);
                targetShapeCoordsSet.add(move.tgtStr);
                history.push({ sourceId: move.srcId, targetId: move.tgtId });

                if (CONFIG.ENABLE_STATE_SYNC_CHECK) {
                    const currentDomShapeCells = getShapeCells(shapeName);
                    const domCoordsSet = new Set(currentDomShapeCells.map(c => coordsToString({ x: c.x, y: c.y })));
                    if (domCoordsSet.size !== targetShapeCoordsSet.size || ![...domCoordsSet].every(c => targetShapeCoordsSet.has(c))) {
                        targetShapeCoordsSet = domCoordsSet;
                        if (isConnected(targetShapeCoordsSet)) break;
                    }
                }

                if (CONFIG.MOVE_DELAY_MS > 0) {
                    await new Promise(resolve => setTimeout(resolve, CONFIG.MOVE_DELAY_MS));
                }
            }
        } catch (error) {
            console.error(`Sort error for ${shapeName}:`, error);
        }
    }

    function createAutoButton() {
        const button = document.createElement('button');
        button.className = 'v-btn v-btn--is-elevated v-btn--has-bg theme--light v-size--default primary';
        button.style.margin = '5px';
        button.textContent = '自动';
        button.id = AUTO_SORT_BUTTON_ID;
        button.addEventListener('click', toggleAutoSort);
        return button;
    }

    function toggleAutoSort() {
        if (isAutoSorting) {
            stopAutoSort();
        } else {
            startAutoSort();
        }
    }

    function startAutoSort() {
        if (isAutoSorting) return;

        isAutoSorting = true;
        const autoButton = document.getElementById(AUTO_SORT_BUTTON_ID);
        if (autoButton) autoButton.textContent = '停止';

        let isCurrentlySorting = false;

        const autoSortIteration = async () => {
            if (!isAutoSorting) return;
            if (!checkGameBoardExists()) {
                stopAutoSort();
                return;
            }
            const currentMotivation = getCurrencyValue(GALLERY_MOTIVATION_KEY);
            if (currentMotivation < 1 && CONFIG.STOP_ON_CURRENCY_LOW) {
                 stopAutoSort();
                 return;
            }
            if (isCurrentlySorting) return;

            isCurrentlySorting = true;

            try {
                // Merged calculateMovableShapeStats logic
                const gridStats = {};
                const tableElement = document.querySelector(TABLE_LG_SELECTOR) || document.querySelector(TABLE_SM_SELECTOR);
                if (tableElement) {
                    const cells = tableElement.querySelectorAll(CELL_SELECTOR);
                    cells.forEach(cell => {
                        const iconElement = cell.querySelector("i.mdi");
                        const hasShapeBackground = cell.querySelector(SHAPE_BG_SELECTOR) !== null;
                        if (iconElement && hasShapeBackground) {
                            const shape = Array.from(iconElement.classList)
                                            .find(c => c.startsWith(MDI_PREFIX))
                                            ?.substring(MDI_PREFIX.length);
                            if (shape && ALLOWED_SHAPES.includes(shape)) {
                                gridStats[shape] = (gridStats[shape] || 0) + 1;
                            }
                        }
                    });
                }
                // End of merged logic

                const eligibleShapes = Object.entries(gridStats)
                    .filter(([, count]) => count >= CONFIG.MIN_SHAPE_COUNT_FOR_AUTO_SORT);

                if (CONFIG.SORT_ASCENDING) {
                    eligibleShapes.sort((a, b) => {
                        if (a[1] !== b[1]) return a[1] - b[1];
                        return ALLOWED_SHAPES.indexOf(a[0]) - ALLOWED_SHAPES.indexOf(b[0]);
                    });
                } else {
                    eligibleShapes.sort((a, b) => {
                        if (a[1] !== b[1]) return b[1] - a[1];
                        return ALLOWED_SHAPES.indexOf(a[0]) - ALLOWED_SHAPES.indexOf(b[0]);
                    });
                }
                if (eligibleShapes.length > 0) {
                    const bestShapeToArrange = eligibleShapes[0][0];
                    await triggerSort(bestShapeToArrange);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    if (getCurrencyValue(GALLERY_MOTIVATION_KEY) > 1) {
                         clickShapeOnBoard(bestShapeToArrange);
                    }
                    await new Promise(resolve => setTimeout(resolve, 300));
                } else {
                    if (canAffordReroll()) {
                        buyShapeReroll();
                        await new Promise(resolve => setTimeout(resolve, 300));
                    } else {
                        if (CONFIG.STOP_ON_CURRENCY_LOW) {
                            stopAutoSort();
                        }
                    }
                }
            } catch (error) {
                 console.error("Auto sort iteration error:", error);
            } finally {
                isCurrentlySorting = false;
            }
        };

        autoSortIteration(); // Run once immediately
        autoSortIntervalId = setInterval(autoSortIteration, CONFIG.AUTO_SORT_INTERVAL_MS);
    }

    function stopAutoSort() {
        if (!isAutoSorting) return;
        clearInterval(autoSortIntervalId);
        autoSortIntervalId = null;
        isAutoSorting = false;
        const autoButton = document.getElementById(AUTO_SORT_BUTTON_ID);
        if (autoButton) autoButton.textContent = '自动';
    }

    function clickShapeOnBoard(shapeName) {
        const tableElement = document.querySelector(TABLE_LG_SELECTOR) || document.querySelector(TABLE_SM_SELECTOR);
        if (!tableElement) return;
        const cells = tableElement.querySelectorAll(CELL_SELECTOR);
        for (const cell of cells) {
            const iconElement = cell.querySelector(`i.${MDI_PREFIX}${shapeName}`);
            const hasShapeBackground = cell.querySelector(SHAPE_BG_SELECTOR) !== null;
            if (iconElement && hasShapeBackground) {
                cell.click();
                return;
            }
        }
    }

    function buyShapeReroll() {
        const buttons = document.querySelectorAll('button.v-btn');
        for (const button of buttons) {
            if (button.querySelector('.mdi-cached')) {
                 if (button.disabled || button.classList.contains('v-btn--disabled')) {
                    return;
                }
                button.click();
                return;
            }
        }
    }

    function canAffordReroll() {
        return getCurrencyValue(GALLERY_MOTIVATION_KEY) >= CONFIG.REROLL_COST_THRESHOLD;
    }

    function getCurrencyValue(currencyKey = GALLERY_MOTIVATION_KEY) {
        try {
            const vueInstanceElement = document.querySelector('.v-application') || document.body;
            const vueInstance = vueInstanceElement ? vueInstanceElement.__vue__ : null;
            if (vueInstance && vueInstance.$store && vueInstance.$store.state && vueInstance.$store.state.currency && vueInstance.$store.state.currency[currencyKey]) {
                return vueInstance.$store.state.currency[currencyKey].value || 0;
            }
            return 0;
        } catch (error) {
            return 0;
        }
    }

    const statsUpdateIntervalId = setInterval(checkAndUpdateStats, 500);

    console.log("Gooboo 画廊形状移动脚本已加载。");

})();
