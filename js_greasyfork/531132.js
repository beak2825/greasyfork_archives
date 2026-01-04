// ==UserScript==
// @name         AutoReload
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  auto reload
// @author       smallsun
// @match        *://www.t00ls.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=t00ls.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531132/AutoReload.user.js
// @updateURL https://update.greasyfork.org/scripts/531132/AutoReload.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    let refreshInterval;
    const refreshTime = 1200000; // 20分钟
    const storageKey = "auto_reload_active";
 
    // 创建控制按钮
    const button = document.createElement('button');
    button.innerText = '开启自动刷新';
    button.style.position = 'fixed';
    button.style.top = '1px';
    button.style.right = '15px';
    button.style.zIndex = '9999';
    button.style.padding = '8px 20px';
    button.style.background = '#e74c3c';  // 经典红色
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px'; // 圆角
    button.style.cursor = 'pointer';
    button.style.fontSize = '12px';
    button.style.fontWeight = 'bold';
    button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    button.style.transition = 'opacity 0.5s ease, transform 0.3s ease';
    // 初始隐藏（透明）
    button.style.opacity = '0';
    button.style.pointerEvents = 'none';
 
    document.body.appendChild(button);
 
 
    // 鼠标靠近时显示按钮
    document.addEventListener('mousemove', (event) => {
        const distance = Math.sqrt(
            Math.pow(event.clientX - window.innerWidth + 50, 2) +
            Math.pow(event.clientY - 50, 2)
        );
        if (distance < 100) { // 靠近 100px 显示
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        } else {
            button.style.opacity = '0';
            button.style.pointerEvents = 'none';
        }
    });
    
    function startAutoReload() {
        refreshInterval = setInterval(() => {
            location.reload();
        }, refreshTime);
        button.innerText = '关闭自动刷新';
        button.style.background = '#2ecc71';
        button.style.transform = 'scale(1.05)';
        sessionStorage.setItem(storageKey, "true");
    }
    
    function stopAutoReload() {
        clearInterval(refreshInterval);
        refreshInterval = null;
        button.innerText = '开启自动刷新';
        button.style.background = '#e74c3c';
        button.style.transform = 'scale(1)';
        sessionStorage.setItem(storageKey, "false");
    }
    
    button.addEventListener('click', () => {
	 if (refreshInterval) {
            stopAutoReload();
        } else {
            startAutoReload();
        }

    });
    
     if (sessionStorage.getItem(storageKey) === "true") {
        startAutoReload();
    }
 
    // 添加悬停效果
    button.addEventListener('mouseover', () => {
        button.style.opacity = '0.8';
    });
 
    button.addEventListener('mouseout', () => {
        button.style.opacity = '1';
    });
})();