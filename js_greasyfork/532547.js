// ==UserScript==
// @name         xiaohongshu Collect
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  xiaohongshu collect shortcut
// @author       onionycs
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @grant        none
// @license      mit
// @downloadURL https://update.greasyfork.org/scripts/532547/xiaohongshu%20Collect.user.js
// @updateURL https://update.greasyfork.org/scripts/532547/xiaohongshu%20Collect.meta.js
// ==/UserScript==

(function () {
    "use strict";
    /* globals jQuery, $, waitForKeyElements */

    document.addEventListener("keydown", function (event) {
        const pElement = document.getElementById('content-textarea');
        const target = event.target;
        // 判断当前焦点元素是否是input元素
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && event.target!== pElement) {
            if (event.key === "a" || event.key === "A") {
                document.getElementsByClassName('feeds-container')[0].style.display = 'none';
                document.getElementsByClassName('information-wrapper')[0].click();
                setTimeout(function() {
                    document.getElementById('access-min-window').click();
                }, 500);
            }

            if (event.key === "s" || event.key === "S") {
                document.getElementsByClassName("collect-wrapper")[0].click();
                setTimeout(function () {
                    document.getElementsByClassName("right-area")[0].click();
                }, 500);
            }
            
            if (event.key === "t" || event.key === "T") {
                // 获取第一个具有 'feeds-container' 类名的元素
                const element = document.getElementsByClassName('feeds-container')[0];
                // 检查元素是否存在
                if (element) {
                    // 如果元素当前的 display 属性为 'none'
                    if (element.style.display === 'none') {
                        // 则将其设置为 'block'
                        element.style.display = 'block';
                    } else {
                        // 否则将其设置为 'none'
                        element.style.display = 'none';
                    }
                }
            }

            if (event.key === "z" || event.key === "Z") {
                // 获取 .btn-wrapper 的第一个元素中的 <use> 标签
                var useElement = document.getElementsByClassName('btn-wrapper')[0].querySelector('use');

                // 获取 <use> 标签的 xlink:href 属性值
                var xlinkHref = useElement.getAttribute('xlink:href');

                // 判断 xlink:href 的值并执行操作
                if (xlinkHref === '#imgNote') {
                    // 图文没有被选中且会包含短视频，执行点击操作
                    document.getElementsByClassName('btn-wrapper')[0].click();
                }
                showNotification("已经为您过滤短视频内容");
            }
        }
    });

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
