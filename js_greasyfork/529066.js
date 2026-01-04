// ==UserScript==
// @name         Emby媒体信息获取助手
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  按需手动获取Emby媒体信息，支持所有媒体类型，代码精简高效
// @license      MIT
// @author       王大锤
// @match        *://*/web/index.html*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/529066/Emby%E5%AA%92%E4%BD%93%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529066/Emby%E5%AA%92%E4%BD%93%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置与缓存
    const CONFIG = {
        cacheExpiry: 24 * 60 * 60 * 1000, // 24小时
        logEnabled: true
    };

    // 简化的日志工具
    const log = {
        info: function (...args) {
            if (CONFIG.logEnabled) console.log('%c[信息]', 'color: blue;', ...args);
        },
        error: function (...args) {
            if (CONFIG.logEnabled) console.log('%c[错误]', 'color: red;', ...args);
        }
    };

    // 缓存工具
    const cache = {
        get: function (key) {
            try {
                const item = localStorage.getItem(key);
                if (!item) return null;

                const parsedItem = JSON.parse(item);
                if (parsedItem.expiry && parsedItem.expiry < Date.now()) {
                    localStorage.removeItem(key);
                    return null;
                }

                return parsedItem.value;
            } catch (error) {
                return null;
            }
        },
        set: function (key, value, expiry = CONFIG.cacheExpiry) {
            try {
                const item = {
                    value: value,
                    expiry: Date.now() + expiry
                };
                localStorage.setItem(key, JSON.stringify(item));
                return true;
            } catch (error) {
                return false;
            }
        },
        remove: function (key) {
            localStorage.removeItem(key);
        }
    };

    // 工具函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function extractItemId() {
        try {
            const hash = window.location.hash;
            const idMatch = /id=([^&]+)/.exec(hash);

            if (idMatch && idMatch[1]) {
                return idMatch[1];
            }
            return null;
        } catch (error) {
            log.error('提取ItemID失败:', error);
            return null;
        }
    }

    // 获取Emby API客户端
    function getApiClient() {
        if (typeof ApiClient !== 'undefined') return ApiClient;
        if (typeof window.ApiClient !== 'undefined') return window.ApiClient;
        return null;
    }

    // 显示状态消息
    function showStatusMessage(message, type = 'info') {
        let statusDiv = document.getElementById('emby-status-info');

        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'emby-status-info';
            statusDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; background: rgba(0,0,0,0.7); color: white; z-index: 9999; border-radius: 5px; max-width: 300px;';
            document.body.appendChild(statusDiv);
        }

        const bgColor = type === 'error' ? 'rgba(180,0,0,0.8)' : 'rgba(0,0,0,0.7)';
        statusDiv.style.background = bgColor;
        statusDiv.textContent = message;

        // 自动隐藏消息（错误消息或包含"完成"字样的消息）
        if (type === 'error' || message.includes('完成')) {
            setTimeout(() => {
                if (statusDiv && statusDiv.parentNode) {
                    document.body.removeChild(statusDiv);
                }
            }, 5000);
        }
    }

    // 使用Emby内置API获取媒体信息
    async function getMediaInfo(itemId) {
        // 检查缓存
        const cacheKey = `media_info_${itemId}`;
        const cachedData = cache.get(cacheKey);

        if (cachedData) {
            log.info('使用缓存的媒体信息:', itemId);
            showMediaInfoResult(cachedData);
            return cachedData;
        }

        // 添加状态提示
        showStatusMessage(`正在获取媒体信息...`);

        // 获取API客户端
        const apiClient = getApiClient();
        if (!apiClient) {
            showStatusMessage('无法获取Emby API客户端', 'error');
            return null;
        }

        try {
            // 使用Emby内置API获取媒体信息
            const playbackInfo = await apiClient.getPlaybackInfo(itemId, {});

            // 获取更详细的项目信息
            const userId = apiClient._serverInfo ? apiClient._serverInfo.UserId : apiClient.getCurrentUserId();
            const itemInfo = await apiClient.getItem(userId, itemId);

            // 合并所有信息
            const fullInfo = {
                playbackInfo: playbackInfo,
                itemInfo: itemInfo
            };

            // 缓存结果
            cache.set(cacheKey, fullInfo);

            // 显示结果
            showMediaInfoResult(fullInfo);
            return fullInfo;

        } catch (error) {
            log.error('获取媒体信息出错:', error);
            showStatusMessage(`获取媒体信息失败: ${error.message}`, 'error');
            return null;
        }
    }

    // 获取电视节目的剧集信息
    async function getTvShowEpisodes(itemId) {
        try {
            const apiClient = getApiClient();
            if (!apiClient) {
                throw new Error('无法获取Emby API客户端');
            }

            const userId = apiClient._serverInfo ? apiClient._serverInfo.UserId : apiClient.getCurrentUserId();

            // 获取电视节目详情
            showStatusMessage(`正在获取电视节目信息...`);

            // 获取项目信息
            const itemInfo = await apiClient.getItem(userId, itemId);
            log.info('获取到的项目信息:', itemInfo);

            // 检查项目类型
            if (itemInfo.Type !== 'Series' && itemInfo.Type !== 'Season') {
                // 如果不是电视剧或季，使用电影处理方式
                log.info('检测到项目类型:', itemInfo.Type);
                await getMediaInfo(itemId);
                return [];
            }

            // 获取季信息或剧集信息
            let episodes = [];

            if (itemInfo.Type === 'Series') {
                // 获取电视剧的季列表
                showStatusMessage(`正在获取季信息...`);
                const seasons = await apiClient.getItems(userId, {
                    parentId: itemId,
                    includeItemTypes: 'Season'
                });

                if (!seasons || !seasons.Items || seasons.Items.length === 0) {
                    throw new Error('无法获取季信息，或者该剧没有季');
                }

                log.info(`找到 ${seasons.Items.length} 个季`);

                // 获取每个季的剧集
                let processed = 0;
                for (const season of seasons.Items) {
                    processed++;
                    showStatusMessage(`正在获取剧集信息 (季 ${processed}/${seasons.Items.length})...`);

                    try {
                        const episodesResult = await apiClient.getItems(userId, {
                            parentId: season.Id,
                            includeItemTypes: 'Episode'
                        });

                        if (episodesResult && episodesResult.Items) {
                            episodes.push(...episodesResult.Items);
                        }
                    } catch (error) {
                        log.error(`获取季 ${season.Name} 的剧集失败:`, error);
                    }

                    // 限流
                    if (processed < seasons.Items.length) {
                        await sleep(300);
                    }
                }
            } else if (itemInfo.Type === 'Season') {
                // 如果直接是季，获取该季的剧集
                showStatusMessage(`正在获取剧集信息...`);
                const episodesResult = await apiClient.getItems(userId, {
                    parentId: itemId,
                    includeItemTypes: 'Episode'
                });

                if (episodesResult && episodesResult.Items) {
                    episodes = episodesResult.Items;
                }
            }

            log.info(`找到 ${episodes.length} 个剧集`);
            return episodes;

        } catch (error) {
            log.error('获取电视节目信息出错:', error);
            showStatusMessage(`获取电视节目信息失败: ${error.message}`, 'error');
            return [];
        }
    }

    // 显示媒体信息结果
    function showMediaInfoResult(data) {
        let statusDiv = document.getElementById('emby-status-info');

        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'emby-status-info';
            statusDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; background: rgba(0,0,0,0.7); color: white; z-index: 9999; border-radius: 5px; max-width: 80%; max-height: 80vh; overflow-y: auto;';
            document.body.appendChild(statusDiv);
        }

        // 提取重要信息
        const mediaSource = data.playbackInfo.MediaSources && data.playbackInfo.MediaSources.length > 0
            ? data.playbackInfo.MediaSources[0] : {};
        const itemInfo = data.itemInfo || {};
        const mediaPath = mediaSource.Path || '未知路径';
        const mediaContainer = mediaSource.Container || '未知容器';

        // 获取媒体流信息
        let videoInfo = '未知';
        let audioInfo = '未知';
        let subtitleInfo = '';

        if (mediaSource.MediaStreams && mediaSource.MediaStreams.length > 0) {
            for (const stream of mediaSource.MediaStreams) {
                if (stream.Type === 'Video') {
                    videoInfo = `${stream.Codec || '未知'} (${stream.Width || '?'}x${stream.Height || '?'})`;
                    if (stream.BitRate) {
                        videoInfo += `, ${Math.round(stream.BitRate / 1000)} kbps`;
                    }
                } else if (stream.Type === 'Audio') {
                    audioInfo = `${stream.Codec || '未知'} (${stream.ChannelLayout || stream.Channels || '?'} 声道)`;
                    if (stream.Language) {
                        audioInfo += `, ${stream.Language}`;
                    }
                } else if (stream.Type === 'Subtitle') {
                    subtitleInfo += `${subtitleInfo ? '<br>' : ''}· ${stream.Language || '未知语言'} (${stream.Codec || '未知格式'})`;
                }
            }
        }

        // 构建基本信息HTML
        let infoHtml = `
            <div>
                <h3 style="margin-top: 0;">媒体信息获取成功</h3>
                <p><strong>名称:</strong> ${itemInfo.Name || '未知'}</p>
                <p><strong>路径:</strong> ${mediaPath}</p>
                <p><strong>容器格式:</strong> ${mediaContainer}</p>
                <p><strong>视频:</strong> ${videoInfo}</p>
                <p><strong>音频:</strong> ${audioInfo}</p>
        `;

        // 如果有字幕，添加字幕信息
        if (subtitleInfo) {
            infoHtml += `<p><strong>字幕:</strong><br>${subtitleInfo}</p>`;
        }

        // 添加详细信息和关闭按钮
        infoHtml += `
                <details>
                    <summary>详细信息</summary>
                    <div style="max-height: 40vh; overflow-y: auto;">
                        <pre style="white-space: pre-wrap; word-break: break-all; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
                    </div>
                </details>
                <button id="close-emby-info" style="margin-top: 10px; padding: 5px 10px;">关闭</button>
            </div>
        `;

        statusDiv.innerHTML = infoHtml;

        document.getElementById('close-emby-info').addEventListener('click', function () {
            if (statusDiv && statusDiv.parentNode) {
                document.body.removeChild(statusDiv);
            }
        });
    }

    // 显示电视节目剧集信息摘要
    function showMediaInfoSummary(episodes) {
        if (!episodes || episodes.length === 0) return;

        let statusDiv = document.getElementById('emby-status-info');

        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'emby-status-info';
            statusDiv.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px; background: rgba(0,0,0,0.8); color: white; z-index: 9999; border-radius: 5px; max-width: 80%; max-height: 80vh; overflow-y: auto;';
            document.body.appendChild(statusDiv);
        }

        // 构建HTML
        let episodesHtml = '';
        episodes.slice(0, 20).forEach((episode) => {
            episodesHtml += `
                <div style="margin-bottom: 8px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    <div><strong>${episode.IndexNumber || '?'}.${episode.Name || '未知'}</strong></div>
                    <div style="font-size: 12px;">${episode.Id}</div>
                    <button class="get-episode-info" data-id="${episode.Id}" style="margin-top: 5px; padding: 3px 8px; background: #2196F3; border: none; border-radius: 3px; color: white; cursor: pointer;">获取信息</button>
                </div>
            `;
        });

        if (episodes.length > 20) {
            episodesHtml += `<div>... 还有 ${episodes.length - 20} 集未显示</div>`;
        }

        statusDiv.innerHTML = `
            <div>
                <h3 style="margin-top: 0;">电视节目信息 (共 ${episodes.length} 集)</h3>
                <div style="max-height: 60vh; overflow-y: auto; margin: 10px 0;">
                    ${episodesHtml}
                </div>
                <div style="margin-top: 10px;">
                    <button id="get-all-episodes" style="padding: 5px 10px; margin-right: 10px; background: #4CAF50; border: none; border-radius: 3px; color: white; cursor: pointer;">获取所有剧集信息</button>
                    <button id="close-emby-info" style="padding: 5px 10px; background: #607D8B; border: none; border-radius: 3px; color: white; cursor: pointer;">关闭</button>
                </div>
            </div>
        `;

        // 绑定事件
        document.getElementById('close-emby-info').addEventListener('click', function () {
            if (statusDiv && statusDiv.parentNode) {
                document.body.removeChild(statusDiv);
            }
        });

        // 获取单个剧集信息
        document.querySelectorAll('.get-episode-info').forEach(button => {
            button.addEventListener('click', async function () {
                const episodeId = this.getAttribute('data-id');
                if (episodeId) {
                    await getMediaInfo(episodeId);
                }
            });
        });

        // 获取所有剧集信息
        document.getElementById('get-all-episodes').addEventListener('click', async function () {
            this.disabled = true;
            this.textContent = '处理中...';

            let processed = 0;
            const totalEpisodes = episodes.length;

            for (const episode of episodes) {
                processed++;
                showStatusMessage(`处理剧集 ${processed}/${totalEpisodes}...`);

                try {
                    await getMediaInfo(episode.Id);
                    // 适当延迟，防止请求过快
                    await sleep(300);
                } catch (error) {
                    log.error(`处理剧集 ${episode.Name} 出错:`, error);
                }

                // 每处理5个剧集暂停一下，防止请求过多
                if (processed % 5 === 0 && processed < totalEpisodes) {
                    await sleep(1000);
                }
            }

            showStatusMessage(`所有剧集处理完成 (${processed}/${totalEpisodes})`);
            this.textContent = '已完成';
        });
    }

    // 清除媒体信息缓存
    function clearMediaInfoCache() {
        const prefix = 'media_info_';
        let count = 0;

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                localStorage.removeItem(key);
                count++;
            }
        }

        log.info(`已清除 ${count} 条媒体信息缓存`);
    }

    // 添加操作按钮
    function addActionButtons() {
        // 移除现有按钮（如果存在）
        const existingButtons = document.querySelectorAll('.emby-custom-button');
        existingButtons.forEach(button => {
            if (button && button.parentNode) {
                button.parentNode.removeChild(button);
            }
        });

        // 添加刷新按钮
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '获取媒体信息';
        refreshButton.className = 'emby-custom-button';
        refreshButton.style.cssText = 'position: fixed; bottom: 20px; right: 20px; padding: 10px; background: #00a8ff; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 9999;';

        refreshButton.addEventListener('click', async function () {
            // 移除现有的媒体信息显示
            const existingInfo = document.getElementById('emby-status-info');
            if (existingInfo && existingInfo.parentNode) {
                document.body.removeChild(existingInfo);
            }

            const itemId = extractItemId();

            if (!itemId) {
                showStatusMessage('无法识别当前项目ID，请确保您在媒体详情页面', 'error');
                return;
            }

            // 清除此项目的缓存
            const cacheKey = `media_info_${itemId}`;
            cache.remove(cacheKey);

            try {
                // 获取API客户端
                const apiClient = getApiClient();
                if (!apiClient) {
                    showStatusMessage('无法获取Emby API客户端', 'error');
                    return;
                }

                const userId = apiClient._serverInfo ? apiClient._serverInfo.UserId : apiClient.getCurrentUserId();

                // 获取项目信息
                showStatusMessage('正在获取项目信息...');
                const itemInfo = await apiClient.getItem(userId, itemId);

                log.info('项目类型:', itemInfo.Type);

                // 根据项目类型决定处理方式
                if (itemInfo.Type === 'Series' || itemInfo.Type === 'Season') {
                    // 电视剧系列或季
                    const episodes = await getTvShowEpisodes(itemId);

                    if (episodes.length > 0) {
                        showMediaInfoSummary(episodes);
                    } else {
                        showStatusMessage('没有找到剧集信息', 'error');
                    }
                } else {
                    // 电影、单集或其他类型
                    await getMediaInfo(itemId);
                }
            } catch (error) {
                log.error('处理媒体信息出错:', error);
                showStatusMessage(`处理媒体信息失败: ${error.message}`, 'error');

                // 出错时尝试直接获取媒体信息
                try {
                    await getMediaInfo(itemId);
                } catch (fallbackError) {
                    log.error('备用方法也失败:', fallbackError);
                }
            }
        });

        document.body.appendChild(refreshButton);

        // 添加清除缓存按钮
        const clearCacheButton = document.createElement('button');
        clearCacheButton.textContent = '清除缓存';
        clearCacheButton.className = 'emby-custom-button';
        clearCacheButton.style.cssText = 'position: fixed; bottom: 20px; right: 150px; padding: 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 9999;';

        clearCacheButton.addEventListener('click', function () {
            clearMediaInfoCache();
            showStatusMessage('媒体信息缓存已清除');
        });

        document.body.appendChild(clearCacheButton);
    }

    // 初始化
    function init() {
        log.info('Emby媒体信息获取助手-精简版已启动');

        // 添加按钮
        setTimeout(() => {
            addActionButtons();

            // 监听URL变化
            let lastUrl = window.location.href;
            setInterval(() => {
                const currentUrl = window.location.href;
                if (currentUrl !== lastUrl) {
                    lastUrl = currentUrl;
                    addActionButtons();
                }
            }, 1000);
        }, 1000);
    }

    // 启动脚本
    init();
})();