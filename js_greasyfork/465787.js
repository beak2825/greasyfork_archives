// ==UserScript==
// @name         百度文库下载器，VIP文档免费下载，打印PDF，导出文档等。
// @version      1.0
// @description  百度文库解析下载功能，利用第三方站友好展示，可打印PDF格式导出。脚本仅限学习。
// @author       k
// @license      MIT
// @match        *://wenku.baidu.com/*
// @match        *://wk.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        unsafeWindow
// @run-at       document-start
// @namespace https://greasyfork.org/users/424052
// @downloadURL https://update.greasyfork.org/scripts/465787/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%8CVIP%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%89%93%E5%8D%B0PDF%EF%BC%8C%E5%AF%BC%E5%87%BA%E6%96%87%E6%A1%A3%E7%AD%89%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/465787/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E4%B8%8B%E8%BD%BD%E5%99%A8%EF%BC%8CVIP%E6%96%87%E6%A1%A3%E5%85%8D%E8%B4%B9%E4%B8%8B%E8%BD%BD%EF%BC%8C%E6%89%93%E5%8D%B0PDF%EF%BC%8C%E5%AF%BC%E5%87%BA%E6%96%87%E6%A1%A3%E7%AD%89%E3%80%82.meta.js
// ==/UserScript==


// ==/useBootStrap==
//"https://www.bootcss.com/"
(function(){
    'use strict'
window.addEventListener('load', () => {
    addButton('文库下载', selectReadFn)
    })
function addButton(text, onclick, cssObj) {
        cssObj = cssObj || {position: 'absolute', bottom: '50%', left:'80%', 'z-index': 3, width:'50px',position: 'fixed',}
        let button = document.createElement('button'), btnStyle = button.style
        document.body.appendChild(button)
        button.innerHTML = text
        button.onclick = onclick
        Object.keys(cssObj).forEach(key => btnStyle[key] = cssObj[key])
        return button
    }
function selectReadFn() {
     window.open("http://api.bdwenku.com/?urls="+location.href);
}
}())