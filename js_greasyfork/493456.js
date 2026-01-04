// ==UserScript==
 
// @name         嗨皮漫畫 - 自動翻頁
// @name:zh-TW   嗨皮漫畫 - 自動翻頁
// @name:zh-CN   嗨皮漫畫 - 自动翻页
// @name:ja       Happy Comics - スマートフォン用の自動ページめくり
// @name:en     Happy Comics - Automatic Page Turning for Mobile
 
// @version      1.19
 
// @description         自動翻頁和觸摸控制功能。
// @description:zh-TW   自動翻頁和觸摸控制功能。
// @description:zh-CN   自動翻頁和觸摸控制功能。
// @description:ja      Happy Comics のモバイル向け自動ページめくりおよびタッチ操作を提供します。
// @description:en      Provides automatic page turning and touch control for Happy Comics mobile version.
 
// @author       Scott
 
// @match        *://m.happymh.com/reads/*
// @match        *://m.happymh.com/*
// @match        *://hihimanga.com/*

// @grant        unsafeWindow
// @grant        GM_addStyle
// @namespace https://www.youtube.com/c/ScottDoha
// @downloadURL https://update.greasyfork.org/scripts/493456/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/493456/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E8%87%AA%E5%8B%95%E7%BF%BB%E9%A0%81.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var isRunning = true; // 默認開啟自動翻頁（Default: Auto page turning enabled）
    var delayTime = 1000; // 自動翻頁延遲時間，單位：毫秒（Automatic Page Turning Delay Time, in milliseconds）

    var isTouching = true; // 默認開啟觸摸控制（Default: Touch control enabled）
    var isScrolling = false; // 滾動狀態（Scrolling state）

    var toggleRunningButton = document.createElement('button');
    toggleRunningButton.id = 'toggleRunningButton';
    toggleRunningButton.className = 'toggle-button';
    toggleRunningButton.innerText = '自動中';
    document.body.appendChild(toggleRunningButton);

    var toggleTouchingButton = document.createElement('button');
    toggleTouchingButton.id = 'toggleTouchingButton';
    toggleTouchingButton.className = 'toggle-button';
    toggleTouchingButton.innerText = '觸摸中';
    document.body.appendChild(toggleTouchingButton);

    // 按鈕點擊事件（Button click event）
    toggleRunningButton.addEventListener('click', function() {
        isRunning = !isRunning;
        toggleRunningButton.innerText = isRunning ? '自動中' : '已停止';
        toggleRunningButton.style.backgroundColor = isRunning ? '#4CAF50' : '#f44336'; // 根據開關狀態設置背景顏色（Set background color based on switch state）
        // 保存開關狀態到本地存儲（Save switch state to local storage）
        localStorage.setItem('isRunning', isRunning ? 'true' : 'false');
    });

    toggleTouchingButton.addEventListener('click', function() {
        isTouching = !isTouching;
        toggleTouchingButton.innerText = isTouching ? '觸摸中' : '已停止';
        toggleTouchingButton.style.backgroundColor = isTouching ? '#4CAF50' : '#f44336'; // 根據開關狀態設置背景顏色（Set background color based on switch state）
        // 保存開關狀態到本地存儲（Save switch state to local storage）
        localStorage.setItem('isTouching', isTouching ? 'true' : 'false');
    });

    // 從本地存儲加載開關狀態（Load switch state from local storage）
    var savedRunningState = localStorage.getItem('isRunning');
    if (savedRunningState !== null) {
        isRunning = savedRunningState === 'true';
        toggleRunningButton.innerText = isRunning ? '自動中' : '已停止';
        toggleRunningButton.style.backgroundColor = isRunning ? '#4CAF50' : '#f44336';
    }

    var savedTouchingState = localStorage.getItem('isTouching');
    if (savedTouchingState !== null) {
        isTouching = savedTouchingState === 'true';
        toggleTouchingButton.innerText = isTouching ? '觸摸中' : '已停止';
        toggleTouchingButton.style.backgroundColor = isTouching ? '#4CAF50' : '#f44336';
    }

    var lastTouchTime = 0;
    var touchCount = 0;
    var touchResetTimeout; // 用於延遲重置 touchCount 的定時器（Used to delay reset of touchCount）

    document.addEventListener('touchstart', function(event) {
        if (!isTouching || isScrolling) return;

        var currentTime = new Date().getTime();
        var timeDiff = currentTime - lastTouchTime;

        clearTimeout(touchResetTimeout); // 清除之前的重置定時器（Clear previous reset timer）

        if (timeDiff < 500) {
            touchCount++;
            console.log('連續點擊次數:', touchCount); // 輸出累計連續點擊次數（Output cumulative continuous click count）
            if (touchCount === 3) {
                var nextChapterButton = document.querySelector('.MuiButton-containedPrimary');
                if (nextChapterButton && isRunning) {
                    nextChapterButton.removeAttribute('aria-disabled');
                    setTimeout(function() {
                        nextChapterButton.click();
                    }, delayTime); // 延時點擊翻頁按鈕（Delay clicking page turning button）
                }
            } else if (touchCount === 4) {
                window.history.back();
            }
        } else {
            touchCount = 1;
        }

        lastTouchTime = currentTime;

        // 設置延遲重置定時器（Set delay reset timer）
        touchResetTimeout = setTimeout(function() {
            touchCount = 0;
        }, 1000); // 在一秒後重置 touchCount（Reset touchCount after one second）
    });

    document.addEventListener('touchend', function(event) {
        // 不需要在這里設置 isTouching 為 false（No need to set isTouching to false here）
    });

    window.addEventListener('scroll', function() {
        // 監聽滾動事件，當頁面正在滾動時設置 isScrolling 為 true，否則設置為 false
        isScrolling = true;
        clearTimeout(touchResetTimeout); // 清除重置定時器，防止誤觸
        setTimeout(function() {
            isScrolling = false;
        }, 250); // 在滾動停止 250 毫秒後設置 isScrolling 為 false
    });

    // 如果自動翻頁功能已啟用（isRunning 為 true），且滾動到頁面底部，則觸發自動翻頁操作
    function checkAutoPageTurning() {
        if (isRunning) {
            var endMarker = document.querySelector('.css-1dzg0br-bottomScan'); // 結束標記元素
            if (endMarker) {
                var markerRect = endMarker.getBoundingClientRect();
                var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

                // 檢查是否滾動到特定元素位置
                if (markerRect.top <= viewportHeight) {
                    var nextChapterButton = document.querySelector('.MuiButton-containedPrimary');
                    if (nextChapterButton) {
                        nextChapterButton.removeAttribute('aria-disabled'); // 移除禁用屬性
                        setTimeout(function() {
                            nextChapterButton.click();
                        }, delayTime); // 延時點擊翻頁按鈕（Delay clicking page turning button）
                    }
                }
            }
        }
    }

    window.addEventListener('scroll', checkAutoPageTurning); // 添加滾動事件監聽器

    // 頁面加載完成後檢查一次自動翻頁
    checkAutoPageTurning();
})();

// CSS 樣式（CSS style）
var css = `
.toggle-button {
    position: fixed;
    z-index: 9999;
    opacity: 0.5;
    transition: all 0.3s ease;
    transform: translateX(0);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    outline: none;
}

#toggleRunningButton {
    color: white;
    right: 0;
    bottom: 20px;
    background-color: #4CAF50; // 默認背景顏色為綠色（Default background color is green）
}

#toggleTouchingButton {
    color: white;
    right: 0;
    bottom: 50px;
    background-color: #4CAF50; // 默認背景顏色為綠色（Default background color is green）
}
`;
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);