// ==UserScript==
// @name         网盘资源查找助手：快速获取IMDb、TMDb、豆瓣电影资源
// @namespace    https://github.com/yourusername
// @version      2.0.3
// @description  自动搜索IMDB、TMDB、豆瓣电影资源，快速获取夸克、百度网盘、阿里云盘资源链接！
// @author       Your Name
// @icon           https://img3.doubanio.com/favicon.ico
// @match        *://*.themoviedb.org/*
// @match        *://*.douban.com/subject/*
// @match        *://*.imdb.com/title/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530227/%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90%E6%9F%A5%E6%89%BE%E5%8A%A9%E6%89%8B%EF%BC%9A%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96IMDb%E3%80%81TMDb%E3%80%81%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90.user.js
// @updateURL https://update.greasyfork.org/scripts/530227/%E7%BD%91%E7%9B%98%E8%B5%84%E6%BA%90%E6%9F%A5%E6%89%BE%E5%8A%A9%E6%89%8B%EF%BC%9A%E5%BF%AB%E9%80%9F%E8%8E%B7%E5%8F%96IMDb%E3%80%81TMDb%E3%80%81%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E8%B5%84%E6%BA%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        .resource-panel {
            position: fixed;
            top: 60px;
            right: 20px;
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            z-index: 9999;
            width: 300px;
            font-family: Arial, sans-serif;
        }
        .resource-item {
            margin: 10px 0;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #01b4e4;
        }
        .resource-title {
            margin-bottom: 8px;
            color: #01b4e4;
            font-weight: bold;
        }
        .resource-link {
            display: inline-block;
            padding: 6px 12px;
            background: #01b4e4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-size: 13px;
        }
    `);

    // 从URL中提取媒体信息
    function extractMediaInfo() {
        const url = window.location.href;
        
        // TMDB匹配
        const tmdbPattern = /themoviedb\.org\/(movie|tv|collection)\/(\d+)/;
        const tmdbMatch = url.match(tmdbPattern);
        if (tmdbMatch) {
            return {
                source: 'tmdb',
                mediaType: tmdbMatch[1],
                id: tmdbMatch[2]
            };
        }

    // IMDB匹配
    const imdbPattern = /imdb\.com\/title\/(tt\d+)/;
    const imdbMatch = url.match(imdbPattern);
    if (imdbMatch) {
        return {
            source: 'imdb',
            id: imdbMatch[1]
        };
    }
    
        
        // 豆瓣匹配
        const doubanPattern = /movie\.douban\.com\/subject\/(\d+)/;
        const doubanMatch = url.match(doubanPattern);
        if (doubanMatch) {
            return {
                source: 'douban',
                id: doubanMatch[1]
            };
        }
        
        return null;
    }

    // 从豆瓣页面提取 IMDb ID
    function extractIMDbId() {
        const spans = document.querySelectorAll('span.pl');
        for (const span of spans) {
            if (span.textContent.includes('IMDb:')) {
                const imdbText = span.nextSibling?.textContent?.trim();
                if (imdbText && imdbText.startsWith('tt')) {
                    return imdbText;
                }
            }
        }
        return null;
    }

    // 格式化文件大小
    function formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 获取平台名称
    function getPlatformName(url) {
        if (url.includes('https://pan.quark.cn')) return '夸克网盘';
        if (url.includes('https://pan.baidu.com')) return '百度网盘';
        if (url.includes('https://www.alipan.com')) return '阿里云盘';
        return '未知平台';
    }

    // 创建浮动面板
    function createFloatingPanel(result) {
        // 移除已存在的面板
        const existingPanel = document.querySelector('.resource-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.className = 'resource-panel';

        let content = `
            <div style="position: absolute; top: 10px; right: 10px; cursor: pointer;" class="close-btn">×</div>
            <h3 style="margin: 0 0 15px 0; color: #333; font-size: 16px;">
                找到 ${result.total} 个资源
            </h3>
        `;

        if (result.data && result.data.length > 0) {
            content += `<div style="max-height: 400px; overflow-y: auto;">`;
            result.data.forEach(resource => {
                content += `
                    <div class="resource-item">
                        <div class="resource-title">
                            ${resource.quality} ${getPlatformName(resource.url)}资源
                        </div>
                        ${resource.release_type ? `
                            <div style="font-size: 13px; color: #666; margin-bottom: 4px;">
                                发布类型: ${resource.release_type}
                            </div>
                        ` : ''}
                        ${resource.size ? `
                            <div style="font-size: 13px; color: #666; margin-bottom: 4px;">
                                大小: ${formatSize(resource.size)}
                            </div>
                        ` : ''}
                        <div style="font-size: 13px; color: #666; margin-bottom: 8px;">
                            语言: ${resource.languages ? resource.languages.join(', ') : ''}
                        </div>
                        <a href="${resource.url}" target="_blank" class="resource-link">
                            打开链接${resource.password ? ' (密码: ' + resource.password + ')' : ''}
                        </a>
                    </div>
                `;
            });
            content += `</div>`;
        } else {
            content += `<div style="color: #666;">未找到资源</div>`;
        }

        panel.innerHTML = content;
        document.body.appendChild(panel);

        // 添加关闭按钮事件
        panel.querySelector('.close-btn').addEventListener('click', () => panel.remove());
    }

    // 主要执行函数
    async function init() {
        const info = extractMediaInfo();
        if (!info) return;

        try {
            let apiUrl;
            
            if (info.source === 'tmdb') {
                const mediaType = info.mediaType === 'tv' ? 'season' : info.mediaType;
                apiUrl = `https://api.aipan.xyz/api/${mediaType}/${info.id}/resources`;
            } else if (info.source === 'douban') {
                const imdbId = extractIMDbId();
                if (!imdbId) {
                    createFloatingPanel({
                        data: [],
                        total: 0,
                        message: '未找到IMDb ID'
                    });
                    return;
                }
                apiUrl = `https://api.aipan.xyz/api/imdb/${imdbId}/resources`;
            } else if (info.source === 'imdb') {
            apiUrl = `https://api.aipan.xyz/api/imdb/${info.id}/resources`;
        }

            // 使用 GM_xmlhttpRequest 替代 fetch
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        createFloatingPanel(data);
                    } else {
                        createFloatingPanel({
                            data: [],
                            total: 0,
                            message: '获取资源失败'
                        });
                    }
                },
                onerror: function(error) {
                    console.error('Error:', error);
                    createFloatingPanel({
                        data: [],
                        total: 0,
                        message: '获取资源失败'
                    });
                }
            });
        } catch (error) {
            console.error('Error:', error);
            createFloatingPanel({
                data: [],
                total: 0,
                message: '获取资源失败'
            });
        }
    }

    // 启动脚本
    init();
})();