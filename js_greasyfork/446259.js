// ==UserScript==
// @name         究极美化必应搜索页面（毛玻璃）(原生JS重构版)
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @description  美化必应搜索页面 (重构版 - 使用localStorage)
// @author       Onion (重构优化版)
// @match        *://*.cn.bing.com/*
// @match        *://*.bing.com/*
// @match        *://*.baidu.com/*
// @icon         https://gitee.com/onion-big/gitstore/raw/main/js/jpg/beautify.png
// @license      MPL2.0
// @grant        GM_notification
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/446259/%E7%A9%B6%E6%9E%81%E7%BE%8E%E5%8C%96%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%EF%BC%88%E6%AF%9B%E7%8E%BB%E7%92%83%EF%BC%89%28%E5%8E%9F%E7%94%9FJS%E9%87%8D%E6%9E%84%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446259/%E7%A9%B6%E6%9E%81%E7%BE%8E%E5%8C%96%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E9%A1%B5%E9%9D%A2%EF%BC%88%E6%AF%9B%E7%8E%BB%E7%92%83%EF%BC%89%28%E5%8E%9F%E7%94%9FJS%E9%87%8D%E6%9E%84%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置管理模块 ====================
    class ConfigManager {
        constructor() {
            this.storageKey = 'bing_beautify_config';
            this.cacheKey = 'bing_beautify_cache';
            this.defaultConfig = {
                blurLevel: 13,
                opacity1: 83, // 渐变色透明度 (0-100)
                opacity2: 75, // 图片透明度 (0-100)
                backgroundType: 'gradient', // 'gradient' | 'image' | 'custom'
                backgroundImage: this.getDefaultImages()[0],
                customImageBase64: '',
                searchboxStyle: 'transparent' // 'transparent' | 'colorful'
            };
            this.initConfig();
        }

        getDefaultImages() {
            return [
                "https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN",
                "https://bing.com/th?id=OHR.NationalDay2022_ZH-CN3861603311_1920x1080.jpg",
                "https://bing.com/th?id=OHR.BridgeofSighs_ZH-CN5414607871_1920x1080.jpg",
                "https://images4.alphacoders.com/171/171916.jpg",
                "https://images5.alphacoders.com/613/613927.jpg",
                "https://images2.alphacoders.com/606/606275.jpg",
                "https://images2.alphacoders.com/742/742320.png",
                "https://dogefs.s3.ladydaily.com/~/source/wallhaven/full/8o/wallhaven-8o2dpj.png?w=2560&fmt=webp"
            ];
        }

        initConfig() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                this.config = stored ? { ...this.defaultConfig, ...JSON.parse(stored) } : { ...this.defaultConfig };
                this.saveConfig();
            } catch (error) {
                console.error('配置初始化失败:', error);
                this.config = { ...this.defaultConfig };
                this.saveConfig();
            }
        }

        get(key) {
            return this.config[key];
        }

        set(key, value) {
            this.config[key] = value;
            this.saveConfig();
        }

        update(updates) {
            Object.assign(this.config, updates);
            this.saveConfig();
        }

        saveConfig() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.config));
            } catch (error) {
                console.error('配置保存失败:', error);
            }
        }

        reset() {
            this.config = { ...this.defaultConfig };
            this.saveConfig();
        }

        // 透明度转换：0-100 转为 0-255 的十六进制
        opacityToHex(opacity) {
            const value = Math.round((opacity / 100) * 255);
            return value.toString(16).padStart(2, '0');
        }

        // 十六进制转透明度：0-255 转为 0-100
        hexToOpacity(hex) {
            if (!hex) return 80;
            const value = parseInt(hex, 16);
            return Math.round((value / 255) * 100);
        }

        // 图片缓存管理
        getCachedImage(url) {
            try {
                const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '{}');
                const cached = cache[url];
                
                // 必应每日壁纸需要每日更新
                if (url.includes('bing.biturl.top') && cached) {
                    const today = new Date().toDateString();
                    if (cached.date !== today) {
                        delete cache[url];
                        localStorage.setItem(this.cacheKey, JSON.stringify(cache));
                        return null;
                    }
                }
                
                return cached?.data || null;
            } catch (error) {
                console.error('获取缓存图片失败:', error);
                return null;
            }
        }

        setCachedImage(url, base64Data) {
            try {
                const cache = JSON.parse(localStorage.getItem(this.cacheKey) || '{}');
                cache[url] = {
                    data: base64Data,
                    date: new Date().toDateString(),
                    timestamp: Date.now()
                };
                
                // 清理过期缓存（30天前）
                const expireTime = Date.now() - (30 * 24 * 60 * 60 * 1000);
                Object.keys(cache).forEach(key => {
                    if (cache[key].timestamp < expireTime) {
                        delete cache[key];
                    }
                });
                
                localStorage.setItem(this.cacheKey, JSON.stringify(cache));
            } catch (error) {
                console.error('缓存图片失败:', error);
            }
        }

        // 将图片转换为base64存储
        async convertImageToBase64(imageUrl) {
            try {
                // 先检查缓存
                const cached = this.getCachedImage(imageUrl);
                if (cached) {
                    console.log('使用缓存图片:', imageUrl);
                    return cached;
                }

                console.log('下载并缓存图片:', imageUrl);
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const result = reader.result;
                        // 缓存图片
                        this.setCachedImage(imageUrl, result);
                        resolve(result);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('图片转换base64失败:', error);
                return null;
            }
        }
    }

    // ==================== 样式管理模块 ====================
    class StyleManager {
        constructor(config) {
            this.config = config;
            this.injectedStyles = new Set();
        }

        injectGlobalStyles() {
            const css = `
                @keyframes fadeIn {
                    0% { opacity: 0; transform: translateY(-10px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                /* 设置框样式 - 强制最高优先级 */
                .beautify-settings {
                    position: fixed !important;
                    top: 50% !important;
                    left: 50% !important;
                    transform: translate(-50%, -50%) !important;
                    width: min(520px, 95vw) !important;
                    max-height: 85vh !important;
                    background: rgba(255, 255, 255, 0.98) !important;
                    backdrop-filter: blur(20px) !important;
                    border-radius: 15px !important;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
                    z-index: 999999999 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    display: none !important;
                    animation: fadeIn 0.3s ease-out !important;
                    border: 2px solid rgba(76, 175, 80, 0.3) !important;
                    overflow: hidden !important;
                    pointer-events: auto !important;
                }

                .beautify-settings.show {
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .beautify-settings-header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    padding: 15px 20px !important;
                    border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
                    cursor: move !important;
                    background: rgba(76, 175, 80, 0.1) !important;
                    border-radius: 15px 15px 0 0 !important;
                    flex-shrink: 0 !important;
                }

                .beautify-settings-title {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    color: #333 !important;
                    margin: 0 !important;
                    white-space: nowrap !important;
                }

                .beautify-close-btn {
                    background: rgba(255, 0, 0, 0.1) !important;
                    border: none !important;
                    font-size: 20px !important;
                    cursor: pointer !important;
                    color: #666 !important;
                    padding: 5px !important;
                    width: 30px !important;
                    height: 30px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    border-radius: 50% !important;
                    transition: all 0.2s ease !important;
                    flex-shrink: 0 !important;
                }

                .beautify-close-btn:hover {
                    background: rgba(255, 0, 0, 0.2) !important;
                    color: #ff0000 !important;
                    transform: scale(1.1) !important;
                }

                .beautify-settings-content {
                    padding: 20px !important;
                    max-height: calc(85vh - 120px) !important;
                    overflow-y: auto !important;
                    background: rgba(255, 255, 255, 0.95) !important;
                    border-radius: 0 0 15px 15px !important;
                }

                .beautify-form-group {
                    margin-bottom: 18px !important;
                }

                .beautify-form-group:last-child {
                    margin-bottom: 0 !important;
                }

                .beautify-label {
                    display: block !important;
                    margin-bottom: 8px !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    color: #555 !important;
                    white-space: nowrap !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                }

                .beautify-input, .beautify-select {
                    width: 100% !important;
                    padding: 10px 12px !important;
                    border: 2px solid rgba(0, 0, 0, 0.1) !important;
                    border-radius: 8px !important;
                    font-size: 14px !important;
                    background: white !important;
                    transition: border-color 0.2s ease !important;
                    box-sizing: border-box !important;
                }

                .beautify-input:focus, .beautify-select:focus {
                    outline: none !important;
                    border-color: #4CAF50 !important;
                }

                /* 滑块样式 */
                .beautify-slider-container {
                    display: flex !important;
                    align-items: center !important;
                    gap: 10px !important;
                }

                .beautify-slider {
                    flex: 1 !important;
                    height: 6px !important;
                    background: #ddd !important;
                    border-radius: 3px !important;
                    outline: none !important;
                    border: none !important;
                }

                .beautify-slider::-webkit-slider-thumb {
                    appearance: none !important;
                    width: 18px !important;
                    height: 18px !important;
                    background: #4CAF50 !important;
                    border-radius: 50% !important;
                    cursor: pointer !important;
                }

                .beautify-slider::-moz-range-thumb {
                    width: 18px !important;
                    height: 18px !important;
                    background: #4CAF50 !important;
                    border-radius: 50% !important;
                    cursor: pointer !important;
                    border: none !important;
                }

                .beautify-value-display {
                    min-width: 45px !important;
                    text-align: right !important;
                    font-size: 12px !important;
                    color: #666 !important;
                    background: rgba(0, 0, 0, 0.05) !important;
                    padding: 4px 8px !important;
                    border-radius: 4px !important;
                }

                .beautify-button-group {
                    display: flex !important;
                    gap: 10px !important;
                    margin-top: 20px !important;
                    padding-top: 15px !important;
                    border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
                }

                .beautify-btn {
                    flex: 1 !important;
                    padding: 10px 16px !important;
                    border: none !important;
                    border-radius: 8px !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                }

                .beautify-btn-primary {
                    background: #4CAF50 !important;
                    color: white !important;
                }

                .beautify-btn-primary:hover {
                    background: #45a049 !important;
                    transform: translateY(-1px) !important;
                }

                .beautify-btn-secondary {
                    background: #f5f5f5 !important;
                    color: #666 !important;
                }

                .beautify-btn-secondary:hover {
                    background: #e5e5e5 !important;
                    transform: translateY(-1px) !important;
                }

                /* 搜索框控制按钮 */
                .beautify-control-buttons {
                    display: flex !important;
                    gap: 5px !important;
                }

                .beautify-control-btn {
                    padding: 8px 12px !important;
                    background: rgba(255, 255, 255, 0.9) !important;
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    border-radius: 6px !important;
                    font-size: 12px !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    color: #444 !important;
                    backdrop-filter: blur(10px) !important;
                }

                .beautify-control-btn:hover {
                    background: rgba(255, 255, 255, 1) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                }

                .beautify-control-btn.active {
                    background: #4CAF50 !important;
                    color: white !important;
                }

                /* 透明化处理 */
                .pagereco_CB, .pagereco_CBImageCard, .pagereco_CBTextCard, 
                #tabcontrol_8_156412_navr, #lMapContainer, .b_algoSlug .algoSlug_icon, 
                #b_PagAboveFooter, .tta_incell, .tta_outcell, #tta_output_ta {
                    background: transparent !important;
                    border: none !important;
                }

                /* Header 统一背景 */
                #b_header {
                    border-bottom: none !important;
                    background: transparent !important;
                }

                .b_searchboxForm {
                    background: rgba(255, 255, 255, 0.8) !important;
                    backdrop-filter: blur(10px) !important;
                    border-radius: 25px !important;
                }

                /* 结果框样式 */
                .b_algo, .b_ans {
                    border-radius: 10px !important;
                    backdrop-filter: blur(${this.config.get('blurLevel')}px) !important;
                    margin-bottom: 15px !important;
                    transition: all 0.3s ease !important;
                }

                .b_algo:hover, .b_ans:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1) !important;
                }

                /* 文件上传样式 */
                .beautify-file-upload {
                    position: relative !important;
                    display: inline-block !important;
                    width: 100% !important;
                }

                .beautify-file-input {
                    position: absolute !important;
                    opacity: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    cursor: pointer !important;
                }

                .beautify-file-label {
                    display: block !important;
                    padding: 12px 15px !important;
                    border: 2px dashed rgba(0, 0, 0, 0.2) !important;
                    border-radius: 8px !important;
                    text-align: center !important;
                    cursor: pointer !important;
                    transition: all 0.2s ease !important;
                    background: rgba(0, 0, 0, 0.02) !important;
                    font-size: 13px !important;
                }

                .beautify-file-label:hover {
                    border-color: #4CAF50 !important;
                    background: rgba(76, 175, 80, 0.05) !important;
                }

                /* 遮罩层 */
                .beautify-overlay {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    background: rgba(0, 0, 0, 0.3) !important;
                    z-index: 999999998 !important;
                    display: none !important;
                }

                .beautify-overlay.show {
                    display: block !important;
                }
            `;

            this.injectCSS('global-styles', css);
        }

        injectCSS(id, css) {
            if (this.injectedStyles.has(id)) return;
            
            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
            this.injectedStyles.add(id);
        }

        updateResultBoxStyles() {
            const opacity1 = this.config.get('opacity1');
            const opacity2 = this.config.get('opacity2');
            
            const opacity = this.config.get('backgroundType') === 'image' ? opacity2 : opacity1;
            const alpha = opacity / 100;
            
            const elements = document.querySelectorAll('.b_algo, .b_ans');
            elements.forEach(el => {
                el.style.backgroundColor = `rgba(255, 255, 255, ${alpha})`;
                el.style.backdropFilter = `blur(${this.config.get('blurLevel')}px)`;
            });
        }

        updateSearchboxStyle() {
            const searchboxForm = document.querySelector('.b_searchboxForm');
            if (!searchboxForm) return;

            const style = this.config.get('searchboxStyle');
            const opacity2 = this.config.get('opacity2') / 100;
            
            if (style === 'transparent') {
                searchboxForm.style.background = `rgba(255, 255, 255, ${opacity2})`;
                searchboxForm.style.backgroundImage = 'none';
            } else if (style === 'colorful') {
                searchboxForm.style.backgroundImage = 'linear-gradient(to right, rgb(255, 221, 238), skyblue)';
                searchboxForm.style.background = 'none';
            }
        }

        async updateHeaderBackground() {
            // 统一header背景
            const header = document.getElementById('b_header');
            if (!header) return;

            const backgroundType = this.config.get('backgroundType');
            let backgroundImage = '';

            switch (backgroundType) {
                case 'gradient':
                    backgroundImage = 'linear-gradient(to right, #FFDDEE, skyblue)';
                    break;
                case 'image':
                    const imageUrl = this.config.get('backgroundImage');
                    const cachedImage = await this.config.convertImageToBase64(imageUrl);
                    backgroundImage = `url(${cachedImage || imageUrl})`;
                    break;
                case 'custom':
                    const base64Image = this.config.get('customImageBase64');
                    if (base64Image) {
                        backgroundImage = `url(${base64Image})`;
                    } else {
                        backgroundImage = 'linear-gradient(to right, #FFDDEE, skyblue)';
                    }
                    break;
            }

            header.style.background = backgroundImage;
            header.style.backgroundSize = 'cover';
            header.style.backgroundPosition = 'center';
            header.style.backgroundAttachment = 'fixed';
        }
    }

    // ==================== 背景管理模块 ====================
    class BackgroundManager {
        constructor(config) {
            this.config = config;
        }

        async applyBackground() {
            const container = document.getElementById('b_content') || document.documentElement;
            const backgroundType = this.config.get('backgroundType');

            // 清除之前的背景设置
            container.style.backgroundImage = '';
            container.style.backgroundColor = '';
            document.documentElement.style.background = '';

            switch (backgroundType) {
                case 'gradient':
                    this.applyGradientBackground(container);
                    break;
                case 'image':
                    await this.applyImageBackground(container);
                    break;
                case 'custom':
                    this.applyCustomBackground(container);
                    break;
            }
        }

        applyGradientBackground(container) {
            container.style.backgroundImage = 'linear-gradient(to right, #FFDDEE, skyblue)';
            container.style.backgroundAttachment = 'fixed';
        }

        async applyImageBackground(container) {
            const imageUrl = this.config.get('backgroundImage');
            
            // 尝试使用缓存的base64图片
            const cachedImage = await this.config.convertImageToBase64(imageUrl);
            if (cachedImage) {
                container.style.background = `url(${cachedImage}) center/cover fixed`;
            } else {
                // 回退到直接URL
                container.style.background = `url(${imageUrl}) center/cover fixed`;
            }
        }

        applyCustomBackground(container) {
            const base64Image = this.config.get('customImageBase64');
            if (base64Image) {
                container.style.background = `url(${base64Image}) center/cover fixed`;
            } else {
                this.applyGradientBackground(container); // 回退到渐变色
            }
        }

        // 为百度设置特殊背景
        applyBaiduBackground() {
            const wrapper = document.getElementById('wrapper_wrapper');
            if (wrapper) {
                const imageUrl = this.config.get('backgroundImage');
                wrapper.style.background = `url(${imageUrl}) center/cover fixed`;
            }
        }
    }

    // ==================== UI管理模块 ====================
    class UIManager {
        constructor(config, styleManager, backgroundManager) {
            this.config = config;
            this.styleManager = styleManager;
            this.backgroundManager = backgroundManager;
            this.settingsPanel = null;
            this.overlay = null;
            this.dragData = { isDragging: false, offset: { x: 0, y: 0 } };
        }

        createControlButtons() {
            const scopebar = document.querySelector('.b_scopebar');
            if (!scopebar || !scopebar.children[0]) return;

            const controlContainer = document.createElement('div');
            controlContainer.className = 'beautify-control-buttons';
            
            const buttons = [
                { text: '透明', action: () => this.setSearchboxStyle('transparent') },
                { text: '炫彩', action: () => this.setSearchboxStyle('colorful') },
                { text: '渐变', action: () => this.setBackgroundType('gradient') },
                { text: '图片', action: () => this.setBackgroundType('image') }
            ];

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.className = 'beautify-control-btn';
                button.textContent = btn.text;
                button.addEventListener('click', btn.action);
                controlContainer.appendChild(button);
            });

            // 设置按钮
            const settingsBtn = document.createElement('button');
            settingsBtn.className = 'beautify-control-btn';
            settingsBtn.textContent = '⚙️';
            settingsBtn.style.fontSize = '16px';
            settingsBtn.addEventListener('click', () => {
                console.log('设置按钮被点击了');
                this.showSettingsPanel();
            });
            
            const headerNav = document.getElementById('id_h');
            if (headerNav) {
                headerNav.appendChild(settingsBtn);
            } else {
                // 如果找不到id_h，就添加到控制按钮组里
                controlContainer.appendChild(settingsBtn);
            }

            scopebar.children[0].appendChild(controlContainer);
        }

        async setSearchboxStyle(style) {
            this.config.set('searchboxStyle', style);
            this.styleManager.updateSearchboxStyle();
            this.updateActiveButtons();
        }

        async setBackgroundType(type) {
            this.config.set('backgroundType', type);
            await this.backgroundManager.applyBackground();
            await this.styleManager.updateHeaderBackground();
            this.styleManager.updateResultBoxStyles();
            this.updateActiveButtons();
        }

        updateActiveButtons() {
            // 更新按钮激活状态
            document.querySelectorAll('.beautify-control-btn').forEach(btn => {
                btn.classList.remove('active');
            });

            const searchboxStyle = this.config.get('searchboxStyle');
            const backgroundType = this.config.get('backgroundType');
            
            document.querySelectorAll('.beautify-control-btn').forEach(btn => {
                if ((btn.textContent === '透明' && searchboxStyle === 'transparent') ||
                    (btn.textContent === '炫彩' && searchboxStyle === 'colorful') ||
                    (btn.textContent === '渐变' && backgroundType === 'gradient') ||
                    (btn.textContent === '图片' && backgroundType === 'image')) {
                    btn.classList.add('active');
                }
            });
        }

        createOverlay() {
            if (this.overlay) return;
            
            this.overlay = document.createElement('div');
            this.overlay.className = 'beautify-overlay';
            this.overlay.addEventListener('click', () => this.hideSettingsPanel());
            document.body.appendChild(this.overlay);
        }

        createSettingsPanel() {
            console.log('创建设置面板');
            if (this.settingsPanel) {
                console.log('设置面板已存在');
                return;
            }

            // 创建遮罩层
            this.createOverlay();

            const panel = document.createElement('div');
            panel.className = 'beautify-settings';
            panel.innerHTML = `
                <div class="beautify-settings-header">
                    <h3 class="beautify-settings-title">🎨 美化设置</h3>
                    <button class="beautify-close-btn" type="button">×</button>
                </div>
                <div class="beautify-settings-content">
                    <div class="beautify-form-group">
                        <label class="beautify-label">模糊度 (0-100)</label>
                        <div class="beautify-slider-container">
                            <input type="range" class="beautify-input beautify-slider" id="blur-slider" 
                                   min="0" max="100" value="${this.config.get('blurLevel')}">
                            <span class="beautify-value-display" id="blur-value">${this.config.get('blurLevel')}px</span>
                        </div>
                    </div>
                    
                    <div class="beautify-form-group">
                        <label class="beautify-label">渐变色透明度 (0-100)</label>
                        <div class="beautify-slider-container">
                            <input type="range" class="beautify-input beautify-slider" id="opacity1-slider" 
                                   min="0" max="100" value="${this.config.get('opacity1')}">
                            <span class="beautify-value-display" id="opacity1-value">${this.config.get('opacity1')}%</span>
                        </div>
                    </div>
                    
                    <div class="beautify-form-group">
                        <label class="beautify-label">图片背景透明度 (0-100)</label>
                        <div class="beautify-slider-container">
                            <input type="range" class="beautify-input beautify-slider" id="opacity2-slider" 
                                   min="0" max="100" value="${this.config.get('opacity2')}">
                            <span class="beautify-value-display" id="opacity2-value">${this.config.get('opacity2')}%</span>
                        </div>
                    </div>
                    
                    <div class="beautify-form-group">
                        <label class="beautify-label">背景类型</label>
                        <select class="beautify-select" id="background-type">
                            <option value="gradient" ${this.config.get('backgroundType') === 'gradient' ? 'selected' : ''}>渐变色</option>
                            <option value="image" ${this.config.get('backgroundType') === 'image' ? 'selected' : ''}>预设图片</option>
                            <option value="custom" ${this.config.get('backgroundType') === 'custom' ? 'selected' : ''}>自定义图片</option>
                        </select>
                    </div>
                    
                    <div class="beautify-form-group">
                        <label class="beautify-label">预设图片</label>
                        <select class="beautify-select" id="background-image">
                            ${this.createImageOptions()}
                        </select>
                    </div>
                    
                    <div class="beautify-form-group">
                        <label class="beautify-label">上传自定义图片</label>
                        <div class="beautify-file-upload">
                            <input type="file" class="beautify-file-input" id="custom-image" accept="image/*">
                            <label for="custom-image" class="beautify-file-label">
                                📷 点击选择图片文件
                            </label>
                        </div>
                    </div>
                    
                    <div class="beautify-button-group">
                        <button class="beautify-btn beautify-btn-secondary" id="reset-btn">🔄 重置</button>
                        <button class="beautify-btn beautify-btn-primary" id="save-btn">💾 保存</button>
                    </div>
                </div>
            `;

            document.body.appendChild(panel);
            this.settingsPanel = panel;
            console.log('设置面板已添加到DOM');
            this.setupPanelEvents();
        }

        createImageOptions() {
            const images = this.config.getDefaultImages();
            return images.map((url, index) => {
                const selected = url === this.config.get('backgroundImage') ? 'selected' : '';
                const label = index === 0 ? '必应每日壁纸' : `预设图片 ${index}`;
                return `<option value="${url}" ${selected}>${label}</option>`;
            }).join('');
        }

        setupPanelEvents() {
            const panel = this.settingsPanel;
            
            // 关闭按钮
            panel.querySelector('.beautify-close-btn').addEventListener('click', () => {
                this.hideSettingsPanel();
            });

            // 拖拽功能
            const header = panel.querySelector('.beautify-settings-header');
            this.setupDragEvents(header, panel);

            // 模糊度滑块
            const blurSlider = panel.querySelector('#blur-slider');
            const blurValue = panel.querySelector('#blur-value');
            blurSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                blurValue.textContent = `${value}px`;
            });

            // 透明度1滑块
            const opacity1Slider = panel.querySelector('#opacity1-slider');
            const opacity1Value = panel.querySelector('#opacity1-value');
            opacity1Slider.addEventListener('input', (e) => {
                const value = e.target.value;
                opacity1Value.textContent = `${value}%`;
            });

            // 透明度2滑块
            const opacity2Slider = panel.querySelector('#opacity2-slider');
            const opacity2Value = panel.querySelector('#opacity2-value');
            opacity2Slider.addEventListener('input', (e) => {
                const value = e.target.value;
                opacity2Value.textContent = `${value}%`;
            });

            // 自定义图片上传
            panel.querySelector('#custom-image').addEventListener('change', (e) => {
                this.handleImageUpload(e.target.files[0]);
            });

            // 保存按钮
            panel.querySelector('#save-btn').addEventListener('click', () => {
                this.saveSettings();
            });

            // 重置按钮
            panel.querySelector('#reset-btn').addEventListener('click', () => {
                this.resetSettings();
            });
        }

        setupDragEvents(handle, element) {
            handle.addEventListener('mousedown', (e) => {
                this.dragData.isDragging = true;
                this.dragData.offset.x = e.clientX - element.offsetLeft;
                this.dragData.offset.y = e.clientY - element.offsetTop;
                handle.style.cursor = 'grabbing';
            });

            document.addEventListener('mousemove', (e) => {
                if (!this.dragData.isDragging) return;
                
                const x = e.clientX - this.dragData.offset.x;
                const y = e.clientY - this.dragData.offset.y;
                
                element.style.left = `${x}px`;
                element.style.top = `${y}px`;
                element.style.transform = 'none';
            });

            document.addEventListener('mouseup', () => {
                this.dragData.isDragging = false;
                handle.style.cursor = 'move';
            });
        }

        async handleImageUpload(file) {
            if (!file) return;

            try {
                const base64 = await this.fileToBase64(file);
                this.config.set('customImageBase64', base64);
                GM_notification({ text: '图片上传成功！', timeout: 2000 });
            } catch (error) {
                console.error('图片上传失败:', error);
                GM_notification({ text: '图片上传失败，请重试', timeout: 3000 });
            }
        }

        fileToBase64(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        async saveSettings() {
            const panel = this.settingsPanel;
            
            const updates = {
                blurLevel: parseInt(panel.querySelector('#blur-slider').value),
                opacity1: parseInt(panel.querySelector('#opacity1-slider').value),
                opacity2: parseInt(panel.querySelector('#opacity2-slider').value),
                backgroundType: panel.querySelector('#background-type').value,
                backgroundImage: panel.querySelector('#background-image').value
            };

            this.config.update(updates);
            await this.backgroundManager.applyBackground();
            await this.styleManager.updateHeaderBackground();
            this.styleManager.updateResultBoxStyles();
            this.styleManager.updateSearchboxStyle();
            this.updateActiveButtons();
            
            GM_notification({ text: '设置已保存！', timeout: 2000 });
            this.hideSettingsPanel();
        }

        async resetSettings() {
            this.config.reset();
            await this.backgroundManager.applyBackground();
            await this.styleManager.updateHeaderBackground();
            this.styleManager.updateResultBoxStyles();
            this.styleManager.updateSearchboxStyle();
            this.updateActiveButtons();
            
            GM_notification({ text: '设置已重置为默认值！', timeout: 2000 });
            this.hideSettingsPanel();
        }

        showSettingsPanel() {
            console.log('显示设置面板');
            if (!this.settingsPanel) {
                this.createSettingsPanel();
            }
            
            // 强制显示
            this.overlay.classList.add('show');
            this.settingsPanel.classList.add('show');
            this.settingsPanel.style.display = 'block';
            this.settingsPanel.style.visibility = 'visible';
            this.settingsPanel.style.opacity = '1';
            this.settingsPanel.style.zIndex = '999999999';
            
            console.log('设置面板显示状态:', this.settingsPanel.style.display);
        }

        hideSettingsPanel() {
            if (this.settingsPanel) {
                this.settingsPanel.classList.remove('show');
                this.settingsPanel.style.display = 'none';
            }
            if (this.overlay) {
                this.overlay.classList.remove('show');
            }
        }
    }

    // ==================== 增强功能模块 ====================
    class EnhancementManager {
        constructor(config) {
            this.config = config;
        }

        enhanceSearchBox() {
            const searchBox = document.querySelector('.b_searchbox');
            if (!searchBox) return;

            // 搜索框获得焦点时扩展宽度
            searchBox.addEventListener('focus', () => {
                searchBox.style.transition = 'all 0.3s ease';
                searchBox.style.width = '600px';
            });

            // 点击页面其他地方时恢复宽度
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.b_searchboxForm')) {
                    searchBox.style.width = '';
                }
            });
        }

        enhanceResults() {
            // 结果框悬停效果已在CSS中处理
            this.fixResultOverflow();
            this.cleanupFooter();
        }

        fixResultOverflow() {
            // 修复相关搜索框宽度
            const relatedBox = document.querySelector('.b_rrsr .b_vlist2col');
            if (relatedBox?.children[0]?.children[1]) {
                Array.from(relatedBox.children[0].children[1].children)
                    .forEach(item => item.style.width = '45%');
            }

            // 修复其他溢出问题
            const brsv3 = document.getElementById('brsv3');
            if (brsv3?.children[1]) {
                Array.from(brsv3.children[1].children)
                    .forEach(item => item.style.width = '45%');
            }
        }

        cleanupFooter() {
            const footer = document.getElementById('b_footer');
            if (footer) {
                footer.style.background = 'rgba(0, 0, 0, 0.8)';
                footer.style.backdropFilter = 'blur(10px)';
            }

            const mfaSrch = document.getElementById('mfa_srch');
            if (mfaSrch) {
                mfaSrch.style.backdropFilter = 'blur(10px)';
                mfaSrch.style.background = 'transparent';
            }
        }

        setupKeyboardShortcuts() {
            document.addEventListener('keydown', (e) => {
                // Ctrl + / 打开设置
                if (e.ctrlKey && e.code === 'Slash') {
                    e.preventDefault();
                    const settingsBtn = document.querySelector('.beautify-control-btn[textContent="⚙️"]');
                    if (settingsBtn) settingsBtn.click();
                }
            });
        }

        cleanupOtherElements() {
            // 清理其他元素的背景
            const selectors = [
                '.qna_algo', '.slide', '.nws_cwrp', '.mc_vhvc_th', '.na_ccw'
            ];

            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.background = 'transparent';
                    if (el.children[0]) {
                        el.children[0].style.background = 'transparent';
                    }
                });
            });
        }
    }

    // ==================== 主应用类 ====================
    class BingBeautifier {
        constructor() {
            this.config = new ConfigManager();
            this.styleManager = new StyleManager(this.config);
            this.backgroundManager = new BackgroundManager(this.config);
            this.uiManager = new UIManager(this.config, this.styleManager, this.backgroundManager);
            this.enhancementManager = new EnhancementManager(this.config);
        }

        init() {
            console.log('初始化美化脚本');
            // 根据不同域名执行不同逻辑
            if (this.isBingSearch()) {
                this.initBing();
            } else if (this.isBaidu()) {
                this.initBaidu();
            }
        }

        isBingSearch() {
            return window.location.href.includes('bing.com/search');
        }

        isBaidu() {
            return window.location.href.includes('baidu.com');
        }

        async initBing() {
            console.log('初始化必应美化');
            
            // 立即注入基础样式
            this.styleManager.injectGlobalStyles();
            
            // 使用async/await优化异步操作
            const initializeUI = async () => {
                // 应用背景
                await this.backgroundManager.applyBackground();
                
                // 更新header背景
                await this.styleManager.updateHeaderBackground();
                
                // 更新样式
                this.styleManager.updateResultBoxStyles();
                this.styleManager.updateSearchboxStyle();
                
                // 增强功能
                this.enhancementManager.enhanceSearchBox();
                this.enhancementManager.enhanceResults();
                this.enhancementManager.setupKeyboardShortcuts();
                this.enhancementManager.cleanupOtherElements();
            };

            // 检查DOM是否准备好
            const checkAndInit = async () => {
                const scopebar = document.querySelector('.b_scopebar');
                if (scopebar) {
                    // 创建UI控件
                    this.uiManager.createControlButtons();
                    this.uiManager.updateActiveButtons();
                    await initializeUI();
                    console.log('必应搜索美化已应用');
                } else {
                    // 如果DOM还没准备好，稍后再试
                    setTimeout(checkAndInit, 100);
                }
            };

            // 立即执行基础初始化
            await initializeUI();
            
            // 检查并创建UI控件
            checkAndInit();
        }

        initBaidu() {
            // 简单的百度页面美化
            this.backgroundManager.applyBaiduBackground();
            console.log('百度页面美化已应用');
        }
    }

    // ==================== 初始化 ====================
    function main() {
        try {
            const beautifier = new BingBeautifier();
            beautifier.init();
        } catch (error) {
            console.error('美化脚本初始化失败:', error);
        }
    }

    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // 错误处理
    window.addEventListener('error', (e) => {
        console.error('脚本运行时错误:', e.error);
    }, true);

})();