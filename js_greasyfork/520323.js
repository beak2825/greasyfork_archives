// ==UserScript==
// @name         一键评教 for XDU
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一键评教脚本
// @author       Cheney
// @match        https://ehall.xidian.edu.cn/jwapp/sys/wspjyyapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xidian.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520323/%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%20for%20XDU.user.js
// @updateURL https://update.greasyfork.org/scripts/520323/%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%20for%20XDU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查页面是否加载出目标元素
    const checkAndClick = () => {
        Array.from(document.querySelectorAll(".bh-radio-label"))
            .filter((item)=>{return ['完全符合', '非常满意'].includes(item.innerText)})
            .forEach((item)=>{item.click()})
        Array.from(document.querySelectorAll("input[data-x-bl='100']"))
            .forEach((item)=>{ item.checked=true })
        Array.from(document.querySelectorAll("input[type='checkbox']"))
            .forEach((item)=>{ item.checked=true })
        Array.from(document.getElementsByClassName("bh-txt-input__txtarea"))
            .forEach((item)=>{ item.value="教学很负责，老师辛苦了！"; })
    };

    // 每隔 1 秒检查一次目标元素
    let interval = setInterval(checkAndClick, 1000);

    // 可选：添加手动触发按钮
    let button = document.createElement('button');
    button.textContent = '手动触发自动评教';
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.right = '10px';
    button.style.zIndex = 1000;
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 手动触发点击事件
    button.addEventListener('click', checkAndClick);
})();