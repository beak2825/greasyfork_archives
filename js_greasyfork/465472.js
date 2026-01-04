// ==UserScript==
// @name         抖音直播Extend
// @namespace    http://dyliveplug.ddwhm.com/
// @version      1.8
// @description  抖音直播功能拓展，目前主要功能：追流+横屏。
// @author       Jesen
// @match        *://live.douyin.com/*
// @match        *://www.douyin.com/follow/live/*
// @icon         https://p-pc-weboff.byteimg.com/tos-cn-i-9r5gewecjs/favicon.png
// @grant             GM_addStyle
// @grant             GM_addElement
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             unsafeWindow
// @run-at            document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465472/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%ADExtend.user.js
// @updateURL https://update.greasyfork.org/scripts/465472/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%ADExtend.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.switchLive = false;
    // 旋转具体函数
    function rotate(e){
        e.style.transformOrigin = "center";
        e.classList.add("rrr");
    }
    function unRotate(e){
        e.style.transformOrigin = "";
        e.classList.remove("rrr");
    }
    // 旋转按钮点击事件
    function onRotateBtnclick(){
        let a = document.getElementsByTagName("video")[0];
        if(window.switchLive){
            unRotate(a);
            window.switchLive = false;
        }else{
            rotate(a);
            window.switchLive = true;
        }
    }

    function onZhuiliuBtnclick(){
        let liveVideoNode = document.getElementsByTagName("video")[0];
        let buffered = liveVideoNode.buffered;
        if (buffered.length == 0) {
            liveVideoNode.load() || false;
            return;
        }
        liveVideoNode.currentTime = buffered.end(0);
    }

    window.onloadFunc = function() {
        if(location.host.indexOf("douyin") > -1){
          // 在页面中展示旋转按钮。
          const xgr = document.querySelectorAll("div.douyin-player-controls-left")[0];
          let ne = document.createElement("b");
          ne.innerHTML= "<b style='color:red;z-index: 90;pointer-events: auto;margin-left:5px;'>横屏</b>";
          let zl = document.createElement("b");
          zl.innerHTML= "<b style='color:red;z-index: 90;pointer-events: auto;margin-left:5px;'>追流</b>";
          xgr.appendChild(ne);
          xgr.appendChild(zl);
          ne.firstChild.onclick = onRotateBtnclick;
          zl.firstChild.onclick = onZhuiliuBtnclick;
          // 横屏样式
          var style = document.createElement('style');
          style.innerHTML = '.rrr { transform: rotate(270deg) !important; }';
          document.head.appendChild(style);
        }
    };

    let intID = setInterval(() => {
        if (typeof (document.querySelector('.xgplayer-play')) !== "undefined") {
            window.onloadFunc();
            console.log("成功检测到播放器，开始置放按钮")
            clearInterval(intID);
        }
    }, 1000);

})();