// ==UserScript==
// @name         淘宝商品销量抓取工具
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      0.2
// @description  从淘宝搜索页面按照销量排序抓取商品销量数据并导出Excel
// @author       GitHub Copilot
// @match        https://*.s.taobao.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @connect      taobao.com
// @connect      tmall.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/545627/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E9%94%80%E9%87%8F%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/545627/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E9%94%80%E9%87%8F%E6%8A%93%E5%8F%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 禁用淘宝的一些屏蔽措施
    function disableAntiCrawl() {
        try {
            // 尝试禁用一些可能的拦截器
            if (unsafeWindow.XMLHttpRequest.prototype._originalOpen === undefined) {
                unsafeWindow.XMLHttpRequest.prototype._originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
                unsafeWindow.XMLHttpRequest.prototype.open = function() {
                    // 避免请求被中断
                    this.addEventListener('error', function(e) {
                        console.log('XHR 错误被捕获', e);
                    });
                    this.addEventListener('abort', function(e) {
                        console.log('XHR 中断被捕获', e);
                    });
                    return this._originalOpen.apply(this, arguments);
                };
            }
            
            // // 防止页面跳转打断脚本执行
            // window.onbeforeunload = function(e) {
            //     // 如果正在爬取数据，阻止页面跳转
            //     if (GM_getValue('isScrapingActive', false)) {
            //         e = e || window.event;
            //         // 对于现代浏览器
            //         e.returnValue = '正在抓取数据，确定要离开吗？';
            //         // 对于旧浏览器
            //         return '正在抓取数据，确定要离开吗？';
            //     }
            // };
            
            // 禁用可能的反爬虫JavaScript
            const scriptTags = document.querySelectorAll('script');
            scriptTags.forEach(script => {
                if (script.innerHTML.includes('crawler') || 
                    script.innerHTML.includes('spider') || 
                    script.innerHTML.includes('bot')) {
                    script.innerHTML = '';
                }
            });
        } catch (e) {
            console.error('禁用反爬虫措施失败:', e);
        }
    }

    // 创建浮动工具面板
    function createToolPanel() {
        // 删除可能已存在的面板
        const existingPanel = document.getElementById('sales-crawler-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        const panel = document.createElement('div');
        panel.id = 'sales-crawler-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 320px;
            background: #fff;
            border: none;
            border-radius: 8px;
            box-shadow: 0 3px 15px rgba(0,0,0,0.15);
            z-index: 9999;
            padding: 0;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            transition: all 0.3s ease;
            overflow: hidden;
        `;

        // 面板内容
        panel.innerHTML = `
            <div class="panel-header" style="
                padding: 12px 15px;
                background: linear-gradient(135deg, #ff6a00, #ff8533);
                color: white;
                font-weight: bold;
                border-radius: 8px 8px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            ">
                <div style="display: flex; align-items: center;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                        <polyline points="23 4 23 10 17 10"></polyline>
                        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                    <span>淘宝商品销量抓取</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <button id="minimize-btn" style="
                        background: none;
                        border: none;
                        color: white;
                        cursor: pointer;
                        font-size: 18px;
                        padding: 0 8px;
                    ">−</button>
                </div>
            </div>
            
            <div id="panel-content" style="padding: 15px;">
                <div class="input-group" style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 13px; color: #666; margin-bottom: 5px;">搜索关键词</label>
                    <input id="keyword-input" type="text" placeholder="请输入要搜索的商品关键词" style="
                        width: 100%;
                        padding: 10px;
                        box-sizing: border-box;
                        border: 1px solid #e0e0e0;
                        border-radius: 6px;
                        font-size: 14px;
                        transition: border 0.2s;
                    " />
                </div>
                
                <div style="display: flex; margin-bottom: 12px; gap: 10px;">
                    <div class="input-group" style="flex: 1;">
                        <label style="display: block; font-size: 13px; color: #666; margin-bottom: 5px;">最大页数</label>
                        <input id="max-pages" type="number" value="3" min="1" max="100" style="
                            width: 100%;
                            padding: 10px;
                            box-sizing: border-box;
                            border: 1px solid #e0e0e0;
                            border-radius: 6px;
                            font-size: 14px;
                        " />
                    </div>
                    
                    <div class="input-group" style="flex: 1;">
                        <label style="display: block; font-size: 13px; color: #666; margin-bottom: 5px;">排序方式</label>
                        <select id="sort-type" style="
                            width: 100%;
                            padding: 10px;
                            box-sizing: border-box;
                            border: 1px solid #e0e0e0;
                            border-radius: 6px;
                            font-size: 14px;
                            background-color: white;
                        ">
                            <option value="sale-desc" selected>销量降序</option>
                            <option value="price-asc">价格升序</option>
                            <option value="price-desc">价格降序</option>
                            <option value="renqi-desc">人气降序</option>
                        </select>
                    </div>
                </div>
                
                <div class="btn-group" style="display: flex; justify-content: space-between; margin-bottom: 15px; gap: 10px;">
                    <button id="search-btn" style="
                        flex: 1;
                        padding: 10px 15px;
                        background: #ff6a00;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        transition: background 0.2s;
                    ">开始抓取</button>
                    <button id="download-btn" style="
                        flex: 1;
                        padding: 10px 15px;
                        background: #2ecc71;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: bold;
                        transition: background 0.2s;
                    " disabled>下载Excel</button>
                </div>
                
                <div id="status" style="
                    font-size: 13px;
                    color: #666;
                    text-align: center;
                    margin: 10px 0;
                    padding: 8px;
                    border-radius: 4px;
                    background-color: #f9f9f9;
                    min-height: 18px;
                ">准备就绪</div>
                
                <div class="progress-container" style="
                    margin-bottom: 15px;
                    background-color: #f0f0f0;
                    border-radius: 4px;
                    height: 8px;
                    overflow: hidden;
                    display: none;
                ">
                    <div id="progress-bar" style="
                        height: 100%;
                        width: 0%;
                        background-color: #4CAF50;
                        transition: width 0.3s;
                    "></div>
                </div>
                
                <div id="results" style="
                    margin-top: 10px;
                    max-height: 350px;
                    overflow-y: auto;
                    border-top: 1px solid #eee;
                    padding-top: 10px;
                "></div>
            </div>
            
            <div id="panel-footer" style="
                padding: 10px 15px;
                border-top: 1px solid #eee;
                background-color: #f9f9f9;
                font-size: 12px;
                color: #888;
                text-align: center;
            ">
                版本 0.2 · <a href="#" id="help-btn" style="color: #ff6a00; text-decoration: none;">使用帮助</a>
            </div>
        `;

        document.body.appendChild(panel);
        
        // 添加事件监听器
        setupPanelEventListeners(panel);
        
        // 添加拖拽功能
        makeDraggable(panel);
        
        return panel;
    }

    // 设置面板事件监听器
    function setupPanelEventListeners(panel) {
        // 最小化/最大化按钮功能
        const minimizeBtn = panel.querySelector('#minimize-btn');
        const panelContent = panel.querySelector('#panel-content');
        const panelFooter = panel.querySelector('#panel-footer');
        
        minimizeBtn.addEventListener('click', () => {
            if (panelContent.style.display === 'none') {
                // 展开面板
                panelContent.style.display = 'block';
                panelFooter.style.display = 'block';
                minimizeBtn.textContent = '−';
            } else {
                // 折叠面板
                panelContent.style.display = 'none';
                panelFooter.style.display = 'none';
                minimizeBtn.textContent = '+';
            }
        });
        
        // 输入框焦点效果
        const inputs = panel.querySelectorAll('input[type="text"], input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.border = '1px solid #ff6a00';
            });
            
            input.addEventListener('blur', () => {
                input.style.border = '1px solid #e0e0e0';
            });
        });
        
        // 按钮悬停效果
        const searchBtn = panel.querySelector('#search-btn');
        searchBtn.addEventListener('mouseover', () => {
            searchBtn.style.background = '#ff8533';
        });
        
        searchBtn.addEventListener('mouseout', () => {
            searchBtn.style.background = '#ff6a00';
        });
        
        const downloadBtn = panel.querySelector('#download-btn');
        downloadBtn.addEventListener('mouseover', () => {
            if (!downloadBtn.disabled) {
                downloadBtn.style.background = '#27ae60';
            }
        });
        
        downloadBtn.addEventListener('mouseout', () => {
            downloadBtn.style.background = '#2ecc71';
        });
        
        // 帮助按钮功能
        const helpBtn = panel.querySelector('#help-btn');
        helpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showHelp();
        });
        
        // 添加回车键搜索功能
        const keywordInput = panel.querySelector('#keyword-input');
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !searchBtn.disabled) {
                searchBtn.click();
            }
        });
    }

    // 显示帮助信息
    function showHelp() {
        // 创建帮助弹窗
        const helpModal = document.createElement('div');
        helpModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        helpModal.innerHTML = `
            <div style="
                width: 500px;
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
            ">
                <h2 style="margin-top: 0; color: #ff6a00;">淘宝商品销量抓取工具使用帮助</h2>
                <div style="margin-bottom: 20px;">
                    <h3>功能简介</h3>
                    <p>本工具可以帮助您抓取淘宝搜索结果中的商品销量数据，并支持导出为Excel表格。</p>
                    
                    <h3>使用方法</h3>
                    <ol>
                        <li>在"搜索关键词"输入框中输入您想要搜索的商品关键词</li>
                        <li>设置要抓取的最大页数（每页约44个商品）</li>
                        <li>选择排序方式（默认为销量降序）</li>
                        <li>点击"开始抓取"按钮开始抓取数据</li>
                        <li>抓取完成后，可以点击"下载Excel"按钮导出数据</li>
                    </ol>
                    
                    <h3>注意事项</h3>
                    <ul>
                        <li>抓取过程中请不要关闭或刷新页面</li>
                        <li>如需中途停止，可点击"停止抓取"按钮</li>
                        <li>抓取大量数据时可能会被淘宝识别为异常行为，建议设置合理的页数</li>
                        <li>本工具仅供学习研究使用，请勿用于商业用途</li>
                    </ul>
                </div>
                <div style="text-align: center;">
                    <button id="close-help" style="
                        padding: 8px 15px;
                        background: #ff6a00;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                    ">关闭</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpModal);
        
        // 点击关闭按钮或背景关闭帮助
        helpModal.querySelector('#close-help').addEventListener('click', () => {
            helpModal.remove();
        });
        
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.remove();
            }
        });
    }

    // 更新进度条
    function updateProgress(current, max) {
        const progressContainer = document.querySelector('.progress-container');
        const progressBar = document.getElementById('progress-bar');
        
        if (progressContainer && progressBar) {
            // 显示进度条
            progressContainer.style.display = 'block';
            
            // 计算进度百分比
            const percentage = Math.round((current / max) * 100);
            
            // 更新进度条宽度
            progressBar.style.width = `${percentage}%`;
            
            // 根据进度改变颜色
            if (percentage < 30) {
                progressBar.style.backgroundColor = '#ff6a00';
            } else if (percentage < 70) {
                progressBar.style.backgroundColor = '#ffaa33';
            } else {
                progressBar.style.backgroundColor = '#4CAF50';
            }
        }
    }

    // 添加面板拖动功能
    function makeDraggable(element) {
        // 存储初始位置和鼠标位置
        let startX, startY, startLeft, startTop;
        let isDragging = false;
        
        // 获取面板头部元素作为拖拽手柄
        const header = element.querySelector('.panel-header');
        if (!header) return;
        
        // 确保面板有正确的定位样式
        element.style.position = 'fixed';
        element.style.margin = '0';
        
        // 添加拖拽指示样式
        header.style.cursor = 'move';
        header.style.userSelect = 'none';
        
        // 鼠标按下事件
        header.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            // 防止文本选择
            e.preventDefault();
            
            // 记录初始位置
            startX = e.clientX;
            startY = e.clientY;
            
            // 获取面板当前位置
            const rect = element.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            // 标记开始拖拽
            isDragging = true;
            
            // 添加全局拖拽事件监听
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            // 添加拖拽时的视觉反馈
            element.style.transition = 'none'; // 拖拽时禁用过渡效果
            element.style.opacity = '0.9';
            element.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
            
            // 记录在日志中
            console.log('开始拖拽，初始位置:', {x: startX, y: startY, left: startLeft, top: startTop});
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            // 计算位移
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            
            // 应用新位置
            const newLeft = startLeft + dx;
            const newTop = startTop + dy;
            
            // 确保不超出屏幕
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const panelWidth = element.offsetWidth;
            const panelHeight = element.offsetHeight;
            
            // 边界检查，防止面板拖出屏幕
            const boundedLeft = Math.max(0, Math.min(newLeft, viewportWidth - panelWidth / 3));
            const boundedTop = Math.max(0, Math.min(newTop, viewportHeight - 50)); // 留出至少50px高度
            
            // 设置新位置
            element.style.left = `${boundedLeft}px`;
            element.style.top = `${boundedTop}px`;
            element.style.right = 'auto'; // 确保right样式不会干扰
            
            // 记录日志 (但不要太频繁)
            if (Math.random() < 0.05) {
                console.log('拖拽中:', {
                    dx, dy,
                    newLeft, newTop,
                    boundedLeft, boundedTop
                });
            }
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            // 标记结束拖拽
            isDragging = false;
            
            // 移除全局事件监听
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
            
            // 恢复视觉样式
            element.style.transition = 'box-shadow 0.3s, opacity 0.3s';
            element.style.opacity = '1';
            element.style.boxShadow = '0 3px 15px rgba(0,0,0,0.15)';
            
            // 记录最终位置
            console.log('结束拖拽，最终位置:', {
                left: element.style.left,
                top: element.style.top
            });
        }
        
        // 允许通过触摸拖拽（移动设备支持）
        header.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            startDrag(mouseEvent);
            e.preventDefault(); // 防止滚动
        }, { passive: false });
        
        document.addEventListener('touchmove', function(e) {
            if (!isDragging) return;
            
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            drag(mouseEvent);
            e.preventDefault(); // 防止滚动
        }, { passive: false });
        
        document.addEventListener('touchend', function() {
            stopDrag();
        });
        
        // 记录拖拽初始化完成
        console.log('拖拽功能已初始化');
    }

    // 延迟函数
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 手动搜索并抓取
    async function manualSearch(keyword) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = '准备搜索，请耐心等待...';
        
        // 构建搜索URL（按销量排序）
        // s.taobao.com/search?q=%E7%BB%BF%E8%8C%B6&sort=sale-desc&tab=all
        // https://s.taobao.com/search?page=2&q=%E7%BB%BF%E8%8C%B6&sort=sale-desc&tab=all
        const searchUrl = `https://s.taobao.com/search?q=${encodeURIComponent(keyword)}&sort=sale-desc&tab=all`;
        
        // 检查当前是否在搜索页面
        if (!window.location.href.includes('s.taobao.com/search')) {
            window.location.href = searchUrl;
            return null; // 返回null表示需要重新加载页面
        }
        
        // 检查URL参数
        const currentKeyword = getParameterByName('q', window.location.href);
        const currentSort = getParameterByName('sort', window.location.href);
        const currentPage = getParameterByName('page', window.location.href) || '1';
        
        // 如果是首页但关键词或排序不匹配，则跳转
        if (currentKeyword !== keyword || currentSort !== 'sale-desc') {
            window.location.href = searchUrl;
            return null;
        }
        
        // 更新状态显示当前页码
        statusElement.textContent = `正在加载第 ${currentPage} 页数据...`;
        
        // 等待页面元素加载完成
        await waitForPageLoad();
        
        // 提取当前页面的商品数据
        return extractItemsFromCurrentPage();
    }

