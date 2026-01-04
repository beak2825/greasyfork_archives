// ==UserScript==
// @name         BGA傷心小棧
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  計算剩餘牌數
// @author       YC白白
// @match        https://boardgamearena.com/*
// @match        https://boardgamearena.com/archive/replay/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=boardgamearena.com
// @grant        none
// @license      AGPL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/440414/BGA%E5%82%B7%E5%BF%83%E5%B0%8F%E6%A3%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/440414/BGA%E5%82%B7%E5%BF%83%E5%B0%8F%E6%A3%A7.meta.js
// ==/UserScript==

// 0.4 紀錄交換的牌

console.log("-----腳本開始-----")
// 紀錄交換的牌
// clearInterval(changeRecord)
console.log("-----紀錄交換的牌-----")
var old_myhandcards
var new_myhandcards
var changeTo = ''  // 下家、對家、上家
var doing = '已交換'  //正在換 已交換
changeRecord = setInterval(function() {
    // if (document.querySelector('#pagemaintitletext').innerText === '你要給下家三張自選牌') {
    if (document.querySelector('#pagemaintitletext') && document.querySelector('#pagemaintitletext').innerText.includes('三張自選牌') && doing === '已交換') {
        if (document.querySelector('#pagemaintitletext').innerText.includes('下家')) {
            changeTo = '下家'
        } else if (document.querySelector('#pagemaintitletext').innerText.includes('對家')) {
            changeTo = '對家'
        } else if (document.querySelector('#pagemaintitletext').innerText.includes('上家')) {
            changeTo = '上家'
        }
        // 紀錄原手牌
        let myhand = document.querySelectorAll('.stockitem')
        old_myhandcards = {}  // [[s2, myhand_item_19], [d9, myhand_item_22], ...]
        new_myhandcards = {}  // [[s2, myhand_item_19], [d9, myhand_item_22], ...]
        console.log(`原手牌 ${myhand.length} 張`)
        // 先遍歷所有手牌，並找出對應的ID
        for (let i = 0; i < myhand.length; i++) {
            let card = xyToCard(myhand[i].style['backgroundPosition'])
            let id = "#" + myhand[i].id
            // old_myhandcards.push([card, id])
            old_myhandcards[card] = id
        }
        // old_myhandcards.sort()
        console.log(old_myhandcards)
        document.querySelector('.to_translate').innerText = `我的手牌(${changeTo})  正在換`
        doing = '正在換'
    }
    // else if (document.querySelector('#pagemaintitletext').innerText === 'Mamie Didi POUPOU要出張牌') {
    else if (document.querySelector('#pagemaintitletext') && document.querySelector('#pagemaintitletext').innerText.includes('要出張牌') && doing === '正在換' && document.querySelectorAll('.stockitem').length === 13) {
        // 紀錄交換後的新手牌
        let myhand = document.querySelectorAll('.stockitem')
        // old_myhandcards = {}  // [[s2, myhand_item_19], [d9, myhand_item_22], ...]
        new_myhandcards = {}  // [[s2, myhand_item_19], [d9, myhand_item_22], ...]
        console.log(`新手牌 ${myhand.length} 張`)
        // 先遍歷所有手牌，並找出對應的ID
        for (let i = 0; i < myhand.length; i++) {
            let card = xyToCard(myhand[i].style['backgroundPosition'])
            let id = "#" + myhand[i].id
            // new_myhandcards.push([card, id])
            new_myhandcards[card] = id
        }
        // new_myhandcards.sort()
        console.log(new_myhandcards)
        // oldCardsList = []
        // newCardsList = []
        oldCardsList = Object.keys(old_myhandcards)
        newCardsList = Object.keys(new_myhandcards)
        let changeOut = []
        let changeIn = []
        for (let i = 0; i < oldCardsList.length; i++) {
            if (newCardsList.indexOf(oldCardsList[i]) === -1) {
                // 給出去的牌
                changeOut.push(oldCardsList[i])
            }
        }
        for (let i = 0; i < newCardsList.length; i++) {
            if (oldCardsList.indexOf(newCardsList[i]) === -1) {
                // 進來的牌
                changeIn.push(newCardsList[i])
            }
        }
        changeOut.sort()
        changeIn.sort()
        function s1ToChinese(array) {
            // console.log('-------s1ToChinese-------')
            // 此function直接改變原本的array，所以只能執行一次！
            for (let i = 0; i < array.length; i++) {
                // 1=>A 11=>J 12=>Q 13=>K
                if (array[i].length === 2 && array[i][1] === '1') {
                    array[i] = array[i][0] + 'A'
                } else if (array[i].length === 3) {
                    if (array[i][2] === '1') {
                        array[i] = array[i][0] + 'J'
                    } else if (array[i][2] === '2') {
                        array[i] = array[i][0] + 'Q'
                    } else if (array[i][2] === '3') {
                        array[i] = array[i][0] + 'K'
                    }
                }
                // s=>黑桃 h=>紅心 d=>方塊 c=>梅花
                if (array[i][0] === 's') {
                    array[i] = '黑桃' + array[i].slice(1)
                } else if (array[i][0] === 'h') {
                    array[i] = '紅心' + array[i].slice(1)
                } else if (array[i][0] === 'd') {
                    array[i] = '方塊' + array[i].slice(1)
                } else if (array[i][0] === 'c') {
                    array[i] = '梅花' + array[i].slice(1)
                }
            }
            return array
        }
        document.querySelector('.to_translate').innerText = `我的手牌(${changeTo})  出：${s1ToChinese(changeOut)}  /  進：${s1ToChinese(changeIn)}`
        doing = '已交換'
    }
}, 1000)

