// ==UserScript==
// @name         QianKunWeiMa之力（水源论坛定制化点赞工具）
// @namespace    http://tampermonkey.net/
// @version      1.0beta（适用于手机端）
// @description  Like posts for specific users or floors, just like bro QKWM
// @author       Sinsimito
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516225/QianKunWeiMa%E4%B9%8B%E5%8A%9B%EF%BC%88%E6%B0%B4%E6%BA%90%E8%AE%BA%E5%9D%9B%E5%AE%9A%E5%88%B6%E5%8C%96%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/516225/QianKunWeiMa%E4%B9%8B%E5%8A%9B%EF%BC%88%E6%B0%B4%E6%BA%90%E8%AE%BA%E5%9D%9B%E5%AE%9A%E5%88%B6%E5%8C%96%E7%82%B9%E8%B5%9E%E5%B7%A5%E5%85%B7%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isLiking = false; // 控制点赞操作的开关
    let likeInterval = null; // 用于保存定时器ID

     const createUI = () => {
        const style = document.createElement('style');
        style.textContent = `
            #settingsContainer {
                position: fixed;
                top: 10px;
                left: 10px;
                width: 90%;
                max-width: 300px;
                z-index: 9999;
                background-color: #f8f8f8;
                padding: 10px;
                border-radius: 8px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                overflow: auto;
                user-select: none;
                cursor: move;
            }
            #dragHandle {
                font-size: 16px;
                font-weight: bold;
                text-align: center;
                cursor: move;
                margin-bottom: 10px;
            }
            #likeButton {
                width: 100%;
                padding: 10px;
                font-size: 16px;
                cursor: pointer;
            }
            input[type="text"], input[type="number"] {
                width: 100%;
                padding: 8px;
                margin-bottom: 10px;
                font-size: 14px;
                box-sizing: border-box;
            }
            @media (max-width: 768px) {
                #settingsContainer {
                    width: 100%;
                    left: 0;
                    border-radius: 0;
                }
            }
        `;
        document.head.appendChild(style);

        const settingsContainer = document.createElement('div');
        settingsContainer.id = 'settingsContainer';
        settingsContainer.innerHTML = `
            <div id="dragHandle">☰ Drag here</div>
            <label for="usernameFilter">用户名:</label>
            <input type="text" id="usernameFilter" placeholder="输入用户名">

            <label for="floorFromFilter">起始楼层:</label>
            <input type="number" id="floorFromFilter" placeholder="输入起始楼层" min="0">

            <label for="floorToFilter">结束楼层:</label>
            <input type="number" id="floorToFilter" placeholder="输入结束楼层" min="0">

            <button id="likeButton">开始点赞</button>
        `;
        document.body.appendChild(settingsContainer);
    };

    // 使UI可拖动
    const makeDraggable = () => {
        const dragHandle = document.getElementById('dragHandle');
        let active = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        const dragElement = document.getElementById('settingsContainer');

        dragHandle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            initialX = e.touches[0].clientX - dragElement.getBoundingClientRect().left;
            initialY = e.touches[0].clientY - dragElement.getBoundingClientRect().top;
            currentX = initialX;
            currentY = initialY;
            active = true;
        }, false);

        document.addEventListener('touchmove', (e) => {
            if (active) {
                e.preventDefault();
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
                dragElement.style.left = `${currentX}px`;
                dragElement.style.top = `${currentY}px`;
            }
        }, false);

        document.addEventListener('touchend', () => {
            active = false;
        }, false);
    };


    // 点赞所有符合条件的帖子
   const likeAll = () => {
        const posts = document.querySelectorAll('article'); // 获取所有文章元素
        posts.forEach(el => {
            // 尝试从文章元素中获取楼层号和用户名
           const fullNameElement = el.querySelector('.full-name a');
            const username = fullNameElement ? fullNameElement.textContent.trim() : '';

            const usernameFilter = document.getElementById('usernameFilter').value;
            const floorFromFilter = parseInt(document.getElementById('floorFromFilter').value, 10);
            const floorToFilter = parseInt(document.getElementById('floorToFilter').value, 10);
            const postId = el.getAttribute('id').split('_')[1]; // 获取楼层号
            const floor = postId ? parseInt(postId, 10) : null;

            // 检查用户名是否符合条件
            if (usernameFilter && username !== usernameFilter) {
                return; // 不符合用户名则跳过
            }

            // 检查楼层是否符合范围
            if (!isNaN(floor) && ((isNaN(floorFromFilter) || floor >= floorFromFilter) &&
                (isNaN(floorToFilter) || floor <= floorToFilter))) {
                // 点赞操作
                const likeButton = el.querySelector('.toggle-like');
                if (likeButton && !likeButton.classList.contains('has-like')) {
                    likeButton.click();
                }
            }
        });
    };

    // 观察DOM变化
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'ARTICLE') {
                    likeAll(); // 当检测到新节点时，重新执行likeAll函数
                }
            });
        });
    });

    observer.observe(document.body, { subtree: true, childList: true });

    // 添加事件监听器
    const addEventListeners = () => {
        document.getElementById('likeButton').addEventListener('click', () => {
            if (!isLiking) {
                isLiking = true;
                likeAll(); // 开始点赞
                likeInterval = setInterval(likeAll, 1000); // 每隔1秒检查一次新帖子
                document.getElementById('likeButton').textContent = '停止点赞';
            } else {
                isLiking = false;
                clearInterval(likeInterval); // 停止点赞
                document.getElementById('likeButton').textContent = '开始点赞';
            }
        });
    };

    // 确保在页面加载完成后执行
    window.onload = () => {
        createUI();
        makeDraggable();
        addEventListeners();
    };
})();