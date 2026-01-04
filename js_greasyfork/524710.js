// ==UserScript==
// @name         Taoguba
// @namespace    http://tampermonkey.net/
// @version      2025-02-17
// @description  隐藏淘股吧等标题栏，摸鱼
// @author       You
// @match        https://www.taoguba.com.cn/Article/*
// @match        https://www.taoguba.com.cn/topic/*
// @match        https://www.jiuyangongshe.com/*
// @match        https://xueqiu.com/*
// @match        https://linux.do/*
// @match        https://www.iwencai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taoguba.com.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524710/Taoguba.user.js
// @updateURL https://update.greasyfork.org/scripts/524710/Taoguba.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let flag = 0;
    let displayList = []
    let header1 = document.querySelector('.Nheader')
    let header2 = document.querySelector('.jc-header')
    let header_xueqiu = document.querySelector('.nav.stickyFixed')
    let header_linuxdo = document.querySelector('.d-header')
    let header_iwencai = document.querySelector('#fixed_top_header')
    if(header1) displayList.push(header1)
    if(header2) displayList.push(header2)
    if(header_xueqiu) displayList.push(header_xueqiu)
    if(header_linuxdo) displayList.push(header_linuxdo)
    if(header_iwencai) displayList.push(header_iwencai)
    for (let el of displayList){
        if (el) el.style.display = "none"
    }

    let toggle = document.createElement('myButton')
    toggle.innerHTML = "隐藏"
    toggle.className = "Button"
    toggle.style.position = "fixed"
    toggle.style.display = "inline-block";
    toggle.style.padding = '10px 26px';
    toggle.style.zIndex = '100';
    toggle.style.right = '20px';
    toggle.style.top = '80%';
    toggle.style.opacity = '0.33';
    toggle.style.transform = 'translateY(-50%)';
    toggle.style.userSelect = 'none'
    document.body.append(toggle)

    toggle.onclick = ()=>{
        if (flag){
            for (let el of displayList){
                el.style.display = "none"
            }
            flag = 0;
        }else{
            for (let el of displayList){
                el.style.display = "block"
            }
            flag = 1;
        }
    }

    toggle.addEventListener('mouseover', (event)=>{
        event.target.style.opacity = '1';
        event.target.style.background = 'black';
        event.target.style.color = 'white';
    })

    toggle.addEventListener('mouseout', (event)=>{
        event.target.style.opacity = '0.33';
        event.target.style.background = 'white';
        event.target.style.color = 'black';
    })

})();