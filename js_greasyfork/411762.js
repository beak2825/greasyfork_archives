// ==UserScript==
// @name         Bilibili Danmaku Sync
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在不同直播间同步弹幕操作
// @author       You
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411762/Bilibili%20Danmaku%20Sync.user.js
// @updateURL https://update.greasyfork.org/scripts/411762/Bilibili%20Danmaku%20Sync.meta.js
// ==/UserScript==

(function() {
    setTimeout(()=>{


        const input=document.querySelector('.chat-input');
        const send=document.querySelector('.bottom-actions .right-action button');


        if(!input||!send)return;

        console.log("BDS Loaded");

        let lastInput="";

        input&& input.addEventListener("keyup",e=>{
            if(e.key!=="Enter")
                onInput();
            else onSend();
        });
        send&& send.addEventListener("click",e=>{
            onSend();
        });

        const onInput=()=>{
            //console.log(input.value);
            lastInput=input.value;
            localStorage.lastSendText=lastInput;
        }

        let lastSendTime=localStorage.lastSendTime||Date.now();
        const onSend=()=>{
            if(lastInput==="")return;
            console.log("SEND::",lastInput);
            localStorage.lastSendText=lastInput;
            localStorage.lastSendTime=Date.now();
            lastSendTime=localStorage.lastSendTime;
            lastInput="";
        }
        setInterval(()=>{
            if(localStorage.lastSendTime&&(localStorage.lastSendTime>lastSendTime)){
                input.value=localStorage.lastSendText;
                input.dispatchEvent(new InputEvent("input"));
                setTimeout(()=>send.click(),100);
                console.log("AUTO SEND::",localStorage.lastSendText);
                lastSendTime=localStorage.lastSendTime;
            }
        },500);
    },5000);
})();