// 等待页面加载完成
function waitForPageLoad() {
    return new Promise(resolve => {
        // 定义可能的淘宝商品列表选择器
        const selectors = [
            '.m-itemlist .items .item',     // 经典淘宝列表
            '.doubleCard--gO3Bz6bu',        // 新版淘宝卡片
            '.items .item',                 // 通用项目选择器
            '.J_MouserOnverReq',            // 淘宝鼠标悬停元素
            '.grid .item',                  // 网格布局商品
            'div[data-index]',              // 带索引的商品项
            '.contentHolder--gO3Bz6bu',     // 新版淘宝内容容器
            '.commonCard--gO3Bz6bu'         // 新版淘宝通用卡片
        ];
        
        // 首先检查页面是否已经加载了商品元素
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                console.log(`页面已加载，找到 ${elements.length} 个商品，选择器: ${selector}`);
                return setTimeout(resolve, 800); // 短暂延迟确保完全加载
            }
        }
        
        // 设置最大尝试次数和计数器
        let attempts = 0;
        const maxAttempts = 30; // 最多等待30次，约15秒
        
        // 定时检查元素是否出现
        const checkInterval = setInterval(() => {
            attempts++;
            
            // 检查所有可能的选择器
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements && elements.length > 0) {
                    clearInterval(checkInterval);
                    if (observer) observer.disconnect();
                    console.log(`第 ${attempts} 次检查: 找到 ${elements.length} 个商品，选择器: ${selector}`);
                    return setTimeout(resolve, 800); // 短暂延迟确保完全加载
                }
            }
            
            // 超时处理
            if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                if (observer) observer.disconnect();
                console.log(`等待页面加载超时(${maxAttempts * 500}ms)，继续执行`);
                return resolve();
            }
            
            console.log(`等待页面加载中...(${attempts}/${maxAttempts})`);
        }, 500);
        
        // 使用MutationObserver监听DOM变化，更快地检测元素出现
        let observer = null;
        try {
            observer = new MutationObserver(mutations => {
                for (const selector of selectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements && elements.length > 0) {
                        clearInterval(checkInterval);
                        observer.disconnect();
                        console.log(`观察器检测到商品元素，选择器: ${selector}`);
                        return setTimeout(resolve, 800); // 短暂延迟确保完全加载
                    }
                }
            });
            
            // 观察整个文档的变化
            observer.observe(document.body, { 
                childList: true, 
                subtree: true,
                attributes: false, 
                characterData: false
            });
        } catch (e) {
            console.error('创建MutationObserver失败:', e);
        }
        
        // 设置最终超时保护，确保不会永远等待
        setTimeout(() => {
            clearInterval(checkInterval);
            if (observer) observer.disconnect();
            console.log('最终超时保护触发，强制继续执行');
            resolve();
        }, maxAttempts * 500 + 2000);
    });
}
    // 获取URL参数
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    // 从当前页面提取商品数据
    function extractItemsFromCurrentPage() {
        const items = [];
        let productItems = [];
        
        // 尝试多种可能的选择器
        const selectors = [
            '.m-itemlist .items .item',
            '.doubleCard--gO3Bz6bu',
            '.items .item',
            '.J_MouserOnverReq',
            '[data-index]'
        ];
        
        // 找到有效的选择器
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                productItems = elements;
                console.log(`使用选择器 ${selector} 找到 ${elements.length} 个商品`);
                break;
            }
        }
        
        if (productItems.length === 0) {
            console.warn('未找到商品元素，请检查页面结构');
            return items;
        }
        
        // 处理每个商品项
        productItems.forEach((item, index) => {
            try {
                // 获取商品标题
                let title = '';
                const titleSelectors = [
                    '.title a', 
                    '.title--qJ7Xg_90',
                    '.ctx-box .title a',
                    '.title',
                    'a.J_ClickStat'
                ];
                
                for (const selector of titleSelectors) {
                    const titleElement = item.querySelector(selector);
                    if (titleElement) {
                        title = titleElement.textContent.trim();
                        break;
                    }
                }
                
                // 获取商品链接
                let link = '';
                const linkSelectors = [
                    '.title a',
                    'a.J_ClickStat',
                    '.pic a',
                    'a[data-nid]'
                ];
                
                for (const selector of linkSelectors) {
                    const linkElement = item.querySelector(selector);
                    if (linkElement && linkElement.href) {
                        link = linkElement.href;
                        break;
                    }
                }
                
                // 获取销量数据
                let sales = '0';
                const salesSelectors = [
                    '.deal-cnt',
                    '.realSales--XZJiepmt',
                    '.sale-num',
                    '[data-field="itemList"] [data-field="deal"]',
                    '.sale em'
                ];
                
                for (const selector of salesSelectors) {
                    const salesElement = item.querySelector(selector);
                    if (salesElement) {
                        sales = salesElement.textContent.trim();
                        // 处理销量数据
                        sales = sales.replace(/人收货|人付款|笔|付款|\+|收货/g, '');
                        break;
                    }
                }
                
                // 获取店铺名称
                let shop = '';
                const shopSelectors = [
                    '.shop .J_ShopInfo',
                    '.shopNameText--DmtlsDKm',
                    '.shop a',
                    '.shopname'
                ];
                
                for (const selector of shopSelectors) {
                    const shopElement = item.querySelector(selector);
                    if (shopElement) {
                        shop = shopElement.textContent.trim();
                        break;
                    }
                }
                
                // 获取价格
                let price = '';
                const priceSelectors = [
                    '.price strong',
                    '.priceInt--yqqZMJ5a',
                    '.price',
                    '.price em'
                ];
                
                for (const selector of priceSelectors) {
                    const priceElement = item.querySelector(selector);
                    if (priceElement) {
                        price = priceElement.textContent.trim().replace(/[^\d.]/g, '');
                        break;
                    }
                }
                
                // 添加商品数据
                items.push({
                    序号: index + 1,
                    商品名称: title,
                    店铺: shop,
                    价格: price,
                    销量: sales,
                    链接: link
                });
            } catch (error) {
                console.error('提取商品数据出错:', error);
            }
        });
        
        return items;
    }

    // 执行爬取
    async function performScraping(keyword, maxPages) {
        // 设置正在抓取的标志
        GM_setValue('isScrapingActive', true);
        
        // 更新状态
        const statusElement = document.getElementById('status');
        const resultsElement = document.getElementById('results');
        
        statusElement.textContent = '开始搜索...';
        
        try {
            // 从缓存恢复已抓取数据
            let allItems = [];
            const cachedData = GM_getValue('currentItems');
            if (cachedData) {
                try {
                    allItems = JSON.parse(cachedData);
                    console.log(`恢复了${allItems.length}条缓存数据`);
                    
                    // 显示恢复的数据
                    if (allItems.length > 0) {
                        displayResults(allItems, resultsElement);
                    }
                } catch (e) {
                    console.error('解析缓存数据出错:', e);
                    // 如果解析出错，重置数据
                    allItems = [];
                    GM_setValue('currentItems', JSON.stringify([]));
                }
            }
            
            // 检查我们当前在哪一页
            let currentPage = getPageFromUrl(window.location.href);
            console.log(`当前页码: ${currentPage}, 最大页数: ${maxPages}`);
            
            // 确保我们有正确的数据
            if (currentPage > 1 && allItems.length === 0) {
                // 如果我们在非第一页但没有之前的数据，回到第一页
                console.log('在非第一页但没有历史数据，跳回第一页');
                await navigateToPage(1, keyword);
                return;
            }
            
            // 执行搜索，可能会导致页面内容更新
            const pageItems = await manualSearch(keyword);
            if (pageItems === null) {
                // 页面将更新，中断当前执行
                console.log('搜索操作会导致页面刷新，暂停执行');
                return;
            }
            
            console.log(`从当前页面提取了 ${pageItems.length} 条商品数据`);
            
            // 将当前页数据添加到总数据集
            if (currentPage === 1) {
                // 第一页直接替换数据
                allItems = pageItems;
                console.log(`第1页：设置 ${pageItems.length} 条数据作为起始数据`);
            } else {
                // 对于后续页面，附加新数据
                console.log(`第${currentPage}页：合并数据，当前总数据量: ${allItems.length}，新数据量: ${pageItems.length}`);
                
                // 改进的重复检测逻辑：同时考虑商品名称和店铺名称
                const uniqueItems = [];
                const existingItemKeys = new Set();
                
                // 先为现有数据创建唯一键集合
                allItems.forEach(item => {
                    // 创建唯一键：商品名称 + 店铺名称，这样可以更精确地识别重复商品
                    const uniqueKey = `${item.商品名称}|${item.店铺}`;
                    existingItemKeys.add(uniqueKey);
                });
                
                // 筛选新数据中不重复的项目
                pageItems.forEach(item => {
                    const uniqueKey = `${item.商品名称}|${item.店铺}`;
                    
                    // 如果该商品不存在于现有数据中，添加它
                    if (!existingItemKeys.has(uniqueKey)) {
                        // 设置正确的序号
                        item.序号 = allItems.length + uniqueItems.length + 1;
                        uniqueItems.push(item);
                        // 添加到已存在键集合中，避免当前页内的重复
                        existingItemKeys.add(uniqueKey);
                    }
                });
                
                console.log(`过滤后添加 ${uniqueItems.length} 条新数据，丢弃 ${pageItems.length - uniqueItems.length} 条重复数据`);
                
                // 合并数据
                allItems = allItems.concat(uniqueItems);
            }
            
            // 按销量排序数据 - 修改为按照销量排序
            allItems.sort((a, b) => {
                // 销量数据预处理：移除逗号、点和其他非数字字符，然后转为整数
                const salesA = parseInt(a.销量.replace(/[,\.万+]/g, '')) || 0;
                const salesB = parseInt(b.销量.replace(/[,\.万+]/g, '')) || 0;
                return salesB - salesA;  // 降序排序
            });
            
            // 重新标记序号
            allItems.forEach((item, index) => {
                item.序号 = index + 1;
            });
            
            // 保存当前数据
            GM_setValue('currentItems', JSON.stringify(allItems));
            console.log(`已保存 ${allItems.length} 条数据到缓存`);
            
            // 显示抓取结果
            statusElement.textContent = `已抓取 ${allItems.length} 条数据，当前第 ${currentPage}/${maxPages} 页`;
            
            // 显示数据
            displayResults(allItems, resultsElement);
            
            // 决定是否继续抓取下一页
            if (currentPage < maxPages) {
                statusElement.textContent = `已抓取第 ${currentPage}/${maxPages} 页，总计 ${allItems.length} 条数据，准备下一页...`;
                
                // 保存当前数据
                GM_setValue('currentItems', JSON.stringify(allItems));
                GM_setValue('currentPage', currentPage + 1);
                GM_setValue('maxPages', maxPages);
                GM_setValue('keyword', keyword);
                
                // 添加停止按钮 - 新增功能
                addStopButton();
                
                // 延迟一下以便用户查看
                await delay(1000);
                
                // 使用新函数导航到下一页，优先使用页面内按钮点击
                await navigateToPage(currentPage + 1, keyword);
            } else {
                // 全部抓取完成
                finishScraping(allItems);
            }
        } catch (error) {
            console.error('抓取过程中出错:', error);
            statusElement.textContent = '抓取过程中出错，请重试: ' + error.message;
            GM_setValue('isScrapingActive', false);
        }
    }
    // 显示结果
    function displayResults(items, resultsElement) {
        // 限制显示数量，避免浏览器卡顿
        const maxDisplayItems = 100;
        const displayItems = items.slice(0, maxDisplayItems);
        
        let html = `
            <div style="margin-top:10px;font-size:12px;">
                <p>已抓取 ${items.length} 条数据${items.length > maxDisplayItems ? `（显示前 ${maxDisplayItems} 条）` : ''}</p>
                <table style="width:100%;border-collapse:collapse;font-size:12px;">
                    <thead>
                        <tr>
                            <th style="padding:5px;border:1px solid #ddd;background:#f5f5f5;">序号</th>
                            <th style="padding:5px;border:1px solid #ddd;background:#f5f5f5;">商品名称</th>
                            <th style="padding:5px;border:1px solid #ddd;background:#f5f5f5;">价格</th>
                            <th style="padding:5px;border:1px solid #ddd;background:#f5f5f5;">销量</th>
                            <th style="padding:5px;border:1px solid #ddd;background:#f5f5f5;">店铺</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${displayItems.map(item => `
                            <tr>
                                <td style="padding:5px;border:1px solid #ddd;text-align:center;">${item.序号}</td>
                                <td style="padding:5px;border:1px solid #ddd;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.商品名称}">${item.商品名称 || '未知'}</td>
                                <td style="padding:5px;border:1px solid #ddd;text-align:center;">${item.价格 || '0'}</td>
                                <td style="padding:5px;border:1px solid #ddd;text-align:center;">${item.销量 || '0'}</td>
                                <td style="padding:5px;border:1px solid #ddd;">${item.店铺 || '未知'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
        
        resultsElement.innerHTML = html;
    }

    // 继续抓取（从页面刷新后恢复）
    async function continueScraping() {
        if (!GM_getValue('isScrapingActive')) return;
        
        const keyword = GM_getValue('keyword');
        const maxPages = GM_getValue('maxPages', 3);
        
        // 当前页面URL中的页码参数
        const pageParam = getParameterByName('page') || '1';
        const currentPage = parseInt(pageParam);
        
        // 更新UI状态
        if (document.getElementById('keyword-input')) {
            document.getElementById('keyword-input').value = keyword;
        }
        
        if (document.getElementById('max-pages')) {
            document.getElementById('max-pages').value = maxPages;
        }
        
        // 禁用搜索按钮
        if (document.getElementById('search-btn')) {
            document.getElementById('search-btn').disabled = true;
        }
        
        // 继续抓取流程
        await performScraping(keyword, maxPages);
    }

    // 完成抓取
    function finishScraping(allItems) {
        const statusElement = document.getElementById('status');
        statusElement.textContent = `抓取完成，共获取 ${allItems.length} 条数据`;
        
        // 保存最终数据
        GM_setValue('finalScrapedData', JSON.stringify(allItems));
        
        // 清理中间状态
        GM_deleteValue('currentItems');
        GM_deleteValue('currentPage');
        GM_deleteValue('isScrapingActive');
        
        // 启用下载按钮
        document.getElementById('download-btn').disabled = false;
    }

    // 导出Excel
    function exportToExcel() {
        try {
            // 获取最终数据
            const data = JSON.parse(GM_getValue('finalScrapedData') || '[]');
            
            if (!data || data.length === 0) {
                alert('没有可导出的数据');
                return;
            }
            
            // 准备表头和数据
            const header = ["序号", "商品名称", "店铺", "价格", "销量", "链接"];
            const rows = data.map(item => [
                item.序号,
                item.商品名称 || '',
                item.店铺 || '',
                item.价格 || '',
                item.销量 || '0',
                item.链接 || ''
            ]);
            
            // 创建工作表
            const worksheet = XLSX.utils.aoa_to_sheet([header, ...rows]);
            
            // 设置列宽
            const wscols = [
                {wch: 6},   // 序号
                {wch: 40},  // 商品名称
                {wch: 20},  // 店铺
                {wch: 10},  // 价格
                {wch: 10},  // 销量
                {wch: 60}   // 链接
            ];
            worksheet['!cols'] = wscols;
            
            // 创建工作簿并添加工作表
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "销量数据");
            
            // 获取文件名
            const keyword = GM_getValue('keyword') || '淘宝商品';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
            const fileName = `${keyword}_销量数据_${timestamp}.xlsx`;
            
            // 导出文件
            XLSX.writeFile(workbook, fileName);
            
            console.log('Excel导出成功:', fileName);
        } catch (error) {
            console.error('导出Excel出错:', error);
            alert('导出Excel失败: ' + error.message);
        }
    }

