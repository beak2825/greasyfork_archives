// ==UserScript==
// @name         全网全平台视频截屏截图截取视频助手 - 支持B站哔哩哔哩、优酷、爱奇艺、腾讯视频、乐视、芒果TV、搜狐视频、AcFun、Netflix、油管、TED、优.土、QQ、西瓜视频、A站、PPTV、视频网站
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description 全网全平台视频截屏截图截取视频助手，支持在B站哔哩哔哩、优酷、爱奇艺、腾讯视频、乐视、芒果TV、搜狐视频、AcFun、Netflix、油管、TED、优.土、QQ、西瓜视频、A站、PPTV、咪咕视频、新浪、微博、网易[娱乐、云课堂、新闻]、搜狐、风行、百度云视频、抖音、快手、YouTube、小红书、秒拍、微视、皮皮虾、土豆、迅雷看看等；直播：twitch、斗鱼、YY、虎牙、龙珠、战旗、映客等主流视频网站上进行快速视频截图。无论你是在观看影视剧、综艺节目还是在线课程，这款插件都能轻松帮助你截取高质量的屏幕图像，提升你的观影体验。安装后，一键截图，轻松保存精彩瞬间，支持自定义截图快捷键，操作简单，便捷实用！
// @author       chenghengsheng
// @match        *://*.bilibili.com/*
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.v.qq.com/*
// @match        *://*.le.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.sohu.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.netflix.com/*
// @match        *://*.youtube.com/*
// @match        *://*.ted.com/*
// @match        *://*.youku.com/*
// @match        *://*.xigua.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.pptv.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.miguvideo.com/*
// @match        *://*.weibo.com/*
// @match        *://*.163.com/*
// @match        *://*.sohu.com/*
// @match        *://*.feng.com/*
// @match        *://*.pan.baidu.com/*
// @match        *://*.twitch.tv/*
// @match        *://*.douyu.com/*
// @match        *://*.yy.com/*
// @match        *://*.huya.com/*
// @match        *://*.longzhu.com/*
// @match        *://*.zhanqi.tv/*
// @match        *://*.douyin.com/*
// @match        *://*.kuaishou.com/*
// @match        *://*.xiaohongshu.com/*
// @match        *://*.miaopai.com/*
// @match        *://*.weishi.com/*
// @match        *://*.pipix.com/*
// @match        *://*.tudou.com/*
// @match        *://*.xunlei.com/*
// @match        *://*/*
// @grant        none
// @icon         https://chuizi.shop/files/video-screenshot-icon.png
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/504519/%E5%85%A8%E7%BD%91%E5%85%A8%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E6%88%AA%E5%B1%8F%E6%88%AA%E5%9B%BE%E6%88%AA%E5%8F%96%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%20-%20%E6%94%AF%E6%8C%81B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81%E8%8A%92%E6%9E%9CTV%E3%80%81%E6%90%9C%E7%8B%90%E8%A7%86%E9%A2%91%E3%80%81AcFun%E3%80%81Netflix%E3%80%81%E6%B2%B9%E7%AE%A1%E3%80%81TED%E3%80%81%E4%BC%98%E5%9C%9F%E3%80%81QQ%E3%80%81%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E3%80%81A%E7%AB%99%E3%80%81PPTV%E3%80%81%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/504519/%E5%85%A8%E7%BD%91%E5%85%A8%E5%B9%B3%E5%8F%B0%E8%A7%86%E9%A2%91%E6%88%AA%E5%B1%8F%E6%88%AA%E5%9B%BE%E6%88%AA%E5%8F%96%E8%A7%86%E9%A2%91%E5%8A%A9%E6%89%8B%20-%20%E6%94%AF%E6%8C%81B%E7%AB%99%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%81%E4%BC%98%E9%85%B7%E3%80%81%E7%88%B1%E5%A5%87%E8%89%BA%E3%80%81%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E3%80%81%E4%B9%90%E8%A7%86%E3%80%81%E8%8A%92%E6%9E%9CTV%E3%80%81%E6%90%9C%E7%8B%90%E8%A7%86%E9%A2%91%E3%80%81AcFun%E3%80%81Netflix%E3%80%81%E6%B2%B9%E7%AE%A1%E3%80%81TED%E3%80%81%E4%BC%98%E5%9C%9F%E3%80%81QQ%E3%80%81%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E3%80%81A%E7%AB%99%E3%80%81PPTV%E3%80%81%E8%A7%86%E9%A2%91%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("你好，我是Hansen。");
    // @match        *://*/*
    var offsetX, offsetY, isDragging = false;
    var canScreenshot = true;
    function DoScreenshot() {
        // console.log("click - 0");
        if (!canScreenshot) {
            // console.log("click - 1");
            return
        }
        var video = document.querySelector("video");
        if (video) {
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL("image/png");
            // 获取当前时间并格式化为 YYYYMMDDHHMMSS
            var now = new Date();
            var timestamp = now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0');
            var downloadLink = document.createElement("a");
            downloadLink.href = dataURL;
            downloadLink.download = timestamp + "-截图.png";
            downloadLink.click();
            // console.log("click - 2");
        } else {
            // console.log("click - 3");
            alert("未找到视频元素！");
        }
    }

    // bilbil
    function buildScreenshotButtonToBilbil() {
        var controlBar = document.querySelector('.bpx-player-control-bottom-right');
        if (controlBar) {
            var screenshotButton = document.createElement("div");
            screenshotButton.className = "bpx-player-ctrl-btn";
            screenshotButton.style.marginRight = "15px";
            screenshotButton.role = "button";
            screenshotButton.ariaLabel = "截图";
            screenshotButton.tabIndex = 0;
            screenshotButton.innerHTML = '<div class="bpx-player-ctrl-quality-result">截图</div>';
            controlBar.insertBefore(screenshotButton, controlBar.querySelector('.bpx-player-ctrl-playbackrate'));
            screenshotButton.addEventListener("click", function () {
                DoScreenshot()
            });
            return true
        } else {
            return false
        }
    }

    // 创建截图按钮
    function buildScreenshotButtonToCommon() {
        var screenshotButton = document.createElement('div');
        screenshotButton.className = 'screenshot-button';
        screenshotButton.style.position = 'fixed';
        screenshotButton.style.top = '200px';
        screenshotButton.style.left = '10px';
        screenshotButton.style.width = '40px';
        screenshotButton.style.height = '40px';
        screenshotButton.style.zIndex = 1000000;
        screenshotButton.style.backgroundColor = '#000';
        screenshotButton.style.color = '#fff';
        screenshotButton.style.display = 'flex';
        screenshotButton.style.alignItems = 'center';
        screenshotButton.style.justifyContent = 'center';
        screenshotButton.style.borderRadius = '10px';
        screenshotButton.style.cursor = 'pointer';
        screenshotButton.style.userSelect = 'none';
        screenshotButton.style.backgroundImage = 'url(https://chuizi.shop/files/video-screenshot-do.png)'; // 替换为实际的图片路径
        screenshotButton.style.backgroundSize = 'cover';
        screenshotButton.style.backgroundPosition = 'center';
        screenshotButton.style.backgroundRepeat = 'no-repeat';

        document.body.appendChild(screenshotButton);
        screenshotButton.addEventListener('click', function () {
            DoScreenshot();
        });
        makeDraggable(screenshotButton);
    }

    function makeDraggable(element) {

        element.addEventListener('mousedown', function (e) {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
        });

        window.addEventListener('mousemove', function (e) {
            if (isDragging) {
                if ((e.clientY - offsetY) <= 10) {
                    element.style.top = '10px';
                } else if ((e.clientY - offsetY + 10) > (window.innerHeight - parseFloat(element.style.height))) {
                    element.style.top = (window.innerHeight - element.style.height - 10) + 'px';
                } else {
                    // element.style.left = (e.clientX - offsetX) + 'px';
                    element.style.top = (e.clientY - offsetY) + 'px';
                }
                canScreenshot = false;
            }
        });

        window.addEventListener('mouseup', function () {
            isDragging = false;
            setTimeout(() => {
                canScreenshot = true;
            }, 100);
        });
    }

    window.addEventListener('load', function () {
        buildScreenshotButtonToBilbil();
        buildScreenshotButtonToCommon();
    });

})();