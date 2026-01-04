// ==UserScript==
// @name         mashibing next episode control
// @namespace    http://tampermonkey.net/
// @version      24.12.26.21.22
// @description  key listener ESC
// @license MIT
// @author       onionycs
// @match        https://www.mashibing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mashibing.com
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505135/mashibing%20next%20episode%20control.user.js
// @updateURL https://update.greasyfork.org/scripts/505135/mashibing%20next%20episode%20control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    // Your code here...
    setTimeout(function() {
            $(document).ready(function() {
                $('.text-ellipsis').css('overflow', 'visible');
            });
    }, 5000);

    setInterval(() => {
        if(document.getElementsByClassName('next-btn').length!=0){
                document.getElementsByClassName('next-btn')[1].click();
                showNotification("已经为您取消自动连播");
        }
    }, 1000); // 1 second interval

    document.addEventListener('keydown', function(event) {

        if (event.key === 'Escape') {
            if(document.getElementsByClassName('next-btn').length!=0){
                document.getElementsByClassName('next-btn')[1].click();
                showNotification("已经为您取消自动连播");
            }
        }

        if (event.key === ']' || event.key === '】') {
            document.getElementsByClassName('next-btn')[0].click();
        }

        if (event.key === '[' || event.key === '【') {

            if($('.sider-container-btn').length==1){
                $('.sider-container-btn')[0].click();
            }else {
                if($('.el-icon-arrow-right').length==3){
                    $('.el-icon-arrow-right')[0].click();
                    $('.el-icon-arrow-right')[1].click();
                }else{
                    $('.el-icon-arrow-left')[1].click();
                }
            }
            setTimeout(function() {
                $(document).ready(function() {
                    $('.text-ellipsis').css('overflow', 'visible');
                });
            }, 500);
        }
    });

    // 函数：在页面右上方显示提示信息
    function showNotification(message) {
        // 创建通知元素
        const $notification = $("<div></div>")
        .text(message)
        .css({
            position: "fixed",
            top: "80px",
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