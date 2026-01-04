// ==UserScript==
// @name         快速复制页面url+标题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       xianmua
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/469156/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E9%A1%B5%E9%9D%A2url%2B%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/469156/%E5%BF%AB%E9%80%9F%E5%A4%8D%E5%88%B6%E9%A1%B5%E9%9D%A2url%2B%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

let content
let originTitle=document.title

function genContent() {
    if(document.querySelector('#article_title')) {//如果能获取到id为article_title的元素
        content = document.URL+'，'+document.querySelector('#article_title').innerText
        GM_setClipboard(content)
    }else {
        if (originTitle.includes('-')) {//如果标题中有’-‘短横线
            let lastIndex = originTitle.lastIndexOf('-');
            let result = originTitle.slice(0, lastIndex).trim();
            //console.log(result); // 输出以-为标志的前面的文字内容，并且使用trim去掉两头的空格
            content = document.URL+'，'+result
            GM_setClipboard(content)
        }else{
            content = document.URL+'，'+originTitle
            GM_setClipboard(content)
        }
    }
}
//genContent()
document.addEventListener("keydown", function(){keyFunc(event)});
var keyFunc = function (event) {
    var e = event || window.event || arguments.callee.caller.arguments[0];
    if (e.keyCode == 187 && e.altKey && e.ctrlKey){ //同时按下ctrl+alt+ =
        genContent()
    }
}