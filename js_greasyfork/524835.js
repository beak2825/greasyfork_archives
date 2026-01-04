// ==UserScript==
// @name         小红书倍速增强
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  为小红书网页端播放器增加更多倍速选项，滚动调整菜单高度，自动取消静音
// @author       zzx114
// @match        *://www.xiaohongshu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524835/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%80%8D%E9%80%9F%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/524835/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%80%8D%E9%80%9F%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待播放器加载完成
    const waitForPlayer = setInterval(() => {
        const playbackRateList = document.querySelector('xg-playbackrate ul');
        const playbackRateContainer = document.querySelector('xg-playbackrate');
        if (playbackRateList) {
            clearInterval(waitForPlayer);
            playbackRateList.style.height = 'auto'; // 或设置具体像素值
            playbackRateList.style.overflowY = 'auto'; // 超出部分显示滚动条

            // 添加新的倍速选项
            const newSpeeds = [
                { cname: '3', text: '3x' },
                { cname: '4', text: '4x' },
            ];

            // 强制覆盖父容器样式（如果有overflow限制）
            const parentStyle = playbackRateContainer.parentElement.style;
            parentStyle.overflow = 'visible'; // 确保父容器不隐藏菜单

            // 添加悬停保持显示的逻辑
            let hideTimeout;
            playbackRateContainer.addEventListener('mouseenter', () => {
                clearTimeout(hideTimeout);
                playbackRateList.style.display = 'block'; // 鼠标进入时显示
            });

            playbackRateContainer.addEventListener('mouseleave', () => {
                hideTimeout = setTimeout(() => {
                    playbackRateList.style.display = 'none'; // 鼠标离开后延迟隐藏
                }, 300);
            });

            // 点击按钮显示/隐藏菜单
            const playbackRateButton = document.querySelector('xg-playbackrate');
            if (playbackRateButton) {
                playbackRateButton.addEventListener('click', () => {
                    playbackRateList.style.display =
                        playbackRateList.style.display === 'block' ? 'none' : 'block';
                });
            }

            // 将新选项插入到列表的最前面
            newSpeeds.forEach(speed => {
                const li = document.createElement('li');
                li.setAttribute('cname', speed.cname);
                li.className = '';
                li.textContent = speed.text;
                playbackRateList.insertBefore(li, playbackRateList.firstChild);
            });

            // 更新点击事件处理
            playbackRateList.querySelectorAll('li').forEach(li => {
                li.addEventListener('click', function() {
                    // 移除所有li的selected类
                    playbackRateList.querySelectorAll('li').forEach(item => {
                        item.classList.remove('selected');
                    });
                    // 为当前点击的li添加selected类
                    this.classList.add('selected');

                    const speed = parseFloat(this.getAttribute('cname'));
                    const video = document.querySelector('video');
                    if (video) {
                        video.playbackRate = speed;
                    }
                });
            });

            // 延迟后持续检测静音键，检测到即点击一次并停止
            setTimeout(() => {
                let hasClicked = false;
                const checkInterval = setInterval(() => {
                    if (hasClicked) {
                        clearInterval(checkInterval);
                        return;
                    }
                    const muteIcon = document.querySelector('div.xgplayer-icon-muted');
                    if (muteIcon) {
                        muteIcon.click();
                        hasClicked = true;
                        clearInterval(checkInterval);
                    }
                }, 500);

                setTimeout(() => {
                    if (!hasClicked) {
                        clearInterval(checkInterval);
                    }
                }, 10000);
            }, 300);
        }
    }, 500);
})();