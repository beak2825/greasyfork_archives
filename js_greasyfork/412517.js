// ==UserScript==
// @name         虎牙屏蔽弹幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用来屏蔽指定用户的弹幕
// @author       You
// @match        https://www.huya.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412517/%E8%99%8E%E7%89%99%E5%B1%8F%E8%94%BD%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/412517/%E8%99%8E%E7%89%99%E5%B1%8F%E8%94%BD%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let timer = null;
    let t = 0;
    let black_list = GM_getValue("black_list");
    black_list = black_list != "undefined" ? new Set(black_list) : new Set();
    console.log("黑名单用户：",black_list);
    document.addEventListener("click",(ev)=>{
        var target = ev.target || ev.srcElement;
        clearInterval(timer);
        if(target.className == 'name J_userMenu'){
            let span1 = document.createElement("span");
            let span2 = document.createElement("span");
            span2.innerText = "清空";
            span1.style = "position: absolute;right: 40px;bottom: 12px;";
            span2.style = "position: absolute;right: 10px;bottom: 12px;cursor: pointer;";
            timer = setInterval(()=>{
                if(t++>20){
                    t=0;
                    clearInterval(timer);
                }
                let chat_popup_layer = document.querySelector(".room-sidebar>:last-child");
                let user_viewer = chat_popup_layer.querySelector(":last-child");
                let uc_box = user_viewer.querySelector(":last-child");
                let ucard_normal = uc_box.querySelector(":last-child");
                let ucard_x = ucard_normal.querySelector(":first-child");
                if(ucard_normal.className.startsWith("ucard-normal")){
                    clearInterval(timer);
                    let ucard_nick = ucard_normal.querySelector(":nth-child(3)>:first-child");
                    let nick = ucard_nick.innerText;
                    if(black_list.has(nick)){
                        span1.innerText = "已屏蔽";
                        span1.style.cursor = "not-allowed";
                    }else{
                        span1.innerText = "屏蔽";
                        span1.style.cursor = "pointer";
                        span1.addEventListener("click",(_ev)=>{
                            console.log("已添加屏蔽用户：",nick)
                            black_list.add(nick);
                            GM_setValue("black_list",[...black_list]);
                            ucard_x.click();
                        })
                    }
                    span2.addEventListener("click",(_ev)=>{
                        console.log("已清空黑名单")
                        GM_setValue("black_list","undefined");
                        ucard_x.click();
                    })
                    ucard_normal.appendChild(span1);
                    ucard_normal.appendChild(span2);
                }
            },10)
        }
    })


    // 监听dom结构
    let targetNode = document.getElementById('chat-room__list');
    targetNode.addEventListener("DOMNodeInserted",(ev)=>{
        let item = ev.target;
        let name = item.querySelector(".name.J_userMenu").innerText;
        if(black_list.has(name)){
            console.log("已过滤",name,"的弹幕，内容是：",item.querySelector(".msg").innerText);
            item.remove();
        }
    })
})();