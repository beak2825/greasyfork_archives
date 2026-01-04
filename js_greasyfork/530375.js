// ==UserScript==
// @name         梦邀请内容替换助手
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动替换邀请页面的默认文本内容
// @author       DP
// @match        https://zmpt.cc/invite.php*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530375/%E6%A2%A6%E9%82%80%E8%AF%B7%E5%86%85%E5%AE%B9%E6%9B%BF%E6%8D%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530375/%E6%A2%A6%E9%82%80%E8%AF%B7%E5%86%85%E5%AE%B9%E6%9B%BF%E6%8D%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义邀请内容 (支持多行文本)
    const CUSTOM_MESSAGE = `召唤师你好,

久等啦！这封官方邀请函，跨越山海，终于奔赴到你手中。

织梦致力于打造综合型PT站，现有官组ZmPT、ZmWeb和ZmMusic，主打WebDL，官组更新速度较快
除影视综合外，另有声音类（音乐，有声书）和软件游戏板块。
目前已支持NT/IYUU/MP/Pocket QT四工具认证

站点无新手考核
上传速度限制在100MB/s以下
注册7天内无流量将会被封禁

宝可梦世界即将开启，皮卡丘满心欢喜，开始期待召唤师大驾光临，一同踏上冒险之旅！

以织梦之名，为爱起航，造就梦想！

欢迎到来!
Pika Pika 皮卡丘~`;

    // 配置参数
    const CONFIG = {
        retryTimes: 5,          // 最大重试次数
        retryInterval: 800      // 重试间隔(ms)
    };

    let isExecuted = false;
    let cachedTextarea = null;
    let retryCount = 0;
    let observer = null;

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        .zmpt-custom-textarea {
            font-family: 'Microsoft Yahei', sans-serif !important;
            line-height: 1.6 !important;
            padding: 15px !important;
            background: #fff9e6 !important;
            border-radius: 8px !important;
            border: 2px solid #ffd700 !important;
        }
    `;
    document.head.appendChild(style);

    // 智能替换函数
    function replaceInviteContent() {
        if (isExecuted) return true;
        cachedTextarea = cachedTextarea || document.querySelector('textarea[name="body"]');
        if (cachedTextarea) {
            // 设置内容
            cachedTextarea.value = CUSTOM_MESSAGE;
            cachedTextarea.defaultValue = CUSTOM_MESSAGE;

            // 应用样式
            cachedTextarea.classList.add('zmpt-custom-textarea');

            // 添加输入保护
            cachedTextarea.addEventListener('input', function handler(e) {
                if (e.target.value !== CUSTOM_MESSAGE) {
                    e.target.value = CUSTOM_MESSAGE;
                    this.removeEventListener('input', handler);
                    if (typeof layer !== 'undefined') {
                        layer.msg('内容已锁定保护', {icon: 1, time: 2000});
                    }
                }
            }, {once: true});

            isExecuted = true;
            console.log('邀请内容已成功替换');
            return true;
        }
        return false;
    }

    // 初始化函数
    function init() {
        if (replaceInviteContent()) {
            if (observer) {
                observer.disconnect();
            }
            clearInterval(retryHandler);
        }
    }

    // 自动重试机制
    const retryHandler = setInterval(() => {
        init();
        if (retryCount++ >= CONFIG.retryTimes) {
            clearInterval(retryHandler);
        }
    }, CONFIG.retryInterval);

    // 监听AJAX动态加载
    observer = new MutationObserver(mutations => {
        if (document.contains(cachedTextarea)) {
            init();
        }
    });

    // 启动观察，限定范围
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面完全加载后再次确认
    window.addEventListener('load', () => {
        init();
        // 添加操作提示
        if (typeof layer !== 'undefined') {
            layer.msg('自动填充完成', {icon: 1, time: 3000});
        }
    });

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('脚本异常:', e);
        clearInterval(retryHandler);
        if (observer) {
            observer.disconnect();
        }
    });

})();