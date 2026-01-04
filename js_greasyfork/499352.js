// ==UserScript==
// @name         bili尺寸切换/自动连播
// @namespace    http://tampermonkey.net/
// @version      2024-07-20
// @description  3为4:3 4为16:9 实际是从第一行到第二行按顺序从0排列
// @author       Rainsc
// @match        https://www.bilibili.com/video/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499352/bili%E5%B0%BA%E5%AF%B8%E5%88%87%E6%8D%A2%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/499352/bili%E5%B0%BA%E5%AF%B8%E5%88%87%E6%8D%A2%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isRunning = false;
    let queryValue = '';
    let subtitleIntervalId = null;

    // 创建悬浮窗
    function createFloatingWindow() {
        const floatingWindow = document.createElement('div');
        floatingWindow.id = 'floating-window';
        floatingWindow.style.position = 'fixed';
        floatingWindow.style.top = '50%';
        floatingWindow.style.left = '0';
        floatingWindow.style.transform = 'translateY(-50%)';
        floatingWindow.style.padding = '10px';
        floatingWindow.style.zIndex = '9999';
        floatingWindow.style.background = '#ffffff';
        floatingWindow.style.border = '1px solid #cccccc';
        floatingWindow.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

        document.body.appendChild(floatingWindow);

        // 创建单选框组
        const autoplayGroup = document.createElement('div');
        autoplayGroup.style.marginBottom = '10px';
        autoplayGroup.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>是否连播</strong></div>
            <label><input type="radio" name="autoplay" id="autoplay-0" value="0" checked="checked"> 开启</label>
            <label><input type="radio" name="autoplay" id="autoplay-1" value="1"> 关闭</label>
        `;
        floatingWindow.appendChild(autoplayGroup);

        const sizeGroup = document.createElement('div');
        sizeGroup.style.marginBottom = '10px';
        sizeGroup.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>尺寸</strong></div>
            <label><input type="radio" name="size" id="size-2" value="2"> 自动</label>
            <label><input type="radio" name="size" id="size-3" value="3"> 4:3</label>
            <label><input type="radio" name="size" id="size-4" value="4" checked="checked"> 16:9</label>
        `;
        floatingWindow.appendChild(sizeGroup);

        // 创建字幕复选框
        const subtitleGroup = document.createElement('div');
        subtitleGroup.style.marginBottom = '10px';
        subtitleGroup.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>字幕</strong></div>
            <label><input type="checkbox" id="subtitle-checkbox" checked="checked"> 开启</label>
        `;
        floatingWindow.appendChild(subtitleGroup);

        // 创建全屏复选框
        const fullscreenGroup = document.createElement('div');
        fullscreenGroup.style.marginBottom = '10px';
        fullscreenGroup.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>全屏</strong></div>
            <label><input type="checkbox" id="fullscreen-checkbox" checked="checked"> 开启</label>
        `;
        floatingWindow.appendChild(fullscreenGroup);

        // 创建播放速度复选框组
        const speedGroup = document.createElement('div');
        speedGroup.style.marginBottom = '10px';
        speedGroup.innerHTML = `
            <div style="margin-bottom: 5px;"><strong>播放速度</strong></div>
            <label><input type="radio" name="speed" value="1"> 1x</label>
            <label><input type="radio" name="speed" value="1.25" checked="checked"> 1.25x</label>
            <label><input type="radio" name="speed" value="1.5"> 1.5x</label>
            <label><input type="radio" name="speed" value="2"> 2x</label>
        `;
        floatingWindow.appendChild(speedGroup);

        // 创建按钮
        const button = document.createElement('button');
        button.textContent = '设置选项';
        button.style.display = 'block';
        button.style.margin = '0 auto';
        button.addEventListener('click', handleButtonClick);

        floatingWindow.appendChild(button);

        // 创建状态提示
        const status = document.createElement('div');
        status.id = 'script-status';
        status.textContent = '脚本未运行';
        status.style.marginTop = '10px';
        status.style.textAlign = 'center';

        floatingWindow.appendChild(status);

        // 创建隐藏/显示悬浮窗的按钮
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-button';
        toggleButton.textContent = '隐藏/显示面板';
        toggleButton.style.position = 'fixed';
        toggleButton.style.top = '10px';
        toggleButton.style.left = '10px';
        toggleButton.style.zIndex = '10000';
        toggleButton.addEventListener('click', toggleFloatingWindow);

        document.body.appendChild(toggleButton);
    }

    // 切换悬浮窗的可见性
    function toggleFloatingWindow() {
        const floatingWindow = document.getElementById('floating-window');
        if (floatingWindow.style.display === 'none') {
            floatingWindow.style.display = 'block';
        } else {
            floatingWindow.style.display = 'none';
        }
    }

    // 处理按钮点击事件
    function handleButtonClick() {
        const status = document.getElementById('script-status');

        if (isRunning) {
            alert('脚本正在运行中，请稍候...');
            return;
        }

        // 获取单选框和复选框的选择状态
        const autoplayRadios = document.getElementsByName('autoplay');
        const sizeRadios = document.getElementsByName('size');
        const subtitleCheckbox = document.getElementById('subtitle-checkbox');
        const fullscreenCheckbox = document.getElementById('fullscreen-checkbox');
        const speedRadios = document.getElementsByName('speed');

        const selectedAutoplay = Array.from(autoplayRadios).find(radio => radio.checked);
        const selectedSize = Array.from(sizeRadios).find(radio => radio.checked);
        const selectedSpeed = Array.from(speedRadios).find(radio => radio.checked);

        // 因为前两个实际上属于一个数组  所以只能判断前两个同时选择
        if (!selectedAutoplay || !selectedSize) {
            alert('请同时选择一个连播选项和一个尺寸选项');
            return;
        }

        const selectedAutoplayValue = selectedAutoplay.value;
        const selectedSizeValue = selectedSize.value;
        const selectedSpeedValue = selectedSpeed ? selectedSpeed.value : '1';
        const isSubtitleEnabled = subtitleCheckbox.checked;
        const isFullscreenEnabled = fullscreenCheckbox.checked;

        isRunning = true;

        // 更新状态提示
        status.textContent = '脚本正在运行...';

        const intervalId = setInterval(() => {
            const elements = document.getElementsByClassName('bui-radio-input');
            if (elements.length > 4) {
                elements[selectedAutoplayValue].click();
                elements[selectedSizeValue].click();

                // 打印日志：点击了选中的元素
                console.log(`Clicked elements: autoplay - ${selectedAutoplayValue}, size - ${selectedSizeValue}`, elements[selectedAutoplayValue], elements[selectedSizeValue]);

                // 成功后停止定时器并更新状态提示
                clearInterval(intervalId);
                status.textContent = '脚本已成功设置目标元素';
                isRunning = false;

                // 打印日志：脚本成功设置目标元素
                console.log('脚本成功设置目标元素');
            } else {
                // 如果找不到足够的元素，清除 interval 并更新状态提示
                clearInterval(intervalId);
                status.textContent = '脚本停止运行（找不到足够的元素）';
                isRunning = false;

                // 打印日志：找不到足够的元素
                console.log('找不到足够的元素，停止脚本运行');
            }
        }, 100);

        // 处理播放速度
        if (selectedSpeedValue !== '1') {
            setTimeout(() => {
                const videoElement = document.querySelector('video');
                if (videoElement) {
                    videoElement.playbackRate = parseFloat(selectedSpeedValue);
                    console.log(`播放速度设置为${selectedSpeedValue}x`);
                }
            }, 1000);
        }

        // 处理字幕
        if (isSubtitleEnabled) {
            if (subtitleIntervalId) clearInterval(subtitleIntervalId);

            subtitleIntervalId = setInterval(function() {
                // 获取URL中的查询字符串部分
                const queryString = window.location.search;
                // 解析查询字符串，将参数以对象的形式存储
                const params = new URLSearchParams(queryString);
                // 获取特定参数的值
                const value = params.get('p');
                if (queryValue !== value) {
                    openSubtitle();
                    queryValue = value;
                }
            }, 2000);

            window.addEventListener('unload', function(_event) {
                clearInterval(subtitleIntervalId);
            });

            function openSubtitle(){
                setTimeout(() => {
                    const subtitleButton = document.querySelector('.bpx-player-ctrl-btn[aria-label="字幕"] .bpx-common-svg-icon');
                    if (subtitleButton) subtitleButton.click();
                }, 1000);
            }

            openSubtitle();  // 确保在启动时立即打开字幕
        } else {
            if (subtitleIntervalId) {
                clearInterval(subtitleIntervalId);
                subtitleIntervalId = null;
            }
        }

        // 处理全屏
        if (isFullscreenEnabled) {
            setTimeout(() => {
                const fullscreenButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-full');
                if (fullscreenButton) {
                    fullscreenButton.click();
                    console.log('全屏模式已开启');
                }
            }, 1000);
        }
    }

    // 初始化脚本，调用创建悬浮窗的函数
    createFloatingWindow();

    // 在页面加载完成后延迟10秒触发一次脚本执行
    //    window.onload = function() {
    //        setTimeout(function() {
    //            handleButtonClick();
    //        }, 10000); // 10秒延迟
    //    };

})();
