// ==UserScript==
// @name         小红书删评论
// @license MIT
// @version      0.1.0
// @namespace     https://www.xiaohongshu.com
// @description  Holle
// @author       You
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494568/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%88%A0%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494568/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%88%A0%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    "use strict";
  console.log("小红书脚本生效了");
    var i=0;
     createDeletePlButton()

  // 创建删除评论按钮
  function createDeletePlButton() {
    const mask = document.querySelector("#app");
    const button = document.createElement("button");
    button.textContent = "全部评论删除";
    button.style.position = "fixed";
    button.style.bottom = "65px";
    button.style.right = "20px";
    button.style.padding = "10px 20px";
    button.style.border = "none";
    button.style.backgroundColor = "#056b00";
    button.style.color = "#fff";
    button.style.fontFamily = "Arial, sans-serif";
    button.style.fontSize = "16px";
    button.style.fontWeight = "bold";
    button.style.cursor = "pointer";
      button.style.zIndex = 10000;
    button.addEventListener("click", function () {
      exportMd();
    });
    mask.appendChild(button);
  }
function exportMd() {
    console.log(123)
    const m=document.querySelector('.menu-wrapper>.menu-item')
    console.log(m)
    if (!m&&i<=10) {
        i++;
        exportMd()
        // 元素不存在
    }else if(m){
    console.log(i)
        m.click();
       setTimeout(() => {queren(m); }, 2000);
    }

  }
    function queren(obj){
        obj.blur();
          const ml=document.querySelector('.strong')
          console.log(ml)
        if (!ml&&i<=10) {
            setTimeout(() => {queren(obj); }, 2000);

            // 元素不存在
        }else if(ml){

            console.log(i)
            i=0
            ml.click()
           setTimeout(() => {exportMd(); }, 1000);
        }

    }


    // Your code here...
})();