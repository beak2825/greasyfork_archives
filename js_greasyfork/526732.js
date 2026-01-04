// ==UserScript==
// @name         autoRes
// @namespace    http://tampermonkey.net/
// @version      2025-02-10
// @description  七鱼自动回复
// @author       You
// @match        https://mjhlwkjnjyxgs.qiyukf.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qiyukf.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526732/autoRes.user.js
// @updateURL https://update.greasyfork.org/scripts/526732/autoRes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const CONFIG = {
    SCAN_INTERVAL: 30000,          // 主扫描间隔30秒
    PARENT_CLASS: 'm-chat-sessionlist-item',  // 父元素类名
    TARGET_CLASS: 'css-3kxpjb',     // 目标元素类名
    MAX_RETRY: 3                    // 失败重试次数
};
    let statue = 0
    let intervalId
   let listRes = []
    const autoRes = ()=>{
        let mssage = document.querySelector('.ql-editor p')
        let Sbtn =  document.querySelector('.ant-btn.ant-btn-primary.ant-btn-compact-item.ant-btn-compact-first-item')
         if(mssage){
         mssage.textContent = "稍等";
             setTimeout(() => {
     Sbtn.click();
  }, 1000);

         }else{
         console.log("未收到新消息")
         }
    }
     const performScan =()=>{
        const parents = document.getElementsByClassName(CONFIG.PARENT_CLASS);
         listRes = [];
    // 遍历父元素收集目标
    Array.from(parents).forEach(parent => {
        const target = parent.querySelector(`.${CONFIG.TARGET_CLASS}`);
        if(target){
            listRes.push(target)
        }else{
        console.log("不是新消息")
        }
    });
         if(listRes.length != 0){
         for(let i = 0 ; i < listRes.length;I++){
         listRes[i].click();
             setTimeout(() => {
     autoRes()
  }, 1000);

         }
         }
    }
  const btn = document.createElement('button');

    // 基础样式设置
    btn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #2196F3;
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        z-index: 9999;
        font-size: 16px;
        transition: all 0.3s;
    `;

    // 悬停效果
    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'scale(1.1)';
        btn.style.background = '#1976D2';
    });

    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'scale(1)';
        btn.style.background = '#2196F3';
    });

    // 点击事件示例
    btn.addEventListener('click', () => {
        if(statue == 0){
        btn.innerHTML = 'runing'
            console.log("开始运行")
            statue =1
            performScan()
            intervalId = setInterval(performScan, 30000);
        }else{
        clearInterval(intervalId);
        intervalId = null;
        statue =0;
            btn.innerHTML = 'stop';
              console.log("停止运行")
        }
        //autoRes()
        // 在这里添加你的自定义功能
    });

    // 添加按钮到页面
    document.body.appendChild(btn);

    // 可选：添加按钮文字/图标
    btn.innerHTML = 'stop'; // 使用闪电符号作为示例
    // Your code here...
})();