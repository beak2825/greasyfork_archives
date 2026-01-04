// ==UserScript==
// @name         Via加载进度条
// @namespace    https://viayoo.com/
// @version      2.4.0
// @description  基于#B5C7E5→#C8BFE7渐变色系的动态加载进度条
// @author       是小白呀 & DeepSeek & Grok
// @match        *://*/*
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532841/Via%E5%8A%A0%E8%BD%BD%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/532841/Via%E5%8A%A0%E8%BD%BD%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const LOADER_THEME = {
        PRIMARY: '#B5C7E5',
        SECONDARY: '#C8BFE7',
        GLOW: '#D4B1FF',
        DURATION: 380,
        HEIGHT: 2.5,
        HIDE_DELAY: 200
    };

    // 创建带有Shadow DOM的加载器
    const createLoader = () => {
        // 移除现有的加载器（如果有）
        const existingHost = document.getElementById('via-loader-host');
        if (existingHost) existingHost.remove();

        // 创建Shadow Host
        const shadowHost = document.createElement('div');
        shadowHost.id = 'via-loader-host';
        Object.assign(shadowHost.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '0',
            zIndex: '99999',
            pointerEvents: 'none'
        });

        // 创建Shadow Root
        const shadowRoot = shadowHost.attachShadow({ mode: 'open' });
        
        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            .via-loader {
                width: 0%;
                height: ${LOADER_THEME.HEIGHT}px;
                background: linear-gradient(135deg, 
                    ${LOADER_THEME.PRIMARY} 25%, 
                    ${LOADER_THEME.SECONDARY} 50%, 
                    ${LOADER_THEME.GLOW} 75%, 
                    ${LOADER_THEME.PRIMARY} 100%);
                background-size: 200% 100%;
                transition: width ${LOADER_THEME.DURATION}ms ease-out, 
                           opacity ${LOADER_THEME.DURATION / 2}ms ease-in;
                box-shadow: 0 2px 6px ${LOADER_THEME.SECONDARY}33;
            }
        `;
        
        // 创建加载器元素
        const loader = document.createElement('div');
        loader.className = 'via-loader';
        
        // 添加到Shadow DOM
        shadowRoot.appendChild(style);
        shadowRoot.appendChild(loader);
        
        // 添加到文档
        document.documentElement.appendChild(shadowHost);
        
        return {
            host: shadowHost,
            element: loader
        };
    };

    class LoadingSystem {
        constructor() {
            this.loader = createLoader();
            this.pageLoadStatus = false;
            this.initLoader();
        }

        initLoader() {
            this.setupLoadingSimulator();
            this.setupSPAListener();
        }

        setupLoadingSimulator() {
            let progress = 0;
            const baseSpeed = 0.05;
            const networkFactor = navigator.connection 
                ? Math.min(navigator.connection.downlink / 5, 1)
                : 1;

            const animate = () => {
                if (this.pageLoadStatus) return;
                
                const dynamicSpeed = baseSpeed * 
                                   Math.pow(1 - progress / 100, 0.7) *
                                   (0.8 + Math.random() * 0.4) * 
                                   networkFactor;
                
                progress = Math.min(progress + dynamicSpeed * 100, 99.9);
                this.loader.element.style.width = `${progress}%`;
                this.loader.element.style.backgroundPositionX = 
                    `${Math.sin(Date.now()/800)*50 + 50}%`;
                
                requestAnimationFrame(animate);
            };
            
            animate();

            const completeHandler = () => {
                this.pageLoadStatus = true;
                this.loader.element.style.width = '100%';
                setTimeout(() => {
                    this.loader.element.style.opacity = '0';
                    setTimeout(() => {
                        if (this.loader.host.parentNode) {
                            this.loader.host.parentNode.removeChild(this.loader.host);
                        }
                    }, LOADER_THEME.DURATION);
                }, LOADER_THEME.HIDE_DELAY);
            };

            window.addEventListener('load', completeHandler, { once: true });
            document.addEventListener('DOMContentLoaded', () => {
                if (!this.pageLoadStatus) setTimeout(completeHandler, 1500);
            });
        }

        setupSPAListener() {
            const resetLoader = () => {
                if (this.pageLoadStatus) {
                    this.pageLoadStatus = false;
                    this.loader = createLoader();
                    this.setupLoadingSimulator();
                }
            };

            const wrapHistory = (method) => {
                const orig = history[method];
                return function() {
                    const result = orig.apply(this, arguments);
                    resetLoader();
                    return result;
                };
            };
            
            history.pushState = wrapHistory('pushState');
            history.replaceState = wrapHistory('replaceState');
            window.addEventListener('popstate', resetLoader);
        }
    }

    // 初始化
    const init = () => {
        if (document.getElementById('via-loader-host')) return;
        new LoadingSystem();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 0);
    }
})();