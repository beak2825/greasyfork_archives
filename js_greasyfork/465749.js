// ==UserScript==
// @name         Maze Mapper
// @namespace    http://fishpi.cn/
// @version      0.5
// @description  try to remember the map!
// @author       iwpz
// @match        https://maze.hancel.org/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hancel.org
// @require      https://greasyfork.org/scripts/455943-ajaxhooker/code/ajaxHooker.js?version=1124435
// @run-at       document-start
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/465749/Maze%20Mapper.user.js
// @updateURL https://update.greasyfork.org/scripts/465749/Maze%20Mapper.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
        var currentX = 0;
        var currentY = 0;
        var cellSize = 8;
        'use strict';
        var map = document.createElement("canvas");
        var levelDom = document.getElementById('level');
        var level = levelDom.innerText.split(" ")[1] * 1;
        var size = (level - 1) * 2 * cellSize;
        map.setAttribute("width",size + cellSize);
        map.setAttribute("height",size + cellSize);
        var home = document.body;
        home.appendChild(map);
        var ctx = map.getContext("2d");
        ctx.fillStyle = "red";
        ctx.fillRect(0,0,cellSize,cellSize)
        ctx.fillStyle = "green";
        ctx.fillRect(size,size,cellSize,cellSize)
        ctx.strokeStyle= "white";
        ctx.strokeRect(0,0,size+cellSize,size+cellSize);
        ajaxHooker.hook(request => {
            request.response = value => {
                var url = value.finalUrl;
                var code = value.status;
                if(currentY == 0 && currentX == 0){
                    ctx.fillStyle = "red";
                }
                else{
                    ctx.fillStyle = "white";
                }
                ctx.fillRect(currentX * cellSize,currentY * cellSize,cellSize,cellSize)
                if(code == 200){
                    if(url.indexOf('up') != -1){
                        currentY --;
                    }
                    if(url.indexOf('down') != -1){
                        currentY ++;
                    }
                    if(url.indexOf('left') != -1){
                        currentX --;
                    }
                    if(url.indexOf('right') != -1){
                        currentX ++;
                    }
                    var mazeView = value.json.mazeView
                    var leftUp = mazeView[0][0]
                    var up = mazeView[0][1]
                    var rightUp = mazeView[0][2]
                    var left = mazeView[1][0]
                    var right = mazeView[1][2]
                    var leftDown = mazeView[2][0]
                    var down = mazeView[2][1]
                    var rightDown = mazeView[2][2]
                    ctx.fillStyle = "grey";
                    if(leftUp == 'wall'){
                        ctx.fillRect((currentX - 1) * cellSize,(currentY - 1) * cellSize,cellSize,cellSize)
                    }
                    if(up == 'wall'){
                        ctx.fillRect(currentX * cellSize,(currentY - 1) * cellSize,cellSize,cellSize)
                    }
                    if(rightUp == 'wall'){
                        ctx.fillRect((currentX + 1) * cellSize,(currentY - 1) * cellSize,cellSize,cellSize)
                    }
                    if(left == 'wall'){
                        ctx.fillRect((currentX - 1) * cellSize,(currentY) * cellSize,cellSize,cellSize)
                    }
                    if(right == 'wall'){
                        ctx.fillRect((currentX + 1) * cellSize,(currentY) * cellSize,cellSize,cellSize)
                    }
                    if(leftDown == 'wall'){
                        ctx.fillRect((currentX - 1) * cellSize,(currentY + 1) * cellSize,cellSize,cellSize)
                    }
                    if(down == 'wall'){
                        ctx.fillRect(currentX * cellSize,(currentY + 1) * cellSize,cellSize,cellSize)
                    }
                    if(rightDown == 'wall'){
                        ctx.fillRect((currentX + 1) * cellSize,(currentY + 1) * cellSize,cellSize,cellSize)
                    }
                    ctx.fillStyle = "orange";
                    ctx.fillRect(currentX * cellSize,currentY * cellSize,cellSize,cellSize)
                }
            };
        });
    },500);
})();