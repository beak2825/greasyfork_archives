// ==UserScript==
// @name         FSM 猜你喜欢全屏图片快捷查看
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  为FSM推荐项目添加全屏图片审核界面，支持图片拖动和链接跳转
// @author       You
// @match        https://fsm.name/Recommend*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528766/FSM%20%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%E5%85%A8%E5%B1%8F%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528766/FSM%20%E7%8C%9C%E4%BD%A0%E5%96%9C%E6%AC%A2%E5%85%A8%E5%B1%8F%E5%9B%BE%E7%89%87%E5%BF%AB%E6%8D%B7%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
        .review-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
        }

        .review-header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            color: white;
        }

        .review-close {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 10px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.3s;
        }

        .review-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .review-info {
            color: white;
            text-align: center;
            font-size: 16px;
        }

        .review-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: calc(100vh - 150px);
            margin: 10px 0;
            overflow: hidden;
        }

        .review-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            border-radius: 8px;
            cursor: grab;
            transition: transform 0.3s ease;
        }

        .review-image.zoomed {
            max-width: none;
            max-height: none;
            transform: scale(1.5);
            cursor: grabbing;
        }

        .image-container {
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: auto;
            width: 100%;
            height: 100%;
            position: relative;
        }

        .review-title {
            color: white;
            margin-top: 15px;
            text-align: center;
            font-size: 16px;
            max-width: 800px;
            cursor: pointer;
            text-decoration: underline;
            transition: color 0.2s;
        }

        .review-title:hover {
            color: #2196F3;
        }

        .review-actions {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }

        .review-button {
            padding: 12px 24px;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: transform 0.2s;
        }

        .review-button:hover {
            transform: scale(1.05);
        }

        .review-favorite {
            background: #4CAF50;
            color: white;
        }

        .review-skip {
            background: #2196F3;
            color: white;
        }

        .review-dislike {
            background: #F44336;
            color: white;
        }

        .trigger-button {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9998;
            padding: 10px 20px;
            background: #2196F3;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: transform 0.2s;
        }

        .trigger-button:hover {
            transform: scale(1.05);
        }

        .itemSolved {
            opacity: 0.5;
        }
    `;
    document.head.appendChild(style);

    // 全局变量
    let currentKeyHandler = null;

    function createReviewInterface() {
        let currentIndex = 0;
        let isZoomed = false;

        // 获取所有图片元素
        const items = Array.from(document.querySelectorAll('.img-blk.recommend-blk')).map(item => {
            const img = item.querySelector('.lazy__img');
            const link = item.querySelector('a[href*="/Torrents/details"]');
            return {
                img: img.src,
                tid: link.href.split('tid=')[1],
                title: link.closest('.waterfall-card').querySelector('.img-beautify').title || '无标题',
                element: item
            };
        });

        if (items.length === 0) {
            if (window.$notify) {
                window.$notify({
                    message: '没有找到可审核的内容',
                    type: 'warning'
                });
            }
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'review-overlay';

        // 头部
        const header = document.createElement('div');
        header.className = 'review-header';

        const closeButton = document.createElement('button');
        closeButton.className = 'review-close';
        closeButton.innerHTML = '×';
        closeButton.onclick = () => {
            overlay.remove();
            if (currentKeyHandler) {
                document.removeEventListener('keydown', currentKeyHandler);
                currentKeyHandler = null;
            }
        };

        const info = document.createElement('div');
        info.className = 'review-info';

        header.appendChild(info);
        header.appendChild(closeButton);

        // 内容区
        const content = document.createElement('div');
        content.className = 'review-content';

        // 创建图片容器
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';

        const image = document.createElement('img');
        image.className = 'review-image';
        image.addEventListener('error', () => {
            // 图片加载失败时的处理
            image.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7lm77niYfliqDovb3lpLHotKU8L3RleHQ+PC9zdmc+';
        });

        // 添加图片拖动和缩放功能
        let isDragging = false;
        let startX, startY, translateX = 0, translateY = 0;

        // 双击缩放
        image.addEventListener('dblclick', (e) => {
            isZoomed = !isZoomed;
            if (isZoomed) {
                image.classList.add('zoomed');
                image.style.cursor = 'grabbing';
            } else {
                image.classList.remove('zoomed');
                image.style.cursor = 'grab';
                // 重置位置
                translateX = 0;
                translateY = 0;
                image.style.transform = '';
            }
        });

        // 鼠标按下
        image.addEventListener('mousedown', (e) => {
            if (isZoomed) {
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                image.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        // 鼠标移动
        document.addEventListener('mousemove', (e) => {
            if (isDragging && isZoomed) {
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                image.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.5)`;
            }
        });

        // 鼠标释放
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                image.style.cursor = 'grab';
            }
        });

        // 鼠标离开
        document.addEventListener('mouseleave', () => {
            if (isDragging) {
                isDragging = false;
                image.style.cursor = 'grab';
            }
        });

        imageContainer.appendChild(image);

        const title = document.createElement('div');
        title.className = 'review-title';

        // 添加标题点击跳转功能
        title.addEventListener('click', () => {
            const item = items[currentIndex];
            if (item && item.tid) {
                window.open(`https://fsm.name/Torrents/details?tid=${item.tid}`, '_blank');
            }
        });

        content.appendChild(imageContainer);
        content.appendChild(title);

        // 操作按钮
        const actions = document.createElement('div');
        actions.className = 'review-actions';

        const favoriteButton = document.createElement('button');
        favoriteButton.className = 'review-button review-favorite';
        favoriteButton.innerHTML = '⭐ 收藏';

        const skipButton = document.createElement('button');
        skipButton.className = 'review-button review-skip';
        skipButton.innerHTML = '⏭️ 跳过';

        const dislikeButton = document.createElement('button');
        dislikeButton.className = 'review-button review-dislike';
        dislikeButton.innerHTML = '👎 不喜欢';

        actions.appendChild(favoriteButton);
        actions.appendChild(skipButton);
        actions.appendChild(dislikeButton);

        overlay.appendChild(header);
        overlay.appendChild(content);
        overlay.appendChild(actions);

        function updateDisplay() {
            if (currentIndex >= items.length) {
                overlay.remove();
                if (currentKeyHandler) {
                    document.removeEventListener('keydown', currentKeyHandler);
                    currentKeyHandler = null;
                }
                return;
            }

            const item = items[currentIndex];

            // 重置缩放状态和位置
            isZoomed = false;
            image.classList.remove('zoomed');
            image.style.cursor = 'grab';
            image.style.transform = '';
            translateX = 0;
            translateY = 0;

            // 先清空src，然后重新设置，这样可以触发图片重新加载
            image.src = '';
            setTimeout(() => {
                image.src = item.img;
            }, 10);

            title.textContent = item.title;
            title.title = `点击查看详情 (TID: ${item.tid})`;
            info.textContent = `${currentIndex + 1} / ${items.length}`;
        }

        function voteTorrent(tid, value) {
            const authorization = localStorage.getItem('token');
            const deviceId = localStorage.getItem('DeviceId');
            const formData = new FormData();
            formData.append('tid', tid);
            formData.append('status', value);

            return fetch('/api/Torrents/voteTorrent', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'authorization': authorization,
                    'deviceid': deviceId,
                },
                body: formData
            })
            .then(response => response.json())
            .then(res => {
                if (res && res.success) {
                    if (window.$notify) {
                        window.$notify({
                            message: '操作成功',
                            type: 'success'
                        });
                    }
                    return true;
                }
                return false;
            })
            .catch(error => {
                console.error('操作失败:', error);
                if (window.$notify) {
                    window.$notify({
                        message: '操作失败',
                        type: 'error'
                    });
                }
                return false;
            });
        }

        favoriteButton.onclick = () => {
            const item = items[currentIndex];
            voteTorrent(item.tid, 'VALUE').then((success) => {
                if (success) {
                    // 标记对应的卡片为已处理
                    if (item.element) {
                        item.element.classList.add('itemSolved');
                    }
                }
                currentIndex++;
                updateDisplay();
            }).catch(error => {
                console.error('收藏操作出错:', error);
                // 出错时也继续下一个
                currentIndex++;
                updateDisplay();
            });
        };

        skipButton.onclick = () => {
            currentIndex++;
            updateDisplay();
        };

        dislikeButton.onclick = () => {
            const item = items[currentIndex];
            voteTorrent(item.tid, 'POINTLESS').then((success) => {
                if (success) {
                    // 标记对应的卡片为已处理
                    if (item.element) {
                        item.element.classList.add('itemSolved');
                    }
                }
                currentIndex++;
                updateDisplay();
            }).catch(error => {
                console.error('不喜欢操作出错:', error);
                // 出错时也继续下一个
                currentIndex++;
                updateDisplay();
            });
        };

        // 键盘快捷键
        const keyHandler = function(e) {
            if (!overlay.isConnected) {
                document.removeEventListener('keydown', keyHandler);
                currentKeyHandler = null;
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                    if (currentIndex > 0) {
                        currentIndex--;
                        updateDisplay();
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                    if (currentIndex < items.length - 1) {
                        currentIndex++;
                        updateDisplay();
                    }
                    break;
                case 'f':
                    favoriteButton.click();
                    break;
                case 's':
                    skipButton.click();
                    break;
                case 'x':
                    dislikeButton.click();
                    break;
                case 'z':
                    // 添加缩放快捷键
                    image.click();
                    break;
                case 'Escape':
                    // 如果当前处于缩放状态，先退出缩放
                    if (isZoomed) {
                        isZoomed = false;
                        image.classList.remove('zoomed');
                        image.style.cursor = 'zoom-in';
                    } else {
                        overlay.remove();
                        document.removeEventListener('keydown', keyHandler);
                        currentKeyHandler = null;
                    }
                    break;
            }
        };

        // 设置全局键盘处理器
        if (currentKeyHandler) {
            document.removeEventListener('keydown', currentKeyHandler);
        }
        currentKeyHandler = keyHandler;
        document.addEventListener('keydown', keyHandler);

        updateDisplay();
        return overlay;
    }

    // 添加触发按钮
    function addTriggerButton() {
        const existingButton = document.querySelector('.trigger-button');
        if (existingButton) {
            existingButton.remove();
        }

        const triggerButton = document.createElement('button');
        triggerButton.className = 'trigger-button';
        triggerButton.innerHTML = '🖼️ 快速审核';

        triggerButton.onclick = () => {
            const overlay = createReviewInterface();
            document.body.appendChild(overlay);
        };

        document.body.appendChild(triggerButton);
    }

    // 页面加载完成后添加按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTriggerButton);
    } else {
        addTriggerButton();
    }
})();