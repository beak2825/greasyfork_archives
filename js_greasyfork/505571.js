// ==UserScript==
// @name         图片预览
// @version      3.2.1
// @description  平庸与极限，究竟哪种是你的风格？随心所欲，不受拘束，此时此刻突破极限。
// @author       hiisme
// @match       https://image.baidu.com/*
// @match       https://unsplash.com/*
// @match       https://www.google.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @namespace https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/505571/%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/505571/%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve settings from storage
    let shortcut = GM_getValue('shortcut', 'Ctrl+Shift+I');
    let windowWidth = GM_getValue('windowWidth', screen.width);
    let windowHeight = GM_getValue('windowHeight', screen.height);
    let adaptiveWindowSize = GM_getValue('adaptiveWindowSize', true);
    let enableAcrylicBlur = GM_getValue('enableAcrylicBlur', true);
    let mode = GM_getValue('mode', 'Extreme');

    // Util to toggle settings
    function toggleSetting(settingKey, settingName) {
        const currentValue = GM_getValue(settingKey, true);
        const newValue = !currentValue;
        GM_setValue(settingKey, newValue);
        GM_notification({
            text: `${settingName}现已${newValue ? '启用' : '禁用'}`,
            title: '图片浏览',
            timeout: 3000
        });
    }

    function toggleAdaptiveWindowSize() {
        toggleSetting('adaptiveWindowSize', '智能自适应窗口大小');
    }

    function toggleAcrylicBlur() {
        toggleSetting('enableAcrylicBlur', 'Acrylic模糊');
    }

    function toggleMode() {
        mode = (mode === 'Extreme') ? 'Normal' : 'Extreme';
        GM_setValue('mode', mode);
        GM_notification({
            text: `模式已切换为: ${mode === 'Extreme' ? '极限模式' : '普通模式'}`,
            title: '图片浏览',
            timeout: 3000
        });
    }

    async function setShortcut() {
        const newShortcut = prompt('输入新的快捷键组合以切换模式 (如: Ctrl+Shift+I):', shortcut);
        if (newShortcut) {
            shortcut = newShortcut;
            GM_setValue('shortcut', shortcut);
            GM_notification({
                text: `快捷键已设置为: ${shortcut}`,
                title: '图片浏览',
                timeout: 3000
            });
        }
    }

    async function setWindowSize() {
        const newWidth = prompt('输入新窗口宽度 (像素):', windowWidth);
        const newHeight = prompt('输入新窗口高度 (像素):', windowHeight);
        if (newWidth && newHeight) {
            windowWidth = parseInt(newWidth, 10);
            windowHeight = parseInt(newHeight, 10);
            GM_setValue('windowWidth', windowWidth);
            GM_setValue('windowHeight', windowHeight);
            GM_notification({
                text: `窗口大小设置为: ${windowWidth}x${windowHeight}`,
                title: '图片浏览',
                timeout: 3000
            });
        }
    }

    // Register Menu Commands
    GM_registerMenuCommand("设定极限平庸的按钮", setShortcut);
    GM_registerMenuCommand("一成不变的画布大小", setWindowSize);
    GM_registerMenuCommand("自由的天地不受拘束", toggleAdaptiveWindowSize);
    GM_registerMenuCommand("模糊画布之下的风景", toggleAcrylicBlur);
    GM_registerMenuCommand("极限与平庸不可兼得", toggleMode);

    function parseShortcut(shortcut, event) {
        const keys = shortcut.toLowerCase().split('+').map(k => k.trim());
        return keys.includes(event.key.toLowerCase()) &&
               (keys.includes('ctrl') === event.ctrlKey) &&
               (keys.includes('shift') === event.shiftKey) &&
               (keys.includes('alt') === event.altKey) &&
               (keys.includes('meta') || keys.includes('cmd') || keys.includes('command') === event.metaKey);
    }

    function onKeyDown(event) {
        if (parseShortcut(shortcut, event)) {
            event.preventDefault();
            toggleMode(); // Toggle mode on shortcut
        }
    }
    document.addEventListener('keydown', onKeyDown);

    function calculateWindowSize(imageWidth, imageHeight) {
        const screenWidth = screen.width;
        const screenHeight = screen.height;

        const minWidth = screenWidth * 0.2;
        const minHeight = screenHeight * 0.2;
        const maxWidth = screenWidth * 0.9;
        const maxHeight = screenHeight * 0.9;

        const aspectRatio = imageWidth / imageHeight;

        let width = Math.max(minWidth, Math.min(imageWidth, maxWidth));
        let height = width / aspectRatio;
        if (height > maxHeight) {
            height = maxHeight;
            width = height * aspectRatio;
        }

        return { width, height };
    }

    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.style.position = 'fixed';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.style.transform = 'translate(-50%, -50%)';
        spinner.style.width = '50px';
        spinner.style.height = '50px';
        spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        spinner.style.borderTop = '4px solid #fff';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 0.6s linear infinite';
        spinner.style.zIndex = '9999';

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        return spinner;
    }

    function createImageViewer(url) {
        const spinner = createLoadingSpinner();
        document.body.appendChild(spinner);

        const img = new Image();
        img.src = url;

        img.onload = function() {
            let newWindowWidth = windowWidth;
            let newWindowHeight = windowHeight;

            if (adaptiveWindowSize) {
                const size = calculateWindowSize(img.width, img.height);
                newWindowWidth = size.width;
                newWindowHeight = size.height;
            }

            const leftOffset = (screen.width - newWindowWidth) / 2;
            const topPosition = (screen.height - newWindowHeight) / 2 - 40;

            const newWindow = window.open('', 'Image Preview', `width=${newWindowWidth},height=${newWindowHeight},top=${topPosition},left=${leftOffset},resizable=yes,scrollbars=no`);

            if (newWindow) {
                newWindow.document.title = '图片预览';

                // Apply modern CSS layout and acrylic blur
                newWindow.document.open();
                newWindow.document.write(`
                    <html>
                    <head>
                        <title>图片预览</title>
                        <style>
                            body {
                                margin: 0;
                                overflow: hidden;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                background-color: black;
                                height: 100vh;
                                position: relative;
                            }
                            ${enableAcrylicBlur ? `
                            .background {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                background: url('${url}') center/cover no-repeat;
                                filter: blur(20px);
                                z-index: -2;
                            }
                            .overlay {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 100%;
                                height: 100%;
                                backdrop-filter: blur(20px) saturate(150%);
                                background-color: rgba(255, 255, 255, 0.3);
                                z-index: -1;
                            }` : ''}
                            img {
                                max-width: 100%;
                                max-height: 100%;
                                cursor: grab;
                                transition: transform 0.1s ease;
                                position: relative;
                                user-select: none;
                                z-index: 1;
                            }
                        </style>
                        <meta name="theme-color" content="#000000">
                    </head>
                    <body>
                        ${enableAcrylicBlur ? `<div class="background"></div><div class="overlay"></div>` : ''}
                        <img src="${url}" alt="图片" />
                    </body>
                    </html>
                `);
                newWindow.document.close();

                // Remove the spinner after the image is displayed
                document.body.removeChild(spinner);

                let scale = 1;
                let imgX = 0, imgY = 0;
                let isDragging = false;
                let lastMouseX = 0, lastMouseY = 0;

                const imgElement = newWindow.document.querySelector('img');

                function onMouseMove(event) {
                    if (isDragging) {
                        const deltaX = event.clientX - lastMouseX;
                        const deltaY = event.clientY - lastMouseY;
                        imgX += deltaX;
                        imgY += deltaY;
                        imgElement.style.transform = `translate(${imgX}px, ${imgY}px) scale(${scale})`;
                        lastMouseX = event.clientX;
                        lastMouseY = event.clientY;
                    }
                }

                function onMouseUp() {
                    isDragging = false;
                    imgElement.style.cursor = 'grab';
                    newWindow.removeEventListener('mousemove', onMouseMove);
                    newWindow.removeEventListener('mouseup', onMouseUp);
                }

                function onWheel(event) {
                    event.preventDefault();
                    const scaleAmount = event.deltaY > 0 ? 0.9 : 1.1;
                    scale *= scaleAmount;
                    imgElement.style.transform = `translate(${imgX}px, ${imgY}px) scale(${scale})`;
                }

                function onMouseDown(event) {
                    event.preventDefault();
                    isDragging = true;
                    imgElement.style.cursor = 'grabbing';
                    lastMouseX = event.clientX;
                    lastMouseY = event.clientY;
                    newWindow.addEventListener('mousemove', onMouseMove);
                    newWindow.addEventListener('mouseup', onMouseUp);
                }

                function onDoubleClick() {
                    newWindow.close();
                }

                imgElement.addEventListener('wheel', onWheel, { passive: false });
                imgElement.addEventListener('mousedown', onMouseDown);
                imgElement.addEventListener('dblclick', onDoubleClick);

                newWindow.addEventListener('beforeunload', () => {
                    imgElement.removeEventListener('wheel', onWheel);
                    imgElement.removeEventListener('mousedown', onMouseDown);
                    imgElement.removeEventListener('dblclick', onDoubleClick);
                    newWindow.removeEventListener('mousemove', onMouseMove);
                    newWindow.removeEventListener('mouseup', onMouseUp);
                });
            } else {
                // Remove the spinner if the window failed to open
                document.body.removeChild(spinner);
            }
        };

        img.onerror = function() {
            // Remove the spinner if the image failed to load
            document.body.removeChild(spinner);
            GM_notification({
                text: '图片加载失败',
                title: '图片浏览',
                timeout: 3000
            });
        };
    }

    // Optimized Intersection Observer for preloading images
    function preloadImage(element) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    createImageViewer(entry.target.src || entry.target.href);
                    obs.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });

        observer.observe(element);
    }

    function onClick(event) {
        const target = event.target;

        if (event.shiftKey) {
            return; // If Shift is pressed, use the default behavior
        }

        if (mode === 'Extreme') {
            // Extreme Mode: Handle images and links aggressively
            if (target.tagName === 'A' && /\.(jpg|jpeg|png|gif|webp)$/i.test(target.href)) {
                event.preventDefault();
                event.stopPropagation();
                preloadImage(target);
            } else if (target.tagName === 'IMG' && /\.(jpg|jpeg|png|gif|webp)$/i.test(target.src)) {
                event.preventDefault();
                event.stopPropagation();
                preloadImage(target);
            } else if (target.tagName === 'IMG' && target.src) {
                event.preventDefault();
                event.stopPropagation();
                preloadImage(target);
            }
        } else {
            // Normal Mode: Handle only image elements and image links
            if (target.tagName === 'IMG' && /\.(jpg|jpeg|png|gif|webp)$/i.test(target.src)) {
                event.preventDefault();
                event.stopPropagation();
                preloadImage(target);
            } else if (target.tagName === 'A' && /\.(jpg|jpeg|png|gif|webp)$/i.test(target.href)) {
                event.preventDefault();
                event.stopPropagation();
                preloadImage(target);
            }
        }
    }

    document.addEventListener('click', onClick, true);

    function cleanUp() {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('click', onClick, true);
    }

    window.addEventListener('unload', cleanUp);
})();
