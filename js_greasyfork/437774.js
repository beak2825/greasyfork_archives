// ==UserScript==
// @name         bilibili弹幕小能手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  弹幕小助手
// @author       Rubysiu
// @match        https://live.bilibili.com/*
// @connect      api.live.bilibili.com
// @icon         https://s3.bmp.ovh/imgs/2021/12/ab22ca08387d82f2.jpg
// @grant        GM_xmlhttpRequest
// @license      Rubysiu
// @downloadURL https://update.greasyfork.org/scripts/437774/bilibili%E5%BC%B9%E5%B9%95%E5%B0%8F%E8%83%BD%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437774/bilibili%E5%BC%B9%E5%B9%95%E5%B0%8F%E8%83%BD%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const w = window;
    let cookies = document.cookie.split("; ");
    let bili_jct = null;
    cookies.forEach(e => {
        let cookie = e.split("=");
        if (cookie[0] == "bili_jct") {
            bili_jct = cookie[1]
        }
    })
    let sendUrl = "https://api.live.bilibili.com/msg/send"
    let doSignUrl = "https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign"
    let pdom = document.createElement("ruby");
    pdom.innerHTML = '<svg t="1640825873948" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1655" width="100%" height="100%"><path d="M124.345108 364.154092h57.040738v403.270893H124.345108zM133.4272 317.652677l-18.164185-54.075077 445.447877-213.389785 18.160246 54.079016zM693.594585 53.204677l239.143384 152.544492-30.680615 48.088616L662.921846 101.297231z" fill="#B0A7F7" p-id="1656"></path><path d="M683.701169 992.626215h-136.318031c-26.253785 0-47.537231-21.283446-47.53723-47.533292V407.670154h95.070523v489.885538h41.251446V407.670154h95.070523v537.422769c-0.003938 26.249846-21.287385 47.533292-47.537231 47.533292zM956.7744 443.392h-135.297969c-26.249846 0-47.533292-21.283446-47.533293-47.533292V229.761969c0-26.253785 21.283446-47.533292 47.533293-47.533292h135.297969c26.249846 0 47.533292 21.279508 47.533292 47.533292v166.0928c0 26.253785-21.283446 47.537231-47.533292 47.537231z m-87.760738-95.070523h40.223507V277.2992h-40.223507v71.022277zM725.795446 216.792615h-95.074461V124.762585h-30.345847v92.033969H505.304615V77.225354c0-26.253785 21.283446-47.533292 47.533293-47.533292h125.416369c26.253785 0 47.537231 21.279508 47.537231 47.533292v139.567261z" fill="#594BC8" p-id="1657"></path><path d="M410.655508 897.559631h395.835077v95.070523H410.655508zM251.163569 814.962215H57.954462c-26.253785 0-47.533292-21.279508-47.533293-47.533292 0-26.249846 21.283446-47.533292 47.533293-47.533292h193.209107c26.253785 0 47.537231 21.283446 47.537231 47.533292 0 26.253785-21.283446 47.533292-47.537231 47.533292zM646.541785 554.043077l69.624123 69.620185-143.753846 143.753846-69.624124-69.624123zM32.023631 263.5776H825.107692v98.461538H32.023631z" fill="#594BC8" p-id="1658"></path></svg>';
    pdom.style.cssText = `
    background: rgb(255, 255, 255);
    position: fixed;
    padding: 10px;
    color: rgb(255, 255, 255);
    top: 10%;
    z-index: 9999;
    border-radius: 50%;
    right: 24px;
    width: 30px;
    height: 30px;
    box-shadow: rgb(0 0 0 / 40%) 0px 0px 4px 0px;`;
    document.body.appendChild(pdom);
    let dom = document.createElement("rubyBox");
    dom.style.cssText = `
    background: rgb(255, 255, 255);
    position: absolute;
    padding: 18px;
    right: 50px;
    z-index: 9999;
    border-radius: 5px 0 5px 5px;
    display: none;
    flex-direction: column;
    box-shadow: rgb(0 0 0 / 40%) -1px 0px 4px 0px;
    color: rgb(0, 0, 0);
    top: 0px;
    `;
    pdom.appendChild(dom);
    dom.innerHTML = `
    <label style="padding:5px" for="msg">弹幕<input type='text' name='msg' id='msg'></label>
    <label style="padding:5px" for="speed">速度<input type='number' name='speed' id='speed' value='6000'></label>
    <label style="padding:5px" for="num">次数<input type='number' name='num' id='num' value='1'></label>
    <label style="padding:5px" for="submit"><input type='submit' name='submit' id='submit' value='执行'></label>
    `;
    let msgDom = document.querySelector("input[name='msg']");
    let speedDom = document.querySelector("input[name='speed']");
    let numDom = document.querySelector("input[name='num']");
    let btnDom = document.querySelector("input[name='submit']");
    msgDom.addEventListener("blur", msgCheck)

    function msgCheck() {
        let msg = msgDom.value;
        if (msg == null || msg == '') {
            msgDom.style.border = "1px solid #f00"
            return;
        } else {
            msgDom.style.border = "1px solid #000"
        }

    }
    btnDom.addEventListener("click", function () {
        msgCheck();
        let msg = msgDom.value
        let speed = speedDom.value
        let num = numDom.value
        delay(msg, speed, num)
    })
    dom.addEventListener("click", function () {
        event.stopPropagation();
    })
    pdom.addEventListener("click", function () {
        if (dom.style.display != "none") {
            dom.style.display = "none"
            pdom.style.borderRadius = "50%"
        } else {
            dom.style.display = "flex"
            pdom.style.borderRadius = "0 50% 50% 0"
        }
    })

    function delay(msg, speed, num) {
        if (msg == null || msg == '') {
            msgDom.style.border = "1px solid #f00"
            return;
        }
        msgDom.style.border = "1px solid #000"
        speed = speed == null || speed == '' ? 6000 : speed;
        num = num == null || num == '' ? 1 : num - 1;
        send(msg);
        let timer = setInterval(() => {
            if (num > 0) {
                send(msg)
                num--
            } else {
                clearInterval(timer)
            }
        }, speed);
    }

    function send(msg) {
        console.log(new Date, msg)
        let roomId = w.unsafeWindow.BilibiliLive.ROOMID;
        let data = {
            "bubble": " 0",
            "msg": msg,
            "color": "16777215",
            "mode": "1",
            "fontsize": "25",
            "rnd": "1639620636",
            "roomid": roomId,
            "csrf": bili_jct,
            "csrf_token": bili_jct
        }
        let dataS = "bubble=0&msg=" + msg + "&color=16777215&mode=1&fontsize=25&rnd=1639620636&roomid=" + roomId + "&csrf=" + bili_jct + "&csrf_token=" + bili_jct;
        GM_xmlhttpRequest({
            url: sendUrl,
            method: "POST",
            data: dataS,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                // console.log(xhr.responseText);
            }
        });
    }
    var sign = false;

    function doSign() {
        GM_xmlhttpRequest({
            url: doSignUrl,
            method: "GET",
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload: function (xhr) {
                let obj = eval("("+xhr.responseText+")");
                let conMsg = document.querySelector("#chat-items > div.chat-item.convention-msg");
                console.log(conMsg)
                console.log(obj.message);
                sign = true
            }
        });
    }
   if(!sign){
      doSign();
   }
})();