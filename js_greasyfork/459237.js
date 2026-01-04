// ==UserScript==
// @name         ChatGPT+ Keep Running "Continue generating" GPT-4 new feature
// @namespace    https://github.com/new4u
// @version      3.1.317
// @description  Big Update! Both auto continue,and can customize click and regenerating by your demamd!
// @author       new4u本爷有空
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @match        https://chat.openai.com/chat
// @connect      chat.openai.com
// @match        https://chat.openai.com/*
// @grant        none
// @copyright    2015-2023, new4u
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/459237/ChatGPT%2B%20Keep%20Running%20%22Continue%20generating%22%20GPT-4%20new%20feature.user.js
// @updateURL https://update.greasyfork.org/scripts/459237/ChatGPT%2B%20Keep%20Running%20%22Continue%20generating%22%20GPT-4%20new%20feature.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var count=0;
  
    // 创建 auto regenerate按钮
    var autoRegenBtn = document.createElement("button");
    autoRegenBtn.innerHTML = "Auto Regenerate";
    autoRegenBtn.style.position = "fixed";
    autoRegenBtn.style.bottom = "20px"; // 将按钮放在输入框下方
    autoRegenBtn.style.right = "20px";
    document.body.appendChild(autoRegenBtn);
  
    var autoRegenerate = false;
  
    // 添加点击事件
    autoRegenBtn.addEventListener('click', function() {
      autoRegenerate = !autoRegenerate; // 切换 auto regenerate 状态
      autoRegenBtn.style.backgroundColor = autoRegenerate ? 'green' : 'red'; // 改变按钮颜色
      autoRegenBtn.innerHTML = autoRegenerate ? 'Auto Regenerate: ON' : 'Auto Regenerate: OFF'; // 改变按钮文字显示
    });
  
    setInterval(() => {
        const buttons = document.querySelectorAll('button');
        let found = false;
  
        buttons.forEach(button => {
            if (autoRegenerate && button.textContent === 'Regenerate response') {
                button.click();
                count++;
                console.log('Clicked button with text: Regenerate response次数',count);
                found = true;
            } else if (button.textContent === 'Continue generating') {
                button.click();
                var d = new Date();
                var n = d.getHours();
                var counttime = new Array();
                counttime[n] = count;
                counttime[n+1] = 0;
                console.log('Clicked button with text: Continue generating次数+时长',counttime[n],n);
                found = true;
            }
        });
  
        if (!found) {
            console.log('Button with text not found');
        }
  
    }, 15000);
})();
