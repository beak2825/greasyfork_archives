// ==UserScript==
// @name         汉语2anki
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取百度汉语词条信息
// @author       You
// @match        https://hanyu.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475076/%E6%B1%89%E8%AF%AD2anki.user.js
// @updateURL https://update.greasyfork.org/scripts/475076/%E6%B1%89%E8%AF%AD2anki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 创建收集button
    const btn = document.createElement('button')
    btn.textContent = '收集信息'
    btn.style.position = 'fixed'
    btn.style.top = '100px'
    btn.style.right = '10px'
    btn.style.zIndex = 10000000
    document.body.appendChild(btn)

    // 添加监听事件
    btn.addEventListener('click',()=>{

        // 1. 获取词条
       const header = document.getElementById('pinyin');
        const name = header.children[0].children[0].textContent
        const pinyin = header.children[0].children[1].textContent
        console.log({
            name,
            pinyin
        })
    })
})();