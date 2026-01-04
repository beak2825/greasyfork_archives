// ==UserScript==
// @name HelloKitty
// @namespace AcanAddPaimeng
// @description 给页面右下角加上HelloKitty
// @include *
// @version 0.3
// @grant none
// @author Acan
// @icon none
// @run-at document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463256/HelloKitty.user.js
// @updateURL https://update.greasyfork.org/scripts/463256/HelloKitty.meta.js
// ==/UserScript==

var body
var Paimeng
var character
var flag_1 = false

var runAsync = function () {
    var q = new Promise((resolve, reject) => {
        resolve()
    })
    return q
}

runAsync().then(() => {
    body = document.getElementsByTagName("body")[0];
    Paimeng = document.createElement("div")
    Paimeng.innerHTML = `
        <img id="character" src="https://s2.loli.net/2023/04/04/POd4lKHhV2Cyaw3.png" style="width: 150px;">
    `
    Paimeng.style.bottom = "50px"
    Paimeng.style.right = "50px"
    Paimeng.style.position = "fixed"
    Paimeng.style.fontSize = "small"
    Paimeng.style.letterSpacing = "0.5em"
    Paimeng.style.zIndex = "2147483584"
    body.appendChild(Paimeng)
}).then(() => {
    character = document.getElementById("character")
    character.style.bottom = "50px"
    character.style.right = "50px"
    character.style.position = "fixed"
}).then(() => {
    body.appendChild(Paimeng)
}).then(() => {
    character.onclick = function () {
        if (flag_1 == false) {
            flag_1 = true
            var message = document.createElement("p")
            message.innerText = "傻姑娘Sharon早上不起床"
            message.style.bottom = "220px"
            message.style.right = "10px"
            message.style.position = "fixed"
            message.style.backdropFilter = "blur(3px)"
            message.style.borderLeft = "2px solid rgba(255,255,255,0.3)"
            message.style.borderTop = "2px solid rgba(255, 255, 255, 0.3)"
            message.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.2)"
            Paimeng.appendChild(message)
            setTimeout(() => {
                flag_1 = false
                message.style.visibility = "hidden"
            }, 2000);
        }
    }
})