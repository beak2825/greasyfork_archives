// ==UserScript==
// @name         野狐棋譜下載
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  野狐棋譜網頁版，下載棋譜sgf檔
// @author       YC白白
// @match        http://h5.foxwq.com/txwqshare/*
// @icon         https://www.google.com/s2/favicons?domain=foxwq.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/439201/%E9%87%8E%E7%8B%90%E6%A3%8B%E8%AD%9C%E4%B8%8B%E8%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/439201/%E9%87%8E%E7%8B%90%E6%A3%8B%E8%AD%9C%E4%B8%8B%E8%BC%89.meta.js
// ==/UserScript==

// 創copy的button
let copyGoScore = document.createElement("button")
copyGoScore.id = "copyGoScore"
copyGoScore.innerHTML = '下載棋譜'  // 下載棋譜sgf檔
copyGoScore.style.height = "100px"
copyGoScore.style.width = "100px"
// copyGoScore.style.bottom = "15px"
// copyGoScore.style.left = "5px"
// copyGoScore.style.position = "relative"
// copyGoScore.style.border = "none"
// copyGoScore.style.background = "#4CAF50"
copyGoScore.classList.add("greenCss")
//greenCss()  // 變綠色按鈕
//document.body.prepend(copyGoScore)
//insertAfter(copyGoScore, document.getElementsByClassName("buttons")[0])
//document.getElementsByClassName("buttons")[0].appendChild(copyGoScore)
// document.getElementsByClassName("buttons")[0].append(copyGoScore)
document.querySelector("body").append(copyGoScore)

copyGoScore.onclick = function(){
    // 點擊複製棋譜
    // 最後一手是白 正常
    // 最後一手是黑 讓黑最後一手用下的，不要用AB
    let isWhite = document.querySelector("#gameView > ul").lastChild.className === 'chessWhite'

    let numToABC = "abcdefghijklmnopqrs"

    let ab = "AB"
    // let abLast = ""
    let chessBlack = document.getElementsByClassName("chessBlack")
    for (let i = 0; i < chessBlack.length; i++) {

        let getxy = chessBlack[i].style.cssText
        getxy = getxy.split(";")  // ['left: 7.78667rem', ' top: 1.69333rem', '']
        let xpos = Number(getxy[0].replace(/[^0-9\.]/g,""))
        let ypos = Number(getxy[1].replace(/[^0-9\.]/g,""))
        xpos = Math.round((xpos * 75 - 14) / 38)
        ypos = Math.round((ypos * 75 - 13) / 38)
        if (!isWhite && i === chessBlack.length - 1) {
            // 最後一手是黑 且 最後一手時 黑用下的 不使用AB
            ab += `;B[${numToABC[xpos]}${numToABC[ypos]}]`
        } else {
            ab += `[${numToABC[xpos]}${numToABC[ypos]}]`
        }
    }

    let aw = "AW"
    let chessWhite = document.getElementsByClassName("chessWhite")
    for (let i = 0; i < chessWhite.length; i++) {
        let getxy = chessWhite[i].style.cssText
        getxy = getxy.split(";")  // ['left: 7.78667rem', ' top: 1.69333rem', '']
        let xpos = Number(getxy[0].replace(/[^0-9\.]/g,""))
        let ypos = Number(getxy[1].replace(/[^0-9\.]/g,""))
        xpos = Math.round((xpos * 75 - 14) / 38)
        ypos = Math.round((ypos * 75 - 13) / 38)
        aw += `[${numToABC[xpos]}${numToABC[ypos]}]`

    }

    // 範本 goScore = "(;SZ[19]KM[6.5]RU[chinese]AW[ad]AB[ac])"
    let pb = document.getElementsByClassName("player_black_name")[0].innerHTML
    let pw = document.getElementsByClassName("player_white_name")[0].innerHTML
    let br = document.getElementsByClassName("player_blackG")[0].innerHTML
    let wr = document.getElementsByClassName("player_whiteG")[0].innerHTML
    // PB[思想的星空]  PW[局道]  BR[9段]  WR[9段]
    // let goScore = "(;SZ[19]KM[6.5]" + pb + pw + br + wr + "RU[chinese]" + aw + ab + ")"
    let goScore = `(;SZ[19]KM[6.5]PB[${pb}]PW[${pw}]BR[${br}]WR[${wr}]RU[chinese]${aw}${ab})`
    // console.log(goScore)
    // document.getElementsByClassName("guessPlayerHeader")[0].innerText // '第148手'

    const value = goScore
    const el = document.createElement('textarea')
    el.value = value
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    console.log(goScore)
    // [思想的星空 9段]vs[局道 9段]
    let filename = `[${pb} ${br}]vs[${pw} ${wr}].sgf`
    // let filename = document.getElementById("playTitle").innerHTML + ".sgf"
    downloadSgf(filename, goScore)
}

function downloadSgf(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function greenCss() {
    let cssStyle = document.createElement("style")
    cssStyle.id = "cssStyle"
    let cssStr = `
    .greenCss {
        background-color:#00bb10;
        border-radius:33px;
        color:#fff;
        cursor:pointer;
        display:inline-block;
        font-size:13px;
        margin-right:5px;
        overflow:hidden;
        padding:11px 0;
        text-align:center;
        white-space:nowrap;
        width:140px;
    }
    .greenCss:hover{
        background-color:#6ccc63;
    }
    .greenCss:active{
        background: #000000;   /* 黑色 */
        opacity: 0.5;    /* 設置不透明度（可以不設置） */
    }
    `
    cssStyle.innerHTML = cssStr
    document.querySelector("head").append(cssStyle)
}


if (document.getElementsByClassName("game_view board_size_9")[0]) {
    document.getElementsByClassName("game_view board_size_9")[0].remove()
    console.log("已移除9路")
} else {
    console.log("沒找到9路")
}

if (document.getElementsByClassName("game_view board_size_13")[0]) {
    document.getElementsByClassName("game_view board_size_13")[0].remove()
    console.log("已移除13路")
} else {
    console.log("沒找到13路")
}