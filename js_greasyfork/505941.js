// ==UserScript==
// @name         芯幻自动点赞脚本
// @namespace    http://tampermonkey.net/ 
// @version      2.0
// @description  对帖子进行自动点赞
// @author       LQX
// @match        https://xhcya.com/* 
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505941/%E8%8A%AF%E5%B9%BB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/505941/%E8%8A%AF%E5%B9%BB%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Add CSS for the stylish menu
    const addStyle = (css) => {
        const style = document.createElement('style');
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.head.appendChild(style);
    };

    // Define the CSS for the menu
    const menuCSS = `
        .stylish-menu {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #333;
            color: #fff;
            border-radius: 3px;
            padding: 5px;
            cursor: pointer;
            z-index: 9999;
            font-family: Arial, sans-serif;
        }
        
        .stylish-menu:hover .menu-content {
            display: block;
        }
        
        .menu-content {
            display: none;
            position: absolute;
            right: 0;
            background: #f9f9f9;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            width: 140px; /* 修改宽度 */
        }
        
        .menu-content a {
            color: #33;
            text-decoration: none;
            display: block;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        
        .menu-content a:hover {
            background: #e9e9e9;
        }
        
        .menu-content label {
            color: #000000;
            padding: 10px;
            cursor: pointer;
        }
    `;

    // Add the CSS to the document
    addStyle(menuCSS);

    // Create the stylish menu
    const menuButton = document.createElement('div');
    menuButton.className = 'stylish-menu';
    menuButton.textContent = 'Menu';
    document.body.appendChild(menuButton);

    // Create the menu content
    const menuContent = document.createElement('div');
    menuContent.className = 'menu-content';
    menuButton.appendChild(menuContent);

    // Create the auto like toggle
    const autoLikeToggle = document.createElement('label');
    autoLikeToggle.innerHTML = '<input type="checkbox" id="autoLikeToggle"> 开启自动点赞';
    menuContent.appendChild(autoLikeToggle);

    // Load the saved setting from localStorage
    const autoLikeEnabled = localStorage.getItem('autoLikeEnabled') === 'true';
    document.getElementById('autoLikeToggle').checked = autoLikeEnabled;

    // Global variable for the interval
    let intervalId;

    // Function to auto click like
    function autoClickLike() {
        const likeButton = document.querySelector('.inn-singular__post__toolbar__item__link');
        const isLiked = likeButton && likeButton.querySelector('.poi-icon__text').textContent.includes('已赞');
        if (likeButton && !isLiked) {
            likeButton.click();
        }
    }

    // Function to try auto clicking like
    function tryAutoClickLike(retries, delay) {
        let attempts = 0;
        intervalId = setInterval(() => {
            if (attempts >= retries) {
                console.log("Reached maximum retry limit.");
                clearInterval(intervalId);
                return;
            }
            autoClickLike();
            const likeButton = document.querySelector('.inn-singular__post__toolbar__item__link');
            const isNowLiked = likeButton && likeButton.querySelector('.poi-icon__text').textContent.includes('已赞');
            if (isNowLiked) {
                console.log("Button is already liked, stopping attempts.");
                clearInterval(intervalId);
            }
            attempts++;
        }, delay);
    }

    // Event listener for the toggle
    document.getElementById('autoLikeToggle').addEventListener('change', function (event) {
        const isChecked = event.target.checked;
        localStorage.setItem('autoLikeEnabled', isChecked);
        if (isChecked) {
            console.log("Auto Like enabled.");
            intervalId = tryAutoClickLike(500, 250);
        } else {
            console.log("Auto Like disabled.");
            clearInterval(intervalId);
        }
    });

    // Start the auto click like process if enabled
    if (autoLikeEnabled) {
        intervalId = tryAutoClickLike(500, 250);
    }
})();