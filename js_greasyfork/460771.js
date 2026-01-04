// ==UserScript==
// @name         Dark之爱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  DarkLOVE
// @author       FeiBaFly
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460771/Dark%E4%B9%8B%E7%88%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/460771/Dark%E4%B9%8B%E7%88%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
const darkImage = document.getElementsByClassName("header-banner__inner")
darkImage[0].innerHTML = "Dark❤ Love❤ 天依❤"
darkImage[0].setAttribute("style","font-size:50px;color:pink;")
darkImage[0].setAttribute("style","font-size:50px;color:red;border:2px solid white;")
const remen = document.getElementsByClassName("icon-title")
remen[0].innerHTML = "动♂态"
remen[1].innerHTML = "DARK♂LOVE"
remen[1].innerHTML = "哲♂学"
remen[2].innerHTML = "击♂剑"
function RemenRe() {
    const remenBang = document.getElementsByClassName("trending-text")
remenBang[0].innerHTML = "DARK与天依结婚了！"
remenBang[1].innerHTML = "DARK在线击剑♂"
remenBang[2].innerHTML = "天依哭晕在厕所"
}
const SearchDian = document.getElementsByClassName("nav-search-input")
SearchDian[0].addEventListener("click",RemenRe)
const yinyueBenti = document.createElement("iframe",)
const yinyue = document.getElementsByClassName("channel-link")
yinyueBenti.setAttribute("frameborder","no")
yinyueBenti.setAttribute("src","//music.163.com/outchain/player?type=2&id=509106602&auto=1&height=66")
yinyue[0].appendChild(yinyueBenti)
})();