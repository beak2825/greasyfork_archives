// ==UserScript==
// @name         增强版时区劫持(改进UI)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  更可靠的页面时区修改方法，带有友好的选择界面
// @author       kendrick
// @match        *://*.sankuai.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529780/%E5%A2%9E%E5%BC%BA%E7%89%88%E6%97%B6%E5%8C%BA%E5%8A%AB%E6%8C%81%28%E6%94%B9%E8%BF%9BUI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529780/%E5%A2%9E%E5%BC%BA%E7%89%88%E6%97%B6%E5%8C%BA%E5%8A%AB%E6%8C%81%28%E6%94%B9%E8%BF%9BUI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义可用时区及其偏移量（分钟）
    const TIMEZONES = {
        'default': { name: '系统默认', offset: null },
        'china': { name: '中国 (UTC+8)', offset: -480 },
        'europe': { name: '欧洲 (UTC+1)', offset: -60 },
        'middleeast': { name: '中东 (UTC+3)', offset: -180 }
    };

    // 获取保存的时区设置，默认为系统时区
    const selectedTimezone = GM_getValue('selectedTimezone', 'default');

    // 添加CSS样式
    GM_addStyle(`
        .tz-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .tz-modal {
            background: white;
            border-radius: 8px;
            padding: 20px;
            width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .tz-modal-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            text-align: center;
            color: #333;
        }
        .tz-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .tz-option {
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            background: #f8f8f8;
            text-align: center;
        }
        .tz-option:hover {
            background: #e8f0fe;
            border-color: #4285f4;
        }
        .tz-option.selected {
            background: #e8f0fe;
            border-color: #4285f4;
            position: relative;
        }
        .tz-option.selected::after {
            content: "✓";
            position: absolute;
            right: 10px;
            color: #4285f4;
        }
        .tz-indicator {
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            color: white;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            z-index: 9999;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s;
        }
        .tz-indicator:hover {
            opacity: 1;
        }
    `);

    // 如果选择了默认时区，则不进行劫持
    if (selectedTimezone === 'default') {
        setupMenuCommands();
        return;
    }

    // 获取目标时区偏移
    const targetOffset = TIMEZONES[selectedTimezone].offset;

    // 执行注入脚本
    injectScript();

    // 设置菜单命令
    setupMenuCommands();

    // 在页面完全加载后添加时区指示器
    window.addEventListener('load', function() {
        addTimezoneIndicator();
    });

    // 注入脚本到页面
    function injectScript() {
        const scriptText = `
            (function() {
                // 保存原始Date对象
                const OriginalDate = Date;

                // 目标时区偏移（分钟）
                const targetOffset = ${targetOffset};

                // 获取本地时区偏移
                const localOffset = new OriginalDate().getTimezoneOffset();

                // 计算时区差异（分钟）
                const offsetDiff = localOffset - targetOffset;

                // 创建自定义Date构造函数
                function CustomDate() {
                    // 处理不同构造函数调用情况
                    if (arguments.length === 0) {
                        // 无参数调用 - 返回当前时间，但调整为目标时区
                        const date = new OriginalDate();
                        date.setTime(date.getTime() + offsetDiff * 60 * 1000);
                        return date;
                    } else {
                        // 有参数调用 - 正常创建日期对象
                        return new (Function.prototype.bind.apply(
                            OriginalDate,
                            [null].concat(Array.prototype.slice.call(arguments))
                        ))();
                    }
                }

                // 复制静态方法
                CustomDate.UTC = OriginalDate.UTC;
                CustomDate.parse = OriginalDate.parse;

                // 修改now方法以反映目标时区
                CustomDate.now = function() {
                    return OriginalDate.now() + offsetDiff * 60 * 1000;
                };

                // 继承原型
                CustomDate.prototype = OriginalDate.prototype;

                // 修改getTimezoneOffset方法
                const originalGetTimezoneOffset = OriginalDate.prototype.getTimezoneOffset;
                OriginalDate.prototype.getTimezoneOffset = function() {
                    return targetOffset;
                };

                // 覆盖全局Date对象
                window.Date = CustomDate;

                // 输出调试信息
                console.log('[时区修改器] 已将时区修改为: ${TIMEZONES[selectedTimezone].name}');

                // 验证劫持是否成功
                const testDate = new Date();
                console.log('[时区修改器] 当前时间:', testDate.toLocaleString());
                console.log('[时区修改器] 时区偏移:', testDate.getTimezoneOffset(), '分钟');
            })();
        `;

        // 创建脚本元素
        const scriptElement = document.createElement('script');
        scriptElement.textContent = scriptText;

        // 确保脚本尽早执行
        if (document.documentElement) {
            document.documentElement.appendChild(scriptElement);
            document.documentElement.removeChild(scriptElement);
        } else {
            // 如果documentElement不可用，则等待它可用
            const observer = new MutationObserver(function(mutations, obs) {
                if (document.documentElement) {
                    document.documentElement.appendChild(scriptElement);
                    document.documentElement.removeChild(scriptElement);
                    obs.disconnect();
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }

    // 创建时区选择器对话框
    function createTimezoneSelector() {
        // 创建已有的模态框覆盖层
        if (document.querySelector('.tz-modal-overlay')) {
            return;
        }

        const overlay = document.createElement('div');
        overlay.className = 'tz-modal-overlay';

        const modal = document.createElement('div');
        modal.className = 'tz-modal';

        const title = document.createElement('div');
        title.className = 'tz-modal-title';
        title.textContent = '选择时区';

        const options = document.createElement('div');
        options.className = 'tz-options';

        // 创建时区选项
        for (const [key, value] of Object.entries(TIMEZONES)) {
            const option = document.createElement('div');
            option.className = 'tz-option';
            if (key === selectedTimezone) {
                option.classList.add('selected');
            }
            option.textContent = value.name;
            option.dataset.timezone = key;

            option.addEventListener('click', function() {
                const timezone = this.dataset.timezone;
                GM_setValue('selectedTimezone', timezone);
                overlay.remove();
                alert(`已将时区设置为: ${TIMEZONES[timezone].name}\n请刷新页面以应用更改`);
                location.reload();
            });

            options.appendChild(option);
        }

        // 组装模态框
        modal.appendChild(title);
        modal.appendChild(options);
        overlay.appendChild(modal);

        // 点击覆盖层关闭模态框
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        document.body.appendChild(overlay);
    }

    // 设置油猴菜单命令
    function setupMenuCommands() {
        // 时区选择菜单
        GM_registerMenuCommand("选择时区", function() {
            if (document.body) {
                createTimezoneSelector();
            } else {
                // 如果body还不存在，等待DOM加载完成
                window.addEventListener('DOMContentLoaded', createTimezoneSelector);
            }
        });

        // 显示当前时区设置
        GM_registerMenuCommand(`当前时区: ${TIMEZONES[selectedTimezone].name}`, function(){});
    }

    // 添加时区指示器
    function addTimezoneIndicator() {
        if (selectedTimezone === 'default') return;

        const indicator = document.createElement('div');
        indicator.textContent = `🌐 ${TIMEZONES[selectedTimezone].name}`;
        indicator.className = 'tz-indicator';

        indicator.addEventListener('click', function() {
            createTimezoneSelector();
        });

        document.body.appendChild(indicator);
    }
})();