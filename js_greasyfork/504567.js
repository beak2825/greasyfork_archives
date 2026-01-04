// ==UserScript==
// @name         小窗预览 长按 中键 拖拽
// @version      3.9.2
// @description  链接预览 小窗预览 方便的预览方式
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_info
// @namespace    https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/504567/%E5%B0%8F%E7%AA%97%E9%A2%84%E8%A7%88%20%E9%95%BF%E6%8C%89%20%E4%B8%AD%E9%94%AE%20%E6%8B%96%E6%8B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/504567/%E5%B0%8F%E7%AA%97%E9%A2%84%E8%A7%88%20%E9%95%BF%E6%8C%89%20%E4%B8%AD%E9%94%AE%20%E6%8B%96%E6%8B%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // State to track dragging, popup status, overlay visibility, and long press
    const state = {
        isDragging: false,
        isLongPressing: false,
        linkToPreload: null,
        popupWindow: null,
        acrylicOverlay: null,
        overlayVisible: false,
        preloadElement: null,
        longPressTimeout: null,
        startPosition: { x: 0, y: 0 },
    };

    // Configuration settings with defaults
    const config = {
        windowWidth: GM_getValue('windowWidth', 870),
        windowHeight: GM_getValue('windowHeight', 530),
        blurIntensity: GM_getValue('blurIntensity', 20),
        blurEnabled: GM_getValue('blurEnabled', true),
        closeOnMouseClick: GM_getValue('closeOnMouseClick', true),
        closeOnScroll: GM_getValue('closeOnScroll', true),
        longPressEnabled: GM_getValue('longPressEnabled', true),
        dragToOpenEnabled: GM_getValue('dragToOpenEnabled', true),
        middleClickEnabled: GM_getValue('middleClickEnabled', true), // New option for middle click
        longPressDuration: GM_getValue('longPressDuration', 300), // 300ms default
        transitionDuration: 220, // 220ms fade-in/fade-out
    };

    // Website-specific configurations
    const specificSites = {
        "bilibili.com": { windowWidth: 1000, windowHeight: 565, enableLeftClickPopup: true },
        "douyin.com": { windowWidth: 1000, windowHeight: 500, enableLeftClickPopup: true },
        "x.com": { windowWidth: 1000, windowHeight: 700, enableLeftClickPopup: true },
        "youtube.com": { windowWidth: 1040, windowHeight: 700, enableLeftClickPopup: false },
        "www.ghxi.com": { windowWidth: 1900, windowHeight: 700, enableLeftClickPopup: false }
    };

    // Utility to delay operations (e.g., to allow preload to complete)
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Preload a link using a <link rel="prefetch"> element
    async function preloadLink(link) {
        try {
            removePreloadedLink();

            const preloadElement = document.createElement('link');
            preloadElement.rel = 'prefetch';
            preloadElement.href = link;
            preloadElement.as = 'document';
            preloadElement.onload = () => console.log(`Prefetch successful: ${link}`);
            preloadElement.onerror = () => console.log(`Prefetch failed: ${link}`);
            document.head.appendChild(preloadElement);
            state.preloadElement = preloadElement;

            await delay(1); // Ensure the prefetch operation starts
        } catch (error) {
            console.error('Error in prefetch operation:', error);
        }
    }

    // Remove the preloaded link element from the DOM
    function removePreloadedLink() {
        if (state.preloadElement) {
            state.preloadElement.remove();
            state.preloadElement = null;
        }
    }

    // Create an acrylic overlay with blur effect and fade-in transition
    function createAcrylicOverlay() {
        const acrylicOverlay = document.createElement('div');
        Object.assign(acrylicOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9999',
            backdropFilter: config.blurEnabled ? `blur(${config.blurIntensity}px)` : 'none',
            opacity: '0',
            transition: `opacity ${config.transitionDuration}ms ease-in-out`,
        });

        if (config.closeOnMouseClick) {
            acrylicOverlay.addEventListener('click', handleAcrylicOverlayClick);
        }

        document.body.appendChild(acrylicOverlay);

        // Trigger fade-in effect
        requestAnimationFrame(() => {
            acrylicOverlay.style.opacity = '1';
            state.overlayVisible = true;
        });

        return acrylicOverlay;
    }

    // Handle click on the acrylic overlay (close popup)
    function handleAcrylicOverlayClick(event) {
        if (event.target === state.acrylicOverlay) {
            closePopupWindow();
        }
    }

    // Remove the acrylic overlay with fade-out transition
    function removeAcrylicOverlay() {
        if (state.acrylicOverlay && state.overlayVisible) {
            state.acrylicOverlay.style.opacity = '0';

            setTimeout(() => {
                if (state.acrylicOverlay) {
                    state.acrylicOverlay.remove();
                    state.acrylicOverlay = null;
                    state.overlayVisible = false;
                }
            }, config.transitionDuration);
        }
    }

    // Open a popup window centered on the screen
    function openPopupWindow(link, width = config.windowWidth, height = config.windowHeight) {
        // Retrieve the site-specific configuration, if any
        const siteConfig = getSiteConfig();
        if (siteConfig) {
            // Apply site-specific window size if available
            width = siteConfig.windowWidth || width;
            height = siteConfig.windowHeight || height;
        }

        const screenLeft = (window.screen.width - width) / 2;
        const screenTop = (window.screen.height - height) / 3;

        if (!state.popupWindow || state.popupWindow.closed) {
            state.acrylicOverlay = createAcrylicOverlay();
            state.popupWindow = window.open(link, '_blank', `width=${width},height=${height},left=${screenLeft},top=${screenTop}`);
            state.popupWindowChecker = setInterval(checkPopupWindowStatus, 200);
        }
    }

    // Close the popup window and cleanup
    function closePopupWindow() {
        if (state.popupWindow && !state.popupWindow.closed) {
            state.popupWindow.close();
            state.popupWindow = null;
            removeAcrylicOverlay();
            removePreloadedLink();
            window.removeEventListener('scroll', closePopupOnScroll);
        }
    }

    // Check if the popup window is still open; remove overlay if closed
    function checkPopupWindowStatus() {
        if (state.popupWindow && state.popupWindow.closed) {
            removeAcrylicOverlay();
            clearInterval(state.popupWindowChecker);
        }
    }

    // Close the popup window when the page is scrolled
    function closePopupOnScroll() {
        closePopupWindow();
    }

    // Check if the current site matches a specific configuration
    function getSiteConfig() {
        const hostname = window.location.hostname;
        return specificSites[Object.keys(specificSites).find(domain => hostname.includes(domain))];
    }

    // Register menu commands for the script
    function registerMenuCommand(label, action) {
        return GM_registerMenuCommand(label, () => {
            action();
            updateMenuCommands();
        });
    }

    // Toggle blur effect on/off
    function toggleBlurEffect() {
        config.blurEnabled = !config.blurEnabled;
        GM_setValue('blurEnabled', config.blurEnabled);
    }

    // Prompt user to set blur intensity
    function setBlurIntensity() {
        const intensity = prompt('输入模糊强度（0-100）:', config.blurIntensity);
        if (intensity !== null) {
            config.blurIntensity = parseInt(intensity, 10);
            GM_setValue('blurIntensity', config.blurIntensity);
        }
    }

    // Toggle the option to close the popup on mouse click
    function toggleCloseOnMouseClick() {
        config.closeOnMouseClick = !config.closeOnMouseClick;
        GM_setValue('closeOnMouseClick', config.closeOnMouseClick);
    }

    // Toggle the option to close the popup on scroll
    function toggleCloseOnScroll() {
        config.closeOnScroll = !config.closeOnScroll;
        handleScrollCommand();
        GM_setValue('closeOnScroll', config.closeOnScroll);
    }

    // Toggle the option to enable or disable drag-to-open feature
    function toggleDragToOpen() {
        config.dragToOpenEnabled = !config.dragToOpenEnabled;
        GM_setValue('dragToOpenEnabled', config.dragToOpenEnabled);
    }

    // Toggle the option to enable or disable long-press-to-open feature
    function toggleLongPressOpen() {
        config.longPressEnabled = !config.longPressEnabled;
        GM_setValue('longPressEnabled', config.longPressEnabled);
    }

    // Toggle the option to enable or disable middle-click-to-open feature
    function toggleMiddleClickOpen() {
        config.middleClickEnabled = !config.middleClickEnabled;
        GM_setValue('middleClickEnabled', config.middleClickEnabled);
    }

    // Prompt user to set the long-press duration
    function setLongPressDuration() {
        const duration = prompt('输入长按时间（毫秒）:', config.longPressDuration);
        if (duration !== null) {
            config.longPressDuration = parseInt(duration, 10);
            GM_setValue('longPressDuration', config.longPressDuration);
        }
    }

    // Prompt user to set window size
    function setWindowSize() {
        const size = prompt(`输入小窗口宽度x高度（例如: 870x530）:`, `${config.windowWidth}x${config.windowHeight}`);
        if (size !== null) {
            const [width, height] = size.split('x').map(val => parseInt(val.trim(), 10));
            if (!isNaN(width) && !isNaN(height)) {
                config.windowWidth = width;
                config.windowHeight = height;
                GM_setValue('windowWidth', config.windowWidth);
                GM_setValue('windowHeight', config.windowHeight);
                if (state.popupWindow && !state.popupWindow.closed) {
                    state.popupWindow.resizeTo(config.windowWidth, config.windowHeight);
                }
            }
        }
    }

    // Update the menu commands when configuration changes
    function updateMenuCommands() {
        menuCommands.forEach((command) => {
            registerMenuCommand(command.label, command.action);
        });
    }

    // Menu commands for configuring the script
    const menuCommands = [
        { label: `模糊旧时刻 (${config.blurEnabled ? '开' : '关'})`, action: toggleBlurEffect },
        { label: `模糊的强弱 (${config.blurIntensity})`, action: setBlurIntensity },
        { label: `轻点关闭否 (${config.closeOnMouseClick ? '开' : '关'})`, action: toggleCloseOnMouseClick },
        { label: `滚动关闭否 (${config.closeOnScroll ? '开' : '关'})`, action: toggleCloseOnScroll },
        { label: `拖动打开否 (${config.dragToOpenEnabled ? '开' : '关'})`, action: toggleDragToOpen },
        { label: `长按打开否 (${config.longPressEnabled ? '开' : '关'})`, action: toggleLongPressOpen },
        { label: `中键打开小窗 (${config.middleClickEnabled ? '开' : '关'})`, action: toggleMiddleClickOpen }, // New menu command
        { label: `长按时间 (${config.longPressDuration}ms)`, action: setLongPressDuration },
        { label: `不变的大小 (${config.windowWidth}x${config.windowHeight})`, action: setWindowSize },
    ];

    // Initialize menu commands
    updateMenuCommands();

    // Event listeners for drag-and-drop, long-press, middle-click, and other interactions
    document.body.addEventListener('mousedown', (event) => {
        if (event.button !== 0) return;

        const linkElement = event.target.tagName === 'A' ? event.target : event.target.closest('a');
        if (!linkElement) return;

        // Track the start position for displacement detection
        state.startPosition = { x: event.clientX, y: event.clientY };

        if (config.longPressEnabled) {
            state.isLongPressing = true;
            state.longPressTimeout = setTimeout(async () => {
                if (state.isLongPressing) {
                    state.isLongPressing = false;
                    await preloadLink(linkElement.href);
                    openPopupWindow(linkElement.href);
                }
            }, config.longPressDuration);
        }
    });

    document.body.addEventListener('mouseup', (event) => {
        state.isLongPressing = false;
        clearTimeout(state.longPressTimeout);
    });

    document.body.addEventListener('mousemove', (event) => {
        if (state.isLongPressing) {
            const displacement = Math.sqrt(
                Math.pow(event.clientX - state.startPosition.x, 2) +
                Math.pow(event.clientY - state.startPosition.y, 2)
            );
            if (displacement > 5) {  // Cancel long-press if significant movement is detected
                state.isLongPressing = false;
                clearTimeout(state.longPressTimeout);
            }
        }
    });

    document.body.addEventListener('dragstart', async (event) => {
        if (!config.dragToOpenEnabled) return;

        const linkElement = event.target.tagName === 'A' ? event.target : event.target.closest('a');
        if (linkElement) {
            state.isDragging = true;
            state.linkToPreload = linkElement.href;

            await preloadLink(state.linkToPreload);

            if (config.closeOnScroll) {
                window.addEventListener('scroll', closePopupOnScroll, { once: true });
            }
        }
    });

    document.body.addEventListener('dragend', () => {
        if (state.isDragging && state.linkToPreload) {
            state.isDragging = false;
            openPopupWindow(state.linkToPreload);
            state.linkToPreload = null;
        }
    });

    document.body.addEventListener('wheel', () => {
        if (config.closeOnScroll) {
            closePopupWindow();
        }
    });

    document.body.addEventListener('click', (event) => {
        if (event.target === state.acrylicOverlay) {
            removeAcrylicOverlay();
        }
    });

    document.body.addEventListener('auxclick', async (event) => {
        if (event.button !== 1 || !config.middleClickEnabled) return; // Check for middle click and if the feature is enabled

        const linkElement = event.target.tagName === 'A' ? event.target : event.target.closest('a');
        if (!linkElement) return;

        event.preventDefault(); // Prevent the default middle click behavior

        await preloadLink(linkElement.href);
        openPopupWindow(linkElement.href);
    });

})();
