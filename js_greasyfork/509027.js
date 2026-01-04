// ==UserScript==
// @name         柠檬文才学堂倍速看课(免费/无广告/无收费/无微信公众号)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  内置跳转修复(需自行打开播放选择中的设置)与保证失去焦点时页面的持续运行,解锁拖拉进度条(不计分),x2.5倍速以上不计分!所以建议2.5倍速挂着就行了!
// @author       You
// @match        https://www.wencaischool.net/openlearning/*
// @icon         https://www.wencaischool.net/openlearning/favicon.ico
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT Festival Variant
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509027/%E6%9F%A0%E6%AA%AC%E6%96%87%E6%89%8D%E5%AD%A6%E5%A0%82%E5%80%8D%E9%80%9F%E7%9C%8B%E8%AF%BE%28%E5%85%8D%E8%B4%B9%E6%97%A0%E5%B9%BF%E5%91%8A%E6%97%A0%E6%94%B6%E8%B4%B9%E6%97%A0%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509027/%E6%9F%A0%E6%AA%AC%E6%96%87%E6%89%8D%E5%AD%A6%E5%A0%82%E5%80%8D%E9%80%9F%E7%9C%8B%E8%AF%BE%28%E5%85%8D%E8%B4%B9%E6%97%A0%E5%B9%BF%E5%91%8A%E6%97%A0%E6%94%B6%E8%B4%B9%E6%97%A0%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%29.meta.js
// ==/UserScript==
(function() {
    'use strict';


    // 覆盖 document.hidden 属性
    Object.defineProperty(document, 'hidden', {
        configurable: true,
        enumerable: true,
        get: function() { return false; }
    });

    // 覆盖 document.visibilityState 属性
    Object.defineProperty(document, 'visibilityState', {
        configurable: true,
        enumerable: true,
        get: function() { return 'visible'; }
    });

    // 阻止页面焦点事件的默认行为
    window.addEventListener('blur', function(e) {
        e.stopImmediatePropagation();
    }, true);

    window.addEventListener('focus', function(e) {
        e.stopImmediatePropagation();
    }, true);

    // 添加下拉框以控制视频播放速度
    function addSpeedControlDropdown(videoElements) {
        if (videoElements.length === 0) return;

        const dropdown = document.createElement('select');
        dropdown.setAttribute('id', 'speedControlDropdown');
        dropdown.style.position = 'fixed';
        dropdown.style.top = '50px';
        dropdown.style.right = '10px';
        dropdown.style.zIndex = '9999';

        // 添加播放速度选项
        [1, 1.5, 2, 2.5, 3, 3.5, 4].forEach(speed => {
            const speedOption = document.createElement('option');
            speedOption.text = `x${speed.toFixed(1)}`;
            speedOption.value = speed;
            dropdown.add(speedOption);
        });

        dropdown.addEventListener('change', function() {
            const selectedSpeed = parseFloat(this.value);
            videoElements.forEach(video => {
                video.playbackRate = selectedSpeed;
            });
        });

        document.body.appendChild(dropdown);
    }

    // 启用视频进度条的拖动功能
    function enableVideoProgressBarDragging(videoElements) {
        videoElements.forEach(video => {
            const progress = video.parentElement.querySelector('.vjs-progress-holder');
            if (progress) {
                progress.style.pointerEvents = 'auto';
            }
        });
    }

    // 默认将视频静音
    function muteVideoDefault(videoElements) {
        videoElements.forEach(video => {
            video.muted = true;
        });
    }

    // 页面加载完成时调用函数
    window.addEventListener('load', function() {
        const videoElements = document.querySelectorAll('video.vjs-tech');
        addSpeedControlDropdown(videoElements);
        enableVideoProgressBarDragging(videoElements);
        muteVideoDefault(videoElements);

        // 添加视频播放完成事件监听器
        videoElements.forEach(video => {

              video.addEventListener('play', () => {
                const dropdown = document.getElementById('speedControlDropdown');
                if (dropdown) {
                    const selectedSpeed = parseFloat(dropdown.value);
                    video.playbackRate = selectedSpeed;
                }
            });


            video.addEventListener('ended', () => {
                // 视频播放完成时触发
                console.log('视频播放完成');

                // 获取所有具有类名为'childSection'的li元素
                const childSections = document.querySelectorAll('li.childSection');
                // 遍历每个li元素，检查是否包含'active'类
                childSections.forEach(section => {
                    if (section.classList.contains('active')) {
                        // 如果包含'active'类，则表示该元素被选中

                        // 单击被选中的<li>元素对象
                        section.click();
                        return;
                    }
                });
            });
        });
    });

})();