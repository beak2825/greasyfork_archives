// ==UserScript==
// @name         Maze Map
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Maze 的路线地图
// @author       Lemon
// @match        https://maze.hancel.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hancel.org
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465759/Maze%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/465759/Maze%20Map.meta.js
// ==/UserScript==

const maxWidth = 750;
let width = 20;
let x = 0;
let y = 0;

(function () {
    const originFetch = fetch;
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            if (response.status != 200) {
                return response;
            }
            if(url === '/api/maze/last'){
                let res = await getResponse(response);
                create(res);
                return response;
            }
            if (url === '/api/maze/move/up'){
                y--;
                let res = await getResponse(response);
                buildMap(res.mazeView);
                return response;
            }
            if (url === '/api/maze/move/down'){
                y++;
                let res = await getResponse(response);
                buildMap(res.mazeView);
                return response;
            }
            if (url === '/api/maze/move/left'){
                x--;
                let res = await getResponse(response);
                buildMap(res.mazeView);
                return response;
            }
            if (url === '/api/maze/move/right'){
                x++;
                let res = await getResponse(response);
                buildMap(res.mazeView);
                return response;
            }
            return response;
        });
    };
})();

// 解析响应值
function getResponse(response) {
    const responseClone = response.clone();
    return responseClone.json();
}

// 创建画布
function create(res) {
    var canvas = document.createElement("canvas");
    canvas.id = "map-canvas";
    canvas.style['z-index'] = 999;
    canvas.style.border = "2px solid gray";
    canvas.style.position = 'absolute';
    canvas.style.left = 0;
    canvas.style.bottom = 0;
    if (res.size > 50) {
        width = (maxWidth / res.size).toFixed(2);
    }
    canvas.width = res.size * width;
    canvas.height = res.size * width;
    document.body.appendChild(canvas);
    // 恢复之前走过的路
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = 'white';
    Object.keys(res.mazeCount).forEach(e => {
        let arrays = e.split('-');
        ctx.fillRect(arrays[1] * width, arrays[0] * width, width, width);
    });
    // 设置起点
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, width, width);
    // 设置当前位置
    ctx.fillStyle = '#ffc107';
    ctx.fillRect(res.playerCol * width, res.playerRow * width, width, width);
    x = res.playerCol;
    y = res.playerRow;
    buildMap(res.mazeView);
}

// 构建地图
function buildMap(aroundArrays) {
    var canvas = document.getElementById("map-canvas");
    var ctx = canvas.getContext("2d");
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            mark(i, j, ctx, aroundArrays[j][i]);
        }
    }
}

// 标记单元格
function mark(i, j, ctx, e) {
    if (i == 1 && j == 1) {
        ctx.fillStyle = '#ffc107';
    } else {
        setColor(ctx, e);
    }
    i = i - 1 + x;
    j = j - 1 + y;
    if (i < 0 || j < 0) {
        return;
    }
    ctx.fillRect(i * width, j * width, width, width);
}

// 设置对应的颜色,有优先级需要注意顺序
function setColor(ctx, e) {
    if (e.includes('wall')) {
        ctx.fillStyle = 'gray';
        return;
    }
    if (e.includes('begin')) {
        ctx.fillStyle = 'red';
        return;
    }
    if (e.includes('goal')) {
        ctx.fillStyle = 'green';
        return;
    }
    if (e.includes('golden-box')) {
        ctx.fillStyle = '#3F51B5';
        return;
    }
    if (e.includes('golden-box-open')) {
        ctx.fillStyle = '#673ab7';
        return;
    }
    if (e.some(item => item.includes('count'))) {
        ctx.fillStyle = 'white';
        return;
    }
}