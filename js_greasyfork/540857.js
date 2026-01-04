// ==UserScript==
// @name:en         [MWI]Auto Page Refresh
// @name            [银河奶牛]自动刷新页面
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-auto-page-refresh
// @version         1.1.0
// @description:en  Automatically refresh the page every 57 minutes and record refresh statistics. Synchronizes across multiple tabs.
// @description     每57分钟自动刷新页面并记录刷新统计信息。多标签页同步刷新。
// @author          shenhuanjie
// @license         MIT
// @match           https://www.milkywayidle.com/game*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           none
// @homepage        https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-auto-page-refresh
// @supportURL      https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-auto-page-refresh
// @downloadURL https://update.greasyfork.org/scripts/540857/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/540857/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 创建广播通道用于多标签页通信
    const broadcastChannel = new BroadcastChannel('mwi_auto_refresh');
    
    // 配置参数
    const config = {
        refreshInterval: 57 * 60 * 1000,
        cacheKey: 'pageRefreshData_global',
        channelName: 'mwi_auto_refresh'
    };
    
    // 页面状态
    let isPageActive = !document.hidden;
    let isCountdownActive = false;
    let countdownInterval = null;
    let remainingTime = config.refreshInterval;
    
    // 获取当前时间
    function getLocalTime() {
        return new Date();
    }
    
    // 从localStorage获取刷新记录
    let refreshData = JSON.parse(localStorage.getItem(config.cacheKey));
    if (!refreshData) {
        // 如果没有缓存，初始化并设置当前时间
        refreshData = {
            count: 0,
            lastRefreshTime: getLocalTime().toISOString()
        };
        // 保存初始缓存
        localStorage.setItem(config.cacheKey, JSON.stringify(refreshData));
    }
    
    // 计算下次刷新时间
    let nextRefreshTime = new Date(getLocalTime().getTime() + config.refreshInterval);
 
    // 更新刷新记录
    function updateRefreshData() {
        refreshData.count += 1;
        refreshData.lastRefreshTime = getLocalTime().toISOString();
        localStorage.setItem(config.cacheKey, JSON.stringify(refreshData));
    }
 
    // 创建信息显示面板
    const infoPanel = document.createElement('div');
    infoPanel.style.cssText = `
        position: fixed;
        top: 5px;
        right: 400px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 5px 14px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 199;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        min-width: 200px;
    `;
 
    // 格式化日期时间
    function formatDateTime(dateString) {
        if (!dateString) return '无';
 
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
 
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
 
    // 更新信息面板
    function updateInfoPanel() {
        const currentTime = formatDateTime(getLocalTime().toISOString());
        const pageStatus = isPageActive ? '活跃' : '非活跃';
        const countdownStatus = isCountdownActive ? '进行中' : '已暂停';
        
        infoPanel.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #555; padding-bottom: 6px;">刷新统计</div>
            <div>当前时间: ${currentTime}</div>
            <div>刷新次数: ${refreshData.count}</div>
            <div>上次刷新: ${refreshData.lastRefreshTime ? formatDateTime(refreshData.lastRefreshTime) : '无'}</div>
            <div>页面状态: ${pageStatus} (${countdownStatus})</div>
            <div style="margin-top: 8px; color: #aaa; font-size: 12px;">下次刷新: ${formatDateTime(nextRefreshTime.toISOString())}</div>
        `;
    }
 
    // 首次更新面板
    updateInfoPanel();
    document.body.appendChild(infoPanel);
 
    // 创建倒计时显示元素
    const countdownElement = document.createElement('div');
    countdownElement.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        font-family: Arial, sans-serif;
        font-size: 14px;
        z-index: 199;
    `;
    document.body.appendChild(countdownElement);
    
    // 触发页面刷新
    function triggerRefresh() {
        // 更新刷新记录
        updateRefreshData();
        
        // 通知其他页面刷新
        broadcastChannel.postMessage({
            type: 'refresh',
            timestamp: Date.now()
        });
        
        // 刷新当前页面
        location.reload();
    }
    
    // 计算剩余时间并更新显示
    function updateCountdown() {
        if (!isPageActive || !isCountdownActive) {
            countdownElement.textContent = `倒计时已暂停`;
            return;
        }
        
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        countdownElement.textContent = `即将刷新: ${minutes}分${seconds}秒`;
        
        if (remainingTime <= 0) {
            triggerRefresh();
        } else {
            remainingTime -= 1000;
        }
        
        // 每秒更新时间显示
        updateInfoPanel();
    }
    
    // 启动或停止倒计时
    function toggleCountdown(start) {
        if (start && !isCountdownActive) {
            isCountdownActive = true;
            
            // 广播倒计时状态
            broadcastChannel.postMessage({
                type: 'countdown_started',
                remainingTime: remainingTime,
                nextRefreshTime: nextRefreshTime.toISOString()
            });
            
            // 启动倒计时
            countdownInterval = setInterval(updateCountdown, 1000);
            updateCountdown();
            
            console.log('倒计时已启动');
        } else if (!start && isCountdownActive) {
            isCountdownActive = false;
            
            // 广播倒计时状态
            broadcastChannel.postMessage({
                type: 'countdown_stopped'
            });
            
            // 停止倒计时
            if (countdownInterval) {
                clearInterval(countdownInterval);
                countdownInterval = null;
            }
            
            updateCountdown();
            console.log('倒计时已暂停');
        }
    }
 
    // 处理页面可见性变化
    function handleVisibilityChange() {
        isPageActive = !document.hidden;
        
        // 如果页面变为活跃状态，且没有其他页面在倒计时，则启动倒计时
        if (isPageActive && !isCountdownActive) {
            // 询问其他页面是否有活跃的倒计时
            broadcastChannel.postMessage({
                type: 'request_countdown_status'
            });
            
            // 如果没有收到回复，则在短暂延迟后启动倒计时
            setTimeout(() => {
                if (isPageActive && !isCountdownActive) {
                    toggleCountdown(true);
                }
            }, 500);
        } 
        // 如果页面变为非活跃状态，且当前页面在倒计时，则停止倒计时
        else if (!isPageActive && isCountdownActive) {
            toggleCountdown(false);
        }
        
        updateInfoPanel();
    }
    
    // 处理广播消息
    broadcastChannel.onmessage = function(event) {
        const message = event.data;
        
        switch (message.type) {
            case 'refresh':
                // 收到刷新命令，刷新页面
                console.log('收到刷新命令，正在刷新页面...');
                location.reload();
                break;
                
            case 'countdown_started':
                // 另一个页面启动了倒计时，同步状态
                remainingTime = message.remainingTime;
                nextRefreshTime = new Date(message.nextRefreshTime);
                
                // 如果当前页面也在倒计时，则停止
                if (isCountdownActive) {
                    toggleCountdown(false);
                }
                
                updateInfoPanel();
                break;
                
            case 'countdown_stopped':
                // 如果当前页面是活跃的，且没有其他页面在倒计时，则启动倒计时
                if (isPageActive && !isCountdownActive) {
                    setTimeout(() => {
                        if (isPageActive && !isCountdownActive) {
                            toggleCountdown(true);
                        }
                    }, 500);
                }
                break;
                
            case 'request_countdown_status':
                // 如果当前页面在倒计时，回复状态
                if (isCountdownActive) {
                    broadcastChannel.postMessage({
                        type: 'countdown_started',
                        remainingTime: remainingTime,
                        nextRefreshTime: nextRefreshTime.toISOString()
                    });
                }
                break;
        }
    };
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 初始化：如果页面是活跃的，询问其他页面的状态
    if (isPageActive) {
        broadcastChannel.postMessage({
            type: 'request_countdown_status'
        });
        
        // 如果没有收到回复，则在短暂延迟后启动倒计时
        setTimeout(() => {
            if (isPageActive && !isCountdownActive) {
                toggleCountdown(true);
            }
        }, 500);
    }
    
    console.log(`自动刷新脚本已启动，将在${config.refreshInterval / 60000}分钟后刷新页面`);
})();