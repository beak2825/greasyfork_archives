// ==UserScript==
// @name         网页水印隐藏
// @namespace    https://www.bilibili.com/
// @version      2.2
// @description  去除通过在元素中使用background-image属性，通过插入背景图片生成的水印
// @author       Pick
// @match        *://*.aliyun.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460700/%E7%BD%91%E9%A1%B5%E6%B0%B4%E5%8D%B0%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460700/%E7%BD%91%E9%A1%B5%E6%B0%B4%E5%8D%B0%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

let DEBUG = false;
let MAX_RETRY_TIMES = 4;
let DEBUG_PREFIX = "水印去除";
let tryTimes = 0;
window.addEventListener("load", ()=>{
    process(document.body);
    let intervalId = setInterval(()=>{
        process(document.body);
        tryTimes += 1;
        log("去除次数", tryTimes);
        if(tryTimes === MAX_RETRY_TIMES){
            clearInterval(intervalId);
        }
    }, 1500);
    document.addEventListener("keydown", keydownEvent);
});

function keydownEvent(event){
    if (event.shiftKey || event.ctrlKey || event.altKey || event.target.tagName === "INPUT" || event.target.tagName === 'TEXTAREA') {
        return;
    }
    if(event.key === 'z'){
        log("手动去除水印");
        process(document.body);
    }
}

function eleProcess(ele) {
    if(ele == null){
        return;
    }
    let style = ele.getAttribute("style");
    if (style != null && style.indexOf("background-image") !== -1 && ele.style["background-size"] !== "0px, 0px") {
        if(ele.hackTimes == null){
            ele.hackTimes = 1;
        }else{
            ele.hackTimes = ele.hackTimes + 1;
        }
        if(ele.hackTimes >= MAX_RETRY_TIMES){
            log("无法hack的元素", ele);
            return;
        }
        ele.style["background-size"] = "0px, 0px";
    }
}
function process(ele) {
    let querySelectorAll = ele.querySelectorAll("[style]");
    for (let i = 0; i < querySelectorAll.length; i++) {
        eleProcess(querySelectorAll[i]);
    }
    if (ele.getAttribute("style") !== -1) {
        eleProcess(ele);
    }
}

function log(...args) {
    if (DEBUG) {
        console.log(DEBUG_PREFIX, ...args);
    }
}