// ==UserScript==
// @name         星渊NS助手
// @namespace    https://www.nodeseek.com/
// @version      0.1.1
// @description  NodeSeek论坛增强脚本
// @author       stardeep
// @license      GPL-3.0
// @match        https://www.nodeseek.com/*
// @icon         https://drstth.com/download/favicon.ico
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/523819/%E6%98%9F%E6%B8%8ANS%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523819/%E6%98%9F%E6%B8%8ANS%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
//官方交流群/反馈群：https://t.me/NSaide
//官方频道：https://t.me/NSaide_channel
//官方greasyfork安装地址： https://greasyfork.org/zh-CN/scripts/523819
(function() {
    'use strict';
    
    console.log('[NS助手] 脚本开始加载');

    const CONFIG_URL = 'https://raw.githubusercontent.com/stardeep925/NSaide/main/modules/config.json';
    const CACHE_EXPIRY = 30 * 60 * 1000;
    const CACHE_KEY_PREFIX = 'ns_module_cache_';
    const CONFIG_CACHE_KEY = 'ns_config_cache';

    const getCachedData = (key) => {
        const cached = GM_getValue(key);
        if (!cached) return null;
        
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > CACHE_EXPIRY) {
                GM_setValue(key, '');
                return null;
            }
            return data;
        } catch {
            return null;
        }
    };

    const setCachedData = (key, data) => {
        GM_setValue(key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    };

    const fetchWithCache = (url, cacheKey) => {
        return new Promise((resolve, reject) => {
            const cached = getCachedData(cacheKey);
            if (cached) {
                console.log(`[NS助手] 使用缓存数据: ${cacheKey}`);
                resolve(cached);
                return;
            }

            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?t=${Date.now()}`,
                nocache: true,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        try {
                            const data = response.responseText;
                            setCachedData(cacheKey, data);
                            resolve(data);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        reject(new Error(`请求失败: ${response.status}`));
                    }
                },
                onerror: reject
            });
        });
    };

    const loadConfig = async () => {
        try {
            const configText = await fetchWithCache(CONFIG_URL, CONFIG_CACHE_KEY);
            return JSON.parse(configText);
        } catch (error) {
            console.error('[NS助手] 配置加载失败:', error);
            throw error;
        }
    };

    const loadModule = async (moduleInfo) => {
        const cacheKey = `${CACHE_KEY_PREFIX}${moduleInfo.id}`;
        try {
            console.log(`[NS助手] 开始加载模块: ${moduleInfo.name}`);
            const moduleCode = await fetchWithCache(moduleInfo.url, cacheKey);
            eval(moduleCode);
            console.log(`[NS助手] 模块加载成功: ${moduleInfo.name}`);
        } catch (error) {
            console.error(`[NS助手] 模块 ${moduleInfo.name} 加载失败:`, error);
            throw error;
        }
    };

    const createNS = () => {
        window.NS = {
            version: GM_info.script.version,
            modules: new Map(),
            isReady: false,
            
            registerModule(moduleDefinition) {
                if (!moduleDefinition || !moduleDefinition.id || !moduleDefinition.init) return;

                const module = {
                    ...moduleDefinition,
                    enabled: GM_getValue(`module_${moduleDefinition.id}_enabled`, true)
                };

                this.modules.set(moduleDefinition.id, module);
                console.log(`[NS助手] 模块已注册: ${module.name}`);
            },

            init() {
                if (this.isReady) return;

                const enabledModules = Array.from(this.modules.values()).filter(m => m.enabled);
                console.log(`[NS助手] 开始初始化 ${enabledModules.length} 个已启用模块`);

                Promise.all(enabledModules.map(module => 
                    new Promise(resolve => {
                        try {
                            module.init();
                            console.log(`[NS助手] 模块初始化成功: ${module.name}`);
                            resolve();
                        } catch (error) {
                            console.error(`[NS助手] 模块 ${module.name} 初始化失败:`, error);
                            resolve();
                        }
                    })
                )).then(() => {
                    this.isReady = true;
                    console.log('[NS助手] 所有模块初始化完成');
                });
            }
        };

        window.NSRegisterModule = (moduleDefinition) => {
            window.NS.registerModule(moduleDefinition);
        };
    };

    const initializeModules = async () => {
        try {
            createNS();
            const config = await loadConfig();
            
            await Promise.all(config.modules.map(loadModule));
            
            if (window.NS.modules.size > 0) {
                window.NS.init();
            }
        } catch (error) {
            console.error('[NS助手] 初始化失败:', error);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeModules);
    } else {
        initializeModules();
    }
})();
