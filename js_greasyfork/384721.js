// ==UserScript==
// @name         Appbrain remove popup window
// @namespace    http://www.wongpeace.com/
// @create       2019-06-10
// @version      0.2
// @description  针对移动端app分析网站 appbrain 的弹窗与隐藏内容进行Bug修复。
// @author       Wongpeace
// @include      
// @match        https://www.appbrain.com/app/*
// @match        https://www.appbrain.com/dev/*
// @note         2019-06-07 创建脚本
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384721/Appbrain%20remove%20popup%20window.user.js
// @updateURL https://update.greasyfork.org/scripts/384721/Appbrain%20remove%20popup%20window.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("appbrain script is lanch")
    // Your code here...
    //删除阻拦内容的透明层
    var cc = document.getElementsByClassName("blurred")
    //console.log("cc :" + cc)

    for(let index in cc) {
        var div = cc[index]
        if(div.className !== undefined)
        {
            div.className = ""
        }
    }

    //移除要求注册 gwt-PopupPanel paywall-overlay
    cc = document.getElementsByClassName("gwt-PopupPanel paywall-overlay")
    for(let index in cc) {
        div = cc[index]
        if(div.className !== undefined)
        {
            div.className = ""
        }
    }
})();