// ==UserScript==
// @name         VVQuest - VV表情包助手
// @namespace    https://zvv.quest/
// @version      0.1.3
// @description  基于 VVQuest 项目的表情包检索工具，适用于百度和知乎
// @author       xy0v0
// @match        *://*.baidu.com/*
// @match        *://*.zhihu.com/*
// @icon         https://cn-sy1.rains3.com/pic/pic/2025/03/e0607ef1dfd70ae54612c795de0c4de5.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_addStyle
// @connect      api.zvv.quest
// @license      CC BY-NC-SA 4.0
// @downloadURL https://update.greasyfork.org/scripts/528477/VVQuest%20-%20VV%E8%A1%A8%E6%83%85%E5%8C%85%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528477/VVQuest%20-%20VV%E8%A1%A8%E6%83%85%E5%8C%85%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 脚本配置
    const config = {
        apiUrl: 'https://api.zvv.quest/search',
        enhancedApiUrl: 'https://api.zvv.quest/enhancedsearch',
        cooldownTime: 3000, // 无联网搜索时冷却时间，单位毫秒
        enhancedCooldownTime: 10000, // 联网搜索时冷却时间，单位毫秒
        lastRequestTime: 0,
        enableNetworkSearch: false, // 是否启用联网搜索功能
        isSearching: false, // 是否正在搜索
    };
    
    // 添加样式
    GM_addStyle(`
        /* 统一的按钮样式，基于知乎样式 */
        .vvquest-btn {
            background: linear-gradient(135deg, #0084ff, #0066cc);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 15px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            margin: 0 8px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 8px rgba(0, 132, 255, 0.4);
        }
        
        /* 搜索区域样式 */
        .vvquest-search-section {
            margin-bottom: 15px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        .vvquest-section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background-color: #f5f5f5;
            border-bottom: 1px solid #e0e0e0;
            cursor: pointer;
        }
        .vvquest-section-title {
            font-weight: bold;
            color: #333;
        }
        .vvquest-toggle-btn {
            background: none;
            border: none;
            color: #666;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s ease;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .vvquest-toggle-btn.collapsed {
            transform: rotate(-90deg);
        }
        .vvquest-toggle-btn.collapsed {
            transform: rotate(-90deg);
        }
        .vvquest-search-content {
            padding: 15px;
            transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
            max-height: 1000px;
            opacity: 1;
            overflow: hidden;
        }
        .vvquest-search-content.collapsed {
            max-height: 0;
            opacity: 0;
            padding-top: 0;
            padding-bottom: 0;
        }
        .vvquest-btn:hover {
            background: linear-gradient(135deg, #0066cc, #004c99);
            box-shadow: 0 4px 12px rgba(0, 132, 255, 0.6);
            transform: translateY(-2px);
        }
        .vvquest-btn:active {
            transform: translateY(1px);
            box-shadow: 0 1px 4px rgba(0, 132, 255, 0.3);
        }
        
        /* 其他样式保持不变 */
        .vvquest-floating-btn {
            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 9999;
            width: auto;
            height: auto;
            padding: 10px 16px;
            font-size: 16px;
        }

        /* 知乎左下角固定按钮样式 - 继承统一样式 */
        .vvquest-zhihu-btn {
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 9999;
            width: auto;
            height: auto;
            padding: 10px 16px;
            font-size: 16px;
        }
        /* 删除表情图标前缀 */
        .vvquest-zhihu-btn::before {
            content: "";
            margin-right: 0;
        }
        
        /* 模态框样式优化 */
        .vvquest-modal {
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.7);
            backdrop-filter: blur(3px);
            overflow-y: auto;
            padding: 10px 0;
        }
        .vvquest-modal-content {
            background: #ffffff;
            margin: 2% auto;
            padding: 20px;
            border: none;
            width: 480px;
            max-width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.25);
            animation: vvquestFadeIn 0.3s ease;
            padding-bottom: 30px;
            display: flex;
            flex-direction: column;
        }
        @keyframes vvquestFadeIn {
            from {opacity: 0; transform: translateY(-20px);}
            to {opacity: 1; transform: translateY(0);}
        }
        .vvquest-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;
            position: relative;
        }
        .vvquest-modal-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            position: relative;
        }
        .vvquest-modal-title::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 140px;
            height: 3px;
            background: #3498db;
        }
        .vvquest-close {
            color: #aaa;
            font-size: 28px;
            font-weight: normal;
            cursor: pointer;
            transition: all 0.2s;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        .vvquest-close:hover {
            color: #777;
        }
        
        /* 调试内容区样式 */
        .vvquest-content-preview {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 10px 12px;
            margin: 12px 0 15px 0;
            max-height: 100px;
            overflow-y: auto;
            font-size: 14px;
            color: #333;
            line-height: 1.5;
        }
        .vvquest-content-preview-title {
            font-weight: bold;
            margin-bottom: 6px;
            color: #0066cc;
            font-size: 15px;
        }
        .vvquest-content-preview-text {
            word-break: break-word;
            white-space: pre-wrap;
        }
        
        /* 复选框容器样式 */
        .vvquest-checkbox-container {
            display: flex !important;
            align-items: center !important;
            background-color: #f0f8ff !important;
            padding: 10px 12px !important;
            border-radius: 8px !important;
            margin: 15px 0 !important;
            border: 1px solid #d5e9fb !important;
        }
        .vvquest-checkbox {
            margin-right: 10px !important;
            width: 20px !important;
            height: 20px !important;
            position: relative !important;
            cursor: pointer !important;
            accent-color: #3498db !important;
        }
        .vvquest-checkbox + label {
            font-size: 15px !important;
            color: #333 !important;
            cursor: pointer !important;
        }
        
        /* 搜索按钮样式 */
        .vvquest-search-btn {
            background: #3498db !important;
            color: white !important;
            border: none !important;
            border-radius: 30px !important;
            padding: 12px 0 !important;
            font-size: 16px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            width: 100% !important;
            margin-top: 15px !important;
            margin-bottom: 20px !important;
            box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3) !important;
            text-transform: none !important;
            letter-spacing: normal !important;
        }
        .vvquest-search-btn:hover {
            background: #2980b9 !important;
            box-shadow: 0 4px 15px rgba(52, 152, 219, 0.5) !important;
        }
        
        /* 禁用按钮样式 */
        .vvquest-btn-disabled {
            opacity: 0.6 !important;
            cursor: not-allowed !important;
            transform: none !important;
            box-shadow: none !important;
        }
        
        /* 搜索结果区域样式 */
        .vvquest-results {
            margin-top: 20px;
            display: none;
            flex-direction: column;
            gap: 15px;
            max-height: 40vh;
            overflow-y: auto;
            padding-right: 5px;
        }
        
        /* 调整滚动条样式 */
        .vvquest-results::-webkit-scrollbar {
            width: 6px;
        }
        
        .vvquest-results::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .vvquest-results::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        
        .vvquest-results::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        /* AI解析结果样式 */
        .vvquest-ai-explanation {
            background-color: #f0f8ff;
            border: 1px solid #d1e5f5;
            border-radius: 8px;
            padding: 12px;
            margin-top: 10px;
            margin-bottom: 15px;
            display: none;
            font-size: 14px;
            line-height: 1.5;
            color: #333;
            max-height: 120px;
            overflow-y: auto;
        }
        
        /* AI解析结果滚动条样式 */
        .vvquest-ai-explanation::-webkit-scrollbar {
            width: 6px;
        }
        
        .vvquest-ai-explanation::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .vvquest-ai-explanation::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        
        .vvquest-ai-explanation::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
        
        /* 表情包项目样式 */
        .vvquest-meme-item {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        /* 表情包图片样式 */
        .vvquest-meme-img {
            max-width: 100%;
            max-height: 200px;
            margin-bottom: 10px;
            border-radius: 4px;
        }
        
        /* 表情包按钮组样式 */
        .vvquest-meme-actions {
            display: flex;
            gap: 10px;
            width: 100%;
            justify-content: center;
        }
        
        /* 表情包操作按钮样式 */
        .vvquest-meme-btn {
            background: #f2f2f2;
            color: #333;
            border: none;
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
        }
        .vvquest-meme-btn:hover {
            background: #e0e0e0;
        }
        
        /* 加载指示器样式 */
        .vvquest-loading {
            display: none;
            justify-content: center;
            margin: 20px 0;
        }
        .vvquest-spinner {
            width: 30px;
            height: 30px;
            border: 3px solid rgba(0,0,0,0.1);
            border-radius: 50%;
            border-top-color: #3498db;
            animation: vvquest-spin 1s linear infinite;
        }
        @keyframes vvquest-spin {
            to { transform: rotate(360deg); }
        }
        
        /* 冷却倒计时样式 */
        .vvquest-cooldown {
            text-align: center;
            color: #e74c3c;
            font-size: 14px;
            margin-top: 10px;
            font-weight: bold;
            display: none;
        }
        
        /* 滑块容器样式 */
        .vvquest-slider-container {
            margin: 15px 0;
            padding: 10px 12px;
            background-color: #f0f8ff;
            border: 1px solid #d5e9fb;
            border-radius: 8px;
        }
        
        .vvquest-slider-container label {
            display: block;
            margin-bottom: 8px;
            font-size: 15px;
            color: #333;
        }
        
        .vvquest-slider {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            appearance: none;
            background: #ddd;
            outline: none;
            border-radius: 3px;
            margin: 10px 0;
        }
        
        .vvquest-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: #3498db;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .vvquest-slider::-webkit-slider-thumb:hover {
            background: #2980b9;
            transform: scale(1.2);
        }
        
        #vvquest-image-count-value {
            font-weight: bold;
            color: #3498db;
        }

        /* 关于按钮样式 */
        .vvquest-about-btn {
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #3498db;
            background-color: transparent;
            position: absolute;
            right: 50px;
            top: 0;
            transition: all 0.2s;
            font-size: 14px;
            font-weight: bold;
            height: 36px;
            padding: 0 10px;
        }
        .vvquest-about-btn:hover {
            color: #2980b9;
            text-decoration: underline;
        }

        /* 关于界面样式 */
        .vvquest-about {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 450px;
            max-height: 90vh;
            overflow-y: auto;
            background-color: #fff;
            z-index: 11000;
            padding: 20px;
            box-sizing: border-box;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            animation: vvquestAboutFadeIn 0.3s ease;
        }
        .vvquest-about-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #f0f0f0;
        }
        .vvquest-about-title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
        }
        .vvquest-about-close {
            color: #aaa;
            font-size: 28px;
            font-weight: normal;
            cursor: pointer;
            transition: all 0.2s;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
        }
        .vvquest-about-close:hover {
            color: #777;
        }
        .vvquest-about-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px 0;
        }
        .vvquest-about-avatar {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #3498db;
            box-shadow: 0 3px 10px rgba(0,0,0,0.1);
            margin-bottom: 15px;
        }
        .vvquest-about-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
        }
        .vvquest-about-description {
            font-size: 14px;
            color: #666;
            text-align: center;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        .vvquest-about-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
            width: 100%;
        }
        .vvquest-about-link {
            display: flex;
            align-items: center;
            background-color: #f8f9fa;
            padding: 10px 15px;
            border-radius: 30px;
            text-decoration: none;
            color: #333;
            font-size: 14px;
            transition: all 0.2s;
            border: 1px solid #eee;
        }
        .vvquest-about-link:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        .vvquest-about-link i {
            margin-right: 8px;
            font-size: 18px;
        }
        .vvquest-icon-bilibili {
            color: #00a1d6;
        }
        .vvquest-icon-home {
            color: #3498db;
        }
        .vvquest-icon-blog {
            color: #2ecc71;
        }
        .vvquest-icon-afdian {
            color: #946ce6;
        }
        /* 关于界面专用动画 */
        @keyframes vvquestAboutFadeIn {
            from {opacity: 0; transform: translate(-50%, -55%);}
            to {opacity: 1; transform: translate(-50%, -50%);}
        }
    `);
    
    // 网站集成基类
    class SiteIntegration {
        constructor() {
            this.initUI();
            this.addEventListeners();
        }

        // 初始化UI
        initUI() {
            this.createButton();
            this.createVVQuestModal();
        }

        // 创建按钮 - 由子类实现
        createButton() {
            throw new Error('createButton must be implemented by subclass');
        }

        // 获取内容 - 由子类实现
        getContent() {
            throw new Error('getContent must be implemented by subclass');
        }

        // 创建VVQuest模态框
        createVVQuestModal() {
            const modal = document.createElement('div');
            modal.className = 'vvquest-modal';
            modal.id = 'vvquest-modal';
            
            modal.innerHTML = `
                <div class="vvquest-modal-content">
                    <div class="vvquest-modal-header">
                        <div class="vvquest-modal-title">VVQuest 表情包助手</div>
                        <div class="vvquest-about-btn" title="关于作者">
                            关于
                        </div>
                        <span class="vvquest-close">&times;</span>
                    </div>
                    
                    <!-- 搜索区域（可折叠） -->
                    <div class="vvquest-search-section" id="vvquest-search-section">
                        <div class="vvquest-section-header">
                            <span class="vvquest-section-title">搜索区域</span>
                            <button class="vvquest-toggle-btn" id="vvquest-toggle-search" title="折叠/展开搜索区域">▼</button>
                        </div>
                        
                        <div class="vvquest-search-content" id="vvquest-search-content">
                            <!-- 添加调试内容预览区 -->
                            <div class="vvquest-content-preview">
                                <div class="vvquest-content-preview-title">当前检索内容:</div>
                                <div id="vvquest-content-text" class="vvquest-content-preview-text">
                                    未获取到内容...
                                </div>
                            </div>
                            
                            <div class="vvquest-checkbox-container">
                                <input type="checkbox" id="vvquest-network-search" class="vvquest-checkbox" ${config.enableNetworkSearch ? 'checked' : ''}>
                                <label for="vvquest-network-search">启用联网搜索 ( beta，不稳定，遇到错误请关闭 )</label>
                            </div>
                            
                            <!-- 图片数量滑块控件 -->
                            <div class="vvquest-slider-container">
                                <label for="vvquest-image-count">显示图片数量: <span id="vvquest-image-count-value">5</span></label>
                                <input type="range" id="vvquest-image-count" class="vvquest-slider" min="1" max="25" value="5">
                            </div>
                            
                            <!-- 加载指示器 -->
                            <div id="vvquest-loading" class="vvquest-loading">
                                <div class="vvquest-spinner"></div>
                            </div>
                            
                            <!-- 冷却倒计时 -->
                            <div id="vvquest-cooldown" class="vvquest-cooldown">
                                冷却中，请等待 <span id="vvquest-cooldown-time">0</span> 秒
                            </div>
                            
                            <button id="vvquest-search-btn" class="vvquest-search-btn">搜索表情包</button>
                        </div>
                    </div>
                    
                    <!-- AI解析结果区域 -->
                    <div id="vvquest-ai-explanation" class="vvquest-ai-explanation"></div>
                    
                    <!-- 搜索结果区域 -->
                    <div id="vvquest-results" class="vvquest-results"></div>
                    
                    <!-- 关于界面 -->
                    <div id="vvquest-about" class="vvquest-about">
                        <div class="vvquest-about-header">
                            <div class="vvquest-about-title">关于作者</div>
                            <span class="vvquest-about-close">&times;</span>
                        </div>
                        <div class="vvquest-about-content">
                            <img src="https://cn-sy1.rains3.com/pic/pic/2025/02/dac95bccccaacbdec4bf801a9f309527.png" alt="xy0v0" class="vvquest-about-avatar">
                            <div class="vvquest-about-name">xy0v0</div>
                            <div class="vvquest-about-description">
                                VVQuest 开发者<br>
                                感谢使用我的作品，欢迎关注我的其他平台！
                            </div>
                            <div class="vvquest-about-links">
                                <a href="https://space.bilibili.com/165404794" target="_blank" class="vvquest-about-link">
                                    <span class="vvquest-icon-bilibili">📺</span> Bilibili
                                </a>
                                <a href="https://zvv.quest/" target="_blank" class="vvquest-about-link">
                                    <span class="vvquest-icon-home">🏠</span> 项目主站
                                </a>
                                <a href="https://www.xy0v0.top/" target="_blank" class="vvquest-about-link">
                                    <span class="vvquest-icon-blog">📝</span> 博客
                                </a>
                                <a href="https://afdian.com/a/xy0v0" target="_blank" class="vvquest-about-link">
                                    <span class="vvquest-icon-afdian">💰</span> 爱发电
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }

        // 添加事件监听器
        addEventListeners() {
            // 等待按钮和模态框加载完成
            this.waitForElement('#vvquest-btn', (btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // 获取内容并显示在预览区
                    const content = this.getContent();
                    document.getElementById('vvquest-content-text').textContent = content || '未获取到内容...';
                    
                    // 清除之前的搜索结果
                    this.clearResults();
                    
                    // 显示模态框
                    document.getElementById('vvquest-modal').style.display = 'block';
                });
            });
            
            this.waitForElement('.vvquest-close', (closeBtn) => {
                closeBtn.addEventListener('click', () => {
                    document.getElementById('vvquest-modal').style.display = 'none';
                });
            });
            
            this.waitForElement('#vvquest-network-search', (checkbox) => {
                checkbox.addEventListener('change', () => {
                    config.enableNetworkSearch = checkbox.checked;
                });
            });
            
            // 添加滑块值变化事件监听器
            this.waitForElement('#vvquest-image-count', (slider) => {
                slider.addEventListener('input', () => {
                    document.getElementById('vvquest-image-count-value').textContent = slider.value;
                });
            });
            
            // 折叠/展开搜索区域按钮事件
            this.waitForElement('#vvquest-toggle-search', (toggleBtn) => {
                toggleBtn.addEventListener('click', () => {
                    const content = document.getElementById('vvquest-search-content');
                    
                    // 切换折叠状态
                    content.classList.toggle('collapsed');
                    toggleBtn.classList.toggle('collapsed');
                });
            });
            
            this.waitForElement('#vvquest-search-btn', (searchBtn) => {
                searchBtn.addEventListener('click', () => {
                    // 获取预览区的内容作为搜索内容
                    const questionTitle = document.getElementById('vvquest-content-text').textContent;
                    
                    // 处理请求 - 不再关闭模态框，以便显示结果
                    if (questionTitle.trim() !== '' && questionTitle !== '未获取到内容...') {
                        if (config.enableNetworkSearch) {
                            this.handleUserRequest(questionTitle);
                        } else {
                            // 本地搜索功能
                            this.handleUserRequest(questionTitle);
                        }
                    } else {
                        this.showNotification('未获取到内容，请重试');
                    }
                });
            });
            
            // 点击模态框外部关闭
            window.addEventListener('click', (event) => {
                const modal = document.getElementById('vvquest-modal');
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // 关于按钮点击事件
            this.waitForElement('.vvquest-about-btn', (aboutBtn) => {
                aboutBtn.addEventListener('click', () => {
                    document.getElementById('vvquest-about').style.display = 'block';
                });
            });
            
            // 关于界面关闭按钮点击事件
            this.waitForElement('.vvquest-about-close', (closeBtn) => {
                closeBtn.addEventListener('click', () => {
                    document.getElementById('vvquest-about').style.display = 'none';
                });
            });
        }

        // 工具方法
        waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
            let attempts = 0;
            
            const checkElement = function() {
                const element = document.querySelector(selector);
                if (element) {
                    callback(element);
                    return;
                }
                
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkElement, interval);
                } else {
                    console.log(`未能找到元素: ${selector}`);
                    callback(null);
                }
            };
            
            checkElement();
        }

        clearResults() {
            const resultsEl = document.getElementById('vvquest-results');
            const explanationEl = document.getElementById('vvquest-ai-explanation');
            
            if (resultsEl) {
                resultsEl.innerHTML = '';
                resultsEl.style.display = 'none';
            }
            
            if (explanationEl) {
                explanationEl.innerHTML = '';
                explanationEl.style.display = 'none';
            }
        }

        showNotification(message) {
            GM_notification({
                text: message,
                title: 'VVQuest 表情包助手',
                timeout: 3000
            });
        }

        handleUserRequest(query) {
            // 清除之前的结果
            this.clearResults();
            
            // 检查冷却时间
            const now = Date.now();
            const currentCooldown = config.enableNetworkSearch ? config.enhancedCooldownTime : config.cooldownTime;
            
            if (now - config.lastRequestTime < currentCooldown) {
                const remainingTime = Math.ceil((config.lastRequestTime + currentCooldown - now) / 1000);
                this.showCooldown(remainingTime);
                return;
            }
            
            // 开始搜索
            config.isSearching = true;
            this.showLoading(true);
            
            // 更新最后请求时间
            config.lastRequestTime = now;
            
            // 发送API请求
            this.sendAPIRequest(query);
        }

        showCooldown(seconds) {
            const cooldownEl = document.getElementById('vvquest-cooldown');
            const timeEl = document.getElementById('vvquest-cooldown-time');
            
            if (cooldownEl && timeEl) {
                timeEl.textContent = seconds;
                cooldownEl.style.display = 'block';
                
                // 禁用搜索按钮
                const searchBtn = document.getElementById('vvquest-search-btn');
                if (searchBtn) {
                    searchBtn.classList.add('vvquest-btn-disabled');
                    searchBtn.disabled = true;
                }
                
                // 倒计时
                let countdown = seconds;
                const timer = setInterval(() => {
                    countdown--;
                    
                    if (countdown <= 0) {
                        clearInterval(timer);
                        cooldownEl.style.display = 'none';
                        
                        // 恢复搜索按钮
                        if (searchBtn) {
                            searchBtn.classList.remove('vvquest-btn-disabled');
                            searchBtn.disabled = false;
                        }
                    } else {
                        timeEl.textContent = countdown;
                    }
                }, 1000);
            }
        }

        showLoading(show) {
            const loadingEl = document.getElementById('vvquest-loading');
            
            if (loadingEl) {
                loadingEl.style.display = show ? 'flex' : 'none';
            }
            
            // 禁用或启用搜索按钮
            const searchBtn = document.getElementById('vvquest-search-btn');
            if (searchBtn) {
                if (show) {
                    searchBtn.classList.add('vvquest-btn-disabled');
                    searchBtn.disabled = true;
                } else {
                    searchBtn.classList.remove('vvquest-btn-disabled');
                    searchBtn.disabled = false;
                }
            }
        }

        sendAPIRequest(query) {
            // 获取图片数量滑块的值
            const imageCount = document.getElementById('vvquest-image-count').value;
            
            const url = config.enableNetworkSearch
                ? `${config.enhancedApiUrl}?q=${encodeURIComponent(query)}&n=${imageCount}`
                : `${config.apiUrl}?q=${encodeURIComponent(query)}&n=${imageCount}`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Accept': 'application/json'
                },
                onload: function(response) {
                    this.showLoading(false);
                    config.isSearching = false;
                    this.handleAPIResponse(response, config.enableNetworkSearch);
                }.bind(this),
                onerror: function(error) {
                    this.showLoading(false);
                    config.isSearching = false;
                    this.handleAPIError(error);
                }.bind(this)
            });
        }

        handleAPIResponse(response, isEnhanced) {
            try {
                const data = JSON.parse(response.responseText);
                
                if (data.code === 200) {
                    if (isEnhanced) {
                        // 处理联网搜索结果 - 修改判断逻辑
                        if (data.data && (data.data.memes || data.data.images)) {
                            this.displayEnhancedResults(data.data);
                        } else {
                            this.handleAPIError({ message: '解析联网搜索响应失败' });
                        }
                    } else if (Array.isArray(data.data)) {
                        // 处理普通搜索结果
                        this.displayResults(data.data);
                    } else {
                        this.handleAPIError({ message: '解析API响应失败' });
                    }
                } else {
                    // 处理API返回的错误
                    this.handleAPIError({ message: data.msg || '未找到匹配的表情包' });
                }
            } catch (error) {
                this.handleAPIError({ message: '解析API响应失败: ' + error.message });
            }
        }

        handleAPIError(error) {
            this.showNotification(`出错了: ${error.message || '未知错误'}`);
        }

        displayResults(memeUrls) {
            const resultsEl = document.getElementById('vvquest-results');
            
            if (resultsEl && memeUrls && memeUrls.length > 0) {
                resultsEl.innerHTML = '';
                
                memeUrls.forEach((memeUrl) => {
                    resultsEl.appendChild(this.createMemeItem(memeUrl));
                });
                
                resultsEl.style.display = 'flex';
                
                // 搜索完成后自动折叠搜索区域
                const content = document.getElementById('vvquest-search-content');
                const toggleBtn = document.getElementById('vvquest-toggle-search');
                content.classList.add('collapsed');
                toggleBtn.classList.add('collapsed');
            } else {
                this.showNotification('未找到匹配的表情包');
            }
        }

        displayEnhancedResults(data) {
            const resultsEl = document.getElementById('vvquest-results');
            const explanationEl = document.getElementById('vvquest-ai-explanation');
            
            // 显示AI解析结果
            if (explanationEl && data.explanation) {
                explanationEl.textContent = data.explanation;
                explanationEl.style.display = 'block';
            }
            
            // 显示表情包结果 - 兼容两种可能的返回格式
            const memeUrls = data.memes || data.images || [];
            if (resultsEl && memeUrls.length > 0) {
                resultsEl.innerHTML = '';
                
                memeUrls.forEach((memeUrl) => {
                    resultsEl.appendChild(this.createMemeItem(memeUrl));
                });
                
                resultsEl.style.display = 'flex';
                
                // 搜索完成后自动折叠搜索区域
                const content = document.getElementById('vvquest-search-content');
                const toggleBtn = document.getElementById('vvquest-toggle-search');
                content.classList.add('collapsed');
                toggleBtn.classList.add('collapsed');
            } else {
                this.showNotification('未找到匹配的表情包');
            }
        }

        createMemeItem(memeUrl) {
            const item = document.createElement('div');
            item.className = 'vvquest-meme-item';
            
            // 创建图片元素
            const img = document.createElement('img');
            img.className = 'vvquest-meme-img';
            img.src = memeUrl;
            img.alt = '表情包';
            img.loading = 'lazy';
            
            // 创建按钮组
            const actions = document.createElement('div');
            actions.className = 'vvquest-meme-actions';
            
            // 复制图片按钮
            const copyImgBtn = document.createElement('button');
            copyImgBtn.className = 'vvquest-meme-btn';
            copyImgBtn.textContent = '复制图片';
            copyImgBtn.addEventListener('click', () => this.copyImageToClipboard(memeUrl, true));
            
            // 复制链接按钮
            const copyLinkBtn = document.createElement('button');
            copyLinkBtn.className = 'vvquest-meme-btn';
            copyLinkBtn.textContent = '复制链接';
            copyLinkBtn.addEventListener('click', () => this.copyImageToClipboard(memeUrl, false));
            
            // 下载图片按钮
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'vvquest-meme-btn';
            downloadBtn.textContent = '下载图片';
            downloadBtn.addEventListener('click', () => this.downloadImage(memeUrl));
            
            // 组装元素
            actions.appendChild(copyImgBtn);
            actions.appendChild(copyLinkBtn);
            actions.appendChild(downloadBtn);
            
            item.appendChild(img);
            item.appendChild(actions);
            
            return item;
        }

        downloadImage(imageUrl) {
            try {
                const link = document.createElement('a');
                link.href = imageUrl;
                link.download = imageUrl.split('/').pop() || 'meme.png';
                link.target = '_blank';
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                this.showNotification('正在下载表情包');
            } catch (error) {
                this.showNotification('下载表情包失败');
                console.error('下载表情包失败:', error);
            }
        }

        copyImageToClipboard(imageUrl, isImage) {
            if (isImage) {
                // 复制图片到剪贴板
                // 创建临时画布来获取图片数据
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = function() {
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        
                        // 尝试用新API复制图片
                        canvas.toBlob(function(blob) {
                            try {
                                // 尝试使用 ClipboardItem API
                                if (navigator.clipboard && navigator.clipboard.write) {
                                    const clipboardItem = new ClipboardItem({ 'image/png': blob });
                                    navigator.clipboard.write([clipboardItem])
                                        .then(() => this.showNotification('表情包已复制到剪贴板'))
                                        .catch(err => {
                                            console.error('复制图片失败:', err);
                                            // 如果新API失败，回退到复制链接
                                            GM_setClipboard(imageUrl);
                                            this.showNotification('复制图片失败，已复制图片链接到剪贴板');
                                        });
                                } else {
                                    // 不支持 ClipboardItem API，复制链接
                                    GM_setClipboard(imageUrl);
                                    this.showNotification('您的浏览器不支持复制图片，已复制图片链接到剪贴板');
                                }
                            } catch (e) {
                                // 处理所有其他错误
                                console.error('复制过程中出错:', e);
                                GM_setClipboard(imageUrl);
                                this.showNotification('复制图片时出错，已复制图片链接到剪贴板');
                            }
                        }.bind(this));
                    } catch (e) {
                        // 画布操作错误
                        console.error('创建画布失败:', e);
                        GM_setClipboard(imageUrl);
                        this.showNotification('复制图片时出错，已复制图片链接到剪贴板');
                    }
                };
                
                img.onerror = function() {
                    // 图片加载失败
                    console.error('图片加载失败');
                    GM_setClipboard(imageUrl);
                    this.showNotification('图片加载失败，已复制图片链接到剪贴板');
                }.bind(this);
                
                img.src = imageUrl;
            } else {
                // 直接复制链接
                GM_setClipboard(imageUrl);
                this.showNotification('表情包链接已复制到剪贴板');
            }
        }
    }

    // 百度贴吧集成
    class TiebaIntegration extends SiteIntegration {
        createButton() {
            // 尝试定位到发表按钮旁边的位置
            this.waitForElement('.j_floating', (floatingElement) => {
                if (floatingElement) {
                    // 尝试找到发表按钮区域
                    const postBtnArea = document.querySelector('.j_floating');
                    
                    if (postBtnArea) {
                        const btn = this.createVVQuestBtn();
                        postBtnArea.parentNode.insertBefore(btn, postBtnArea.nextSibling);
                        console.log('成功将VVQuest按钮插入到发表按钮旁边');
                        return;
                    }
                }
                
                // 如果找不到发表按钮，则尝试其他常见位置
                const selectors = [
                    '.tb-exbtn-wrapper',
                    '.poster_head',
                    '.edui-btn-toolbar',
                    '.j_media_box',
                    '.tb-editor-toolbar',
                    'ul[class^="tbui_aside_float_bar"]',
                    '.btn_default',
                    '.btn_sub',
                    '.j_choo',
                    '.j_submit'
                ];
                
                this.waitForElements(selectors, (elements) => {
                    if (elements && elements.length > 0) {
                        const targetElement = elements[0];
                        
                        if (targetElement.tagName === 'UL') {
                            const li = document.createElement('li');
                            li.appendChild(this.createVVQuestBtn());
                            targetElement.appendChild(li);
                        } else {
                            const btn = this.createVVQuestBtn();
                            targetElement.parentNode.insertBefore(btn, targetElement.nextSibling);
                        }
                    } else {
                        // 创建悬浮按钮
                        this.createFloatingButton();
                    }
                });
            });
        }

        getContent() {
            let content = '';
            
            // 获取帖子标题
            const titleElement = document.querySelector('.core_title_txt');
            if (titleElement) {
                content += titleElement.textContent.trim() + ' ';
            }
            
            // 获取楼主发帖内容
            const postContentElement = document.querySelector('.d_post_content');
            if (postContentElement) {
                content += postContentElement.textContent.trim();
            }
            
            console.log('获取到帖子内容:', content);
            return content;
        }

        createVVQuestBtn() {
            const vvquestBtn = document.createElement('button');
            vvquestBtn.className = 'vvquest-btn';
            vvquestBtn.id = 'vvquest-btn';
            vvquestBtn.textContent = 'VVQuest';
            vvquestBtn.title = '使用VVQuest搜索表情包';
            return vvquestBtn;
        }

        createFloatingButton() {
            const floatingBtn = this.createVVQuestBtn();
            floatingBtn.classList.add('vvquest-floating-btn');
            document.body.appendChild(floatingBtn);
        }
    }

    // 知乎集成
    class ZhihuIntegration extends SiteIntegration {
        createButton() {
            const zhihuBtn = document.createElement('button');
            zhihuBtn.className = 'vvquest-btn vvquest-zhihu-btn';
            zhihuBtn.id = 'vvquest-btn';
            zhihuBtn.textContent = 'VVQuest';
            zhihuBtn.title = '使用VVQuest搜索表情包';
            
            document.body.appendChild(zhihuBtn);
            console.log('成功创建知乎左下角固定按钮');
        }

        getContent() {
            let title = '';
            
            // 尝试多个可能的选择器来获取知乎问题标题
            const selectors = [
                '.QuestionHeader-title',
                'h1.QuestionHeader-title',
                '.QuestionPage .QuestionHeader .QuestionHeader-title',
                '.Question-title',
                '.zm-item-title',
                'h1[data-zop-question]'
            ];
            
            for (const selector of selectors) {
                const titleElement = document.querySelector(selector);
                if (titleElement) {
                    title = titleElement.textContent.trim();
                    console.log('获取到知乎问题标题:', title);
                    break;
                }
            }
            
            // 如果没找到标题，尝试获取当前页面标题
            if (!title) {
                title = document.title.replace(' - 知乎', '').trim();
                console.log('使用页面标题作为知乎问题:', title);
            }
            
            return title;
        }
    }

    // 初始化函数
    function init() {
        console.log('VVQuest 表情包助手已加载');
        
        // 检测当前网站并初始化对应的集成类
        if (location.hostname.includes('tieba.baidu.com')) {
            console.log('检测到百度贴吧网站');
            new TiebaIntegration();
        } else if (location.hostname.includes('zhihu.com')) {
            console.log('检测到知乎网站');
            new ZhihuIntegration();
        }
    }

    // 启动脚本
    init();
})();