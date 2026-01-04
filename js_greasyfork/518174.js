// ==UserScript==
// @name         satz---bilibili马士兵播放页快捷键
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  s键取消联播，a键位网页全屏，t键影院模式, q键toggle视频推荐
// @author       onionycs
// @match        https://www.bilibili.com/video/*
// @match        https://www.mashibing.com/*
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518174/satz---bilibili%E9%A9%AC%E5%A3%AB%E5%85%B5%E6%92%AD%E6%94%BE%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/518174/satz---bilibili%E9%A9%AC%E5%A3%AB%E5%85%B5%E6%92%AD%E6%94%BE%E9%A1%B5%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 推荐安装，https://greasyfork.org/zh-CN/scripts/390792-b站封面替换右侧广告-bilibili-哔哩哔哩

     //  -----------bilibili取消自动连播
    setTimeout(function() {

        if ($(".switch-btn.on").length > 0) {
            $(".switch-btn.on").click();
        }
        showNotification("已经为您取消自动连播 用 s 打开","160px");
    }, 5000);

    setTimeout(function() {

        toggleReclist();
        showNotification("已经为您隐藏推荐列表 用 z 打开","80px");

    }, 2000);

    //  -----------bilibili搜索框placeholder-----------
    function f() {
        const elements = document.querySelectorAll('.nav-search-input, .search-input-el, .nav-search-content');
        elements.forEach(element => {
            if (element) {
                element.placeholder = "";
            }
        });
    }

    let executionCount = 0;
    const interval = setInterval(() => {
        f();
        executionCount++;
        if (executionCount >= 20) {
            clearInterval(interval);
        }
    }, 300);
    //-------------搜索框placeholder-------------


    /* globals jQuery, $, waitForKeyElements */
    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        const target = event.target;
        // 判断当前焦点元素是否是input元素
        if (target.tagName!== 'INPUT' && target.tagName!== 'TEXTAREA') {

            if (event.key === 't'||event.key === 'T') {
                //----bilibili宽屏-------
                if($('.bpx-player-ctrl-wide').length!=0){
                    let buttons = $('.bpx-player-ctrl-wide').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }
                //----msb nav 1折叠-------
                if($('.ant-collapse-header[aria-expanded="true"]').length!=0){
                    let buttons = $('.ant-collapse-header[aria-expanded="true"]').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }
                //----msb open live折叠-------
                if($('.el-collapse-item__header.is-active').length!=0){
                    let buttons = $('.el-collapse-item__header.is-active').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }

            }

            if (event.key === 'a'||event.key === 'A') {
                if($('.bpx-player-ctrl-web').length!=0){
                    let buttons = $('.bpx-player-ctrl-web').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }

                //---------马士兵 open live 网页全屏
                if($('.ccH5PageFullsBtn[style*="display: block"]').length!=0){
                    let buttons = $('.ccH5PageFullsBtn[style*="display: block"]').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }else if($('.ccH5ExitPageFullsBtn[style*="display: block"]').length!=0){
                    let buttons = $('.ccH5ExitPageFullsBtn[style*="display: block"]').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }
                //---------马士兵 open live 网页全屏
                if($('.pv-icon-btn-webFullScreen').length!=0){
                    let buttons = $('.pv-icon-btn-webFullScreen').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }else if($('.pv-icon-btn-exitWebFullScreen').length!=0){
                    let buttons = $('.pv-icon-btn-exitWebFullScreen').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                }

            }

            if (event.key === 's'||event.key === 'S') {
                if($('.switch-btn').length==1){
                    let buttons = $('.switch-btn').toArray();
                    buttons.forEach(button => {
                        button.click();
                    });
                    showNotification("toggle自动连播","160px");
                }
                const targetElement = document.querySelector('.nav-search-input');
                if (targetElement) {
                    targetElement.placeholder = "输入关键字搜索";
                }
            }

            if (event.key === 'Z' || event.key === 'z') {
                toggleReclist();
                showNotification("toggle推荐列表","80px");
            }
        }
    });

    function toggleReclist(){
        const recList = document.getElementsByClassName('rec-list')[0];
        const recFooter = document.getElementsByClassName('rec-footer')[0];
        const nextPlay = document.getElementsByClassName('next-play')[0];

        if (recList || recFooter) {
            const shouldHide = (recList && recList.style.display!== 'none') || (recFooter && recFooter.style.display!== 'none');
            const displayValue = shouldHide? 'none' : '';

            if (recList) {
                recList.style.display = displayValue;
            }
            if (recFooter) {
                recFooter.style.display = displayValue;
            }
            if (nextPlay) {
                nextPlay.style.display = displayValue;
            }
        }
    }


    // 函数：在页面右上方显示提示信息
    function showNotification(message,topp) {
        // 创建通知元素
        const $notification = $("<div></div>")
        .text(message)
        .css({
            position: "fixed",
            top: topp,
            right: "20px",
            padding: "10px 20px",
            backgroundColor: "#f44336", // 红色背景
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            fontSize: "14px",
            opacity: 0,
        });

        // 将通知元素添加到页面
        $("body").append($notification);

        // 动画显示通知
        $notification.animate({ opacity: 1 }, 500, function() {
            // 3秒后自动隐藏通知
            setTimeout(function() {
                $notification.animate({ opacity: 0 }, 500, function() {
                    $notification.remove();
                });
            }, 3000);
        });
    }
})();