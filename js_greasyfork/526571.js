// ==UserScript==
// @name         이계돌 게임 색칠 기능 (단축키)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  이계돌 게임에서 합이 10이 되는 셀을 #baccba 색으로 칠합니다. Ctrl+Shift+X 단축키로 기능을 제어합니다.
// @match        https://sedol.wakttu.kr/*
// @grant        none
// @icon         https://sedol.wakttu.kr/assets/segu.svg
// @downloadURL https://update.greasyfork.org/scripts/526571/%EC%9D%B4%EA%B3%84%EB%8F%8C%20%EA%B2%8C%EC%9E%84%20%EC%83%89%EC%B9%A0%20%EA%B8%B0%EB%8A%A5%20%28%EB%8B%A8%EC%B6%95%ED%82%A4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526571/%EC%9D%B4%EA%B3%84%EB%8F%8C%20%EA%B2%8C%EC%9E%84%20%EC%83%89%EC%B9%A0%20%EA%B8%B0%EB%8A%A5%20%28%EB%8B%A8%EC%B6%95%ED%82%A4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = false;
    let observer = null;

    console.log("이계돌 게임 색칠 스크립트가 로드되었습니다.");

    function toggleFeature() {
        isEnabled = !isEnabled;
        console.log("색칠 기능:", isEnabled ? "켜짐" : "꺼짐");

        const grid = findGrid();
        if (isEnabled) {
            if (grid) {
                highlightCombinations(grid);
                startObserving();
            }
        } else {
            stopObserving();
            resetColors();
        }
    }

    function findGrid() {
        const grid = document.querySelector('div.sc-jZCRgm.iCNSqr[style*="display: grid"]');
        return grid;
    }

    function resetColors() {
        const grid = findGrid();
        if (grid) {
            const cells = Array.from(grid.children);
            cells.forEach(cell => cell.style.backgroundColor = '');
        }
    }

    function highlightCombinations(grid) {
        if (!grid || !isEnabled) return;

        const cells = Array.from(grid.children);
        const totalCells = cells.length;
        const numCols = 18;
        const numRows = Math.ceil(totalCells / numCols);

        cells.forEach(cell => cell.style.backgroundColor = '');

        const gridArray = [];
        for (let i = 0; i < numRows; i++) {
            gridArray.push(cells.slice(i * numCols, (i + 1) * numCols));
        }

        let combinationsFound = 0;
        for (let startRow = 0; startRow < numRows; startRow++) {
            for (let startCol = 0; startCol < numCols; startCol++) {
                for (let endRow = startRow; endRow < numRows; endRow++) {
                    for (let endCol = startCol; endCol < numCols; endCol++) {
                        let sum = 0;
                        for (let r = startRow; r <= endRow; r++) {
                            for (let c = startCol; c <= endCol; c++) {
                                if (r < gridArray.length && c < gridArray[r].length) {
                                    const cellValue = parseInt(gridArray[r][c].textContent) || 0;
                                    sum += cellValue;
                                }
                            }
                        }
                        if (sum === 10) {
                            combinationsFound++;
                            for (let r = startRow; r <= endRow; r++) {
                                for (let c = startCol; c <= endCol; c++) {
                                    if (r < gridArray.length && c < gridArray[r].length) {
                                        gridArray[r][c].style.backgroundColor = 'rgba(186, 204, 186)';
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log(`총 ${combinationsFound}개의 조합을 찾아 색칠했습니다.`);
    }

    function startObserving() {
        if (observer) return;
        observer = new MutationObserver(() => {
            const grid = findGrid();
            if (grid) highlightCombinations(grid);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopObserving() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    // 단축키 이벤트 리스너
    document.addEventListener('keydown', function(event) {
          // Check if only Ctrl+Shift+X are pressed
        if (event.ctrlKey && event.shiftKey && event.key === 'X' && !event.altKey && !event.metaKey) {
            toggleFeature();
        }
    });

    function initializeScript() {
        // 초기화 시 바로 실행하지 않고 단축키로만 작동
        console.log("단축키 (Ctrl+Shift+X)로 색칠 기능을 켜고 끌 수 있습니다.");
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initializeScript();
    } else {
        window.addEventListener('DOMContentLoaded', initializeScript);
    }
})();
