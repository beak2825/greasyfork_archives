// ==UserScript==
// @name         telegra.ph图片滚动浏览
// @namespace    paopjian
// @version      0.1
// @description  上下切换图片
// @author       paopjian
// @match        https://telegra.ph/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/515803/telegraph%E5%9B%BE%E7%89%87%E6%BB%9A%E5%8A%A8%E6%B5%8F%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/515803/telegraph%E5%9B%BE%E7%89%87%E6%BB%9A%E5%8A%A8%E6%B5%8F%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var scrollInterval;
    var currentIndex = 0;
    
    var running = false;

    // 创建输入框、按钮并添加样式
    var intervalInput = document.createElement('input');
    intervalInput.type = 'number';
    intervalInput.min = '1';
    intervalInput.value = '3000';
    intervalInput.style.marginRight = '10px';
    intervalInput.style.width = '50px';
    intervalInput.style.transform = 'scale(0.5)';

    var startButton = document.createElement('button');
    startButton.innerText = '开始预览';
    startButton.style.marginRight = '10px';
    startButton.style.transform = 'scale(0.5)';

    var stopButton = document.createElement('button');
    stopButton.innerText = '停止预览';
    stopButton.style.transform = 'scale(0.5)';

    var controls = document.createElement('div');
    controls.style.position = 'fixed';
    controls.style.top = '10px';
    controls.style.left = '10px';
    controls.style.zIndex = '9999';
    controls.appendChild(intervalInput);
    controls.appendChild(startButton);
    controls.appendChild(stopButton);
    document.body.appendChild(controls);
    var images = document.querySelectorAll('.figure_wrapper');
    function last() {
        if (currentIndex >= images.length) {
            currentIndex = images.length - 1;
        }
        currentIndex > 0 ? currentIndex-- : currentIndex = 0;
        var image = images[currentIndex];
        image.scrollIntoView();
    }
    function next() {
        if (currentIndex >= images.length) {
            clearInterval(scrollInterval);
            scrollInterval = null;
            currentIndex = images.length - 1;
            return;
        }
        currentIndex++;
        var image = images[currentIndex];
        image.scrollIntoView();
    }
    // 点击开始按钮后开始滚动页面显示图片
    startButton.addEventListener('click', function() {
        if(scrollInterval){clearInterval(scrollInterval);}
        intervalInput.value = parseInt(intervalInput.value)/2;
        var interval = parseInt(intervalInput.value);
        scrollInterval = setInterval(function() {
            next()
        }, interval);
        running = true;
    });

    // 点击停止按钮后停止滚动
    stopButton.addEventListener('click', function() {
        clearInterval(scrollInterval);
        intervalInput.value = 3000;
        running = false;
    });

    // 按下特定按键时执行开始预览按钮的点击事件
    document.addEventListener('keydown', function(event) {
        // q开始
        if (event.key === 'q') {
            startButton.click();
        }
        //w停止
        if (event.key === 'w') {
            if (running) {
                stopButton.click();
            } else {
                if (intervalInput.value !== '3000') {
                    intervalInput.value = '3000'
                } else {
                   last()
                }
            }
        }
        //e下一页
        if (event.key === 'e') {
            next()
        }
        //r重置
        if (event.key === 'r') {
            currentIndex = 0;
            var image = images[currentIndex];
            image.scrollIntoView();
        }
    });
})();