let btn1 = document.createElement("button")
btn1.innerHTML = "重新計算"
btn1.id = "button1"
btn1.style.top = "11px"
btn1.style.right = "110px"
btn1.style.position = "absolute"
btn1.style.zIndex = "100"
btn1.classList.add("greenCss")
greenCss()
// btn1.style.position = "relative"
// btn1.style.width = 0
// btn1.style.height = "60px"
btn1.onclick = function(){
    restart()
    clearInterval(autoplay)
    clearInterval(autoplay2)
    console.log("----停止自動打牌----")
}

let btn2 = document.createElement("button")
btn2.innerHTML = "自動隨機打牌"
btn2.id = "button2"
btn2.style.top = "11px"
btn2.style.right = "410px"
btn2.style.position = "absolute"
btn2.style.zIndex = "100"
btn2.classList.add("greenCss")
greenCss()
// btn2.style.height = "60px"
let autoplay = ""

btn2.onclick = function(){
    clearInterval(autoplay)
    console.log("-----自動打牌-----")
    autoplay = setInterval(function() {
        // 隨便打一張
        if (document.querySelector('.stockitem') && document.querySelector("#pagemaintitletext > span").innerHTML === '你') {
            document.querySelector('.stockitem').click()
            console.log("自動打一張")
        } else if (!document.querySelector('.stockitem')) {
            console.log("無手牌，自動打牌停止")
            clearInterval(autoplay)
        }
    }, 1000)
}

let btn3 = document.createElement("button")
btn3.innerHTML = "指定順序打牌"
btn3.id = "button3"
btn3.style.top = "11px"
btn3.style.right = "260px"
btn3.style.position = "absolute"
btn3.style.zIndex = "100"
btn3.classList.add("greenCss")
greenCss()
// btn3.style.height = "60px"
let autoplay2 = ""
var myhandcards
btn3.onclick = function(){
    // 判斷手牌
    let myhand = document.querySelectorAll('.stockitem')
    // let myhandcards = []  // [[s2, myhand_item_19], [d9, myhand_item_22], ...]
    myhandcards = {}  // [[s2, myhand_item_19], [d9, myhand_item_22], ...]
    console.log(`手牌 ${myhand.length} 張`)
    // 先遍歷所有手牌，並找出對應的ID
    for (let i = 0; i < myhand.length; i++) {
        let card = xyToCard(myhand[i].style['backgroundPosition'])
        let id = "#" + myhand[i].id
        // myhandcards.push([card, id])
        myhandcards[card] = id
    }
    // myhandcards.sort()
    console.log(myhandcards)
    inputCards(prompt('請輸入指定出牌順序：'))
}

