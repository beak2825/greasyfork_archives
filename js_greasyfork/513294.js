// ==UserScript==
// @name         Temu已抢到发货台提醒
// @namespace    http://tampermonkey.net/
// @version      1.36
// @description  自动检测发货台内是否有商品
// @author       Lemon Allen
// @match        https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk
// @match        http://lemonlineo.top:54344/d/DS918/%E5%AA%92%E4%BD%93/music/%E7%9F%A5%E6%9B%B4%E9%B8%9F%2CHOYO-MiX%2CChevy%20-%20%E5%9C%A8%E9%93%B6%E6%B2%B3%E4%B8%AD%E5%AD%A4%E7%8B%AC%E6%91%87%E6%91%86.mp3?sign=fGy6EjznUx3sHaAFBHXkwxqD-FUsAjRXLeWnpmD1ggk=:0
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513294/Temu%E5%B7%B2%E6%8A%A2%E5%88%B0%E5%8F%91%E8%B4%A7%E5%8F%B0%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/513294/Temu%E5%B7%B2%E6%8A%A2%E5%88%B0%E5%8F%91%E8%B4%A7%E5%8F%B0%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false; // 标志变量，判断脚本是否在运行
    let intervalId = null; // 用于存储setInterval的ID
    let isDetecting = false; // 标志变量，判断是否正在检测目标
    let isPageVisible = true; // 标志变量，判断页面是否可见

    // 跳转到音频链接
    function playBeep() {
        // 清除所有定时器
        clearInterval(intervalId);
        isDetecting = false;
        isRunning = false;
        saveStatus(); // 保存状态

        // 跳转到音频链接
        window.location.href = "http://lemonlineo.top:54344/d/DS918/%E5%AA%92%E4%BD%93/music/%E7%9F%A5%E6%9B%B4%E9%B8%9F%2CHOYO-MiX%2CChevy%20-%20%E5%9C%A8%E9%93%B6%E6%B2%B3%E4%B8%AD%E5%AD%A4%E7%8B%AC%E6%91%87%E6%91%86.mp3?sign=fGy6EjznUx3sHaAFBHXkwxqD-FUsAjRXLeWnpmD1ggk=:0";
    }

    // 刷新音频页面
    function refreshAudioPage() {
        if (window.location.href.includes("lemonlineo.top")) {
            setInterval(() => {
                location.reload();
            }, 166000); // 2分46秒（166秒）
        }
    }

    // 检测函数
    function checkForDataInDiv() {
        if (!isDetecting) return; // 如果停止检测，退出函数

        // 查找所有包含 "img" 字符的 div 标签
        const imgDivElements = Array.from(document.querySelectorAll('div')).filter(div => {
            return div.className.includes('img'); // 检查类名中是否包含 "img"
        });

        // 过滤出宽度为 60 像素的 div
        const validImages = imgDivElements.filter(div => {
            const width = parseFloat(window.getComputedStyle(div).width);
            return width === 60; // 过滤宽度为60像素的div
        });

        if (validImages.length > 0) {
            console.log('检测到符合条件的div，跳转到音频链接');
            validImages.forEach(div => {
                console.log(`符合条件的div宽度: ${window.getComputedStyle(div).width}`);
            });
            playBeep(); // 跳转到音频链接
            return; // 跳转后退出函数
        }

        console.log('未找到满足条件的div，继续检查');
    }

    // 启动脚本
    function startScript() {
        // 每5秒刷新页面
        intervalId = setInterval(function() {
            if (isRunning && isPageVisible) {
                location.reload();
            }
        }, 5000);

        // 每1秒检查一次是否目标中有图片
        isDetecting = true;
        setInterval(checkForDataInDiv, 1000);
        isRunning = true;
        saveStatus(); // 保存状态
    }

    // 停止脚本
    function stopScript() {
        clearInterval(intervalId);
        isDetecting = false; // 停止检测
        isRunning = false;
        saveStatus(); // 保存状态
    }

    // 启动或停止脚本的函数
    function toggleScript() {
        if (isRunning) {
            stopScript();
            button.innerHTML = '启动检测'; // 更新按钮文本
            button.style.backgroundColor = '#4CAF50'; // 改为绿色表示未运行
        } else {
            startScript();
            button.innerHTML = '停止检测'; // 更新按钮文本
            button.style.backgroundColor = '#f44336'; // 改为红色表示正在运行
        }
    }

    // 从localStorage中读取脚本运行状态
    function loadStatus() {
        const status = localStorage.getItem('scriptRunning');
        console.log('加载状态:', status); // 调试信息
        if (status === 'true') {
            isRunning = true;
            button.innerHTML = '停止检测';
            button.style.backgroundColor = '#f44336'; // 改为红色表示正在运行
            startScript();
        } else {
            button.innerHTML = '启动检测';
            button.style.backgroundColor = '#4CAF50'; // 改为绿色表示未运行
        }
    }

    // 保存脚本运行状态到localStorage
    function saveStatus() {
        localStorage.setItem('scriptRunning', isRunning);
        console.log('保存状态:', isRunning); // 调试信息
    }

    // 创建启动/停止按钮
    const button = document.createElement('button');
    button.innerHTML = '启动检测';
    button.style.position = 'absolute';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999'; // 确保按钮可见

    // 查找“创建发货单”按钮并放置新按钮
    function placeButton() {
        // 只在指定的页面显示按钮
        if (window.location.href !== 'https://seller.kuajingmaihuo.com/main/order-manager/shipping-desk') {
            if (document.body.contains(button)) {
                document.body.removeChild(button); // 如果不在指定页面，移除按钮
            }
            return;
        }

        const buttons = Array.from(document.querySelectorAll('button')); // 获取所有按钮
        const targetButton = buttons.find(btn => btn.textContent.includes("创建发货单"));

        if (targetButton) {
            const rect = targetButton.getBoundingClientRect();
            button.style.top = (window.scrollY + rect.top - 50) + 'px'; // 在目标按钮上方50px的位置
            button.style.left = (window.scrollX + rect.left) + 'px'; // 对齐左侧
            if (!document.body.contains(button)) {
                document.body.appendChild(button);
            }
            console.log('按钮已放置在:', button.style.top, button.style.left);
        } else {
            console.log('未找到“创建发货单”按钮');
        }
    }

    // 页面加载时放置按钮并加载状态
    window.addEventListener('load', function() {
        setTimeout(placeButton, 100); // 等待100毫秒后再放置按钮
        loadStatus(); // 加载之前保存的状态
    });

    // 页面内容变动时重新放置按钮
    const observer = new MutationObserver(placeButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // 按钮点击事件，启动/停止检测
    button.addEventListener('click', toggleScript);

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        isPageVisible = !document.hidden;
        console.log('页面可见性变化:', isPageVisible);
    });

    // 刷新音频页面
    refreshAudioPage();

})();
