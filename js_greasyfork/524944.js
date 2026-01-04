// ==UserScript==
// @name         秒过2025年智慧中小学寒假教师研修，按钮控制。
// @namespace    http://tampermonkey.net/
// @version      0.06
// @author       hydrachs
// @description  通过按钮控制2025年智慧中小学寒假教师研修秒学。
// @license MIT
// @match        https://basic.smartedu.cn/*
// @match        https://www.smartedu.cn/*
// @match        https://teacher.vocational.smartedu.cn/*
// @match        https://core.teacher.vocational.smartedu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/524944/%E7%A7%92%E8%BF%872025%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E6%8C%89%E9%92%AE%E6%8E%A7%E5%88%B6%E3%80%82.user.js
// @updateURL https://update.greasyfork.org/scripts/524944/%E7%A7%92%E8%BF%872025%E5%B9%B4%E6%99%BA%E6%85%A7%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%EF%BC%8C%E6%8C%89%E9%92%AE%E6%8E%A7%E5%88%B6%E3%80%82.meta.js
// ==/UserScript==

(function() {
    // 移除弹窗
    function removePopup() {
        var popup = document.querySelector('.fish-modal-confirm-btns');
        if (popup) {
            popup.parentNode.removeChild(popup);
        }
    }

    // 移除新弹窗
    function removeNewPopup() {
        var newPopup = document.querySelector('.fish-modal-content');
        if (newPopup) {
            newPopup.parentNode.removeChild(newPopup);
        }
    }

    // 跳过视频
    function skipVideo() {
        let video = document.querySelector('video');
        if (video) {
            video.muted = true;
            video.play();
            video.pause();
            video.currentTime = video.duration;
            video.play();
            setTimeout(() => {}, 700);
            video.currentTime = video.duration - 3;
            video.play();
            video.currentTime = video.duration - 5;
            video.play();
        }
    }

    let clickTimer = null; // 用于存储定时器ID

    // 创建控制按钮
    function createControlButtons() {
        // 检查是否已经存在按钮，避免重复添加
        if (document.getElementById('autoClickStartButton')) {
            return;
        }

        // 创建启动按钮
        const startButton = document.createElement('button');
        startButton.id = 'autoClickStartButton';
        startButton.textContent = '启动自动点击';
        startButton.style.position = 'fixed';
        startButton.style.top = '50%'; // 垂直居中
        startButton.style.left = '10px'; // 左侧
        startButton.style.transform = 'translateY(-50%)'; // 确保垂直居中
        startButton.style.zIndex = 10000; // 提高z-index
        startButton.style.padding = '10px';
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = 'white';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';

        // 创建停止按钮
        const stopButton = document.createElement('button');
        stopButton.id = 'autoClickStopButton';
        stopButton.textContent = '停止自动点击';
        stopButton.style.position = 'fixed';
        stopButton.style.top = 'calc(50% + 50px)'; // 放在启动按钮下方
        stopButton.style.left = '10px'; // 左侧
        stopButton.style.transform = 'translateY(-50%)'; // 确保垂直居中
        stopButton.style.zIndex = 10000; // 提高z-index
        stopButton.style.padding = '10px';
        stopButton.style.backgroundColor = '#f44336';
        stopButton.style.color = 'white';
        stopButton.style.border = 'none';
        stopButton.style.borderRadius = '5px';
        stopButton.style.cursor = 'pointer';

        // 启动按钮点击事件
        startButton.addEventListener('click', () => {
            if (clickTimer) {
                clearInterval(clickTimer); // 清除已有的定时器
            }
            clickTimer = setInterval(() => {
                skipVideo(); // 每隔200毫秒执行一次跳过操作
            }, 500);
        });

        // 停止按钮点击事件
        stopButton.addEventListener('click', () => {
            if (clickTimer) {
                clearInterval(clickTimer); // 清除定时器
                clickTimer = null; // 重置定时器ID
            }
        });

        // 将按钮添加到页面
        document.body.appendChild(startButton);
        document.body.appendChild(stopButton);
    }

    // 监听页面变化，动态添加按钮
    function observePageChanges() {
        const observer = new MutationObserver(() => {
            createControlButtons(); // 每次DOM变化时尝试创建按钮
        });

        // 监听整个文档的变化
        observer.observe(document.body, {
            childList: true, // 监听子节点的变化
            subtree: true, // 监听所有后代节点
        });
    }

    // 页面加载完成后执行
    function init() {
        removePopup();
        removeNewPopup();
        createControlButtons(); // 尝试创建按钮
        observePageChanges(); // 监听页面变化，确保按钮在动态加载时也能显示
    }

    // 延迟初始化，确保页面完全加载
    setTimeout(init, 2000); // 延迟2秒执行，确保页面内容加载完成
})();