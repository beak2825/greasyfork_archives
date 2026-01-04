// ==UserScript==
// @name         123盘去广告
// @namespace    https://github.com/CreeperDisco/pan123-remove-ad
// @version      1.3.0
// @description  去除123盘背景广告、广告跳转、及广告横幅，屏蔽客户端下载和手机扫描，添加了150%的缩放，窗口宽度自适应
// @author       CreeperDisco
// @license      GPL-3.0-only
// @copyright    2024, CreeperDisco
// @match        https://www.123pan.com/s/*
// @match        https://www.123pan.cn/s/*
// @icon         https://statics.123957.com/static-by-custom/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503621/123%E7%9B%98%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/503621/123%E7%9B%98%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来检查是否有指定的div
    function checkForContentBorder() {

        // 获取当前文档对象
        var doc = window.document;

        // 设置缩放级别 150%
        if (typeof doc.body.style.zoom !== 'undefined') {
            // 对于支持zoom属性的浏览器
            doc.body.style.zoom = '150%';
        } else if (typeof doc.body.style.webkitTransform !== 'undefined') {
            // 对于支持CSS3 transform属性的浏览器
            doc.body.style.webkitTransform = 'scale(1.5)';
            doc.body.style.transform = 'scale(1.5)';
        } else {
            // 如果以上都不支持，控制台给出提示
            console.log('您的浏览器不支持缩放.');
        }


        var contentBorderDiv = document.querySelector('.contentBorder');
        if (contentBorderDiv) {
            // 如果找到了带有contentBorder类的div，执行后续代码
            console.log('找到了contentBorder!');
            pcWeb();
        } else {
            // 如果没有找到，等待一段时间后再次检查
            setTimeout(checkForContentBorder, 100); // 每0.1秒检查一次
        }
    }

    function shareExpired() {
        // 移动div的函数
        function moveDivs() {
            // 查找具有类名"webbody svip-body"的源div
            var sourceDiv = document.querySelector('.webbody.svip-body');

            if (sourceDiv) {
                // 查找源div的所有一级子div
                var childDivs = sourceDiv.querySelectorAll(':scope > div');

                // 查找具有类名"appdiv web-wrap"的目标div
                var targetDiv = document.querySelector('.appdiv.web-wrap');

                if (targetDiv) {
                    // 遍历每个一级子div并将其移动到目标div
                    for (var i = 0; i < childDivs.length; i++) {
                        // 将一级子div附加到目标div
                        targetDiv.appendChild(childDivs[i]);
                    }
                }
            }
            removeAd();
        }

        function removeAd() {

            // 获取所有需要移除的webbody svip-body（移除 背景广告）
            let elements = document.querySelectorAll('div.webbody.svip-body');
            // 移除它
            elements.forEach(element => {
                element.parentNode.removeChild(element);
            });
        }

        // 创建一个MutationObserver实例
        var observer = new MutationObserver(moveDivs);

        // 配置MutationObserver，观察整个DOM树的变化
        var config = {
            childList: true,
            subtree: true
        };

        // 开始观察document.body的变化
        observer.observe(document.body, config);

        // 在DOMContentLoaded事件中尝试移动div
        document.addEventListener('DOMContentLoaded', moveDivs);

    }

    // 定义 leftCard 函数（beta）
    function leftCard() {
        // 创建样式元素
        var style = document.createElement('style');
        style.type = 'text/css';

        // 定义样式元素
        var cssRules = `
        .leftCard {
            width: 406px;
            background: hsla(0, 0%, 100%, .8);
            display: flex;
            align-items: center;
            justify-content: center;
            -webkit-backdrop-filter: blur(25px);
            backdrop-filter: blur(25px);
        }

        .leftCard .ca-top {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            grid-gap: 8px;
            gap: 8px;
        }

        .leftCard .ca-top .infoText {
            font-size: 14px;
            color: #3a4056;
            line-height: 16px;
            font-weight: 600;
        }

        .leftCard .ca-top .rematimeText {
            font-size: 12px;
            color: #7b808f;
            line-height: 14px;
            font-style: normal;
            font-weight: 400;
        }

        .leftCard .ca-fot {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin-top: 40px;
            grid-gap: 24px;
            gap: 24px;
        }

        .leftCard .ca-fot .sharePwd {
            width: 254px;
            height: 44px;
            text-align: center;
            border-radius: 8px;
            border: 1px solid #eaeaea;
        }

        .leftCard .ca-fot .sharePwd:focus {
            border: 1px solid #597dfc;
        }

        .leftCard .ca-fot .submitCode {
            width: 254px;
            height: 44px;
            background: #597dfc;
            color: #fff;
            font-size: 14px;
            border-radius: 8px;
        }
    `;

        // 将 CSS 规则附加到 style 元素
        if (style.styleSheet) {
            style.styleSheet.cssText = cssRules;
        } else {
            style.appendChild(document.createTextNode(cssRules));
        }

        // 将样式元素写到文档的头部
        document.head.appendChild(style);
    }

    // 定义 pcWeb 函数
    function pcWeb() {

        // 获取所有类名为contentBorder和sharheader的div元素
        //var elementsToMove = document.querySelectorAll('.contentBorder, .sharheader, .leftCard');
        var elementsToMove = document.querySelectorAll('.contentBorder, .sharheader');


        // 获取类名为appdiv web-wrap的div元素
        var appDivWebWrap = document.querySelector('.appdiv.web-wrap');

        // 遍历所有需要移动的div元素
        for (var i = 0; i < elementsToMove.length; i++) {
            // 将每个元素移动到appDivWebWrap div元素内
            appDivWebWrap.appendChild(elementsToMove[i]);
        }

        // 获取所有需要移除的div元素，包括类名为webbody svip-body、pointer和qrcode_btn的元素（移除 背景广告 横幅广告 二维码按钮）
        var elementsToRemove = document.querySelectorAll('.webbody.svip-body, .pointer, .qrcode_btn');

        // 遍历所有需要移除的div元素
        for (var j = 0; j < elementsToRemove.length; j++) {
            // 从DOM中移除每个元素
            elementsToRemove[j].parentNode.removeChild(elementsToRemove[j]);
        }


        // 获取contentBorder元素（文件列表宽度自适应）
        var contentBorder = document.querySelector('.contentBorder');

        // 设置contentBorder元素的宽度为浏览器窗口宽度
        contentBorder.style.width = window.innerWidth + 'px';

        // 当窗口大小改变时，更新contentBorder元素的宽度
        window.addEventListener('resize', function() {
            contentBorder.style.width = window.innerWidth + 'px';
        });


        // 移除第二个类名为 'register' 的 div（移除 下载客户端）
        // 获取所有类名为 'register' 的 div 元素
        var registerDivs = document.getElementsByClassName('register');

        // 检查是否有至少两个这样的 div 元素
        if (registerDivs.length >= 2) {
            // 移除第二个元素
            registerDivs[1].parentNode.removeChild(registerDivs[1]);
            console.log('移除了下载客户端');
        }
    }

    // 新建 phoneWeb 函数
    function phoneWeb() {
        isPhone(); //目前没做代码，先这样吧
    }

    function isPhone() {
        var userChoice = confirm("您的网页是手机端，目前不适配，请先卸载，等待以后版本\n如果您的设备被误判为手机端，请按“确认”键并【反馈】\n如果没误判，按“取消”");
        if (userChoice) {
            window.location.href = 'https://greasyfork.org/zh-CN/scripts/503621-123%E7%9B%98%E5%8E%BB%E5%B9%BF%E5%91%8A/feedback';
        } else {
            // 不做任何操作，仅关闭弹出框
        }
    }

    window.onload = function() {
        // 定义一个函数来检查当前页面是否在移动设备上查看
        function isMobileDevice() {
            var userAgent = navigator.userAgent || navigator.vendor || window.opera;

            // 检查常见的移动设备用户代理字符串
            if (/Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
                return true; // 是移动设备
            }

            return false; // 不是移动设备
        }

        // 检查页面中是否存在“分享已过期”字样，并调用 shareExpired 函数
        var expiredText = document.body.innerHTML.indexOf('分享已过期') !== -1;

        // 检测设备类型并执行相应函数
        if (isMobileDevice()) {
            phoneWeb(); // 如果是移动设备，执行phoneWeb函数
        } else {
            console.log('您的网页是PC端');

            if (expiredText) {
                console.log('分享已过期');

                // 如果存在“分享已过期”，调用 shareExpired 函数
                shareExpired();
            } else {
                // 开始检查是否有contentBorder
                checkForContentBorder();
            }
        }
    };

})();
