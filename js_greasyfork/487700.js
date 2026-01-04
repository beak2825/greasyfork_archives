// ==UserScript==
// @name         🔥🔥🔥ChatGPT4.0网页版安装即用（永久免费）🔥🔥🔥
// @version      0.13
// @description  ChatGPT4.0网页版安装即用（永久免费）
// @author       clinch
// @license      MIT
// @match        *://wenku.baidu.com/*
// @match        *://wk.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/718868
// @downloadURL https://update.greasyfork.org/scripts/487700/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5ChatGPT40%E7%BD%91%E9%A1%B5%E7%89%88%E5%AE%89%E8%A3%85%E5%8D%B3%E7%94%A8%EF%BC%88%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/487700/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5ChatGPT40%E7%BD%91%E9%A1%B5%E7%89%88%E5%AE%89%E8%A3%85%E5%8D%B3%E7%94%A8%EF%BC%88%E6%B0%B8%E4%B9%85%E5%85%8D%E8%B4%B9%EF%BC%89%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==
 
 
// ==/useBootStrap==
//"https://www.bootcss.com/"
(function(){
    'use strict'
window.addEventListener('load', () => {
    addButton('下载跳转', selectReadFn)
    })
function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '50%', left:'2%', 'z-index': 3, width:'50px',position: 'fixed'}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }
function selectReadFn() {
     window.open("https://clinch123.gitee.io/checkhtml/?url="+location.href);
}
}())