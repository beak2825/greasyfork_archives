// ==UserScript==
// @name         字幕遮挡 block subtitle
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  毛玻璃效果的字幕遮挡条,如果你看美剧英剧且不想看中文字幕的话,且快捷键Alt+B键可以快速启动
// @author       OpenAI
// @license MIT
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547342/%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%20block%20subtitle.user.js
// @updateURL https://update.greasyfork.org/scripts/547342/%E5%AD%97%E5%B9%95%E9%81%AE%E6%8C%A1%20block%20subtitle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
    #bilibili-overlay-btn {
        position: fixed !important;
        right: 20px !important;
        bottom: 20px !important;
        z-index: 9999 !important;
        padding: 8px 12px !important;
        background-color: rgba(255,255,255,0.9) !important;
        border: 1px solid #ddd !important;
        border-radius: 4px !important;
        cursor: pointer !important;
        font-size: 14px !important;

        transition: left 0.2s, top 0.2s;
    }

    #subtitle-overlay:hover {
        background: rgba(255,255,255,0) !important;
        -webkit-backdrop-filter: blur(0px) !important;
        backdrop-filter: blur(0px) !important;
        border: solid;
    }
    `);


    const button = document.createElement('div');
    button.id = 'bilibili-overlay-btn';
    button.textContent = '◼️ 字幕遮挡层';
    document.body.appendChild(button);// 不想显示就注释掉此行

    const shortcutTip = document.createElement('div');
    shortcutTip.id = 'shortcut-tip';
    shortcutTip.textContent = '按 Alt + B 键';
    document.body.appendChild(shortcutTip);// 不想显示就注释掉此行

    const overlay = document.createElement('div');
    overlay.id = 'subtitle-overlay';
    overlay.style.position = 'fixed';

    const savedPosition = null;// localStorage.getItem('overlayPosition');  
                               //不想记住上次位置就设置为null
    if (savedPosition) {
        const { top, left, width, height } = JSON.parse(savedPosition);
        overlay.style.top = top;
        overlay.style.left = left;
        overlay.style.width = width;
        overlay.style.height = height;
    } else {
        overlay.style.top = '495px';// '200px';
        overlay.style.left = '178px';// '200px';
        overlay.style.width = '900px';
        overlay.style.height = '135px';//'45px';
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

    document.addEventListener('mouseup', function (e) {
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

    let isCtrlPressed = false;
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey) {
            isCtrlPressed = true;
            console.log('Ctrl键已按下');
            overlay.style.pointerEvents = 'none';
            overlay.style.background = "rgba(255,255,255,0)";
            overlay.style.backdropFilter = 'blur(0px)';
            overlay.style.webkitBackdropFilter = 'blur(0px)';
        }
    });

    document.addEventListener('keyup', function (e) {
        if (e.key === 'Control') {
            isCtrlPressed = false;
            console.log('Ctrl键已释放');
            overlay.style.pointerEvents = 'auto';
            overlay.style.background = "rgba(255,255,255,0.1)";
            overlay.style.backdropFilter = 'blur(10px)';
            overlay.style.webkitBackdropFilter = 'blur(10px)';
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
    shortcutTip.addEventListener('click', toggleOverlay);

    document.addEventListener('keydown', function (e) {
        if (e.altKey && e.key === 'b' || e.altKey && e.key === 'B') {
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

    const container = document.querySelector('.container');
    if (container) {
        const video = container.querySelector('video');
        if (video) {
            const fullscreenButton = video.parentNode.querySelector('.vjs-fullscreen-control');
            if (fullscreenButton) {
                fullscreenButton.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (document.fullscreenElement === container) {
                        exitFullscreen();
                    } else {
                        requestFullscreen(container);
                    }
                });
            }
        }
    }
    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            button.style.display = 'none';
            shortcutTip.style.display = 'none';
            overlay.style.zIndex = '999999999999';
            const container = document.fullscreenElement || document.body;
            container.appendChild(overlay);
        } else {
            button.style.display = 'block';
            shortcutTip.style.display = 'block';
        }
    });

    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const videoWrapper = document.querySelector('.bpx-player-container');
                if (videoWrapper && videoWrapper.classList.contains('bpx-player-container-web-fullscreen')) {
                    button.style.display = 'none';
                    shortcutTip.style.display = 'none';
                    overlay.style.zIndex = '999999999999';
                } else {
                    button.style.display = 'block';
                    shortcutTip.style.display = 'block';
                }
            }
        }
    });

    const videoWrapper = document.querySelector('.bpx-player-container');
    if (videoWrapper) {
        observer.observe(videoWrapper, { attributes: true, attributeFilter: ['class'] });
    }

})();

// 鸣谢：
// https://greasyfork.org/zh-CN/scripts/528824