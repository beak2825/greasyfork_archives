// ==UserScript==
// @name         知乎标题栏隐藏或显示
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       DSun
// @match        https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389281/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E6%A0%8F%E9%9A%90%E8%97%8F%E6%88%96%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/389281/%E7%9F%A5%E4%B9%8E%E6%A0%87%E9%A2%98%E6%A0%8F%E9%9A%90%E8%97%8F%E6%88%96%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let flag = 0;
    let displayList = []
    let appHeader = document.querySelector('.QuestionHeader')
    let zhuanLan = document.querySelector('.ColumnPageHeader-Wrapper')
    let headerTag = document.getElementsByTagName('header')[0]
    let divX = document.querySelector('div[data-zop-question]')
    if (zhuanLan) displayList.push(zhuanLan)
    if (headerTag) displayList.push(headerTag)
    if (divX) displayList.push(divX)
    if (appHeader) displayList.push(appHeader)
    for (let el of displayList){
        if (el) el.style.display = "none"
    }
    let toggle = document.createElement('myButton')
    toggle.innerHTML = "Toggle"
    toggle.className = "Button"
    toggle.style.position = "fixed"
    toggle.style.display = "inline-block";
    toggle.style.padding = '10px 26px';
    toggle.style.zIndex = '100';
    toggle.style.right = '20px';
    toggle.style.top = '50%';
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
