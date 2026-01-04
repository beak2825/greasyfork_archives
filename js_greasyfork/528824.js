// ==UserScript==
// @name         字幕遮挡条
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  毛玻璃效果的字幕遮挡条,快捷键V键可以快速启动。增加了隐藏开关和鼠标悬停提示。
// @author       Cup Noodle
// @license MIT
// @match        *://*.bilibili.com/*
// @match        *://*.bilibili.t/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/528824/%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/528824/%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化样式
    GM_addStyle(`
    #bilibili-overlay-btn {
        position: fixed !important;
        right: 20px !important;
        bottom: 50px !important;
        z-index: 9999 !important;
        padding: 8px 12px !important;
        background-color: rgba(255,255,255,0.9) !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        transition: opacity 0.3s, visibility 0.3s;
    }
    #toggle-ui-btn {
        position: fixed !important;
        right: 5px !important;
        bottom: 5px !important;
        z-index: 10000 !important;
        width: 15px !important;
        height: 15px !important;
        background-color: rgba(255,255,255,0.8) !important;
        border: 1px solid #ccc !important;
        border-radius: 50% !important;
        cursor: pointer !important;
        font-size: 10px !important;
        line-height: 15px !important;
        text-align: center !important;
        color: #333 !important;
    }
    .hidden-ui {
        opacity: 0 !important;
        visibility: hidden !important;
    }
    `);


    const button = document.createElement('div');
    button.id = 'bilibili-overlay-btn';
    button.textContent = '◼️ 字幕遮挡层';
    // --- 新增代码: 为遮挡层按钮添加悬停提示 ---
    button.title = '按 V 键';
    document.body.appendChild(button);

    const toggleUiBtn = document.createElement('div');
    toggleUiBtn.id = 'toggle-ui-btn';
    toggleUiBtn.textContent = '👁️'; // 初始显示为眼睛图标
    // --- 新增代码: 为UI开关按钮添加悬停提示 ---
    toggleUiBtn.title = '隐藏开关';
    document.body.appendChild(toggleUiBtn);

    // 检查本地存储中UI的可见状态
    let isUiVisible = GM_getValue('isUiVisible', true); // 默认为显示

    function setUiVisibility(visible) {
        if (visible) {
            button.classList.remove('hidden-ui');
            toggleUiBtn.textContent = '👁️';
            toggleUiBtn.title = '隐藏开关'; // 确保提示文本正确
            GM_setValue('isUiVisible', true);
        } else {
            button.classList.add('hidden-ui');
            toggleUiBtn.textContent = '✕';
            toggleUiBtn.title = '显示开关'; // 隐藏后，提示应该变为“显示”
            GM_setValue('isUiVisible', false);
        }
    }

    // 初始化UI状态
    setUiVisibility(isUiVisible);

    // 点击开关按钮，切换UI可见性
    toggleUiBtn.addEventListener('click', () => {
        isUiVisible = !isUiVisible;
        setUiVisibility(isUiVisible);
    });


    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';

    const savedPosition = localStorage.getItem('overlayPosition');
    if (savedPosition) {
        const { top, left, width, height } = JSON.parse(savedPosition);
        overlay.style.top = top;
        overlay.style.left = left;
        overlay.style.width = width;
        overlay.style.height = height;
    } else {
        overlay.style.top = '200px';
        overlay.style.left = '200px';
        overlay.style.width = '900px';
        overlay.style.height = '45px';
    }
    overlay.style.backgroundColor = 'white';
    overlay.style.zIndex = '999999999999';
    overlay.style.cursor = 'default';
    overlay.style.display = 'none';
    overlay.style.borderRadius = '10px';
    overlay.style.background = 'rgba(255,255,255,0.1)';
    overlay.style.backdropFilter = 'blur(10px)';
    overlay.style.webkitBackdropFilter = 'blur(10px)';

    document.body.appendChild(overlay);

    let isDragging = false;
    let dragStartX, dragStartY;

    overlay.addEventListener('mousedown', function (e) {
        const rect = overlay.getBoundingClientRect();
        const isEdge = (
            e.clientX >= rect.right - 10 ||
            e.clientY >= rect.bottom - 10 ||
            e.clientX <= rect.left + 10 ||
            e.clientY <= rect.top + 10
        );

        if (!isEdge) {
            isDragging = true;
            dragStartX = e.clientX - parseInt(overlay.style.left, 10);
            dragStartY = e.clientY - parseInt(overlay.style.top, 10);
            document.body.style.cursor = 'move';
        }
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            overlay.style.left = (e.clientX - dragStartX) + 'px';
            overlay.style.top = (e.clientY - dragStartY) + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            document.body.style.cursor = 'default';
            localStorage.setItem('overlayPosition', JSON.stringify({
                top: overlay.style.top,
                left: overlay.style.left,
                width: overlay.style.width,
                height: overlay.style.height
            }));
        }
    });

    function addResizableEffect(element) {
        const minWidth = 100;
        const minHeight = 10;

        element.onmousemove = function (e) {
            const rect = element.getBoundingClientRect();
            if (e.clientX > rect.left + rect.width - 10 || rect.left + 10 > e.clientX) {
                element.style.cursor = 'w-resize';
            } else if (e.clientY > rect.top + rect.height - 10) {
                element.style.cursor = 's-resize';
            } else if (e.clientY > rect.top && e.clientY < rect.top + 10) {
                element.style.cursor = 'n-resize';
            } else {
                element.style.cursor = 'default';
            }
        };

        element.onmousedown = (e) => {
            const clientX = e.clientX;
            const clientY = e.clientY;
            const elW = element.clientWidth;
            const elH = element.clientHeight;
            const EloffsetLeft = element.offsetLeft;
            const EloffsetTop = element.offsetTop;
            element.style.userSelect = 'none';

            const isTopResize = clientY > EloffsetTop && clientY < EloffsetTop + 10;

            document.onmousemove = function (e) {
                e.preventDefault();

                if (clientX > EloffsetLeft && clientX < EloffsetLeft + 10) {
                    const newWidth = elW - (e.clientX - clientX);
                    if (newWidth >= minWidth) {
                        element.style.width = newWidth + 'px';
                        element.style.left = EloffsetLeft + (e.clientX - clientX) + 'px';
                    }
                }
                if (clientX > EloffsetLeft + elW - 10 && clientX < EloffsetLeft + elW) {
                    const newWidth = elW + (e.clientX - clientX);
                    if (newWidth >= minWidth) {
                        element.style.width = newWidth + 'px';
                    }
                }
                if (clientY > EloffsetTop + elH - 10 && clientY < EloffsetTop + elH) {
                    const newHeight = elH + (e.clientY - clientY);
                    if (newHeight >= minHeight) {
                        element.style.height = newHeight + 'px';
                    }
                }
                if (isTopResize) {
                    const newHeight = elH - (e.clientY - clientY);
                    if (newHeight >= minHeight) {
                        element.style.height = newHeight + 'px';
                        element.style.top = EloffsetTop + (e.clientY - clientY) + 'px';
                    }
                }
            };

            document.onmouseup = function (e) {
                document.onmousemove = null;
                document.onmouseup = null;
                localStorage.setItem('overlayPosition', JSON.stringify({
                    top: overlay.style.top,
                    left: overlay.style.left,
                    width: overlay.style.width,
                    height: overlay.style.height
                }));
            };
        };
    }

    addResizableEffect(overlay);

    function applyStyles() {
        overlay.style.backdropFilter = `blur(10px)`;
        overlay.style.background = 'rgba(255,255,255,0.1)';
    }

    function toggleOverlay() {
        overlay.style.display = overlay.style.display === 'none' ? '' : 'none';
        button.textContent = overlay.style.display === '' ? '隐藏遮挡层' : '◼️ 字幕遮挡层';
        applyStyles();
    }

    button.addEventListener('click', toggleOverlay);

    document.addEventListener('keydown', function (e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
            return;
        }
        if (e.key === 'v' || e.key === 'V') {
            toggleOverlay();
        }
    });


    function requestFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // 监听全屏和网页全屏事件的逻辑保持不变
    // ... (以下代码省略，与之前版本相同) ...
    document.addEventListener('fullscreenchange', function () {
        const container = document.fullscreenElement || document.body;
        if (document.fullscreenElement) {
            button.style.display = 'none';
            toggleUiBtn.style.display = 'none';
            overlay.style.zIndex = '999999999999';
            container.appendChild(overlay);
        } else {
            setUiVisibility(GM_getValue('isUiVisible', true));
            toggleUiBtn.style.display = 'block';
        }
    });
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const videoWrapper = document.querySelector('.bpx-player-container');
                if (videoWrapper && videoWrapper.classList.contains('bpx-player-container-web-fullscreen')) {
                    button.style.display = 'none';
                    toggleUiBtn.style.display = 'none';
                    overlay.style.zIndex = '999999999999';
                } else {
                    setUiVisibility(GM_getValue('isUiVisible', true));
                    toggleUiBtn.style.display = 'block';
                }
            }
        }
    });
    setTimeout(() => {
        const videoWrapper = document.querySelector('.bpx-player-container');
        if (videoWrapper) {
            observer.observe(videoWrapper, { attributes: true, attributeFilter: ['class'] });
        }
    }, 2000);

})();