// ==UserScript==
// @name         全自动学习
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  开启你的刷课之旅吧。脚本自动点击“开始学习、继续学习”，后台挂机功能不稳定。
// @match        https://htedu.yunxuetang.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533601/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/533601/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 模拟窗口始终可见
    Object.defineProperty(document, 'visibilityState', {get: () => 'visible'});
    Object.defineProperty(document, 'hidden', {get: () => false});

    // 模拟鼠标移动
    function simulateMouseMove() {
        window.dispatchEvent(new MouseEvent('mousemove', {
            clientX: Math.random() * window.innerWidth,
            clientY: Math.random() * window.innerHeight
        }));
    }

    // 模拟键盘事件
    function simulateKeyPress() {
        window.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '}));
    }


    let goID = setInterval(() => {
        go();
        simulateMouseMove();
        if (Math.random() < 0.1) {  // 10% 的概率触发键盘事件
            simulateKeyPress();
        }
    }, Math.random() * 500 + 200);  // 随机间隔200到700毫秒

    goID();

    function go() {
        var button1 = document.querySelectorAll('.yxtf-button.yxtf-button--primary.yxtf-button--larger');
        button1.forEach(function(按钮) {
            var spanText = 按钮.querySelector('span').textContent;
            if (spanText.includes('继续学习') || spanText.includes('开始学习')) {
                按钮.click();
            }
        });
        var button2 = document.querySelectorAll('.yxtf-button.yxtf-button--primary.yxtf-button--large');
        button2.forEach(function(按钮) {
            var spans = 按钮.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('继续学习')) {
                    按钮.click();
                }
            });
        });
        var button3 = document.querySelectorAll('.ulcdsdk-nextchapterbutton');
        button3.forEach(function(按钮) {
            var spans = 按钮.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('继续学习下一章节')) {
                    按钮.click();
                }
            });
        });
        var 完成学习s = document.querySelectorAll('.yxtulcdsdk-flex-center');
        完成学习s.forEach(function(完成学习) {
            var spans = 完成学习.querySelectorAll('span');
            spans.forEach(function(span) {
                if (span.textContent.includes('已完成学习')) {
                    location.reload();  // 添加刷新页面的代码
                    window.history.back();
                }
            });
        });
        var 视频s = document.querySelectorAll('.kng-list-new__cover');
        let clicked = false; // 添加一个标志变量来控制点击操作
        视频s.forEach(function(视频) {
            var divs = 视频.querySelectorAll('div');
            if (clicked) return; // 同样在这里检查，确保即使在内层循环中也能停止
            var a=0;
            var b=0;
            divs.forEach(function(div) {
                if (div.textContent.includes('视频')){a=1};
                if (div.textContent.includes('已学完')){b=1};
            });
            if(a==1 && b ==0){
                setTimeout(function() {
                    clicked = true; // 更新标志变量为true，表示已经进行了点击操作
                    视频.click(); // 如果条件满足，延迟1秒后点击这个视频元素
                }, 1000); // 延迟时间为1000毫秒，即1秒
            };

        });
        var video = document.querySelector('video');
        if (video && video.paused) {
            video.play();
        }
    }

})();
