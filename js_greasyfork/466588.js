// ==UserScript==
// @name         2048bot
// @namespace    http://tampermonkey.net/
// @version      0.9415
// @description  Lie back and watch the dumb bot play!
// @author       boynextdesk
// @match        https://play2048.co/*
// @icon         https://play2048.co/favicon.ico
// @grant        none
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/466588/2048bot.user.js
// @updateURL https://update.greasyfork.org/scripts/466588/2048bot.meta.js
// ==/UserScript==

/*
* 128   64  32  16
* 64    32  16  8
* 32    16  8   4
* 16    8   4   2
*
* */

(function() {
    // todo: inspect whether game is over
    // todo: train strategy after game-over
    // todo: set speed and strategy through page
    // todo: beautify layout
    // todo: everlasting game - auto retry until winning
    // todo: bundle direction-ava functinos into an object to global users
    'use strict';
    const eventUp = new KeyboardEvent('keydown', {
        key: "w",
        keyCode: 87,
        which: 87,
        code: "KeyW",
        location: 0,
        description: "w"
    });
    const eventLeft = new KeyboardEvent('keydown', {
        key: "a",
        keyCode: 65,
        which: 65,
        code: "KeyA",
        location: 0,
        description: "a"
    });
    const eventRight = new KeyboardEvent('keydown', {
        key: "d",
        keyCode: 68,
        which: 68,
        code: "KeyD",
        location: 0,
        description: "d"
    });
    const eventDown = new KeyboardEvent('keydown', {
        key: "s",
        keyCode: 83,
        which: 83,
        code: "KeyS",
        location: 0,
        description: "s"
    });

    // thanks to https://zeit.co/blog/async-and-await
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function lose() {
        return document.getElementsByClassName("game-message game-over")[0] != null
    }
    function win() {
        return document.getElementsByClassName("game-message game-win")[0] != null
    }
    function over() {
        return lose() || win()
    }
    function inspect() {
        const board = Array();
        for(let j = 1 ; j <= 4 ; j++) // row
        {
            const unit4 = Array();
            for(let i = 1 ; i <= 4 ; i++) //column
            {
                const className = "tile-position-"+i+"-"+j
                const tiles = document.getElementsByClassName(className)
                const len = tiles.length
                const tile = tiles[len - 1]
                /// console.log(className)
                let val = 0;
                if(tile != null){
                    val = tile.firstChild.lastChild.nodeValue
                    val = Number(val)
                    /// console.log(val)
                }
                unit4[i] = val
            }
            board[j] = unit4
        }
        return board
    }
    const aboveBox = document.getElementsByClassName("above-game")[0];
    const btnTemplate = document.getElementsByClassName("restart-button")[0];
    let speed = 10;
    let speedIndex = 0;
    let switchU = true;
    aboveBox.appendChild(btnTemplate.cloneNode(false));
    aboveBox.appendChild(btnTemplate.cloneNode(false));
    aboveBox.appendChild(btnTemplate.cloneNode(false));
    //
    const btns = document.getElementsByClassName("restart-button");
    //
    const btnStartAuto = btns[1];
    const startText = document.createTextNode("Start Auto");
    btnStartAuto.appendChild(startText)
    //
    const btnStopAuto = btns[2];
    const stopText = document.createTextNode("Stop Auto");
    btnStopAuto.appendChild(stopText)
    //
    const btnSpeedAuto = btns[3];
    const speedText = document.createTextNode("Change Speed");
    btnSpeedAuto.appendChild(speedText)
    //
    let moveOn = false;
    let moveCnt = 0;
    let globalBoard = null;
    document.tagName = "not input"
    const strategy01 = function () {
        const num = Math.random();
        let dispatchee = null;
        moveCnt += 1
        const rate = 1 - Math.min(48 / moveCnt, 0.8)
        const downL = 0.02 * rate
        const rightL = downL + 0.02 * rate;
        if (num < downL) {
            dispatchee = eventDown;
            console.log("down");
        } else if (num < rightL) {
            dispatchee = eventRight;
            console.log("right");
        } else if (switchU) {
            dispatchee = eventLeft
            console.log("left")
            switchU = false
        } else {
            dispatchee = eventUp
            console.log("up")
            switchU = true
        }
        return dispatchee
    };
    const strategy02 = function () {
        const board = globalBoard
        if(board == null)
            return eventLeft
        const directionAvailable = function(offsetI, offsetJ){
            for(let i = 1 ; i <= 4 ; i++){
                for(let j = 1 ; j <= 4 ; j++){
                    const ni = i + offsetI
                    const nj = j + offsetJ
                    if(ni < 1 || ni > 4) continue
                    if(nj < 1 || nj > 4) continue
                    if(board[i][j] === 0) continue;
                    if(board[ni][nj] === board[i][j] || board[ni][nj] === 0)
                        return true
                }
            }
            return false
        }
        const dir = [[0, -1], [-1, 0], [1, 0], [0, 1]]
        const msg = ["left", "up", "down", "right"]
        const funcArr = [eventLeft, eventUp, eventDown, eventRight]
        for(let i = 0 ; i < 4 ; i++){
            const con = directionAvailable(dir[i][0], dir[i][1])
            if(con){
                console.log(msg[i])
                return funcArr[i]
            }
            //console.log(msg[i] + " unavailable")
        }
        return funcArr[0]
    }
    const moveOneKey = function () {
        if (!moveOn) {
            console.log("Cancelled.")
            return
        }
        const dispatchee = strategy02();
        document.dispatchEvent(dispatchee)
    };

    const startListener = async function () {
        console.log("start")
        moveOn = true;
        while (moveOn) {
            await sleep(10 * speed).then(() => {
                if(over()){
                    moveOn = false
                    console.log("Game over.")
                }
                const board = inspect();
                console.log(board)
                globalBoard = board
            })
            await sleep(70 * speed).then(moveOneKey)
        }
    };

    const stopListener = function () {
        moveOn = false;
        moveCnt = 0
    }
    const speedListener = function () {
        const speeds = [10, 5, 1];
        const words = ["switch to low speed", "switch to fast speed", "switch to super fast speed"];
        const len = 3
        speedIndex = (speedIndex + 1) % len
        speed = speeds[speedIndex]
        console.log(words[speedIndex])
    }

    btnStartAuto.addEventListener('click', startListener)
    btnStopAuto.addEventListener('click', stopListener)
    btnSpeedAuto.addEventListener('click', speedListener)

})();