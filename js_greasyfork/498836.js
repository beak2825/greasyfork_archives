// ==UserScript==
// @name         自动刷新不活动标签页
// @namespace    http://yuyehk.cn/
// @version      1.2
// @description  如果标签页不活动，20秒后自动刷新，并允许用户设置刷新时间和控制监控开关
// @author       yuyehk
// @match        https://shujufuwubu.feishu.cn/base/bascnaZhzLbJGLSRPUmL6Jwqu6f*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498836/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E4%B8%8D%E6%B4%BB%E5%8A%A8%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/498836/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E4%B8%8D%E6%B4%BB%E5%8A%A8%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从存储中获取刷新间隔时间和监控状态，默认为20秒，监控开启
    let refreshInterval = GM_getValue('refreshInterval', 20000);
    let monitoring = GM_getValue('monitoring', true);

    let refreshTimer;

    // 启动刷新定时器
    function startRefreshTimer() {
        if (!monitoring) return; // 如果监控已关闭，不启动定时器
        stopRefreshTimer(); // 清除已有的定时器
        refreshTimer = setTimeout(function() {
            if (document.hidden) { // 检查文档是否隐藏
                location.reload(); // 如果隐藏，刷新页面
            }
        }, refreshInterval);
    }

    // 停止刷新定时器
    function stopRefreshTimer() {
        if (refreshTimer) {
            clearTimeout(refreshTimer); // 清除定时器
            refreshTimer = null;
        }
    }

    // 创建设置菜单
    function createSettingsMenu() {
        GM_registerMenuCommand('设置刷新间隔', function() {
            let newInterval = prompt('请输入刷新间隔时间（秒）：', refreshInterval / 1000);
            if (newInterval !== null) {
                newInterval = parseInt(newInterval) * 1000;
                if (!isNaN(newInterval) && newInterval > 0) {
                    refreshInterval = newInterval;
                    GM_setValue('refreshInterval', refreshInterval);
                    alert('刷新间隔已设置为 ' + (refreshInterval / 1000) + ' 秒');
                } else {
                    alert('请输入有效的时间（大于0秒）');
                }
            }
        });
    }

    // 创建控制按钮
    function createControlButton() {
        let button = document.createElement('button');
        button.innerText = monitoring ? '停止监控' : '启动监控';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.backgroundColor = '#007bff';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px';
        button.style.borderRadius = '5px';
        button.style.zIndex = '10000';
        button.onclick = function() {
            monitoring = !monitoring;
            GM_setValue('monitoring', monitoring);
            button.innerText = monitoring ? '停止监控' : '启动监控';
            if (monitoring) {
                if (document.hidden) startRefreshTimer();
                alert('监控已启动');
            } else {
                stopRefreshTimer();
                alert('监控已停止');
            }
        };
        document.body.appendChild(button);
    }

    // 监听可见性变化事件
    document.addEventListener('visibilitychange', function() {
        if (monitoring) {
            if (document.hidden) {
                startRefreshTimer(); // 标签页变为不可见时启动定时器
            } else {
                stopRefreshTimer(); // 标签页变为可见时停止定时器
            }
        }
    });

    // 根据初始可见性状态初始化定时器
    if (monitoring && document.hidden) {
        startRefreshTimer(); // 如果页面初始状态为隐藏，启动定时器
    }

    // 创建并注册设置菜单
    createSettingsMenu();
    // 创建控制按钮
    createControlButton();
})();