// let ebd = document.querySelector('#ebd-body')
// let upperrightmenu = document.querySelector('#upperrightmenu')
let tableinfos = document.querySelector('#tableinfos')
tableinfos.parentElement.insertBefore(btn2,tableinfos)
tableinfos.parentElement.insertBefore(btn3,tableinfos)
tableinfos.parentElement.insertBefore(btn1,tableinfos)
// ingame_menu.insertBefore(btn1,ingame_menu)

// upperrightmenu.insertBefore(btn2,upperrightmenu)
// upperrightmenu.parentElement.insertBefore(btn2,upperrightmenu)
// upperrightmenu.parentElement.insertBefore(btn1,upperrightmenu)
// ebd.parentElement.insertBefore(btn2,ebd)
// ebd.parentElement.insertBefore(btn1,ebd)
// document.body.prepend(btn1)

var player = ["", "", "", ""]
for (let i = 0; i < player.length; i++) {
    // player[0] = coco10107
    player[i] = document.querySelectorAll('.playertablename')[i].innerText
}

// var player0 = document.querySelectorAll('.playertablename')[0].innerText  // coco10107
// var player1 = document.querySelectorAll('.playertablename')[1].innerText
// var player2 = document.querySelectorAll('.playertablename')[2].innerText
// var player3 = document.querySelectorAll('.playertablename')[3].innerText
// 紀錄每位玩家吃的分
var plist = [[false, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false]]

const redpoints = ['黑桃Q', 'A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']  // 豬 & 紅心
var eat4cards = []  // 紀錄4張打出的牌
var whowin = ""  // 0 1 2 3

// 紀錄每個花色各剩幾張
var ss = [true, true, true, true, true, true, true, true, true, true, true, true, true]
var hh = [true, true, true, true, true, true, true, true, true, true, true, true, true]
var dd = [true, true, true, true, true, true, true, true, true, true, true, true, true]
var cc = [true, true, true, true, true, true, true, true, true, true, true, true, true]
// const suit = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
const suit = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2']
// const suitdic = {'A':, 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'}

var spades = 13
var hearts = 13
var diamonds = 13
var clubs = 13
var i_index = 0
var st01 = ''
restart()


// 顯示每個花色剩下哪些牌
function showSuit(flower) {
    // console.log(`suit = ${suit}`)
    // console.log(`flower = ${flower}`)
    let ans = []
    for (let i = 0; i < suit.length; i++) {
        if (flower[i]) {
            // console.log(`i = ${i}`)
            ans.push(suit[i])
            // console.log(`ans = ${ans}`)
        }
    }
    return ans
}

// 更新判斷誰贏得本墩，計算是否有分
function updatePlayList() {
    console.log("eat4cards =", eat4cards)
    for (let i = 0; i < eat4cards.length; i++) {
        plist[whowin][eat4cards[i]] = true
    }
    eat4cards = []
}

// 計算此位玩家失分
function showPoints(who) {
    let ans = []
    for (let i = 0; i < redpoints.length; i++) {
        if (plist[who][i]) {
            ans.push(redpoints[i])
        }
    }
    // 若玩家有失分，則名字 => (name)
    if (ans.length > 0) {
        document.querySelectorAll('.playertablename')[who].innerText = "(" + player[who] + ")"
    }
    return ans
}

// 花色歸零
function shdcTo0() {
    ss = [true, true, true, true, true, true, true, true, true, true, true, true, true]
    hh = [true, true, true, true, true, true, true, true, true, true, true, true, true]
    dd = [true, true, true, true, true, true, true, true, true, true, true, true, true]
    cc = [true, true, true, true, true, true, true, true, true, true, true, true, true]
    spades = 13
    hearts = 13
    diamonds = 13
    clubs = 13
    plist = [[false, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false], [false, false, false, false, false, false, false, false, false, false, false, false, false, false]]
    // 玩家名字還原
    for (let i = 0; i < player.length; i++) {
        document.querySelectorAll('.playertablename')[i].innerText = player[i]
    }
}
// clearInterval(st01)

