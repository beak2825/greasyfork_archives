// ==UserScript==
// @name         Canvas Smooth Drag with Button (No Style)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  在指定頁面新增按鈕，點擊時模擬平滑滑鼠拖曳（無 CSS 樣式）
// @author       You
// @match        https://en.gamesaien.com/game/fruit_box/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533785/Canvas%20Smooth%20Drag%20with%20Button%20%28No%20Style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533785/Canvas%20Smooth%20Drag%20with%20Button%20%28No%20Style%29.meta.js
// ==/UserScript==

const COLS = 17;
const ROWS = 10;

const GRID_LEFT = 70;
const GRID_TOP = 75;
const GRID_RIGHT = 600;
const GRID_BOTTOM = 370;

const GRID_WIDTH = (GRID_RIGHT - GRID_LEFT) / (COLS - 1); // 每列間距
const GRID_HEIGHT = (GRID_BOTTOM - GRID_TOP) / (ROWS - 1); // 每行間距

(function () {
    'use strict';

    const startX = 200;
    const startY = 300;
    const endX = 800;
    const endY = 500;

    const waitForElements = setInterval(() => {
        const canvas = document.querySelector('canvas#canvas');
        const container = document.querySelector('div#animation_container');

        if (canvas && container && container.parentElement) {
            clearInterval(waitForElements);
            injectButton(container.parentElement, canvas);
            addCanvasClickLogger(canvas);
        }
    }, 500);

    function injectButton(parent, canvas) {
        const btn = document.createElement('button');
        btn.textContent = 'TEST1';
        btn.id = 'tm_test1_btn';
        parent.appendChild(btn);

        btn.addEventListener('click', async () => {
            console.log('[TEST1] 執行自動圈選');



            // 2X1
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 16; col++) {
                    let area = getGridRangeCorners(col, row, col + 2, row + 1);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 1x2
            for (let col = 0; col < 17; col++) {
                for (let row = 0; row < 9; row++) {
                    let area = getGridRangeCorners(col, row, col + 1, row + 2);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 3x1
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 15; col++) {
                    let area = getGridRangeCorners(col, row, col + 3, row + 1);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 1x3
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 17; col++) {
                    let area = getGridRangeCorners(col, row, col + 1, row + 3);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 2x2
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 16; col++) {
                    let area = getGridRangeCorners(col, row, col + 2, row + 2);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 4x1
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 14; col++) {
                    let area = getGridRangeCorners(col, row, col + 4, row + 1);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 1x4
            for (let row = 0; row < 7; row++) {
                for (let col = 0; col < 17; col++) {
                    let area = getGridRangeCorners(col, row, col + 1, row + 4);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 5x1
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 13; col++) {
                    let area = getGridRangeCorners(col, row, col + 5, row + 1);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 1x5
            for (let row = 0; row < 6; row++) {
                for (let col = 0; col < 17; col++) {
                    let area = getGridRangeCorners(col, row, col + 1, row + 5);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 3x2
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 15; col++) {
                    let area = getGridRangeCorners(col, row, col + 3, row + 2);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 2x3
            for (let row = 0; row < 8; row++) {
                for (let col = 0; col < 16; col++) {
                    let area = getGridRangeCorners(col, row, col + 2, row + 3);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 6x1
            for (let row = 0; row < 10; row++) {
                for (let col = 0; col < 12; col++) {
                    let area = getGridRangeCorners(col, row, col + 6, row + 1);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }

            // 1x6
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 17; col++) {
                    let area = getGridRangeCorners(col, row, col + 1, row + 6);
                    await simulateSmoothDrag(canvas, area.x1, area.y1, area.x2, area.y2);
                    await new Promise(resolve => setTimeout(resolve, 5));
                }
            }



            // 第一列校準
            // let r1 = getGridRangeCorners(0, 0, 1, 10);
            // simulateSmoothDrag(canvas, r1.x1, r1.y1, r1.x2, r1.y2);
            // for (let i = 1; i < 10; i++) {
            //    await new Promise(resolve => setTimeout(resolve, 250));
            //    let r2 = getGridRangeCorners(0, 0, 1, i);
            //    simulateSmoothDrag(canvas, r2.x1, r2.y1, r2.x2, r2.y2);
            // }

            // 最後一列校準
            // let r1 = getGridRangeCorners(16, 0, 17, 10);
            // simulateSmoothDrag(canvas, r1.x1, r1.y1, r1.x2, r1.y2);
            // for (let i = 1; i < 10; i++) {
            //     await new Promise(resolve => setTimeout(resolve, 1000));
            //     let r2 = getGridRangeCorners(16, 0, 17, i);
            //     simulateSmoothDrag(canvas, r2.x1, r2.y1, r2.x2, r2.y2);
            // }

            // 第一行校準
            // let r1 = getGridRangeCorners(0, 0, 17, 1);
            // simulateSmoothDrag(canvas, r1.x1, r1.y1, r1.x2, r1.y2);
            // for (let i = 1; i < 17; i++) {
            //     await new Promise(resolve => setTimeout(resolve, 1000));
            //     let r2 = getGridRangeCorners(0, 0, i, 1);
            //     simulateSmoothDrag(canvas, r2.x1, r2.y1, r2.x2, r2.y2);
            // }

            // 最後一行校準
            // let r1 = getGridRangeCorners(0, 9, 17, 10);
            // simulateSmoothDrag(canvas, r1.x1, r1.y1, r1.x2, r1.y2);
            // for (let i = 1; i < 17; i++) {
            //     await new Promise(resolve => setTimeout(resolve, 1000));
            //     let r2 = getGridRangeCorners(0, 9, i, 10);
            //     simulateSmoothDrag(canvas, r2.x1, r2.y1, r2.x2, r2.y2);
            // }
        });
    }

    function getGridCenter(col, row) {
        return {
            x: GRID_LEFT + col * GRID_WIDTH,
            y: GRID_TOP + row * GRID_HEIGHT
        };
    }

    function simulateSmoothDrag(canvas, startX, startY, endX, endY) {
        const steps = 1;
        const interval = 5;
        const rect = canvas.getBoundingClientRect();

        const getClientCoords = (x, y) => ({
            clientX: rect.left + x,
            clientY: rect.top + y
        });

        const dispatch = (type, x, y) => {
            const event = new MouseEvent(type, {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y,
                buttons: 1
            });
            canvas.dispatchEvent(event);
        };

        return new Promise(resolve => {
            // 1. 按下滑鼠
            const start = getClientCoords(startX, startY);
            dispatch('mousemove', start.clientX, start.clientY);
            dispatch('mousedown', start.clientX, start.clientY);

            // 2. 平滑拖曳
            const deltaX = (endX - startX) / steps;
            const deltaY = (endY - startY) / steps;
            let i = 0;

            const moveStep = () => {
                if (i <= steps) {
                    const cx = startX + deltaX * i;
                    const cy = startY + deltaY * i;
                    const pos = getClientCoords(cx, cy);
                    dispatch('mousemove', pos.clientX, pos.clientY);
                    i++;
                    setTimeout(moveStep, interval);
                } else {
                    // 3. 到達終點後抖動
                    const base = getClientCoords(endX, endY);
                    let j = 0;
                    const shake = () => {
                        const offset = (j % 2 === 0) ? 1 : -1;
                        dispatch('mousemove', base.clientX + offset, base.clientY);
                        j++;
                        if (j < 3) {
                            setTimeout(shake, interval);
                        } else {
                            // 4. 抖動結束，放開滑鼠並 resolve
                            dispatch('mouseup', base.clientX, base.clientY);
                            console.log('[Tampermonkey] 拖曳完成');
                            resolve();
                        }
                    };
                    shake();
                }
            };

            moveStep();
        });
    }

    function getGridRangeCorners(col1, row1, col2, row2) {
        const start = getGridCenter(col1, row1);
        const end = getGridCenter(col2, row2);
        return {
            x1: Math.min(start.x, end.x),
            y1: Math.min(start.y, end.y),
            x2: Math.max(start.x, end.x),
            y2: Math.max(start.y, end.y)
    };
}
})();

// 監聽 canvas 點擊，印出座標
function addCanvasClickLogger(canvas) {
    canvas.addEventListener('click', function (event) {
        const x = event.offsetX;
        const y = event.offsetY;
        console.log(`[Canvas 點擊] offsetX: ${x}, offsetY: ${y}`);
    });
}
