// ==UserScript==
// @name         抖音视频信息爬取A5
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  获取抖音网页版当前视频的点赞、评论、收藏、转发、标题、作者昵称，支持视频页、精选页、搜索页，增强容错
// @author       观澜话不多
// @license MIT
// @match        https://www.douyin.com/video/*
// @match        https://www.douyin.com/jingxuan*
// @match        https://www.douyin.com/root/search/*
// @match        https://www.douyin.com/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542682/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E7%88%AC%E5%8F%96A5.user.js
// @updateURL https://update.greasyfork.org/scripts/542682/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%BF%A1%E6%81%AF%E7%88%AC%E5%8F%96A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建信息面板
    function createInfoPanel() {
        const existingPanel = document.getElementById('douyin-info-panel');
        if (existingPanel) return existingPanel;

        const panel = document.createElement('div');
        panel.id = 'douyin-info-panel';
        panel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            width: 160px;
            padding: 12px;
            background-color: rgba(247, 248, 250, 0.98);
            color: #1D2129;
            border-radius: 8px;
            z-index: 9999;
            font-size: 12px;
            line-height: 1.4;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", Arial, sans-serif;
            transition: all 0.15s ease;
            border: 1px solid #E5E6EB;
            will-change: transform;
            transform: translate3d(0, 0, 0);
        `;

        // 添加标题栏和关闭按钮
        const headerBar = document.createElement('div');
        headerBar.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 8px;
            margin-bottom: 8px;
            border-bottom: 1px solid #E5E6EB;
            cursor: move;
            user-select: none;
            position: relative;
        `;

        // 添加拖拽提示图标
        const dragIcon = document.createElement('div');
        dragIcon.innerHTML = '⋮⋮';
        dragIcon.style.cssText = `
            position: absolute;
            left: -8px;
            top: 0;
            font-size: 10px;
            color: #86909C;
            transform: rotate(90deg);
            cursor: move;
        `;
        headerBar.appendChild(dragIcon);

        const title = document.createElement('div');
        title.textContent = '视频信息';
        title.style.cssText = `
            font-weight: 600;
            font-size: 14px;
            color: #1D2129;
            margin-left: 8px;
            flex-grow: 1;
        `;

        const closeBtn = document.createElement('div');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            cursor: pointer;
            font-size: 12px;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            color: #4E5969;
            transition: all 0.2s;
        `;
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.backgroundColor = '#F2F3F5';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.backgroundColor = 'transparent';
        });
        closeBtn.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        headerBar.appendChild(title);
        headerBar.appendChild(closeBtn);
        panel.appendChild(headerBar);

        // 添加内容容器
        const contentContainer = document.createElement('div');
        contentContainer.id = 'douyin-info-content';
        panel.appendChild(contentContainer);

        document.body.appendChild(panel);

        // 添加拖拽功能
        makeElementDraggable(panel);

        return panel;
    }

    // 拖拽功能实现
    function makeElementDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // 添加拖拽手柄样式
        const header = element.querySelector('div:first-child');
        if (header) {
            header.style.cursor = 'move';
            header.addEventListener('mousedown', dragMouseDown);
        } else {
            element.addEventListener('mousedown', dragMouseDown);
        }

        function dragMouseDown(e) {
            // 如果不是鼠标左键，不处理
            if (e.button !== 0) return;

            // 阻止文本选择
            e.preventDefault();
            e.stopPropagation();

            // 获取鼠标位置
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 设置拖拽状态样式
            element.style.transition = 'none';
            element.style.opacity = '0.92';
            element.style.transform = 'scale(1.02)';
            element.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)';

            // 添加鼠标移动和松开事件监听
            document.addEventListener('mouseup', closeDragElement);
            document.addEventListener('mousemove', elementDrag, { passive: false });

            // 添加鼠标离开窗口的监听
            document.addEventListener('mouseleave', closeDragElement);
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            e.stopPropagation();

            // 使用requestAnimationFrame优化性能
            if (elementDrag.ticking) return;

            elementDrag.ticking = true;
            requestAnimationFrame(() => {
                // 计算新位置（直接使用鼠标位置差值，提高响应速度）
                const dx = e.clientX - pos3;
                const dy = e.clientY - pos4;
                pos3 = e.clientX;
                pos4 = e.clientY;

                // 确保面板不会移出视口
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;

                const newTop = Math.min(Math.max(0, element.offsetTop + dy), maxY);
                const newLeft = Math.min(Math.max(0, element.offsetLeft + dx), maxX);

                // 直接设置元素新位置，使用transform提高性能
                element.style.top = newTop + "px";
                element.style.left = newLeft + "px";
                element.style.right = 'auto';

                elementDrag.ticking = false;
            });

            // 使用节流方式保存位置，避免频繁写入本地存储
            elementDrag.saveTimeout = elementDrag.saveTimeout || 0;
            clearTimeout(elementDrag.saveTimeout);
            elementDrag.saveTimeout = setTimeout(() => {
                localStorage.setItem('douyin_info_panel_x', element.offsetLeft);
                localStorage.setItem('douyin_info_panel_y', element.offsetTop);
            }, 300);
        }

        function closeDragElement() {
            // 恢复正常样式
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            element.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15)';
            element.style.transition = 'all 0.2s ease';

            // 移除事件监听
            document.removeEventListener('mouseup', closeDragElement);
            document.removeEventListener('mousemove', elementDrag);
            document.removeEventListener('mouseleave', closeDragElement);

            // 立即保存最终位置
            localStorage.setItem('douyin_info_panel_x', element.offsetLeft);
            localStorage.setItem('douyin_info_panel_y', element.offsetTop);

            // 重置状态
            elementDrag.ticking = false;
        }

        // 从本地存储读取上次位置
        const savedX = localStorage.getItem('douyin_info_panel_x');
        const savedY = localStorage.getItem('douyin_info_panel_y');

        if (savedX !== null && savedY !== null) {
            element.style.left = savedX + 'px';
            element.style.top = savedY + 'px';
            element.style.right = 'auto';
        }
    }

    // 获取aweme_id（支持/video/、/jingxuan、/root/search、/search，modal_id参数）
    function getAwemeId() {
        // 1. 视频页
        let match = window.location.pathname.match(/\/video\/(\d+)/);
        if (match) return match[1];
        // 2. modal弹窗页
        const url = new URL(window.location.href);
        const modalId = url.searchParams.get('modal_id');
        if (modalId && /^\d+$/.test(modalId)) return modalId;
        return null;
    }

    // 构造通用参数
    function getCommonParams() {
        const params = {};
        params["aid"] = 6383;
        params["device_platform"] = "webapp";
        params["channel"] = "channel_pc_web";
        params["version_code"] = 170400;
        params["version_name"] = "17.4.0";
        params["platform"] = "PC";
        params["pc_client_type"] = 1;
        params["cookie_enabled"] = navigator.cookieEnabled;
        params["screen_width"] = screen.width;
        params["screen_height"] = screen.height;
        params["browser_language"] = navigator.language;
        params["browser_platform"] = navigator.platform;
        params["browser_online"] = navigator.onLine;
        params["cpu_core_num"] = navigator.hardwareConcurrency;
        params["device_memory"] = navigator.deviceMemory || '';
        params["downlink"] = (navigator.connection && navigator.connection.downlink) || '';
        params["effective_type"] = (navigator.connection && navigator.connection.effectiveType) || '';
        params["round_trip_time"] = (navigator.connection && navigator.connection.rtt) || '';
        return params;
    }

    async function fetchVideoInfo(awemeId) {
        const params = getCommonParams();
        params["aweme_id"] = awemeId;
        const paramStr = Object.entries(params).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&');
        const url = `https://www.douyin.com/aweme/v1/web/aweme/detail/?${paramStr}`;
        const resp = await fetch(url, {
            credentials: 'include',
            headers: {
                'accept': 'application/json',
                'referer': window.location.href,
            }
        });
        const text = await resp.text();
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('接口返回内容不是JSON:', text);
            showErrorMessage('获取视频信息失败：接口返回内容不是JSON，可能被反爬、未登录或需滑块验证。\n请检查是否已登录抖音网页版，或手动通过滑块验证后重试。');
            throw new Error('接口返回内容不是JSON');
        }
    }

    async function getVideoDirectUrl(videoUrl) {
        // 兼顾国际和移动端特征的请求头
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36',
            'Referer': 'https://www.douyin.com/',
            'Accept-Language': 'en-US,en;q=0.9',
            'Range': 'bytes=0-1024', // 只请求视频的一小部分用于验证
        };

        console.log('开始寻找可用的视频直链, 原始链接:', videoUrl);

        // 使用 Set 存储待测试的URL，避免重复
        const urlsToTry = new Set();

        // 解析原始URL
        let originalUrl;
        try {
            originalUrl = new URL(videoUrl);
        } catch (e) {
            console.error('URL解析失败:', e);
            return videoUrl; // 如果URL无效，直接返回原始URL
        }

        // 提取视频ID信息从路径
        const pathParts = originalUrl.pathname.split('/');
        const hash1 = pathParts[1] || '';
        const hash2 = pathParts[2] || '';
        const remainingPath = pathParts.slice(3).join('/');

        // 检查原始链接是否为web格式
        const isWebFormat = originalUrl.hostname.includes('-web.douyinvod.com');

        // 如果原始链接不是web格式，优先使用
        if (!isWebFormat) {
            console.log('原始链接不是-web格式，优先使用');
            urlsToTry.add(videoUrl);
        }

        // 准备国际风格链接的参数
        const searchParams = new URLSearchParams(originalUrl.search);
        searchParams.set('a', '1128');
        searchParams.set('ch', '0');
        searchParams.set('cr', '0');
        searchParams.set('dr', '0');
        searchParams.delete('lr');
        const paramsStr = searchParams.toString();

        // 尝试各种非web格式
        if (hash1 && hash2 && remainingPath) {
            // 高节点通用格式（尝试多种CDN）
            const cdnFormats = [
                '-zjb-b.douyinvod.com',     // 原始zjb-b格式
                '.douyinvod.com',           // 通用域名
                '.iesdouyin.com',           // 备用域名1
                '-tx.douyinvod.com',        // 腾讯CDN
                '.toutiaovod.com',          // 今日头条域名
                '.pstatp.com',              // 备用域名
                '.snssdk.com'               // 备用域名2
            ];

            // 尝试更多节点
            for (const node of [26, 27, 28, 29, 30, 59, 60, 61, 95, 96, 97, 98, 99, 100, 101, 102, 103]) {
                for (const format of cdnFormats) {
                    const nodeUrl = `https://v${node}${format}/${hash1}/${hash2}/${remainingPath}?${paramsStr}`;
                    console.log(`尝试节点${node}${format}格式: ${nodeUrl}`);
                    urlsToTry.add(nodeUrl);
                }
            }

            // 如果原始链接是web格式，尝试用相同节点号构造不同格式
            if (isWebFormat) {
                const nodeMatch = originalUrl.hostname.match(/v(\d+)-web/);
                if (nodeMatch && nodeMatch[1]) {
                    const nodeNumber = nodeMatch[1];

                    // 尝试同节点的zjb-b格式
                    const zjbUrl = `https://v${nodeNumber}-zjb-b.douyinvod.com/${hash1}/${hash2}/${remainingPath}?${paramsStr}`;
                    console.log(`尝试同节点zjb-b格式: ${zjbUrl}`);
                    urlsToTry.add(zjbUrl);

                    // 尝试其他格式
                    const formats = [
                        '-tx.douyinvod.com',      // 腾讯CDN
                        '.douyinvod.com',         // 通用域名
                        '.iesdouyin.com',         // 备用域名1
                        '.snssdk.com',            // 备用域名2
                        '.toutiaovod.com',        // 今日头条域名
                        '.pstatp.com',            // 备用域名3
                        '-dy.douyinvod.com',      // 抖音CDN
                        '.zjcdn.com',             // 浙江CDN
                        '-sg.douyinvod.com',      // 新加坡CDN
                        '-useast1a.douyinvod.com' // 美国东海岸CDN
                    ];
                    for (const format of formats) {
                        const altUrl = `https://v${nodeNumber}${format}/${hash1}/${hash2}/${remainingPath}?${paramsStr}`;
                        console.log(`尝试${format}格式: ${altUrl}`);
                        urlsToTry.add(altUrl);
                    }
                }
            }
        }

        // 最后才考虑原始web格式
        if (isWebFormat) {
            urlsToTry.add(videoUrl);
        }

        // 测试每个候选URL
        let webFormatFallbackUrl = null;
        let nonWebFormatFallbackUrl = null;
        let nonDouyinvodFallbackUrl = null;

        for (const url of urlsToTry) {
            console.log(`正在测试链接: ${url}`);
            try {
                // 使用带超时的fetch，避免请求挂起
                const fetchPromise = fetch(url, {
                    method: 'GET',
                    headers: headers,
                    redirect: 'follow'
                });

                // 添加超时限制，避免长时间挂起
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('请求超时')), 5000)
                );

                // 让fetch和超时竞争
                const response = await Promise.race([fetchPromise, timeoutPromise]);

                const contentType = response.headers.get('Content-Type') || '';
                console.log(`链接 ${response.url} 的 Content-Type 为: ${contentType}`);

                // 检查是否是有效的视频链接
                const finalUrl = response.url;
                const isVideo = response.ok && contentType.includes('video/');
                const isFinalWebFormat = finalUrl.includes('-web.douyinvod.com');
                const isDouyinvodDomain = finalUrl.includes('douyinvod.com');

                if (isVideo) {
                    // 首选非douyinvod.com域名的链接
                    if (!isDouyinvodDomain) {
                        console.log(`成功找到非douyinvod域名的视频直链: ${finalUrl}`);
                        nonDouyinvodFallbackUrl = finalUrl;
                        return finalUrl; // 立即返回非douyinvod域名的链接
                    }
                    // 其次选择非web格式的douyinvod链接
                    else if (!isFinalWebFormat) {
                        console.log(`成功找到非-web格式的视频直链: ${finalUrl}`);
                        nonWebFormatFallbackUrl = finalUrl; // 保存为备选
                        // 继续搜索，不立即返回，以便找到更好的非douyinvod域名
                    } else {
                        console.log(`找到-web格式的视频直链，继续尝试: ${finalUrl}`);
                        if (!webFormatFallbackUrl) {
                            webFormatFallbackUrl = finalUrl; // 保存为备选
                        }
                    }
                } else {
                    console.log(`此链接无效或非视频 (状态: ${response.status}, 类型: ${contentType})`);
                }
            } catch (e) {
                console.log(`测试链接失败 (错误: ${e.message})`);
            }
        }

        // 按优先级返回找到的链接
        if (nonDouyinvodFallbackUrl) {
            console.log(`使用非douyinvod域名备选链接: ${nonDouyinvodFallbackUrl}`);
            return nonDouyinvodFallbackUrl;
        }

        if (nonWebFormatFallbackUrl) {
            console.log(`使用非-web格式备选链接: ${nonWebFormatFallbackUrl}`);
            return nonWebFormatFallbackUrl;
        }

        // 如果有web格式的备选链接，使用它
        if (webFormatFallbackUrl) {
            console.log(`未找到更好的链接，使用-web格式备选链接: ${webFormatFallbackUrl}`);
            return webFormatFallbackUrl;
        }

        // 所有尝试均失败
        console.error('关键错误: 所有候选链接均测试失败。');

        // 检查原始URL是否至少可访问
        try {
            const originalResponse = await fetch(videoUrl, {
                method: 'HEAD',
                headers: headers
            });
            if (originalResponse.ok) {
                console.log('原始链接可访问，返回原始链接作为最后手段');
                return videoUrl;
            }
        } catch (e) {
            console.error('原始链接也无法访问:', e);
        }

        showErrorMessage('所有尝试均失败，未能找到可用的视频直链。请检查网络或稍后重试。');
        return null;
    }

    function showErrorMessage(message) {
        const panel = createInfoPanel();
        const contentContainer = panel.querySelector('#douyin-info-content');
        contentContainer.innerHTML = `<div style="color: #F53F3F; padding: 8px; background: rgba(245,63,63,0.1); border-radius: 4px; margin-top: 8px; font-size: 12px;">${message}</div>`;
        panel.style.display = 'block';
    }

    function showInfo(info) {
        const aweme = info.aweme_detail;
        if (!aweme) {
            showErrorMessage('未获取到视频信息');
            return;
        }

        const panel = createInfoPanel();
        const contentContainer = panel.querySelector('#douyin-info-content');
        const stat = aweme.statistics || {};
        const author = aweme.author || {};

        // 格式化数字
        const formatNumber = num => {
            if (num >= 100000000) {
                return (num / 100000000).toFixed(1) + '亿';
            } else if (num >= 10000) {
                return (num / 10000).toFixed(1) + '万';
            }
            return num.toString();
        };

        // 构造标准视频链接
        const videoUrl = `https://www.douyin.com/video/${aweme.aweme_id}`;

        // 基础信息面板内容
        let panelContent = `
            <div class="info-item" style="margin-bottom: 10px;">
                <div class="info-label" style="color: #86909C; font-size: 11px; margin-bottom: 2px;">标题</div>
                <div class="info-value" style="font-size: 12px; color: #1D2129; word-break: break-all;">${aweme.desc || '无标题'}</div>
            </div>

            <div class="info-item" style="margin-bottom: 10px;">
                <div class="info-label" style="color: #86909C; font-size: 11px; margin-bottom: 2px;">作者</div>
                <div class="info-value" style="font-size: 12px; color: #1D2129;">${author.nickname || '未知'}</div>
            </div>

            <div class="stats-container" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 10px;
                background: #F2F3F5;
                border-radius: 4px;
                padding: 8px;
            ">
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-value" style="font-size: 12px; font-weight: 500; color: #1D2129;">${formatNumber(stat.digg_count || 0)}</div>
                    <div class="stat-label" style="font-size: 10px; color: #86909C;">点赞</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-value" style="font-size: 12px; font-weight: 500; color: #1D2129;">${formatNumber(stat.comment_count || 0)}</div>
                    <div class="stat-label" style="font-size: 10px; color: #86909C;">评论</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-value" style="font-size: 12px; font-weight: 500; color: #1D2129;">${formatNumber(stat.collect_count || 0)}</div>
                    <div class="stat-label" style="font-size: 10px; color: #86909C;">收藏</div>
                </div>
                <div class="stat-item" style="text-align: center;">
                    <div class="stat-value" style="font-size: 12px; font-weight: 500; color: #1D2129;">${formatNumber(stat.share_count || 0)}</div>
                    <div class="stat-label" style="font-size: 10px; color: #86909C;">转发</div>
                </div>
            </div>

            <div class="info-item" style="margin-bottom: 10px;">
                <div class="info-label" style="color: #86909C; font-size: 11px; margin-bottom: 2px;">视频链接</div>
                <div class="info-link-container" style="display: flex; align-items: center;">
                    <input type="text" value="${videoUrl}" readonly style="
                        flex: 1;
                        padding: 4px 6px;
                        border-radius: 4px;
                        border: 1px solid #E5E6EB;
                        background: #F7F8FA;
                        color: #1D2129;
                        font-size: 11px;
                        outline: none;
                    ">
                    <button onclick="navigator.clipboard.writeText('${videoUrl}').then(() => {this.textContent = '已复制'; setTimeout(() => this.textContent = '复制', 2000);}).catch(() => alert('复制失败'))" style="
                        margin-left: 4px;
                        padding: 4px 6px;
                        border-radius: 4px;
                        border: none;
                        background: #165DFF;
                        color: white;
                        cursor: pointer;
                        font-size: 11px;
                        white-space: nowrap;
                    ">复制</button>
                </div>
            </div>
        `;

        contentContainer.innerHTML = panelContent;
        panel.style.display = 'block';

        // 创建视频直链容器但保持隐藏
        const directLinkContainer = document.createElement('div');
        directLinkContainer.className = 'info-item direct-link-container';
        directLinkContainer.style.display = 'none';
        contentContainer.appendChild(directLinkContainer);

        // 获取并添加视频直链
        if (aweme.video && aweme.video.play_addr && aweme.video.play_addr.url_list && aweme.video.play_addr.url_list.length > 0) {
            const originalVideoUrl = aweme.video.play_addr.url_list[0];
            getVideoDirectUrl(originalVideoUrl).then(directUrl => {
                if (directUrl) {
                    directLinkContainer.style.display = 'block';
                    directLinkContainer.innerHTML = `
                        <div class="info-label" style="color: #86909C; font-size: 11px; margin-bottom: 2px;">视频直链</div>
                        <div class="info-link-container" style="display: flex; align-items: center;">
                            <input type="text" value="${directUrl}" readonly style="
                                flex: 1;
                                padding: 4px 6px;
                                border-radius: 4px;
                                border: 1px solid #E5E6EB;
                                background: #F7F8FA;
                                color: #1D2129;
                                font-size: 11px;
                                outline: none;
                            ">
                            <button onclick="navigator.clipboard.writeText('${directUrl}').then(() => {this.textContent = '已复制'; setTimeout(() => this.textContent = '复制', 2000);}).catch(() => alert('复制失败'))" style="
                                margin-left: 4px;
                                padding: 4px 6px;
                                border-radius: 4px;
                                border: none;
                                background: #165DFF;
                                color: white;
                                cursor: pointer;
                                font-size: 11px;
                                white-space: nowrap;
                            ">复制</button>
                        </div>
                    `;
                }
            });
        }
    }

    let lastAwemeId = null;
    async function main(force) {
        const awemeId = getAwemeId();
        if (!awemeId) return;
        if (!force && awemeId === lastAwemeId) return; // 避免重复弹窗
        lastAwemeId = awemeId;
        try {
            const info = await fetchVideoInfo(awemeId);
            showInfo(info);
        } catch (e) {
            // 已有详细提示
        }
    }

    // 改进登录检测函数
    function checkLoginStatus() {
        // 不做登录检测，直接返回true
        return true;
    }

    // 在脚本初始化时调用
    window.addEventListener('load', () => main(true));

    // 监听页面URL变化（支持SPA）
    function listenUrlChange() {
        let oldHref = location.href;
        setInterval(() => {
            if (location.href !== oldHref) {
                oldHref = location.href;
                setTimeout(() => main(true), 500); // 延迟以确保modal内容加载
            }
        }, 500);
    }

    listenUrlChange();
})();