function restart() {
    console.log("-----重新計算-----")
    clearInterval(st01)
    // 找出最近的梅花2當起點
    let numCount = document.querySelectorAll('.log.log_replayable')
    for (let i = 0; i < numCount.length; i++) {
        let info = numCount[i].innerText
        info = info.replace('\n', ' ')
        let infosplit = info.split(" ")

        let find_plays = infosplit.lastIndexOf("plays")
        let card_num = ''
        let card_suit = ''
        if (find_plays != -1) {
            // 此時有找到 plays
            card_num = infosplit[find_plays + 1]
            // 有時候時間還是會黏上來，保險起見，還是取前兩位
            card_suit = infosplit[find_plays + 2].slice(0, 2)
        }

        // 打梅花2 就重新統計
        if (card_num === '2' && card_suit === '梅花') {
        // if (info.includes("2 梅花")) {
            // console.log("-----花色歸零-----")
            // shdcTo0()
            console.log("-----重新找到梅花2-----")
            i_index = parseInt(document.querySelectorAll('.log.log_replayable')[i].id.replace('log_', ""))
            // id_num = "#" + document.querySelectorAll('.log.log_replayable')[i].id
            break
        }
    }

    st01 = setInterval(function() {
        let id_num = "#log_" + i_index.toString()
        if (document.querySelector(id_num)) {
            // console.log(document.querySelector(id_num).innerHTML)
            let info = document.querySelector(id_num).innerText
            info = info.replace('\n', ' ')
            let infosplit = info.split(" ")

            let find_plays = infosplit.lastIndexOf("plays")
            let card_num = ''
            let card_suit = ''
            if (find_plays != -1) {
                // 此時有找到 plays
                card_num = infosplit[find_plays + 1]
                // 有時候時間還是會黏上來，保險起見，還是取前兩位
                card_suit = infosplit[find_plays + 2].slice(0, 2)
            }

            // 打梅花2 就重新統計
            if (card_num === '2' && card_suit === '梅花') {
            // if (info.includes("2 梅花")) {
                console.log("-----花色歸零-----")
                shdcTo0()
            }

            // 統計花色剩餘張數plays
            if (find_plays != -1 && card_suit === '黑桃') {
                ss[suit.indexOf(card_num)] = false
                spades--
            }
            else if (find_plays != -1 && card_suit === '紅心') {
                hh[suit.indexOf(card_num)] = false
                hearts--
            }
            else if (find_plays != -1 && card_suit === '方塊') {
                dd[suit.indexOf(card_num)] = false
                diamonds--
            }
            else if (find_plays != -1 && card_suit === '梅花') {
                cc[suit.indexOf(card_num)] = false
                clubs--
            }

            // 判斷誰贏得本墩，計算是否有分
            // if (info.includes("贏得本墩") && eat4cards.length === 4) {
            if (info.includes("贏得本墩")) {
                let who = info.substring(0, info.length - 4)
                for (let i = 0; i < player.length; i++) {
                    if (who === player[i]) {
                        whowin = i
                        console.log("whowin =", whowin)
                        break
                    }
                }



                // if (who === player0) {
                //     whowin = 0
                // } else if (who === player1) {
                //     whowin = 1
                // } else if (who === player2) {
                //     whowin = 2
                // } else if (who === player3) {
                //     whowin = 3
                // }
                updatePlayList()
                // 計分完歸零
                // eat4cards = []
            } else {
                if (card_suit === '黑桃' && card_num === 'Q') {
                    eat4cards.push(0)
                } else if (card_suit === '紅心') {
                    eat4cards.push(redpoints.indexOf(card_num))
                }
            }
            console.log(`i = ${i_index}, ${info}`)
            console.log(`黑桃 = ${spades}, 紅心 = ${hearts}, 方塊 = ${diamonds}, 梅花 = ${clubs}`)
            console.log(infosplit)
            console.log("card_suit:", card_suit, "  card_num:", card_num);

            // console.log(`(南)${player0} ${showPoints(0)}`)
            // console.log(`(西)${player1} ${showPoints(1)}`)
            // console.log(`(北)${player2} ${showPoints(2)}`)
            // console.log(`(東)${player3} ${showPoints(3)}`)
            console.log(`(南) ${showPoints(0)}`)
            console.log(`(西) ${showPoints(1)}`)
            console.log(`(北) ${showPoints(2)}`)
            console.log(`(東) ${showPoints(3)}`)

            console.log(`黑桃(${showSuit(ss).length.toString().padStart(2)}) ${showSuit(ss)}`)
            console.log(`紅心(${showSuit(hh).length.toString().padStart(2)}) ${showSuit(hh)}`)
            console.log(`方塊(${showSuit(dd).length.toString().padStart(2)}) ${showSuit(dd)}`)
            console.log(`梅花(${showSuit(cc).length.toString().padStart(2)}) ${showSuit(cc)}`)
            console.log("------------------")

            // console.log(`黑桃(${showSuit(ss).length}) ${showSuit(ss)}`)
            // console.log(`紅心(${showSuit(hh).length}) ${showSuit(hh)}`)
            // console.log(`方塊(${showSuit(dd).length}) ${showSuit(dd)}`)
            // console.log(`梅花(${showSuit(cc).length}) ${showSuit(cc)}`)
            // console.log(`i = ${i_index}, ${info}  s = ${spades}, h = ${hearts}, d = ${diamonds}, c = ${clubs}`)
            i_index++
        } else {

        }
    }, 100)
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

function xyToCard(pos) {
    // -900% -300% => d11
    // pos = document.querySelector("#myhand_item_48").style['backgroundPosition']
    pos = pos.replace(/[%-]/g, '')  // -200% 0% => 200 0
    pos = pos.split(' ')  // '200 0' => ['200', '0']
    // console.log(pos)
    // 黑桃2是['']這種array空字串
    if (pos.length === 1) {
        return "s2"
    }
    // 處理牌的數字，處理A：14 => 1
    let num = parseInt(pos[0]) / 100 + 2
    if (num === 14) {
        num = 1  // 處理A：14 => 1
    }
    // 處理牌的花色
    let suit = ""
    pos[1] = parseInt(pos[1])
    if (pos[1] === 0) {
        suit = 's'
    } else if (pos[1] === 100) {
        suit = 'h'
    } else if (pos[1] === 200) {
        suit = 'c'
    } else if (pos[1] === 300) {
        suit = 'd'
    }
    // console.log(suit + num)
    return suit + num
}




function inputCards(cardName) {
    var auto_index = 0
    // cardName = 's8s9s10s1s5c6h5'
    for (let i = 0; i < cardName.length - 1; i++) {
        if ("0123456789".includes(cardName[i]) && "shcd".includes(cardName[i + 1])) {
            cardName = cardName.slice(0, i + 1) + ',' + cardName.slice(i + 1)
        }
    }
    cardName = cardName.split(',')
    console.log(cardName)

    // return cardName  // ['s8', 's9', 's10', 's1', 's5', 'c6', 'h5']
    autoplay2 = setInterval(function() {
        if (document.querySelector(myhandcards[cardName[auto_index]]) && document.querySelector("#pagemaintitletext > span").innerHTML === '你') {
        // if (document.querySelector(myhandcards[cardName[auto_index]])) {  // 測試用 在不是"我"的回合也會執行
            document.querySelector(myhandcards[cardName[auto_index]]).click()
            console.log(`自動打出 ${cardName[auto_index]}`)
            auto_index++
        } else if (!document.querySelector(myhandcards[cardName[auto_index]])) {
            console.log(`無這張手牌(${cardName[auto_index]})，自動打牌停止`)
            console.log(myhandcards[cardName[auto_index]])
            clearInterval(autoplay2)
        }
    }, 1000)
}