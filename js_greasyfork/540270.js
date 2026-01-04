// ==UserScript==
// @name         剪贴板保护控制
// @version      1.0
// @description  默认禁止网页自动写入剪贴板，可通过脚本菜单允许写入剪贴板
// @author       DeepSeek
// @match        *://*/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/540270/%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%BF%9D%E6%8A%A4%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/540270/%E5%89%AA%E8%B4%B4%E6%9D%BF%E4%BF%9D%E6%8A%A4%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 执行剪贴板保护
    if (GM_getValue('clipboardProtection', true) !== false) {
        enableClipboardProtection();
    }

    // 注册菜单
    let enableCmd, disableCmd;
    updateMenu();

    function updateMenu() {
        const isProtected = GM_getValue('clipboardProtection', true);
        
        if (isProtected) {
            if (enableCmd) GM_unregisterMenuCommand(enableCmd);
            disableCmd = GM_registerMenuCommand("🛡️ 剪贴板保护已启用(点击禁用)", () => {
                GM_setValue('clipboardProtection', false);
                disableClipboardProtection();
                updateMenu();
            });
        } else {
            if (disableCmd) GM_unregisterMenuCommand(disableCmd);
            enableCmd = GM_registerMenuCommand("⚠️ 剪贴板保护已禁用(点击启用)", () => {
                GM_setValue('clipboardProtection', true);  
                enableClipboardProtection();
                updateMenu();
            });
        }
    }

    // 启用剪贴板保护
    function enableClipboardProtection() {
        ['execCommand', 'writeText', 'write'].forEach(method => {
            const target = method === 'execCommand' ? document : navigator.clipboard;
            try {
                Object.defineProperty(target, method, {
                    value: () => {
                        console.warn('剪贴板写入已被脚本禁止');
                        return Promise.reject('剪贴板写入已被脚本禁止');
                    },
                    writable: false,
                    configurable: true
                });
            } catch (e) {
                console.log('剪贴板保护设置失败:', e);
            }
        });
    }

    // 禁用剪贴板保护
    function disableClipboardProtection() {  
        ['execCommand', 'writeText', 'write'].forEach(method => {
            const target = method === 'execCommand' ? document : navigator.clipboard;
            try {
                delete target[method];
            } catch (e) {
                console.log('剪贴板保护解除失败:', e);
            }
        });
    }
})();