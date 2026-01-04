// ==UserScript==
// @name         B站笔记快捷键：alt + ?
// @namespace    https://space.bilibili.com/391912695  https://github.com/PaperFly-web/
// @author       PaperFly
// @match        http*://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @description  alt + 1 2 3 4 5放大加粗，alt+f:选择文字变灰，alt+d:选择文字变黑，alt+g:选择文字变绿，alt+b:选择文字变蓝，alt+r:选择文字变红，alt+y:选择文字变黄，alt+双击f:选择文字高亮变灰，alt+双击d:选择文字高亮变黑，alt+双击g:选择文字高亮变绿，alt+双击b:选择文字高亮变蓝，alt+双击r:选择文字高亮变红，alt+双击y:选择文字高亮变黄，alt+双击z:取消高亮，alt+w:选中文字变白，alt+L:光标所在文字无序列表，alt+shit+L:光标所在文字有序列表
// @version 1.2.3.1
// @downloadURL https://update.greasyfork.org/scripts/468515/B%E7%AB%99%E7%AC%94%E8%AE%B0%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%9Aalt%20%2B%20.user.js
// @updateURL https://update.greasyfork.org/scripts/468515/B%E7%AB%99%E7%AC%94%E8%AE%B0%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BC%9Aalt%20%2B%20.meta.js
// ==/UserScript==

