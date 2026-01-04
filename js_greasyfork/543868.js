// ==UserScript==
// @name         Anna's Archive Libgen 下载镜像助手 v4.0.3 - API版（缓存优化）
// @namespace    https://annas-archive.org/
// @version      4.0.3
// @description  先用上次测速结果立即渲染优先下载按钮，再异步测速 2‑3 s 后刷新最佳镜像。
// @author       You
// @match        https://zh.annas-archive.org/*
// @match        https://*/*
// @match        http://*/*
// @license MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      https://libgen-monitor.vercel.app/
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543868/Anna%27s%20Archive%20Libgen%20%E4%B8%8B%E8%BD%BD%E9%95%9C%E5%83%8F%E5%8A%A9%E6%89%8B%20v403%20-%20API%E7%89%88%EF%BC%88%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543868/Anna%27s%20Archive%20Libgen%20%E4%B8%8B%E8%BD%BD%E9%95%9C%E5%83%8F%E5%8A%A9%E6%89%8B%20v403%20-%20API%E7%89%88%EF%BC%88%E7%BC%93%E5%AD%98%E4%BC%98%E5%8C%96%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /********************** 新增全局常量 ************************/
  const BEST_MIRROR_KEY = 'libgen_bestMirror'; // 本地缓存 key
  /***********************************************************/

  // 配置 - 请替换为你的 Vercel API 地址
  const API_BASE = 'https://libgen-monitor.vercel.app/api/speedtest';
  const CACHE_DURATION = 10 * 60 * 1000; // 10分钟本地缓存
  const isAnnasMd5Page = location.href.includes('zh.annas-archive.org/md5/');

  console.log('[Libgen] 脚本开始加载...');

    // 样式注入
    GM_addStyle(`
        .libgen-float-btn {
            position: fixed !important;
            top: 200px !important;
            right: -20px !important;
            width: 50px !important;
            height: 50px !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            border-radius: 25px 0 0 25px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: 20px !important;
            cursor: pointer !important;
            z-index: 99999 !important;
            opacity: 0.3 !important;
            transition: all 0.3s ease !important;
            user-select: none !important;
            box-shadow: -2px 2px 10px rgba(0,0,0,0.2) !important;
        }

        .libgen-float-btn:hover {
            opacity: 0.9 !important;
            right: -15px !important;
        }

        .libgen-float-btn.dragging {
            border-radius: 50% !important;
            right: auto !important;
            opacity: 0.9 !important;
            transform: scale(1.1) !important;
        }

        .libgen-panel {
            position: fixed !important;
            top: 150px !important;
            right: 60px !important;
            width: 350px !important;
            max-height: 500px !important;
            background: rgba(255, 255, 255, 0.95) !important;
            backdrop-filter: blur(10px) !important;
            border-radius: 15px !important;
            padding: 20px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
            z-index: 99998 !important;
            overflow-y: auto !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
        }

        .libgen-panel h3 {
            margin: 0 0 15px 0 !important;
            color: #2c3e50 !important;
            font-size: 18px !important;
 
            align-items: center !important;
            gap: 8px !important;
        }

        .libgen-mirror-item {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            padding: 8px 12px !important;
            margin: 5px 0 !important;
            background: rgba(255,255,255,0.7) !important;
            border-radius: 8px !important;
            border-left: 3px solid transparent !important;
        }

        .libgen-mirror-item.online {
            border-left-color: #27ae60 !important;
        }

        .libgen-mirror-item.offline {
            border-left-color: #e74c3c !important;
        }

        .libgen-mirror-info {
            flex: 1 !important;
            font-size: 13px !important;
        }

        .libgen-mirror-url {
            font-weight: bold !important;
            color: #2c3e50 !important;
        }

        .libgen-mirror-stats {
            color: #7f8c8d !important;
            font-size: 11px !important;
        }

        .libgen-mirror-badge {
            background: #3498db !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 10px !important;
            font-size: 10px !important;
            margin-left: 5px !important;
        }

        .libgen-controls {
            display: flex !important;
            gap: 8px !important;
            margin-top: 15px !important;
            flex-wrap: wrap !important;
        }

        .libgen-btn {
            padding: 8px 12px !important;
            border: none !important;
            border-radius: 20px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            font-weight: bold !important;
            transition: all 0.2s ease !important;
        }

        .libgen-btn-primary {
            background: #3498db !important;
            color: white !important;
        }

        .libgen-btn-primary:hover {
            background: #2980b9 !important;
            transform: translateY(-1px) !important;
        }

        .libgen-btn-success {
            background: #27ae60 !important;
            color: white !important;
        }

        .libgen-btn-success:hover {
            background: #229954 !important;
            transform: translateY(-1px) !important;
        }

        .libgen-download-block {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 15px 20px !important;
            border-radius: 12px !important;
            margin: 15px 0 !important;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
            position: relative !important;
            overflow: hidden !important;
        }

        .libgen-download-block::before {
            content: '' !important;
            position: absolute !important;
            top: -50% !important;
            left: -50% !important;
            width: 200% !important;
            height: 200% !important;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent) !important;
            transform: rotate(45deg) !important;
            animation: shimmer 3s infinite !important;
            pointer-events: none !important;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
        }

        .libgen-download-title {
            font-size: 16px !important;
            font-weight: bold !important;
            margin-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }

        .libgen-download-link {
            color: #fff !important;
            text-decoration: none !important;
            font-size: 14px !important;
            padding: 8px 16px !important;
            background: rgba(255,255,255,0.2) !important;
            border-radius: 20px !important;
            display: inline-block !important;
            margin-top: 5px !important;
            transition: all 0.3s ease !important;
            border: 1px solid rgba(255,255,255,0.3) !important;
            position: relative !important;
            z-index: 10 !important;
            cursor: pointer !important;
        }

        .libgen-download-link:hover {
            background: rgba(255,255,255,0.3) !important;
            transform: translateY(-2px) !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }

        .libgen-tooltip {
            position: fixed !important;
            background: rgba(0,0,0,0.9) !important;
            color: white !important;
            padding: 8px 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            z-index: 100000 !important;
            pointer-events: none !important;
            max-width: 200px !important;
        }

        .libgen-loading {
            text-align: center !important;
            color: #7f8c8d !important;
            font-size: 13px !important;
            padding: 10px !important;
        }
    `);

    // 数据管理
    let cachedData = null;
    let lastFetchTime = 0;
    let floatBtn, panel;
    let hoverTimer = null;
    let tooltip = null;

    // 获取 MD5 值
    function getMd5FromUrl() {
        const match = location.pathname.match(/\/md5\/([a-f0-9]{32})/);
        return match ? match[1] : null;
    }

    // API 调用函数
   async function fetchMirrorData(force = false) {
    console.log('[Libgen API] 开始获取镜像数据...');

    // 缓存检查（保持原逻辑）
    if (!force && cachedData && Date.now() - lastFetchTime < CACHE_DURATION) {
      console.log('[Libgen API] 使用缓存数据');
      return cachedData;
    }

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: force ? `${API_BASE}?force=true` : API_BASE,
        timeout: 10000,
        onload: (response) => {
          try {
            const data = JSON.parse(response.responseText);
            if (data.success) {
              cachedData = data.data;
              lastFetchTime = Date.now();
              console.log('[Libgen API] ✅ 数据获取成功:', data.data);

              /**************** 新增逻辑：持久化最佳镜像 ****************/
              const onlineMirrors = data.data.results.filter(r => r.status === 'online');
              if (onlineMirrors.length) {
                GM_setValue(BEST_MIRROR_KEY, {
                  ...onlineMirrors[0],
                  savedAt: Date.now(),
                });
              }
              /*********************************************************/

              resolve(data.data);
            } else {
              throw new Error(data.error || '服务器返回错误');
            }
          } catch (e) {
            console.error('[Libgen API] ❌ 解析响应失败:', e);
            reject(e);
          }
        },
        onerror: (error) => {
          console.error('[Libgen API] ❌ 请求失败:', error);
          reject(new Error('网络请求失败'));
        },
        ontimeout: () => {
          console.error('[Libgen API] ❌ 请求超时');
          reject(new Error('请求超时'));
        },
      });
    });
  }


    // 创建悬浮按钮
    function createFloatingButton() {
        floatBtn = document.createElement('div');
        floatBtn.className = 'libgen-float-btn';
        floatBtn.innerHTML = '📚';
        floatBtn.title = 'Libgen 镜像助手';

        // 拖拽功能
        let isDragging = false;
        let dragStarted = false;
        let startX, startY, startLeft, startTop;

        floatBtn.addEventListener('mousedown', (e) => {
            dragStarted = false; // 重置拖拽开始标志
            startX = e.clientX;
            startY = e.clientY;
            const rect = floatBtn.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
        });

        document.addEventListener('mousemove', (e) => {
            if (e.buttons === 1) { // 只有在按下鼠标时才处理
                const deltaX = Math.abs(e.clientX - startX);
                const deltaY = Math.abs(e.clientY - startY);

                // 只有移动超过5像素才算开始拖拽
                if ((deltaX > 5 || deltaY > 5) && !dragStarted) {
                    dragStarted = true;
                    isDragging = true;
                    floatBtn.classList.add('dragging');
                    floatBtn.style.left = startLeft + 'px';
                    floatBtn.style.right = 'auto';
                    document.body.style.userSelect = 'none';
                }

                if (isDragging) {
                    const deltaX = e.clientX - startX;
                    const deltaY = e.clientY - startY;
                    floatBtn.style.left = (startLeft + deltaX) + 'px';
                    floatBtn.style.top = (startTop + deltaY) + 'px';
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                floatBtn.classList.remove('dragging');
                document.body.style.userSelect = '';

                // 磁吸到边缘
                const rect = floatBtn.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const windowWidth = window.innerWidth;

                if (centerX > windowWidth / 2) {
                    // 吸附到右边
                    floatBtn.style.left = 'auto';
                    floatBtn.style.right = '-20px';
                } else {
                    // 吸附到左边
                    floatBtn.style.left = '-20px';
                    floatBtn.style.right = 'auto';
                    floatBtn.style.borderRadius = '0 25px 25px 0';
                }
            }
            dragStarted = false; // 重置拖拽开始标志
        });

        // 悬停显示信息
        floatBtn.addEventListener('mouseenter', () => {
            hoverTimer = setTimeout(showTooltipInfo, 1500); // 1.5秒后显示
        });

        floatBtn.addEventListener('mouseleave', () => {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
            hideTooltip();
        });

        floatBtn.addEventListener('click', (e) => {
            console.log('[Libgen] 悬浮按钮被点击, isDragging:', isDragging, 'dragStarted:', dragStarted);

            // 只有在没有拖拽的情况下才处理点击
            if (!isDragging && !dragStarted) {
                console.log('[Libgen] 开始切换面板显示状态');
                togglePanel();
            }
            e.stopPropagation();
        });

        document.body.appendChild(floatBtn);
    }

    // 显示悬停提示信息
    async function showTooltipInfo() {
        try {
            const data = await fetchMirrorData();
            const onlineMirrors = data.results.filter(r => r.status === 'online');
            const bestMirror = onlineMirrors[0];

            if (bestMirror) {
                // 构建详细的测速信息
                const tooltipLines = [
                    `🚀 最佳镜像: ${new URL(bestMirror.url).hostname}`,
                    `⚡ 延迟: ${bestMirror.delay}ms`,
                    `🟢 在线: ${data.onlineMirrors}/${data.totalMirrors}`,
                    ``,
                    `📊 所有镜像状态:`
                ];

                // 添加前5个镜像的状态
                data.results.slice(0, 5).forEach(mirror => {
                    const domain = new URL(mirror.url).hostname;
                    const status = mirror.status === 'online' ? `🟢 ${mirror.delay}ms` : '🔴 离线';
                    const trusted = mirror.trusted ? ' 🔒' : '';
                    tooltipLines.push(`${domain}${trusted}: ${status}`);
                });

                if (data.results.length > 5) {
                    tooltipLines.push(`... 还有 ${data.results.length - 5} 个镜像`);
                }

                showTooltip(tooltipLines.join('\\n'), floatBtn);
            }
        } catch (error) {
            showTooltip('❌ 无法获取镜像信息\\n点击打开控制面板查看详情', floatBtn);
        }
    }

    // 创建控制面板
    function createPanel() {
        console.log('[Libgen] 开始创建控制面板');

        panel = document.createElement('div');
        panel.className = 'libgen-panel';
        panel.style.display = 'none'; // 初始隐藏
        panel.innerHTML = `
            <h3>📚 Libgen 镜像管理</h3>
            <div style="margin-bottom: 10px; font-size: 12px; color: #666;">
                数据来源: <span id="data-source">Vercel API</span> |
                缓存状态: <span id="cache-status">加载中...</span>
            </div>
            <div id="libgen-mirror-list" class="libgen-loading">正在加载镜像信息...</div>
            <div class="libgen-controls">
                <button class="libgen-btn libgen-btn-primary" onclick="window.libgenRefresh()">🔄 手动测速</button>
                <button class="libgen-btn libgen-btn-success" onclick="window.libgenOpenMonitor()">📊 监控面板</button>
                <button class="libgen-btn libgen-btn-primary" onclick="window.libgenTestAPI()">🔧 测试API</button>
                <button class="libgen-btn libgen-btn-primary" onclick="window.libgenAddMirror()">➕ 添加镜像</button>
                <button class="libgen-btn libgen-btn-primary" onclick="window.libgenExport()">📤 导出数据</button>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee; font-size: 11px; color: #999;">
                💡 提示: 悬停按钮1.5秒显示快速状态 | 点击打开管理面板
            </div>
        `;

        document.body.appendChild(panel);
        console.log('[Libgen] 面板已添加到DOM');

        // 点击外部关闭面板
        document.addEventListener('click', (e) => {
            if (panel && !panel.contains(e.target) && !floatBtn.contains(e.target)) {
                panel.style.display = 'none';
                console.log('[Libgen] 点击外部，隐藏面板');
            }
        });

        // 全局函数
        window.libgenRefresh = () => {
            console.log('[Libgen] 手动刷新被调用');
            refreshPanelData(true);
        };
        window.libgenOpenMonitor = () => {
            const monitorUrl = API_BASE.replace('/api/speedtest', '');
            console.log('[Libgen] 打开监控面板:', monitorUrl);
            window.open(monitorUrl, '_blank');
        };
        window.libgenTestAPI = testAPIConnection;
        window.libgenAddMirror = addNewMirror;
        window.libgenExport = exportData;

        console.log('[Libgen] 控制面板创建完成');
    }

    function togglePanel() {
        console.log('[Libgen] togglePanel 被调用');

        if (!panel) {
            console.log('[Libgen] 创建新面板');
            createPanel();
        }

        // 获取当前显示状态
        const currentDisplay = window.getComputedStyle(panel).display;
        const isVisible = currentDisplay !== 'none';

        console.log('[Libgen] 当前面板状态:', currentDisplay, '可见:', isVisible);

        if (isVisible) {
            panel.style.display = 'none';
            console.log('[Libgen] 隐藏面板');
        } else {
            panel.style.display = 'block';
            console.log('[Libgen] 显示面板');
            loadPanelData();
        }
    }

    async function loadPanelData() {
        console.log('[Libgen] 开始加载面板数据');

        const listElement = document.getElementById('libgen-mirror-list');
        if (!listElement) {
            console.error('[Libgen] 找不到镜像列表元素');
            return;
        }

        listElement.innerHTML = '<div class="libgen-loading">正在加载镜像信息...</div>';

        try {
            console.log('[Libgen] 调用 fetchMirrorData');
            const data = await fetchMirrorData();
            console.log('[Libgen] 获取到数据:', data);
            renderMirrorList(data);
        } catch (error) {
            console.error('[Libgen] 加载面板数据失败:', error);
            listElement.innerHTML = `<div class="libgen-loading">❌ 加载失败: ${error.message}</div>`;
        }
    }

    async function refreshPanelData(force = false) {
        const listElement = document.getElementById('libgen-mirror-list');

        if (force) {
            listElement.innerHTML = '<div class="libgen-loading">🔄 正在手动测速所有镜像...</div>';
            document.getElementById('data-source').textContent = '手动测速中';
            document.getElementById('cache-status').textContent = '测速中...';
        }

        try {
            const data = await fetchMirrorData(force);
            renderMirrorList(data);

            if (force) {
                // 显示测速完成提示
                showNotification('✅ 手动测速完成！');
            }
        } catch (error) {
            listElement.innerHTML = `<div class="libgen-loading">❌ ${force ? '手动测速' : '刷新'}失败: ${error.message}</div>`;
            document.getElementById('data-source').textContent = '错误';
            document.getElementById('cache-status').textContent = '失败';
        }
    }

    function renderMirrorList(data) {
        console.log('[Libgen] 开始渲染镜像列表:', data);

        const listElement = document.getElementById('libgen-mirror-list');
        if (!listElement) {
            console.error('[Libgen] 找不到镜像列表元素');
            return;
        }

        // 更新数据来源和缓存状态
        const dataSourceElement = document.getElementById('data-source');
        const cacheStatusElement = document.getElementById('cache-status');

        if (dataSourceElement && cacheStatusElement) {
            const cacheAge = Date.now() - lastFetchTime;
            const cacheMinutes = Math.floor(cacheAge / 60000);
            dataSourceElement.textContent = 'Vercel API';
            cacheStatusElement.textContent =
                cacheMinutes < 1 ? '刚刚更新' : `${cacheMinutes}分钟前`;
        }

        if (!data || !data.results || !Array.isArray(data.results)) {
            console.error('[Libgen] 数据格式错误:', data);
            listElement.innerHTML = '<div class="libgen-loading">❌ 数据格式错误</div>';
            return;
        }

        const html = data.results.map((mirror, index) => {
            const domain = new URL(mirror.url).hostname;
            const isOnline = mirror.status === 'online';

            return `
                <div class="libgen-mirror-item ${mirror.status}">
                    <div class="libgen-mirror-info">
                        <div class="libgen-mirror-url">
                            ${domain}
                            ${mirror.trusted ? '<span class="libgen-mirror-badge">可信</span>' : ''}
                            ${index === 0 && isOnline ? '<span class="libgen-mirror-badge" style="background: #27ae60;">最佳</span>' : ''}
                        </div>
                        <div class="libgen-mirror-stats">
                            ${isOnline ? `${mirror.delay}ms` : '离线'} •
                            ${new Date(mirror.lastChecked).toLocaleTimeString()}
                        </div>
                    </div>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <a href="${mirror.url}" target="_blank"
                           style="color: ${isOnline ? '#27ae60' : '#e74c3c'}; text-decoration: none; font-size: 16px;"
                           title="访问镜像">
                            ${isOnline ? '🟢' : '🔴'}
                        </a>
                        <button onclick="window.libgenRemoveMirror('${mirror.url}')"
                                style="background: #e74c3c; color: white; border: none; border-radius: 3px;
                                       padding: 2px 6px; font-size: 10px; cursor: pointer;"
                                title="删除镜像">
                            ❌
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        listElement.innerHTML = html || '<div class="libgen-loading">暂无镜像数据</div>';
        console.log('[Libgen] 镜像列表渲染完成');

        // 添加删除镜像的全局函数
        window.libgenRemoveMirror = (url) => {
            if (confirm(`确定要删除镜像 ${new URL(url).hostname} 吗？`)) {
                // 这里可以实现删除逻辑
                alert('镜像删除功能需要服务端支持，当前为演示版本');
            }
        };
    }

    // 工具提示
    function showTooltip(text, element) {
        hideTooltip();
        tooltip = document.createElement('div');
        tooltip.className = 'libgen-tooltip';

        // 处理多行文本
        tooltip.innerHTML = text.replace(/\\n/g, '<br>');
        tooltip.style.whiteSpace = 'pre-line';
        tooltip.style.lineHeight = '1.4';

        document.body.appendChild(tooltip);

        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();

        // 智能定位，避免超出屏幕
        let left = rect.left - tooltipRect.width - 10;
        let top = rect.top + (rect.height - tooltipRect.height) / 2;

        // 如果左侧空间不够，显示在右侧
        if (left < 10) {
            left = rect.right + 10;
        }

        // 如果上下超出屏幕，调整位置
        if (top < 10) {
            top = 10;
        } else if (top + tooltipRect.height > window.innerHeight - 10) {
            top = window.innerHeight - tooltipRect.height - 10;
        }

        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function hideTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }

    // 测试API连接
    async function testAPIConnection() {
        console.log('[Libgen] 开始测试API连接...');

        const listElement = document.getElementById('libgen-mirror-list');
        if (listElement) {
            listElement.innerHTML = '<div class="libgen-loading">🔧 正在测试API连接...</div>';
        }

        try {
            const testStart = Date.now();

            // 强制清空缓存进行真实测试
            cachedData = null;
            lastFetchTime = 0;

            const data = await fetchMirrorData(true);
            const testTime = Date.now() - testStart;

            console.log('[Libgen] API测试成功，耗时:', testTime + 'ms');

            if (listElement) {
                listElement.innerHTML = `
                    <div style="padding: 15px; background: #d4edda; color: #155724; border-radius: 8px; margin: 10px 0;">
                        <strong>✅ API连接测试成功！</strong><br>
                        <small>
                        响应时间: ${testTime}ms<br>
                        API地址: ${API_BASE}<br>
                        返回数据: ${data.results?.length || 0} 个镜像<br>
                        在线镜像: ${data.onlineMirrors}/${data.totalMirrors}
                        </small>
                    </div>
                `;
            }

            // 延迟2秒后显示正常数据
            setTimeout(() => {
                renderMirrorList(data);
            }, 2000);

            showNotification('✅ API连接测试成功！');

        } catch (error) {
            console.error('[Libgen] API测试失败:', error);

            if (listElement) {
                listElement.innerHTML = `
                    <div style="padding: 15px; background: #f8d7da; color: #721c24; border-radius: 8px; margin: 10px 0;">
                        <strong>❌ API连接测试失败</strong><br>
                        <small>
                        错误信息: ${error.message}<br>
                        API地址: ${API_BASE}<br><br>
                        可能的原因：<br>
                        1. API地址配置错误<br>
                        2. Vercel服务未部署<br>
                        3. 网络连接问题<br>
                        4. CORS跨域限制
                        </small>
                    </div>
                `;
            }

            showNotification('❌ API连接测试失败，请检查配置');
        }
    }

    // 添加新镜像
    function addNewMirror() {
        const url = prompt('请输入新的 Libgen 镜像 URL\\n例如: https://libgen.example.com/');
        if (!url || !url.trim()) return;

        try {
            // 验证URL格式
            new URL(url.trim());

            // 这里可以实现添加逻辑
            alert(`镜像添加功能需要服务端支持\\n\\n您输入的URL: ${url.trim()}\\n\\n当前为演示版本，实际部署时可连接后端API实现此功能。`);
        } catch (error) {
            alert('请输入有效的URL格式');
        }
    }

    // 导出数据
    function exportData() {
        if (cachedData) {
            const blob = new Blob([JSON.stringify(cachedData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `libgen-mirrors-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // 页面特定功能 - 仅在 Annas Archive 的 md5 页面工作
    /***********************************************************
   * 在 md5 页面先用缓存最佳镜像渲染按钮，再异步测速更新。
   ***********************************************************/
  async function enhanceAnnasMd5Page() {
    if (!isAnnasMd5Page) return;

    console.log('[Libgen] 开始增强 Annas Archive 页面...');

    const md5 = getMd5FromUrl();
    if (!md5) return;

    // 1️⃣ 读取本地缓存的最佳镜像并立即渲染按钮
    const storedBest = GM_getValue(BEST_MIRROR_KEY, null);
    let downloadBlockRef = null;

    if (storedBest) {
      console.log('[Libgen] 使用本地缓存镜像:', storedBest.url);
      downloadBlockRef = injectDownloadBlock(storedBest, md5, { fromCache: true });
    }

    // 2️⃣ 立即异步测速；2‑3 s 后更新按钮
    try {
      const data = await fetchMirrorData(true); // 强制测速
      const bestMirror = data.results.find(r => r.status === 'online');
      if (!bestMirror) return;

      setTimeout(() => {
        if (downloadBlockRef && bestMirror.url === storedBest?.url) {
          // 镜像未变化，仅刷新提示文本
          const tipEl = downloadBlockRef.querySelector('.libgen-download-tip');
          if (tipEl) tipEl.textContent = '🆗 已是最新最佳镜像';
        } else if (downloadBlockRef) {
          // 更新现有块中的链接和标题
          const link = downloadBlockRef.querySelector('a.libgen-download-link');
          const title = downloadBlockRef.querySelector('.libgen-download-title');
          const tipEl = downloadBlockRef.querySelector('.libgen-download-tip');

          const domain = new URL(bestMirror.url).hostname;
          const newUrl = `${bestMirror.url.replace(/\/$/, '')}/ads.php?md5=${md5}`;

          if (link) {
            link.href = newUrl;
            link.textContent = `📚 立即下载 Libgen ${domain} • ${bestMirror.delay}ms`;
          }
          if (title) title.innerHTML = `🚀 优先推荐下载 (${domain})`;
          if (tipEl) tipEl.textContent = '✅ 已刷新为最新镜像';
        } else {
          // 首次注入（无缓存或缓存失效）
          injectDownloadBlock(bestMirror, md5, { fromCache: false });
        }
      }, 2000); // 2秒延迟，避免过快闪烁
    } catch (err) {
      console.warn('[Libgen] 异步测速失败，保持缓存镜像:', err);
    }
  }

    /***********************************************************
   * injectDownloadBlock 修改 —— 返回元素引用，并支持 fromCache 提示。
   ***********************************************************/
  function injectDownloadBlock(mirror, md5, { fromCache } = {}) {
    const selectors = [
      'h3',
      'h2',
      '.text-xl',
      '.downloads',
      'main',
      '.container',
      '.content',
      '#content',
    ];

    let insertPoint = null;
    const headings = Array.from(
      document.querySelectorAll('h1, h2, h3, .text-xl, .font-bold'),
    ).filter((el) =>
      el.textContent.includes('下载') ||
      el.textContent.includes('Download') ||
      el.textContent.includes('快速') ||
      el.textContent.includes('Fast'),
    );
    if (headings.length) insertPoint = headings[0];
    if (!insertPoint) {
      for (const selector of selectors) {
        insertPoint = document.querySelector(selector);
        if (insertPoint) break;
      }
    }
    if (!insertPoint) insertPoint = document.body;

    const domain = new URL(mirror.url).hostname;
    const downloadUrl = `${mirror.url.replace(/\/$/, '')}/ads.php?md5=${md5}`;

    const downloadBlock = document.createElement('div');
    downloadBlock.className = 'libgen-download-block';
    downloadBlock.innerHTML = `
      <div class="libgen-download-title">🚀 优先推荐下载 (${domain})</div>
      <a href="${downloadUrl}" target="_blank" class="libgen-download-link">
        📚 立即下载 Libgen ${domain} • ${mirror.delay || '?'}ms
      </a>
      <div class="libgen-download-tip" style="font-size: 12px; margin-top: 8px; opacity: 0.8;">
        ${fromCache ? '⏱️ 正在刷新最新镜像…' : '✨ 已自动选择最佳镜像'}
      </div>
    `;

    if (insertPoint.tagName.match(/^H[1-3]$/)) {
      insertPoint.parentNode.insertBefore(downloadBlock, insertPoint.nextSibling);
    } else {
      insertPoint.insertBefore(downloadBlock, insertPoint.firstChild);
    }

    return downloadBlock; // 返回引用以便后续更新
  }


    function showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 100000;
            animation: fadeInOut 3s ease-in-out;
        `;
        notification.textContent = message;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                15%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 3000);
    }


    // 初始化
    function init() {
        console.log('[Libgen] 初始化插件...');
        console.log('[Libgen] API地址:', API_BASE);

        // 检查API配置
        if (API_BASE.includes('your-vercel-app.vercel.app')) {
            console.warn('[Libgen] ⚠️ 请先配置正确的API地址！当前为示例地址。');
        }

        // 创建悬浮按钮（所有页面）
        createFloatingButton();

        // 页面特定增强（仅 md5 页面）
        if (isAnnasMd5Page) {
            console.log('[Libgen] 检测到 md5 页面，将进行页面增强');
            // 等待页面加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', enhanceAnnasMd5Page);
            } else {
                enhanceAnnasMd5Page();
            }
        }

        console.log('[Libgen] ✅ 插件初始化完成');
        console.log('[Libgen] 💡 使用提示:');
        console.log('[Libgen] - 悬停按钮1.5秒查看镜像状态');
        console.log('[Libgen] - 点击按钮打开控制面板');
        console.log('[Libgen] - 在md5页面查看优化下载链接');
    }

    // 启动
    init();

})();
