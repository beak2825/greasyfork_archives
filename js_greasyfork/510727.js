// ==UserScript==
// @name         Apple取货助手
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  在Apple结账页面自动立即展开更多取货地点，每隔4秒刷新页面。如果有货可取，播放音乐并打开新窗口。
// @match        https://*.www.apple.com.cn/shop/checkout*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510727/Apple%E5%8F%96%E8%B4%A7%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/510727/Apple%E5%8F%96%E8%B4%A7%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let refreshInterval = 4000; // 4秒
    let countdown = refreshInterval / 1000;
    let isPaused = false;
    let intervalId;
    let hasNoStock = true; // 初始状态设为无库存

    function clickShowMoreButton(button) {
        if (button && !button.classList.contains('clicked')) {
            console.log('找到"显示更多取货地点"按钮，立即点击');
            button.click();
            button.classList.add('clicked');
            observer.disconnect(); // 停止观察

            // 立即检查库存
            checkAndPlayMusic();

            // 为了确保所有元素都已加载，我们可以再次检查
            setTimeout(checkAndPlayMusic, 500); // 0.5秒后再次检查库存
        }
    }

    // 创建一个观察器实例
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                const button = document.querySelector('button.as-buttonlink.rt-storelocator-store-showmore[data-autom="show-more-stores-button"]');
                if (button) {
                    clickShowMoreButton(button);
                    return;
                }
            }
        }
    });

    // 配置观察选项
    const config = { childList: true, subtree: true };

    // 开始观察目标节点及其整个子树
    observer.observe(document.body, config);

    // 立即检查一次，以防按钮已经存在
    const existingButton = document.querySelector('button.as-buttonlink.rt-storelocator-store-showmore[data-autom="show-more-stores-button"]');
    if (existingButton) {
        clickShowMoreButton(existingButton);
    }

    // 5秒后停止观察，以防止长时间运行
    setTimeout(() => {
        observer.disconnect();
        console.log('观察已停止');
    }, 3000);

    // 创建悬浮窗
    const floatingWindow = document.createElement('div');
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.top = '10px'; // 将悬浮窗放在顶部
    floatingWindow.style.right = '10px';
    floatingWindow.style.padding = '30px'; // 增加padding
    floatingWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    floatingWindow.style.color = 'white';
    floatingWindow.style.borderRadius = '5px';
    floatingWindow.style.cursor = 'pointer';
    floatingWindow.style.zIndex = '9999'; // 确保悬浮窗在最上层
    floatingWindow.style.fontSize = '48px'; // 增加字体大小
    floatingWindow.style.width = '450px'; // 增加悬浮窗宽度
    floatingWindow.style.textAlign = 'center'; // 居中文本
    floatingWindow.innerText = `刷新倒计时: ${countdown}s`;
    document.body.appendChild(floatingWindow);

    // 刷新页面的函数
    function refreshPage() {
        if (!isPaused) {
            location.reload();
        }
    }

    function updateCountdown() {
        if (!isPaused) {
            countdown--;
            if (countdown <= 0) {
                countdown = refreshInterval / 1000;
                refreshPage();
            }
            floatingWindow.innerText = `刷新倒计时: ${countdown}s`;
        }
    }


    // 设置定时器
    intervalId = setInterval(updateCountdown, 1000);

    // 点击悬浮窗暂停/继续刷新
    floatingWindow.addEventListener('click', () => {
        isPaused = !isPaused;
        floatingWindow.style.backgroundColor = isPaused ? 'rgba(255, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        floatingWindow.innerText = isPaused ? '刷新已暂停' : `刷新倒计时: ${countdown}s`;
    });

    // 检查特定元素并播放音乐
    function checkAndPlayMusic() {
        const storeElements = document.querySelectorAll('.rt-storelocator-store-availabilityquote');
        let hasAvailableStock = false;

        for (let element of storeElements) {
            if (element.textContent.includes('可取货')) {
                hasAvailableStock = true;
                break;
            }
        }

        if (hasAvailableStock && hasNoStock) {
            // 如果之前是无库存状态，但现在有库存，播放音乐并打开新窗口
            const audio = new Audio('https://downsc.chinaz.net/Files/DownLoad/sound1/202301/y1478.mp3');
            audio.play();
            setTimeout(() => {
                audio.pause();
            }, 2000); // 播放2秒

            // 在新窗口全屏打开购买链接
            const windowFeatures = `fullscreen=yes,toolbar=no,menubar=no,scrollbars=yes,resizable=yes,location=no,directories=no,status=no`;
            const newWindow = window.open('https://secure9.www.apple.com.cn/shop/checkout?_s=Fulfillment-init', '_blank', windowFeatures);
            if (newWindow) {
                newWindow.focus(); // 将焦点给新窗口
                // 尝试最大化窗口
                newWindow.moveTo(0, 0);
                newWindow.resizeTo(screen.width, screen.height);
            }

            hasNoStock = false; // 重置无库存状态

            floatingWindow.click();
        } else if (!hasAvailableStock) {
            hasNoStock = true; // 更新无库存状态
        }
    }
})();