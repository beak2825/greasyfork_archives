// ==UserScript==
// @name         CSDN免登录copy
// @version      1.0
// @description  CSDN可以不需要登录进行复制
// @author       lk
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @namespace https://greasyfork.org/users/1509322
// @downloadURL https://update.greasyfork.org/scripts/547536/CSDN%E5%85%8D%E7%99%BB%E5%BD%95copy.user.js
// @updateURL https://update.greasyfork.org/scripts/547536/CSDN%E5%85%8D%E7%99%BB%E5%BD%95copy.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 删除页面内所有节点的复制事件限制
    function removeAllCopyRestrictions() {
        // 获取页面中所有的元素
        const allElements = document.querySelectorAll('*');

        console.log(`开始处理 ${allElements.length} 个页面元素`);

        allElements.forEach(element => {
            // 移除可能的复制限制属性
            element.removeAttribute('oncopy');
            element.removeAttribute('oncontextmenu');
            element.removeAttribute('onselectstart');
            element.removeAttribute('ondragstart');
            element.removeAttribute('oncut');
            element.removeAttribute('onpaste');

            // 设置允许文本选择的样式
            element.style.userSelect = 'text';
            element.style.webkitUserSelect = 'text';
            element.style.mozUserSelect = 'text';
            element.style.msUserSelect = 'text';

            // 移除可能的禁用选择类名
            element.classList.remove('no-select', 'noselect', 'unselectable');
        });

        // 特别处理body和html元素
        [document.body, document.documentElement].forEach(element => {
            if (element) {
                element.style.userSelect = 'text';
                element.style.webkitUserSelect = 'text';
                element.style.mozUserSelect = 'text';
                element.style.msUserSelect = 'text';
                element.removeAttribute('onselectstart');
                element.removeAttribute('oncontextmenu');
            }
        });
    }

    // 专门处理code元素，使其可编辑
    function enableCodeEditing() {
        // 获取页面中所有的 code 标签元素
        // querySelectorAll 返回一个包含所有匹配选择器的元素的 NodeList
        const codes = document.querySelectorAll("code");

        if (codes.length === 0) {
            console.log('未找到 code 元素');
            return;
        }

        console.log(`找到 ${codes.length} 个代码块`);

        // 遍历所有找到的 code 元素
        // 使用 forEach 方法对每个 code 元素进行处理
        codes.forEach(code => {
            // 将每个 code 元素设置为可编辑状态
            // contentEditable = "true" 使元素内容可以被用户编辑和选择
            // 这样可以绕过 CSDN 的复制限制，让用户能够正常选择和复制代码
            code.contentEditable = "true";

            // 移除所有可能阻止复制的事件监听器
            // 克隆节点并替换原节点，这样可以移除所有事件监听器
            const newCode = code.cloneNode(true);
            newCode.contentEditable = "true";

            // 设置允许文本选择的样式
            newCode.style.userSelect = 'text';
            newCode.style.webkitUserSelect = 'text';
            newCode.style.mozUserSelect = 'text';
            newCode.style.msUserSelect = 'text';

            // 移除可能的复制限制属性
            newCode.removeAttribute('oncopy');
            newCode.removeAttribute('oncontextmenu');
            newCode.removeAttribute('onselectstart');
            newCode.removeAttribute('ondragstart');

            // 替换原节点
            if (code.parentNode) {
                code.parentNode.replaceChild(newCode, code);
            }

            console.log(newCode, '已处理的代码块');
        });
    }

    // 移除全局的事件监听器并阻止复制限制
    function removeGlobalEventListeners() {
        // 阻止页面级别的复制限制事件
        const events = ['copy', 'cut', 'paste', 'selectstart', 'contextmenu', 'dragstart', 'mousedown', 'mouseup', 'keydown', 'keyup'];

        events.forEach(eventType => {
            // 移除所有现有的事件监听器
            document.removeEventListener(eventType, function() {}, true);
            document.removeEventListener(eventType, function() {}, false);

            // 添加新的事件监听器，阻止默认的限制行为
            document.addEventListener(eventType, function(e) {
                // 阻止事件冒泡和默认行为
                e.stopImmediatePropagation();

                // 特别处理复制事件，确保不弹出登录框
                if (eventType === 'copy' || eventType === 'cut') {
                    // 允许复制操作继续
                    return true;
                }

                // 对于其他事件，也允许继续
                return true;
            }, true);
        });

        // 特别处理CSDN的复制拦截机制
        // 重写可能被CSDN劫持的方法
        try {
            const originalAddEventListener = EventTarget.prototype.addEventListener;
            EventTarget.prototype.addEventListener = function(type, listener, options) {
                // 如果是复制相关事件，不添加监听器
                if (['copy', 'selectstart', 'contextmenu', 'dragstart'].includes(type)) {
                    console.log(`阻止添加 ${type} 事件监听器`);
                    return;
                }
                // 其他事件正常处理
                return originalAddEventListener.call(this, type, listener, options);
            };
        } catch (e) {
            console.log('无法重写 addEventListener，使用备选方案');
        }

        // 重写document.oncopy等属性（使用try-catch避免重定义错误）
        try {
            Object.defineProperty(document, 'oncopy', {
                set: function() {
                    console.log('阻止设置 document.oncopy');
                },
                get: function() {
                    return null;
                },
                configurable: true
            });
        } catch (e) {
            // 如果无法重定义，直接设置为null
            try {
                document.oncopy = null;
            } catch (e2) {
                console.log('无法修改 document.oncopy');
            }
        }

        try {
            Object.defineProperty(document, 'onselectstart', {
                set: function() {
                    console.log('阻止设置 document.onselectstart');
                },
                get: function() {
                    return null;
                },
                configurable: true
            });
        } catch (e) {
            try {
                document.onselectstart = null;
            } catch (e2) {
                console.log('无法修改 document.onselectstart');
            }
        }

        try {
            Object.defineProperty(document, 'oncontextmenu', {
                set: function() {
                    console.log('阻止设置 document.oncontextmenu');
                },
                get: function() {
                    return null;
                },
                configurable: true
            });
        } catch (e) {
            try {
                document.oncontextmenu = null;
            } catch (e2) {
                console.log('无法修改 document.oncontextmenu');
            }
        }

        // 阻止CSDN可能使用的其他限制方法
        try {
            if (window.getSelection) {
                const originalGetSelection = window.getSelection;
                window.getSelection = function() {
                    const selection = originalGetSelection.call(this);
                    // 确保选择功能正常工作
                    return selection;
                };
            }
        } catch (e) {
            console.log('无法重写 getSelection 方法');
        }

        // 重写可能被CSDN用来检测复制的方法
        try {
            const originalExecCommand = document.execCommand;
            document.execCommand = function(commandId, showUI, value) {
                if (commandId === 'copy' || commandId === 'cut') {
                    console.log(`允许执行 ${commandId} 命令`);
                    return originalExecCommand.call(this, commandId, showUI, value);
                }
                return originalExecCommand.call(this, commandId, showUI, value);
            };
        } catch (e) {
            console.log('无法重写 execCommand 方法');
        }

        console.log('已移除全局事件限制并阻止复制拦截');
    }


    // 等待页面加载完成后执行
    function init() {
        // 执行所有解除限制的操作
        removeAllCopyRestrictions();
        removeGlobalEventListeners();
        enableCodeEditing();

        console.log('CSDN免登录复制脚本已启动');
    }

    // 如果页面已经加载完成，立即执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();