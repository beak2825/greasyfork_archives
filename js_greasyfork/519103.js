// ==UserScript==
// @name         请不要污染我的剪贴板
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  保护用户剪贴板内容，允许或禁止网站污染剪贴板。
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license MIT
/* jshint esversion: 8 */
// @downloadURL https://update.greasyfork.org/scripts/519103/%E8%AF%B7%E4%B8%8D%E8%A6%81%E6%B1%A1%E6%9F%93%E6%88%91%E7%9A%84%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/519103/%E8%AF%B7%E4%B8%8D%E8%A6%81%E6%B1%A1%E6%9F%93%E6%88%91%E7%9A%84%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const PERMISSION_KEY = 'CLIPBOARD_PERMISSIONS';
    let permissions = GM_getValue(PERMISSION_KEY, {});

    // 创建权限管理菜单
    GM_registerMenuCommand("剪贴板权限管理", showPermissionManager);

    /**************** 核心拦截逻辑 ****************/
    
    // 修复1：正确处理传统execCommand
    const originalExecCommand = document.execCommand.bind(document);
    document.execCommand = function(command, showUI, value) {
        if (/^(copy|cut|paste)$/i.test(command)) {
            const allowed = checkPermissionSync(
                'execCommand:' + command,
                `网站试图通过document.execCommand执行【${command.toUpperCase()}】操作`
            );
            return allowed ? originalExecCommand(command, showUI, value) : false;
        }
        return originalExecCommand(command, showUI, value);
    };

    // 修复2：正确处理现代Clipboard API
    if (navigator.clipboard) {
        // 写入拦截
        const originalWrite = navigator.clipboard.writeText.bind(navigator.clipboard);
        navigator.clipboard.writeText = async function(data) {
            const allowed = await checkPermissionAsync(
                'clipboard:write',
                `网站试图写入剪贴板内容：${truncateText(data)}`
            );
            return allowed ? originalWrite(data) : Promise.reject(new DOMException('Not allowed', 'NotAllowedError'));
        };

        // 读取拦截
        const originalRead = navigator.clipboard.readText.bind(navigator.clipboard);
        navigator.clipboard.readText = async function() {
            const allowed = await checkPermissionAsync(
                'clipboard:read',
                '网站试图读取剪贴板内容'
            );
            return allowed ? originalRead() : Promise.reject(new DOMException('Not allowed', 'NotAllowedError'));
        };
    }

    // 修复3：优化事件监听劫持
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (['copy', 'cut', 'paste'].includes(type)) {
            const wrappedListener = (e) => {
                const operation = type === 'paste' ? '读取' : '写入';
                const allowed = checkPermissionSync(
                    'event:' + type,
                    `网站通过【${type}】事件进行剪贴板${operation}`
                );
                if (allowed) return listener(e);
                e.preventDefault();
                e.stopImmediatePropagation();
            };
            return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };

    /**************** 工具函数 ****************/
    
    // 同步权限检查（用于同步API）
    function checkPermissionSync(permissionId, message) {
        const domain = window.location.hostname;
        const fullKey = `${domain}:${permissionId}`;
        
        // 检查已保存的权限
        if (permissions[fullKey] !== undefined) {
            return permissions[fullKey];
        }
        
        // 交互式询问
        const choice = confirm(`${message}\n\n是否允许本次操作？\n(确定=允许，取消=拒绝)`);
        const remember = confirm('是否永久记住此选择？');
        
        if (remember) {
            permissions[fullKey] = choice;
            GM_setValue(PERMISSION_KEY, permissions);
        }
        
        return choice;
    }

    // 异步权限检查（用于异步API）
    async function checkPermissionAsync(permissionId, message) {
        return new Promise(resolve => {
            resolve(checkPermissionSync(permissionId, message));
        });
    }

    function showPermissionManager() {
        let msg = '已保存的剪贴板权限:\n';
        Object.keys(permissions).forEach(k => {
            msg += `\n${k.replace(':', ' → ')}: ${permissions[k] ? '✓' : '×'}`;
        });
        alert(msg + '\n\n提示：在弹窗中选择"记住"可永久保存设置');
    }

    function truncateText(text, max = 50) {
        return text.length > max ? text.substring(0, max) + '...' : text;
    }
})();
