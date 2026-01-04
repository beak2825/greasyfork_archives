// ==UserScript==
// @name         Q绑查询自动点击确认
// @namespace    流☆星星☆辰
// @version      0.1
// @description  Q绑查询页面回车进行查询，自动点击确认
// @author       流☆星星☆辰
// @match        https://zy.xywlapi.cc/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480665/Q%E7%BB%91%E6%9F%A5%E8%AF%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/480665/Q%E7%BB%91%E6%9F%A5%E8%AF%A2%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

/* 不用
    // 创建 MutationObserver 实例
    var observer = new MutationObserver(function(mutationsList) {
        for (var mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                if(document.querySelector("[id^='layui-layer-']")){
                    // 在变化发生时检查目标元素并进行点击
                    clickbtn();
                }
            }
        }
    });
    // 配置 MutationObserver
    var observerConfig = {
        childList: true,
        subtree: true
    };
    // 启动 MutationObserver 监视
    observer.observe(document.body, observerConfig);
*/

    var btn = document.querySelector(".btn.btn-block.btn-primary"); //查找按钮

    //打开页面首次的欢迎使用自动点击确定
    setTimeout(function() {
        var btn1 = document.querySelector(".layui-layer-btn0");
        if(btn1) btn1.click();
    }, 800)

    //自动点击确认
    function clickbtn() {
        setTimeout(function() {
            //var btn1 = document.querySelector(".layui-layer-btn0");
            //if(btn1) btn1.click();
            var btn2 = document.querySelector(".layui-layer-content .btn.btn-block.btn-primary");
            if(btn2) btn2.click();
        }, 100)
    }

    //文本框回车直接查找
    document.onkeydown=function a(e){
        if(e.target.id=='input' && e.keyCode=='13'){
            btn.click();
            clickbtn();
        }
    }

    //查找按钮添加监听点击
    btn.addEventListener("click", function() {
        clickbtn();
    });

})();