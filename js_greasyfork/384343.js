// ==UserScript==
// @name         b站弹幕助手
// @namespace    https://github.com/wanglz111
// @version      0.1
// @description  bilibili直播弹幕获取。通过读取右侧聊天框实现。
// @author       wlz
// @match        https://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384343/b%E7%AB%99%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/384343/b%E7%AB%99%E5%BC%B9%E5%B9%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var m = new Map();
    let style = document.createElement('style');
    document.head.appendChild(style);
    let width = document.body.clientWidth;
    let from = `from { visibility: visible; -webkit-transform: translateX(${width}px); }`;
    let to = `to { visibility: visible; -webkit-transform: translateX(-100%); }`;
    style.sheet.insertRule(`@-webkit-keyframes barrage { ${from} ${to} }`, 0);
    var int = self.setInterval(function() {
        var canvas = document.getElementsByClassName("chat-item danmaku-item ");
        let player = document.getElementsByClassName("bilibili-live-player-video-danmaku")[0];
        var myDms = document.getElementsByClassName('youhoudanmu');
        for(var i = 0; i < canvas.length; i++) {
            var id = canvas[i].dataset["uid"];
            if(!m.has(id)) {
                if (m.length >= 100) {
                    m.clear();
                }
                m.set(canvas[i].dataset["uid"],canvas[i].dataset["danmaku"]);
                let div = document.createElement('div');
                let height = Number(Math.random() * 80).toFixed(1) + "%";
                div.style= "position:absolute;left:0;top:" + height +";visibility:hidden;animation:barrage 10s linear 0s;color: white;font-size:22px;font-weight: blod;";
                div.className = 'youhoudanmu';
                div.innerText = canvas[i].dataset["danmaku"];
                if (player != null) {
                    if(myDms.length > 100) {
                        for(var j = 0; j < myDms.length; j++) {
                            player.removeChild(myDms[j]);
                        }
                    }
                    player.appendChild(div);
                }
            }
        }
    }, 10);
    // Your code here...
})();
