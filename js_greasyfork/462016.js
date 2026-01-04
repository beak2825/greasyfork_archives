// ==UserScript==
// @name         优化免注册激活国内版ChatGPT使用体验
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  国内ChatGPT（forchange）请稍后重试太烦了，写了一个的脚本自动点击，优化了性能
// @author       fxalll
// @match        *://www.chat.forchange.cn/*
// @match        *://chat.forchange.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forchange.cn
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/462016/%E4%BC%98%E5%8C%96%E5%85%8D%E6%B3%A8%E5%86%8C%E6%BF%80%E6%B4%BB%E5%9B%BD%E5%86%85%E7%89%88ChatGPT%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/462016/%E4%BC%98%E5%8C%96%E5%85%8D%E6%B3%A8%E5%86%8C%E6%BF%80%E6%B4%BB%E5%9B%BD%E5%86%85%E7%89%88ChatGPT%E4%BD%BF%E7%94%A8%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('.send-btn').onclick = function () {
    let mouseTimer = setInterval(()=>{
        if(document.querySelectorAll(".answer")[document.querySelectorAll(".answer").length-1].textContent === '请稍后重试\n') {
            document.querySelectorAll(".btn-neutral")[1].click()
            setTimeout(()=>{
            if (document.querySelectorAll(".answer")[document.querySelectorAll(".answer").length-1].textContent != '请稍后重试\n'){
                clearInterval(mouseTimer)
            }
        },5000)
        }
    },200)
    }

    document.addEventListener('keyup',function(e){
    if (e.keyCode == "13") {
        let keyTimer = setInterval(()=>{
        if(document.querySelectorAll(".answer")[document.querySelectorAll(".answer").length-1].textContent === '请稍后重试\n') {
            document.querySelectorAll(".btn-neutral")[1].click()
            setTimeout(()=>{
            if (document.querySelectorAll(".answer")[document.querySelectorAll(".answer").length-1].textContent != '请稍后重试\n'){
                clearInterval(keyTimer)
            }
        },5000)
        }
    },200)
    }
})




    // Your code here...
})();