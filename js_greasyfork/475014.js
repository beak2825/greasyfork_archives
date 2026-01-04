// ==UserScript==
// @name         bing一键拼图
// @namespace    knva
// @version      0.1
// @description  bing拼图页面一键完成
// @require      https://code.jquery.com/jquery-3.2.1.slim.min.js
// @home         https://greasyfork.org/en/scripts/475014
// @author       knva
// @match        https://*.bing.com/spotlight/imagepuzzle*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475014/bing%E4%B8%80%E9%94%AE%E6%8B%BC%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/475014/bing%E4%B8%80%E9%94%AE%E6%8B%BC%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 创建一个函数来计算矩阵变化
    function calculateMatrixChange(matrix1, matrix2) {
        if (matrix1.length !== matrix2.length || matrix1[0].length !== matrix2[0].length) {
            return "矩阵尺寸不匹配";
        }

        const rows = matrix1.length;
        const cols = matrix1[0].length;

        const changeMatrix = [];

        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                let res = matrix2[i][j] - matrix1[i][j];
                row.push(res);

            }
            changeMatrix.push(row);
        }

        return changeMatrix;
    }
    function findPositiveElements(matrix) {
        const positiveElements = [];

        for (let x = 0; x < matrix.length; x++) {
            for (let y = 0; y < matrix[x].length; y++) {
                if (matrix[x][y] > 0) {
                    positiveElements.push({ x, y });
                }
            }
        }

        return positiveElements;
    }
    var lastmatrix =[];
    var clicklist =[];
    function printBoard(board) {
        if(lastmatrix.length==3){
            let res = calculateMatrixChange(board,lastmatrix)
            //console.log(res)
            let xy = findPositiveElements(res)[0]
            clicklist.push(xy);
        }
        lastmatrix = board;
    }

    function findBlank(board) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === 0) {
                    return [i, j];
                }
            }
        }
    }

    function isValidMove(x, y) {
        return x >= 0 && x < 3 && y >= 0 && y < 3;
    }

    function solvePuzzle(initBoard) {
        const targetBoard = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
        const visited = new Set();
        const queue = [[initBoard, []]];

        while (queue.length > 0) {
            const [currentBoard, moves] = queue.shift();

            if (JSON.stringify(currentBoard) === JSON.stringify(targetBoard)) {
                console.log("移动步骤:");
                for (let move of moves) {
                    printBoard(move);
                }
                return;
            }

            const [x, y] = findBlank(currentBoard);

            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

            for (let [dx, dy] of directions) {
                const newX = x + dx;
                const newY = y + dy;

                if (isValidMove(newX, newY)) {
                    const newBoard = currentBoard.map(row => [...row]);
                    [newBoard[x][y], newBoard[newX][newY]] = [newBoard[newX][newY], newBoard[x][y]];

                    const boardString = JSON.stringify(newBoard);
                    if (!visited.has(boardString)) {
                        visited.add(boardString);
                        queue.push([newBoard, moves.concat([newBoard])]);
                    }
                }
            }
        }

        console.log("未找到解决方案。");
    }

    $(document).ready(function() {
        var button = document.createElement("div");
        button.className = "floating-button";
        button.textContent = "全自动立刻开拼！";

        // Add the button to the page
        var insTitleElements = document.querySelectorAll(".insTitle");
        insTitleElements.forEach(function(insTitleElement) {
            var buttonClone = button.cloneNode(true);
            insTitleElement.parentNode.insertBefore(buttonClone, insTitleElement.nextSibling);

            // Button click event handler
            buttonClone.addEventListener("click", function() {
                // 在这里执行您想要的操作
                alert("彻底疯狂！");
                var alldata = []
                var tiles = $('#tiles .tile');

                tiles.each(function(index) {
                    var tile = $(this);
                    if(tile[0].nodeName=="DIV"){
                        var tileNumber = tile.find('.tileNumber');

                        if (tileNumber.length > 0) {
                            alldata.push(parseInt(tileNumber.text()))
                        } else {
                            alldata.push(0);
                        }
                    }
                });
                console.log(alldata);
                //
                var newArray = [];
                var chunkSize = 3; // 每个子数组的长度
                for (var i = 0; i < alldata.length; i += chunkSize) {
                    newArray.push(alldata.slice(i, i + chunkSize));
                }
                lastmatrix = newArray;
                solvePuzzle(newArray);

                console.log(clicklist);
                function clickCoordsWithDelay(index) {
                    if (index < clicklist.length) {
                        const xy = clicklist[index];
                        $(`div[x='${xy.x}'][y='${xy.y}']`).click();
                        console.log(xy);

                        // 在下一个点击之前添加延迟
                        setTimeout(function () {
                            clickCoordsWithDelay(index + 1);
                        }, 500); // 500 毫秒延迟
                    }
                }
                clickCoordsWithDelay(0);
            });
        });

    });

})();