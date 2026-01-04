// ==UserScript==
// @name        自动刷新失效的ChatGPT页面,并自动复制输入框文本防丢失
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  可恶的openai为什么要让我刷新页面
// @author       CJM
// @match        https://chat.openai.com/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462975/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%A4%B1%E6%95%88%E7%9A%84ChatGPT%E9%A1%B5%E9%9D%A2%2C%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E8%BE%93%E5%85%A5%E6%A1%86%E6%96%87%E6%9C%AC%E9%98%B2%E4%B8%A2%E5%A4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/462975/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%A4%B1%E6%95%88%E7%9A%84ChatGPT%E9%A1%B5%E9%9D%A2%2C%E5%B9%B6%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E8%BE%93%E5%85%A5%E6%A1%86%E6%96%87%E6%9C%AC%E9%98%B2%E4%B8%A2%E5%A4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

let txt = '';

    const func = ()=>fetch("https://chat.openai.com/api/auth/session", {
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    }).then(res=>{
        if(res.status===403){
location.reload()
        }
    });
    // Your code here...
    //setInterval(()=>{
    //},40*1000+10*Math.random())

let flag = true;


      window.addEventListener('keydown',(a1,a2,a3)=>{
let myTextArea = document.querySelector("textarea[tabindex='0']")
      if(flag && myTextArea){
flag = false;
myTextArea && myTextArea.addEventListener("input", function() {
    txt = myTextArea.value;
});
}

        if(a1.code==='Enter'){
            txt && navigator.clipboard.writeText(txt).then(()=>{
                console.log('Copied to clipboard!');
            })
            func();
        }
    })
})();