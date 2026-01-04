// ==UserScript==
// @run-at       document-start
// @name         MissAV去广告、影院模式
// @description  MissAV_AD_block
// @icon         https://missav.ws/img/favicon.ico
// @namespace    loadingi.local
// @version      4.0.2
// @author       ch
// @match        *://*.missav.ws/*
// @match        *://*.missav.ai/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @compatible   safari
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/536213/MissAV%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E5%BD%B1%E9%99%A2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536213/MissAV%E5%8E%BB%E5%B9%BF%E5%91%8A%E3%80%81%E5%BD%B1%E9%99%A2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 主要配置对象
     * - selectors: DOM元素选择器配置
     * - styles: 样式配置
     * - player: 播放器功能配置
     */
    const Config = {
        // DOM 选择器
        selectors: {
            player: {
                container: '.relative.-mx-4.sm\\:m-0.-mt-6',
                wrapper: '.aspect-w-16.aspect-h-9',
                video: 'video#player',
                progress: 'div.sm\\:hidden.flex.justify-between.-mx-4.px-4.pt-3.pb-1.bg-black',
                abLoop: 'div.flex.items-center.flex-nowrap.leading-5',
                abLoopControls: '.theater-controls-abloop',
                genres: '.absolute.bottom-1.left-1.rounded-lg.px-2.py-1.text-xs.text-nord5.bg-blue-800.bg-opacity-75',
                uncensoredLink: "a[id^='option-menu-item'][href*='uncensored']",
                qualityOptions: '.plyr__menu__container [data-plyr="quality"]'
            },
            ads: {
                scripts: [
                    "script[src*='app.1aad5686.js']",
                    "script[src*='inpage.push.js']",
                    "script[src*='hartattenuate.com']",
                    "script[src*='ads']",
                    "script[src*='pop']",
                    "script[src*='banner']",
                    "script[src*='htmlAds']",
                    "script[src*='popAds']",
                    "script[src*='bannerAds']",
                    "script[src*='adsConfig']"
                ],
                elements: [
                    // 'div.sm\\:container.mx-auto.mb-5.px-4',
                    'ul.mb-4.list-none.text-nord14.grid.grid-cols-2.gap-2',
                    'div.relative.ml-4',
                    'div.root--ujvuu',
                    'div.under_player',
                    'div.space-y-5.mb-5',
                    'div[class^="rootContent--"]',
                    'div[class^="fixed right-2 bottom-2"]',
                    'div[class^="space-y-6 mb-6"]',
                    'div.space-y-2.mb-4.ml-4.list-disc.text-nord14',
                    'div[id*="ads"]',
                    'div[id*="banner"]',
                    'div[class*="ads"]',
                    'div[class*="banner"]',
                    '.ad-container',
                    '#ad-container'
                ],
                scriptPatterns: ['htmlAds', 'popAds', 'bannerAds', 'adsConfig']
            }
        },
        styles: {
            button: {
                base: {
                    backgroundColor: '#222',
                    borderRadius: '15px',
                    borderColor: 'black',
                    borderWidth: '1px',
                    color: 'burlywood',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none',
                    minWidth: '80px',
                    padding: '2px 4px',
                    marginBottom: '10px'
                },
                hover: {
                    backgroundColor: '#333'
                }
            },
            theaterMode: `
                .theater-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9998;
                    display: none;
                }
                
                .theater-mode-container {
                    position: fixed !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100vw !important;
                    height: 100vh !important;
                    transform: none !important;
                    z-index: 9999 !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: transparent !important;
                    pointer-events: auto !important;
                }
                
                .theater-mode-container .aspect-w-16.aspect-h-9 {
                    position: relative !important;
                    width: 100vw !important;
                    max-width: none !important;
                    height: 100vh !important;
                    margin: 0 auto !important;
                    pointer-events: auto !important;
                }
                
                .theater-mode-container video {
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    pointer-events: auto !important;
                }
                
                .theater-mode-container * {
                    max-width: none !important;
                    max-height: none !important;
                    pointer-events: auto !important;
                }
                
                .theater-mode-container .plyr__controls {
                    position: fixed !important;
                    bottom: 0 !important;
                    left: 0 !important;
                    width: 100% !important;
                    z-index: 10000 !important;
                    background: transparent !important;
                    padding: 10px !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                    display: flex !important;
                }
                
                .fixed.z-max.w-full.bg-gradient-to-b.from-darkest {
                    z-index: 1 !important;
                }
                
                .theater-mode-container .fixed.z-max.w-full.bg-gradient-to-b.from-darkest {
                    display: none !important;
                }
                
                .theater-mode-container .plyr__time {
                    display: inline-block !important;
                    color: white !important;
                    opacity: 1 !important;
                    visibility: visible !important;
                }
                
                .theater-controls-progress {
                    position: fixed !important;
                    bottom: 104px !important;
                    z-index: 10000 !important;
                    background: transparent !important;
                    padding: 10px !important;
                    width: 100% !important;
                    max-width: none !important;
                    pointer-events: auto !important;
                }
                
                .theater-controls-abloop {
                    position: fixed !important;
                    bottom: 52px !important;
                    left: 0px !important;
                    width: 100% !important;
                    z-index: 10000 !important;
                    padding: 10px !important;
                    pointer-events: auto !important;
                }
                
                .theater-mode-container .plyr__controls__item.plyr__volume {
                    width: 40px !important;
                }
                
                .theater-mode-container .plyr__controls__item[data-plyr="rewind"],
                .theater-mode-container .plyr__controls__item[data-plyr="fast-forward"],
                .theater-mode-container .plyr__control[data-plyr="settings"],
                .theater-mode-container .plyr__controls__item[data-plyr="pip"],
                .theater-mode-container .plyr__controls__item[data-plyr="fullscreen"] {
                    display: none !important;
                }
                
                .theater-mode-container ~ div .theater-mode-button,
                .theater-mode-container ~ div .ab-loop-button {
                    background-color: rgba(34, 34, 34, 0.5) !important;
                    border-color: rgba(0, 0, 0, 0.5) !important;
                }
                
                .theater-mode-container ~ div .theater-mode-button:hover,
                .theater-mode-container ~ div .ab-loop-button:hover {
                    background-color: rgba(51, 51, 51, 0.7) !important;
                }
            `
        },
        player: {
            autoHighestQuality: true,
            preventFocusPause: true,
            autoSwitchUncensored: true,
            hideVideoGenres: true
        }
    };

    /**
     * 工具类
     * - debounce: 函数防抖
     * - createButton: 创建自定义按钮
     * - addStyle: 添加自定义样式
     */
    const Utils = {
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        createButton(text, onClick) {
            const button = document.createElement('button');
            Object.assign(button.style, Config.styles.button.base);
            button.innerText = text;
            button.addEventListener('mouseover', () => Object.assign(button.style, Config.styles.button.hover));
            button.addEventListener('mouseout', () => Object.assign(button.style, { backgroundColor: Config.styles.button.base.backgroundColor }));
            button.addEventListener('click', onClick);
            return button;
        },

        addStyle(css) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        }
    };

    /**
     * 广告拦截器模块
     * - 移除广告脚本和元素
     * - 拦截动态加载的广告
     * - 使用MutationObserver监听DOM变化
     */
    const AdBlocker = {
        init() {
            this.blockAds = Utils.debounce(this.blockAds.bind(this), 100);
            this.blockAds();
            this.setupMutationObserver();
            this.interceptDynamicScripts();
        },

        blockAds() {
            const { scripts, elements, scriptPatterns } = Config.selectors.ads;
            
            // 移除广告脚本和元素
            [...scripts, ...elements].forEach(selector => {
                document.querySelectorAll(selector).forEach(el => el?.remove());
            });
            
            // 移除 iframes
            document.querySelectorAll('iframe').forEach(iframe => iframe.remove());
            
            // 移除匹配模式的脚本
            const scriptPattern = new RegExp(scriptPatterns.join('|'));
            document.querySelectorAll('script').forEach(script => {
                if (scriptPattern.test(script.innerText)) {
                    script.remove();
                }
            });
        },

        setupMutationObserver() {
            const observer = new MutationObserver(
                Utils.debounce(() => this.blockAds(), 100)
            );
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        },

        interceptDynamicScripts() {
            const scriptPattern = new RegExp(Config.selectors.ads.scriptPatterns.join('|'));
            const originalCreateElement = document.createElement.bind(document);
            
            document.createElement = function(tagName) {
                const element = originalCreateElement(tagName);
                if (tagName.toLowerCase() === 'script') {
                    const originalSetAttribute = element.setAttribute.bind(element);
                    element.setAttribute = function(name, value) {
                        if (name === 'src' && scriptPattern.test(value)) {
                            return; // 阻止加载广告脚本
                        }
                        return originalSetAttribute(name, value);
                    };
                }
                return element;
            };
        }
    };

    /**
     * 播放器增强模块
     * 主要功能：
     * - 影院模式
     * - 进度控制
     * - AB循环
     * - 自动最高画质
     * - 防止失焦暂停
     * - 隐藏视频类型标签
     */
    const PlayerEnhancer = {
        init() {
            this.setupPlayer();
            this.createControls();
            Utils.addStyle(Config.styles.theaterMode);
            
            // 新增功能初始化
            if(Config.player.hideVideoGenres) {
                this.hideVideoGenres();
            }
            
            if(Config.player.autoSwitchUncensored) {
                this.setupAutoUncensored();
            }
            
            if(Config.player.autoHighestQuality) {
                this.setupAutoHighestQuality();
            }
            
            if(Config.player.preventFocusPause) {
                this.preventFocusPause();
            }
        },

        setupPlayer() {
            // 移除点击事件
            document.querySelectorAll('[\\@click="pop()"]').forEach(el => {
                el.removeAttribute('@click');
            });

            // 移除窗口失焦暂停
            const aspectElements = document.getElementsByClassName('aspect-w-16 aspect-h-9');
            if (aspectElements[11]) {
                aspectElements[11].removeAttribute('@click');
                aspectElements[11].removeAttribute('@keyup.space.window');
            }
        },

        createControls() {
            const container = document.createElement('div');
            Object.assign(container.style, {
                position: 'fixed',
                top: '14px',
                right: '98px',
                zIndex: '10001',
                display: 'flex',
                flexDirection: 'row',
                gap: '10px'
            });

            // 创建影院模式按钮
            const theaterButton = Utils.createButton('影院模式', () => this.toggleTheaterMode());
            theaterButton.className = 'theater-mode-button';
            container.appendChild(theaterButton);
            
            // 创建进度控制按钮
            const progressButton = Utils.createButton('进度控制', () => this.toggleProgressControls());
            progressButton.className = 'progress-control-button';
            progressButton.style.display = 'none'; // 初始隐藏
            container.appendChild(progressButton);
            
            // 创建 AB 循环按钮
            const abLoopButton = Utils.createButton('A/B', () => this.toggleABLoopControls());
            abLoopButton.className = 'ab-loop-button';
            abLoopButton.style.display = 'none';
            container.appendChild(abLoopButton);
            
            document.body.appendChild(container);
        },

        toggleTheaterMode() {
            const { player } = Config.selectors;
            const playerContainer = document.querySelector(player.container);
            const progress = document.querySelector(player.progress);
            const abLoop = document.querySelector(player.abLoop);
            
            let overlay = document.querySelector('.theater-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'theater-overlay';
                document.body.appendChild(overlay);
            }
            
            const isTheaterMode = overlay.style.display === 'none' || overlay.style.display === '';
            
            const theaterButton = document.querySelector('.theater-mode-button');
            const abLoopButton = document.querySelector('.ab-loop-button');
            const progressButton = document.querySelector('.progress-control-button');
            
            if (theaterButton) {
                theaterButton.innerText = isTheaterMode ? '关闭影院' : '影院模式';
            }
            
            if (abLoopButton) {
                abLoopButton.style.display = isTheaterMode ? 'block' : 'none';
            }

            if (progressButton) {
                progressButton.style.display = isTheaterMode ? 'block' : 'none';
            }
            
            if (isTheaterMode) {
                this.enterTheaterMode(overlay, playerContainer, progress, abLoop);
            } else {
                this.exitTheaterMode(overlay, playerContainer, progress, abLoop);
            }
        },

        toggleProgressControls() {
            const progress = document.querySelector('.theater-controls-progress');
            const progressButton = document.querySelector('.progress-control-button');
            
            if (progress) {
                const isVisible = progress.style.display !== 'none';
                progress.style.display = isVisible ? 'none' : 'flex';
                
                if (progressButton) {
                    progressButton.innerText = isVisible ? '显示进度' : '隐藏进度';
                }
            }
        },

        enterTheaterMode(overlay, playerContainer, progress, abLoop) {
            overlay.style.display = 'block';
            
            if (playerContainer) {
                playerContainer.classList.add('theater-mode-container');
                this.adjustParentContainers(playerContainer);
            }
            
            if (progress) {
                progress.classList.add('theater-controls-progress');
                // 默认显示进度条
                progress.style.display = 'flex';
                const progressButton = document.querySelector('.progress-control-button');
                if (progressButton) {
                    progressButton.innerText = '隐藏进度';
                }
            }
            
            if (abLoop) {
                abLoop.classList.add('theater-controls-abloop');
                abLoop.style.display = 'none';
            }
            
            document.addEventListener('keydown', this.handleEscKey);
        },

        exitTheaterMode(overlay, playerContainer, progress, abLoop) {
            overlay.style.display = 'none';
            
            if (playerContainer) {
                playerContainer.classList.remove('theater-mode-container');
                this.resetParentContainers(playerContainer);
            }
            
            if (progress) {
                progress.classList.remove('theater-controls-progress');
            }
            
            if (abLoop) {
                abLoop.classList.remove('theater-controls-abloop');
            }
            
            document.removeEventListener('keydown', this.handleEscKey);
        },

        adjustParentContainers(element) {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                Object.assign(parent.style, {
                    maxWidth: 'none',
                    maxHeight: 'none',
                    overflow: 'visible',
                    zIndex: 'auto'
                });
                parent = parent.parentElement;
            }
        },

        resetParentContainers(element) {
            let parent = element.parentElement;
            while (parent && parent !== document.body) {
                ['maxWidth', 'maxHeight', 'overflow', 'zIndex'].forEach(prop => {
                    parent.style.removeProperty(prop);
                });
                parent = parent.parentElement;
            }
        },

        handleEscKey(e) {
            if (e.key === 'Escape') {
                PlayerEnhancer.toggleTheaterMode();
            }
        },

        toggleABLoopControls() {
            const abLoopControls = document.querySelector(Config.selectors.player.abLoopControls);
            const abLoopButton = document.querySelector('.ab-loop-button');
            
            if (abLoopControls) {
                const isVisible = abLoopControls.style.display !== 'none';
                abLoopControls.style.display = isVisible ? 'none' : 'flex';
                
                if (abLoopButton) {
                    abLoopButton.innerText = isVisible ? 'A/B' : 'no A/B';
                }
            }
        },

        // 隐藏视频类型
        hideVideoGenres() {
            const genresElements = document.querySelectorAll(Config.selectors.player.genres);
            genresElements.forEach(el => el.style.display = 'none');
        },

        // 自动切换无码版本beta
        // setupAutoUncensored() {
        //     const uncensoredLink = document.querySelector(Config.selectors.player.uncensoredLink);
        //     if(uncensoredLink) {
        //         uncensoredLink.click();
        //     }
        // },

        // 自动设置最高画质
        setupAutoHighestQuality() {
            const setHighestQuality = () => {
                const player = unsafeWindow.player;
                if(!player?.config?.quality?.options) return;
                
                const maxQuality = Math.max(...player.config.quality.options);
                player.quality = maxQuality;
                player.config.quality.default = maxQuality;
                player.config.quality.selected = maxQuality;
            };

            // 等待播放器加载完成
            const checkPlayer = setInterval(() => {
                if(unsafeWindow.player) {
                    setHighestQuality();
                    clearInterval(checkPlayer);
                }
            }, 100);
        },

        // 防止失焦暂停
        preventFocusPause() {
            document.addEventListener('visibilitychange', () => {
                const player = unsafeWindow.player;
                if(document.hidden && player?.playing) {
                    player.play();
                }
            });
            
            // 移除原有的失焦暂停事件
            const playerContainer = document.querySelector(Config.selectors.player.container);
            if(playerContainer) {
                playerContainer.removeAttribute('@keyup.space.window');
            }
        }
    };

    /**
     * 主程序入口
     * - 设置背景色
     * - 初始化广告拦截
     * - 初始化播放器增强
     */
    const App = {
        init() {
            document.body.style.backgroundColor = 'black';
            AdBlocker.init();
            PlayerEnhancer.init();
        }
    };

    // 启动程序
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();