(function() {
    let timerId = null;
    let lastKeyPressTime = 0;
    const doubleClickThreshold = 300; // 阈值，单位：毫秒
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.altKey && (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' || event.key === '5')) {
            console.log(event.key)
            bold();
            event.preventDefault();
            simulateShiftHome();
            var pre = "";
            if (event.key === '1') {
                var sizeElement1 = document.querySelector('span.ql-picker-item[data-value="24px"][data-label="24"]');
                if (sizeElement1) {
                    sizeElement1.click();
                }
            }
            if (event.key === '2') {
                var sizeElement2 = document.querySelector('span.ql-picker-item[data-value="22px"][data-label="22"]');
                if (sizeElement2) {
                    sizeElement2.click();
                }
            }
            if (event.key === '3') {
                var sizeElement3 = document.querySelector('span.ql-picker-item[data-value="20px"][data-label="20"]');
                if (sizeElement3) {
                    sizeElement3.click();
                }
            }

            if (event.key === '4') {
                var sizeElement4 = document.querySelector('span.ql-picker-item[data-value="18px"][data-label="18"]');
                if (sizeElement4) {
                    sizeElement4.click();
                }
            }

            if (event.key === '5') {
                var sizeElement5 = document.querySelector('span.ql-picker-item[data-value="17px"][data-label="17"]');
                if (sizeElement5) {
                    sizeElement5.click();
                }
            }
        }
        if (event.altKey && (event.key === 'w' || event.key === 'W')) {
            event.preventDefault();
            fontWhite();


        }
        if (event.altKey && (event.key === 'r' || event.key === 'R')) {
            event.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightRed();
                if (timerId) {
                    // 取消延迟执行
                    clearTimeout(timerId);
                }
            } else {

                timerId = setTimeout(fontRed, doubleClickThreshold);
            }
            lastKeyPressTime = currentTime;


        }
        if (event.altKey && (event.key === 'd' || event.key === 'D')) {
            event.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightBlack();
                if (timerId) {
                    // 取消延迟执行
                    clearTimeout(timerId);
                }
            } else {

                timerId = setTimeout(fontBlack, doubleClickThreshold);
            }
            lastKeyPressTime = currentTime;
        }

        if (event.altKey && (event.key === 'b' || event.key === 'B')) {
            event.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightBlue();
                if (timerId) {
                    // 取消延迟执行
                    clearTimeout(timerId);
                }
            } else {

                timerId = setTimeout(fontBlue, doubleClickThreshold);
            }
            lastKeyPressTime = currentTime;
        }

        if (event.altKey && (event.key === 'g' || event.key === 'G')) {
            event.preventDefault();

            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightGreen();
                if (timerId) {
                    // 取消延迟执行
                    clearTimeout(timerId);
                }
            } else {

                timerId = setTimeout(fontGreen, doubleClickThreshold);
            }
            lastKeyPressTime = currentTime;
        }

        if (event.altKey && (event.key === 'y' || event.key === 'Y')) {
            event.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightYellow();
                if (timerId) {
                    // 取消延迟执行
                    clearTimeout(timerId);
                }
            } else {

                timerId = setTimeout(fontYellow, doubleClickThreshold);
            }
            lastKeyPressTime = currentTime;
        }

        if (event.altKey && (event.key === 'f' || event.key === 'F')) {
            event.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightF();
                if (timerId) {
                    // 取消延迟执行
                    clearTimeout(timerId);
                }
            } else {

                timerId = setTimeout(fontF, doubleClickThreshold);
            }
            lastKeyPressTime = currentTime;
        }

        if (event.altKey && (event.key === 'z' || event.key === 'Z')) {
            event.preventDefault();
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime <= doubleClickThreshold) {
                // 触发 Alt + 双击R键 事件
                heightCancle();

            }
            lastKeyPressTime = currentTime;
        }


        var videoElement = document.querySelector('video');

        if (event.altKey && event.key === 'c') {

            videoElement.playbackRate += 0.1;
            showVideoSpeed()

        }

        if (event.altKey && event.key === 'x') {
            videoElement.playbackRate -= 0.1;
            showVideoSpeed()
        }

        //无序列表
        if (event.altKey && (event.key === 'l' || event.key === 'L')) {
            event.preventDefault();
            unordered();
        }

        //有序列表
        if (event.shiftKey && event.altKey && (event.key === 'l' || event.key === 'L')) {
            event.preventDefault();
            ordered();
        }

    });
    function fontWhite() {
        var elementd = document.querySelector('.ql-picker-item[data-value="#ffffff"]');
        if (elementd) {
            elementd.click();
        }
    }
    //文字黑色
    function fontBlack() {
        var elementd = document.querySelector('.ql-picker-item.ql-primary[data-value="#000000"]');
        if (elementd) {
            elementd.click();
        }
    }
    //文字绿色
    function fontGreen() {
        var elementg = document.querySelector('span.ql-picker-item[data-value="#1db100"]');

        if (elementg) {
            elementg.click();
        }
    }
    //文字蓝色
    function fontBlue() {
        var elementb = document.querySelector('span.ql-picker-item[data-value="#0b84ed"]');

        if (elementb) {
            elementb.click();
        }
    }
    //文字红色
    function fontRed() {
        var elementr = document.querySelector('.ql-picker-item[data-value="#ee230d"]');
        if (elementr) {
            elementr.click();
        }
    }
    //文字黄色
    function fontYellow() {
        var elementy = document.querySelector('span.ql-picker-item[data-value="#fbe231"]');

        if (elementy) {
            elementy.click();
        }
    }
    //文字灰色
    function fontF() {
        var elementf = document.querySelector('span.ql-picker-item.ql-primary[data-value="#a5a5a5"]');
        if (elementf) {
            elementf.click();
        }
    }


    //高亮红
    function heightRed() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#ee230d"]');
        if (element) {
            element.click();
        }
    }

    function heightGreen() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#1db100"]');
        if (element) {
            element.click();
        }
    }

    function heightBlack() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#000000"]');
        if (element) {
            element.click();
        }
    }

    function heightYellow() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#fbe231"]');
        if (element) {
            element.click();
        }
    }

    function heightBlue() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#0b84ed"]');
        if (element) {
            element.click();
        }
    }

    function heightF() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#a5a5a5"]');
        if (element) {
            element.click();
        }
    }

    function heightCancle() {
        var parentElement = document.querySelector('[labeltooltip="文本高亮"]');
        const element = parentElement.querySelector('.ql-picker-item[data-value="#ffffff"]');
        if (element) {
            element.click();
        }
    }

    //无序列表
    function unordered() {
        var parentElement = document.querySelector('[labeltooltip="无序列表"]');
        const element = parentElement.querySelector('.icon');
        if (element) {
            element.click();
        }
    }

    //有序列表
    function ordered() {
        var parentElement = document.querySelector('[labeltooltip="有序列表"]');
        const element = parentElement.querySelector('.icon');
        if (element) {
            element.click();
        }
    }

    function bold() {

        // 通过class找到元素
        var elements = document.getElementsByClassName('ql-bold');

        // 如果有多个元素符合条件，可以遍历它们
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];

            // 模拟点击事件
            var clickEvent = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            element.dispatchEvent(clickEvent);
        }
    }

    function showVideoSpeed() {
        var videoElement = document.querySelector('video');

        // 创建用于显示速度的元素
        var speedDisplayElement = document.createElement('div');
        speedDisplayElement.style.position = 'absolute';
        speedDisplayElement.style.top = '10px';
        speedDisplayElement.style.left = '10px';
        speedDisplayElement.style.padding = '5px';
        speedDisplayElement.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        speedDisplayElement.style.color = 'white';
        speedDisplayElement.style.fontWeight = 'bold';
        speedDisplayElement.style.transition = 'opacity 0.3s';
        speedDisplayElement.style.opacity = '0';

        // 将速度显示元素添加到视频元素的父级容器中
        videoElement.parentElement.appendChild(speedDisplayElement);

        // 更新速度显示
        function updateSpeedDisplay() {
            speedDisplayElement.textContent = videoElement.playbackRate.toFixed(1) + 'x';
            speedDisplayElement.style.opacity = '1';

            // 0.5秒后隐藏速度显示
            setTimeout(function() {
                speedDisplayElement.style.opacity = '0';
            }, 500);
        }

        // 监听视频播放速度变化
        videoElement.addEventListener('ratechange', updateSpeedDisplay);

        // 初始化速度显示
        updateSpeedDisplay();
    }

    function simulateShiftHome() {
        // 创建一个 KeyboardEvent 对象
        var event = new KeyboardEvent('keydown', {
            shiftKey: true,
            keyCode: 36
        });

        // 触发事件
        document.dispatchEvent(event);
    }


})();