// ==UserScript==
// @name         tmail quick hand
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://*.tmall.com/*
// @grant        none
// @require       https://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/397291/tmail%20quick%20hand.user.js
// @updateURL https://update.greasyfork.org/scripts/397291/tmail%20quick%20hand.meta.js
// ==/UserScript==
let state = location.host.indexOf("buy")>-1?1:0
const STATE = {
    CLICK: 0,
    PAY: 1,
}

function sleep(ms) {
    return new Promise(res => {
        setTimeout(res, ms)
    })
}

function waitToRightTime(timestr) {
    let reg = /(\d+):(\d+):(\d+)/
    var result = reg.exec(timestr)
    var hour = 1 * result[1];
    var min = 1 * result[2];
    var sec = 1 * result[3];
    var count = 1000 * (sec + 60 * min + 60 * 60 * hour)
    return new Promise((res, rej) => {
        let timer = setInterval(() => {
            var now = new Date()
            if((now.getMilliseconds()+1000*60*now.getMinutes()+1000*3600*now.getHours())>count){
                clearInterval(timer)
                res()
            }
        }, 100);
    })
}
function simulateClick(btn) { // 模拟 浏览器的鼠标点击事件
        const event = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        btn.dispatchEvent(event);
      }
function buy(){
    simulateClick($("#J_LinkBuy")[0])
}
function confirm(){
    simulateClick($(".go-btn")[0])
}
function addButton() {
    var dom =$(`<div style="margin:0 20px;padding-bottom:20px">
                     <div style="text-align: center;font-size: large;background-color: lightyellow;">
                         <a id="A_DoCountDown" href="javascript:void(0)">准备抢购</a>
                     </div>
                </div>`)
    dom.find("a").click( async()=>{
        let time = prompt("输入开始抢购时间 如10:00:00")
        await waitToRightTime(time)
        buy();
    })
    $(".tb-wrap").append(dom)
}

(async function () {
    'use strict';
    // Your code here...
    if (state == STATE.CLICK) {
        let time = prompt("输入开始抢购时间 如10:00:00")
        await waitToRightTime(time)
        buy();
    } else {
        await sleep(500)
        confirm()
    }
})();