// ==UserScript==
// @name         ALiIcon Evolved enhancements
// @namespace    http://tampermonkey.net/
// @namespace    ALiIcon_Evolved_enhancements
// @version      1.1
// @description  用于强化阿里本地图标库的操作
// @require	http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @author      https://github.com/wuhao1477
// @match        file:///*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @charset	UTF-8
// @license      AGPL License
// @original-license  AGPL License
// @original-script   https://greasyfork.org/zh-CN/scripts/456372
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470513/ALiIcon%20Evolved%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/470513/ALiIcon%20Evolved%20enhancements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to copy text to clipboard
    // 绑定双击事件处理程序
    $('.icon_lists .dib').on('dblclick', function () {
        // 查找当前元素下 class 为 code-name 的元素
        var codeNameElement = $(this).find('.code-name');
        // 获取元素的文本值并过滤掉空格
        var codeName = codeNameElement.text().trim();
        // 将结果复制到粘贴板中
        navigator.clipboard.writeText(codeName);
        // 在控制台中打印结果
        console.log(codeName);
        // 创建提示框
        var message = $('<div class="message">已复制到粘贴板</div>');
        // 设置提示框的样式
        message.css({
            position: 'fixed',
            zIndex: '9999',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fontSize: '14px',
            opacity: '0',
            transition: 'opacity 0.5s ease-in-out'
        });
        // 将提示框添加到页面中
        $('body').append(message);
        // 动画过渡显示提示框
        setTimeout(function () {
            message.css('opacity', '1');
        }, 10);
        // 动画过渡隐藏提示框
        setTimeout(function () {
            message.css('opacity', '0');
            setTimeout(function () {
                message.remove();
            }, 500);
        }, 1000);
    });

    // 绑定鼠标进入事件处理程序
    $('.icon_lists .dib').on('mouseenter', function (event) {
        // 创建提示框
        var tooltip = $('<div class="tooltip">双击复制到粘贴板</div>');
        // 设置提示框的样式
        tooltip.css({
            position: 'absolute',
            zIndex: '9999',
            padding: '5px',
            borderRadius: '5px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            fontSize: '12px',
            opacity: '0',
            transition: 'opacity 0.5s ease-in-out'
        });
        // 将提示框添加到当前元素中
        $(this).append(tooltip);
        // 延迟一段时间后显示提示框
        setTimeout(function () {
            var tooltipWidth = tooltip.outerWidth();
            var tooltipHeight = tooltip.outerHeight();
            var left = "5%";
            var top = "5%";
            tooltip.css({
                left: left + 'px',
                top: top + 'px',
                opacity: '1'
            });
        }.bind(this), 10);
    });

    // 绑定鼠标离开事件处理程序
    $('.icon_lists .dib').on('mouseleave', function () {
        // 查找当前元素下 class 为 tooltip 的元素，并删除它
        var tooltip = $(this).find('.tooltip');
        if (tooltip.length > 0) {
            tooltip.remove();
        }
        // 取消悬浮状态和阴影效果
        $(this).css({
            position: '',
            boxShadow: '',
            zIndex: ''
        });
    });

    // 绑定鼠标悬浮事件处理程序
    $('.icon_lists .dib').on('mouseover', function () {
        // 添加阴影效果
        $(this).css({
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
            zIndex: '999'
        });
    });

    // 绑定鼠标离开事件处理程序
    $('.icon_lists .dib').on('mouseout', function () {
        // 取消阴影效果
        $(this).css('boxShadow', '');
    });

    // 创建设置按钮
    var inlet = document.createElement("div");
    // inlet.className = "inlet";
    inlet.style.position = "fixed";
    inlet.style.bottom = "12%";
    inlet.style.left = "0";
    inlet.style.padding = "10px";
    inlet.style.transform = "translateX(-50%)";
    var inletButton = document.createElement("div");
    // inletButton.className = "inlet-button";
    inletButton.style.width = "50px";
    inletButton.style.height = "50px";
    inletButton.style.background = "#fff";
    inletButton.style.borderRadius = "50%";
    inletButton.style.boxShadow = "0 0 10px rgba(0, 0, 0, .5)";
    inletButton.style.display = "flex";
    inletButton.style.justifyContent = "center";
    inletButton.style.alignItems = "center";
    inletButton.innerHTML = '<svg t="1688800791106" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1486" width="32" height="32"><path d="M512 328c-100.8 0-184 83.2-184 184S411.2 696 512 696 696 612.8 696 512 612.8 328 512 328z m0 320c-75.2 0-136-60.8-136-136s60.8-136 136-136 136 60.8 136 136-60.8 136-136 136z" p-id="1487"></path><path d="M857.6 572.8c-20.8-12.8-33.6-35.2-33.6-60.8s12.8-46.4 33.6-60.8c14.4-9.6 20.8-27.2 16-44.8-8-27.2-19.2-52.8-32-76.8-8-14.4-25.6-24-43.2-19.2-24 4.8-48-1.6-65.6-19.2-17.6-17.6-24-41.6-19.2-65.6 3.2-16-4.8-33.6-19.2-43.2-24-14.4-51.2-24-76.8-32-16-4.8-35.2 1.6-44.8 16-12.8 20.8-35.2 33.6-60.8 33.6s-46.4-12.8-60.8-33.6c-9.6-14.4-27.2-20.8-44.8-16-27.2 8-52.8 19.2-76.8 32-14.4 8-24 25.6-19.2 43.2 4.8 24-1.6 49.6-19.2 65.6-17.6 17.6-41.6 24-65.6 19.2-16-3.2-33.6 4.8-43.2 19.2-14.4 24-24 51.2-32 76.8-4.8 16 1.6 35.2 16 44.8 20.8 12.8 33.6 35.2 33.6 60.8s-12.8 46.4-33.6 60.8c-14.4 9.6-20.8 27.2-16 44.8 8 27.2 19.2 52.8 32 76.8 8 14.4 25.6 22.4 43.2 19.2 24-4.8 49.6 1.6 65.6 19.2 17.6 17.6 24 41.6 19.2 65.6-3.2 16 4.8 33.6 19.2 43.2 24 14.4 51.2 24 76.8 32 16 4.8 35.2-1.6 44.8-16 12.8-20.8 35.2-33.6 60.8-33.6s46.4 12.8 60.8 33.6c8 11.2 20.8 17.6 33.6 17.6 3.2 0 8 0 11.2-1.6 27.2-8 52.8-19.2 76.8-32 14.4-8 24-25.6 19.2-43.2-4.8-24 1.6-49.6 19.2-65.6 17.6-17.6 41.6-24 65.6-19.2 16 3.2 33.6-4.8 43.2-19.2 14.4-24 24-51.2 32-76.8 4.8-17.6-1.6-35.2-16-44.8z m-56 92.8c-38.4-6.4-76.8 6.4-104 33.6-27.2 27.2-40 65.6-33.6 104-17.6 9.6-36.8 17.6-56 24-22.4-30.4-57.6-49.6-97.6-49.6-38.4 0-73.6 17.6-97.6 49.6-19.2-6.4-38.4-14.4-56-24 6.4-38.4-6.4-76.8-33.6-104-27.2-27.2-65.6-40-104-33.6-9.6-17.6-17.6-36.8-24-56 30.4-22.4 49.6-57.6 49.6-97.6 0-38.4-17.6-73.6-49.6-97.6 6.4-19.2 14.4-38.4 24-56 38.4 6.4 76.8-6.4 104-33.6 27.2-27.2 40-65.6 33.6-104 17.6-9.6 36.8-17.6 56-24 22.4 30.4 57.6 49.6 97.6 49.6 38.4 0 73.6-17.6 97.6-49.6 19.2 6.4 38.4 14.4 56 24-6.4 38.4 6.4 76.8 33.6 104 27.2 27.2 65.6 40 104 33.6 9.6 17.6 17.6 36.8 24 56-30.4 22.4-49.6 57.6-49.6 97.6 0 38.4 17.6 73.6 49.6 97.6-6.4 19.2-14.4 38.4-24 56z" p-id="1488"></path></svg>'
    inlet.appendChild(inletButton);
    document.body.appendChild(inlet);

    // 光标悬停时完全展示，并有0.3s的过度动画
    inlet.addEventListener("mouseover", function () {
        inlet.style.transform = "translateX(0)";
        inlet.style.transition = "transform 0.3s";
        inlet.style.cursor = "pointer";
    });

    // 光标移开时隐藏提示框并取消过度动画
    inlet.addEventListener("mouseout", function () {
        inlet.style.transform = "translateX(-50%)";
    });

    // 添加点击事件监听器
    inlet.addEventListener("click", function(event) {

        // 将其背景颜色设置为红色
        inletButton.style.background = "red";

        // 在 0.3 秒后将背景颜色还原为原始颜色
        setTimeout(function() {
            inletButton.style.background = "";
        }, 300);
    });

})();