// 添加URL变更监听
function setupUrlChangeListener() {
    // 存储当前URL以便检测变化
    let lastUrl = window.location.href;
    
    // 创建一个观察器来监视URL变化
    const observer = new MutationObserver(() => {
        if (lastUrl !== window.location.href) {
            console.log(`URL已变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            
            // 处理URL变更
            handleUrlChange(oldUrl, lastUrl);
        }
    });
    
    // 开始观察document变化
    observer.observe(document, { subtree: true, childList: true });
    
    // 自定义事件监听
    window.addEventListener('urlchanged', function() {
        if (lastUrl !== window.location.href) {
            console.log(`通过自定义事件检测到URL变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            handleUrlChange(oldUrl, lastUrl);
        }
    });
    
    // 通过监听popstate事件捕获浏览器历史导航
    window.addEventListener('popstate', function() {
        if (lastUrl !== window.location.href) {
            console.log(`通过popstate检测到URL变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            handleUrlChange(oldUrl, lastUrl);
        }
    });
    
    // 通过监听hashchange事件捕获hash变更
    window.addEventListener('hashchange', function() {
        if (lastUrl !== window.location.href) {
            console.log(`通过hashchange检测到URL变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            handleUrlChange(oldUrl, lastUrl);
        }
    });
    
    // 重写history方法以捕获pushState和replaceState
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        if (lastUrl !== window.location.href) {
            console.log(`通过pushState检测到URL变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            handleUrlChange(oldUrl, lastUrl);
        }
    };
    
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        if (lastUrl !== window.location.href) {
            console.log(`通过replaceState检测到URL变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            handleUrlChange(oldUrl, lastUrl);
        }
    };
    
    // 定期检查URL变化（针对某些特殊情况）
    setInterval(() => {
        if (lastUrl !== window.location.href) {
            console.log(`通过轮询检测到URL变更: ${lastUrl} -> ${window.location.href}`);
            const oldUrl = lastUrl;
            lastUrl = window.location.href;
            handleUrlChange(oldUrl, lastUrl);
        }
    }, 1000);
}
    // 处理URL变更
    async function handleUrlChange(oldUrl, newUrl) {
        try {
            // 检查页面是否改变
            const oldPage = getPageFromUrl(oldUrl);
            const newPage = getPageFromUrl(newUrl);
            
            console.log(`URL变更: ${oldUrl} -> ${newUrl}`);
            console.log(`页码变更: ${oldPage} -> ${newPage}`);
            
            // 检查是否是淘宝搜索页面
            const isSearchPage = newUrl.includes('s.taobao.com/search');
            
            // 如果不是搜索页面，则不处理
            if (!isSearchPage) {
                console.log('不是搜索页面，不处理URL变更');
                return;
            }
            
            // 检查是否正在抓取
            const isActive = GM_getValue('isScrapingActive', false);
            if (!isActive) {
                console.log('没有正在进行的抓取任务，不处理URL变更');
                return;
            }
            
            // 分析URL变更是否是分页变更
            if (oldPage !== newPage) {
                console.log(`检测到页码从 ${oldPage} 变更为 ${newPage}`);
                
                // 更新当前页码
                GM_setValue('currentPage', newPage);
                
                // 等待新页面加载
                await waitForPageLoad();
                
                // 继续抓取
                const keyword = GM_getValue('keyword');
                const maxPages = GM_getValue('maxPages', 3);
                await performScraping(keyword, maxPages);
            } else {
                console.log('页码未变更，不处理');
            }
        } catch (error) {
            console.error('处理URL变更时出错:', error);
        }
    }
    // 从URL中提取页码
    function getPageFromUrl(url) {
        // 尝试获取page参数
        const pageParam = getParameterByName('page', url);
        if (pageParam) {
            return parseInt(pageParam);
        }
        
        // 尝试获取s参数（s=44对应第2页，s=88对应第3页，以此类推）
        const sParam = getParameterByName('s', url);
        if (sParam) {
            return Math.floor(parseInt(sParam) / 44) + 1;
        }
        
        // 默认为第1页
        return 1;
    }
// 导航到特定页码
async function navigateToPage(pageNum, keyword) {
    console.log(`正在导航到第 ${pageNum} 页...`);
    
    // 更新状态显示
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = `正在跳转到第 ${pageNum} 页...`;
    }
    
    // 尝试点击分页按钮
    const result = await handlePagination(pageNum, keyword);
    
    // 如果点击按钮失败，尝试回退到其他方式
    if (!result) {
        console.log('点击分页按钮失败，尝试备用方案...');
        
        // 检查是否已经在正确的页面
        const currentPage = getPageFromUrl(window.location.href);
        if (currentPage === pageNum) {
            console.log(`已经在第 ${pageNum} 页，无需导航`);
            return true;
        }
        
        // 尝试点击"下一页"按钮（如果需要前进一页）
        if (pageNum === currentPage + 1) {
            const nextBtn = document.querySelector('.J_Ajax.next, .ui-page-s-next, .ui-page-next, a.next-page');
            if (nextBtn) {
                console.log('使用"下一页"按钮导航...');
                nextBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await delay(500);
                nextBtn.click();
                return true;
            }
        }
        
        // 最后的备选方案：直接修改URL（避免此方式但保留作为最后手段）
        console.log('无法通过点击按钮导航，尝试直接修改URL（备选方案）');
        const baseUrl = `https://s.taobao.com/search`;
        // 注意：此处修复了URL构建的问题，添加了缺失的&符号
        let targetUrl = `${baseUrl}?page=${pageNum}&q=${encodeURIComponent(keyword)}&sort=sale-desc&tab=all`;        // const targetUrl = `${baseUrl}?q=${encodeURIComponent(keyword)}&sort=sale-desc&page=${pageNum}`;
        
        // 使用pushState而不是直接修改location
        if (window.history && window.history.pushState) {
            window.history.pushState({}, '', targetUrl);
            // 触发一个自定义事件，便于我们的URL监听器捕获
            window.dispatchEvent(new Event('urlchanged'));
            return true;
        } else {
            // 最后手段
            window.location.href = targetUrl;
            return true;
        }
    }
    
    return true;
}

// 处理分页点击
async function handlePagination(pageNum, keyword) {
    try {
        console.log(`尝试点击第 ${pageNum} 页按钮...`);
        
        // 新增针对淘宝新版分页的选择器
        const nextPaginationSelectors = [
            // 新版淘宝分页按钮
            '.next-pagination-item',
            '.next-btn.next-medium.next-btn-normal.next-pagination-item',
            '.next-pagination-list button',
            // 老版淘宝分页按钮
            '.J_Ajax.num',
            '.ui-page-s-next', 
            'li.item', 
            'a[data-value]',
            '.pagination a',
            '.page-item', 
            '.page-number',
            '.pagination-item',
            '.item.J_Ajax'
        ];
        
        // 先尝试精确匹配目标页码的按钮
        let targetBtn = null;
        let pageClicked = false;

        // 尝试方法1: 使用aria-label属性查找(新版淘宝最准确的方式)
        const ariaLabelButtons = Array.from(document.querySelectorAll('button[aria-label*="页"]'));
        for (const btn of ariaLabelButtons) {
            const ariaLabel = btn.getAttribute('aria-label') || '';
            if (ariaLabel.includes(`第${pageNum}页`)) {
                console.log(`通过aria-label找到第${pageNum}页按钮: ${ariaLabel}`);
                targetBtn = btn;
                break;
            }
        }
        
        // 尝试方法2: 使用按钮内容文本匹配
        if (!targetBtn) {
            // 遍历所有可能的分页按钮
            for (const selector of nextPaginationSelectors) {
                const buttons = document.querySelectorAll(selector);
                for (const btn of buttons) {
                    // 检查按钮文本是否与目标页码匹配
                    const btnText = btn.textContent.trim();
                    if (btnText === String(pageNum)) {
                        console.log(`通过文本内容找到第${pageNum}页按钮: ${btnText}`);
                        targetBtn = btn;
                        break;
                    }
                    
                    // 检查按钮中的span元素
                    const helperSpan = btn.querySelector('.next-btn-helper');
                    if (helperSpan && helperSpan.textContent.trim() === String(pageNum)) {
                        console.log(`通过.next-btn-helper找到第${pageNum}页按钮: ${helperSpan.textContent}`);
                        targetBtn = btn;
                        break;
                    }
                }
                if (targetBtn) break;
            }
        }
        
        // 如果找到了目标按钮，执行点击
        if (targetBtn) {
            console.log(`找到第${pageNum}页按钮，准备点击...`);
            
            // 确保按钮可见
            targetBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await delay(500);
            
            // 尝试多种点击方式
            try {
                // 1. 常规点击
                targetBtn.click();
                console.log(`点击第${pageNum}页按钮成功`);
                pageClicked = true;
            } catch (e) {
                console.log(`常规点击失败，尝试模拟鼠标事件: ${e.message}`);
                
                // 2. 使用MouseEvent模拟点击
                try {
                    const clickEvent = new MouseEvent('click', {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    targetBtn.dispatchEvent(clickEvent);
                    console.log(`使用MouseEvent点击第${pageNum}页按钮成功`);
                    pageClicked = true;
                } catch (e2) {
                    console.error(`点击事件模拟失败: ${e2.message}`);
                    
                    // 3. 触发按钮的onmousedown和onmouseup事件
                    try {
                        const mouseDown = new MouseEvent('mousedown', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        const mouseUp = new MouseEvent('mouseup', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        
                        targetBtn.dispatchEvent(mouseDown);
                        await delay(10);
                        targetBtn.dispatchEvent(mouseUp);
                        console.log(`使用mousedown/up事件点击第${pageNum}页按钮`);
                        pageClicked = true;
                    } catch (e3) {
                        console.error(`所有点击方法均失败: ${e3.message}`);
                    }
                }
            }
        }
        
        // 方法3: 如果目标页码按钮无法找到或点击失败，尝试使用"下一页"按钮
        if (!pageClicked && pageNum > 1) {
            // 先查找下一页按钮
            let nextPageBtn = null;
            
            // 针对新版淘宝下一页按钮
            const nextBtnCandidates = [
                document.querySelector('.next-btn.next-medium.next-btn-normal.next-pagination-item.next-next'),
                document.querySelector('button[aria-label*="下一页"]'),
                document.querySelector('.next-pagination-item.next-next'),
                document.querySelector('.J_Ajax.next'),
                document.querySelector('.ui-page-s-next'),
                document.querySelector('button.next-btn:has(span.next-btn-helper:contains("下一页"))'),
                document.querySelector('a.next-page')
            ];
            
            for (const btn of nextBtnCandidates) {
                if (btn) {
                    nextPageBtn = btn;
                    break;
                }
            }
            
            // 如果找到下一页按钮，尝试点击
            if (nextPageBtn) {
                console.log('使用"下一页"按钮导航...');
                nextPageBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
                await delay(500);
                
                try {
                    nextPageBtn.click();
                    console.log('"下一页"按钮点击成功');
                    pageClicked = true;
                } catch (e) {
                    console.error(`点击"下一页"按钮失败: ${e.message}`);
                    try {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        nextPageBtn.dispatchEvent(clickEvent);
                        console.log(`使用MouseEvent点击"下一页"按钮成功`);
                        pageClicked = true;
                    } catch (e2) {
                        console.error(`所有点击"下一页"方式均失败: ${e2.message}`);
                    }
                }
            }
        }
        
        // 方法4: 尝试使用跳转输入框(淘宝新版分页特有)
        if (!pageClicked) {
            const jumpInput = document.querySelector('.next-pagination-jump-input input');
            const jumpBtn = document.querySelector('.next-pagination-jump-go');
            
            if (jumpInput && jumpBtn) {
                console.log(`尝试使用跳转输入框跳转到第${pageNum}页...`);
                
                // 设置输入框值
                jumpInput.value = String(pageNum);
                
                // 触发输入框change事件
                jumpInput.dispatchEvent(new Event('change', { bubbles: true }));
                jumpInput.dispatchEvent(new Event('input', { bubbles: true }));
                
                await delay(300);
                
                // 点击确定按钮
                try {
                    jumpBtn.click();
                    console.log('跳转按钮点击成功');
                    pageClicked = true;
                } catch (e) {
                    console.log(`点击跳转按钮失败: ${e.message}`);
                    try {
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true
                        });
                        jumpBtn.dispatchEvent(clickEvent);
                        console.log(`使用MouseEvent点击跳转按钮成功`);
                        pageClicked = true;
                    } catch (e2) {
                        console.error(`所有点击跳转按钮方式均失败: ${e2.message}`);
                    }
                }
            }
        }
        
        // 如果所有点击方法都失败，记录详细的分页元素信息
        if (!pageClicked) {
            console.log('所有点击方法都失败，记录分页元素信息:');
            
            // 打印所有可能的分页元素的HTML
            const paginationContainer = document.querySelector('.next-pagination') || 
                                       document.querySelector('.pgWrap--RTFKoWa6') ||
                                       document.querySelector('.pagination');
                                       
            if (paginationContainer) {
                console.log('分页容器HTML:', paginationContainer.outerHTML);
                
                // 尝试使用URL方式进行导航
                // 构建请求URL
                const baseUrl = `https://s.taobao.com/search`;
                const targetUrl = `${baseUrl}?page=${pageNum}&q=${encodeURIComponent(keyword)}&sort=sale-desc&tab=all`;
                
                // 使用pushState而不是直接修改location
                if (window.history && window.history.pushState) {
                    window.history.pushState({}, '', targetUrl);
                    window.dispatchEvent(new Event('urlchanged'));
                    console.log(`尝试使用pushState跳转到: ${targetUrl}`);
                    pageClicked = true;
                }
            } else {
                console.log('未找到分页容器');
            }
        }
        
        // 等待URL变化确认分页是否成功
        if (pageClicked) {
            console.log('分页操作已执行，等待URL变化...');
            const originalUrl = window.location.href;
            
            // 等待URL变化或超时
            const urlChangePromise = new Promise((resolve) => {
                let checkCount = 0;
                const maxChecks = 20; // 10秒超时 (500ms * 20)
                
                const checkInterval = setInterval(() => {
                    checkCount++;
                    if (window.location.href !== originalUrl) {
                        clearInterval(checkInterval);
                        console.log(`URL已变化: ${originalUrl} -> ${window.location.href}`);
                        resolve(true);
                    } else if (checkCount >= maxChecks) {
                        clearInterval(checkInterval);
                        console.log(`URL未变化，可能页码未更新，已等待${maxChecks * 500 / 1000}秒`);
                        resolve(false);
                    }
                }, 500);
            });
            
            const urlChanged = await urlChangePromise;
            return urlChanged || pageClicked; // 如果URL变化或按钮点击成功，视为成功
        }
        
        return pageClicked;
    } catch (error) {
        console.error('分页处理出错:', error);
        return false;
    }
}

    // 添加停止按钮
    function addStopButton() {
        if (document.getElementById('stop-btn')) return;
        
        const btnContainer = document.querySelector('#search-btn').parentNode;
        if (!btnContainer) return;
        
        const stopBtn = document.createElement('button');
        stopBtn.id = 'stop-btn';
        stopBtn.textContent = '停止抓取';
        stopBtn.style.cssText = `
            padding: 8px 15px;
            background: #e74c3c;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
            width: 100%;
        `;
        
        stopBtn.addEventListener('click', () => {
            // 停止抓取过程
            GM_setValue('isScrapingActive', false);
            
            // 更新UI
            document.getElementById('status').textContent = '已手动停止抓取';
            document.getElementById('search-btn').disabled = false;
            
            // 如果已有数据，启用下载按钮
            const items = JSON.parse(GM_getValue('currentItems') || '[]');
            if (items.length > 0) {
                GM_setValue('finalScrapedData', JSON.stringify(items));
                document.getElementById('download-btn').disabled = false;
            }
            
            // 移除停止按钮
            stopBtn.remove();
        });
        
        btnContainer.appendChild(stopBtn);
    }

   // 主函数
function init() {
    console.log('淘宝商品销量抓取工具初始化...');
    
    // 禁用反爬措施
    disableAntiCrawl();
    
    // 设置URL变更监听
    setupUrlChangeListener();
    
    // 创建工具面板
    createToolPanel();
    
    // 绑定开始抓取按钮事件
    document.getElementById('search-btn').addEventListener('click', async () => {
        const keyword = document.getElementById('keyword-input').value;
        const maxPages = parseInt(document.getElementById('max-pages').value) || 3;
        
        if (!keyword) {
            alert('请输入搜索关键词');
            return;
        }
        
        // 清理所有之前的数据
        GM_deleteValue('currentItems');
        GM_deleteValue('currentPage');
        GM_deleteValue('finalScrapedData');
        GM_setValue('isScrapingActive', true);
        GM_setValue('keyword', keyword);
        GM_setValue('maxPages', maxPages);
        
        // 重置UI状态
        document.getElementById('results').innerHTML = '';
        document.getElementById('status').textContent = '准备开始新的抓取...';
        
        // 禁用按钮防止重复点击
        document.getElementById('search-btn').disabled = true;
        document.getElementById('download-btn').disabled = true;
        
        // 执行搜索并获取数据
        await performScraping(keyword, maxPages);
    });
    
    // 绑定下载按钮事件
    document.getElementById('download-btn').addEventListener('click', exportToExcel);
    
    // 重要修改点：不再自动继续抓取，而是立即停止任务并恢复UI状态
    if (GM_getValue('isScrapingActive')) {
        // 检查是否是页面刷新而非正常导航
        const isPageRefresh = performance.navigation && 
                             (performance.navigation.type === 1 || // 标准刷新类型
                              performance.getEntriesByType('navigation')[0]?.type === 'reload'); // 新API
        
        if (isPageRefresh) {
            console.log('检测到页面刷新，停止抓取任务');
            
            // 尝试保存已有数据为最终数据
            const cachedItems = GM_getValue('currentItems');
            if (cachedItems) {
                GM_setValue('finalScrapedData', cachedItems);
                
                try {
                    const data = JSON.parse(cachedItems);
                    const statusElement = document.getElementById('status');
                    if (statusElement && data && data.length > 0) {
                        statusElement.textContent = `抓取已停止，已保存 ${data.length} 条数据`;
                        
                        // 显示数据
                        const resultsElement = document.getElementById('results');
                        if (resultsElement) {
                            displayResults(data, resultsElement);
                        }
                        
                        // 启用下载按钮
                        document.getElementById('download-btn').disabled = false;
                        document.getElementById('search-btn').disabled = false;

                        // 显示通知
                        showNotification(`页面已刷新，抓取已停止，已保存 ${data.length} 条数据`, 'warning');
                    }
                } catch (e) {
                    console.error('解析已保存数据出错:', e);
                }
            }
            
            // 关闭抓取活动状态
            GM_setValue('isScrapingActive', false);
            
            // 恢复关键词和页数设置
            document.getElementById('keyword-input').value = GM_getValue('keyword', '');
            document.getElementById('max-pages').value = GM_getValue('maxPages', 3);
        } else {
            console.log('正常导航，不再继续抓取任务');
            // 关闭抓取活动状态
            GM_setValue('isScrapingActive', false);
        }
    } else {
        // 检查是否有最终数据
        const finalData = GM_getValue('finalScrapedData');
        if (finalData) {
            try {
                const data = JSON.parse(finalData);
                if (data && data.length > 0) {
                    // 恢复UI状态
                    document.getElementById('keyword-input').value = GM_getValue('keyword', '');
                    document.getElementById('max-pages').value = GM_getValue('maxPages', 3);
                    
                    // 启用下载按钮
                    document.getElementById('download-btn').disabled = false;
                    
                    // 更新状态
                    const statusElement = document.getElementById('status');
                    statusElement.textContent = `已加载之前抓取的 ${data.length} 条数据`;
                    
                    // 显示数据
                    const resultsElement = document.getElementById('results');
                    displayResults(data, resultsElement);
                }
            } catch (e) {
                console.error('解析已保存数据出错:', e);
            }
        }
    }
}
// 显示通知提示
function showNotification(message, type = 'info') {
    try {
        // 先检查是否已有通知，如果有则移除
        const existingNotification = document.getElementById('crawler-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建通知元素
        const notification = document.createElement('div');
        notification.id = 'crawler-notification';
        
        // 设置不同类型的样式
        let backgroundColor = '#3498db'; // 默认信息色
        let icon = 'ℹ️';
        
        if (type === 'success') {
            backgroundColor = '#2ecc71';
            icon = '✅';
        } else if (type === 'warning') {
            backgroundColor = '#f39c12';
            icon = '⚠️';
        } else if (type === 'error') {
            backgroundColor = '#e74c3c';
            icon = '❌';
        }
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 20px;
            background-color: ${backgroundColor};
            color: white;
            border-radius: 4px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            font-size: 14px;
            font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
            z-index: 10000;
            display: flex;
            align-items: center;
            animation: fadeIn 0.3s ease;
        `;
        
        notification.innerHTML = `
            <span style="margin-right: 8px; font-size: 16px;">${icon}</span>
            <span>${message}</span>
        `;
        
        // 添加到文档
        document.body.appendChild(notification);
        
        // 添加CSS动画
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -10px); }
                to { opacity: 1; transform: translate(-50%, 0); }
            }
        `;
        document.head.appendChild(style);
        
        // 设置自动消失
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translate(-50%, -10px)';
            notification.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                notification.remove();
                style.remove();
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('显示通知出错:', error);
    }
}

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000); // 延迟初始化以确保页面加载完成
    }
    
    // 添加调试信息
    console.log('淘宝商品销量抓取工具已加载');
})();