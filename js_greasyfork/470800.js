// ==UserScript==
// @name         動畫瘋彈幕列表隱藏、連動關閉彈幕
// @namespace    yournamespace
// @version      1.0
// @description  網站上添加按鈕來隱藏列表和關閉彈幕 反之則開啟
// @match        *://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470800/%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95%E5%88%97%E8%A1%A8%E9%9A%B1%E8%97%8F%E3%80%81%E9%80%A3%E5%8B%95%E9%97%9C%E9%96%89%E5%BD%88%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/470800/%E5%8B%95%E7%95%AB%E7%98%8B%E5%BD%88%E5%B9%95%E5%88%97%E8%A1%A8%E9%9A%B1%E8%97%8F%E3%80%81%E9%80%A3%E5%8B%95%E9%97%9C%E9%96%89%E5%BD%88%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 創建按鈕元素
    var button = document.createElement('button');
    button.className = 'refresh';
    button.style.position = 'absolute';
    button.style.top = '8px';
    button.style.left = 'calc(285px)';
    button.style.width = '44px';
    button.style.height = '44px';
    button.style.border = '1px solid var(--anime-primary-color)';
    button.style.background = 'var(--anime-primary-color)';
    button.style.color = 'rgba(var(--anime-white-rgb), 1)';
    button.style.boxShadow = '0 3px 6px -2px rgba(0, 0, 0, 0.2)';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';
    button.style.padding = '0';

    // 創建按鈕內部圖示元素
    var icon = document.createElement('i');
    icon.className = 'material-icons';
    icon.innerText = 'visibility_off';
    icon.style.fontSize = '24px';

    // 添加圖示元素到按鈕中
    button.appendChild(icon);

    // 添加按鈕到頁面的函數
    function addButtonToPage() {
        // 獲取refresh按鈕
        var refreshButton = document.querySelector('.refresh');

        // 添加按鈕到頁面
        var refreshButtonParent = refreshButton.parentNode;
        refreshButtonParent.insertBefore(button, refreshButton);
    }

    // 切換按鈕內部圖示的函數
    function toggleIcon() {
        var icon = button.querySelector('i');
        if (icon.innerText === 'visibility_off') {
            icon.innerText = 'visibility';
        } else {
            icon.innerText = 'visibility_off';
        }
    }

    // 添加按鈕點擊事件處理函數
    button.addEventListener('click', function() {
        var danmuElements = document.querySelectorAll('.sub-list-li');
        for (var i = 0; i < danmuElements.length; i++) {
            var danmuElement = danmuElements[i];
            if (danmuElement.style.display === 'none') {
                danmuElement.style.display = 'list-item';
            } else {
                danmuElement.style.display = 'none';
            }
        }

        // 切換撥放器的彈幕狀態
        var danmuToggleButton = document.getElementById('danmuToggle');
        if (danmuToggleButton) {
            danmuToggleButton.click();
        }

        // 切換按鈕內部圖示
        toggleIcon();
    });

    // 等待網頁載入完成後再執行
    window.addEventListener('load', function() {
        // 自動隱藏彈幕
        var danmuElements = document.querySelectorAll('.sub-list-li');
        for (var i = 0; i < danmuElements.length; i++) {
            var danmuElement = danmuElements[i];
            danmuElement.style.display = 'none';
        }

        // 等待撥放器載入完成後切換彈幕狀態
        var playerInterval = setInterval(function() {
            var danmuToggleButton = document.getElementById('danmuToggle');
            if (danmuToggleButton) {
                danmuToggleButton.click();
                clearInterval(playerInterval);
            }
        }, 500);

        // 添加按鈕到頁面
        addButtonToPage();
    });

    // 監聽網站載入完畢事件
    window.addEventListener('DOMContentLoaded', function() {
        // 再次執行腳本確保運作正確
        addButtonToPage();
    });
})();
