// ==UserScript==
// @name         知乎B站登录弹窗去除
// @namespace    http://tampermonkey.net/
// @version      0.2.24
// @license      MIT
// @description  去除登陆弹窗
// @author       amaterasu
// @match        *://*.zhihu.com/*
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425509/%E7%9F%A5%E4%B9%8EB%E7%AB%99%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/425509/%E7%9F%A5%E4%B9%8EB%E7%AB%99%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
    var URL_VISITED = window.location.href;
    if (URL_VISITED.indexOf("/signin") >= 0) {
        window.location.href = "//zhihu.com/search";
    }
 
    function removeSignFlowModal() {
        var el = document.querySelector('.signFlowModal');
        if (el !== null) {
            while (el.parentElement !== document.body) {
                el = el.parentElement;
            }
            el.remove();
            setTimeout(function () {
                document.documentElement.style.overflow = "";
                document.documentElement.style.marginRight = "";
            }, 50);
        }
    }
 
    document.body.addEventListener("DOMNodeInserted", function () {
        removeSignFlowModal();
    });
    
    function removeUnsignPopover(){
        var el = document.querySelector('.unlogin-popover.unlogin-popover-avatar');
        if (el !== null) {
        
            el = el.parentElement;     
            el.remove();
        }
    }

    function removeLoginTip(){
        var el = document.querySelector('.login-tip');
        if (el !== null) {
        
            //el = el.parentElement;
            el.remove();
        }
    }
    function removeLoginPanelPopover(){
        var el = document.querySelector('.login-panel-popover');
        if (el !== null) {
        
            //el = el.parentElement;     
            el.remove();
        }
    }
    var isPressed = false;
    function removeBiliMaskPopover(){
        var el = document.querySelector('.bili-mini-mask');
        if (el !== null) {
            //el = el.parentElement;     
            el.remove();

            //var currentTime = document.querySelector('video').currentTime;
            //var duration = document.querySelector('video').duration;
 
            //if(document.querySelector('video').paused && currentTime < duration){
            document.querySelector('video').play(); 
            //}
        }
    }
    if(URL_VISITED.indexOf("bilibili")>=0){
        window.addEventListener('DOMContentLoaded',removeUnsignPopover,false);
        window.addEventListener('DOMNodeInserted',removeUnsignPopover,false);
        window.addEventListener('DOMContentLoaded',removeLoginPanelPopover,false);
        window.addEventListener('DOMNodeInserted',removeLoginPanelPopover,false);
        window.addEventListener('DOMContentLoaded',removeLoginTip,false);
        window.addEventListener('DOMNodeInserted',removeLoginTip,false);
        window.addEventListener('DOMContentLoaded',removeBiliMaskPopover,false);
        window.addEventListener('DOMNodeInserted',removeBiliMaskPopover,false);
        window.addEventListener('DOMMouseScroll',removeBiliMaskPopover,false);

        
        //window.addEventListener('keyup', function(event) {
        // 检查是否按下的是空格键（键码为32）
        //console.log(event.keyCode);
        //if (event.key === 32) {
           // 播放状态
        //   if (!document.querySelector('video').paused) {
        //      isPressed = true;
        //   }else{
        //      isPressed = false;
        //   }
        // }
        //}, false);
        window.setInterval(function(){
            removeBiliMaskPopover();
        },500);
    }
})();