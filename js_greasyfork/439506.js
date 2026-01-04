// ==UserScript==
// @name         disney+ auto speed
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  可自由增減disney+影片播放速度
// @author       YC白白
// @match        https://www.disneyplus.com/*
// @icon         https://www.google.com/s2/favicons?domain=disneyplus.com
// @run-at       document-end
// @grant        unsafeWindow
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/439506/disney%2B%20auto%20speed.user.js
// @updateURL https://update.greasyfork.org/scripts/439506/disney%2B%20auto%20speed.meta.js
// ==/UserScript==

// v0.1 可自由增減 disney+ 影片播放速度
// v0.2 新增調整影片速度的 "+" "-" 按鈕

/*
增減speed鍵盤快捷鍵：
c：加速
x：減速
z：回到一倍速
*/

// 提示Speed，會逐漸消失
let showSpeed = document.createElement("div")
let st = ""
showSpeed.style.position = "fixed"
showSpeed.style.zIndex = "100001"
showSpeed.style.top = "0px"
showSpeed.style.left = "0px"
showSpeed.style.color = "#55558e"
showSpeed.style.fontSize = "60px"
showSpeed.id = "hint"
showSpeed.innerHTML = ''
document.body.prepend(showSpeed)

let stPlusMinus = setInterval(function(){
    if (document.querySelector(".fullscreen-icon")) {
        // console.log("發現fullscreen")
        let itm = document.querySelector(".fullscreen-icon")

        // 創建 "-" 按鈕
        let btnMinus = itm.cloneNode(true)
        btnMinus.innerHTML = "-"
        btnMinus.id = "button2"
        btnMinus.ariaLabel = '速度-'
        btnMinus.style.backgroundColor = "white"
        btnMinus.onclick = function(){
            if (document.querySelector("video").playbackRate > 0.1) {
                document.querySelector("video").playbackRate = Math.round((document.querySelector("video").playbackRate - 0.1) * 10) / 10
            }
            let hintStr = `speed = ${document.querySelector("video").playbackRate}`
            console.log(hintStr)
            showhint(hintStr)
        }
        pos = document.querySelector(".audio-control")
        pos.parentElement.insertBefore(btnMinus, pos)

        // 創建 "+" 按鈕
        let btnPlus = itm.cloneNode(true)
        btnPlus.innerHTML = "+"
        btnPlus.id = "button1"
        btnPlus.ariaLabel = '速度+'
        btnPlus.style.backgroundColor = "white"
        btnPlus.onclick = function(){
            document.querySelector("video").playbackRate = Math.round((document.querySelector("video").playbackRate + 0.1) * 10) / 10
            let hintStr = `speed = ${document.querySelector("video").playbackRate}`
            console.log(hintStr)
            showhint(hintStr)
        }
        pos = document.querySelector(".audio-control")
        pos.parentElement.insertBefore(btnPlus, pos)

        clearInterval(stPlusMinus)
    }
}, 1000)


function showhint(nowSpeed) {
    clearInterval(st)
    // 提示從這邊開始滑
    showSpeed.style.top = "160px"
    showSpeed.style.left = "160px"

    let leftnum = 160
    showSpeed.innerHTML = nowSpeed
    showSpeed.style.opacity = 1
    if(showSpeed.style.opacity !=0){
        let num = 500
        // let st = setInterval(function(){
        st = setInterval(function(){
            // leftnum = leftnum + 0.5
            if (leftnum <= 200) {
                leftnum = leftnum + 320 / leftnum
            } else {
                leftnum = leftnum + 0.3
            }
            showSpeed.style.left = `${leftnum}px`
            num--
            showSpeed.style.opacity = num / 100
            if (num <= 0) {
                clearInterval(st)
                // 提示結束時，回到0,0
                showSpeed.style.top = "0px"
                showSpeed.style.left = "0px"
            }
        }, 1)
    }
}

window.addEventListener('keydown', function(key){
    // console.log(key)
    switch (key['code']) {
        case 'KeyZ' :
            document.querySelector("video").playbackRate = 1
            console.log(`speed = ${document.querySelector("video").playbackRate}`)
            showhint(`speed = ${document.querySelector("video").playbackRate}`)
            break
        case 'KeyC' :
            document.querySelector("video").playbackRate = Math.round((document.querySelector("video").playbackRate + 0.1) * 10) / 10
            console.log(`speed = ${document.querySelector("video").playbackRate}`)
            showhint(`speed = ${document.querySelector("video").playbackRate}`)
            break
        case 'KeyX' :
            if (document.querySelector("video").playbackRate > 0.1) {
                document.querySelector("video").playbackRate = Math.round((document.querySelector("video").playbackRate - 0.1) * 10) / 10
            }
            console.log(`speed = ${document.querySelector("video").playbackRate}`)
            showhint(`speed = ${document.querySelector("video").playbackRate}`)
            break
    }
})