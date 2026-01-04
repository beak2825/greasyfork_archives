// ==UserScript==
// @name         2020年重邮学评教一键好评
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动学评教（全部10分）For CQUPT, 使用方法：PC端进入学评教页面，http://jwzx.cqupt.edu.cn/jxpj/xpjstu.php，点击右上角一键好评即可。评价完会自动刷新。期间建议不要操作。
// @author       IsLand
// @match        http://jwzx.cqupt.edu.cn/jxpj/xpjstu.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418537/2020%E5%B9%B4%E9%87%8D%E9%82%AE%E5%AD%A6%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/418537/2020%E5%B9%B4%E9%87%8D%E9%82%AE%E5%AD%A6%E8%AF%84%E6%95%99%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84.meta.js
// ==/UserScript==
let menu=null;
(function() {
window.alert=function(e){console.log(e)}
    'use strict';
    // 生成辅助窗口
    menu = document.createElement('div');
    menu.style.cssText="width:300px;padding:20px;border:2px solid #ccc;border-radius:5px;box-shadow:0 0 10px rgba(0,0,0,0.1);position:fixed;top:20px;right:20px;background:#fff;display:flex;justify-content:center;align-items:center;flex-direction:column"
    let body = document.querySelector('body');
    body.appendChild(menu);
    let btn = document.createElement('button');
    btn.innerHTML="点击一键学评教(10分好评)"
    btn.style.cssText="height:30px;width;50px;border:none;box-shadow:rgba(0,0,0,0.1);outline:none;cursor:pointer;";
    menu.appendChild(btn);
    menu.addEventListener('click',startHandler)
})();
async function startHandler(){
    let btns = Array.of(...document.querySelectorAll(".pTable tbody td a.xpjBtn"))
    menu.innerHTML="已评价完名单（请不要操作，评价完成后会自动刷新页面）";
    for(let i=0;i<btns.length;i++){
        btns[i].click();
        await new Promise((resolve,reject)=>setTimeout(()=>{
            let popWindow=document.querySelector("#popWindow");
            let chooses = popWindow.querySelectorAll("table tbody tr td:nth-child(2) span:nth-of-type(1) input")
            let chooseSpans = popWindow.querySelectorAll("table tbody tr td:nth-child(2) span:nth-of-type(1)")
            Array.of(...chooses).forEach(el=>el.setAttribute('checked',''))
            Array.of(...chooseSpans).forEach(el=>el.classList.add('choosed'))
            popWindow.querySelector("button").click();
            let div = document.createElement('div')
            div.innerHTML=/.+【(.+)】教师/.exec(popWindow.querySelector('h3').innerHTML)[1]
            menu.appendChild(div);
            resolve()
        },1000))
    }
    window.location.reload();
}

