// ==UserScript==
// @name         TikTok博主解析工具
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  拦截TikTok API请求并解析博主数据，支持实时显示和CSV导出
// @author       Developer
// @match        *://www.tiktok.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547326/TikTok%E5%8D%9A%E4%B8%BB%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/547326/TikTok%E5%8D%9A%E4%B8%BB%E8%A7%A3%E6%9E%90%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 存储所有收集到的博主数据
    let creatorsData = [];
    let controlPanel = null;
    let countDisplay = null;

    // 提取邮箱或返回原始文本
    function extractEmailOrOriginal(text) {
        if (!text) return '';

        // 邮箱正则表达式
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emails = text.match(emailRegex);

        // 如果找到邮箱，返回第一个邮箱，否则返回原始文本
        return emails && emails.length > 0 ? emails[0] : "";
    }

    // 创建控制面板
    function createControlPanel() {
        if (controlPanel) return;

        controlPanel = document.createElement('div');
        controlPanel.id = 'tiktok-scraper-panel';
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            min-width: 200px;
            backdrop-filter: blur(10px);
        `;

        controlPanel.innerHTML = `
            <div style="text-align: center; margin-bottom: 10px;">
                <strong>🎯 TikTok博主解析</strong>
            </div>
            <div id="count-display" style="text-align: center; margin-bottom: 15px; font-size: 16px; font-weight: bold;">
                已收集: <span id="count-number">0</span> 位博主
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="export-csv-btn" style="
                    flex: 1;
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s;
                " onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    📊 导出CSV
                </button>
                <button id="clear-data-btn" style="
                    flex: 1;
                    background: rgba(255,255,255,0.2);
                    border: 1px solid rgba(255,255,255,0.3);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s;
                " onmouseover="this.style.background='rgba(255,100,100,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">
                    🗑️ 清空
                </button>
            </div>
            <div style="margin-top: 10px; font-size: 11px; text-align: center; opacity: 0.8;">
                滚动页面自动收集数据
            </div>
        `;

        document.body.appendChild(controlPanel);

        countDisplay = document.getElementById('count-number');

        // 绑定导出按钮事件
        document.getElementById('export-csv-btn').addEventListener('click', exportToCSV);

        // 绑定清空按钮事件
        document.getElementById('clear-data-btn').addEventListener('click', clearData);
    }

    // 更新数量显示
    function updateCountDisplay() {
        if (countDisplay) {
            countDisplay.textContent = creatorsData.length;
            // 添加动画效果
            countDisplay.style.transform = 'scale(1.2)';
            setTimeout(() => {
                countDisplay.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // 导出为CSV格式
    function exportToCSV() {
        if (creatorsData.length === 0) {
            alert('暂无数据可导出！请先滚动页面收集博主数据。');
            return;
        }

        // CSV表头
        const headers = [
            '用户主页','用户ID', '昵称', '个人简介', '是否认证', '是否私密账户', '头像链接',
            '粉丝数', '关注数', '获赞数', '视频数', '点赞数',
            '最新视频描述', '最新视频播放数', '最新视频点赞数', '最新视频评论数', '最新视频分享数', '最新视频收藏数',
            '安全ID', '创建时间', '地区'
        ];

        // 构建CSV内容
        let csvContent = headers.join(',') + '\n';

        creatorsData.forEach(creator => {
            const row = [
                `"https://www.tiktok.com/@${creator.uniqueId || ''}",`,
                `"${creator.uniqueId || ''}",`,
                `"${(creator.nickname || '').replace(/"/g, '""')}",`,
                `"${extractEmailOrOriginal(creator.signature || '').replace(/"/g, '""')}",`,
                `"${creator.verified ? '是' : '否'}",`,
                `"${creator.privateAccount ? '是' : '否'}",`,
                `"${creator.avatarLarger || ''}",`,
                `"${creator.followerCount || 0}",`,
                `"${creator.followingCount || 0}",`,
                `"${creator.heartCount || 0}",`,
                `"${creator.videoCount || 0}",`,
                `"${creator.diggCount || 0}",`,
                `"${(creator.lastVideoDesc || '').replace(/"/g, '""')}",`,
                `"${creator.lastVideoPlayCount || 0}",`,
                `"${creator.lastVideoDiggCount || 0}",`,
                `"${creator.lastVideoCommentCount || 0}",`,
                `"${creator.lastVideoShareCount || 0}",`,
                `"${creator.lastVideoCollectCount || 0}",`,
                `"${creator.secUid || ''}",`,
                `"${creator.createTime || ''}",`,
                `"${creator.region || ''}"`
            ];
            csvContent += row.join('') + '\n';
        });

        // 创建下载链接
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `tiktok_creators_${new Date().toISOString().slice(0,10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 显示成功提示
        showNotification(`✅ 成功导出 ${creatorsData.length} 位博主数据！`, 'success');
    }

    // 清空数据
    function clearData() {
        if (confirm('确定要清空所有收集的博主数据吗？')) {
            creatorsData = [];
            updateCountDisplay();
            showNotification('🗑️ 数据已清空！', 'info');
        }
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const colors = {
            success: '#4CAF50',
            error: '#f44336',
            info: '#2196F3'
        };

        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            animation: slideIn 0.3s ease-out;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 添加CSS动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        #count-number {
            transition: transform 0.2s ease;
        }
    `;
    document.head.appendChild(style);

    // 覆盖fetch函数以拦截API请求
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
        const url = typeof input === 'string' ? input : input.url;

        if (url.includes('/api/challenge/item_list')) {
            console.log('拦截到TikTok API请求:', url);

            // 执行请求并处理响应
            const response = await originalFetch.apply(this, arguments);
            const clonedResponse = response.clone();

            try {
                const data = await clonedResponse.json();
                console.log('解析到的博主数据:', data);
                // 处理解析到的数据
                if (data.itemList && data.itemList.length > 0) {
                    processCreatorsData(data.itemList);
                }
            } catch (error) {
                console.error('解析响应数据时出错:', error);
            }

            return response;
        }

        // 对于其他请求，正常执行
        return originalFetch.apply(this, arguments);
    };

    // 处理博主数据
    const processCreatorsData = (itemList) => {
        let newCount = 0;

        itemList.forEach(item => {
            const author = item.author;
            const authorStats = item.authorStats || item.authorStatsV2;
            const videoStats = item.stats || item.statsV2;

            // 检查是否已存在该博主数据
            const exists = creatorsData.some(c => c.uniqueId === author.uniqueId);
            if (exists) return;

            // 收集博主数据
            creatorsData.push({
                // 基础信息
                uniqueId: author.uniqueId,
                nickname: author.nickname,
                signature: author.signature,
                verified: author.verified,
                privateAccount: author.privateAccount,
                avatarLarger: author.avatarLarger,

                // 统计数据
                followerCount: authorStats.followerCount || 0,
                followingCount: authorStats.followingCount || 0,
                heartCount: authorStats.heartCount || 0,
                videoCount: authorStats.videoCount || 0,
                diggCount: authorStats.diggCount || 0,

                // 视频数据
                lastVideoDesc: item.desc || '',
                lastVideoPlayCount: videoStats.playCount || 0,
                lastVideoDiggCount: videoStats.diggCount || 0,
                lastVideoCommentCount: videoStats.commentCount || 0,
                lastVideoShareCount: videoStats.shareCount || 0,
                lastVideoCollectCount: videoStats.collectCount || 0,

                // 其他信息
                secUid: author.secUid,
                createTime: item.createTime ? new Date(item.createTime * 1000).toISOString() : '',
                region: author.region || ''
            });
            newCount++;
        });

        if (newCount > 0) {
            console.log(`新增 ${newCount} 位博主，总计 ${creatorsData.length} 位博主数据`);
            updateCountDisplay();
            showNotification(`🎉 新增 ${newCount} 位博主数据！`, 'success');
        }
    };

    // 等待页面加载完成后创建控制面板
    function initializePanel() {
        if (document.body) {
            createControlPanel();
        } else {
            setTimeout(initializePanel, 100);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePanel);
    } else {
        initializePanel();
    }

    console.log('TikTok博主解析脚本已加载 - 增强版');
})();