// ==UserScript==
// @name         github回到顶部
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  github向下滚动时，出现回到顶部按钮，点击回到顶部
// @author       wxb
// @match        https://github.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421042/github%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/421042/github%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
     let body = document.getElementsByTagName("body")[0];
     let wrapper=document.createElement("div");
     wrapper.style.width="50px";
     wrapper.style.height="50px";
     wrapper.style.lineHeight="50px";
     wrapper.style.textAlign="center";
     wrapper.style.borderRadius="50%";
     wrapper.style.position = "fixed";
     wrapper.style.fontWeight = "bold";
     wrapper.style.cursor="pointer";
     wrapper.style.boxShadow = "0 0 2px 0px #716e6e"
     wrapper.style.right="20px";
     wrapper.style.bottom="80px";
     wrapper.innerText="Top";
     body.appendChild(wrapper);

     //  判断是否该显示按钮
     const scrollPosition = ()=>{
      let top = document.documentElement.scrollTop;
      if(top>0){
            wrapper.style.display = "block";
         }else{
            wrapper.style.display = "none";
      }
     }

     scrollPosition();

    // 鼠标移入
    wrapper.onmouseenter = ()=>{
      wrapper.style.backgroundColor="#f9f9f9";
    }

    // 鼠标移出
    wrapper.onmouseleave = ()=>{
      wrapper.style.backgroundColor="#fff";
    }

    let timer = null;
    // 监听滚动条滚动事件
    body.onscroll = () =>{
        if(timer) return;
        timer = setTimeout(()=>{
          scrollPosition();
          clearTimeout(timer);
          timer = null;
        },500)
    }

    // 点击
    wrapper.onclick = null;
    wrapper.onclick = ()=>{
       let scrollH = document.scrollingElement.scrollTop;
       let tiemr;
        clearInterval(tiemr);
         tiemr = setInterval(() => {
                if (scrollH >= 1) {
                    let speed = 0;
                    if(scrollH>=100){
                        speed = scrollH / 8;
                    }else{
                        speed= scrollH / 4;
                    }
                     scrollH -= speed;
                     document.scrollingElement.scrollTop = scrollH;
                } else {
                    clearInterval(tiemr)
                }
            }, 30)
    }
})();