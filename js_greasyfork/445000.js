// ==UserScript==
// @name         KKKKKKK=天猫店铺排序
// @namespace    undefined
// @version      1.0
// @description  ————
// @author       ff
// @grant        GM_setValue
// @grant        GM_getValue
// @match *://*.tmall.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445000/KKKKKKK%3D%E5%A4%A9%E7%8C%AB%E5%BA%97%E9%93%BA%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/445000/KKKKKKK%3D%E5%A4%A9%E7%8C%AB%E5%BA%97%E9%93%BA%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    Run();

})();

function Run() {
    let button = document.createElement("button"); //创建一个按钮
    button.textContent = "新品"; //按钮内容
    button.style.width = "50px"; //按钮宽度
    button.style.height = "28px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#e33e33"; //按钮底色
    button.style.border = "1px solid #e33e33"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.addEventListener("click", OnClickButton) //监听按钮点击事件

    let div = document.getElementsByClassName("mlogo")
    div[0].appendChild(button)
    function OnClickButton() {
        let host = location.host
        location.href = "https://" + host + "/search.htm?search=y&orderType=newOn_desc"
    }
}
