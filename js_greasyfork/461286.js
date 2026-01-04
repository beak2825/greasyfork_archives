// ==UserScript==
// @name         贴吧禁止折叠长图
// @namespace    You Boy
// @version      0.4
// @description  贴吧会自动折叠长图不喜欢，是个坏功能，不要
// @author       You Boy
// @match        *://tieba.baidu.com/p/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461286/%E8%B4%B4%E5%90%A7%E7%A6%81%E6%AD%A2%E6%8A%98%E5%8F%A0%E9%95%BF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/461286/%E8%B4%B4%E5%90%A7%E7%A6%81%E6%AD%A2%E6%8A%98%E5%8F%A0%E9%95%BF%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 遍历删除replace_div
    function removeReplaceDiv(){
        const replaceDivArray = document.querySelectorAll("div.replace_div");
        try{
            for(const item of replaceDivArray){
                item.classList.remove('replace_div');
                item.querySelector('div.replace_tip').remove();
            }
        }catch(err){
            console.group('贴吧禁止折叠长图 Error Info:删除replace_div');
            console.error(err);
            console.groupEnd();
        }
    }

    // 删除图片高度，使之高度自适应
    function removeBDEHeight(){
        const bdImageArray = document.querySelectorAll("img.BDE_Image");
        try{
            for(const item of bdImageArray){
                item.removeAttribute('height');
            }
        }catch(err){
            console.group('贴吧禁止折叠长图 Error Info:删除BDE_Image高度');
            console.error(err);
            console.groupEnd();
        }
    }

    // 处理事件
    const handleEvents = function(){
        removeReplaceDiv();
        removeBDEHeight();
    }

    // 增加绑定事件,使之可以监听pushState和replaceState
    const bindStateListener = function(stateName) {
        const historyState = history[stateName];
        return function() {
            const newState = historyState.apply(this, arguments);
            const e = new Event(stateName);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return newState;
        };
    };
    history.pushState = bindStateListener('pushState');
    history.replaceState = bindStateListener('replaceState');

    // 延迟函数
    const delay = function(fun,time){
        const delayTime = time || 1000;
        setTimeout(fun,delayTime);
        // 原来基础上多加个2秒，再次执行一次，网速慢导致有部分漏网之鱼
        setTimeout(fun,delayTime + 2e3);
        // 还。。还想来？
        setTimeout(fun,delayTime + 4e3);
    }

    window.addEventListener('load', function() {
        handleEvents();
    });
    window.addEventListener('popstate', function() {
        delay(handleEvents);
    });
    window.addEventListener('replaceState', function() {
        delay(handleEvents);
    });
    window.addEventListener('pushState', function() {
        delay(handleEvents);
    });
})();