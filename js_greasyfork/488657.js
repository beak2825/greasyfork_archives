// ==UserScript==
// @name         Theresmore 自动点击建筑
// @namespace    http://tampermonkey.net/
// @version      2024-03-07
// @description  Theresmore 自动点击建筑 支持手动开启关闭自动点击
// @author       You
// @match        https://www.theresmoregame.com/play/
// @match        https://theresmoregame.g8hh.com/
// @match        https://theresmoregame.g8hh.com.cn/
// @icon         https://www.theresmoregame.com/play/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488657/Theresmore%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%BB%BA%E7%AD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/488657/Theresmore%20%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%BB%BA%E7%AD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const document = window.document
    const body = document.getElementsByTagName('body')[0]
    const btn = document.createElement('div')
    btn.style = `width: 110px;
      height: 30px;
      line-height: 30px;
      position: fixed;
      left: 300px;
      top: 5px;
      font-size: 12px;
      border: 1px solid #b3d8ff;
      text-align: center;
      border-radius: 4px;
      background: #ecf5ff;
      color: #409eff;
      cursor: pointer;
      z-index: 9999;`
    btn.innerText = `开启自动点击`
    function guaji(){
        var btns=document.getElementsByClassName("btn btn-dark relative");
        for(var i=0;i<btns.length;i++){
            // 获取每个按钮的文本内容
            var btnText = btns[i].textContent.trim() || btns[i].innerText.trim();
            if(btns[i].className.indexOf("btn-off")<0
               &&btns[i].className.indexOf("rounded-l-full")<0&&btns[i].className.indexOf("rounded-l-none")<0
               &&btnText.indexOf("窃魂者堡垒")<0
              ){
                btns[i].click();
            }
        }
    }
    function switchBase() {
        // 获取页面上所有具有特定属性的tablist div
        var tablists = document.querySelectorAll('div[role="tablist"][aria-orientation="horizontal"]');
        for (var i = 0; i < tablists.length; i++) {
            // 在每个tablist中寻找匹配文本的按钮
            var buttons = tablists[i].getElementsByTagName("button");
            for (var j = 0; j < buttons.length; j++) {
                if ((buttons[j].textContent === "城市" || buttons[j].textContent === "定居点") && buttons[j].getAttribute('tabindex') === "-1") {
                    buttons[j].click();
                }
            }
        }
    }
    let autoClick = null
    let togglePlace = null
    btn.onclick = function() {
        if (autoClick === null) {
            autoClick = setInterval(guaji,1000)
            togglePlace = setInterval(switchBase,60000)
            btn.innerText = `关闭自动点击`
        } else {
            clearInterval(togglePlace)
            togglePlace = null
            clearInterval(autoClick)
            autoClick = null
            btn.innerText = `开启自动点击`
        }

    }
    body.appendChild(btn)
    // Your code here...
})();