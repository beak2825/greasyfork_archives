// ==UserScript==
// @name         抖音隐藏登录弹窗及视频标题
// @namespace    your-namespace
// @version      1.1.4
// @description  隐藏抖音登录窗口
// @author       吃不吃香菜
// @license      MIT
// @match        https://www.douyin.com/*
// @match        http://www.douyin.com/*
// @match        *.douyin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477845/%E6%8A%96%E9%9F%B3%E9%9A%90%E8%97%8F%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%E5%8F%8A%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/477845/%E6%8A%96%E9%9F%B3%E9%9A%90%E8%97%8F%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97%E5%8F%8A%E8%A7%86%E9%A2%91%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var AllMethods = true; //控制所有函数开关
    var VideoTitle = false; //控制视频标题显示开关
    var LoginWindow = true; //控制登录窗口显示开关
    var Transparent = false;//控制视频标题透明度开关
    var TitleTransparency = 0.3;//控制视频标题透明度 Transparent = true 后运行

    // 元素隐藏函数
    function hideElement(element) {
        if (AllMethods) {
            if (element) {
                element.style.display = 'none';
            }
        }
    }



    // 视频标题元素隐藏函数
    function checkAndHide() {
        if (VideoTitle) {
            var elements = document.getElementsByClassName('tSXOCvQc');
            for (var i = 0; i < elements.length; i++) {
                hideElement(elements[i]);
            }
        }
    }

    // 视频标题元素透明度设置函数
    function setElementOpacity() {
        if(Transparent){
            var elements = document.getElementsByClassName('tSXOCvQc'); // 获取元素
            for (var i = 0; i < elements.length; i++) { // 循环处理
                elements[i].style.opacity = TitleTransparency;
                //console.log("元素透明度设置成功：" + elements[i].style.opacity);
            }
        }
    }

    //持续调用setElementOpacity()函数
    if (Transparent) {
        // 每隔 3s 设置一次视频标题元素的透明度
        setInterval(setElementOpacity, 3000);
    }




    //持续调用checkAndHide()函数
    if(VideoTitle){
        // 每隔 3s 检查一次是否存在 class 为 tSXOCvQc 的元素，如出现则隐藏
        setInterval(checkAndHide, 3000);
    }

    //登录窗口隐藏函数
    // 监听 DOM 变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (LoginWindow) {
                //隐藏登录窗口
                // 遍历所有变化记录
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    // 如果新增的节点是 class 为 mPWahmAI、screen-mask 或 login-mask-enter-done 的元素，则隐藏它
                    var addedNode = mutation.addedNodes[i];
                    if (addedNode.classList) {
                        if (addedNode.classList.contains('mPWahmAI') || addedNode.classList.contains('screen-mask') || addedNode.classList.contains('login-mask-enter-done')) {
                            hideElement(addedNode);
                        }
                    }
                }
            }
        });
    });



    // 配置 MutationObserver
    var observerConfig = {
        childList: true,
        subtree: true
    };

    // 启动 MutationObserver 监听
    observer.observe(document.body, observerConfig);


    // 页面初始元素隐藏
    var elements = document.querySelectorAll('.tSXOCvQc, .mPWahmAI, .screen-mask, .login-mask-enter-done');
    for (var i = 0; i < elements.length; i++) {
        hideElement(elements[i]);
    }
})();
