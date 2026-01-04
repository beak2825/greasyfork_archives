// ==UserScript==
// @name         ublock instagram copy
// @namespace    https://greasyfork.org/zh-CN/scripts/443290-adblock4limbo-adsremoveproject
// @version      0.0.1
// @license      CC BY-NC-SA 4.0
// @description  解除 Instagram 桌面浏览器版“禁用右键复制图片”
// @author       limbopro
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=limbopro.com
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447080/ublock%20instagram%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/447080/ublock%20instagram%20copy.meta.js
// ==/UserScript==

// 一些常量
const imax = {
    css: {
        instagram: "div._aagw {display:none!important}"
    }
}

css_adsRemove(imax.css.instagram);

// 动态创建引用内部资源 内嵌式样式 内嵌式脚本
function css_adsRemove(newstyle, delaytime, id) {
    setTimeout(() => {
        var creatcss = document.createElement("style");
        creatcss.id = id;
        creatcss.innerHTML = newstyle;
        document.getElementsByTagName('head')[0].appendChild(creatcss)
        //console.log("CSS样式新增完毕！");
    }, delaytime);
}