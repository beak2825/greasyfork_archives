// ==UserScript==
// @name         隱藏Youtube結尾推薦影片
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隱藏Youtube結尾推薦影片 & 訂閱按鈕
// @author       YC白白
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        unsafeWindow
// @grant        GM_addStyle
// @license      AGPL
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/439203/%E9%9A%B1%E8%97%8FYoutube%E7%B5%90%E5%B0%BE%E6%8E%A8%E8%96%A6%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/439203/%E9%9A%B1%E8%97%8FYoutube%E7%B5%90%E5%B0%BE%E6%8E%A8%E8%96%A6%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

let st1 = setInterval(function() {
    if (document.getElementsByClassName("ytp-ce-element")) {
        let ytElement = document.getElementsByClassName("ytp-ce-element")
        for (let i = 0; i < ytElement.length; i++) {
            ytElement[i].style.display = "none"
            console.log("已隱藏ytElement[" + i.toString() + "]")
        }
        clearInterval(st1)
    } else {
        console.log("沒找到ytElement")
    }
}, 1000)

/*
alert("hello")
if (document.getElementsByClassName("ytp-ce-element")) {
    //alert("if")
    let ytElement = document.getElementsByClassName("ytp-ce-element")
    alert(ytElement.length)
    for (let i = 0; i < ytElement.length; i++) {
        ytElement[i].style.display = "none"
        console.log("已隱藏[" + i.toString + "]")
    }
} else {
    alert("else")
    console.log("沒找到")
}



let ytElement = document.getElementsByClassName("ytp-ce-element")
for (let i = 0; i < ytElement.length; i++) {
    ytElement[i].style.display = "none"
    console.log("已隱藏[" + i.toString + "]")
}
*/
//document.getElementsByClassName("ytp-ce-element")[0].style.display = "none"