// ==UserScript==
// @name         yopoint自动抢单工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  字面意思
// @author       ny
// @match        https://grs.yopoint.com/user.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521453/yopoint%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/521453/yopoint%E8%87%AA%E5%8A%A8%E6%8A%A2%E5%8D%95%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 100px;
        //left: 0px;
        right:0px;
        width: 50px;
        height: 50px;
        background-color: blue;
        border-radius: 50%;
        cursor: move;
        z-index: 9999;
        color:white;
        display:flex;
        text-align:center;
        justify-content:center;
        align-items: center;
    `;
let autoApplyInter = null;
  function autoApply(ok){
    if(ok){


      autoApplyInter = setInterval(()=>{
        const btn = document.querySelectorAll(".right-btn-bottom > div > button:nth-child(2)")[0]
        if(!btn){
  console.log("AUTO_REPLY: 未找到BTN")
  return
}
        //checkOk
        if(btn.diabled){
        }else{
          btn.click()
        }
      },1000)
    }else{

      if(autoApplyInter){
        clearInterval(autoApplyInter);
      }
    }

  }
  function btnSwitch(ok){
      if(ok){
        div.innerHTML = "<div>开启</div>"
        div.style.backgroundColor = "green"
      }else{
        div.innerHTML = "<div>关闭</div>"
        div.style.backgroundColor = "gray"
      }

  }
btnSwitch(false)
    let isDragging = false;
    let offsetX, offsetY;

    div.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - div.offsetLeft;
        offsetY = e.clientY - div.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            div.style.left = (e.clientX - offsetX) + 'px';
            div.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
let enable = false;
    div.addEventListener('click', () => {
      enable = !enable;
      autoApply(enable)
      btnSwitch(enable);

    });

    document.body.appendChild(div);
})();

