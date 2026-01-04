// ==UserScript==
// @name         复制习题id并添加到试题蓝
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  用于给word文档添加习题。在习题详情页，添加一键复制习题id按钮。复制习题id到粘贴板，手动粘贴到word文档，并添加该习题到试题蓝，最后需手动组卷。
// @author       Jin
// @include /^http:\/\/www\....oo\.com\/.*$/
// @include /^https:\/\/www\....oo\.com\/.*$/
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424768/%E5%A4%8D%E5%88%B6%E4%B9%A0%E9%A2%98id%E5%B9%B6%E6%B7%BB%E5%8A%A0%E5%88%B0%E8%AF%95%E9%A2%98%E8%93%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/424768/%E5%A4%8D%E5%88%B6%E4%B9%A0%E9%A2%98id%E5%B9%B6%E6%B7%BB%E5%8A%A0%E5%88%B0%E8%AF%95%E9%A2%98%E8%93%9D.meta.js
// ==/UserScript==


// 习题详情页
(async function(){
    'use strict';
    if( !/\/ques\/detail/.test(location.pathname) ){ return; }
    // 移动工具栏到题目前
    let fieldtip = document.querySelector("div.fieldtip");
    fieldtip.parentElement.style["position"]="relative";
    fieldtip.previousElementSibling.style["position"]="relative";
    fieldtip.previousElementSibling.style["top"]="1em";
    fieldtip.style["position"]="absolute";
    fieldtip.style["top"]="-1em";
    // todo

    // 是否自动添加到试题蓝
    let autoAdd2Cart = GM_getValue("autoAdd2Cart",{exId:"", expirationDate:0});
    let exId = location.pathname.split("/").pop();
    if( autoAdd2Cart.exId === exId && autoAdd2Cart.expirationDate > Date.now() ){
        await new Promise( r => setTimeout(r, 1000) );
        document.querySelector("i.i-add")?.click();
        // 关闭页面
        await new Promise(r => {setTimeout(close, 5*1000);});
        return;
    }

    // 插入按钮【ID+】
    let count=0;
    document.querySelectorAll(".fieldtip-right")
        .forEach(parentElement=>{
            parentElement.insertBefore(createButton(), parentElement.firstElementChild);
            count++;
        });
    console.info("插入了 "+count+" 个【ID+】按钮");

    function createButton(){
        let newElement = document.createElement('div');
        newElement.innerHTML = '<a href="javascript:void(0)" style="font-family:math" title="油猴脚本，复制当前习题id，添加到试题蓝"><i class="icon i-orange-down"></i>ID+</a>';
        newElement = newElement.firstElementChild;
        // 功能脚本
        newElement.onclick = async function(event){
            let fieldset = event.currentTarget.parentElement.parentElement.previousElementSibling;
            GM_setClipboard("【id】"+fieldset.id);
            event.currentTarget.textContent = fieldset.id.left(3)+"···"+fieldset.id.substr(fieldset.id.length-3,3);
            document.querySelector("i.i-add")?.click();
        }
        return newElement;
    }

})();

// 非习题详情页和组卷蓝
(async function(){
    'use strict';
    if( /\/ques\/detail/.test(location.pathname) ){ return; }
    if( /\/paper\/make/.test(location.pathname) ){ return; }

    // 等待习题载入
    if(!document.querySelector(".fieldtip-right")){
            await new Promise(r => {setTimeout(r, 2000);});
    }
    if(!document.querySelector(".fieldtip-right")){
            await new Promise(r => {setTimeout(r, 4000);});
    }
    if(!document.querySelector(".fieldtip-right")){
            await new Promise(r => {setTimeout(r, 4000);});
    }

    // 插入 单题 复制按钮
    let count=0;
    document.querySelectorAll(".fieldtip-right")
        .forEach(parentElement=>{
            parentElement.insertBefore(createButton(), parentElement.firstElementChild);
            count++;
        });
    console.info("插入了 "+count+" 个【ID+】按钮");

    // 复制整题
    function createButton(){
        let newElement = document.createElement('div');
        newElement.innerHTML = '<a href="javascript:void(0)" style="font-family:math" title="油猴脚本，复制当前习题id，打开习题页面，添加到试题蓝"><i class="icon i-orange-down"></i>ID+</a>';
        newElement = newElement.firstElementChild;
        // 功能脚本
        newElement.onclick = async function(event){
            // 复制 id
            let fieldset = event.currentTarget.parentElement.parentElement.previousElementSibling;
            GM_setClipboard("【id】"+fieldset.id+"\n\n");
            event.currentTarget.textContent = fieldset.id.left(3)+"···"+fieldset.id.substr(fieldset.id.length-3,3);

            // 首先尝试直接点击 加入试题蓝 按钮
            if(event.currentTarget.parentElement.querySelector("a.add")){
                event.currentTarget.parentElement.querySelector("i.i-add")?.click();
                return;
            }

            // 否则 跳转到习题详情页，自动添加到试题蓝
            // 保存信息
            let autoAdd2Cart={exId : fieldset.id, expirationDate: Date.now()+5*1000};
            await GM_setValue("autoAdd2Cart", autoAdd2Cart);
            // 点击题干，跳转到习题详情页
            await new Promise(r => {setTimeout(r, 300);});
            fieldset.querySelector("div.pt1").click();
            // 跳转页面， 自动添加到试题蓝
        }
        return newElement;
    }

})();

