// ==UserScript==
// @name         哔哩哔哩猜你喜欢火狐修复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修复b站猜你喜欢扩展在最新版火狐定位错误的问题
// @author       wcx19911123
// @include      *.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419926/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%E7%81%AB%E7%8B%90%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/419926/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%E7%81%AB%E7%8B%90%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
if(!document.querySelector("#_bili_guessyoulike_css")){
    document.querySelector("head").insertAdjacentHTML("beforeend", "<style id='_bili_guessyoulike_css' type='text/css'>#_bili_guessyoulike{display:none;}</style>");
}
window.onload = function(){
    let eventId = setInterval(function(){
        let div = document.querySelector("div#_bili_guessyoulike");
        if(div){
            clearInterval(eventId);
            div.parentNode.insertAdjacentHTML("afterend", div.outerHTML);
            div.remove();
            document.querySelector("div#_bili_guessyoulike").style.display = "block";
        }
    }, 100);
};