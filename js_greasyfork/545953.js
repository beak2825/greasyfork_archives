// ==UserScript==
// @name        拓展VL功能
// @namespace   http://tampermonkey.net/
// @version     1.1
// @license     MIT
// @description 阻止所有可能导致_blank新页面打开的点击事件，并且新增右键上下集菜单和快捷键（ctrl+左为上一集，ctrl+右为下一集）。
// @match       *://vidlink.pro/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/545953/%E6%8B%93%E5%B1%95VL%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/545953/%E6%8B%93%E5%B1%95VL%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function console_log(...msg) {
        console.log('%c[拓展VL功能]', 'font-weight: bold; color: white; background-color: #79BC5F; padding: 2px; border-radius: 2px;', ...msg);
    }

    // 定义需要执行拦截器的时间点（秒）
    // 脚本加载后立即执、1秒、3秒、5秒、10秒后执行。
    const EXECUTION_DELAYS_SECONDS = [0, 1, 3, 5, 10]; // 0秒即表示脚本加载后立即执行

    /**
     * 设置或重新设置 window.open 拦截器
     * 该函数被多次调用时，会重复覆盖 window.open。
     */
    function setupWindowOpenInterceptor() {
        // 存储当前实际的 window.open，无论是原生的还是其他脚本修改过的。
        // 这确保了即使我们多次覆盖，也能保留对原始或上一个状态的引用，以便调用。
        const originalWindowOpen = window.open;

        window.open = function() {
            const url = arguments[0];
            const target = arguments[1];

            if (target === '_blank') {
                console_log('阻止了一个通过 window.open("_blank") 打开新页面的尝试:', {
                    url: url,
                    target: target,
                    context: this,
                    args: arguments
                });
                return null; // 阻止打开新页面
            } else {
                // 如果 target 不是 "_blank" 或未指定，则调用之前存储的原始的 window.open
                return originalWindowOpen.apply(this, arguments);
            }
        };
        console_log(`window.open 拦截器已设置/重置 (${new Date().toLocaleTimeString()}).`);
    }

    setupWindowOpenInterceptor();

    /**
     * 设置点击事件和表单提交事件拦截器。
     * 这些事件监听器只需要设置一次。
     */
    let eventListenersSet = false; // 用于标记事件监听器是否已设置

    function setupEventListenersOnce() {
        if (eventListenersSet) {
            return; // 已经设置过了
        }

        console_log('设置click事件监听器，捕获并阻止所有可能导致 _blank 的点击事件默认行为');

        // ===========================================
        // 捕获并阻止所有可能导致 _blank 的点击事件默认行为
        // ===========================================
        document.addEventListener('click', function(event) {
            let currentElement = event.target;

            // 向上遍历DOM树，查找直接或间接的 `_blank` 意图
            while (currentElement && currentElement !== document.body) {
                if (currentElement.hasAttribute('target') && currentElement.getAttribute('target') === '_blank') {
                    event.preventDefault(); // 阻止默认行为
                    event.stopImmediatePropagation(); // 阻止事件进一步传播
                    console_log('(click event): 阻止了一个带有 target="_blank" 属性的元素点击默认行为:', currentElement);
                    return; // 拦截成功，退出循环
                }
                currentElement = currentElement.parentElement;
            }
        }, true); // `true` 表示在捕获阶段处理事件，这是关键

        eventListenersSet = true; // 标记为已设置
    }

    // ===========================================
    // 主执行逻辑
    // ===========================================

    // 确保 DOMContentLoaded 后再设置事件监听器，因为它们依赖 DOM 结构。
    // 如果脚本执行时 DOM 已经ready，则立即设置。
    if (document.readyState === 'loading') { // 如果文档还在加载
        document.addEventListener('DOMContentLoaded', setupEventListenersOnce, { once: true });
    } else { // 如果文档已经解析完成 (interactive 或 complete)
        setupEventListenersOnce();
    }


    // 安排 window.open 的守护和事件监听器的设置
    EXECUTION_DELAYS_SECONDS.forEach(delay => {
        setTimeout(() => {
            setupWindowOpenInterceptor();

            // 事件监听器只设置一次，但如果DOM还未就绪，则再次尝试确保设置
            // 通常在 DOMContentLoaded 后就已经设置了。
            if (!eventListenersSet && document.readyState !== 'loading') {
                setupEventListenersOnce();
            }
        }, delay * 1000); // 转换为毫秒
    });


    // 上一集/下一集菜单按钮 和 快捷键

    // 检查URL是否包含 /tv/
    if (!window.location.href.includes('/tv/')) {
        return; // 如果不包含，则不执行后续代码
    }

    let customContextMenu = null; // 用于存储自定义菜单元素

    // 封装创建菜单项的函数，减少重复代码
    function createMenuItem(text, onClickHandler) {
        const item = document.createElement('div');
        item.textContent = text;
        item.classList.add('episode-context-menu-item');
        item.style.cssText = `
            padding: 8px 15px;
            cursor: pointer;
            white-space: nowrap;
            color: #000; /* 确保菜单项文字颜色为黑色，即使父级设置也可以覆盖 */
            text-align: center; /* 将文字居中显示 */
            display: flex; /* 使用flexbox来实现垂直居中（如果padding不够）和更灵活的布局 */
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */
        `;
        item.onmouseover = () => item.style.backgroundColor = '#e0e0e0';
        item.onmouseout = () => item.style.backgroundColor = '';
        item.onclick = (e) => {
            e.stopPropagation(); // 阻止事件冒泡，避免触发document点击隐藏菜单
            onClickHandler();
            hideCustomContextMenu();
        };
        return item;
    }

    /**
    * 创建并显示自定义右键菜单
    * @param {number} x - 菜单左上角的X坐标
    * @param {number} y - 菜单左上角的Y坐标
    */
    function showCustomContextMenu(x, y) {
        // 如果菜单已存在，先移除
        if (customContextMenu) {
            customContextMenu.remove();
        }

        customContextMenu = document.createElement('div');
        customContextMenu.id = 'episode-custom-context-menu';
        customContextMenu.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        background-color: #f9f9f9;
        border: 1px solid #ccc;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.2);
        z-index: 10000;
        padding: 5px 0;
        min-width: 120px;
        border-radius: 4px;
        font-family: sans-serif;
        font-size: 14px;
        color: #000; /* 设置菜单整体文字颜色为黑色 */
        `;

        // 添加 "下一集" 按钮
        const nextButton = createMenuItem('下一集', () => navigateEpisode(1));
        customContextMenu.appendChild(nextButton);

        // 添加 "上一集" 按钮
        const prevButton = createMenuItem('上一集', () => navigateEpisode(-1));
        customContextMenu.appendChild(prevButton);

        document.body.appendChild(customContextMenu);
    }

    /**
    * 隐藏自定义右键菜单
    */
    function hideCustomContextMenu() {
        if (customContextMenu) {
            customContextMenu.remove();
            customContextMenu = null;
        }
    }

    /**
    * 根据 delta 导航到上一集或下一集
    * @param {number} delta - 改变的集数，-1 表示上一集，1 表示下一集
    */
    function navigateEpisode(delta) {
        const currentUrl = window.location.href;
        const match = currentUrl.match(/\/(\d+)(\/?(?:[?#].*)?)$/); // 匹配以数字结尾的路径段
        if (match && match.length >= 2) {
            let currentEpisodeNum = parseInt(match[1], 10);
            const suffix = match[2] || ''; // 获取URL末尾可能存在的斜杠、问号参数或哈希
            let newEpisodeNum = currentEpisodeNum + delta;

            // 避免跳转到第0集或负数集
            if (delta === -1 && newEpisodeNum < 1) {
                console_log('已经是第一集了，无法跳转到上一集。');
                return;
            }

            // 构建新的URL
            const newUrl = currentUrl.replace(/\/(\d+)(\/?(?:[?#].*)?)$/, `/${newEpisodeNum}${suffix}`);

            window.location.href = newUrl;
        } else {
            console_log('当前URL无法解析出集数，请确保URL末尾包含集数数字。', currentUrl);
        }
    }

    // 监听全局 contextmenu 事件 (右键点击)
    document.addEventListener('contextmenu', function(event) {
        // 阻止浏览器默认右键菜单
        event.preventDefault();
        // 显示自定义菜单
        showCustomContextMenu(event.clientX, event.clientY);
    });

    // 监听全局点击事件，当点击菜单外部时隐藏菜单
    document.addEventListener('click', function(event) {
        if (customContextMenu && !customContextMenu.contains(event.target)) {
            hideCustomContextMenu();
        }
    });

    // 监听 ESC 键，当按下 ESC 键时隐藏菜单，绑定上一集/下一集快捷键
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            hideCustomContextMenu();
        }

        // 检查是否按下了 Ctrl 键（或 Command 键在 Mac 上）
        const isCtrlOrCmd = event.ctrlKey || event.metaKey; // event.metaKey 对应 Mac 上的 Command 键
        if (isCtrlOrCmd) {
            // 检查是否是左方向键
            if (event.key === 'ArrowLeft' || event.keyCode === 37) {
                event.preventDefault(); // 阻止浏览器可能有的默认行为 (例如在某些系统下后退)
                navigateEpisode(-1);
            }
            // 检查是否是右方向键
            else if (event.key === 'ArrowRight' || event.keyCode === 39) {
                event.preventDefault(); // 阻止浏览器可能有的默认行为 (例如在某些系统下前进)
                navigateEpisode(1);
            }
        }
    });

})();