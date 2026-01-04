// ==UserScript==
// @name         学堂在线去微信助手
// @namespace    https://qinlili.bid
// @version      0.1
// @description  自动切换账号密码登录,去除绑定微信,从此无需注册微信也有最佳体验
// @author       琴梨梨
// @match        https://www.xuetangx.com/*
// @icon         https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetangxXImg/logo.ico
// @grant        none
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/421762/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%8E%BB%E5%BE%AE%E4%BF%A1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/421762/%E5%AD%A6%E5%A0%82%E5%9C%A8%E7%BA%BF%E5%8E%BB%E5%BE%AE%E4%BF%A1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function CheckAgain(){
        if(document.getElementsByClassName("main view")[0]){
            var targetNode = document.querySelector("#app > div > div.app-main_.appMain > div.loginWrap > div");
            var observer = new MutationObserver(function(){
                if(targetNode.style.display != 'none'){
                    if(document.getElementsByClassName("changeImg")[0]){
                        document.getElementsByClassName("changeImg")[0].click();
                        if(typeof DocumentObserver === "undefined"){AutoSkip();}
                    }
                }
            });
            observer.observe(targetNode, { attributes: true, childList: true });
        }else{
            setTimeout(CheckAgain,500)
        }
    }
    CheckAgain();
    function AutoSkip(){
        var mainArea = document.getElementsByClassName("loginBox")[0];
        var DocumentObserver = new MutationObserver(function() {
            if(document.querySelector("#app > div > div.app-main_.appMain > div.loginWrap > div > div > div.el-dialog__body > div > div.loginBox > div > div > div.loginWechatBinding > button:nth-child(6) > span")){
                if(document.getElementsByClassName("loginWechatBinding")[0].style.display != 'none'){
                    document.querySelector("#app > div > div.app-main_.appMain > div.loginWrap > div > div > div.el-dialog__body > div > div.loginBox > div > div > div.loginWechatBinding > button:nth-child(6) > span").click();
                }
            }
        });
        var DocumentObserverConfig = {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
        };
        DocumentObserver.observe(mainArea, DocumentObserverConfig);
    }

})();