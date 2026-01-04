// ==UserScript==
// @name         炸飞机Hud
// @namespace    http://tampermonkey.net/
// @version      2025-04-19
// @description  计算炸飞机的机头概率
// @author       You
// @match        https://game.hullqin.cn/zfj/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hullqin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533403/%E7%82%B8%E9%A3%9E%E6%9C%BAHud.user.js
// @updateURL https://update.greasyfork.org/scripts/533403/%E7%82%B8%E9%A3%9E%E6%9C%BAHud.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let found = 0
    let board = Array.from(Array(10), () => new Array(10).fill(0))
    let pred = Array.from(Array(10), () => new Array(10).fill(0))
    let pred_head = Array.from(Array(10), () => new Array(10).fill(0))
    let pred_body = Array.from(Array(10), () => new Array(10).fill(0))
    let pred_null = Array.from(Array(10), () => new Array(10).fill(0))
    let square = Array.from(Array(10), () => new Array(10).fill(0))
    let table = document.createElement("table")
    table.style = "position: fixed; left: 5%; top: 10%; background: #ffffffaa; border-radius: 0.5em; padding: 0.5em; box-shadow: gray 4px 4px 10px"
    const gameStart = () => {
        return new Promise((resolve) => {
            setInterval(() => {
                if (document.getElementsByClassName("max-w-md").length === 2) resolve()
            }, 200)
        })
    }
    const getColor = (pred) => {
        let r = 195 - pred * 180
        let g = 255 - pred * pred * 180
        let b = 180 + pred * pred * 175
        return "rgb("+Math.floor(r)+","+Math.floor(g)+","+Math.floor(b)+")"
    }
    const update = (event) => {
        setTimeout((event) => {
            let x = (parseInt(event.srcElement.getAttribute("x")) + 50)/10
            let y = (parseInt(event.srcElement.getAttribute("y")) + 50)/10
            let fill = event.srcElement.getAttribute("fill")
            let type, type_chn
            switch (fill) {
                case "#23c343cc":
                    type = 2
                    type_chn = "机身"
                    break;
                case "#f53f3fdd":
                    type = 1
                    type_chn = "机头"
                    break;
                default:
                    type = 3
                    type_chn = "(未选中)"
            }
            console.log("[ZFJHud] 已点击位于("+x+","+y+")的方块，类型为:"+type_chn)
            readBoard()
            predict()
            writeBoard()
            if(type === 1) {
                console.log("[ZFJHud] 共计已找到%c"+found+"个机头", 'color:#f53f3f')
            }
        }, 20, event)
    }
    const readBoard = () => {
        let widget = document.getElementsByClassName("max-w-md")[1]
        found = 0
        Array.from(widget.children[0].children).forEach( (elem) => {
            if (elem.tagName === "rect") {
                if (elem.className === "prediction") {
                    elem.remove()
                } else {
                    let x = (parseInt(elem.getAttribute("x")) + 50) / 10
                    let y = (parseInt(elem.getAttribute("y")) + 50) / 10
                    let fill = elem.getAttribute("fill")
                    let type
                    switch (fill) {
                        case "#23c343cc":
                            type = 2
                            break;
                        case "#f53f3fdd":
                            type = 1
                            found++
                            break;
                        case "#ccc":
                            type = 3
                            break;
                        default:
                            type = 0
                    }
                    if (x % 1 === 0 && y % 1 === 0) board[x][y] = type;
                }
            }
        })
    }
    const writeBoard = () => {
        let html = ""
        let high = 0
        let high_square = 2147483648000
        let sq_x = 0
        let sq_y = 0
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                let square_l = pred_head[x][y] * pred_head[x][y] * 0.75 + pred_body[x][y] * pred_body[x][y] +
                    pred_null[x][y] * pred_null[x][y]
                square[x][y] = square_l
                if(pred[x][y] > high && board[x][y] !== 1) {
                    high = pred[x][y]
                }
                if(square_l < high_square) {
                    high_square = square_l
                    sq_x = x;
                    sq_y = y;
                }
            }
        }
        for (let x = 0; x < 10; x++) {
            html += "<tr><td style='text-align: center; font-size: smaller'>"+(10-x)+"</td>"
            for (let y = 0; y < 10; y++) {
                if (high === pred[y][x] && high > 0.05 && board[y][x] !== 1) html += "<td style='width: 1.4em; height: 1.4em; background: "+getColor(pred[y][x])+"; border: solid 2px red; opacity: 1'></td>"
                else if (high_square === square[y][x] && board[y][x] !== 1) html += "<td style='width: 1.4em; height: 1.4em; background: "+getColor(pred[y][x])+"; border: solid 2px blue; opacity: 0.8'></td>"
                else html += "<td style='width: 1.4em; height: 1.4em; background: "+getColor(pred[y][x])+"; opacity: 0.8;'></td>"
            }
            html += "</tr>"
        }
        html += "<tr><td></td>"
        const alphabet = ['A','B','C','D','E','F','G','H','I','J']
        for (let sq = 0; sq < 10; sq ++) {
            html += "<td style='text-align: center; font-size: smaller;'>"+alphabet[sq]+"</td>"
        }
        html += "</tr><tr><td colspan=\"11\"><b>总可能性：</b>"+allScenarios.length+"</td></tr>"
        html += "</tr><tr><td colspan=\"11\"><b>最高概率（红色）：</b>"+Math.round(high*1000)/10+"%</td></tr>"
        html += "</tr><tr><td colspan=\"11\"><b>最快排除（蓝色）：</b><br/>头"+
            Math.round(pred_head[sq_x][sq_y]/allScenarios.length*1000)/10+ "% 身"+
            Math.round(pred_body[sq_x][sq_y]/allScenarios.length*1000)/10+ "% 无"+
            Math.round(pred_null[sq_x][sq_y]/allScenarios.length*1000)/10+"%</td></tr>"
        table.innerHTML = html;
    }
    const GRID_SIZE = 10;         // 棋盘尺寸
    const NUM_PLANES = 3;         // 飞机数量
    const PLANE_PARTS = 10;       // 每个飞机的部件数（1头+9机身）
    const DIRECTIONS = {
        RIGHT: 0, UP: 1, LEFT: 2, DOWN: 3
    };
    const PLANE_OFFSETS = [
        // 向右方向的部件偏移
        [[0,0], [1,-2], [1,-1], [1,0], [1,1], [1,2], [2,0], [3,-1], [3,0], [3,1]],
        // 向上方向
        [[0,0], [-2,1], [-1,1], [0,1], [1,1], [2,1], [0,2], [-1,3], [0,3], [1,3]],
        // 向左方向
        [[0,0], [-1,-2], [-1,-1], [-1,0], [-1,1], [-1,2], [-2,0], [-3,-1], [-3,0], [-3,1]],
        // 向下方向
        [[0,0], [-2,-1], [-1,-1], [0,-1], [1,-1], [2,-1], [0,-2], [-1,-3], [0,-3], [1,-3]]
    ];

    /**
     * 检查单个飞机的有效性（是否完全在棋盘内）
     * @param {number} x - 机头X坐标 (0-9)
     * @param {number} y - 机头Y坐标 (0-9)
     * @param {number} dir - 飞机方向
     */
    const isValidPlane = (x, y, dir) => {
        for (let i = 0; i < PLANE_PARTS; i++) {
            const dx = PLANE_OFFSETS[dir][i][0];
            const dy = PLANE_OFFSETS[dir][i][1];
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || nx >= GRID_SIZE || ny < 0 || ny >= GRID_SIZE) return false;
        }
        return true;
    };

    /**
     * 检查场景有效性（所有飞机不重叠）
     * @param {Array} planes - 飞机配置数组
     */
    const isValidScenario = (planes) => {
        const grid = Array.from({length: GRID_SIZE}, () =>
            Array(GRID_SIZE).fill(false));

        for (const plane of planes) {
            for (let i = 0; i < PLANE_PARTS; i++) {
                const dx = PLANE_OFFSETS[plane.dir][i][0];
                const dy = PLANE_OFFSETS[plane.dir][i][1];
                const x = plane.x + dx;
                const y = plane.y + dy;
                if (grid[x][y]) return false;
                grid[x][y] = true;
            }
        }
        return true;
    };

    /**
     * 生成所有可能的有效场景（性能关键函数）
     */
    const generateAllScenarios = () => {
        const scenarios = [];

        // 生成所有可能的飞机配置
        const generate = (planes, count, xinit, yinit) => {
            if (count === NUM_PLANES) {
                scenarios.push([...planes]);
                return;
            }

            // 遍历所有可能的位置和方向
            for (let x = xinit; x < GRID_SIZE; x++) {
                for (let y = 0; y < GRID_SIZE; y++) {
                    if(x !== xinit || y > yinit) for (let dir = 0; dir < 4; dir++) {
                        if (!isValidPlane(x, y, dir)) continue;

                        // 创建新飞机配置
                        const newPlane = {x, y, dir};
                        const newPlanes = [...planes, newPlane];

                        // 检查碰撞
                        if (isValidScenario(newPlanes)) {
                            generate(newPlanes, count + 1, x, y);
                        }
                    }
                }
            }
        };

        generate([], 0,0,0);
        return scenarios;
    };
    let allScenarios = [];

    /**
     * 根据棋盘状态过滤有效场景
     * @param {Array} scenarios - 所有可能场景
     */
    const filterScenarios = (scenarios) => {
        return scenarios.filter(scenario => {
            const grid = Array.from({length: GRID_SIZE}, () =>
                Array(GRID_SIZE).fill(0)); // 0:空 1:头 2:身

            // 标记场景中的飞机部件
            for (const plane of scenario) {
                // 标记机头
                grid[plane.x][plane.y] = 1;
                // 标记机身
                for (let i = 1; i < PLANE_PARTS; i++) {
                    const dx = PLANE_OFFSETS[plane.dir][i][0];
                    const dy = PLANE_OFFSETS[plane.dir][i][1];
                    const x = plane.x + dx;
                    const y = plane.y + dy;
                    if (x >=0 && x < GRID_SIZE && y >=0 && y < GRID_SIZE) {
                        grid[x][y] = 2;
                    }
                }
            }

            // 验证棋盘约束
            for (let x = 0; x < GRID_SIZE; x++) {
                for (let y = 0; y < GRID_SIZE; y++) {
                    const state = board[x][y];
                    if (state === 0) continue; // 未知格子不验证

                    if (state === 1 && grid[x][y] !== 1) return false;
                    if (state === 2 && grid[x][y] !== 2) return false;
                    if (state === 3 && grid[x][y] !== 0) return false;
                }
            }
            return true;
        });
    };

    /**
     * 主预测函数
     * @returns {Array} pred - 10x10预测概率数组
     */
    const predict = () => {
        const validScenarios = filterScenarios(allScenarios);
        allScenarios = validScenarios;
        if (validScenarios.length === 0) return pred;
        const total = validScenarios.length;
        for (let x=0;x<10;x++) for (let y=0;y<10;y++) {
            pred[x][y] = 0
            pred_head[x][y] = 0
            pred_body[x][y] = 0
            pred_null[x][y] = 0
        }
        // 统计各格子出现次数
        validScenarios.forEach(scenario => {
            const grid = Array.from({length: GRID_SIZE}, () =>
                Array(GRID_SIZE).fill(0));

            // 标记当前场景
            scenario.forEach(plane => {
                grid[plane.x][plane.y] = 1; // 标记机头
                for (let i = 1; i < PLANE_PARTS; i++) {
                    const dx = PLANE_OFFSETS[plane.dir][i][0];
                    const dy = PLANE_OFFSETS[plane.dir][i][1];
                    const x = plane.x + dx;
                    const y = plane.y + dy;
                    if (x >=0 && x < GRID_SIZE && y >=0 && y < GRID_SIZE) {
                        grid[x][y] = 2; // 标记机身
                    }
                }
            });
            // 更新统计
            for (let x = 0; x < GRID_SIZE; x++) {
                for (let y = 0; y < GRID_SIZE; y++) {
                    if(grid[x][y] === 1) {
                        pred[x][y] += 1/total;
                        pred_head[x][y] ++
                    }
                    else if(grid[x][y] === 2) pred_body[x][y] ++
                    else pred_null[x][y] ++
                }
            }
        });


    };
    const gameEnd = () => {
        return new Promise((resolve) => {
            setInterval(() => {
                if (document.getElementsByClassName("max-w-md").length !== 2) resolve()
            }, 200)
        })
    }
    const gameRunning = () => {
        console.log("[ZFJHud] 游戏已开始！")
        let widget = document.getElementsByClassName("max-w-md")[1]
        widget.addEventListener("click",(event) => {update(event)},false)
        document.body.append(table)
        allScenarios = generateAllScenarios()
        readBoard()
        predict()
        writeBoard()
        gameEnd().then(() => {
            table.innerHTML = "<tr><td>正在等待游戏开始</td></tr><tr><td>游戏刚开始时需要约5秒加载情况，请耐心等待</td></tr>"
            gameStart().then(gameRunning)
        })
    }
    table.innerHTML = "<tr><td>正在等待游戏开始</td></tr><tr><td>游戏刚开始时需要约5秒加载情况，请耐心等待</td></tr>"
    gameStart().then(gameRunning)
    // Your code here...
})();