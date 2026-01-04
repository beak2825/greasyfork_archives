// ==UserScript==
// @name         2048_By_chunqiu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  随机出现高分块，并且自动加时间和分数，对局结束后卡死是正常现象，需要等待一段时间后发送数据包，反检测
// @author       春秋，wechat：chunqiu031
// @match        https://play.ordz.games/inscription/030290b1cc28b8f91c27df3be8b13a001ff2e3b8bff8022e0e27fa656ea55410i0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469236/2048_By_chunqiu.user.js
// @updateURL https://update.greasyfork.org/scripts/469236/2048_By_chunqiu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var iframe = document.getElementById('gameFrame');
        console.log("尝试注入", iframe);
        if (iframe) {
            try {
                var iframeWindow = iframe.contentWindow;
                var iframeDocument = iframe.contentDocument || iframeWindow.document;

                var script = iframeDocument.createElement('script');
                script.textContent = `


window.gameScript = (function () {
    'use strict';
    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }
        ;

    const itemMoveWidth = 460 / 4;
    var game = null;
    // var bestScore = 0;
    var scoreDiv = document.getElementById('score-input');
    // var bestScoreDiv = document.getElementById('bestScore');
    var addDiv = document.getElementById('add');
    var gameOverDom = document.getElementById('game-over');
    var containerDom = document.querySelector('.container');

    var size = 4;
    var nextId = 1;
    var score = 0;
    var operate = 0;
    var playTime = 0;
    window.myplayTime = 0;
    let gameStatus = '';
    let eValue = '';
    let _ac = '';
    const maxNumber = 2048;

    const valueMapping = {
        2: 'O',
        4: 'OG',
        8: 'START',
        16: 'PLAY',
        32: 'ORDZ',
        64: 'GAME',
        128: 'CITY',
        256: 'RUSH',
        512: 'HERO',
        1024: 'EARN',
        2048: '\$OG\$',
    };

    function initGame() {
        console.log("注入成功");
        game = Array(size * size).fill(null);
        // 4 x 4 grid, represented as an array
    }
    ;
    // utils
    const gameUtils = {
        playTimeTimer: null,
        startPlayTime() {
            clearInterval(this.playTimeTimer);
            this.playTimeTimer = setInterval(() => {
                playTime = playTime + 1;
                window.myplayTime = playTime;
                this.formatTime(playTime);
            }
                , 1000);
        },
        updateScore() {
            let stringScore = String(score);
            let scoreDivValue = '';
            for (let i = 0; i < 5 - stringScore.length; i++) {
                scoreDivValue += '0';
            }
            scoreDiv.innerHTML = \`\${scoreDivValue}\${score}\`;
        },
        computeOperate() {
            let operateInput = document.querySelector('.header #operate-input');
            let stringOperate = String(operate);
            let operateValue = '';
            for (let i = 0; i < 5 - stringOperate.length; i++) {
                operateValue += '0';
            }
            operateInput.innerHTML = \`\${operateValue}\${stringOperate}\`;
        },
        formatTime(timestamp) {
            let timeDom = document.querySelector('.header #time-input');
            let minute = Math.floor(timestamp / 60);
            let second = timestamp % 60;
            timeDom.innerHTML = \`\${minute >= 10 ? minute : '0' + minute}:\${second >= 10 ? second : '0' + second}\`;
        },
        // 创建截图
        _createScreenshot() {
            var node = document.querySelector('.container .game-screenshot');
            let _this = this;
            // domtoimage.toPng(node, { quality: 1.0, magnification: 2, bgcolor: '#5C96FC' })
            domtoimage.toPng(node, {
                quality: 1.0,
                magnification: 0.4,
                bgcolor: '#000'
            }).then(function (dataUrl) {
                // console.log('dataUrl=>>>', dataUrl);
                if (dataUrl.indexOf('base64,')) {
                    dataUrl = dataUrl.split('base64,')[1];
                }
                _this.setPassword(dataUrl || '');
            })
        },
        setPassword(_p) {
            let mapMapping = reflectGrid(game);
            let count = mapMapping.filter(item => item.value === 2048).length;
            // console.log(count, mapMapping)
            let ac = window.btoa(\`\${eValue}-b-\${score}-b-\${operate}-b-\${count}-b-\${playTime}-b-\${this.getLocalTime(0)}-b-\${_p}\`);

            let b = (Math.random() + 1).toString(36).substring(2, 8);
            let c = (Math.random() + 1).toString(36).substring(2, 6);
            _ac = ac = \`\${ac.slice(0, 8)}\${b}\${ac.slice(8, 13)}\${c}\${ac.slice(13)}\`;
            // console.log('token=>>>', \`\${eValue}-b-\${score}-b-\${operate}-b-\${count}-b-\${playTime}-b-\${this.getLocalTime(0)}-b-\${_p}\`);
            // console.log(_ac);
            // const copyInput = document.querySelector('#copyI');
            // copyInput.value = ac;
            // copyInput.setAttribute('value', ac);
            const tokenDom = document.querySelector('.game-over #token-input');
            tokenDom.innerText = ac;
            try {
                // 发送token
                window.parent.postMessage({
                    target: 'game-token',
                    data: {
                        value: ac
                    }
                }, '*');
            } catch (error) { }

            // 发送游戏状态
            window.ssubmitPlayerRecord({
                type: 'success',
                email: eValue,
                score: score
            })
        },
        // get utc0 timestamp
        getUtcTime(len, i) {
            var D = new Date();
            if (len) {
                D = new Date(len);
            }
            len = D.getTime();
            var offset = D.getTimezoneOffset() * 60000;
            var utcTime = len + offset;
            let time = new Date(utcTime + 3600000 * i);
            return time;
        },
        getLocalTime(i) {
            let time = this.getUtcTime('', i);
            let m = time.getMonth() + 1;
            let d = time.getDate();
            let str = \`\${time.getFullYear()}-\${m > 10 ? m : '0' + m}-\${d + 1 > 10 ? d : '0' + d}\`;
            return str;
        },
        copyF(value) {
            const copyInput = document.querySelector('#copyI');
            copyInput.value = value;
            // copyInput.setAttribute('value', value);
            try {
                navigator.clipboard.writeText(value);
                let dom = document.querySelector('.message-tips');
                dom.classList.add('show');
                setTimeout(() => {
                    dom.classList.remove('show');
                }
                    , 1 * 1000);
            } catch (error) {
                // console.error('error=>>', error)
                copyInput.select();
                try {
                    document.execCommand('copy', true);
                    let dom = document.querySelector('.message-tips');
                    dom.classList.add('show');
                    setTimeout(() => {
                        dom.classList.remove('show');
                    }
                        , 1 * 1000);
                } catch (error) { }
            }
        }
    };

    function updateDOM(before, after) {
        var newElements = getNewElementsDOM(before, after);
        var existingElements = getExistingElementsDOM(before, after);
        var mergedTiles = getMergedTiles(after);
        removeElements(mergedTiles);
        drawGame(newElements, true);
        drawGame(existingElements);
    }
    ;
    function removeElements(mergedTiles) {
        let _isArray = Array.isArray(mergedTiles);
        mergedTiles = _isArray ? mergedTiles : [mergedTiles];

        for (var i = 0; i < mergedTiles.length; i++) {
            let tile = mergedTiles[i];
            let mergedIds = tile.mergedIds ? JSON.parse(JSON.stringify(tile.mergedIds)) : [];

            for (var j = 0; j < mergedIds.length; j++) {
                // console.log('removeElements')
                let id = mergedIds[j];
                let currentElm = document.getElementById(id);
                if (currentElm) {
                    positionTile(tile, currentElm);
                    currentElm.classList.add('tile--shrink');
                    setTimeout(function () {
                        currentElm.remove();
                    }, 100);
                }
            }
        }
    }
    ;

    function getMergedTiles(after) {
        return after.filter(function (tile) {
            return tile && tile.mergedIds;
        });
    }
    ;
    function getNewElementsDOM(before, after) {
        var beforeIds = before.filter(function (tile) {
            return tile;
        }).map(function (tile) {
            return tile.id;
        });
        var newElements = after.filter(function (tile) {
            return tile && beforeIds.indexOf(tile.id) === -1;
        });
        return newElements;
    }
    ;
    function getExistingElementsDOM(before, after) {
        var beforeIds = before.filter(function (tile) {
            return tile;
        }).map(function (tile) {
            return tile.id;
        });
        var existingElements = after.filter(function (tile) {
            return tile && beforeIds.indexOf(tile.id) !== -1;
        });
        return existingElements;
    }
    ;
    function drawBackground() {
        var tileContainer = document.getElementById('tile-container');
        tileContainer.innerHTML = '';
        for (var i = 0; i < game.length; i++) {
            var tile = game[i];
            var tileDiv = document.createElement('div');
            var x = i % size;
            var y = Math.floor(i / size);
            tileDiv.style.top = y * itemMoveWidth + 'px';
            tileDiv.style.left = x * itemMoveWidth + 'px';

            tileDiv.classList.add("background");
            tileContainer.appendChild(tileDiv);
        }
    }

    function positionTile(tile, elm) {
        var x = tile.index % size;
        var y = Math.floor(tile.index / size);
        elm.style.top = y * itemMoveWidth + 'px';
        elm.style.left = x * itemMoveWidth + 'px';
    }

    function drawGame(tiles, isNew) {
        var tileContainer = document.getElementById('tile-container');
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile) {
                if (isNew) {
                    (function () {
                        var tileDiv = document.createElement('div');
                        positionTile(tile, tileDiv);
                        tileDiv.classList.add('tile', 'pixel-box', 'tile--' + tile.value);
                        tileDiv.id = tile.id;
                        setTimeout(function () {
                            tileDiv.classList.add("tile--pop");
                        }, tile.mergedIds ? 1 : 150);
                        tileDiv.innerHTML = \`<p class="pixel-box-child">\${valueMapping[tile.value]}</p>\`;
                        // tileDiv.innerHTML = \`<p class="pixel-box-child">\${tile.value}</p>\`;
                        tileContainer.appendChild(tileDiv);

                        // if(tile.value >= 16){
                        //   gameWin();
                        // }
                    }
                    )();
                } else {
                    var currentElement = document.getElementById(tile.id);
                    positionTile(tile, currentElement);
                }
            }
        }
    }
    ;
    function isGameOver() {
        if (game.filter(function (number) {
            return number === null;
        }).length === 0) {
            // console.log('game=>>', game)
            var sameNeighbors = game.find(function (tile, i) {
                // console.log('isRightSame', game[i + 1] , (i + 1) % 4 !== 0, tile.value === game[i + 1].value)
                // console.log('isDownSame', game[i + 4] , tile.value === game[i + 4].value)
                let itemValue = tile.value;
                let itemIsMax = itemValue >= maxNumber;
                if (itemIsMax) {
                    return false;
                }
                var isRightSame = game[i + 1] && (i + 1) % 4 !== 0 ? itemValue === game[i + 1].value : false;
                var isDownSame = game[i + 4] ? itemValue === game[i + 4].value : false;
                // console.log('isOver', (isRightSame || isDownSame))
                if (isRightSame || isDownSame) {
                    return true;
                }
                return false;
            });
            return !sameNeighbors;
        }
    }
    ;
    function gameOver() {
        gameStatus = 'over';
        clearInterval(gameUtils.playTimeTimer);
        setTimeout(() => {
            gameUtils._createScreenshot();
            setTimeout(function () {
                containerDom.classList.add('over');
            }, 500);
        }
            , 500);
    }
    ; function gameWin() {
        gameStatus = 'win';
        clearInterval(gameUtils.playTimeTimer);
        gameUtils._createScreenshot();
        setTimeout(() => {
            gameUtils._createScreenshot();
            setTimeout(function () {
                // containerDom.classList.add('win');
                containerDom.classList.add('over');
            }, 500);
        }
            , 500);
    }
    ;
    function generateNewNumber() {
        // 0.9 probability of 2, 0.1 probability of 4
        var p = Math.random() * itemMoveWidth;
        return p <= 90 ? 2 : 4;
    }
    ;
    function addRandomNumber(options) {
        var emptyCells = game
            .map(function (_, index) {
                return index;
            })
            .filter(function (index) {
                return game[index] === null;
            });
        if (emptyCells.length === 0) {
            return;
        }
        var newPos = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        var arr = [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2];
        var randomElement = arr[Math.floor(Math.random() * arr.length)];
        var newObj = {
            id: nextId++,
            index: newPos,
            value: randomElement,
        };
        game.splice(newPos, 1, newObj);
        if (newObj.value == 2048) {
            score += 20480;
            operate += 1000;
            playTime += Math.floor(1000 * 0.8);
        }
        if (newObj.value == 1024) {
            score += 9216;
            operate += 498;
            playTime += Math.floor(501 * 0.7);

        }
        if (newObj.value == 512) {
            score += 4096;
            operate += 245;
            playTime += Math.floor(245 * 0.8);
        }
        if (newObj.value == 256) {
            score += 1792;
            operate += 120;
            playTime += Math.floor(120 * 0.9);
        }
        if (newObj.value == 128) {
            score += 768;
            operate += 59;
            playTime += Math.floor(59 * 0.8);
        }
        if (newObj.value == 64) {
            score += 320;
            operate += 28;
            playTime += Math.floor(28 * 0.8);
        }
        if (newObj.value == 32) {
            score += 128;
            operate += 15;
            playTime += Math.floor(15 * 0.8);
        }
        if (newObj.value == 16) {
            score += 48;
            operate += 7;
            playTime += Math.floor(7 * 0.8);
        }
        if (newObj.value == 8) {
            score += 16;
            operate += 3;
            playTime += Math.floor(3 * 0.8);
        }
        if (options.updateOperate) {
            operate += 1;
            window.myplayTime = playTime;
            gameUtils.computeOperate();
            gameUtils.updateScore();
        }
    };
    function getIndexForPoint(x, y) {
        return y * size + x;
    }
    ;
    function reflectGrid(grid) {
        var reflectedGame = Array(size * size).fill(0);
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                var index1 = getIndexForPoint(col, row);
                var index2 = getIndexForPoint(size - col - 1, row);
                reflectedGame[index1] = grid[index2];
            }
        }
        return reflectedGame;
    }
    ;
    function rotateLeft90Deg(grid) {
        var rotatedGame = Array(size * size).fill(0);
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                var index1 = getIndexForPoint(col, row);
                var index2 = getIndexForPoint(size - 1 - row, col);
                rotatedGame[index1] = grid[index2];
            }
        }
        return rotatedGame;
    }
    ;
    function rotateRight90Deg(grid) {
        var rotatedGame = Array(size * size).fill(0);
        for (var row = 0; row < size; row++) {
            for (var col = 0; col < size; col++) {
                var index1 = getIndexForPoint(col, row);
                var index2 = getIndexForPoint(row, size - 1 - col);
                rotatedGame[index1] = grid[index2];
            }
        }
        return rotatedGame;
    }
    ;

    function shiftGameRight(gameGrid) {
        // reflect game grid
        var reflectedGame = reflectGrid(gameGrid);
        // shift left
        reflectedGame = shiftGameLeft(reflectedGame);
        // reflect back
        return reflectGrid(reflectedGame);
    }
    ;
    function shiftGameLeft(gameGrid) {
        var newGameState = [];
        var totalAdd = 0;
        // for rows
        for (var i = 0; i < size; i++) {
            // for columns
            var firstPos = 4 * i;
            var lastPos = size + 4 * i;
            var currentRow = gameGrid.slice(firstPos, lastPos);
            var filteredRow = currentRow.filter(function (row) {
                return row;
            });

            // for (var i = 0; i < filteredRow.length; i++) {
            //   console.log('111shiftGameLeft')
            //   let row = filteredRow[i];
            //   // delete row.mergedIds;
            // }
            // let now = new Date().getTime();
            // console.log('之前=>>', now, filteredRow);

            // for (var _iterator3 = filteredRow, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            //   // console.log('1shiftGameLeft', _iterator3, _isArray3)
            //   var _ref3;

            //   if (_isArray3) {
            //     if (_i3 >= _iterator3.length) break;
            //     _ref3 = _iterator3[_i3++];
            //   } else {
            //     _i3 = _iterator3.next();
            //     if (_i3.done) break;
            //     _ref3 = _i3.value;
            //   }

            //   var row = _ref3;
            //   // console.log('2shiftGameLeft', _ref3)
            //   delete row.mergedIds;
            // }

            // console.log('之后=>>', now, filteredRow);

            for (var j = 0; j < filteredRow.length - 1; j++) {
                let itemValue = filteredRow[j].value;
                let nextItemValue = filteredRow[j + 1].value;
                // 超过某个值就不能合并了
                if (itemValue === nextItemValue && (itemValue < maxNumber || nextItemValue < maxNumber)) {
                    var sum = itemValue * 2;
                    filteredRow[j] = {
                        id: nextId++,
                        mergedIds: [filteredRow[j].id, filteredRow[j + 1].id],
                        value: sum
                    };
                    filteredRow.splice(j + 1, 1);

                    let nowScore = (sum == 1024 || sum == 2048) ? sum * 2 : sum;
                    // console.log(itemValue, sum, nowScore)
                    score += nowScore;
                    totalAdd += nowScore;
                }
            }
            while (filteredRow.length < size) {
                filteredRow.push(null);
            }
            ; newGameState = [].concat(newGameState, filteredRow);
        }

        if (totalAdd > 0) {
            gameUtils.updateScore();

            addDiv.innerHTML = \`+\${totalAdd}\`;
            addDiv.classList.add('active');
            setTimeout(function () {
                addDiv.classList.remove("active");
            }, 800);

            // if (score > bestScore) {
            //   localStorage.setItem('bestScore', score);
            //   initBestScore();
            // }
        }
        return newGameState;
    }
    ;
    function shiftGameUp(gameGrid) {
        var rotatedGame = rotateLeft90Deg(gameGrid);
        rotatedGame = shiftGameLeft(rotatedGame);
        return rotateRight90Deg(rotatedGame);
    }
    ;
    function shiftGameDown(gameGrid) {
        var rotatedGame = rotateRight90Deg(gameGrid);
        rotatedGame = shiftGameLeft(rotatedGame);
        return rotateLeft90Deg(rotatedGame);
    }
    ;
    function handleKeypress(evt) {
        var modifiers = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
        var whichKey = event.which;
        var prevGame = [].concat(game);
        if (evt.isCustom) {
            whichKey = evt.keyCode;
        }
        // console.log('handleKeypress=>>', evt, whichKey, gameStatus);
        // 回车
        if (whichKey === 13 && gameStatus === '') {
            firstGameStart();
            return;
        }

        // 非上下左右 || 已经结束/赢了
        let keyCodeList = [37, 38, 39, 40];
        // console.log(!keyCodeList.includes(whichKey) , (!!gameStatus && gameStatus!== 'start'));
        if (!keyCodeList.includes(whichKey) || (!!gameStatus && gameStatus !== 'start')) {
            return;
        }
        if (!modifiers) {
            event.preventDefault();
            // update play operate
            switch (whichKey) {
                case 37:
                    game = shiftGameLeft(game);
                    break;
                case 38:
                    game = shiftGameUp(game);
                    break;
                case 39:
                    game = shiftGameRight(game);
                    break;
                case 40:
                    game = shiftGameDown(game);
                    break;
            }
            game = game.map(function (tile, index) {
                if (tile) {
                    return _extends({}, tile, {
                        index: index
                    });
                } else {
                    return null;
                }
            });
            addRandomNumber({
                updateOperate: true
            });
            updateDOM(prevGame, game);
            if (isGameOver()) {
                gameOver();
                return;
            }
        }
    }
    ;
    document.addEventListener("keydown", handleKeypress);

    function newGameStart() {
        document.getElementById('tile-container').innerHTML = '';
        containerDom.classList.remove('over');
        containerDom.classList.remove('win');
        containerDom.classList.add('start');

        // 发送游戏状态
        window.ssubmitPlayerRecord({
            type: 'start',
            email: eValue
        })

        // reset game Status
        gameStatus = 'start';

        // reset score
        score = 0;
        gameUtils.updateScore();

        // reset operate
        operate = 0;
        gameUtils.computeOperate();

        // reset play time
        playTime = 0;
        gameUtils.formatTime(playTime);
        gameUtils.startPlayTime();

        initGame();
        drawBackground();
        var previousGame = [].concat(game);
        addRandomNumber({
            updateOperate: false
        });
        addRandomNumber({
            updateOperate: false
        });
        updateDOM(previousGame, game);
    }

    const firstGameStart = () => {
        let aInput = document.querySelector('.welcome-content input');
        let value = aInput.value;
        if (value) {
            eValue = value;
            newGameStart();
        }
    }
        ;
    // 直接启动
    // newGameStart();

    const gameTouchEvent = {
        touchStatus: '',
        startInfo: {
            x: 0,
            y: 0
        },
        init() {
            let gameContent = document.querySelector('.game-content');
            gameContent.addEventListener("touchstart", this.touchStart, false);
            gameContent.addEventListener("touchend", this.touchEnd, false);
            gameContent.addEventListener("touchmove", this.touchMove, false);

            gameContent.addEventListener("mousedown", this.touchStart, false);
            gameContent.addEventListener("mouseup", this.touchEnd, false);
            gameContent.addEventListener("mousemove", this.touchMove, false);
        },
        getPosition(event) {
            var _event = window.event || arguments[0];
            let startInfo = {
                x: 0,
                y: 0
            };
            if (!!event.targetTouches) {
                startInfo.x = event.targetTouches[0].pageX;
                startInfo.y = event.targetTouches[0].pageY;
            } else {
                startInfo.x = _event.clientX;
                startInfo.y = _event.clientY;
            }
            return startInfo;
        },
        touchStart(event) {
            event.preventDefault();
            gameTouchEvent.startInfo = gameTouchEvent.getPosition(event);
            gameTouchEvent.touchStatus = 'start';
            // handleKeypress({
            //   which: 37
            // })
        },
        touchMove(event) {
            event.preventDefault();
            if (gameTouchEvent.touchStatus === 'start') {
                let startInfo = gameTouchEvent.getPosition(event);
                let moveDistance = {
                    x: startInfo.x - gameTouchEvent.startInfo.x,
                    y: startInfo.y - gameTouchEvent.startInfo.y
                };
                let minMoveDistance = itemMoveWidth / 2;
                // console.log(Math.abs(moveDistance.x) , moveDistance , Math.abs(moveDistance.y))
                // console.log(Math.abs(moveDistance.x) >= minMoveDistance , Math.abs(moveDistance.y) >= minMoveDistance, )
                if (Math.abs(moveDistance.x) >= minMoveDistance || Math.abs(moveDistance.y) >= minMoveDistance) {
                    gameTouchEvent.touchStatus = 'end';
                    let keyCode = 0;
                    if (Math.abs(moveDistance.x) >= Math.abs(moveDistance.y)) {
                        if (moveDistance.x > 0) {
                            keyCode = 39;
                        } else {
                            keyCode = 37;
                        }
                    } else {
                        if (moveDistance.y > 0) {
                            keyCode = 40;
                        } else {
                            keyCode = 38;
                        }
                    }
                    handleKeypress({
                        isCustom: true,
                        keyCode: keyCode
                    })
                }
            }
        },
        touchEnd(event) {
            event.preventDefault();
            gameTouchEvent.touchStatus = '';
            gameTouchEvent.startInfo = {
                x: 0,
                y: 0
            }
        },
    };
    gameTouchEvent.init();

    // copy
    function copyValue(type) {
        if (type === 'token') {
            gameUtils.copyF(_ac);
        } else if (type === 'website') {
            gameUtils.copyF('https://www.ordz.games');
        }
    }

    return {
        newGameStart,
        firstGameStart,
        copyValue,

        // gameOver,
        // gameWin,

    };
}
)();

gameScript.firstGameStart = window.gameScript.firstGameStart
gameScript.copyValue = window.gameScript.copyValue
gameScript.newGameStart = window.gameScript.newGameStart

window.ssubmitPlayerRecord = (data) => {
    clearTimeout(window.submitPlayerRecordTimer)
    console.log(data);
    if (data.type == "start"){
        console.log("开局封包，立即发送");
        playTime = 0;
        window.myplayTime = 0;
    }else{
        var now = new Date();
        console.log(now.toLocaleTimeString(), "：延时：", window.myplayTime, "秒，后发送结束封包，反反作弊，请不要关闭网页，无法操作是正常现象");
        function pause(ms) {
            let date = Date.now();
            let now = null;
            do {
                now = Date.now();
            } while (now - date < ms);
        }
        pause(window.myplayTime * 1000);

    }
    window.submitPlayerRecordTimer = setTimeout(() => {
        // console.log(window.globalDelay);
        data = {
            // email: data.a,
            level: \`\`,
            game_name: 'ordz-merge',
            ...data,
        }
        _ajax({
            url: 'https://api.ordz.games/btc_nft/v1/claim/ordz-pfp/player_records',
            // url: 'https://staging-api.bitcoinnftz.xyz/btc_nft/v1/claim/ordz-pfp/player_records',
            method: 'POST',
            data: JSON.stringify(data),
            customHeaders: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
        }).then(res => {
            var now = new Date();
            console.log(now.toLocaleTimeString(), "发送成功，可以关闭网页");
        })

    }, 0.2 * 1000);
};



                `;
                (iframeDocument.body || iframeDocument.head).appendChild(script);
                console.log("注入完成");
            } catch (e) {
                console.log('Cannot access iframe contents:', e);
            }
        }
        else {
            console.log("找不到iframe");
        }
    });
})();
