// ==UserScript==
// @name         炸号微博备份
// @namespace    https://dun.mianbaoduo.com/@fun
// @version      0.8
// @description  炸号微博一键备份，支持JSON和HTML导出
// @author       fun
// @match        *://weibo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/445022/%E7%82%B8%E5%8F%B7%E5%BE%AE%E5%8D%9A%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/445022/%E7%82%B8%E5%8F%B7%E5%BE%AE%E5%8D%9A%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let wrapper = document.createElement("div");
  let backup = document.createElement("div");

  backup.innerHTML = `<div><svg id="bIndicator" style="vertical-align: -12px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" class="woo-spinner-main Scroll_loadingIcon_2nyZ4"><g fill="none" stroke-width="5" stroke-miterlimit="10" stroke="currentColor" style="animation: 2s linear 0s infinite normal none running woo-spinner-_-rotate; height: 50px; transform-origin: center center; width: 50px;"><circle cx="25" cy="25" r="20" opacity=".3"></circle><circle cx="25" cy="25" r="20" stroke-dasharray="25,200" stroke-linecap="round" style="animation: 1.5s ease-in-out 0s infinite normal none running woo-spinner-_-dash;"></circle></g></svg><span id="bMSG"></span></div>

<div style="text-align: center;"><a href="https://dun.mianbaoduo.com/@fun" target="_blank" style="border-radius: 0.166667rem; display: inline-block; font-weight: bold; color: #ca3a1f; margin-left: 0px; padding: 3px 14px;font-size: 13px;text-align: center;border: 1px solid #cfcfcf;margin-top: 8px;">打赏<span style="font-size: 16px; vertical-align: -2px; margin-left: 5px;">😋</span></a></div>  `;

  function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  // HTML模板
  const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>微博数据可视化</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #ff6b6b, #ee5a52);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 30px;
            background: #f8f9fa;
        }

        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.08);
            transition: transform 0.3s ease;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: #ff6b6b;
            margin-bottom: 10px;
        }

        .stat-label {
            color: #666;
            font-size: 14px;
        }

        .content {
            padding: 30px;
        }

        .filters {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .filter-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .filter-group label {
            font-size: 14px;
            color: #666;
            font-weight: 500;
        }

        .filter-input {
            padding: 8px 12px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s ease;
        }

        .filter-input:focus {
            outline: none;
            border-color: #ff6b6b;
        }

        .results-info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding: 15px 20px;
            background: #f8f9fa;
            border-radius: 8px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .results-count {
            color: #666;
            font-size: 14px;
        }

        .per-page-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .per-page-group label {
            font-size: 14px;
            color: #666;
        }

        .per-page-select {
            padding: 5px 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            background: white;
        }

        .weibo-list {
            display: grid;
            gap: 20px;
        }

        .weibo-item {
            background: white;
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 20px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }

        .weibo-item:hover {
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }

        .weibo-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            gap: 15px;
        }

        .avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #ff6b6b;
        }

        .user-info {
            flex: 1;
        }

        .username {
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }

        .time {
            color: #999;
            font-size: 12px;
        }

        .weibo-content {
            line-height: 1.6;
            color: #333;
            margin-bottom: 15px;
        }

        .retweet {
            background: #f8f9fa;
            border-left: 4px solid #ff6b6b;
            padding: 15px;
            margin: 15px 0;
            border-radius: 0 8px 8px 0;
        }

        .retweet-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }

        .retweet-avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            object-fit: cover;
        }

        .retweet-user {
            font-weight: bold;
            color: #ff6b6b;
            font-size: 14px;
        }

        .retweet-content {
            color: #555;
            line-height: 1.5;
        }

        .images-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 15px;
        }

        .weibo-image {
            width: 100%;
            max-width: 300px;
            border-radius: 8px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .weibo-image:hover {
            transform: scale(1.05);
        }

        .stats-details {
            display: flex;
            gap: 20px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            font-size: 14px;
            color: #666;
        }

        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            margin-top: 30px;
            padding: 20px;
            flex-wrap: wrap;
        }

        .page-btn {
            padding: 8px 15px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease;
            min-width: 40px;
        }

        .page-btn:hover, .page-btn.active {
            background: #ff6b6b;
            color: white;
            border-color: #ff6b6b;
        }

        .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .page-info {
            color: #666;
            font-size: 14px;
            margin: 0 10px;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
                border-radius: 10px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .stats {
                grid-template-columns: repeat(2, 1fr);
                padding: 20px;
                gap: 15px;
            }
            
            .filters {
                flex-direction: column;
                gap: 10px;
            }
            
            .weibo-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 10px;
            }

            .results-info {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
            }

            .pagination {
                justify-content: center;
                gap: 5px;
            }

            .page-btn {
                padding: 6px 12px;
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🐦 微博数据可视化</h1>
            <p>您的微博备份数据 - 生成时间: {{EXPORT_TIME}}</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" id="totalCount">0</div>
                <div class="stat-label">总微博数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="retweetCount">0</div>
                <div class="stat-label">转发数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="imageCount">0</div>
                <div class="stat-label">图片数</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="daySpan">0</div>
                <div class="stat-label">时间跨度(天)</div>
            </div>
        </div>

        <div class="content">
            <div class="filters">
                <div class="filter-group">
                    <label>搜索内容</label>
                    <input type="text" class="filter-input" id="searchInput" placeholder="搜索微博内容...">
                </div>
                <div class="filter-group">
                    <label>开始日期</label>
                    <input type="date" class="filter-input" id="startDate">
                </div>
                <div class="filter-group">
                    <label>结束日期</label>
                    <input type="date" class="filter-input" id="endDate">
                </div>
                <div class="filter-group">
                    <label>类型</label>
                    <select class="filter-input" id="typeFilter">
                        <option value="all">全部</option>
                        <option value="original">原创</option>
                        <option value="retweet">转发</option>
                        <option value="with-images">有图片</option>
                    </select>
                </div>
            </div>

            <div class="results-info">
                <div class="results-count" id="resultsCount"></div>
                <div class="per-page-group">
                    <label for="perPageSelect">每页显示:</label>
                    <select id="perPageSelect" class="per-page-select">
                        <option value="5">5条</option>
                        <option value="10" selected>10条</option>
                        <option value="20">20条</option>
                        <option value="50">50条</option>
                        <option value="100">100条</option>
                    </select>
                </div>
            </div>

            <div class="weibo-list" id="weiboList"></div>
            
            <div class="pagination" id="pagination"></div>
        </div>
    </div>

    <script>
        // 嵌入的微博数据
        const WEIBO_DATA = {{WEIBO_DATA}};
        
        let allData = WEIBO_DATA;
        let filteredData = [...allData];
        let currentPage = 1;
        let itemsPerPage = 10;

        // 页面加载完成后初始化
        document.addEventListener('DOMContentLoaded', function() {
            initApp();
        });

        function initApp() {
            updateStats();
            initFilters();
            renderWeibos();
            
            // 绑定每页显示条数选择器
            document.getElementById('perPageSelect').addEventListener('change', (e) => {
                itemsPerPage = parseInt(e.target.value);
                currentPage = 1;
                renderWeibos();
            });
        }

        function updateStats() {
            const totalCount = allData.length;
            const retweetCount = allData.filter(item => item.retweeted_status).length;
            const imageCount = allData.reduce((sum, item) => sum + (item.images?.length || 0), 0);
            
            // 计算时间跨度
            const dates = allData.map(item => new Date(item.created_at)).filter(d => !isNaN(d));
            const daySpan = dates.length > 0 ? 
                Math.ceil((Math.max(...dates) - Math.min(...dates)) / (1000 * 60 * 60 * 24)) : 0;

            document.getElementById('totalCount').textContent = totalCount;
            document.getElementById('retweetCount').textContent = retweetCount;
            document.getElementById('imageCount').textContent = imageCount;
            document.getElementById('daySpan').textContent = daySpan;
        }

        function initFilters() {
            // 设置日期范围
            const dates = allData.map(item => new Date(item.created_at)).filter(d => !isNaN(d));
            if (dates.length > 0) {
                const minDate = new Date(Math.min(...dates));
                const maxDate = new Date(Math.max(...dates));
                document.getElementById('startDate').value = minDate.toISOString().split('T')[0];
                document.getElementById('endDate').value = maxDate.toISOString().split('T')[0];
            }

            // 绑定过滤器事件
            document.getElementById('searchInput').addEventListener('input', applyFilters);
            document.getElementById('startDate').addEventListener('change', applyFilters);
            document.getElementById('endDate').addEventListener('change', applyFilters);
            document.getElementById('typeFilter').addEventListener('change', applyFilters);
        }

        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(document.getElementById('endDate').value);
            const typeFilter = document.getElementById('typeFilter').value;

            filteredData = allData.filter(item => {
                // 搜索过滤
                if (searchTerm && !item.text.toLowerCase().includes(searchTerm)) {
                    return false;
                }

                // 日期过滤
                const itemDate = new Date(item.created_at);
                if (!isNaN(startDate) && itemDate < startDate) return false;
                if (!isNaN(endDate) && itemDate > endDate) return false;

                // 类型过滤
                if (typeFilter === 'original' && item.retweeted_status) return false;
                if (typeFilter === 'retweet' && !item.retweeted_status) return false;
                if (typeFilter === 'with-images' && (!item.images || item.images.length === 0)) return false;

                return true;
            });

            currentPage = 1;
            renderWeibos();
        }

        function updateResultsCount() {
            const startIndex = (currentPage - 1) * itemsPerPage + 1;
            const endIndex = Math.min(currentPage * itemsPerPage, filteredData.length);
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            
            const resultsText = filteredData.length === 0 
                ? '没有找到匹配的微博'
                : \`显示第 \${startIndex}-\${endIndex} 条，共 \${filteredData.length} 条微博 (第 \${currentPage}/\${totalPages} 页)\`;
            
            document.getElementById('resultsCount').textContent = resultsText;
        }

        function renderWeibos() {
            const container = document.getElementById('weiboList');
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const pageData = filteredData.slice(startIndex, endIndex);

            // 更新结果计数
            updateResultsCount();

            if (pageData.length === 0) {
                container.innerHTML = \`
                    <div style="text-align: center; padding: 40px; color: #999;">
                        <p style="font-size: 18px;">📭 没有找到匹配的微博</p>
                        <p style="margin-top: 10px;">尝试调整筛选条件</p>
                    </div>
                \`;
                document.getElementById('pagination').innerHTML = '';
                return;
            }

            container.innerHTML = pageData.map((item, index) => {
                const user = item.raw?.user || {};
                const avatar = user.profile_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMyIgeT0iMTMiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDEyIDEzSDhBNCA0IDAgMCAwIDQgMTdWMTlNMTYgN0E0IDQgMCAxIDEgOCA3QTQgNCAwIDAgMSAxNiA3WiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+';
                const globalIndex = startIndex + index + 1;
                
                return \`
                    <div class="weibo-item">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                            <div class="weibo-header" style="margin-bottom: 0;">
                                <img src="\${avatar}" alt="头像" class="avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjUiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMyIgeT0iMTMiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDEyIDEzSDhBNCA0IDAgMCAwIDQgMTdWMTlNMTYgN0E0IDQgMCAxIDEgOCA3QTQgNCAwIDAgMSAxNiA3WiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4KPC9zdmc+'">
                                <div class="user-info">
                                    <div class="username">\${user.screen_name || '微博用户'}</div>
                                    <div class="time">\${formatDate(item.created_at)}</div>
                                </div>
                            </div>
                            <div style="background: #ff6b6b; color: white; padding: 3px 8px; border-radius: 12px; font-size: 12px; min-width: 24px; text-align: center;">
                                #\${globalIndex}
                            </div>
                        </div>
                        
                        <div class="weibo-content">
                            \${formatText(item.text)}
                        </div>
                        
                        \${item.retweeted_status ? generateRetweetHTML(item.retweeted_status, item.raw?.retweeted_status) : ''}
                        
                        \${item.images && item.images.length > 0 ? \`
                            <div class="images-grid">
                                \${item.images.map(img => \`
                                    <img src="\${img}" alt="微博图片" class="weibo-image" onclick="openImage('\${img}')">
                                \`).join('')}
                            </div>
                        \` : ''}
                        
                        \${item.raw ? \`
                            <div class="stats-details">
                                <span>💖 \${item.raw.attitudes_count || 0}</span>
                                <span>🔄 \${item.raw.reposts_count || 0}</span>
                                <span>💬 \${item.raw.comments_count || 0}</span>
                                <span>👁️ \${item.raw.reads_count || 0}</span>
                            </div>
                        \` : ''}
                    </div>
                \`;
            }).join('');

            renderPagination();
        }

        function generateRetweetHTML(retweetedStatus, rawRetweetedStatus) {
            const retweetUser = rawRetweetedStatus?.user || {};
            const retweetAvatar = retweetUser.profile_image_url || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI3IiB5PSI3Ij4KPHBhdGggZD0iTTEzIDEzVjEyQTMgMyAwIDAgMCA3IDlINUEzIDMgMCAwIDAgMiAxMlYxM005IDVBMyAzIDAgMSAxIDMgNUEzIDMgMCAwIDEgOSA1WiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4=';
            
            return \`
                <div class="retweet">
                    <div class="retweet-header">
                        <img src="\${retweetAvatar}" alt="转发作者头像" class="retweet-avatar" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHZpZXdCb3g9IjAgMCAzMCAzMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTUiIGN5PSIxNSIgcj0iMTUiIGZpbGw9IiNmMGYwZjAiLz4KPHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSI3IiB5PSI3Ij4KPHBhdGggZD0iTTEzIDEzVjEyQTMgMyAwIDAgMCA3IDlINUEzIDMgMCAwIDAgMiAxMlYxM005IDVBMyAzIDAgMSAxIDMgNUEzIDMgMCAwIDEgOSA1WiIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4='">
                        <span class="retweet-user">\${retweetUser.screen_name || '微博用户'}</span>
                        <span style="color: #999; font-size: 12px;">\${rawRetweetedStatus?.created_at ? formatDate(rawRetweetedStatus.created_at) : ''}</span>
                    </div>
                    <div class="retweet-content">
                        \${formatText(retweetedStatus.text)}
                    </div>
                    \${retweetedStatus.images && retweetedStatus.images.length > 0 ? \`
                        <div class="images-grid">
                            \${retweetedStatus.images.map(img => \`
                                <img src="\${img}" alt="转发微博图片" class="weibo-image" onclick="openImage('\${img}')">
                            \`).join('')}
                        </div>
                    \` : ''}
                </div>
            \`;
        }

        function renderPagination() {
            const totalPages = Math.ceil(filteredData.length / itemsPerPage);
            const pagination = document.getElementById('pagination');
            
            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }

            let paginationHTML = '';
            
            paginationHTML += \`<button class="page-btn" \${currentPage === 1 ? 'disabled' : ''} onclick="changePage(\${currentPage - 1})">‹ 上一页</button>\`;
            paginationHTML += \`<span class="page-info">第 \${currentPage} / \${totalPages} 页</span>\`;
            
            if (totalPages > 5) {
                if (currentPage > 3) {
                    paginationHTML += \`<button class="page-btn" onclick="changePage(1)">1</button>\`;
                    if (currentPage > 4) {
                        paginationHTML += \`<span class="page-info">...</span>\`;
                    }
                }
            }
            
            for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
                paginationHTML += \`<button class="page-btn \${i === currentPage ? 'active' : ''}" onclick="changePage(\${i})">\${i}</button>\`;
            }
            
            if (totalPages > 5) {
                if (currentPage < totalPages - 2) {
                    if (currentPage < totalPages - 3) {
                        paginationHTML += \`<span class="page-info">...</span>\`;
                    }
                    paginationHTML += \`<button class="page-btn" onclick="changePage(\${totalPages})">\${totalPages}</button>\`;
                }
            }
            
            paginationHTML += \`<button class="page-btn" \${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(\${currentPage + 1})">下一页 ›</button>\`;
            
            pagination.innerHTML = paginationHTML;
        }

        function changePage(page) {
            currentPage = page;
            renderWeibos();
            window.scrollTo(0, 0);
        }

        function formatDate(dateStr) {
            try {
                const date = new Date(dateStr);
                return date.toLocaleString('zh-CN');
            } catch {
                return dateStr;
            }
        }

        function formatText(text) {
            if (!text) return '';
            
            let cleanText = text
                .replace(/<br\\s*\\/?>/gi, '\\n')
                .replace(/<span[^>]*class="expand"[^>]*>.*?<\\/span>/gi, '')
                .replace(/<[^>]+>/g, '')
                .replace(/&nbsp;/g, ' ')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"');
            
            return cleanText
                .replace(/\\n/g, '<br>')
                .replace(/https?:\\/\\/[^\\s]+/g, '<a href="$&" target="_blank" style="color: #ff6b6b;">$&</a>')
                .replace(/@([^@\\s]+)/g, '<span style="color: #ff6b6b;">@$1</span>')
                .replace(/#([^#\\s]+)#/g, '<span style="color: #ff6b6b;">#$1#</span>');
        }

        function openImage(src) {
            window.open(src, '_blank');
        }
    </script>
</body>
</html>`;

  async function fetchContent(uid = 0, page = 1, type = "my") {
    let api = `https://weibo.com/ajax/statuses/mymblog?uid=${uid}&page=${page}&feature=0`;

    if (type === "fav") {
      api = `https://weibo.com/ajax/favorites/all_fav?uid=${uid}&page=${page}`;
    }

    if (type === "like") {
      api = `https://weibo.com/ajax/statuses/likelist?uid=${uid}&page=${page}`;
    }

    const req = await fetch(api, {
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-IN;q=0.8,en;q=0.7,ar;q=0.6",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="101", "Google Chrome";v="101"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
      },
      referrer: `https://weibo.com/u/${uid}`,
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    });
    const data = await req.json();
    return data;
  }

  async function fetchAll(type = "my") {
    var uid = $CONFIG.uid;
    let page = 1;
    let allPageData = [];
    let noMore = false;
    for (let index = 0; index < Infinity; index++) {
      console.log("scan", "page", page);
      printLog(`正在备份第 ${page} 页`);
      for (let index = 0; index < 10; index++) {
        const pageData = await fetchContent(uid, page, type);
        if (pageData.ok) {
          const dataList = type === "fav" ? pageData.data : pageData.data.list;
          allPageData.push(dataList);
          if (dataList.length === 0) noMore = true;
          break;
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 8 * 1000);
        });
        console.log("retry", index);
        printLog(
          `[重试]备份第 ${page} 页，错误内容： ${JSON.stringify(pageData)}`
        );
      }
      page++;
      if (noMore) break;
      await new Promise((resolve) => {
        setTimeout(resolve, 5 * 1000);
      });
    }
    console.log("all done");
    printLog(`备份完毕! 打开【下载内容】查看数据文件`);
    const parsed = allPageData.reduce((all, dataList) => {
      dataList.forEach((c) => {
        const formatted = {
          images:
            c.pic_ids &&
            c.pic_ids.map((d) => {
              return c.pic_infos[d].large.url;
            }),
          text: c.text,
          created_at: c.created_at,
          raw: c,
        };
        if (c.retweeted_status) {
          formatted.retweeted_status = {
            text: c.retweeted_status.text,
            images:
              c.retweeted_status.pic_ids &&
              c.retweeted_status.pic_ids.map((d) => {
                return c.retweeted_status.pic_infos[d].large.url;
              }),
          };
        }
        all.push(formatted);
      });
      return all;
    }, []);
    console.log("data", allPageData, parsed);
    
    // 生成文件名时间戳
    const timestamp = Date.now();
    const typeText = type === 'fav' ? '收藏' : type === 'like' ? '赞' : '微博';
    
    // 下载JSON文件
    download(
      JSON.stringify(parsed, null, 2),
      `weibo-${timestamp}-${type}.json`,
      "application/json"
    );
    
    // 生成并下载HTML文件
    const exportTime = new Date().toLocaleString('zh-CN');
    const htmlContent = htmlTemplate
      .replace('{{WEIBO_DATA}}', JSON.stringify(parsed))
      .replace('{{EXPORT_TIME}}', exportTime);
    
    download(
      htmlContent,
      `weibo-${timestamp}-${type}.html`,
      "text/html"
    );
  }

  function printLog(msg) {
    tip.innerText = msg;
  }

  backup.setAttribute(
    "style",
    "display:none; background: white; color: black; font-size: 13px; padding: 10px 10px 15px 10px;"
  );

  const title = document.createElement("h2");
  title.innerHTML = "微博备份";
  title.setAttribute("style", "font-size: 15px;color: black;margin: 15px 0;");
  wrapper.appendChild(title);
  wrapper.appendChild(backup);

  document.body.appendChild(wrapper);
  wrapper.setAttribute(
    "style",
    `position: fixed;
    border-radius: 3px;
    background: white;
    top: 80px;
    right: 20px;
    z-index: 100000;
    padding:10px 15px;
text-align: center; 
   `
  );

  let started = false;
  let allButtons = [];

  function showAll() {
    allButtons.forEach((btn) => {
      btn.style.display = "block";
    });
  }

  function hideAll() {
    allButtons.forEach((btn) => {
      btn.style.display = "none";
    });
  }

  function createExport(name, type) {
    let btn = document.createElement("button");
    wrapper.appendChild(btn);
    btn.innerHTML = name;
    btn.setAttribute(
      "style",
      `border-radius: 0.166667rem; display: block; font-weight: bold; color: #444; margin:0 auto; padding: 5px 14px;font-size: 13px;text-align: center;border: 1px solid #cfcfcf;margin-top: 3px; cursor: pointer;  margin-bottom: 7px;`
    );
    btn.addEventListener("click", async () => {
      if (started) {
        alert("备份正在进行中...");
        return;
      }
      started = true;
      hideAll();
      backup.style.display = "block";
      indicator.style.display = "inline-block";
      console.log("fetchAll", type);
      await fetchAll(type);
      started = false;
      showAll();
      indicator.style.display = "none";
      backup.style.display = "none";
    });

    allButtons.push(btn);
  }

  let tip = document.getElementById("bMSG");
  let indicator = document.getElementById("bIndicator");

  createExport("备份我的微博", "my");
  createExport("备份我的收藏", "fav");
  createExport("备份我的赞", "like");
})();