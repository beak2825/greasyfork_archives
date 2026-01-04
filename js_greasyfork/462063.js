// ==UserScript==
// @name         灵梦御所隐藏默认打开
// @namespace    https://github.com/Zhuxb-Clouds/TamperScript
// @version      0.0.2
// @description  优化事件钩子
// @author       Zhuxb
// @match        *://blog.reimu.net/archives/*
// @icon         https://blog.reimu.net/wp-content/uploads/2016/02/cropped-logo-192x192.png
// @run-at       document-end
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462063/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E9%9A%90%E8%97%8F%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/462063/%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E9%9A%90%E8%97%8F%E9%BB%98%E8%AE%A4%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded',function(){
    const pres = document.getElementsByTagName("pre");
    for (let i = 0; i< pres.length; i++) {
        setTimeout(()=>{
            console.log("pres",pres,i)
            pres[i].style.display = 'block';
        },0)
    }
});
