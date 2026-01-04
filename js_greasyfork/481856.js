// ==UserScript==
// @name         fishPiMazeMap
// @namespace    http://fishpi.cn/
// @version      1.3
// @description  摸鱼派迷宫脚本
// @author       wanli
// @match        https://maze.hancel.org/
// @icon         https://file.fishpi.cn/2023/06/blob-e922d6ed.png?imageView2/1/w/48/h/48/interlace/0/q/100
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481856/fishPiMazeMap.user.js
// @updateURL https://update.greasyfork.org/scripts/481856/fishPiMazeMap.meta.js
// ==/UserScript==
(function () {
    var currentX = 0;
    var currentY = 0;
    var cellSize = 8;
    var level = 0;
    var size = 0;
    var mapSize = 0;
    var ctx;

    function drawCanvas(data) {
        level = data.stage;
        mapSize = data.size-1;
        
        //加载地图
        loadMap();

        setTimeout(function () {
            ajaxHooker.hook(request => {
                request.response = value => {
                    var url = value.finalUrl;
                    var code = value.status;
                    if (code == 200) {
                        updateCurrentPoint(url);
                        //画返回的九个点
                        drawAround(value.json.mazeView)
                        saveMap();
                    }
                };
            });
        }, 500);
    }

    function loadMap() {
        createButton();
        createCanvas();
        //判断有无存档
        var loc = localStorage.getItem('mazeCanvas-' + level);
        if (loc) {
            //有存档 取存档
            console.log("[wanLiMap]加载地图存档-Level" + level)
            var data = JSON.parse(loc);
            //console.log(loc);
            currentX = data.currentX;
            currentY = data.currentY;
            var canvasLoad =data.canvasBase64;
            if(canvasLoad){
                loadCanvas(data.canvasBase64);
            }
        }
    }

    function createCanvas(){
        size = mapSize * cellSize;
        var map = document.createElement("canvas");
        map.id = 'wanLiMap';
        map.setAttribute("width", size + cellSize);
        map.setAttribute("height", size + cellSize);
        map.style.margin = "20px 0 100px 0";
        //map.style.zoom = 0.5 - ((level - 85) / 100);
        document.body.appendChild(map);
        //初始化画布
        ctx = map.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, cellSize, cellSize)
        ctx.fillStyle = "green";
        ctx.fillRect(size, size, cellSize, cellSize)
        ctx.fillStyle = "green";
        ctx.fillRect(size, size, cellSize, cellSize)
        ctx.fillStyle = "#3498DB";
        ctx.fillRect(currentX * cellSize, currentY * cellSize, cellSize, cellSize)
        ctx.strokeStyle = "white";
        ctx.strokeRect(0, 0, size + cellSize, size + cellSize);
    }

    function createButton(){
        var buttonDiv = document.createElement("div");
        buttonDiv.style.display = 'flex';
        buttonDiv.style.justifyContent = 'space-around';
        buttonDiv.style.width = '450px';
        buttonDiv.style.marginTop = '10px';

        var sbtn = document.createElement("BUTTON");
        sbtn.innerHTML = "不知道自己在哪儿";
        sbtn.id = "sbtn";
        sbtn.style.height = "50px";
        sbtn.style.width = "220px";
        sbtn.style.cursor = "pointer";
        sbtn.style.color = "white";
        sbtn.style.fontSize = "25px";
        sbtn.style.background = "green";
        sbtn.onclick = function () {
            mapSize = Math.floor(mapSize * 1.5);
            var startPoint = Math.floor(mapSize/2);
            if(startPoint%2!==0){
                startPoint-=1;
            }
            currentX = startPoint;
            currentY = startPoint;
            document.getElementById("wanLiMap").remove();
            createCanvas();
            var loc = localStorage.getItem('mazeCanvas-' + level);
            if (loc) {
                var data = JSON.parse(loc);
                var canvasLoad =data.canvasBase64;
                if(canvasLoad){
                    loadCanvas(data.canvasBase64);
                }
            }
        }
        buttonDiv.appendChild(sbtn);

        var dbtn = document.createElement("BUTTON");
        dbtn.innerHTML = "清除此关存档";
        dbtn.id = "dbtn";
        dbtn.style.height = "50px";
        dbtn.style.width = "165px";
        dbtn.style.cursor = "pointer";
        dbtn.style.color = "white";
        dbtn.style.fontSize = "25px";
        dbtn.style.background = "red";
        dbtn.onclick = function () {
            localStorage.removeItem('mazeCanvas-' + level);
            location.reload();
        }
        buttonDiv.appendChild(dbtn);

        document.body.appendChild(buttonDiv);
    }

    function insertAfter(newElement, targetElement) {
        let parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            parent.appendChild(newElement);
        } else {
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }

    function updateCurrentPoint(url) {
        if (url.indexOf('up') != -1) {
            currentY--;
        }
        if (url.indexOf('down') != -1) {
            currentY++;
        }
        if (url.indexOf('left') != -1) {
            currentX--;
        }
        if (url.indexOf('right') != -1) {
            currentX++;
        }
    }

    function drawAround(mazeView) {
        var xOffSet = currentX - 1;
        var yOffSet = currentY - 1;
        mazeView.map((row, i) => {
            row.map((cell, j) => {
                const newX = j + xOffSet;
                const newY = i + yOffSet;
                if (newX < mapSize && newY < mapSize && newX >= 0 && newY >= 0) {
                    if (cell.indexOf('wall') != -1) {
                        ctx.fillStyle = "brown";
                    }else if (cell.indexOf('begin')!= -1){
                        ctx.fillStyle = "red";
                    }else if (cell.indexOf('goal') != -1){
                        ctx.fillStyle = "green";
                    }else {
                        ctx.fillStyle = "grey";
                        if (cell.indexOf('count-0') == -1) {
                            ctx.fillStyle = "white";
                        }
                    }
                    //画当前点
                    if(newX===currentX&&newY===currentY){
                        ctx.fillStyle = "#3498DB";
                    }
                    ctx.fillRect(newX * cellSize, newY * cellSize, cellSize, cellSize);
                }
            });
        });
    }

    function saveMap() {
        var map = {};

        map.currentX = currentX;
        map.currentY = currentY;
        map.canvasBase64 = document.getElementById("wanLiMap").toDataURL();

        localStorage.setItem('mazeCanvas-' + level, JSON.stringify(map));
    }

    function loadCanvas(data) {
        const image = new Image(size + cellSize, size + cellSize);

        image.onload = function () {
            ctx.drawImage(image, 0, 0);
        };

        image.src = data;
    }

    function initLevel() {
        const apiUrl = 'https://maze.hancel.org/api/maze';
        fetch(apiUrl + '/last?timeStamp=' + new Date().getTime(), {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
            body: {}, // obj为json对象
        }).then(async function (response) {
            drawCanvas(await response.json());
        }).catch();
    }

    
    initLevel();
    document.addEventListener('DOMContentLoaded', function () {
        document.body.addEventListener('keydown', function (e) {
            // 检查是否按下了上或下箭头键
            if (e.keyCode === 38 || e.keyCode === 40) {
                // 阻止默认行为，即阻止页面滚动
                e.preventDefault();
            }
        });
    });
})();