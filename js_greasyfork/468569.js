// ==UserScript==
// @name         v2ex 复制主题摘要
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一键复制帖子链接+标题到剪切板
// @author       xianmua
// @match        https://*.v2ex.com/t/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v2ex.com
// @grant        GM_setClipboard
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468569/v2ex%20%E5%A4%8D%E5%88%B6%E4%B8%BB%E9%A2%98%E6%91%98%E8%A6%81.user.js
// @updateURL https://update.greasyfork.org/scripts/468569/v2ex%20%E5%A4%8D%E5%88%B6%E4%B8%BB%E9%A2%98%E6%91%98%E8%A6%81.meta.js
// ==/UserScript==


document.addEventListener('DOMContentLoaded',
function(){
    let a=document.querySelector('#Main .topic_buttons')
    let b=document.createElement('a')
    b.innerText='Export'
    b.href='#;'
    b.classList.add('tb')
    b.onclick = function () {
        let c=document.querySelector('.header h1').innerText//标题
        let d=document.URL
        let id=d.match(/\/t\/\d+/g)
        let text='https://www.v2ex.com'+id+'，'+c
        this.text='Copied'
        GM_setClipboard(text)
        console.log(text)
    }
    a.append(b)
})