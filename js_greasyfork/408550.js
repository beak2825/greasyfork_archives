// ==UserScript==
// @name         哔哩哔哩-平滑展开视频信息
// @namespace    ckylin-bilibili-animated-showfullinfo
// @version      0.2
// @description  平滑展开视频信息
// @author       CKylinMC
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/408550/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E5%B9%B3%E6%BB%91%E5%B1%95%E5%BC%80%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/408550/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9-%E5%B9%B3%E6%BB%91%E5%B1%95%E5%BC%80%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

function CK_elementOk(){
    return document.querySelector("#v_desc>div.info")||document.querySelector(".desc-info.desc-v2");
}
function CK_getRealHeight(){
    try{
    return document.querySelector("#v_desc>div.info").scrollHeight;
    }catch(e){
    return document.querySelector(".desc-info.desc-v2").scrollHeight;
    }
}
window.CK_animatedFullInfo = false;
function CK_doAnimateFullInfoInject(){
    if(window.CK_animatedFullInfo) return true;
    if(!CK_elementOk()) return false;
    let targetDom = document.querySelector("#CK_animatedFullInfoCSS");
    if(targetDom) targetDom.remove();
    targetDom = document.createElement("style");
    targetDom.id = "CK_animatedFullInfoCSS";
    targetDom.innerHTML = "#v_desc>div.info.open,.desc-info.desc-v2.open{height: "+CK_getRealHeight()+"px!important;}";
    document.body.appendChild(targetDom);
    window.CK_animatedFullInfo = true;
    return true;
}
function CK_recheckAFI(){
    if(!CK_doAnimateFullInfoInject()) setTimeout(()=>{CK_recheckAFI()},1000);
}
setInterval(()=>{CK_recheckAFI()},5000);
