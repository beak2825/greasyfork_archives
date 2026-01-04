//支持香港站
//如果需要其他地址适配 请在GreasyFork发表反馈
//The modified version code comes from:
//https://greasyfork.org/zh-CN/users/566425
//https://greasyfork.org/zh-CN/scripts/398025/discussions/51417
//Thanks very much!

// ==UserScript==
// @name               Google翻译 Chrome强制夜间模式视觉修复
// @name:zh-CN         Google翻译 Chrome强制夜间模式视觉修复
// @name:zh-TW         Google翻譯 Chrome強制夜間模式視覺修復
// @name:en            Google Translate: Chrome Force Night Mode Visual Fix
// @namespace          https://www.baidu.com/
// @version            1.0.8
// @description        删除Google翻译的一个元素 使强制进入夜间模式功能开启后视觉效果更佳
// @description:zh-CN  删除Google翻译的一个元素 使强制进入夜间模式功能开启后视觉效果更佳
// @description:zh-TW  刪除Google翻譯的一個元素 使強制進入夜間模式功能開啟後視覺效果更佳
// @description:en     Remove an element of Google Translate to make the visual effect better when the forced night mode feature is turned on.
// @author             xfqwdsj
// @match              *://translate.google.com/*
// @match              *://translate.google.cn/*
// @match              *://translate.google.com.tw/*
// @match              *://translate.google.com.hk/*
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/398025/Google%E7%BF%BB%E8%AF%91%20Chrome%E5%BC%BA%E5%88%B6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E8%A7%86%E8%A7%89%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/398025/Google%E7%BF%BB%E8%AF%91%20Chrome%E5%BC%BA%E5%88%B6%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E8%A7%86%E8%A7%89%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function (ca) { //remove by classes array
    var c, el;
    while (c=ca.shift()) {
        el=document.getElementsByClassName( c ); // el is live collection!
        while (el[0]) { // or upside down for(var i=el.length-1; i>-1; i--)...
            el[0].parentNode.removeChild(el[0]); // or el[0].remove()
        }
    }
})( ["ls-right-arrow", "sugg-fade"] );