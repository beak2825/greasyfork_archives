// ==UserScript==
// @name         贴吧帖子点击看大图
// @namespace    qtqz
// @version      0.4
// @description  贴吧帖子点击看大图，不用再跳转到臃肿的新页面。
// @author       qtqz
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.baidu.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486583/%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E7%82%B9%E5%87%BB%E7%9C%8B%E5%A4%A7%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/486583/%E8%B4%B4%E5%90%A7%E5%B8%96%E5%AD%90%E7%82%B9%E5%87%BB%E7%9C%8B%E5%A4%A7%E5%9B%BE.meta.js
// ==/UserScript==
//2025-02-18 建议用其他脚本

//2024-04-01 修复翻页后失效

//2024-01-26
//部分代码参考了https://greasyfork.org/zh-CN/scripts/784-%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%A7%91%E5%AD%A6%E7%9C%8B%E5%9B%BE%E5%90%9B
//改动：新标签打开改为页内打开
//待办：滚轮缩放图片
(function() {
    'use strict';
setTimeout(()=>{
   window.open = () => { }
   setInterval(()=>{
    if(window.Adjkdt!=window.location.href){
        func()
        window.Adjkdt=window.location.href
    }
},5000)
   const func=()=>{
        let largeDiv = document.createElement('div')
        let largeImg = document.createElement('img')
        let largeDiv2 = document.createElement('div')
        largeDiv2.style = 'flex-grow: 1;'
        let largeDiv3 = largeDiv2.cloneNode()
        largeDiv.style = `display: none;
            flex-direction: column;
            position: fixed;
            top: 0;
            z-index: 20000;
            width: 100%;
            overflow-y: auto;
            height: 100%;
            /*justify-content: center;*/
            align-items: center;
            background-color: rgba(0,0,0,0.5);`
        largeImg.style = 'max-width: 100%;'
        largeDiv.id = 'la'
        largeDiv.prepend(largeDiv3, largeImg, largeDiv2)
        document.querySelector('body').prepend(largeDiv)

        largeImg.addEventListener('click', () => {
            document.querySelector('#la').style.display = 'none'
        })

        document.querySelectorAll('.p_content img').forEach((i) => {
            i.addEventListener('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                let url = null
                let im = /^https?:\/\/.*?w%3D580.*?\/([^\/\.]+)\.[a-z]{3,4}[^_]+_.*/.exec(e.target.src);
                if (im != null) {
                    let tid = /\/p\/(\d+)/.exec(location)[1]
                    var xhr = new XMLHttpRequest()
                    xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                            url = JSON.parse(this.responseText).data.img.original.waterurl
                        }
                    };
                    xhr.open("GET", "https://tieba.baidu.com/photo/p?alt=jview&pic_id=" + im[1] + "&tid=" + tid, false)
                    xhr.send()
                }
                if (url) {
                    let i = document.querySelector('#la img')
                    i.src = url
                    i.parentElement.style.display = 'flex'
                }
            })
        })
   }
   func()
},800)
    // Your code here...
})();