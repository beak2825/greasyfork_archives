// ==UserScript==
// @name            禁用鼠标离开网页/窗口失焦监听
// @namespace       http://tampermonkey.net/
// @version         0.4.9
// @description     通过多种方式阻止网页检测鼠标离开页面、窗口失去焦点或页面可见性变化，并包含活动模拟，旨在保护用户操作不被意外中断或记录。新增禁用网页自动全屏功能。
// @author          Chuwu
// @match           *://*.chaoxing.com/*
// @match           *://*.icve.com.cn/*
// @match           *://*.edu.cn/*
// @match           *://*.icourse163.org/*
// @match           *://*.linknl.com/*
// @match           *://*.huawei.com/*
// @icon            https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant           unsafeWindow
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_openInTab
// @grant           GM_registerMenuCommand
// @grant           GM_notification
// @grant           GM_setClipboard
// @run-at          document-start
// @license         AGPL3.0
// @downloadURL https://update.greasyfork.org/scripts/531453/%E7%A6%81%E7%94%A8%E9%BC%A0%E6%A0%87%E7%A6%BB%E5%BC%80%E7%BD%91%E9%A1%B5%E7%AA%97%E5%8F%A3%E5%A4%B1%E7%84%A6%E7%9B%91%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/531453/%E7%A6%81%E7%94%A8%E9%BC%A0%E6%A0%87%E7%A6%BB%E5%BC%80%E7%BD%91%E9%A1%B5%E7%AA%97%E5%8F%A3%E5%A4%B1%E7%84%A6%E7%9B%91%E5%90%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = '禁用鼠标离开/失焦监听'; // 脚本名称，用于日志输出
    const DEBUG = false; // 调试模式开关，设置为 true 以启用详细日志记录

    // 获取页面的全局 window 对象，优先使用 unsafeWindow
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    if (DEBUG) console.log(`[${SCRIPT_NAME}] 脚本在 document-start 阶段开始运行。`);

    // --- 1. 重写 EventTarget.prototype.addEventListener ---
    // 功能1：重写 EventTarget.prototype.addEventListener 方法
    // 阻止特定的事件监听器被添加到 window 或 document 对象上
    const forbiddenEvents = new Set([
        'mouseout',
        'mouseleave',
        'blur',
        'focus',
        'focusin',
        'focusout',
        'visibilitychange',
        'webkitvisibilitychange',
        'mozvisibilitychange',
        'msvisibilitychange',
        'fullscreenchange',
        'webkitfullscreenchange',
        'mozfullscreenchange',
        'msfullscreenchange',
        'beforeunload',
        'pagehide'
    ]);

    // 保存原始的 addEventListener 方法引用
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    // 重写 EventTarget 原型上的 addEventListener 方法
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        // 检查：
        // 1. 事件类型是否在禁止列表中
        // 2. 事件监听的目标 (`this`) 是否是页面的 window 或 document 对象
        const typeName = typeof type === 'string' ? type.toLowerCase() : '';
        const doc = pageWindow.document;
        const isMainTarget = this === pageWindow || this === doc || this === doc.documentElement || this === doc.body;
        if (typeName && forbiddenEvents.has(typeName) && isMainTarget) {
            if (DEBUG) console.log(`[${SCRIPT_NAME}] 已阻止向`, this, `添加 "${type}" 事件监听器`);
            // 不调用原始的 addEventListener，从而阻止监听器被添加
            return;
        }
        // 如果不是要阻止的事件或目标，则正常调用原始的 addEventListener
        return originalAddEventListener.call(this, type, listener, options);
    };

    if (DEBUG) console.log(`[${SCRIPT_NAME}] EventTarget.prototype.addEventListener 已被重写。`);

    // --- 2. 重写与焦点和可见性相关的属性 ---
    // 功能2：重写与焦点和可见性相关的属性
    try {
        // --- 2.1 页面可见性 API (Page Visibility API) ---
        // 强制页面始终处于 'visible' (可见) 状态
        const visibilityProperties = {
            visibilityState: 'visible',
            hidden: false,
            webkitVisibilityState: 'visible', // Webkit 内核浏览器前缀
            mozVisibilityState: 'visible', // Mozilla 内核浏览器前缀
            msVisibilityState: 'visible', // IE/Edge 浏览器前缀
            webkitHidden: false,
            mozHidden: false,
            msHidden: false,
        };

        // 遍历并重写上述定义的各属性
        for (const propName in visibilityProperties) {
            if (Object.prototype.hasOwnProperty.call(visibilityProperties, propName)) {
                // 使用 Object.defineProperty 重写 document 的属性
                Object.defineProperty(pageWindow.document, propName, {
                    value: visibilityProperties[propName],
                    writable: false, // 设置为不可写，防止页面脚本轻易修改
                    configurable: true // 保持可配置，允许油猴脚本自身更新或禁用此重写
                });
            }
        }
        if (DEBUG) console.log(`[${SCRIPT_NAME}] 页面可见性 API 相关属性已被重写。`);

        // --- 2.2 文档焦点 (Document Focus) ---
        // 重写 document.hasFocus() 方法，使其始终返回 true
        Object.defineProperty(pageWindow.document, 'hasFocus', {
            value: () => true, // 使其固定返回 true，表明页面始终拥有焦点
            writable: false,
            configurable: true
        });
        if (DEBUG) console.log(`[${SCRIPT_NAME}] document.hasFocus 方法已被重写。`);

        // --- 2.3 窗口失焦/聚焦事件 (旧版事件处理方式) ---
        // 阻止直接赋值给 window.onblur, window.onfocus 等事件处理器属性
        const windowEventHandlersToNullify = [
            'onblur',
            'onfocus',
            'onfocusout',
            'onfocusin',
            'onbeforeunload',
            'onpagehide',
            'onvisibilitychange',
            'onwebkitvisibilitychange',
            'onmozvisibilitychange',
            'onmsvisibilitychange',
            'onfullscreenchange',
            'onwebkitfullscreenchange',
            'onmozfullscreenchange',
            'onmsfullscreenchange'
        ];
        // 遍历并重写上述定义的各事件处理器属性
        windowEventHandlersToNullify.forEach(handlerName => {
            // 使用 Object.defineProperty 重写 window 的事件处理器属性
            Object.defineProperty(pageWindow, handlerName, {
                value: null, // 将事件处理器赋值为 null
                writable: false, // 设置为不可写，以阻止如 `window.onblur = function(){...}` 这样的直接赋值
                configurable: true
            });
        });
        const documentEventHandlersToNullify = [
            'onblur',
            'onfocus',
            'onfocusout',
            'onfocusin',
            'onbeforeunload',
            'onpagehide',
            'onvisibilitychange',
            'onwebkitvisibilitychange',
            'onmozvisibilitychange',
            'onmsvisibilitychange',
            'onfullscreenchange',
            'onwebkitfullscreenchange',
            'onmozfullscreenchange',
            'onmsfullscreenchange'
        ];
        documentEventHandlersToNullify.forEach(handlerName => {
            Object.defineProperty(pageWindow.document, handlerName, {
                value: null,
                writable: false,
                configurable: true
            });
        });
        if (DEBUG) console.log(`[${SCRIPT_NAME}] window.onblur/onfocus 等属性已被重写。`);

        // --- 2.4 全屏 API (Fullscreen API) ---
        // 新增功能：禁用网页自动全屏，让网页以为自己已经全屏
        // 创建一个假的元素作为全屏元素
        const fakeFullscreenElement = pageWindow.document.createElement('div');
        fakeFullscreenElement.style.display = 'none';
        
        // 修复：因为 @run-at document-start，此时 body 可能不存在，需要判断
        if (pageWindow.document.body) {
            pageWindow.document.body.appendChild(fakeFullscreenElement);
        } else {
            // 如果 body 还没生成，等待 DOM 加载完成后再添加
            pageWindow.document.addEventListener('DOMContentLoaded', () => {
                if (pageWindow.document.body) {
                    pageWindow.document.body.appendChild(fakeFullscreenElement);
                }
            });
        }

        // 重写全屏相关的属性
        const fullscreenProperties = {
            fullscreenElement: fakeFullscreenElement,
            webkitFullscreenElement: fakeFullscreenElement,
            mozFullScreenElement: fakeFullscreenElement,
            msFullscreenElement: fakeFullscreenElement,
            fullscreenEnabled: true,
            webkitFullscreenEnabled: true,
            mozFullScreenEnabled: true,
            msFullscreenEnabled: true
        };

        // 遍历并重写上述定义的各属性
        for (const propName in fullscreenProperties) {
            if (Object.prototype.hasOwnProperty.call(fullscreenProperties, propName)) {
                // 使用 Object.defineProperty 重写 document 的属性
                Object.defineProperty(pageWindow.document, propName, {
                    get: function() { return fullscreenProperties[propName]; },
                    configurable: true
                });
            }
        }

        // 重写 requestFullscreen 方法
        const originalRequestFullscreen = Element.prototype.requestFullscreen ||
                                         Element.prototype.webkitRequestFullscreen ||
                                         Element.prototype.mozRequestFullScreen ||
                                         Element.prototype.msRequestFullscreen;

        if (originalRequestFullscreen) {
            Element.prototype.requestFullscreen =
            Element.prototype.webkitRequestFullscreen =
            Element.prototype.mozRequestFullScreen =
            Element.prototype.msRequestFullscreen = function() {
                if (DEBUG) console.log(`[${SCRIPT_NAME}] 已阻止 requestFullscreen 调用`);
                return Promise.resolve();
            };
        }

        // 重写 exitFullscreen 方法
        const originalExitFullscreen = pageWindow.document.exitFullscreen ||
                                      pageWindow.document.webkitExitFullscreen ||
                                      pageWindow.document.mozCancelFullScreen ||
                                      pageWindow.document.msExitFullscreen;

        if (originalExitFullscreen) {
            pageWindow.document.exitFullscreen =
            pageWindow.document.webkitExitFullscreen =
            pageWindow.document.mozCancelFullScreen =
            pageWindow.document.msExitFullscreen = function() {
                if (DEBUG) console.log(`[${SCRIPT_NAME}] 已阻止 exitFullscreen 调用`);
                return Promise.resolve();
            };
        }

        if (DEBUG) console.log(`[${SCRIPT_NAME}] 全屏 API 相关属性和方法已被重写。`);

    } catch (error) {
        // 捕获并报告在重写属性过程中发生的错误
        console.error(`[${SCRIPT_NAME}] 重写焦点/可见性相关属性时出错:`, error);
    }

    // --- 3. 定期模拟鼠标移动事件 ---
    // 功能3：定期模拟鼠标移动事件
    // 目的：模拟用户活动，以防止某些基于用户长时间无操作的检测。
    try {
        const activityInterval = 15000; // 模拟活动的间隔时间 (毫秒), 统一为15秒
        
        // 创建随机坐标的鼠标移动事件生成函数
        function createRandomMouseEvent() {
            const x = Math.floor(Math.random() * 500) + 100; // 100-600 之间的随机X坐标
            const y = Math.floor(Math.random() * 500) + 100; // 100-600 之间的随机Y坐标
            return new MouseEvent('mousemove', {
                bubbles: true,
                cancelable: true,
                view: pageWindow,
                clientX: x,
                clientY: y
            });
        }

        // 设置定时器，定期在 document 上派发模拟的鼠标移动事件
        const intervalId = pageWindow.setInterval(() => {
            // 每次生成新的随机坐标事件，使模拟更真实
            const fakeMouseEvent = createRandomMouseEvent();
            pageWindow.document.dispatchEvent(fakeMouseEvent);
            if (DEBUG) console.log(`[${SCRIPT_NAME}] 已派发模拟的 mousemove 事件 (${fakeMouseEvent.clientX}, ${fakeMouseEvent.clientY})。`);
        }, activityInterval);

        if (DEBUG) console.log(`[${SCRIPT_NAME}] 已启动模拟鼠标活动 (定时器 ID: ${intervalId})。`);

        // 添加 'unload' 事件监听器，在页面卸载时清除定时器
        pageWindow.addEventListener('unload', () => {
            // 清除之前设置的定时器，防止内存泄漏或不必要的后台活动
            pageWindow.clearInterval(intervalId);
            if (DEBUG) console.log(`[${SCRIPT_NAME}] 已清除模拟鼠标活动的定时器。`);
        });

    } catch (error) {
        // 捕获并报告在启动模拟鼠标移动过程中发生的错误
        console.error(`[${SCRIPT_NAME}] 启动模拟鼠标移动时出错:`, error);
    }

    // --- 4. 添加禁用列表选项 ---
    // 功能4：添加将当前网站加入禁用列表的选项
    try {
        // 注册油猴菜单命令
        GM_registerMenuCommand('将当前网站添加到禁用列表', addToBlockList);

        // 显示通知的函数
        function showNotification(message) {
            GM_notification({
                text: message,
                title: SCRIPT_NAME,
                highlight: true,
                timeout: 3000
            });
        }

        // 添加到禁用列表的函数
        function addToBlockList() {
            try {
                // 获取当前URL并处理为通配符格式
                const url = new URL(window.location.href);
                const pattern = `*://*.${url.hostname}/*`;

                // 使用更可靠的油猴API复制到剪贴板
                GM_setClipboard(pattern, 'text');

                console.log(`[${SCRIPT_NAME}] 已复制到剪贴板: ${pattern}`);
                showNotification(`已将 ${pattern} 复制到剪贴板，请手动添加到脚本的 @match 部分`);

                // 延迟提示用户打开脚本编辑页面
                setTimeout(() => {
                    if (confirm("是否现在打开脚本编辑页面？")) {
                        // 尝试打开油猴脚本管理器
                        openScriptEditor();
                    }
                }, 1000);
            } catch (error) {
                console.error(`[${SCRIPT_NAME}] 添加到禁用列表时出错:`, error);
                showNotification(`操作失败: ${error.message}`);
            }
        }

        // 打开脚本编辑器的函数
        function openScriptEditor() {
            try {
                // 提示用户手动操作，因为扩展ID因浏览器和安装方式而异
                showNotification(`请手动点击油猴图标 > 管理面板 > 找到本脚本进行编辑`);
                
                // 复制完整的匹配规则文本供用户粘贴
                const url = new URL(window.location.href);
                const pattern = `*://*.${url.hostname}/*`;
                const fullMatchText = `// @match           ${pattern}`;
                GM_setClipboard(fullMatchText, 'text');
                
                setTimeout(() => {
                    showNotification(`已复制完整匹配规则到剪贴板，请粘贴到脚本的 @match 部分`);
                }, 1000);
            } catch (error) {
                console.error(`[${SCRIPT_NAME}] 打开脚本编辑器时出错:`, error);
                showNotification(`操作失败: ${error.message}`);
            }
        }

        if (DEBUG) console.log(`[${SCRIPT_NAME}] 禁用列表菜单命令已添加。`);
    } catch (error) {
        console.error(`[${SCRIPT_NAME}] 添加禁用列表选项时出错:`, error);
    }

    // --- 初始化完成日志 ---
    // 脚本初始化完成，相关监听器已被禁用，活动模拟已启动。
    console.log(`[${SCRIPT_NAME}] 初始化完成。`);

})();
