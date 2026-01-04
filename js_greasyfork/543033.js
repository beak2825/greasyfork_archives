// ==UserScript==
// @name        前缀转发
// @namespace   http://example.com/
// @license     GPL3
// @version     3
// @description 使用 JSON 格式配置规则，支持多条规则、独立开关
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_addValueChangeListener
// @run-at      document-start
// @include     http://example.com/
// @downloadURL https://update.greasyfork.org/scripts/543033/%E5%89%8D%E7%BC%80%E8%BD%AC%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/543033/%E5%89%8D%E7%BC%80%E8%BD%AC%E5%8F%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ------------ 默认配置 ------------ */
    const DEFAULT_RULES = [
        {
            "name": "测试规则",
            "enabled": true,
            "prefix": "https://dev.com/api/",
            "replacement": "http://localhost:8080/"
        },
        {
            "name": "测试规则2",
            "enabled": false,
            "prefix": "https://dev.com/api2/",
            "replacement": "http://localhost:8082/"
        }
    ];

    /* ------------ 读取和保存规则 ------------ */
    function getRules() {
        const savedRules = GM_getValue('rules');
        if (savedRules && typeof savedRules === 'string') {
            try {
                return JSON.parse(savedRules);
            } catch (e) {
                console.error('加载保存的规则出错:', e);
                GM_setValue('rules', JSON.stringify(DEFAULT_RULES));
                return DEFAULT_RULES;
            }
        }
        return DEFAULT_RULES;
    }

    function saveRules(rules) {
        if (Array.isArray(rules)) {
            GM_setValue('rules', JSON.stringify(rules));
        } else {
            console.error('无效的规则格式。规则必须是数组格式。');
            throw new Error('无效的规则格式。规则必须是数组格式。');
        }
    }

    /* ------------ 核心替换逻辑 ------------ */
    function redirect(url) {
        if (typeof url !== 'string') return url;

        const rules = getRules();
        const normalizedUrl = url.trim();

        for (const rule of rules) {
            if (rule.enabled) {
                const normalizedPrefix = rule.prefix.trim();
                if (normalizedUrl.startsWith(normalizedPrefix)) {
                    return rule.replacement + normalizedUrl.slice(normalizedPrefix.length);
                }
            }
        }
        return url;
    }

    /* ------------ 拦截 XHR ------------ */
    const XHROPEN = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
        url = redirect(url);
        return XHROPEN.call(this, method, url, ...rest);
    };

    /* ------------ 拦截 fetch ------------ */
    const ORIG_FETCH = window.fetch;
    window.fetch = function (input, init) {
        if (typeof input === 'string') {
            input = redirect(input);
        } else if (input instanceof Request) {
            const newUrl = redirect(input.url);
            if (newUrl !== input.url) {
                input = new Request(newUrl, input);
            }
        } else if (typeof input === 'object' && input !== null && 'url' in input) {
            input.url = redirect(input.url);
        }
        return ORIG_FETCH.call(this, input, init);
    };

    /* ------------ 菜单管理 ------------ */
    let menuCommands = [];

    function buildMenu() {
        menuCommands.forEach(id => GM_unregisterMenuCommand(id));
        menuCommands = [];

        const configCommand = GM_registerMenuCommand('#️⃣ 配置规则', () => {
            const currentRules = getRules();
            const prettyJson = JSON.stringify(currentRules, null, 2);
            const updatedJson = prompt(
                '输入 JSON 格式的规则:\n[\n  {\n    "name": "规则名称",\n    "enabled": true,\n    "prefix": "原前缀",\n    "replacement": "新前缀"\n  }\n]',
                prettyJson
            );
            if (updatedJson !== null) {
                try {
                    const newRules = JSON.parse(updatedJson);
                    if (Array.isArray(newRules)) {
                        saveRules(newRules);
                        showNotification('已保存，即时生效', 'success');
                        buildMenu();
                    } else {
                        alert('规则必须是数组格式，请检查后重试');
                    }
                } catch (e) {
                    console.error('解析输入的 JSON 出错:', e);
                    alert('JSON 格式错误，请检查后重试');
                }
            }
        });
        menuCommands.push(configCommand);

        const rules = getRules();
        rules.forEach((rule, index) => {
            const toggleCommand = GM_registerMenuCommand(
                `${rule.enabled ? '✅' : '❌'} ${rule.name}`,
                () => {
                    const newRules = getRules();
                    if (index >= 0 && index < newRules.length) {
                        newRules[index].enabled = !newRules[index].enabled;
                        saveRules(newRules);
                        showNotification(`${rule.name} 已${newRules[index].enabled ? '启用' : '禁用'}，即时生效`, newRules[index].enabled ? 'success' : 'info');
                        buildMenu();
                    }
                }
            );
            menuCommands.push(toggleCommand);
        });
    }

    buildMenu();

    // 监听规则变化（多标签同步更新菜单）
    GM_addValueChangeListener('rules', function () {
        buildMenu();
    });
    // 后台唤醒时重建菜单
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) { // 用户重新切回该标签
            setTimeout(buildMenu, 0); // 让 UI 线程先完成唤醒
        }
    });

    /* ------------ 通知功能增强 ------------ */
    function showNotification(message, type = 'info') {
        if (!document.body) {
            setTimeout(() => showNotification(message, type), 100);
            return;
        }

        const notification = document.createElement('div');
        notification.className = `tm-notification ${type}`; // 添加类型类名
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .tm-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 4px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transform: translateY(-100%);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 9999;
            pointer-events: none;
        }
        .tm-notification.success {
            background-color: #4CAF50; /* 启用的绿色背景 */
            color: white;
        }
        .tm-notification.info {
            background-color: #9E9E9E; /* 禁用的灰色背景 */
            color: white;
        }
        .tm-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    /* ------------ 页面加载时显示启用的规则（3秒后消失）------------ */
    function showEnabledRules() {
        const rules = getRules();
        const enabledRules = rules.filter(rule => rule.enabled);
        if (enabledRules.length > 0) {
            const enabledRuleNames = enabledRules.map(rule => rule.name).join('，');
            showNotification(`当前启用的规则：${enabledRuleNames}`, 'success');
        }
    }

    // 页面加载完成后显示启用规则提示
    window.addEventListener('load', showEnabledRules);
})();