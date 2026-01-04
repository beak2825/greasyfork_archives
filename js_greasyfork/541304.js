// ==UserScript==
// @name         湖南大学CG平台自动选择C++
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在湖南大学CG平台提交题目前自动选择C++
// @author       淼畔
// @match        https://cg.hnu.edu.cn/*
// @grant        none
// @license      MIT
// @icon         https://cg.hnu.edu.cn/images/cgicon.png
// @downloadURL https://update.greasyfork.org/scripts/541304/%E6%B9%96%E5%8D%97%E5%A4%A7%E5%AD%A6CG%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9C%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/541304/%E6%B9%96%E5%8D%97%E5%A4%A7%E5%AD%A6CG%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9C%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const TARGET_LANGUAGE = 'c++';
    const MAX_RETRIES = 8;          // 增加重试次数
    const INITIAL_DELAY = 300;      // 初始延迟(毫秒)
    const RETRY_INTERVAL = 400;     // 重试间隔(毫秒)

    // 静默设置语言的核心函数
    function setLanguageSilently(attempt = 0) {
        try {
            const languageSelect = document.getElementById('languages') ||
                                 document.querySelector('select[name="progLanguage"]');

            if (languageSelect) {
                // 检查是否已经是目标语言
                if (languageSelect.value === TARGET_LANGUAGE) {
                    return true;
                }

                // 设置目标语言
                languageSelect.value = TARGET_LANGUAGE;

                // 触发所有可能的事件
                const events = ['change', 'input', 'click'];
                events.forEach(eventType => {
                    const event = new Event(eventType, { bubbles: true });
                    languageSelect.dispatchEvent(event);
                });

                // 验证是否设置成功
                if (languageSelect.value === TARGET_LANGUAGE) {
                    return true;
                }
            }

            // 重试逻辑
            if (attempt < MAX_RETRIES) {
                setTimeout(() => setLanguageSilently(attempt + 1), RETRY_INTERVAL);
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    // 初始化函数
    function initSilently() {
        // 初始延迟后执行
        setTimeout(() => {
            // 立即尝试一次
            setLanguageSilently();

            // 监听DOM变化
            const observer = new MutationObserver(() => {
                setLanguageSilently();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 处理SPA路由变化
            window.addEventListener('popstate', () => {
                setTimeout(setLanguageSilently, 100);
            });
        }, INITIAL_DELAY);
    }

    // 启动逻辑
    if (document.readyState === 'complete') {
        initSilently();
    } else {
        const onReady = () => {
            document.removeEventListener('DOMContentLoaded', onReady);
            window.removeEventListener('load', onReady);
            initSilently();
        };
        document.addEventListener('DOMContentLoaded', onReady);
        window.addEventListener('load', onReady);
    }
})();