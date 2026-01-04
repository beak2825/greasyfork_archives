// ==UserScript==
// @name         获取元素链接
// @namespace    http://your.namespace
// @version      0.1
// @description  Show the link of the button's destination on click
// @author       Your Name
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472766/%E8%8E%B7%E5%8F%96%E5%85%83%E7%B4%A0%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/472766/%E8%8E%B7%E5%8F%96%E5%85%83%E7%B4%A0%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
   // 创建一个按钮
    var button = document.createElement("button");
    button.innerHTML = "显示链接";
    button.style.top = "20px";
    button.style.right = "20px";
    button.style.position = 'fixed';
    button.style.zIndex = '999999999';
    document.body.appendChild(button);

    // 给按钮添加点击事件
    button.addEventListener("click", function() {
        button.style.background = 'rgba(144, 238, 144, 0.9)';// 设置淡绿色背景
        // 创建一个悬浮提示框元素
        var tooltip = document.createElement("div");
        tooltip.style.position = "fixed";
        tooltip.style.backgroundColor = "white";
        tooltip.style.border = "1px solid black";
        tooltip.style.padding = "5px";
        tooltip.style.display = "none"; // 初始状态隐藏
        tooltip.style.zIndex = '999999999';
        document.body.appendChild(tooltip);

        // 创建一个用于显示链接的文本框
        var linkDisplay = document.createElement("textarea");
        linkDisplay.style.position = "fixed";
        linkDisplay.style.top = "80px";
        linkDisplay.style.right = "20px";
        linkDisplay.style.width = "200px";
        linkDisplay.style.height = "200px";
        linkDisplay.style.resize = "none";
        linkDisplay.style.display = "none";
        linkDisplay.style.fontSize = '14px'; // 设置标签字体大小为 14 像素
        document.body.appendChild(linkDisplay);
        // 创建用于显示提示的标签
/*
        const notificationBox = document.createElement('div');
        notificationBox.style.position = 'fixed';
        notificationBox.style.top = '50%';
        notificationBox.style.left = '50%';
        notificationBox.style.transform = 'translateX(-50%,-50%)';
        notificationBox.style.padding = '10px 20px';
        notificationBox.style.background = 'rgba(0, 0, 0, 0.8)';
        notificationBox.style.color = '#fff';
        notificationBox.style.fontFamily = 'Arial, sans-serif';
        notificationBox.style.fontSize = '14px';
        notificationBox.style.borderRadius = '5px';
        notificationBox.style.zIndex = '999999999';
        notificationBox.style.transition = 'opacity 0.5s';
        notificationBox.style.opacity = '0';
        document.body.appendChild(notificationBox);

        // 复制文本到剪贴板的函数
        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);


            // 显示复制成功的提示
            notificationBox.textContent = '复制成功';
            notificationBox.style.opacity = '1';
            setTimeout(() => {
                notificationBox.style.opacity = '0';
            }, 2000); // 2 秒后自动消失
        }
*/
        // 给所有元素添加鼠标点击事件
        document.addEventListener("click", function(event) {
            event.preventDefault(); // 阻止默认点击行为
            event.stopPropagation(); // 阻止事件继续传播，完全阻止点击事件的触发
            const clickedElement = event.target;
            var link = "";
            if (clickedElement.tagName === "A") { // 如果是链接元素，直接获取其链接地址
                link = clickedElement.href;
                linkDisplay.value += link + "\n"; // 将链接添加到文本框中，保留之前的内容
                linkDisplay.style.display = "block";
               // copyToClipboard(link);
            } else { // 对于其他元素，查找最近的父级链接元素
                var closestLink = clickedElement.closest("a");
                if (closestLink) {
                    link = closestLink.href;
                    linkDisplay.value += link + "\n"; // 将链接添加到文本框中，保留之前的内容
                    linkDisplay.style.display = "block";
                //    copyToClipboard(link);
                }
            }
            tooltip.innerHTML = link;
            tooltip.style.display = "none";  //先别显示了
            tooltip.style.top = (event.clientY + 10) + "px"; // 10px 偏移以防止遮挡鼠标
            tooltip.style.left = (event.clientX + 10) + "px";

        });

        //document.addEventListener("mouseout", function() {
         //   tooltip.style.display = "none";
       // });

    });
})();
