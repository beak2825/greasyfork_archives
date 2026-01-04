// ==UserScript==
// @name         acfun直播间自动刷弹幕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  慎用！！！弹幕抽奖用，1秒10条刷起来，固定时长，避免电茶缸事件重演。
// @author       oracle_cai
// @match        https://live.acfun.cn/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425487/acfun%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%B7%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/425487/acfun%E7%9B%B4%E6%92%AD%E9%97%B4%E8%87%AA%E5%8A%A8%E5%88%B7%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

window.onload =function() {
    let ash='<div class="wrap-bottom-area"><div class="medal-container">时长<select id="ssc"><option value="5">5秒</option><option value="10">10秒</option><option value="20">20秒</option><option value="30">30秒</option></select></div><div id="asbtn" class="send-btn enable">自动发送</div></div>';
    let ib=document.querySelector(".live-feed-input");
    ib.insertAdjacentHTML('beforeEnd',ash);
    document.querySelector('#asbtn').onclick=function(){
        autosend();
    }
}

function autosend(){
    let btn=document.querySelector("#asbtn");
    if(btn.getAttribute('class').indexOf('enable')<0){
        return;
    }
    let dmbox=document.querySelector(".danmaku-input-wrap textarea");

    let txt=dmbox.value;
    if(txt.trim().length<1){
        alert("请先输入弹幕！");
        return;
    }
    btn.setAttribute('class','send-btn')
    let sc=document.querySelector('#ssc').value;
    let sendbtn=document.querySelector(".wrap-bottom-area .send-btn");
    let si=setInterval(function(){
        //console.log(1);
        sendbtn.click();
        dmbox.value=txt;
        let event = new Event('input', { bubbles: true });
        let tracker = dmbox._valueTracker;
        if (tracker) {
            tracker.setValue('');//
        }
        dmbox.dispatchEvent(event);

    },100);
    setTimeout(function(){
        //console.log(2);
        window.clearInterval(si);
        btn.setAttribute('class','send-btn enable')
    },parseInt(sc)*1000);
}

