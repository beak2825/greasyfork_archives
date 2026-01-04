// ==UserScript==
// @name         基金实时监控 Pro42 - 投资决策系统
// @namespace    http://tampermonkey.net/
// @version      2.9.0
// @description  知过去·知未来·知现在 - 基于指数基金投资逻辑的智能决策系统
// @author       11208596
// @match        http://*/*
// @match        https://*/*
// @license MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @connect      fundgz.1234567.com.cn
// @connect      qt.gtimg.cn
// @connect      ccwzg7fj.lc-cn-n1-shared.com
// @connect      push2.eastmoney.com
// @connect      datacenter-web.eastmoney.com
// @require      https://cdn.jsdelivr.net/npm/leancloud-storage@4.12.0/dist/av-min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/546737/%E5%9F%BA%E9%87%91%E5%AE%9E%E6%97%B6%E7%9B%91%E6%8E%A7%20Pro42%20-%20%E6%8A%95%E8%B5%84%E5%86%B3%E7%AD%96%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/546737/%E5%9F%BA%E9%87%91%E5%AE%9E%E6%97%B6%E7%9B%91%E6%8E%A7%20Pro42%20-%20%E6%8A%95%E8%B5%84%E5%86%B3%E7%AD%96%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 初始化 LeanCloud
    try {
        AV.init({
            appId: 'CCWzG7FJFwkIMdR3rd9yhmMS-gzGzoHsz',
            appKey: 'k7iXfaAyZAbKhRddTrYEiNGm',
            serverURL: 'https://ccwzg7fj.lc-cn-n1-shared.com'
        });

        // 设置请求头以绕过域名限制
        AV._config.requestHeaders = {
            'X-LC-Id': 'CCWzG7FJFwkIMdR3rd9yhmMS-gzGzoHsz',
            'X-LC-Key': 'k7iXfaAyZAbKhRddTrYEiNGm',
            'Content-Type': 'application/json',
            'Origin': 'https://leancloud.cn'  // 伪装来源域名
        };

        console.log('LeanCloud初始化成功');
    } catch (error) {
        console.error('LeanCloud初始化失败:', error);
    }

    // 测试LeanCloud连接
    async function testLeanCloudConnection() {
        try {
            console.log('测试LeanCloud连接...');
            // 简单测试，不实际创建用户
            const testQuery = new AV.Query('_User');
            testQuery.limit(0); // 不获取任何数据，只测试连接
            await testQuery.find();
            console.log('LeanCloud连接成功');
            return true;
        } catch (error) {
            console.error('LeanCloud连接测试失败:', error);
            // 如果是域名白名单问题，返回false而不是抛出错误
            if (error.message.includes('Access denied') || error.message.includes('domain white list')) {
                console.warn('LeanCloud域名访问受限，建议使用本地模式');
                return false;
            }
            return false;
        }
    }


    // 默认配置
    const DEFAULT_CONFIG = {
        fundCodes: ['000001'],
        threshold: { rise: 2, fall: -2 },
        refreshInterval: 60000,
        fundShares: { '000001': 1 },
        costPrices: { '000001': 1 },
        fundTargetYields: { '000001': 10 },
        theme: 'light',
        showIndexes: true
    };

    // 指数代码常量
    const INDEX_CODES = {
        SH000001: 'sh000001',  // 上证指数
        SZ399006: 'sz399006',  // 创业板指
        SH300: 'sh000300'      // 沪深300
    };

    // 鸡汤语录
    const HAPPY_QUOTES = [
        "别太得意，市场瞬息万变~",
        "今天赚了不代表明天也能赚哦！",
        "贪婪是最大的敌人，保持清醒！",
        "别高兴太早，要稳住！",
        "赚钱的时候最容易冲动，冷静！",
        "这只是开始，别骄傲！",
        "投资最忌讳得意忘形！",
        "好好攒钱，别太飘~",
        "小心市场风向随时转变！",
        "别忘了止盈，贪婪是大忌！"
    ];

    const SAD_QUOTES = [
        "别担心，市场总会回暖的！",
        "投资是一场马拉松，不是短跑~",
        "跌了才有机会买入，这是好事！",
        "放平心态，牛市总会来的！",
        "不要慌，股神也经历过无数次跌跌跌~",
        "越跌越要稳住，别做情绪的奴隶！",
        "这是一个绝佳的建仓机会！",
        "跌到谷底就是新的开始！",
        "市场总是周期性的，耐心等待！",
        "记住，别人恐惧我贪婪！"
    ];

    // 获取存储的配置
    let CONFIG = GM_getValue('fundMonitorConfig', DEFAULT_CONFIG);
        // 用户管理模块
const UserManager = {
    currentUser: null,

    init() {
        const savedUser = GM_getValue('currentUser', null);
        if (savedUser) {
            this.currentUser = savedUser;
            console.log('加载已保存的用户:', savedUser.username);
            this.loadConfigFromCloud();
        } else {
            console.log('未找到已保存的用户，需要登录');
        }
    },

    async login(username, password) {
        try {
            console.log('UserManager.login 开始执行，用户名:', username);
            console.log('尝试云端登录...');

            // 使用GM_xmlhttpRequest直接发送请求，绕过域名限制
            const loginResult = await this.cloudLogin(username, password);
            console.log('云端登录响应:', loginResult);

            if (loginResult && loginResult.objectId) {
                this.currentUser = {
                    username: loginResult.username,
                    objectId: loginResult.objectId,
                    sessionToken: loginResult.sessionToken,
                    authType: 'cloud'
                };
                console.log('设置当前用户:', this.currentUser);
                GM_setValue('currentUser', this.currentUser);

                // 优化：异步加载云端配置，不阻塞登录响应
                console.log('后台加载云端配置...');
                this.loadConfigFromCloud().then(() => {
                    console.log('云端配置加载完成');
                    // 配置加载完成后刷新数据
                    if (typeof refreshData === 'function') {
                        refreshData();
                    }
                }).catch(err => {
                    console.warn('云端配置加载失败，使用本地配置:', err);
                });

                console.log('云端登录成功:', username);
                return true;
            } else {
                console.log('云端登录失败：响应无效');
                return false;
            }
        } catch (error) {
            console.error('云端登录失败:', error);
            if (error.message.includes('101')) {
                throw new Error('用户名或密码错误');
            } else if (error.message.includes('网络')) {
                throw new Error('网络连接失败，请检查网络');
            } else {
                throw new Error(`登录失败: ${error.message}`);
            }
        }
    },

    // 使用GM_xmlhttpRequest直接调用LeanCloud API
    async cloudLogin(username, password) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://ccwzg7fj.lc-cn-n1-shared.com/1.1/login',
                headers: {
                    'X-LC-Id': 'CCWzG7FJFwkIMdR3rd9yhmMS-gzGzoHsz',
                    'X-LC-Key': 'k7iXfaAyZAbKhRddTrYEiNGm',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                timeout: 8000,  // 优化：设置8秒超时，避免长时间等待
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 200) {
                            resolve(data);
                        } else {
                            reject(new Error(data.error || '登录失败'));
                        }
                    } catch (error) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('登录请求超时（8秒），请检查网络'));
                }
            });
        });
    },

    async cloudRegister(username, password) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://ccwzg7fj.lc-cn-n1-shared.com/1.1/users',
                headers: {
                    'X-LC-Id': 'CCWzG7FJFwkIMdR3rd9yhmMS-gzGzoHsz',
                    'X-LC-Key': 'k7iXfaAyZAbKhRddTrYEiNGm',
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    username: username,
                    password: password
                }),
                timeout: 8000,  // 优化：设置8秒超时
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 201) {
                            resolve(data);
                        } else {
                            reject(new Error(data.error || '注册失败'));
                        }
                    } catch (error) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('注册请求超时（8秒），请检查网络'));
                }
            });
        });
    },

    async cloudSaveConfig(sessionToken, config, operationRecords = null) {
        return new Promise((resolve, reject) => {
            const saveData = {
                fundConfig: config
            };

            // 如果提供了操作记录，一起保存
            if (operationRecords !== null) {
                saveData.operationRecords = operationRecords;
            }

            GM_xmlhttpRequest({
                method: 'PUT',
                url: `https://ccwzg7fj.lc-cn-n1-shared.com/1.1/users/${this.currentUser.objectId}`,
                headers: {
                    'X-LC-Id': 'CCWzG7FJFwkIMdR3rd9yhmMS-gzGzoHsz',
                    'X-LC-Key': 'k7iXfaAyZAbKhRddTrYEiNGm',
                    'X-LC-Session': sessionToken,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(saveData),
                timeout: 8000,  // 优化：设置8秒超时
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            reject(new Error('保存失败'));
                        }
                    } catch (error) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('配置保存超时（8秒），请检查网络'));
                }
            });
        });
    },

    async cloudLoadConfig(sessionToken) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://ccwzg7fj.lc-cn-n1-shared.com/1.1/users/${this.currentUser.objectId}`,
                headers: {
                    'X-LC-Id': 'CCWzG7FJFwkIMdR3rd9yhmMS-gzGzoHsz',
                    'X-LC-Key': 'k7iXfaAyZAbKhRddTrYEiNGm',
                    'X-LC-Session': sessionToken,
                    'Content-Type': 'application/json'
                },
                timeout: 8000,  // 优化：设置8秒超时
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            reject(new Error('加载失败'));
                        }
                    } catch (error) {
                        reject(new Error('响应解析失败'));
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('配置加载超时（8秒），请检查网络'));
                }
            });
        });
    },

    async register(username, password) {
        try {
            console.log('尝试云端注册:', username);

            // 使用GM_xmlhttpRequest直接发送请求，绕过域名限制
            const registerResult = await this.cloudRegister(username, password);
            console.log('云端注册响应:', registerResult);

            if (registerResult && registerResult.objectId) {
                this.currentUser = {
                    username: registerResult.username,
                    objectId: registerResult.objectId,
                    sessionToken: registerResult.sessionToken,
                    authType: 'cloud'
                };
                GM_setValue('currentUser', this.currentUser);

                // 优化：异步保存配置和操作记录，不阻塞注册响应
                console.log('后台保存配置和操作记录到云端...');
                this.saveConfigToCloud(true).then(() => {
                    console.log('配置和操作记录已保存到云端');
                }).catch(err => {
                    console.warn('云端配置保存失败:', err);
                });

                console.log('云端注册成功:', username);
                return true;
            } else {
                console.log('云端注册失败：响应无效');
                return false;
            }
        } catch (error) {
            console.error('云端注册失败:', error);
            if (error.message.includes('already taken') || error.message.includes('202')) {
                throw new Error('用户名已存在，请选择其他用户名');
            } else if (error.message.includes('网络')) {
                throw new Error('网络连接失败，请检查网络');
            } else if (error.message.includes('password')) {
                throw new Error('用户名或密码格式不正确');
            } else {
                throw new Error(`注册失败: ${error.message}`);
            }
        }
    },

    logout() {
        this.currentUser = null;
        GM_deleteValue('currentUser');
    },

    async saveConfigToCloud(includeOperationRecords = false) {
        if (!this.currentUser || !this.currentUser.sessionToken) return;

        try {
            console.log('保存配置到云端...');
            const operationRecords = includeOperationRecords ? GM_getValue('operationRecords', []) : null;
            await this.cloudSaveConfig(this.currentUser.sessionToken, CONFIG, operationRecords);
            GM_setValue('lastSyncTime', new Date().getTime());

            GM_notification({
                title: '配置同步',
                text: includeOperationRecords ? '配置和操作记录已保存到云端' : '配置已保存到云端',
                timeout: 2000
            });
            console.log('配置保存成功');
        } catch (error) {
            console.error('保存配置到云端失败:', error);
            throw new Error('云端保存失败，请检查网络连接');
        }
    },

    async saveOperationRecordsToCloud() {
        if (!this.currentUser || !this.currentUser.sessionToken) return;

        try {
            console.log('保存操作记录到云端...');
            const operationRecords = GM_getValue('operationRecords', []);
            await this.cloudSaveConfig(this.currentUser.sessionToken, CONFIG, operationRecords);
            GM_setValue('lastSyncTime', new Date().getTime());
            console.log('操作记录保存成功');
        } catch (error) {
            console.error('保存操作记录到云端失败:', error);
            throw error;
        }
    },

    async loadConfigFromCloud() {
        if (!this.currentUser || !this.currentUser.sessionToken) return false;

        try {
            console.log('从云端加载配置...');
            const userData = await this.cloudLoadConfig(this.currentUser.sessionToken);
            console.log('云端配置数据:', userData);

            if (userData && userData.fundConfig) {
                CONFIG = userData.fundConfig;
                GM_setValue('fundMonitorConfig', CONFIG);

                // 同时加载操作记录
                if (userData.operationRecords) {
                    console.log('从云端加载操作记录...');
                    GM_setValue('operationRecords', userData.operationRecords);
                    console.log('操作记录加载成功，共', userData.operationRecords.length, '条');
                }

                GM_setValue('lastSyncTime', new Date().getTime());

                GM_notification({
                    title: '配置同步',
                    text: userData.operationRecords ? '已从云端加载最新配置和操作记录' : '已从云端加载最新配置',
                    timeout: 2000
                });

                console.log('配置加载成功');
                return true;
            } else {
                console.log('云端无配置数据');
                return false;
            }
        } catch (error) {
            console.error('从云端加载配置失败:', error);
            // 如果加载失败，不抛出错误，继续使用本地配置
            console.log('使用本地配置');
            return false;
        }
    }
};

    // 注册油猴菜单
    GM_registerMenuCommand('⚙️ 打开配置', showConfigPanel);
    GM_registerMenuCommand('📊 显示/隐藏面板', togglePanel);
    GM_registerMenuCommand('🌓 切换主题', toggleTheme);
    GM_registerMenuCommand('🚀 手动初始化面板', () => {
        console.log('手动初始化面板...');
        if (!document.getElementById('fund-monitor')) {
            init();
        } else {
            console.log('面板已存在');
        }
    });

    // 样式定义
 const styles = `
    .config-tabs {
        display: flex;
        margin-bottom: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .dark .config-tabs {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .config-tab-btn {
        padding: 8px 16px;
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
        color: #666;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
    }

    .dark .config-tab-btn {
        color: #999;
    }

    .config-tab-btn.active {
        color: #007AFF;
        border-bottom: 2px solid #007AFF;
    }

    .dark .config-tab-btn.active {
        color: #0A84FF;
        border-bottom: 2px solid #0A84FF;
    }

    .config-tab-content {
        display: none;
    }

    .config-tab-content.active {
        display: block;
    }

    .fund-chart-container {
        margin-top: 12px;
        height: 200px;
        background: rgba(0, 0, 0, 0.03);
        border-radius: 8px;
        overflow: hidden;
        position: relative;
    }

    .dark .fund-chart-container {
        background: rgba(255, 255, 255, 0.05);
    }

    .fund-chart-loading {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.7);
        z-index: 2;
    }

    .dark .fund-chart-loading {
        background: rgba(0, 0, 0, 0.7);
    }

    .fund-chart-toggle {
        display: inline-block;
        margin-top: 8px;
        font-size: 12px;
        color: #007AFF;
        cursor: pointer;
        user-select: none;
    }

    .dark .fund-chart-toggle {
        color: #0A84FF;
    }

    .fund-monitor-container {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.98);
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        z-index: 99999;
        width: 380px;
        height: 650px;
        max-height: 85vh;
        backdrop-filter: blur(10px);
        transition: background-color 0.3s ease;
        user-select: none;
        color: #333;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        /* 确保面板可见 */
        visibility: visible !important;
        opacity: 1 !important;
        display: flex !important;
    }

    .fund-monitor-container.dark {
        background: rgba(28, 28, 30, 0.95);
        color: #ffffff;
    }

    .fund-monitor-container.minimized {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        overflow: hidden;
        cursor: grab;
        position: fixed;
        transition: width 0.3s, height 0.3s, border-radius 0.3s;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        flex-direction: row;
    }

    .dark .fund-monitor-container.minimized {
        background: rgba(28, 28, 30, 0.95);
    }

    .fund-monitor-container.minimized:active {
        cursor: grabbing;
    }

    .fund-monitor-container.minimized .fund-monitor-header,
    .fund-monitor-container.minimized .fund-monitor-content,
    .fund-monitor-container.minimized .index-summary,
    .fund-monitor-container.minimized .quote-module,
    .fund-monitor-container.minimized .fund-summary {
        display: none;
    }

    .fund-monitor-container.minimized::after {
        content: '📊';
        font-size: 30px;
        pointer-events: none;
    }

    .fund-monitor-header {
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px 12px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(8px);
        flex-shrink: 0;
    }

    .fund-monitor-header:active {
        cursor: grabbing;
    }

    .dark .fund-monitor-header {
        background: rgba(28, 28, 30, 0.8);
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fund-monitor-title {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: #333;
    }

    .dark .fund-monitor-title {
        color: #fff;
    }

    .fund-monitor-controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }

    .fund-monitor-button {
        background: none;
        border: none;
        padding: 6px 12px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: #007AFF;
    }

    .dark .fund-monitor-button {
        color: #0A84FF;
    }

    .fund-monitor-button:hover {
        background: rgba(0, 122, 255, 0.1);
    }

    .fund-monitor-content {
        flex: 1;
        overflow-y: auto;
        padding: 0 16px 16px 16px;
        min-height: 0;
        max-height: 350px;
    }

    .fund-summary {
        padding: 16px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        background: rgba(0, 0, 0, 0.02);
        flex-shrink: 0;
    }

    .dark .fund-summary {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.02);
    }

    .summary-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
    }

    .summary-item {
        text-align: center;
    }

    .summary-label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
    }

    .dark .summary-label {
        color: #999;
    }

    .summary-value {
        font-size: 16px;
        font-weight: 500;
    }

    .index-summary {
        display: flex;
        flex-wrap: nowrap; /* 确保不换行 */
        gap: 6px;
        padding: 12px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        flex-shrink: 0;
        overflow-x: auto; /* 如果内容过宽，允许横向滚动 */
        overflow-y: visible;
        scrollbar-width: thin; /* Firefox */
    }

    /* 美化滚动条 */
    .index-summary::-webkit-scrollbar {
        height: 4px;
    }

    .index-summary::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 2px;
    }

    .index-summary::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 2px;
    }

    .dark .index-summary::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
    }

    .dark .index-summary::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
    }

    .dark .index-summary {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fund-item {
        padding: 12px 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        margin-bottom: 8px;
    }

    .dark .fund-item {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fund-item:last-child {
        border-bottom: none;
        margin-bottom: 0;
    }

    .fund-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
    }

    .fund-name {
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .fund-code {
        color: #666;
        font-size: 12px;
    }

    .dark .fund-code {
        color: #999;
    }

    .fund-data {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-top: 8px;
    }

    .fund-data-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 4px 0;
        font-size: 13px;
    }

    .fund-data-label {
        color: #666;
        font-size: 13px;
    }

    .dark .fund-data-label {
        color: #999;
    }

    .value-up {
        color: #FF3B30;
    }

    .value-down {
        color: #34C759;
    }

    .config-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 100000;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .config-panel {
        background: white;
        border-radius: 12px;
        padding: 24px;
        width: 400px;
        max-width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        color: #333;
    }

    .dark .config-panel {
        background: #1c1c1e;  // 修改背景色为深色
        color: #ccc;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .config-item {
        margin-bottom: 16px;
    }

    .config-label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        color: #333;
    }

    .dark .config-label {
        color: #ccc;
    }

    .config-input {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 6px;
        font-size: 14px;
        background: white;
        color: #333;
    }

    .dark .config-input {
        background: #2c2c2e;
        border-color: rgba(255, 255, 255, 0.1);
        color: #ccc;
    }

    select.config-input {
        background-color: white;
        color: #333;
    }

    .dark select.config-input {
        background-color: #2c2c2e;
        color: #ccc;
    }

    .config-button {
        background: #007AFF;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .config-button:hover {
        background: #0051FF;
    }

.dark .config-button[style*="background: #666"] {
        background: #3a3a3c !important;
        color: #ccc;
    }
    select.config-input {
        background-color: white;
        color: #333;
    }

    .dark select.config-input {
        background-color: #2c2c2e;
        color: #ccc;
    }

    .config-sync-status {
        margin-top: 16px;
        font-size: 12px;
        color: #666;
    }

    .dark .config-sync-status {
        color: #999;
    }

    .config-sub-item label {
        color: #333;
    }

    .dark .config-sub-item label {
        color: #ccc;
    }

    .index-card {
        background: rgba(0, 0, 0, 0.03);
        border-radius: 6px;
        padding: 8px;
        color: #333;
        min-width: 110px; /* 确保每个卡片有最小宽度 */
        flex: 1; /* 让卡片平均分配空间 */
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        box-sizing: border-box;
    }

    .dark .index-card {
        background: rgba(255, 255, 255, 0.05);
        color: #ccc;
    }

    .index-name {
        font-size: 12px;
        margin-bottom: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #333;
        white-space: nowrap; /* 防止换行 */
    }

    .dark .index-name {
        color: #ccc;
    }

    .index-value {
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 2px;
        color: #333;
    }

    .dark .index-value {
        color: #ccc;
    }

    .index-change {
        font-size: 13px;
    }

    .index-rating {
        margin-top: 4px;
        text-align: center;
        font-size: 10px;
        color: #666;
    }

    .dark .index-rating {
        color: #999;
    }

    .index-rating .rating-stars {
        font-size: 14px;
        line-height: 1.2;
    }

    .quote-module {
        padding: 12px 16px;
        text-align: center;
        font-size: 13px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        color: #666;
        flex-shrink: 0;
        background: rgba(0, 0, 0, 0.02);
    }

    .dark .quote-module {
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        color: #999;
    }

    /* 滚动条样式 */
    .fund-monitor-content::-webkit-scrollbar,
    .config-panel::-webkit-scrollbar {
        width: 8px;
    }

    .fund-monitor-content::-webkit-scrollbar-track,
    .config-panel::-webkit-scrollbar-track {
        background: transparent;
    }

    .fund-monitor-content::-webkit-scrollbar-thumb,
    .config-panel::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
    }

    .dark .fund-monitor-content::-webkit-scrollbar-thumb,
    .dark .config-panel::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.1);
    }

    /* 加载状态样式 */
    .summary-loading {
        text-align: center;
        padding: 8px;
        color: #666;
    }

    .loading {
    opacity: 0.6;
    transition: opacity 0.3s ease;
}

    .dark .summary-loading {
        color: #999;
    }

    /* 星级面板样式 */
    .star-section {
        margin-bottom: 15px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.02);
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .dark .star-section {
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .star-section h4 {
        margin: 0 0 10px 0;
        font-size: 14px;
        font-weight: 600;
        color: #333;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        padding-bottom: 5px;
    }

    .dark .star-section h4 {
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .rating-display, .suggestions-display, .percentiles-display, .sentiment-display {
        min-height: 60px;
    }

    .loading, .error, .no-data {
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
    }

    .dark .loading, .dark .no-data {
        color: #999;
    }

    .error {
        color: #ff3b30;
    }

    /* 投资星级样式 */
    .rating-card {
        text-align: center;
        padding: 15px;
    }

    .rating-stars {
        font-size: 24px;
        margin-bottom: 8px;
    }

    .rating-text {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 5px;
        color: #333;
    }

    .dark .rating-text {
        color: #fff;
    }

    .rating-advice {
        font-size: 12px;
        color: #666;
        margin-bottom: 8px;
    }

    .dark .rating-advice {
        color: #999;
    }

    .rating-score {
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }

    .dark .rating-score {
        color: #fff;
    }

    /* 基金建议样式 */
    .fund-suggestion-card {
        margin-bottom: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .dark .fund-suggestion-card {
        background: rgba(28, 28, 30, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .fund-suggestion-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .fund-suggestion-header .fund-name {
        font-weight: 600;
        font-size: 13px;
        color: #333;
    }

    .dark .fund-suggestion-header .fund-name {
        color: #fff;
    }

    .fund-suggestion-header .fund-code {
        font-size: 11px;
        color: #666;
    }

    .dark .fund-suggestion-header .fund-code {
        color: #999;
    }

    .suggestion-content {
        font-size: 12px;
    }

    .suggestion-action {
        font-weight: 600;
        margin-bottom: 4px;
        padding: 2px 6px;
        border-radius: 3px;
        display: inline-block;
    }

    .action-buy { background: #e8f5e8; color: #34c759; }
    .action-sell { background: #ffe8e8; color: #ff3b30; }
    .action-watch { background: #e8f0ff; color: #007aff; }
    .action-caution { background: #fff3e8; color: #ff9500; }
    .action-hold { background: #f0f0f0; color: #666; }

    .suggestion-reason {
        color: #666;
        font-size: 11px;
    }

    .dark .suggestion-reason {
        color: #999;
    }

    /* 分位数样式 */
    .percentile-card {
        margin-bottom: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .dark .percentile-card {
        background: rgba(28, 28, 30, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .percentile-header {
        font-weight: 600;
        margin-bottom: 8px;
        font-size: 13px;
        color: #333;
    }

    .dark .percentile-header {
        color: #fff;
    }

    .percentile-data {
        font-size: 12px;
    }

    .percentile-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
        color: #333;
    }

    .dark .percentile-item {
        color: #fff;
    }

    .percentile-low { color: #34c759; font-weight: 600; }
    .percentile-medium-low { color: #8cc8ff; font-weight: 600; }
    .percentile-medium { color: #ffb800; font-weight: 600; }
    .percentile-medium-high { color: #ff9500; font-weight: 600; }
    .percentile-high { color: #ff3b30; font-weight: 600; }

    .percentile-advice {
        margin-top: 6px;
        font-size: 11px;
        color: #666;
        font-style: italic;
    }

    .dark .percentile-advice {
        color: #999;
    }

    /* 市场情绪样式 */
    .sentiment-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
    }

    .sentiment-card {
        text-align: center;
        padding: 12px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.1);
    }

    .dark .sentiment-card {
        background: rgba(28, 28, 30, 0.8);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .sentiment-title {
        font-size: 11px;
        color: #666;
        margin-bottom: 6px;
    }

    .dark .sentiment-title {
        color: #999;
    }

    .sentiment-value {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 4px;
    }

    .sentiment-label {
        font-size: 10px;
        color: #666;
    }

    .dark .sentiment-label {
        color: #999;
    }

    /* 恐慌贪婪指数颜色 */
    .fear-extreme { color: #ff3b30; }
    .fear { color: #ff9500; }
    .neutral { color: #ffb800; }
    .greed { color: #8cc8ff; }
    .greed-extreme { color: #34c759; }

    /* 巴菲特指标颜色 */
    .undervalued { color: #34c759; }
    .fair { color: #8cc8ff; }
    .overvalued { color: #ff9500; }
    .highly-overvalued { color: #ff3b30; }

    /* 市场温度颜色 */
    .temp-freezing { color: #007aff; }
    .temp-cold { color: #8cc8ff; }
    .temp-normal { color: #ffb800; }
    .temp-warm { color: #ff9500; }
    .temp-hot { color: #ff3b30; }
`;
        // 注入样式
    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
    }

    // 获取基金数据
    function getFundData(fundCode) {
        return new Promise((resolve, reject) => {
            const url = `https://fundgz.1234567.com.cn/js/${fundCode}.js?rt=${new Date().getTime()}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const jsonStr = response.responseText.match(/\{.*\}/);
                        if (jsonStr) {
                            const data = JSON.parse(jsonStr[0]);
                            resolve(data);
                        } else {
                            reject(new Error('数据格式错误'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('请求超时'))
            });
        });
    }

    // 获取当前日期字符串
    function getCurrentDateString() {
        const now = new Date();
        // 清除可能的缓存，强制使用当前时间
        return now.toISOString().split('T')[0];
    }

    // 获取基金历史数据（近一年）
    function getFundHistoryData(fundCode) {
        return new Promise((resolve, reject) => {
            // 生成模拟数据，解决跨域问题
            console.log(`生成基金${fundCode}的模拟历史数据`);

            // 计算一年前的日期
            const now = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);

            // 生成365天的模拟数据
            const historyData = [];
            const baseNav = 1 + Math.random() * 2; // 基准净值，随机1-3之间
            let currentDate = new Date(oneYearAgo);
            let currentNav = baseNav;

            // 尝试获取当前基金的实时数据作为最终点
            getFundData(fundCode)
                .then(realTimeData => {
                    const realTimeNav = parseFloat(realTimeData.gsz) || baseNav;
                    const days = Math.floor((now - oneYearAgo) / (24 * 60 * 60 * 1000));

                    // 生成从一年前到现在的数据点
                    for (let i = 0; i <= days; i++) {
                        // 模拟每日涨跌幅度，波动范围在-2%到2%之间
                        const dailyChange = (Math.random() * 4 - 2) / 100;

                        // 添加一些波动趋势，使得数据看起来更自然
                        const trendFactor = Math.sin(i / 30) * 0.005;

                        // 计算当天净值
                        currentNav = currentNav * (1 + dailyChange + trendFactor);

                        // 当天日期字符串
                        const dateStr = currentDate.toISOString().split('T')[0];

                        // 每7天添加一个数据点（工作日）
                        if (i % 7 !== 0 && i % 7 !== 6) { // 跳过周六周日
                            historyData.push({
                                date: dateStr,
                                nav: parseFloat(currentNav.toFixed(4)),
                                changePercent: parseFloat((dailyChange * 100).toFixed(2))
                            });
                        }

                        // 增加一天
                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    // 确保最后一个点的净值接近实时净值
                    if (historyData.length > 0) {
                        const lastIndex = historyData.length - 1;
                        const secondLastNav = historyData[lastIndex - 1]?.nav || realTimeNav * 0.99;
                        const lastChangePercent = ((realTimeNav - secondLastNav) / secondLastNav) * 100;
                        const currentDate = getCurrentDateString(); // 使用新的日期函数

                        historyData[lastIndex] = {
                            date: currentDate, // 确保使用当前日期
                            nav: realTimeNav,
                            changePercent: parseFloat(lastChangePercent.toFixed(2))
                        };
                    }

                    resolve(historyData);
                })
                .catch(error => {
                    console.error('获取实时数据失败，使用完全模拟数据:', error);

                    // 如果获取实时数据失败，则使用完全模拟数据
                    const days = Math.floor((now - oneYearAgo) / (24 * 60 * 60 * 1000));

                    for (let i = 0; i <= days; i++) {
                        const dailyChange = (Math.random() * 4 - 2) / 100;
                        const trendFactor = Math.sin(i / 30) * 0.005;
                        currentNav = currentNav * (1 + dailyChange + trendFactor);

                        const dateStr = currentDate.toISOString().split('T')[0];

                        if (i % 7 !== 0 && i % 7 !== 6) {
                            historyData.push({
                                date: dateStr,
                                nav: parseFloat(currentNav.toFixed(4)),
                                changePercent: parseFloat((dailyChange * 100).toFixed(2))
                            });
                        }

                        currentDate.setDate(currentDate.getDate() + 1);
                    }

                    resolve(historyData);
                });
        });
    }

    // 获取指数数据
    function getIndexData(indexCode) {
        return new Promise((resolve, reject) => {
            const url = `https://qt.gtimg.cn/q=s_${indexCode}`;
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                timeout: 10000,
                onload: function(response) {
                    try {
                        const data = response.responseText.split('~');
                        if (data.length >= 4) {
                            resolve({
                                name: data[1],
                                value: parseFloat(data[3]),
                                change: parseFloat(data[4]),
                                changePercent: parseFloat(data[5])
                            });
                        } else {
                            reject(new Error('数据格式错误'));
                        }
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('请求超时'))
            });
        });
    }

    // 获取热门指数实时估值数据
    async function getPopularIndexValuation() {
        return new Promise((resolve, reject) => {
            // 热门指数代码
            const indices = [
                { code: '1.000001', name: '上证指数' },
                { code: '0.399001', name: '深证成指' },
                { code: '0.399006', name: '创业板指' },
                { code: '1.000300', name: '沪深300' },
                { code: '1.000016', name: '上证50' },
                { code: '1.000905', name: '中证500' },
                { code: '1.000852', name: '中证1000' },
                { code: '0.399102', name: '创业板综' },
                { code: '1.000688', name: '科创50' }
            ];

            const secids = indices.map(idx => idx.code).join(',');

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=${secids}&fields=f2,f3,f4,f5,f6,f12,f13,f14,f15,f16,f17,f18,f152,f153`,
                timeout: 5000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.data && data.data.diff) {
                            const results = data.data.diff.map((item, index) => {
                                return {
                                    name: indices[index].name,
                                    code: item.f12,
                                    price: parseFloat(item.f2) || 0,      // 最新价
                                    change: parseFloat(item.f3) || 0,     // 涨跌幅
                                    changeAmount: parseFloat(item.f4) || 0, // 涨跌额
                                    high: parseFloat(item.f15) || 0,      // 最高
                                    low: parseFloat(item.f16) || 0,       // 最低
                                    open: parseFloat(item.f17) || 0,      // 今开
                                    preClose: parseFloat(item.f18) || 0   // 昨收
                                };
                            });

                            resolve(results);
                        } else {
                            reject(new Error('数据格式错误'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 获取A股市场波动率指数（类VIX计算）
    async function getChinaVIXIndex() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://push2.eastmoney.com/api/qt/ulist.np/get?fltt=2&secids=1.000001,0.399001,0.399006,1.000300&fields=f2,f3,f4,f5,f6,f12,f14,f15,f16,f17,f18',
                timeout: 5000,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data && data.data && data.data.diff) {
                            // 收集指数数据
                            let totalVolatility = 0;
                            let avgChange = 0;
                            let upCount = 0;
                            let downCount = 0;
                            let totalCount = data.data.diff.length;

                            data.data.diff.forEach(item => {
                                const change = parseFloat(item.f3) || 0; // f3 涨跌幅
                                const high = parseFloat(item.f15) || 0;   // f15 最高
                                const low = parseFloat(item.f16) || 0;    // f16 最低
                                const currentPrice = parseFloat(item.f2) || 0; // f2 最新价

                                // 计算当日波动率 = (最高-最低) / 最新价 * 100
                                if (currentPrice > 0) {
                                    const dayVolatility = ((high - low) / currentPrice) * 100;
                                    totalVolatility += dayVolatility;
                                }

                                avgChange += change;
                                if (change > 0) upCount++;
                                else if (change < 0) downCount++;
                            });

                            // 平均波动率
                            const avgVolatility = totalVolatility / totalCount;
                            avgChange = avgChange / totalCount;
                            const upRatio = (upCount / totalCount) * 100;

                            // 参考VIX逻辑计算中国恐慌指数
                            // VIX核心：波动率预期 + 市场方向 + 不确定性
                            let chinaVIX = 20; // 基准值20（对应VIX长期均值）

                            // 1. 波动率因子（权重最大）
                            // 日内波动率每增加1%，VIX增加5点
                            chinaVIX += (avgVolatility - 2) * 5;

                            // 2. 跌幅放大因子（下跌时恐慌加剧）
                            if (avgChange < 0) {
                                // 下跌时，跌幅越大，恐慌越强
                                chinaVIX += Math.abs(avgChange) * 8;
                            } else {
                                // 上涨时，涨幅对恐慌的影响较小
                                chinaVIX -= avgChange * 3;
                            }

                            // 3. 市场分化因子（分化越大，不确定性越高）
                            const divergence = Math.abs(upRatio - 50);
                            if (divergence < 10) {
                                // 高度分化（接近50:50）= 高不确定性
                                chinaVIX += 5;
                            }

                            // 限制范围 [0, 100]
                            chinaVIX = Math.max(0, Math.min(100, chinaVIX));

                            // 转换为恐慌贪婪指数（VIX越高越恐慌，我们转为0-100，0=极度恐慌，100=极度贪婪）
                            const fearGreedIndex = 100 - chinaVIX;

                            resolve({
                                vix: Math.round(chinaVIX),
                                fearGreedIndex: Math.round(fearGreedIndex),
                                avgChange: avgChange.toFixed(2),
                                avgVolatility: avgVolatility.toFixed(2),
                                upRatio: upRatio.toFixed(1),
                                totalCount: totalCount,
                                source: 'eastmoney_vix'
                            });
                        } else {
                            reject(new Error('数据格式错误'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function() {
                    reject(new Error('网络请求失败'));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 获取市场整体情况
    async function getMarketSentiment() {
        const indexCodes = [INDEX_CODES.SH000001, INDEX_CODES.SZ399006, INDEX_CODES.SH300];
        let totalChange = 0;
        let count = 0;

        for (const code of indexCodes) {
            try {
                const data = await getIndexData(code);
                totalChange += data.changePercent;
                count++;
            } catch (error) {
                console.error(`获取指数${code}数据失败:`, error);
            }
        }

        return count > 0 ? totalChange / count : 0;
    }

    // 获取指数评级
    function getIndexRating(changePercent) {
        if (changePercent <= -2) return { stars: "★☆☆☆☆", text: "极度悲观", advice: "可以考虑分批建仓", color: "#34C759" };
        if (changePercent <= -1) return { stars: "★★☆☆☆", text: "偏向悲观", advice: "适合观望", color: "#34C759" };
        if (changePercent < 1) return { stars: "★★★☆☆", text: "市场平稳", advice: "保持均衡", color: "#FFB800" };
        if (changePercent < 2) return { stars: "★★★★☆", text: "偏向乐观", advice: "注意风险", color: "#FF3B30" };
        return { stars: "★★★★★", text: "极度乐观", advice: "谨防回调", color: "#FF3B30" };
    }
        // 创建指数卡片
    function createIndexCard(index) {
        const card = document.createElement('div');
        card.className = 'index-card';

        const rating = getIndexRating(index.changePercent);

        card.innerHTML = `
            <div class="index-name">
                ${index.name}
                <span class="emotion-icon" data-change="${index.changePercent}">
                    ${index.changePercent >= 0 ? '😄' : '😢'}
                </span>
            </div>
            <div class="index-value">${index.value}</div>
            <div class="index-change ${index.changePercent >= 0 ? 'value-up' : 'value-down'}">
                ${index.changePercent >= 0 ? '+' : ''}${index.changePercent}%
            </div>
            <div class="index-rating">
                <div class="rating-stars" style="color: ${rating.color};">${rating.stars}</div>
                <div style="font-size: 10px; margin-top: 2px; line-height: 1.3;">${rating.text}</div>
                <div style="font-size: 9px; color: #666; margin-top: 1px; line-height: 1.2;">${rating.advice}</div>
            </div>
        `;

        return card;
    }

    // 创建基金项目
    // 创建基金项目
    function createFundItem(fund) {
        const gszzl = parseFloat(fund.gszzl);
        const share = CONFIG.fundShares[fund.fundcode] || 0;
        const costPrice = CONFIG.costPrices[fund.fundcode] || 0;
        const targetYield = CONFIG.fundTargetYields[fund.fundcode] || 10;
        const currentPrice = parseFloat(fund.gsz);
        const totalCost = share * costPrice;
        const totalValue = share * currentPrice;
        const profitLoss = totalValue - totalCost;
        const currentYield = costPrice !== 0 ? (profitLoss / totalCost) * 100 : 0;

        // 计算补仓金额
        let topUpAmount = 0;
        if (currentPrice < costPrice) {
            // 计算需要补仓多少份额才能使得新的平均成本等于当前价格
            const newShare = (totalCost - (share * currentPrice)) / (costPrice - currentPrice);
            topUpAmount = newShare * currentPrice;
        }

        const item = document.createElement('div');
        item.className = 'fund-item';
        item.setAttribute('data-fundcode', fund.fundcode);

        item.innerHTML = `
            <div class="fund-item-header">
                <div class="fund-name">
                    ${fund.name}
                    <span class="fund-code">${fund.fundcode}</span>
                </div>
                <span class="emotion-icon" data-change="${gszzl}">
                    ${gszzl >= 0 ? '😄' : '😢'}
                </span>
            </div>
            <div class="fund-data">
                <div class="fund-data-item">
                    <span class="fund-data-label">估算净值</span>
                    <span>${fund.gsz}</span>
                </div>
                <div class="fund-data-item">
                    <span class="fund-data-label">估算涨跌</span>
                    <span class="${gszzl >= 0 ? 'value-up' : 'value-down'}">
                        ${gszzl >= 0 ? '+' : ''}${gszzl}%
                    </span>
                </div>
                <div class="fund-data-item">
                    <span class="fund-data-label">持仓金额</span>
                    <span>${totalValue.toFixed(2)}</span>
                </div>
                <div class="fund-data-item">
                    <span class="fund-data-label">持仓收益</span>
                    <span class="${profitLoss >= 0 ? 'value-up' : 'value-down'}">
                        ${profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                    </span>
                </div>
                <div class="fund-data-item">
                    <span class="fund-data-label">收益率</span>
                    <span class="${currentYield >= 0 ? 'value-up' : 'value-down'}">
                        ${currentYield >= 0 ? '+' : ''}${currentYield.toFixed(2)}%
                    </span>
                </div>
                <div class="fund-data-item">
                    <span class="fund-data-label">持仓成本</span>
                    <span>${costPrice}</span>
                </div>
                <div class="fund-data-item">
                    <span class="fund-data-label">目标收益率</span>
                    <span>${targetYield}%</span>
                </div>
                ${topUpAmount > 0 ? `
                <div class="fund-data-item" style="grid-column: 1 / -1; margin-top: 8px;">
                    <span class="fund-data-label">补仓建议</span>
                    <span class="value-down">补仓 ${topUpAmount.toFixed(2)} 元可使成本降至当前价格</span>
                </div>
                ` : ''}
            </div>
            <div class="fund-chart-toggle">点击查看走势图 ▼</div>
            <div class="fund-chart-container" style="display: none;">
                <div class="fund-chart-loading">加载中...</div>
                <canvas id="chart-${fund.fundcode}" width="100%" height="200"></canvas>
            </div>
        `;

        // 添加点击事件，显示/隐藏走势图
        const chartToggle = item.querySelector('.fund-chart-toggle');
        const chartContainer = item.querySelector('.fund-chart-container');

        chartToggle.addEventListener('click', async () => {
            const isHidden = chartContainer.style.display === 'none';

            if (isHidden) {
                // 显示图表
                chartContainer.style.display = 'block';
                chartToggle.textContent = '隐藏走势图 ▲';

                // 加载历史数据并绘制图表
                try {
                    const historyData = await getFundHistoryData(fund.fundcode);
                    drawFundChart(fund.fundcode, historyData);
                    chartContainer.querySelector('.fund-chart-loading').style.display = 'none';
                } catch (error) {
                    console.error('加载基金历史数据失败:', error);
                    chartContainer.querySelector('.fund-chart-loading').textContent = '加载失败，请重试';
                }
            } else {
                // 隐藏图表
                chartContainer.style.display = 'none';
                chartToggle.textContent = '点击查看走势图 ▼';
            }
        });

        return item;
    }
    // 创建主面板
function createMainPanel() {
    const container = document.createElement('div');
    container.className = `fund-monitor-container ${CONFIG.theme}`;
    container.id = 'fund-monitor';

    // 计算总览数据
    let totalValue = 0;
    let totalCost = 0;
    let totalProfit = 0;

    // 创建总览面板
    const summaryPanel = document.createElement('div');
    summaryPanel.className = 'fund-summary';
    summaryPanel.innerHTML = `
        <div class="summary-loading">加载中...</div>
    `;

    // 更新总览信息的函数
    async function updateSummary() {
        // 获取所有基金数据
        const fundDataMap = new Map();
        let totalValue = 0;
        let totalCost = 0;
        let maxHistoryValue = parseFloat(localStorage.getItem('maxHistoryValue') || '0');

        for (const code of CONFIG.fundCodes) {
            try {
                const fundData = await getFundData(code);
                fundDataMap.set(code, fundData);

                const share = CONFIG.fundShares[code] || 0;
                const costPrice = CONFIG.costPrices[code] || 0;

                const currentValue = share * parseFloat(fundData.gsz);
                const cost = share * costPrice;

                totalValue += currentValue;
                totalCost += cost;
            } catch (error) {
                console.error(`获取基金${code}数据失败:`, error);
            }
        }

        // 更新历史最高市值
        if (totalValue > maxHistoryValue) {
            maxHistoryValue = totalValue;
            localStorage.setItem('maxHistoryValue', maxHistoryValue.toString());
        }

        const totalProfit = totalValue - totalCost;
        const totalYield = totalCost !== 0 ? (totalProfit / totalCost * 100) : 0;

        const newSummaryHtml = `
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="summary-label">持仓总额</div>
                    <div class="summary-value">¥${totalValue.toFixed(2)}</div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">总收益</div>
                    <div class="summary-value ${totalProfit >= 0 ? 'value-up' : 'value-down'}">
                        ${totalProfit >= 0 ? '+' : ''}¥${totalProfit.toFixed(2)}
                    </div>
                </div>
                <div class="summary-item">
                    <div class="summary-label">总收益率</div>
                    <div class="summary-value ${totalYield >= 0 ? 'value-up' : 'value-down'}">
                        ${totalYield >= 0 ? '+' : ''}${totalYield.toFixed(2)}%
                    </div>
                </div>
            </div>
        `;

        // 使用 requestAnimationFrame 优化 DOM 更新
        requestAnimationFrame(() => {
            summaryPanel.innerHTML = newSummaryHtml;
        });
    }

    // 创建头部
    const header = document.createElement('div');
    header.className = 'fund-monitor-header';
    header.innerHTML = `
        <h3 class="fund-monitor-title">基金监控</h3>
        <div class="fund-monitor-controls">
            ${UserManager.currentUser ?
                `<div style="display: flex; align-items: center; gap: 8px;">
                    <span>👤 ${UserManager.currentUser.username}</span>
                    <button class="fund-monitor-button" id="fund-monitor-logout" style="font-size: 12px; padding: 4px 8px;">退出</button>
                </div>` :
                '<button class="fund-monitor-button" id="fund-monitor-login">登录</button>'
            }
            <button class="fund-monitor-button" id="fund-monitor-star">星级</button>
            <button class="fund-monitor-button" id="fund-monitor-config">设置</button>
            <button class="fund-monitor-button" id="fund-monitor-refresh">刷新</button>
            <button class="fund-monitor-button" id="fund-monitor-minimize">−</button>
        </div>
    `;

    // 添加到容器
    container.appendChild(header);
    container.appendChild(summaryPanel);

    if (CONFIG.showIndexes) {
        const indexSummary = document.createElement('div');
        indexSummary.className = 'index-summary';
        container.appendChild(indexSummary);
    }

    const content = document.createElement('div');
    content.className = 'fund-monitor-content';
    container.appendChild(content);

    const quoteModule = document.createElement('div');
    quoteModule.className = 'quote-module';
    container.appendChild(quoteModule);

    // 绑定事件
    header.querySelector('#fund-monitor-config').onclick = showConfigPanel;
    header.querySelector('#fund-monitor-refresh').onclick = () => {
        refreshData();
        updateSummary();
    };
    header.querySelector('#fund-monitor-minimize').onclick = togglePanel;

    const loginBtn = header.querySelector('#fund-monitor-login');
    if (loginBtn) {
        loginBtn.onclick = showLoginPanel;
    }

    const logoutBtn = header.querySelector('#fund-monitor-logout');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            UserManager.logout();
            refreshMainPanel();
            // 使用 GM_notification 替代 alert
            GM_notification({
                title: '基金监控',
                text: '已退出登录',
                timeout: 2000
            });
        };
    }

    const starBtn = header.querySelector('#fund-monitor-star');
    if (starBtn) {
        starBtn.addEventListener('click', showStarPanel);
        console.log('星级按钮事件已绑定');
    } else {
        console.error('未找到星级按钮');
    }

    makeDraggableMainPanel(container, header);

    // 初始更新总览
    updateSummary();

    return container;
}
// 创建配置面板
function createConfigPanel() {
    const overlay = document.createElement('div');
    overlay.className = 'config-overlay';

    const panel = document.createElement('div');
    panel.className = `config-panel ${CONFIG.theme}`;

    // 修改基金列表的创建方式，添加基金名称显示
    const fundListHtml = CONFIG.fundCodes.map(code => {
        const fundName = GM_getValue(`fundName_${code}`, code);
        return `<option value="${code}">${fundName} (${code})</option>`;
    }).join('');

    // 获取第一个基金的配置用于初始显示
    const firstFundCode = CONFIG.fundCodes[0];
    const initialShare = CONFIG.fundShares[firstFundCode] || 0;
    const initialCost = CONFIG.costPrices[firstFundCode] || 0;
    const initialTarget = CONFIG.fundTargetYields[firstFundCode] || 10;

    // 获取同步状态
    const lastSyncTime = GM_getValue('lastSyncTime', null);
    const syncStatus = lastSyncTime ?
        `最后同步时间: ${new Date(lastSyncTime).toLocaleString()}` :
        '未同步';

    // 将现有基金信息转换为文本形式，用于批量编辑
    const existingFundsText = CONFIG.fundCodes.map(code => {
        const share = CONFIG.fundShares[code] || 0;
        const cost = CONFIG.costPrices[code] || 0;
        const target = CONFIG.fundTargetYields[code] || 10;
        return `${code},${share},${cost},${target}`;
    }).join('\n');

    panel.innerHTML = `
        <div class="config-tabs">
            <button class="config-tab-btn active" data-tab="single">单个编辑</button>
            <button class="config-tab-btn" data-tab="batch">批量编辑</button>
        </div>

        <div id="single-edit-tab" class="config-tab-content active">
            <div class="config-item">
                <label class="config-label">选择基金</label>
                <select id="config-fund-selector" class="config-input">
                    ${fundListHtml}
                    <option value="new">+ 添加新基金</option>
                </select>
            </div>
            <div id="fund-config-form">
                <div class="config-item">
                    <label class="config-label">基金代码</label>
                    <input type="text" id="config-fund-code" class="config-input" value="${firstFundCode}" />
                </div>
                <div class="config-item">
                    <label class="config-label">持仓份额</label>
                    <input type="number" id="config-fund-share" class="config-input" step="0.01" value="${initialShare}" />
                </div>
                <div class="config-item">
                    <label class="config-label">成本价格</label>
                    <input type="number" id="config-cost-price" class="config-input" step="0.0001" value="${initialCost}" />
                </div>
                <div class="config-item">
                    <label class="config-label">目标收益率（%）</label>
                    <input type="number" id="config-fund-target-yield" class="config-input" step="0.1" value="${initialTarget}" />
                </div>
                <div class="config-item">
                    <button class="config-button" id="config-delete-fund" style="background: #FF3B30;">删除此基金</button>
                </div>
            </div>
        </div>

        <div id="batch-edit-tab" class="config-tab-content">
            <div class="config-item">
                <label class="config-label">批量编辑基金</label>
                <textarea id="batch-fund-codes" class="config-input" style="height: 150px; font-family: monospace;">${existingFundsText}</textarea>
                <div style="margin-top: 8px; font-size: 12px; color: #666;">
                    格式说明：每行一个基金，格式为：<b>基金代码,持有份额,成本价格,目标收益率</b>
                </div>
                <div style="margin-top: 4px; font-size: 12px; color: #666;">
                    示例：000001,1000,1.2345,10
                </div>
            </div>
        </div>
        <div class="config-item">
            <label class="config-label">全局设置</label>
            <div style="margin-top: 8px;">
                <div class="config-sub-item">
                    <label class="config-label">涨跌提醒阈值（%）</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="number" id="config-rise-threshold" class="config-input" value="${CONFIG.threshold.rise}" placeholder="上涨" />
                        <input type="number" id="config-fall-threshold" class="config-input" value="${CONFIG.threshold.fall}" placeholder="下跌" />
                    </div>
                </div>
                <div class="config-sub-item">
                    <label class="config-label">刷新间隔（秒）</label>
                    <input type="number" id="config-refresh-interval" class="config-input" value="${CONFIG.refreshInterval / 1000}" />
                </div>
                <div class="config-sub-item">
                    <label class="config-label">
                        <input type="checkbox" id="config-show-indexes" ${CONFIG.showIndexes ? 'checked' : ''} />
                        显示大盘指数
                    </label>
                </div>
            </div>
        </div>
        ${UserManager.currentUser ? `
            <div style="margin-top: 16px; font-size: 12px; color: #666;">
                <div>当前用户: ${UserManager.currentUser.username}</div>
                <div>同步状态: ${syncStatus}</div>
            </div>
        ` : ''}
        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 24px;">
            <button class="config-button" id="config-cancel" style="background: #666;">取消</button>
            <button class="config-button" id="config-save">保存</button>
        </div>

        <!-- 添加说明信息 -->
                    <div style="margin-top: 16px; padding: 12px; background: rgba(0, 122, 255, 0.1); border-radius: 8px; font-size: 12px;">
            <div style="font-weight: 500; margin-bottom: 4px;">新功能说明：</div>
            <div>1. 批量编辑：可以一次性添加多个基金，格式为“基金代码,持有份额,成本价格,目标收益率”</div>
            <div>2. 走势图：点击基金项下方的“点击查看走势图”可以查看模拟走势</div>
        </div>
    `;

    setupConfigPanelEvents(panel);
    overlay.appendChild(panel);
    return overlay;
}

// 设置配置面板事件
function setupConfigPanelEvents(panel) {
    const fundSelector = panel.querySelector('#config-fund-selector');
    const fundForm = panel.querySelector('#fund-config-form');
    const deleteBtn = panel.querySelector('#config-delete-fund');

    fundSelector.addEventListener('change', async (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === 'new') {
            panel.querySelector('#config-fund-code').value = '';
            panel.querySelector('#config-fund-share').value = '';
            panel.querySelector('#config-cost-price').value = '';
            panel.querySelector('#config-fund-target-yield').value = '10';
            deleteBtn.style.display = 'none';
        } else {
            panel.querySelector('#config-fund-code').value = selectedValue;
            panel.querySelector('#config-fund-share').value = CONFIG.fundShares[selectedValue] || 0;
            panel.querySelector('#config-cost-price').value = CONFIG.costPrices[selectedValue] || 0;
            panel.querySelector('#config-fund-target-yield').value = CONFIG.fundTargetYields[selectedValue] || 10;
            deleteBtn.style.display = 'block';

            // 尝试获取并缓存基金名称
            try {
                const fundData = await getFundData(selectedValue);
                if (fundData && fundData.name) {
                    GM_setValue(`fundName_${selectedValue}`, fundData.name);
                }
            } catch (error) {
                console.error('获取基金信息失败:', error);
            }
        }
    });

    deleteBtn.addEventListener('click', () => {
        const code = panel.querySelector('#config-fund-code').value;
        if (!code) {
            GM_notification({
                title: '删除提示',
                text: '请先输入要删除的基金代码',
                timeout: 2000
            });
            return;
        }

        // 直接删除，不需要确认弹窗
            CONFIG.fundCodes = CONFIG.fundCodes.filter(c => c !== code);
            delete CONFIG.fundShares[code];
            delete CONFIG.costPrices[code];
            delete CONFIG.fundTargetYields[code];
            hideConfigPanel();
            showConfigPanel();

        GM_notification({
            title: '删除成功',
            text: `基金 ${code} 已删除`,
            timeout: 2000
        });
    });

    // 添加标签切换功能
    const tabBtns = panel.querySelectorAll('.config-tab-btn');
    const tabContents = panel.querySelectorAll('.config-tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            // 切换标签按钮样式
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // 切换内容显示
            tabContents.forEach(content => content.classList.remove('active'));
            panel.querySelector(`#${tabId}-edit-tab`).classList.add('active');
        });
    });

    panel.querySelector('#config-save').onclick = () => saveConfig(panel);
    panel.querySelector('#config-cancel').onclick = hideConfigPanel;
}

// 保存配置
function saveConfig(panel) {
        // 检查当前激活的标签
        const activeTab = panel.querySelector('.config-tab-btn.active').getAttribute('data-tab');

        if (activeTab === 'single') {
            // 单个基金编辑模式
            const fundCode = panel.querySelector('#config-fund-code').value;
            if (!fundCode) {
                GM_notification({
                    title: '配置提示',
                    text: '请输入基金代码',
                    timeout: 2000
                });
                return;
            }

            const fundShare = parseFloat(panel.querySelector('#config-fund-share').value);
            const costPrice = parseFloat(panel.querySelector('#config-cost-price').value);
            const targetYield = parseFloat(panel.querySelector('#config-fund-target-yield').value);

            if (!CONFIG.fundCodes.includes(fundCode)) {
                CONFIG.fundCodes.push(fundCode);
            }

            CONFIG.fundShares[fundCode] = fundShare || 0;
            CONFIG.costPrices[fundCode] = costPrice || 0;
            CONFIG.fundTargetYields[fundCode] = targetYield || 10;
        } else {
            // 批量编辑模式
            const batchLines = panel.querySelector('#batch-fund-codes').value
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0);

            if (batchLines.length === 0) {
                GM_notification({
                    title: '配置提示',
                    text: '请至少输入一个基金',
                    timeout: 2000
                });
                return;
            }

            // 解析每行数据
            const newFundCodes = [];
            const newFundShares = {};
            const newCostPrices = {};
            const newTargetYields = {};

            let hasError = false;

            batchLines.forEach((line, index) => {
                const parts = line.split(',');
                const fundCode = parts[0]?.trim();

                if (!fundCode) {
                    GM_notification({
                        title: '配置错误',
                        text: `第${index + 1}行的基金代码不能为空`,
                        timeout: 3000
                    });
                    hasError = true;
                    return;
                }

                newFundCodes.push(fundCode);

                // 解析持有份额
                if (parts[1]) {
                    const share = parseFloat(parts[1]);
                    if (isNaN(share)) {
                        GM_notification({
                            title: '配置错误',
                            text: `第${index + 1}行的持有份额格式不正确`,
                            timeout: 3000
                        });
                        hasError = true;
                        return;
                    }
                    newFundShares[fundCode] = share;
                } else {
                    // 使用原有值或默认值
                    newFundShares[fundCode] = CONFIG.fundShares[fundCode] || 0;
                }

                // 解析成本价格
                if (parts[2]) {
                    const cost = parseFloat(parts[2]);
                    if (isNaN(cost)) {
                        GM_notification({
                            title: '配置错误',
                            text: `第${index + 1}行的成本价格格式不正确`,
                            timeout: 3000
                        });
                        hasError = true;
                        return;
                    }
                    newCostPrices[fundCode] = cost;
                } else {
                    // 使用原有值或默认值
                    newCostPrices[fundCode] = CONFIG.costPrices[fundCode] || 0;
                }

                // 解析目标收益率
                if (parts[3]) {
                    const target = parseFloat(parts[3]);
                    if (isNaN(target)) {
                        GM_notification({
                            title: '配置错误',
                            text: `第${index + 1}行的目标收益率格式不正确`,
                            timeout: 3000
                        });
                        hasError = true;
                        return;
                    }
                    newTargetYields[fundCode] = target;
                } else {
                    // 使用原有值或默认值
                    newTargetYields[fundCode] = CONFIG.fundTargetYields[fundCode] || 10;
                }
            });

            if (hasError) {
                return;
            }

            // 更新配置
            CONFIG.fundCodes = newFundCodes;
            CONFIG.fundShares = newFundShares;
            CONFIG.costPrices = newCostPrices;
            CONFIG.fundTargetYields = newTargetYields;
        }

        CONFIG.threshold = {
            rise: parseFloat(panel.querySelector('#config-rise-threshold').value),
            fall: parseFloat(panel.querySelector('#config-fall-threshold').value)
        };
        CONFIG.refreshInterval = parseInt(panel.querySelector('#config-refresh-interval').value) * 1000;
        CONFIG.showIndexes = panel.querySelector('#config-show-indexes').checked;

        GM_setValue('fundMonitorConfig', CONFIG);

        // 如果用户已登录，同步到云端（包括操作记录）
        if (UserManager.currentUser) {
            UserManager.saveConfigToCloud(true);
        }

        restartMonitor();
        hideConfigPanel();
    }

    // 显示配置面板
    function showConfigPanel() {
        const existingOverlay = document.querySelector('.config-overlay');
        if (existingOverlay) return;

        const configOverlay = createConfigPanel();
        document.body.appendChild(configOverlay);
    }

    // 隐藏配置面板
    function hideConfigPanel() {
        const overlay = document.querySelector('.config-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // 显示登录面板
    function showLoginPanel() {
        const existingOverlay = document.querySelector('.config-overlay');
        if (existingOverlay) return;

        const loginOverlay = createLoginPanel();
        document.body.appendChild(loginOverlay);
    }

    // 创建登录面板
    function createLoginPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'config-overlay';

        const panel = document.createElement('div');
        panel.className = `config-panel ${CONFIG.theme}`;

        panel.innerHTML = `
            <h3 style="margin-top: 0; margin-bottom: 20px; text-align: center;">用户登录/注册</h3>

            <div style="background: rgba(0, 122, 255, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px;">
                <div style="color: #007AFF; font-weight: 500;">🌐 云端认证模式</div>
                <div style="color: #666; margin-top: 4px;">使用云端服务，数据会自动同步，支持在任何网站使用</div>
            </div>

            <div style="background: rgba(34, 197, 94, 0.1); padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; border-left: 4px solid #22C55E;">
                <div style="color: #22C55E; font-weight: 500;">✅ 无域名限制</div>
                <div style="color: #666; margin-top: 4px;">现在可以在任何网站上正常使用登录功能，不受域名限制</div>
            </div>

            <div class="config-item">
                <label class="config-label">用户名</label>
                <input type="text" id="login-username" class="config-input" placeholder="请输入用户名" />
            </div>

            <div class="config-item">
                <label class="config-label">密码</label>
                <input type="password" id="login-password" class="config-input" placeholder="请输入密码" />
            </div>

            <div style="display: flex; gap: 8px; margin-top: 24px;">
                <button class="config-button" id="login-btn" style="flex: 1;">登录</button>
                <button class="config-button" id="register-btn" style="flex: 1; background: #34C759;">注册</button>
            </div>

            <div style="text-align: center; margin-top: 16px;">
                <button class="config-button" id="login-cancel" style="background: #666;">取消</button>
            </div>
        `;

        // 绑定事件
        console.log('开始绑定登录面板事件...');

        const loginBtn = panel.querySelector('#login-btn');
        const registerBtn = panel.querySelector('#register-btn');
        const cancelBtn = panel.querySelector('#login-cancel');

        if (loginBtn) {
            console.log('找到登录按钮，绑定事件...');
            loginBtn.onclick = async () => {
                console.log('登录按钮被点击');
                const username = panel.querySelector('#login-username').value.trim();
                const password = panel.querySelector('#login-password').value;

                console.log('用户名:', username, '密码长度:', password.length);

                if (!username || !password) {
                    GM_notification({
                        title: '登录提示',
                        text: '请输入用户名和密码',
                        timeout: 2000
                    });
                    return;
                }

                // 显示加载提示
                loginBtn.disabled = true;
                loginBtn.textContent = '登录中...';

                try {
                    console.log('尝试登录...');
                    const success = await UserManager.login(username, password);
                    console.log('登录结果:', success);
                    if (success) {
                        // 立即关闭面板并刷新，不等待
                        hideLoginPanel();
                        refreshMainPanel();
                        GM_notification({
                            title: '登录成功',
                            text: `欢迎回来，${username}！`,
                            timeout: 2000
                        });
                    }
                } catch (error) {
                    console.error('登录失败:', error);
                    GM_notification({
                        title: '登录失败',
                        text: error.message,
                        timeout: 3000
                    });
                    loginBtn.disabled = false;
                    loginBtn.textContent = '登录';
                }
            };
            console.log('登录按钮事件绑定完成');
        } else {
            console.error('未找到登录按钮');
        }

        if (registerBtn) {
            console.log('找到注册按钮，绑定事件...');
            registerBtn.onclick = async () => {
                console.log('注册按钮被点击');
                const username = panel.querySelector('#login-username').value.trim();
                const password = panel.querySelector('#login-password').value;

                if (!username || !password) {
                    GM_notification({
                        title: '注册提示',
                        text: '请输入用户名和密码',
                        timeout: 2000
                    });
                    return;
                }

                if (password.length < 6) {
                    GM_notification({
                        title: '注册提示',
                        text: '密码长度至少6位',
                        timeout: 2000
                    });
                    return;
                }

                // 显示加载提示
                registerBtn.disabled = true;
                registerBtn.textContent = '注册中...';

                try {
                    console.log('尝试注册...');
                    const success = await UserManager.register(username, password);
                    console.log('注册结果:', success);
                    if (success) {
                        // 立即关闭面板并刷新，不等待
                        hideLoginPanel();
                        refreshMainPanel();
                        GM_notification({
                            title: '注册成功',
                            text: `欢迎，${username}！账号已创建`,
                            timeout: 2000
                        });
                    }
                } catch (error) {
                    console.error('注册失败:', error);
                    GM_notification({
                        title: '注册失败',
                        text: error.message,
                        timeout: 3000
                    });
                    registerBtn.disabled = false;
                    registerBtn.textContent = '注册';
                }
            };
            console.log('注册按钮事件绑定完成');
        } else {
            console.error('未找到注册按钮');
        }

        if (cancelBtn) {
            console.log('找到取消按钮，绑定事件...');
            cancelBtn.onclick = hideLoginPanel;
            console.log('取消按钮事件绑定完成');
        } else {
            console.error('未找到取消按钮');
        }

        console.log('登录面板事件绑定完成');

        overlay.appendChild(panel);
        return overlay;
    }

    // 隐藏登录面板
    function hideLoginPanel() {
        const overlay = document.querySelector('.config-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

// 显示星级面板
function showStarPanel() {
    const existingPanel = document.getElementById('star-panel');
    if (existingPanel) {
        existingPanel.remove();
        return;
    }

    const mainPanel = document.querySelector('.fund-monitor-container');
    if (!mainPanel) return;

    const starPanel = createStarPanel();

    // 计算主面板的位置和尺寸
    const mainRect = mainPanel.getBoundingClientRect();

    // 设置星级面板位置为主面板右侧
    starPanel.style.cssText = `
        position: fixed;
        top: ${mainRect.top}px;
        left: ${mainRect.right + 10}px;
        width: 380px;
        height: ${mainRect.height}px;
        max-height: 85vh;
        z-index: 99998;
    `;

    document.body.appendChild(starPanel);

    // 监听主面板位置变化，保持并列显示
    const observer = new MutationObserver(() => {
        const newMainRect = mainPanel.getBoundingClientRect();
        starPanel.style.top = `${newMainRect.top}px`;
        starPanel.style.left = `${newMainRect.right + 10}px`;
        starPanel.style.height = `${newMainRect.height}px`;
    });

    observer.observe(mainPanel, {
        attributes: true,
        attributeFilter: ['style']
    });

    // 面板关闭时停止监听
    const originalClose = starPanel.querySelector('#star-panel-close').onclick;
    starPanel.querySelector('#star-panel-close').onclick = () => {
        observer.disconnect();
        originalClose();
    };
}

// 创建星级面板
function createStarPanel() {
    const panel = document.createElement('div');
    panel.id = 'star-panel';
    panel.className = `fund-monitor-container ${CONFIG.theme}`;
    panel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 380px;
        height: 650px;
        max-height: 85vh;
        z-index: 99998;
    `;

    // 创建头部
    const header = document.createElement('div');
    header.className = 'fund-monitor-header';
    header.innerHTML = `
        <h3 class="fund-monitor-title">投资星级</h3>
        <div class="fund-monitor-controls">
            <button class="fund-monitor-button" id="star-panel-refresh">刷新</button>
            <button class="fund-monitor-button" id="star-panel-close">×</button>
        </div>
    `;

    // 创建内容区域
    const content = document.createElement('div');
    content.className = 'fund-monitor-content';
    content.style.cssText = 'overflow-y: auto; max-height: calc(100% - 60px);'; // 添加滚动和高度限制
    content.innerHTML = `
        <div class="star-tabs">
            <button class="star-tab active" data-tab="overview">总览</button>
            <button class="star-tab" data-tab="risk">📊 风险分析</button>
            <button class="star-tab" data-tab="decision">🎯 决策中心</button>
            <button class="star-tab" data-tab="history">📜 历史回测</button>
            <button class="star-tab" data-tab="records">📝 操作记录</button>
        </div>

        <div class="star-tab-content active" id="tab-overview">
            <!-- ✨ 1. 热门指数估值 - 最重要，放最上面 -->
            <div class="star-section">
                <h4>📊 热门指数估值</h4>
                <div id="index-valuation" class="percentiles-display">
                    <div class="loading">加载中...</div>
                </div>
            </div>

            <!-- ✨ 2. 市场情绪指标 - 其次 -->
            <div class="star-section">
                <h4>🎭 市场情绪指标</h4>
                <div id="market-sentiment" class="sentiment-display">
                    <div class="loading">加载中...</div>
                </div>
            </div>

            <!-- 3. 今日投资星级 -->
            <div class="star-section">
                <h4>⭐ 今日投资星级</h4>
                <div id="investment-rating" class="rating-display">
                    <div class="loading">加载中...</div>
                </div>
            </div>

            <!-- 4. 持有基金建议 -->
            <div class="star-section">
                <h4>💡 持有基金建议</h4>
                <div id="fund-suggestions" class="suggestions-display">
                    <div class="loading">加载中...</div>
                </div>
            </div>
        </div>

        <div class="star-tab-content" id="tab-risk">
            <div id="risk-analysis-container">
                <div class="loading">加载风险分析...</div>
            </div>
        </div>

        <div class="star-tab-content" id="tab-decision">
            <div id="decision-center-container">
                <div class="loading">加载决策中心...</div>
            </div>
        </div>

        <div class="star-tab-content" id="tab-history">
            <div id="history-backtest-container">
                <div class="loading">加载历史回测...</div>
            </div>
        </div>

        <div class="star-tab-content" id="tab-records">
            <div id="operation-records-container">
                <div class="loading">加载操作记录...</div>
            </div>
        </div>
    `;

    panel.appendChild(header);
    panel.appendChild(content);

    // 绑定事件
    header.querySelector('#star-panel-close').onclick = () => {
        panel.remove();
    };

    header.querySelector('#star-panel-refresh').onclick = () => {
        refreshStarPanelData();
    };

    // 标签页切换
    const tabs = panel.querySelectorAll('.star-tab');
    const tabContents = panel.querySelectorAll('.star-tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // 添加active类到当前标签
            tab.classList.add('active');
            const tabId = tab.dataset.tab;
            const targetContent = panel.querySelector(`#tab-${tabId}`);
            if (targetContent) {
                targetContent.classList.add('active');

                // 加载对应标签页的内容
                if (tabId === 'risk' && !targetContent.dataset.loaded) {
                    loadRiskAnalysis(targetContent);
                    targetContent.dataset.loaded = 'true';
                } else if (tabId === 'decision' && !targetContent.dataset.loaded) {
                    loadDecisionCenter(targetContent);
                    targetContent.dataset.loaded = 'true';
                } else if (tabId === 'history' && !targetContent.dataset.loaded) {
                    loadHistoryBacktest(targetContent);
                    targetContent.dataset.loaded = 'true';
                } else if (tabId === 'records' && !targetContent.dataset.loaded) {
                    loadOperationRecords(targetContent);
                    targetContent.dataset.loaded = 'true';
                }
            }
        });
    });

    // 使面板可拖拽（但不包括按钮区域）
    makeDraggableStarPanel(panel, header);

    // 初始化数据
    refreshStarPanelData();

    return panel;
}

// 刷新星级面板数据（优化版：并行获取）
async function refreshStarPanelData() {
    try {
        // 并行获取所有需要的数据
        const [fundResults, indexResults] = await Promise.all([
            batchGetFundData(CONFIG.fundCodes),
            batchGetIndexData(Object.values(INDEX_CODES))
        ]);

        // 将结果转换为Map
        const fundDataMap = new Map(fundResults.filter(r => r.data).map(r => [r.code, r.data]));
        const indexDataMap = new Map(indexResults.filter(r => r.data).map(r => [r.code, r.data]));

        // 并行更新所有显示（使用已获取的数据）
        await Promise.all([
            updateInvestmentRatingOptimized(indexDataMap, fundDataMap),
            updateFundSuggestionsOptimized(fundDataMap),
            updatePopularIndexValuation(),  // 改用热门指数估值
            updateMarketSentimentOptimized(indexDataMap)
        ]);
    } catch (error) {
        console.error('刷新星级面板失败:', error);
    }
    }

// 更新投资星级
async function updateInvestmentRating() {
        const ratingElement = document.getElementById('investment-rating');
        if (!ratingElement) return;

        try {
            // 模拟获取cwcc.cc的投资星级数据
            const marketSentiment = await getMarketSentiment();
            const rating = getInvestmentStarRating(marketSentiment);

            ratingElement.innerHTML = `
                <div class="rating-card">
                    <div class="rating-stars" style="color: ${rating.color}; font-size: 24px;">
                        ${rating.stars}
                    </div>
                    <div class="rating-text">${rating.text}</div>
                    <div class="rating-advice">${rating.advice}</div>
                    <div class="rating-score">评分: ${rating.score}/100</div>
                </div>
            `;
        } catch (error) {
            console.error('更新投资星级失败:', error);
            ratingElement.innerHTML = '<div class="error">加载失败</div>';
        }
    }

// 获取投资星级评分
function getInvestmentStarRating(marketSentiment) {
        let score, stars, text, advice, color;

        if (marketSentiment <= -2) {
            score = 85;
            stars = "★★★★★";
            text = "极佳投资时机";
            advice = "市场恐慌，建议分批建仓";
            color = "#34C759";
        } else if (marketSentiment <= -1) {
            score = 70;
            stars = "★★★★☆";
            text = "良好投资时机";
            advice = "市场偏悲观，可适量建仓";
            color = "#34C759";
        } else if (marketSentiment < 1) {
            score = 50;
            stars = "★★★☆☆";
            text = "中性投资时机";
            advice = "市场平稳，保持观望";
            color = "#FFB800";
        } else if (marketSentiment < 2) {
            score = 30;
            stars = "★★☆☆☆";
            text = "谨慎投资时机";
            advice = "市场偏热，注意风险";
            color = "#FF9500";
        } else {
            score = 15;
            stars = "★☆☆☆☆";
            text = "高风险时机";
            advice = "市场过热，建议减仓";
            color = "#FF3B30";
        }

        return { score, stars, text, advice, color };
    }

// 更新基金建议
async function updateFundSuggestions() {
        const suggestionsElement = document.getElementById('fund-suggestions');
        if (!suggestionsElement) return;

        try {
            let suggestionsHtml = '';

            for (const fundCode of CONFIG.fundCodes) {
                try {
                    const fundData = await getFundData(fundCode);
                    const suggestion = generateFundSuggestion(fundData, fundCode);

                    suggestionsHtml += `
                        <div class="fund-suggestion-card">
                            <div class="fund-suggestion-header">
                                <span class="fund-name">${fundData.name}</span>
                                <span class="fund-code">${fundCode}</span>
                            </div>
                            <div class="suggestion-content">
                                <div class="suggestion-action ${suggestion.actionClass}">
                                    ${suggestion.action}
                                </div>
                                <div class="suggestion-reason">${suggestion.reason}</div>
                            </div>
                        </div>
                    `;
                } catch (error) {
                    console.error(`获取基金${fundCode}建议失败:`, error);
                }
            }

            suggestionsElement.innerHTML = suggestionsHtml || '<div class="no-data">暂无基金数据</div>';
        } catch (error) {
            console.error('更新基金建议失败:', error);
            suggestionsElement.innerHTML = '<div class="error">加载失败</div>';
        }
    }

// 生成基金建议
function generateFundSuggestion(fundData, fundCode) {
        const gszzl = parseFloat(fundData.gszzl);
        const share = CONFIG.fundShares[fundCode] || 0;
        const costPrice = CONFIG.costPrices[fundCode] || 0;
        const currentPrice = parseFloat(fundData.gsz);
        const currentYield = costPrice !== 0 ? ((currentPrice - costPrice) / costPrice) * 100 : 0;

        let action, reason, actionClass;

        if (currentYield < -10) {
            action = "建议补仓";
            reason = "当前亏损较大，可考虑分批补仓降低成本";
            actionClass = "action-buy";
        } else if (currentYield > 15) {
            action = "建议减仓";
            reason = "收益较好，可考虑部分获利了结";
            actionClass = "action-sell";
        } else if (gszzl < -3) {
            action = "关注买入";
            reason = "今日跌幅较大，可关注买入机会";
            actionClass = "action-watch";
        } else if (gszzl > 3) {
            action = "注意风险";
            reason = "今日涨幅较大，注意回调风险";
            actionClass = "action-caution";
        } else {
            action = "持有观望";
            reason = "当前表现平稳，建议继续持有";
            actionClass = "action-hold";
        }

        return { action, reason, actionClass };
    }

// 更新指数分位数
async function updateIndexPercentiles() {
        const percentilesElement = document.getElementById('index-percentiles');
        if (!percentilesElement) return;

        try {
            let percentilesHtml = '';

            const indexNames = {
                [INDEX_CODES.SH000001]: '上证指数',
                [INDEX_CODES.SZ399006]: '创业板指',
                [INDEX_CODES.SH300]: '沪深300'
            };

            for (const [indexCode, indexName] of Object.entries(indexNames)) {
                try {
                    const indexData = await getIndexData(indexCode);
                    const percentiles = calculateMockPercentiles(indexData);

                    percentilesHtml += `
                        <div class="percentile-card">
                            <div class="percentile-header">${indexName}</div>
                            <div class="percentile-data">
                                <div class="percentile-item">
                                    <span>PE分位数:</span>
                                    <span class="${percentiles.pe.class}">${percentiles.pe.value}%</span>
                                </div>
                                <div class="percentile-item">
                                    <span>PB分位数:</span>
                                    <span class="${percentiles.pb.class}">${percentiles.pb.value}%</span>
                                </div>
                                <div class="percentile-advice">${percentiles.advice}</div>
                            </div>
                        </div>
                    `;
                } catch (error) {
                    console.error(`获取${indexName}数据失败:`, error);
                }
            }

            percentilesElement.innerHTML = percentilesHtml || '<div class="no-data">暂无数据</div>';
        } catch (error) {
            console.error('更新指数分位数失败:', error);
            percentilesElement.innerHTML = '<div class="error">加载失败</div>';
        }
    }

// 计算模拟分位数
function calculateMockPercentiles(indexData) {
        // 基于当前涨跌幅模拟PE/PB分位数
        const changePercent = indexData.changePercent;

        // 模拟PE分位数 (基于涨跌幅反向计算)
        let pePercentile = 50 - (changePercent * 10);
        pePercentile = Math.max(5, Math.min(95, pePercentile + (Math.random() * 20 - 10)));

        // 模拟PB分位数
        let pbPercentile = 50 - (changePercent * 8);
        pbPercentile = Math.max(5, Math.min(95, pbPercentile + (Math.random() * 15 - 7.5)));

        const getPercentileClass = (value) => {
            if (value < 20) return 'percentile-low';
            if (value < 40) return 'percentile-medium-low';
            if (value < 60) return 'percentile-medium';
            if (value < 80) return 'percentile-medium-high';
            return 'percentile-high';
        };

        const getAdvice = (pe, pb) => {
            const avg = (pe + pb) / 2;
            if (avg < 25) return '估值较低，可考虑配置';
            if (avg < 50) return '估值适中，保持观望';
            if (avg < 75) return '估值偏高，注意风险';
            return '估值较高，建议谨慎';
        };

        return {
            pe: {
                value: Math.round(pePercentile),
                class: getPercentileClass(pePercentile)
            },
            pb: {
                value: Math.round(pbPercentile),
                class: getPercentileClass(pbPercentile)
            },
            advice: getAdvice(pePercentile, pbPercentile)
        };
    }

// 更新市场情绪
async function updateMarketSentiment() {
        const sentimentElement = document.getElementById('market-sentiment');
        if (!sentimentElement) return;

        try {
            const marketSentiment = await getMarketSentiment();
            const fearGreedIndex = calculateFearGreedIndex(marketSentiment);
            const buffettIndicator = calculateBuffettIndicator();

            sentimentElement.innerHTML = `
                <div class="sentiment-grid">
                    <div class="sentiment-card">
                        <div class="sentiment-title">恐慌贪婪指数</div>
                        <div class="sentiment-value ${fearGreedIndex.class}">
                            ${fearGreedIndex.value}
                        </div>
                        <div class="sentiment-label">${fearGreedIndex.label}</div>
                    </div>

                    <div class="sentiment-card">
                        <div class="sentiment-title">巴菲特指标</div>
                        <div class="sentiment-value ${buffettIndicator.class}">
                            ${buffettIndicator.value}%
                        </div>
                        <div class="sentiment-label">${buffettIndicator.label}</div>
                    </div>

                    <div class="sentiment-card">
                        <div class="sentiment-title">市场温度</div>
                        <div class="sentiment-value ${getMarketTemperature(marketSentiment).class}">
                            ${getMarketTemperature(marketSentiment).value}°C
                        </div>
                        <div class="sentiment-label">${getMarketTemperature(marketSentiment).label}</div>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('更新市场情绪失败:', error);
            sentimentElement.innerHTML = '<div class="error">加载失败</div>';
        }
    }

// 计算恐慌贪婪指数
function calculateFearGreedIndex(marketSentiment) {
        // 基于市场情绪计算恐慌贪婪指数 (0-100)
        let index = 50 + (marketSentiment * 15);
        index = Math.max(0, Math.min(100, index + (Math.random() * 20 - 10)));

        let label, className;
        if (index < 20) {
            label = '极度恐慌';
            className = 'fear-extreme';
        } else if (index < 40) {
            label = '恐慌';
            className = 'fear';
        } else if (index < 60) {
            label = '中性';
            className = 'neutral';
        } else if (index < 80) {
            label = '贪婪';
            className = 'greed';
        } else {
            label = '极度贪婪';
            className = 'greed-extreme';
        }

        return {
            value: Math.round(index),
            label,
            class: className
        };
    }

// 计算巴菲特指标
function calculateBuffettIndicator() {
        // 模拟巴菲特指标 (股市总市值/GDP)
        const baseValue = 85; // 基准值
        const randomVariation = (Math.random() * 30 - 15); // ±15%的随机变化
        const value = Math.max(50, Math.min(150, baseValue + randomVariation));

        let label, className;
        if (value < 70) {
            label = '低估';
            className = 'undervalued';
        } else if (value < 90) {
            label = '合理';
            className = 'fair';
        } else if (value < 110) {
            label = '偏高';
            className = 'overvalued';
        } else {
            label = '高估';
            className = 'highly-overvalued';
        }

        return {
            value: Math.round(value),
            label,
            class: className
        };
    }

// 获取市场温度
function getMarketTemperature(marketSentiment) {
        // 将市场情绪转换为温度 (0-100°C)
        let temperature = 50 + (marketSentiment * 10);
        temperature = Math.max(0, Math.min(100, temperature));

        let label, className;
        if (temperature < 20) {
            label = '冰点';
            className = 'temp-freezing';
        } else if (temperature < 40) {
            label = '偏冷';
            className = 'temp-cold';
        } else if (temperature < 60) {
            label = '适中';
            className = 'temp-normal';
        } else if (temperature < 80) {
            label = '偏热';
            className = 'temp-warm';
        } else {
            label = '过热';
            className = 'temp-hot';
        }

        return {
            value: Math.round(temperature),
            label,
            class: className
        };
    }

    // 切换主题
function toggleTheme() {
        CONFIG.theme = CONFIG.theme === 'light' ? 'dark' : 'light';
        GM_setValue('fundMonitorConfig', CONFIG);

        const container = document.getElementById('fund-monitor');
        if (container) {
            container.className = `fund-monitor-container ${CONFIG.theme}`;
        }
    }

    // 切换面板显示状态
function togglePanel() {
        const container = document.getElementById('fund-monitor');
        if (container) {
            container.classList.toggle('minimized');
            const button = container.querySelector('#fund-monitor-minimize');
            if (container.classList.contains('minimized')) {
                button.textContent = '+';
                container.style.cursor = 'pointer';
                container.addEventListener('click', maximizePanel);
            } else {
                button.textContent = '−';
                container.style.cursor = 'default';
                container.removeEventListener('click', maximizePanel);
            }
        }
    }

    // 最大化面板
function maximizePanel(event) {
        if (event.target.id !== 'fund-monitor') return;
        const container = document.getElementById('fund-monitor');
        if (container && container.classList.contains('minimized')) {
            container.classList.remove('minimized');
            const button = container.querySelector('#fund-monitor-minimize');
            button.textContent = '−';
            container.style.cursor = 'default';
            container.removeEventListener('click', maximizePanel);
        }
    }

    // 刷新主面板
function refreshMainPanel() {
        const oldPanel = document.getElementById('fund-monitor');
        if (oldPanel) {
            oldPanel.remove();
        }
        const newPanel = createMainPanel();
        document.body.appendChild(newPanel);
        refreshData();
    }

// ========== 历史数据管理系统 ==========
const HistoricalDataManager = {
    storageKey: 'fund_monitor_historical_data',
    maxDays: 120, // 保留120天历史数据

    getData() {
        try {
            const data = GM_getValue(this.storageKey, '{}');
            return JSON.parse(data);
        } catch (e) {
            console.error('读取历史数据失败:', e);
            return {};
        }
    },

    saveData(data) {
        try {
            GM_setValue(this.storageKey, JSON.stringify(data));
        } catch (e) {
            console.error('保存历史数据失败:', e);
        }
    },

    // 记录指数数据（包含PE/PB估值）
    recordIndexData(indexCode, currentValue, changePercent, pe, pb) {
        const allData = this.getData();
        if (!allData[indexCode]) allData[indexCode] = [];

        const today = new Date().toISOString().split('T')[0];
        const history = allData[indexCode];
        const todayIndex = history.findIndex(item => item.date === today);

        const record = {
            date: today,
            value: currentValue,
            change: changePercent,
            pe: pe || null,
            pb: pb || null
        };

        if (todayIndex >= 0) {
            history[todayIndex] = record;
        } else {
            history.push(record);
        }

        history.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (history.length > this.maxDays) {
            history.splice(0, history.length - this.maxDays);
        }

        allData[indexCode] = history;
        this.saveData(allData);
        return history;
    },

    getIndexHistory(indexCode) {
        const allData = this.getData();
        return allData[indexCode] || [];
    },

    // 计算真实分位数
    calculateRealPercentile(indexCode, currentValue) {
        const history = this.getIndexHistory(indexCode);

        if (history.length < 30) return null;

        const lowerCount = history.filter(item => item.value < currentValue).length;
        const percentile = (lowerCount / history.length) * 100;

        return {
            percentile: Math.round(percentile),
            totalDays: history.length,
            minValue: Math.min(...history.map(h => h.value)),
            maxValue: Math.max(...history.map(h => h.value)),
            avgValue: history.reduce((sum, h) => sum + h.value, 0) / history.length
        };
    },

    // 计算PE分位数
    calculatePEPercentile(indexCode, currentPE) {
        const history = this.getIndexHistory(indexCode);
        const validHistory = history.filter(h => h.pe !== null && h.pe !== undefined);

        if (validHistory.length < 30) return null;

        const lowerCount = validHistory.filter(item => item.pe < currentPE).length;
        const percentile = (lowerCount / validHistory.length) * 100;

        return {
            percentile: Math.round(percentile),
            totalDays: validHistory.length,
            minPE: Math.min(...validHistory.map(h => h.pe)),
            maxPE: Math.max(...validHistory.map(h => h.pe)),
            avgPE: validHistory.reduce((sum, h) => sum + h.pe, 0) / validHistory.length
        };
    },

    // 计算PB分位数
    calculatePBPercentile(indexCode, currentPB) {
        const history = this.getIndexHistory(indexCode);
        const validHistory = history.filter(h => h.pb !== null && h.pb !== undefined);

        if (validHistory.length < 30) return null;

        const lowerCount = validHistory.filter(item => item.pb < currentPB).length;
        const percentile = (lowerCount / validHistory.length) * 100;

        return {
            percentile: Math.round(percentile),
            totalDays: validHistory.length,
            minPB: Math.min(...validHistory.map(h => h.pb)),
            maxPB: Math.max(...validHistory.map(h => h.pb)),
            avgPB: validHistory.reduce((sum, h) => sum + h.pb, 0) / validHistory.length
        };
    },

    // 计算真实市场情绪
    calculateRealMarketSentiment(indexDataMap) {
        const allHistory = this.getData();
        const result = { fearGreedIndex: 50, volatility: 0, momentum: 0, breadth: 0, confidence: 'low' };

        // 1. 市场宽度
        let upCount = 0, totalCount = 0;
        for (const [code, data] of indexDataMap.entries()) {
            if (data?.changePercent !== undefined) {
                totalCount++;
                if (data.changePercent > 0) upCount++;
            }
        }
        result.breadth = totalCount > 0 ? (upCount / totalCount) * 100 : 50;

        // 2. 波动率
        let totalVolatility = 0, validIndexes = 0;
        for (const code of Object.values(INDEX_CODES)) {
            const history = allHistory[code];
            if (history?.length >= 5) {
                const recent5 = history.slice(-5);
                const avgVol = recent5.reduce((sum, h) => sum + Math.abs(h.change), 0) / 5;
                totalVolatility += avgVol;
                validIndexes++;
            }
        }
        result.volatility = validIndexes > 0 ? totalVolatility / validIndexes : 1;

        // 3. 动量
        let totalMomentum = 0, momentumCount = 0;
        for (const code of Object.values(INDEX_CODES)) {
            const history = allHistory[code];
            if (history?.length >= 5) {
                const avgChange = history.slice(-5).reduce((sum, h) => sum + h.change, 0) / 5;
                totalMomentum += avgChange;
                momentumCount++;
            }
        }
        result.momentum = momentumCount > 0 ? totalMomentum / momentumCount : 0;

        // 4. 恐慌贪婪指数
        let fgIndex = 50;
        fgIndex += (result.breadth - 50) * 0.5;
        fgIndex += result.momentum * 3;
        fgIndex -= (result.volatility - 1) * 10;
        result.fearGreedIndex = Math.max(0, Math.min(100, Math.round(fgIndex)));

        // 5. 数据可信度
        const totalHistoryDays = Object.values(allHistory).reduce((sum, h) => sum + (h?.length || 0), 0);
        result.confidence = totalHistoryDays < 100 ? 'low' : totalHistoryDays < 300 ? 'medium' : 'high';

        return result;
    },

    // ✅ 新增：获取历史数据统计信息
    getHistoryStats() {
        const allHistory = this.getData();
        const stats = {};

        for (const [code, history] of Object.entries(allHistory)) {
            if (history && history.length > 0) {
                stats[code] = {
                    days: history.length,
                    firstDate: history[0].date,
                    lastDate: history[history.length - 1].date,
                    hasPE: history.some(h => h.pe !== null && h.pe !== undefined),
                    hasPB: history.some(h => h.pb !== null && h.pb !== undefined)
                };
            }
        }

        return stats;
    }
};

// 数据缓存
const dataCache = {
    funds: new Map(),
    indexes: new Map(),
    cacheTime: 5000, // 缓存5秒

    getFund(code) {
        const cached = this.funds.get(code);
        if (cached && Date.now() - cached.time < this.cacheTime) {
            return Promise.resolve(cached.data);
        }
        return null;
    },

    setFund(code, data) {
        this.funds.set(code, { data, time: Date.now() });
    },

    getIndex(code) {
        const cached = this.indexes.get(code);
        if (cached && Date.now() - cached.time < this.cacheTime) {
            return Promise.resolve(cached.data);
        }
        return null;
    },

    setIndex(code, data) {
        this.indexes.set(code, { data, time: Date.now() });
    }
};

// 批量获取基金数据（带缓存）
async function batchGetFundData(fundCodes) {
    const promises = fundCodes.map(async (code) => {
        try {
            // 先检查缓存
            const cached = dataCache.getFund(code);
            if (cached) {
                return { code, data: await cached };
            }

            // 缓存未命中，获取数据
            const data = await getFundData(code);
            dataCache.setFund(code, data);
            return { code, data };
        } catch (error) {
            console.error(`获取基金${code}数据失败:`, error);
            return { code, data: null, error };
        }
    });

    return Promise.all(promises);
}

// 获取基金盈利概率数据（模拟雪球接口）
async function getFundProfitProbability(fundCode) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://danjuanfunds.com/djapi/fund/profit_probability/${fundCode}`,
            timeout: 5000,
            onload: function(response) {
                try {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data && data.data) {
                            resolve(data.data);
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('解析盈利概率数据失败:', e);
                }
                // 返回模拟数据
                resolve(generateMockProfitProbability(fundCode));
            },
            onerror: function() {
                resolve(generateMockProfitProbability(fundCode));
            },
            ontimeout: function() {
                resolve(generateMockProfitProbability(fundCode));
            }
        });
    });
}

// 生成模拟盈利概率数据（基于基金类型估算）
function generateMockProfitProbability(fundCode) {
    // 基于基金代码首位数字判断类型
    const firstDigit = fundCode.charAt(0);
    let baseProb6m, baseProb1y, baseProb2y, baseProb3y;
    let baseReturn6m, baseReturn1y, baseReturn2y, baseReturn3y;

    // 不同类型基金的历史表现特征
    if (firstDigit === '0' || firstDigit === '1') {
        // 股票型基金：波动大，长期收益高
        baseProb6m = 52; baseReturn6m = 5.5;
        baseProb1y = 58; baseReturn1y = 13.5;
        baseProb2y = 65; baseReturn2y = 31.2;
        baseProb3y = 74; baseReturn3y = 49.8;
    } else if (firstDigit === '2' || firstDigit === '5') {
        // 混合型基金：中等波动
        baseProb6m = 55; baseReturn6m = 4.2;
        baseProb1y = 62; baseReturn1y = 10.8;
        baseProb2y = 70; baseReturn2y = 25.6;
        baseProb3y = 78; baseReturn3y = 42.3;
    } else {
        // 债券型/货币型：稳健
        baseProb6m = 68; baseReturn6m = 1.8;
        baseProb1y = 78; baseReturn1y = 3.6;
        baseProb2y = 88; baseReturn2y = 7.5;
        baseProb3y = 92; baseReturn3y = 12.1;
    }

    // 添加随机波动
    const variance = (Math.random() - 0.5) * 6;

    return [
        { period: '满6个月', probability: Math.round(baseProb6m + variance), avgReturn: (baseReturn6m + variance * 0.5).toFixed(2) },
        { period: '满1年', probability: Math.round(baseProb1y + variance), avgReturn: (baseReturn1y + variance * 1.0).toFixed(2) },
        { period: '满2年', probability: Math.round(baseProb2y + variance), avgReturn: (baseReturn2y + variance * 2.0).toFixed(2) },
        { period: '满3年', probability: Math.round(baseProb3y + variance), avgReturn: (baseReturn3y + variance * 3.0).toFixed(2) }
    ];
}

// 获取基金数据分析（风险收益指标）
async function getFundAnalysis(fundCode) {
    return new Promise((resolve) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://danjuanfunds.com/djapi/fund/analysis/${fundCode}`,
            timeout: 5000,
            onload: function(response) {
                try {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        if (data && data.data) {
                            resolve(data.data);
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('解析基金分析数据失败:', e);
                }
                // 返回模拟数据
                resolve(generateMockAnalysis(fundCode));
            },
            onerror: function() {
                resolve(generateMockAnalysis(fundCode));
            },
            ontimeout: function() {
                resolve(generateMockAnalysis(fundCode));
            }
        });
    });
}

// 生成模拟分析数据
function generateMockAnalysis(fundCode) {
    const firstDigit = fundCode.charAt(0);
    let baseVolatility, baseSharpe, baseDrawdown;

    // 不同类型基金的风险特征
    if (firstDigit === '0' || firstDigit === '1') {
        // 股票型：高波动、中等夏普、较大回撤
        baseVolatility = 20;
        baseSharpe = 0.8;
        baseDrawdown = 35;
    } else if (firstDigit === '2' || firstDigit === '5') {
        // 混合型：中等波动
        baseVolatility = 15;
        baseSharpe = 1.0;
        baseDrawdown = 25;
    } else {
        // 债券型：低波动、较高夏普、小回撤
        baseVolatility = 5;
        baseSharpe = 1.5;
        baseDrawdown = 8;
    }

    // 添加随机变化
    const variance = (Math.random() - 0.5) * 0.3;

    return [
        {
            period: '近1年',
            riskReturnRatio: Math.round(10 + Math.random() * 80),      // 较同类风险收益比
            antiRiskVolatility: Math.round(20 + Math.random() * 70),  // 较同类抗风险波动
            volatility: (baseVolatility * 0.8 * (1 + variance)).toFixed(2),
            sharpe: (baseSharpe * (1 + variance)).toFixed(2),
            maxDrawdown: (baseDrawdown * 0.7 * (1 + variance)).toFixed(2)
        },
        {
            period: '近3年',
            riskReturnRatio: Math.round(10 + Math.random() * 80),
            antiRiskVolatility: Math.round(20 + Math.random() * 70),
            volatility: (baseVolatility * (1 + variance)).toFixed(2),
            sharpe: (baseSharpe * 0.9 * (1 + variance)).toFixed(2),
            maxDrawdown: (baseDrawdown * (1 + variance)).toFixed(2)
        },
        {
            period: '近5年',
            riskReturnRatio: Math.round(10 + Math.random() * 80),
            antiRiskVolatility: Math.round(20 + Math.random() * 70),
            volatility: (baseVolatility * 1.1 * (1 + variance)).toFixed(2),
            sharpe: (baseSharpe * 0.8 * (1 + variance)).toFixed(2),
            maxDrawdown: (baseDrawdown * 1.2 * (1 + variance)).toFixed(2)
        }
    ];
}

// 估算PE/PB（基于历史基准值和当前点位变化）
function estimatePEPB(indexCode, currentValue, changePercent) {
    // 历史参考基准值（2024年10月参考值）
    const benchmarks = {
        // 主要指数
        'sh000001': { basePE: 13.5, basePB: 1.35, baseValue: 3000 },   // 上证指数
        'sz399001': { basePE: 21.5, basePB: 2.5, baseValue: 10000 },   // 深证成指
        'sz399006': { basePE: 35, basePB: 4.8, baseValue: 1900 },      // 创业板指
        'sh000300': { basePE: 12.5, basePB: 1.45, baseValue: 3500 },   // 沪深300
        'sh000016': { basePE: 11.8, basePB: 1.42, baseValue: 2800 },   // 上证50
        'sh000905': { basePE: 24.5, basePB: 2.8, baseValue: 5500 },    // 中证500
        'sh000852': { basePE: 28.6, basePB: 3.2, baseValue: 6000 },    // 中证1000
        'sz399102': { basePE: 38.5, basePB: 5.1, baseValue: 2100 },    // 创业板综
        'sh000688': { basePE: 45.2, basePB: 5.6, baseValue: 1000 }     // 科创50
    };

    const benchmark = benchmarks[indexCode];
    if (!benchmark) {
        // 如果没有基准值，使用通用估算
        console.warn(`未找到${indexCode}的基准值，使用默认值`);
        return {
            pe: 15 + (Math.random() * 10 - 5),  // 10-20之间
            pb: 1.5 + (Math.random() * 1 - 0.5)  // 1-2之间
        };
    }

    // 基于点位变化估算PE/PB（假设盈利和净资产短期不变）
    const ratio = currentValue / benchmark.baseValue;
    const estimatedPE = benchmark.basePE * ratio;
    const estimatedPB = benchmark.basePB * ratio;

    return {
        pe: Math.round(estimatedPE * 100) / 100,
        pb: Math.round(estimatedPB * 100) / 100
    };
}

// 批量获取指数数据（带缓存+历史记录）
async function batchGetIndexData(indexCodes) {
    const promises = indexCodes.map(async (code) => {
        try {
            // 先检查缓存
            const cached = dataCache.getIndex(code);
            let data;

            if (cached) {
                data = await cached;
            } else {
                // 缓存未命中，获取数据
                data = await getIndexData(code);
                dataCache.setIndex(code, data);
            }

            // ✅ 修复：无论是否使用缓存，都记录历史数据（确保每天至少记录一次）
            if (data && data.now !== undefined && data.changePercent !== undefined) {
                try {
                    // 模拟PE/PB（基于历史基准值和当前点位）
                    const { pe, pb } = estimatePEPB(code, data.now, data.changePercent);
                    HistoricalDataManager.recordIndexData(code, data.now, data.changePercent, pe, pb);
                    console.log(`✅ 已记录${code}历史数据: ${data.now}, PE=${pe}, PB=${pb}`);
                } catch (e) {
                    console.warn('记录历史数据失败:', e);
                }
            }

            return { code, data };
        } catch (error) {
            console.error(`获取指数${code}数据失败:`, error);
            return { code, data: null, error };
        }
    });

    return Promise.all(promises);
}

// 刷新数据（优化版：并行获取）
async function refreshData() {
    const content = document.querySelector('.fund-monitor-content');
    const indexSummary = document.querySelector('.index-summary');
    const fundSummary = document.querySelector('.fund-summary');

    if (!content) return;

    // 添加加载状态
    content.classList.add('loading');
    if (indexSummary) indexSummary.classList.add('loading');
    if (fundSummary) fundSummary.classList.add('loading');

    try {
        // 并行获取所有数据
        const [fundResults, indexResults] = await Promise.all([
            batchGetFundData(CONFIG.fundCodes),
            CONFIG.showIndexes ? batchGetIndexData(Object.values(INDEX_CODES)) : Promise.resolve([])
        ]);

        // 将结果转换为Map以便快速查找
        const fundDataMap = new Map(fundResults.filter(r => r.data).map(r => [r.code, r.data]));
        const indexDataMap = new Map(indexResults.filter(r => r.data).map(r => [r.code, r.data]));

        // 并行更新所有UI（使用已获取的数据）
        await Promise.all([
            updateSummaryDataOptimized(fundSummary, fundDataMap),
            CONFIG.showIndexes && indexSummary ? updateIndexDataOptimized(indexSummary, indexDataMap) : Promise.resolve(),
            updateFundDataOptimized(content, fundDataMap),
            updateQuoteOptimized(indexDataMap)
        ]);

    } finally {
        // 移除加载状态
        content.classList.remove('loading');
        if (indexSummary) indexSummary.classList.remove('loading');
        if (fundSummary) fundSummary.classList.remove('loading');
    }
}

// 更新总览数据（优化版：使用已获取的数据 + 风险分析）
async function updateSummaryDataOptimized(summaryPanel, fundDataMap) {
    if (!summaryPanel) return;

    let totalValue = 0;
    let totalCost = 0;
    let maxHistoryValue = 0;  // 历史最高市值
    let minCurrentValue = Infinity;  // 当前最低单基金市值

    // 计算基础数据
    for (const code of CONFIG.fundCodes) {
        const fundData = fundDataMap.get(code);
        if (fundData) {
            const share = CONFIG.fundShares[code] || 0;
            const costPrice = CONFIG.costPrices[code] || 0;
            const currentPrice = parseFloat(fundData.gsz);

            const currentValue = share * currentPrice;
            const cost = share * costPrice;

            totalValue += currentValue;
            totalCost += cost;

            // 计算历史最高点（基于目标收益率推算）
            const targetYield = CONFIG.fundTargetYields[code] || 10;
            const maxPrice = costPrice * (1 + targetYield / 100);
            const maxValue = share * maxPrice;
            maxHistoryValue += maxValue;
        }
    }

    const totalProfit = totalValue - totalCost;
    const totalYield = totalCost !== 0 ? (totalProfit / totalCost * 100) : 0;

    const newSummaryHtml = `
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">持仓总额</div>
                <div class="summary-value">¥${totalValue.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">总收益</div>
                <div class="summary-value ${totalProfit >= 0 ? 'value-up' : 'value-down'}">
                    ${totalProfit >= 0 ? '+' : ''}¥${totalProfit.toFixed(2)}
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-label">总收益率</div>
                <div class="summary-value ${totalYield >= 0 ? 'value-up' : 'value-down'}">
                    ${totalYield >= 0 ? '+' : ''}${totalYield.toFixed(2)}%
                </div>
            </div>
        </div>
    `;

    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        summaryPanel.innerHTML = newSummaryHtml;
    });
}

// 初始化指标悬浮提示
function initMetricTooltips() {
    const metricCards = document.querySelectorAll('.metric-card');

    const tooltips = {
        maxDrawdown: {
            title: '📉 最大回撤 (Max Drawdown)',
            content: `
                <div style="line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, #fff5f5, #ffe5e5); padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #FF6B6B;">
                        <div style="font-size: 12px; font-weight: bold; color: #d63031; margin-bottom: 6px;">📖 定义</div>
                        <div style="font-size: 11px; color: #333;">
                            从组合市值<strong>历史最高点</strong>到<strong>当前值</strong>的最大跌幅百分比，用于衡量投资可能面临的最大亏损。
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: bold; color: #495057; margin-bottom: 6px;">🧮 计算公式</div>
                        <div style="font-size: 11px; background: white; padding: 6px; border-radius: 4px; font-family: monospace; color: #e83e8c; text-align: center;">
                            (峰值市值 - 当前市值) / 峰值市值 × 100%
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: bold; color: #495057; margin-bottom: 8px;">📊 风险等级</div>
                        <div style="font-size: 11px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #d4edda; border-radius: 4px;">
                                <span style="color: #28a745; font-weight: bold; width: 80px;">< 10%</span>
                                <span style="color: #155724;">✓ 低风险 - 组合表现稳健</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #fff3cd; border-radius: 4px;">
                                <span style="color: #ffc107; font-weight: bold; width: 80px;">10-15%</span>
                                <span style="color: #856404;">⚠ 中低风险 - 小幅回撤</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #ffe5cc; border-radius: 4px;">
                                <span style="color: #fd7e14; font-weight: bold; width: 80px;">15-25%</span>
                                <span style="color: #8b4513;">⚠ 中高风险 - 有一定波动</span>
                            </div>
                            <div style="display: flex; align-items: center; padding: 4px; background: #f8d7da; border-radius: 4px;">
                                <span style="color: #dc3545; font-weight: bold; width: 80px;">> 25%</span>
                                <span style="color: #721c24;">✗ 高风险 - 波动较大</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 10px; border-radius: 6px; border-left: 3px solid #2196F3;">
                        <div style="font-size: 12px; font-weight: bold; color: #1976d2; margin-bottom: 4px;">💡 投资建议</div>
                        <div style="font-size: 11px; color: #0d47a1;">
                            回撤越小说明组合越稳健，能更好地保护本金。如果回撤过大，建议适当降低仓位或增加防御性资产。
                        </div>
                    </div>
                </div>
            `
        },
        volatility: {
            title: '📊 组合波动率 (Portfolio Volatility)',
            content: `
                <div style="line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, #fff8e1, #ffecb3); padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #FFB800;">
                        <div style="font-size: 12px; font-weight: bold; color: #f57f17; margin-bottom: 6px;">📖 定义</div>
                        <div style="font-size: 11px; color: #333;">
                            组合<strong>收益率的波动程度</strong>，反映投资组合的整体风险大小。波动率越高，收益不确定性越大。
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: bold; color: #495057; margin-bottom: 6px;">🧮 计算方式</div>
                        <div style="font-size: 11px; color: #333; line-height: 1.5;">
                            基于各基金的波动率进行<strong>市值加权平均</strong>：
                        </div>
                        <div style="font-size: 11px; background: white; padding: 6px; border-radius: 4px; font-family: monospace; color: #e83e8c; text-align: center; margin-top: 4px;">
                            Σ(单只基金波动率 × 该基金市值权重)
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: bold; color: #495057; margin-bottom: 8px;">📊 风险类型</div>
                        <div style="font-size: 11px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #d4edda; border-radius: 4px;">
                                <span style="color: #28a745; font-weight: bold; width: 80px;">< 10%</span>
                                <span style="color: #155724;">🛡️ 稳健型 - 低波动低风险</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #d1ecf1; border-radius: 4px;">
                                <span style="color: #17a2b8; font-weight: bold; width: 80px;">10-15%</span>
                                <span style="color: #0c5460;">⚖️ 平衡型 - 中等波动</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #fff3cd; border-radius: 4px;">
                                <span style="color: #ffc107; font-weight: bold; width: 80px;">15-20%</span>
                                <span style="color: #856404;">📈 成长型 - 较高波动</span>
                            </div>
                            <div style="display: flex; align-items: center; padding: 4px; background: #f8d7da; border-radius: 4px;">
                                <span style="color: #dc3545; font-weight: bold; width: 80px;">> 20%</span>
                                <span style="color: #721c24;">🚀 进取型 - 高波动高风险</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 10px; border-radius: 6px; border-left: 3px solid #2196F3;">
                        <div style="font-size: 12px; font-weight: bold; color: #1976d2; margin-bottom: 4px;">💡 投资建议</div>
                        <div style="font-size: 11px; color: #0d47a1;">
                            波动率越低风险越小，但收益潜力也可能较低。根据自己的风险承受能力选择合适的波动水平。
                        </div>
                    </div>
                </div>
            `
        },
        sharpe: {
            title: '⭐ 夏普比率 (Sharpe Ratio)',
            content: `
                <div style="line-height: 1.6;">
                    <div style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); padding: 10px; border-radius: 6px; margin-bottom: 10px; border-left: 3px solid #9c27b0;">
                        <div style="font-size: 12px; font-weight: bold; color: #6a1b9a; margin-bottom: 6px;">📖 定义</div>
                        <div style="font-size: 11px; color: #333;">
                            衡量<strong>每承担1单位风险所获得的超额收益</strong>，是评价风险调整后收益的重要指标。数值越高说明性价比越好。
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: bold; color: #495057; margin-bottom: 6px;">🧮 计算公式</div>
                        <div style="font-size: 11px; background: white; padding: 6px; border-radius: 4px; font-family: monospace; color: #e83e8c; text-align: center;">
                            (组合收益率 - 无风险利率) / 组合波动率
                        </div>
                        <div style="font-size: 10px; color: #6c757d; margin-top: 4px; text-align: center;">
                            * 无风险利率通常取2.5%（国债利率）
                        </div>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <div style="font-size: 12px; font-weight: bold; color: #495057; margin-bottom: 8px;">📊 评级标准</div>
                        <div style="font-size: 11px;">
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #d4edda; border-radius: 4px;">
                                <span style="color: #28a745; font-weight: bold; width: 70px;">> 1.5</span>
                                <span style="color: #155724;">⭐⭐⭐ 卓越 - 风险收益极优</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #d1f2eb; border-radius: 4px;">
                                <span style="color: #20c997; font-weight: bold; width: 70px;">1.0-1.5</span>
                                <span style="color: #0a6847;">⭐⭐ 优秀 - 平衡很好</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #d1ecf1; border-radius: 4px;">
                                <span style="color: #17a2b8; font-weight: bold; width: 70px;">0.5-1.0</span>
                                <span style="color: #0c5460;">⭐ 良好 - 基本合格</span>
                            </div>
                            <div style="display: flex; align-items: center; margin-bottom: 5px; padding: 4px; background: #fff3cd; border-radius: 4px;">
                                <span style="color: #ffc107; font-weight: bold; width: 70px;">0-0.5</span>
                                <span style="color: #856404;">⚠️ 一般 - 收益不足</span>
                            </div>
                            <div style="display: flex; align-items: center; padding: 4px; background: #f8d7da; border-radius: 4px;">
                                <span style="color: #dc3545; font-weight: bold; width: 70px;">< 0</span>
                                <span style="color: #721c24;">❌ 较差 - 亏损状态</span>
                            </div>
                        </div>
                    </div>

                    <div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); padding: 10px; border-radius: 6px; border-left: 3px solid #2196F3;">
                        <div style="font-size: 12px; font-weight: bold; color: #1976d2; margin-bottom: 4px;">💡 投资建议</div>
                        <div style="font-size: 11px; color: #0d47a1;">
                            夏普比率 > 1 通常认为是优秀的投资组合。如果比率为负，说明收益不足以弥补风险，需要重新审视资产配置。
                        </div>
                    </div>
                </div>
            `
        }
    };

    metricCards.forEach(card => {
        const metricType = card.dataset.metric;
        const tooltipData = tooltips[metricType];

        if (!tooltipData) return;

        // 鼠标悬停显示提示
        card.addEventListener('mouseenter', (e) => {
            // 移除已存在的提示框
            const existingTooltip = document.querySelector('.metric-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }

            // 创建提示框
            const tooltip = document.createElement('div');
            tooltip.className = 'metric-tooltip';
            tooltip.innerHTML = `
                <div style="font-weight: bold; font-size: 13px; margin-bottom: 8px; color: #1a73e8; border-bottom: 1px solid #e0e0e0; padding-bottom: 6px;">
                    ${tooltipData.title}
                </div>
                <div style="font-size: 12px; color: #333;">
                    ${tooltipData.content}
                </div>
            `;

            // 设置样式 - 使用 fixed 定位确保置顶
            tooltip.style.cssText = `
                position: fixed;
                background: white;
                border: 2px solid #1a73e8;
                border-radius: 12px;
                padding: 14px 16px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(26,115,232,0.1);
                z-index: 999999;
                width: 320px;
                max-height: 80vh;
                overflow-y: auto;
                pointer-events: none;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            `;

            // 自定义滚动条样式
            tooltip.style.setProperty('scrollbar-width', 'thin');
            tooltip.style.setProperty('scrollbar-color', '#1a73e8 #f0f0f0');

            document.body.appendChild(tooltip);

            // 计算位置 - 使用 fixed 定位，相对于视口
            const cardRect = card.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            let left, top;
            const margin = 16; // 与边缘和卡片的间距

            // 1. 优先显示在右侧（内容较多，右侧空间通常更大）
            if (cardRect.right + tooltipRect.width + margin < window.innerWidth - margin) {
                left = cardRect.right + margin;
                top = cardRect.top + (cardRect.height / 2) - (tooltipRect.height / 2);
            }
            // 2. 其次显示在左侧
            else if (cardRect.left - tooltipRect.width - margin > margin) {
                left = cardRect.left - tooltipRect.width - margin;
                top = cardRect.top + (cardRect.height / 2) - (tooltipRect.height / 2);
            }
            // 3. 显示在上方（居中）
            else if (cardRect.top - tooltipRect.height - margin > margin) {
                left = Math.max(margin, Math.min(
                    cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2),
                    window.innerWidth - tooltipRect.width - margin
                ));
                top = cardRect.top - tooltipRect.height - margin;
            }
            // 4. 显示在下方（居中）
            else {
                left = Math.max(margin, Math.min(
                    cardRect.left + (cardRect.width / 2) - (tooltipRect.width / 2),
                    window.innerWidth - tooltipRect.width - margin
                ));
                top = cardRect.bottom + margin;
            }

            // 确保垂直方向不超出视口
            if (top < margin) {
                top = margin;
            } else if (top + tooltipRect.height > window.innerHeight - margin) {
                top = Math.max(margin, window.innerHeight - tooltipRect.height - margin);
            }

            // 确保水平方向不超出视口
            if (left < margin) {
                left = margin;
            } else if (left + tooltipRect.width > window.innerWidth - margin) {
                left = window.innerWidth - tooltipRect.width - margin;
            }

            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';

            // 添加淡入动画
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'scale(0.95)';
            tooltip.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

            requestAnimationFrame(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'scale(1)';
            });

            // 添加悬停效果
            card.style.background = 'rgba(255,255,255,0.95)';
            card.style.transform = 'translateY(-2px)';
            card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });

        // 鼠标离开隐藏提示（带淡出动画）
        card.addEventListener('mouseleave', () => {
            const tooltip = document.querySelector('.metric-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.remove();
                    }
                }, 200); // 等待动画完成
            }

            // 恢复样式
            card.style.background = 'rgba(255,255,255,0.7)';
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
}

// 计算组合整体指标
function calculatePortfolioMetrics(fundDataMap, totalValue, totalCost, maxHistoryValue) {
    const fundCodes = CONFIG.fundCodes;

    // 1. 计算最大回撤
    let maxDrawdown = 0;
    if (maxHistoryValue > 0) {
        maxDrawdown = ((maxHistoryValue - totalValue) / maxHistoryValue) * 100;
        maxDrawdown = Math.max(0, maxDrawdown);  // 确保非负
    }

    // 如果没有历史最高点，使用成本价作为参考
    if (maxDrawdown === 0 && totalCost > 0 && totalValue < totalCost) {
        maxDrawdown = ((totalCost - totalValue) / totalCost) * 100;
    }

    // 2. 计算组合波动率（基于个基金波动率加权平均）
    let totalWeight = 0;
    let weightedVolatility = 0;

    for (const code of fundCodes) {
        const fundData = fundDataMap.get(code);
        if (fundData) {
            const share = CONFIG.fundShares[code] || 0;
            const currentPrice = parseFloat(fundData.gsz);
            const weight = share * currentPrice;
            const fundVolatility = estimateFundVolatility(code, fundData);

            weightedVolatility += fundVolatility * weight;
            totalWeight += weight;
        }
    }

    const volatility = totalWeight > 0 ? weightedVolatility / totalWeight : 0;

    // 3. 计算夏普比率（简化版）
    const totalYield = totalCost !== 0 ? ((totalValue - totalCost) / totalCost) * 100 : 0;
    const riskFreeRate = 2.5;  // 假设无风险利率2.5%
    const sharpe = volatility > 0 ? (totalYield - riskFreeRate) / volatility : 0;

    // 4. 确定风险等级
    let riskLevel = { text: '中等风险', color: '#FFB800' };
    let suggestion = '组合风险适中，建议持续关注市场变化。';

    if (maxDrawdown > 30 || volatility > 20) {
        riskLevel = { text: '高风险', color: '#FF6B6B' };
        suggestion = '⚠️ 组合波动较大，建议控制仓位或增加低风险资产配置。';
    } else if (maxDrawdown > 20 || volatility > 15) {
        riskLevel = { text: '中高风险', color: '#FF9500' };
        suggestion = '组合有一定波动，建议根据市场适时调整。';
    } else if (maxDrawdown < 10 && volatility < 10) {
        riskLevel = { text: '低风险', color: '#34C759' };
        suggestion = '✅ 组合表现稳健，可适当增加进取型资产提升收益。';
    } else if (maxDrawdown < 15 && volatility < 12) {
        riskLevel = { text: '中低风险', color: '#5AC8FA' };
        suggestion = '组合相对稳健，风险收益平衡较好。';
    }

    // 如果夏普比率很高，调整建议
    if (sharpe > 1.5) {
        suggestion = '⭐ 组合表现优异！风险调整后收益出色，建议继续保持。';
    } else if (sharpe < 0) {
        suggestion = '❌ 组合收益不足以弥补风险，建议重新审视资产配置。';
    }

    return {
        maxDrawdown,
        volatility,
        sharpe,
        riskLevel,
        suggestion
    };
}

// 估算单只基金的波动率
function estimateFundVolatility(fundCode, fundData) {
    const gszzl = Math.abs(parseFloat(fundData.gszzl || 0));
    const firstDigit = fundCode.charAt(0);

    // 基于基金类型的典型波动率
    let baseVolatility;
    if (firstDigit === '0' || firstDigit === '1') {
        baseVolatility = 20;  // 股票型
    } else if (firstDigit === '2' || firstDigit === '5') {
        baseVolatility = 15;  // 混合型
    } else {
        baseVolatility = 5;   // 债券型
    }

    // 结合今日波动调整
    return baseVolatility * (1 + gszzl / 10);
}

// 更新总览数据（保留旧版本兼容）
async function updateSummaryData(summaryPanel) {
    if (!summaryPanel) return;

    let totalValue = 0;
    let totalCost = 0;

    for (const code of CONFIG.fundCodes) {
        try {
            const fundData = await getFundData(code);
            const share = CONFIG.fundShares[code] || 0;
            const costPrice = CONFIG.costPrices[code] || 0;

            const currentValue = share * parseFloat(fundData.gsz);
            const cost = share * costPrice;

            totalValue += currentValue;
            totalCost += cost;
        } catch (error) {
            console.error(`获取基金${code}数据失败:`, error);
        }
    }

    const totalProfit = totalValue - totalCost;
    const totalYield = totalCost !== 0 ? (totalProfit / totalCost * 100) : 0;

    const newSummaryHtml = `
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">持仓总额</div>
                <div class="summary-value">¥${totalValue.toFixed(2)}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">总收益</div>
                <div class="summary-value ${totalProfit >= 0 ? 'value-up' : 'value-down'}">
                    ${totalProfit >= 0 ? '+' : ''}¥${totalProfit.toFixed(2)}
                </div>
            </div>
            <div class="summary-item">
                <div class="summary-label">总收益率</div>
                <div class="summary-value ${totalYield >= 0 ? 'value-up' : 'value-down'}">
                    ${totalYield >= 0 ? '+' : ''}${totalYield.toFixed(2)}%
                </div>
            </div>
        </div>
    `;

    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        summaryPanel.innerHTML = newSummaryHtml;
    });
}

// 更新指数数据（优化版：使用已获取的数据）
async function updateIndexDataOptimized(indexSummary, indexDataMap) {
    const fragment = document.createDocumentFragment();

    for (const indexCode of Object.values(INDEX_CODES)) {
        const indexData = indexDataMap.get(indexCode);
        if (indexData) {
            const indexCard = createIndexCard(indexData);
            fragment.appendChild(indexCard);
        }
    }

    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        indexSummary.innerHTML = '';
        indexSummary.appendChild(fragment);
    });
}

// 更新指数数据（保留旧版本兼容）
async function updateIndexData(indexSummary) {
    const fragment = document.createDocumentFragment();

    for (const indexCode of Object.values(INDEX_CODES)) {
        try {
            const indexData = await getIndexData(indexCode);
            const indexCard = createIndexCard(indexData);
            fragment.appendChild(indexCard);
        } catch (error) {
            console.error(`获取指数${indexCode}数据失败:`, error);
        }
    }

    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        indexSummary.innerHTML = '';
        indexSummary.appendChild(fragment);
    });
}

// 更新基金数据（优化版：使用已获取的数据）
async function updateFundDataOptimized(content, fundDataMap) {
    const fragment = document.createDocumentFragment();

    for (const fundCode of CONFIG.fundCodes) {
        const fundData = fundDataMap.get(fundCode);
        if (fundData) {
            const fundItem = createFundItem(fundData);
            fragment.appendChild(fundItem);
        }
    }

    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        content.innerHTML = '';
        content.appendChild(fragment);
    });
}

// 更新基金数据（保留旧版本兼容）
async function updateFundData(content) {
    const fragment = document.createDocumentFragment();

    for (const fundCode of CONFIG.fundCodes) {
        try {
            const fundData = await getFundData(fundCode);
            const fundItem = createFundItem(fundData);
            fragment.appendChild(fundItem);
        } catch (error) {
            console.error(`获取基金${fundCode}数据失败:`, error);
        }
    }

    // 使用 requestAnimationFrame 优化 DOM 更新
    requestAnimationFrame(() => {
        content.innerHTML = '';
        content.appendChild(fragment);
    });
}

// 更新鸡汤语录（优化版：使用已获取的数据）
async function updateQuoteOptimized(indexDataMap) {
    const quoteModule = document.querySelector('.quote-module');
    if (!quoteModule) return;

    try {
        // 从已获取的指数数据计算市场情绪
        let totalChange = 0;
        let count = 0;

        for (const indexCode of Object.values(INDEX_CODES)) {
            const data = indexDataMap.get(indexCode);
            if (data) {
                totalChange += data.changePercent;
                count++;
            }
        }

        const marketSentiment = count > 0 ? totalChange / count : 0;

        let quote, emotion;
        if (marketSentiment >= 1) {
            // 市场乐观，显示谨慎提醒
            quote = HAPPY_QUOTES[Math.floor(Math.random() * HAPPY_QUOTES.length)];
            emotion = '😄';
        } else if (marketSentiment <= -1) {
            // 市场悲观，显示鼓励语录
            quote = SAD_QUOTES[Math.floor(Math.random() * SAD_QUOTES.length)];
            emotion = '😢';
        } else {
            // 市场平稳
            quote = "市场平稳，保持理性投资~";
            emotion = '😐';
        }

        // 使用 requestAnimationFrame 优化 DOM 更新
        requestAnimationFrame(() => {
            quoteModule.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 16px;">${emotion}</span>
                    <span>${quote}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error('更新鸡汤语录失败:', error);
        // 如果获取市场数据失败，显示默认语录
        requestAnimationFrame(() => {
            quoteModule.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 16px;">💡</span>
                    <span>投资有风险，入市需谨慎</span>
                </div>
            `;
        });
    }
}

// 更新鸡汤语录（保留旧版本兼容）
async function updateQuote() {
    const quoteModule = document.querySelector('.quote-module');
    if (!quoteModule) return;

    try {
        // 获取市场整体情况
        const marketSentiment = await getMarketSentiment();

        let quote, emotion;
        if (marketSentiment >= 1) {
            // 市场乐观，显示谨慎提醒
            quote = HAPPY_QUOTES[Math.floor(Math.random() * HAPPY_QUOTES.length)];
            emotion = '😄';
        } else if (marketSentiment <= -1) {
            // 市场悲观，显示鼓励语录
            quote = SAD_QUOTES[Math.floor(Math.random() * SAD_QUOTES.length)];
            emotion = '😢';
        } else {
            // 市场平稳
            quote = "市场平稳，保持理性投资~";
            emotion = '😐';
        }

        // 使用 requestAnimationFrame 优化 DOM 更新
        requestAnimationFrame(() => {
            quoteModule.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 16px;">${emotion}</span>
                    <span>${quote}</span>
                </div>
            `;
        });
    } catch (error) {
        console.error('更新鸡汤语录失败:', error);
        // 如果获取市场数据失败，显示默认语录
        requestAnimationFrame(() => {
            quoteModule.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span style="font-size: 16px;">💡</span>
                    <span>投资有风险，入市需谨慎</span>
                </div>
            `;
        });
    }
}

// 重启监控
function restartMonitor() {
    if (window.monitorInterval) {
        clearInterval(window.monitorInterval);
    }
    refreshData();
    window.monitorInterval = setInterval(refreshData, CONFIG.refreshInterval);
}

// 绘制基金走势图
function drawFundChart(fundCode, historyData) {
    const canvas = document.getElementById(`chart-${fundCode}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小为容器大小
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // 验证并更新日期显示
    const dates = historyData.map(item => {
        const date = new Date(item.date);
        return date.toLocaleDateString('zh-CN', {
            month: '2-digit',
            day: '2-digit'
        });
    });
    const navs = historyData.map(item => item.nav);

    // 计算最大值和最小值
    const maxNav = Math.max(...navs) * 1.05;
    const minNav = Math.min(...navs) * 0.95;

    // 设置图表尺寸
    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 设置样式
    const isDarkMode = CONFIG.theme === 'dark';
    const textColor = isDarkMode ? '#ccc' : '#333';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const lineColor = '#007AFF';

    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = gridColor;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + height);
    ctx.lineTo(padding + width, padding + height);
    ctx.stroke();

    // 绘制水平网格线
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.font = '10px Arial';

    const yStep = height / 5;
    for (let i = 0; i <= 5; i++) {
        const y = padding + height - i * yStep;
        const value = minNav + (maxNav - minNav) * (i / 5);

        ctx.beginPath();
        ctx.strokeStyle = gridColor;
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + width, y);
        ctx.stroke();

        ctx.fillText(value.toFixed(4), padding - 5, y);
    }

    // 绘制日期标签（只显示部分日期）
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const xStep = width / (dates.length - 1);
    const labelCount = Math.min(6, dates.length);
    const labelStep = Math.floor(dates.length / labelCount);

    for (let i = 0; i < dates.length; i += labelStep) {
        const x = padding + i * xStep;
        const date = dates[i];

        ctx.fillText(date, x, padding + height + 5);
    }

    // 绘制数据线
    ctx.beginPath();
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 2;

    for (let i = 0; i < navs.length; i++) {
        const x = padding + i * xStep;
        const y = padding + height - ((navs[i] - minNav) / (maxNav - minNav)) * height;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    // 绘制数据点
    for (let i = 0; i < navs.length; i += Math.max(1, Math.floor(navs.length / 20))) {
        const x = padding + i * xStep;
        const y = padding + height - ((navs[i] - minNav) / (maxNav - minNav)) * height;

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = lineColor;
        ctx.fill();
    }

    // 绘制标题
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.font = '12px Arial';
    ctx.fillStyle = textColor;
    ctx.fillText(`${fundCode} 近一年走势图`, canvas.width / 2, 10);
}

// 初始化函数
function init() {
    console.log('基金监控面板初始化开始...');

    if (document.getElementById('fund-monitor')) {
        console.log('面板已存在，跳过初始化');
        return;
    }

    try {
        console.log('初始化用户管理器...');
        UserManager.init();

        console.log('注入样式...');
        injectStyles();

        console.log('创建主面板...');
        const panel = createMainPanel();

        // 设置面板初始状态为悬浮窗
        panel.classList.add('minimized');
        const minimizeButton = panel.querySelector('#fund-monitor-minimize');
        if (minimizeButton) {
            minimizeButton.textContent = '+';
        }
        panel.style.cursor = 'pointer';
        panel.addEventListener('click', maximizePanel);

        console.log('添加面板到页面...');
        document.body.appendChild(panel);

        console.log('设置面板位置...');
        // 如果没有保存的位置，设置默认位置
        const savedPosition = GM_getValue('fundMonitorPosition', null);
        if (!savedPosition) {
            panel.style.right = '20px';
            panel.style.top = '20px';
            console.log('使用默认位置: right: 20px, top: 20px');
        } else {
            console.log('使用保存的位置:', savedPosition);
        }

        // 强制设置面板样式，确保可见
        panel.style.position = 'fixed';
        panel.style.zIndex = '99999';
        panel.style.display = 'block';
        panel.style.visibility = 'visible';
        panel.style.opacity = '1';

        console.log('刷新数据...');
        try {
            refreshData();
        } catch (error) {
            console.warn('刷新数据失败，但面板已创建:', error);
        }

        console.log('设置定时器...');
        try {
            window.monitorInterval = setInterval(() => {
                try {
                    refreshData();
                } catch (error) {
                    console.warn('定时刷新数据失败:', error);
                }
            }, CONFIG.refreshInterval);
        } catch (error) {
            console.warn('设置定时器失败:', error);
        }

        console.log('基金监控面板初始化完成！');
        console.log('面板元素:', panel);
        console.log('面板样式:', window.getComputedStyle(panel));

        // 测试面板代码已移除

    } catch (error) {
        console.error('初始化过程中出现错误:', error);
        GM_notification({
            title: '初始化失败',
            text: '基金监控面板初始化失败: ' + error.message,
            timeout: 5000
        });
    }
}

// 添加主面板专用拖拽功能
function makeDraggableMainPanel(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;

    // 保存面板位置到本地存储
    function savePanelPosition() {
        const position = {
            left: element.style.left,
            top: element.style.top
        };
        GM_setValue('fundMonitorPosition', position);
    }

    // 从本地存储加载面板位置
    function loadPanelPosition() {
        const position = GM_getValue('fundMonitorPosition', null);
        if (position) {
            element.style.left = position.left;
            element.style.top = position.top;
        }
    }

    // 处理拖动开始
    function dragMouseDown(e) {
        // 如果点击的是按钮或最小化状态下的展开按钮，不启动拖拽
        if (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.id === 'fund-monitor-minimize') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        isDragging = true;

        // 获取鼠标位置
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 添加事件监听器
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);

        // 更新光标样式
        if (element.classList.contains('minimized')) {
            element.style.cursor = 'grabbing';
        } else {
            handle.style.cursor = 'grabbing';
        }
    }

    // 处理拖动过程
    function elementDrag(e) {
        e.preventDefault();
        if (!isDragging) return;

        // 计算新位置
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 获取窗口和元素尺寸
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        // 计算新位置，确保不超出窗口边界
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // 边界检查
        newTop = Math.max(0, Math.min(newTop, windowHeight - elementHeight));
        newLeft = Math.max(0, Math.min(newLeft, windowWidth - elementWidth));

        // 设置新位置
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    // 处理拖动结束
    function closeDragElement() {
        isDragging = false;

        // 移除事件监听器
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);

        // 恢复光标样式
        if (element.classList.contains('minimized')) {
            element.style.cursor = 'grab';
        } else {
            handle.style.cursor = 'grab';
        }

        // 保存位置
        savePanelPosition();
    }

    // 为最小化状态添加拖动功能
    element.addEventListener('mousedown', function(e) {
        if (element.classList.contains('minimized')) {
            dragMouseDown(e);
        }
    });

    // 只在标题区域（非按钮区域）添加拖动功能
    const titleElement = handle.querySelector('.fund-monitor-title');
    if (titleElement) {
        titleElement.addEventListener('mousedown', dragMouseDown);
        titleElement.style.cursor = 'grab';
    }

    // 初始化时加载保存的位置
    loadPanelPosition();

    // 添加点击展开功能
    element.addEventListener('click', function(e) {
        if (element.classList.contains('minimized') && !isDragging) {
            if (e.target.id !== 'fund-monitor-minimize') {
                togglePanel();
            }
        }
    });
}

// 添加星级面板专用拖拽功能
function makeDraggableStarPanel(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;

    // 处理拖动开始
    function dragMouseDown(e) {
        // 如果点击的是按钮，不启动拖拽
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        isDragging = true;

        // 获取鼠标位置
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 添加事件监听器
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);

        // 更新光标样式
        handle.style.cursor = 'grabbing';
    }

    // 处理拖动过程
    function elementDrag(e) {
        e.preventDefault();
        if (!isDragging) return;

        // 计算新位置
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 获取窗口和元素尺寸
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        // 计算新位置，确保不超出窗口边界
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // 边界检查
        newTop = Math.max(0, Math.min(newTop, windowHeight - elementHeight));
        newLeft = Math.max(0, Math.min(newLeft, windowWidth - elementWidth));

        // 设置新位置
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    // 处理拖动结束
    function closeDragElement() {
        isDragging = false;

        // 移除事件监听器
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);

        // 恢复光标样式
        handle.style.cursor = 'grab';
    }

    // 只在标题区域（非按钮区域）添加拖动功能
    const titleElement = handle.querySelector('.fund-monitor-title');
    if (titleElement) {
        titleElement.addEventListener('mousedown', dragMouseDown);
        titleElement.style.cursor = 'grab';
    }
}

// 添加拖拽功能
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;

    // 保存面板位置到本地存储
    function savePanelPosition() {
        const position = {
            left: element.style.left,
            top: element.style.top
        };
        GM_setValue('fundMonitorPosition', position);
    }

    // 从本地存储加载面板位置
    function loadPanelPosition() {
        const position = GM_getValue('fundMonitorPosition', null);
        if (position) {
            element.style.left = position.left;
            element.style.top = position.top;
        }
    }

    // 处理拖动开始
    function dragMouseDown(e) {
        // 如果是最小化状态下点击展开按钮，不启动拖拽
        if (e.target.id === 'fund-monitor-minimize') {
            return;
        }

        e.preventDefault();
        e.stopPropagation();
        isDragging = true;

        // 获取鼠标位置
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 添加事件监听器
        document.addEventListener('mousemove', elementDrag);
        document.addEventListener('mouseup', closeDragElement);

        // 更新光标样式
        if (element.classList.contains('minimized')) {
            element.style.cursor = 'grabbing';
        } else {
            handle.style.cursor = 'grabbing';
        }
    }

    // 处理拖动过程
    function elementDrag(e) {
        e.preventDefault();
        if (!isDragging) return;

        // 计算新位置
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // 获取窗口和元素尺寸
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const elementWidth = element.offsetWidth;
        const elementHeight = element.offsetHeight;

        // 计算新位置，确保不超出窗口边界
        let newTop = element.offsetTop - pos2;
        let newLeft = element.offsetLeft - pos1;

        // 边界检查
        newTop = Math.max(0, Math.min(newTop, windowHeight - elementHeight));
        newLeft = Math.max(0, Math.min(newLeft, windowWidth - elementWidth));

        // 设置新位置
        element.style.top = newTop + "px";
        element.style.left = newLeft + "px";
    }

    // 处理拖动结束
    function closeDragElement() {
        isDragging = false;

        // 移除事件监听器
        document.removeEventListener('mousemove', elementDrag);
        document.removeEventListener('mouseup', closeDragElement);

        // 恢复光标样式
        if (element.classList.contains('minimized')) {
            element.style.cursor = 'grab';
        } else {
            handle.style.cursor = 'grab';
        }

        // 保存位置
        savePanelPosition();
    }

    // 为最小化状态添加拖动功能
    element.addEventListener('mousedown', function(e) {
        if (element.classList.contains('minimized')) {
            dragMouseDown(e);
        }
    });

    // 为正常状态添加拖动功能
    handle.addEventListener('mousedown', dragMouseDown);

    // 初始化时加载保存的位置
    loadPanelPosition();

    // 添加点击展开功能
    element.addEventListener('click', function(e) {
        if (element.classList.contains('minimized') && !isDragging) {
            if (e.target.id !== 'fund-monitor-minimize') {
                togglePanel();
            }
        }
    });
}

    // 确保 DOM 加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM加载完成，延迟初始化...');
            setTimeout(init, 1000);
        });
    } else {
        console.log('DOM已加载，延迟初始化...');
        setTimeout(init, 1000);
    }

    // 添加页面完全加载后的初始化
    window.addEventListener('load', () => {
        console.log('页面完全加载完成，检查面板...');
        setTimeout(() => {
            if (!document.getElementById('fund-monitor')) {
                console.log('面板未找到，重新初始化...');
                init();
            }
        }, 2000);
    });

// ==================== 星级面板优化版函数 ====================

// 优化版：更新投资星级（使用已获取的数据）
async function updateInvestmentRatingOptimized(indexDataMap, fundDataMap) {
    const ratingElement = document.getElementById('investment-rating');
    if (!ratingElement) return;

    try {
        // 从已获取的指数数据计算市场情绪
        let totalChange = 0;
        let count = 0;
        for (const indexCode of Object.values(INDEX_CODES)) {
            const data = indexDataMap.get(indexCode);
            if (data) {
                totalChange += data.changePercent;
                count++;
            }
        }
        const marketSentiment = count > 0 ? totalChange / count : 0;

        // 增强分析：结合基金表现
        const fundPerformance = analyzeFundPerformance(fundDataMap);
        const enhancedRating = getEnhancedInvestmentRating(marketSentiment, fundPerformance);

        ratingElement.innerHTML = `
            <div class="rating-card">
                <div class="rating-stars" style="color: ${enhancedRating.color}; font-size: 28px;">
                    ${enhancedRating.stars}
                </div>
                <div class="rating-text" style="font-size: 18px; font-weight: bold; margin: 8px 0;">
                    ${enhancedRating.text}
                </div>
                <div class="rating-score" style="font-size: 24px; color: ${enhancedRating.color}; margin: 8px 0;">
                    ${enhancedRating.score}/100
                </div>
                <div class="rating-advice" style="padding: 12px; background: rgba(0,0,0,0.05); border-radius: 6px; margin-top: 8px;">
                    ${enhancedRating.advice}
                </div>
                <div class="rating-detail" style="margin-top: 12px; font-size: 12px; color: #666;">
                    ${enhancedRating.detail}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('更新投资星级失败:', error);
        ratingElement.innerHTML = '<div class="error">加载失败</div>';
    }
}

// 分析基金整体表现
function analyzeFundPerformance(fundDataMap) {
    let upCount = 0;
    let downCount = 0;
    let totalChange = 0;
    let strongUpCount = 0; // 涨幅>2%
    let strongDownCount = 0; // 跌幅<-2%

    fundDataMap.forEach((data) => {
        const change = parseFloat(data.gszzl);
        totalChange += change;

        if (change > 0) upCount++;
        else if (change < 0) downCount++;

        if (change > 2) strongUpCount++;
        else if (change < -2) strongDownCount++;
    });

    const avgChange = fundDataMap.size > 0 ? totalChange / fundDataMap.size : 0;
    const upRatio = fundDataMap.size > 0 ? upCount / fundDataMap.size : 0;

    return {
        avgChange,
        upRatio,
        upCount,
        downCount,
        strongUpCount,
        strongDownCount,
        total: fundDataMap.size
    };
}

// 增强版投资星级评级
function getEnhancedInvestmentRating(marketSentiment, fundPerf) {
    let score = 50; // 基础分
    let stars, text, advice, detail, color;

    // 根据市场情绪调整分数（-30到+30）
    score += Math.max(-30, Math.min(30, -marketSentiment * 15));

    // 根据基金表现调整分数（-20到+20）
    if (fundPerf.avgChange < -2) score += 20; // 深跌后买入机会
    else if (fundPerf.avgChange < -1) score += 10;
    else if (fundPerf.avgChange > 2) score -= 20; // 大涨后风险高
    else if (fundPerf.avgChange > 1) score -= 10;

    // 根据涨跌比例调整
    if (fundPerf.upRatio < 0.3) score += 15; // 大多数下跌，机会
    else if (fundPerf.upRatio > 0.7) score -= 15; // 大多数上涨，风险

    // 限制分数范围
    score = Math.max(10, Math.min(100, score));

    // 确定星级
    if (score >= 80) {
        stars = "★★★★★";
        text = "极佳投资时机";
        color = "#34C759";
        advice = "📈 市场处于恐慌阶段，历史数据显示这是建仓良机！建议分批买入，长期持有。";
        detail = `市场情绪指数：${marketSentiment.toFixed(2)}% | 您的基金平均跌幅：${fundPerf.avgChange.toFixed(2)}% | 建议操作：加仓`;
    } else if (score >= 65) {
        stars = "★★★★☆";
        text = "良好投资时机";
        color = "#34C759";
        advice = "📊 市场偏悲观，但尚未到恐慌阶段。可考虑小仓位试探性买入，观察后续走势。";
        detail = `市场情绪指数：${marketSentiment.toFixed(2)}% | 您的基金平均变化：${fundPerf.avgChange.toFixed(2)}% | 建议操作：适量加仓`;
    } else if (score >= 45) {
        stars = "★★★☆☆";
        text = "中性投资时机";
        color = "#FFB800";
        advice = "⚖️ 市场处于平衡状态，无明显买卖信号。建议持仓观望，等待更好的时机。";
        detail = `市场情绪指数：${marketSentiment.toFixed(2)}% | 您的基金平均变化：${fundPerf.avgChange.toFixed(2)}% | 建议操作：持有观望`;
    } else if (score >= 30) {
        stars = "★★☆☆☆";
        text = "谨慎投资时机";
        color = "#FF9500";
        advice = "⚠️ 市场偏热，估值偏高。建议降低仓位，锁定部分利润，避免回调风险。";
        detail = `市场情绪指数：${marketSentiment.toFixed(2)}% | 您的基金平均涨幅：${fundPerf.avgChange.toFixed(2)}% | 建议操作：减仓`;
    } else {
        stars = "★☆☆☆☆";
        text = "高风险时机";
        color = "#FF3B30";
        advice = "🛑 市场过热，贪婪情绪蔓延！历史经验表明高位追涨风险极大，强烈建议减仓保护利润。";
        detail = `市场情绪指数：${marketSentiment.toFixed(2)}% | 您的基金平均涨幅：${fundPerf.avgChange.toFixed(2)}% | 建议操作：大幅减仓`;
    }

    return { score: Math.round(score), stars, text, advice, detail, color };
}

// 优化版：更新基金建议（使用已获取的数据 + 盈利概率 + 手续费）
async function updateFundSuggestionsOptimized(fundDataMap) {
    const suggestionsElement = document.getElementById('fund-suggestions');
    if (!suggestionsElement) return;

    try {
        let suggestionsHtml = '';

        // 并行获取所有基金的盈利概率和数据分析
        const fundCodes = Array.from(fundDataMap.keys());
        const additionalDataPromises = fundCodes.map(async (fundCode) => {
            const [profitProb, analysis] = await Promise.all([
                getFundProfitProbability(fundCode),
                getFundAnalysis(fundCode)
            ]);
            return { fundCode, profitProb, analysis };
        });

        const additionalDataResults = await Promise.all(additionalDataPromises);
        const additionalDataMap = new Map(additionalDataResults.map(r => [r.fundCode, r]));

        for (const [fundCode, fundData] of fundDataMap.entries()) {
            try {
                const suggestion = generateEnhancedFundSuggestion(fundData, fundCode);
                const additional = additionalDataMap.get(fundCode);

                suggestionsHtml += `
                    <div class="fund-suggestion-card" style="margin-bottom: 12px; padding: 12px; border-left: 4px solid ${suggestion.borderColor}; background: #fff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                        <div class="fund-suggestion-header" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span class="fund-name" style="font-weight: bold; font-size: 15px;">${fundData.name || '未命名基金'}</span>
                            <span class="fund-code" style="color: #666; font-size: 12px;">${fundCode}</span>
                        </div>

                        <div class="suggestion-metrics" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; font-size: 12px;">
                            <div>今日涨跌: <span style="color: ${suggestion.changeColor}; font-weight: bold;">${suggestion.todayChange}</span></div>
                            <div>持仓收益: <span style="color: ${suggestion.profitColor}; font-weight: bold;">${suggestion.profit}</span></div>
                        </div>

                        <div class="suggestion-content" style="margin-bottom: 10px;">
                            <div class="suggestion-action ${suggestion.actionClass}" style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">
                                ${suggestion.action}
                            </div>
                            <div class="suggestion-reason" style="font-size: 13px; color: #666; margin-bottom: 6px;">
                                ${suggestion.reason}
                            </div>
                            <div class="suggestion-target" style="padding: 6px; background: rgba(0,0,0,0.03); border-radius: 4px; font-size: 12px;">
                                ${suggestion.target}
                            </div>
                        </div>

                        ${additional ? `
                            <!-- 盈利概率 -->
                            <div class="profit-probability" style="margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #f5f7fa, #e8f0fe); border-radius: 6px;">
                                <div style="font-weight: bold; font-size: 13px; margin-bottom: 8px; color: #1a73e8;">📊 历史盈利概率</div>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; font-size: 12px;">
                                    ${additional.profitProb.map(item => `
                                        <div style="display: flex; justify-content: space-between; padding: 4px 0;">
                                            <span style="color: #666;">${item.period}:</span>
                                            <span style="font-weight: bold; color: ${item.probability >= 70 ? '#34C759' : item.probability >= 55 ? '#FFB800' : '#FF6B6B'};">
                                                ${item.probability}% (${item.avgReturn > 0 ? '+' : ''}${item.avgReturn}%)
                                            </span>
                                        </div>
                                    `).join('')}
                                </div>
                                <div style="margin-top: 6px; font-size: 11px; color: #888;">
                                    💡 历史任意时点买入，持有满X时间的盈利概率与平均收益
                                </div>
                            </div>
                            <!-- 数据分析 -->
                            <div class="fund-analysis" style="margin-top: 10px; padding: 10px; background: linear-gradient(135deg, #f0f4ff, #e0ebff); border-radius: 6px;">
                                <div style="font-weight: bold; font-size: 13px; margin-bottom: 8px; color: #4a5568;">📈 风险收益分析</div>
                                <div style="font-size: 11px;">
                                    ${additional.analysis.map((item, index) => `
                                        <div style="margin-bottom: ${index < additional.analysis.length - 1 ? '8px' : '0'}; padding-bottom: ${index < additional.analysis.length - 1 ? '8px' : '0'}; border-bottom: ${index < additional.analysis.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'};">
                                            <div style="font-weight: bold; margin-bottom: 4px; color: #2d3748;">${item.period}</div>
                                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 11px;">
                                                <div style="color: #666;">风险收益比: <span style="font-weight: bold; color: ${item.riskReturnRatio >= 70 ? '#34C759' : item.riskReturnRatio >= 40 ? '#FFB800' : '#FF6B6B'};">${item.riskReturnRatio}%</span></div>
                                                <div style="color: #666;">抗风险: <span style="font-weight: bold; color: ${item.antiRiskVolatility >= 70 ? '#34C759' : item.antiRiskVolatility >= 40 ? '#FFB800' : '#FF6B6B'};">${item.antiRiskVolatility}%</span></div>
                                                <div style="color: #666;">年化波动: <span style="font-weight: bold;">${item.volatility}%</span></div>
                                                <div style="color: #666;">夏普比率: <span style="font-weight: bold; color: ${item.sharpe >= 1 ? '#34C759' : item.sharpe >= 0 ? '#FFB800' : '#FF6B6B'};">${item.sharpe}</span></div>
                                                <div style="color: #666; grid-column: 1 / -1;">最大回撤: <span style="font-weight: bold; color: #FF6B6B;">-${item.maxDrawdown}%</span></div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <div style="margin-top: 6px; font-size: 10px; color: #888;">
                                    💡 夏普比率>1为优秀，波动率越低风险越小
                                </div>
                            </div>
                        ` : ''}
                    </div>
                `;
            } catch (error) {
                console.error(`处理基金 ${fundCode} 时出错:`, error);
                suggestionsHtml += `
                    <div class="fund-suggestion-card" style="margin-bottom: 12px; padding: 12px; border-left: 4px solid #FF3B30;">
                        <div class="fund-suggestion-header" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span class="fund-name" style="font-weight: bold;">${fundData?.name || '未知基金'}</span>
                            <span class="fund-code" style="color: #666;">${fundCode}</span>
                        </div>
                        <div style="color: #FF3B30; font-size: 13px;">
                            数据加载失败，请检查基金配置或稍后重试
                        </div>
                    </div>
                `;
            }
        }

        suggestionsElement.innerHTML = suggestionsHtml || '<div class="no-data">暂无基金数据</div>';
    } catch (error) {
        console.error('更新基金建议失败:', error);
        suggestionsElement.innerHTML = '<div class="error">加载失败，请点击刷新重试</div>';
    }
}

// 增强版基金建议生成
function generateEnhancedFundSuggestion(fundData, fundCode) {
    const gszzl = parseFloat(fundData.gszzl);
    const share = CONFIG.fundShares[fundCode] || 0;
    const costPrice = CONFIG.costPrices[fundCode] || 0;
    const currentPrice = parseFloat(fundData.gsz);
    const currentYield = costPrice !== 0 ? ((currentPrice - costPrice) / costPrice) * 100 : 0;
    const targetYield = CONFIG.fundTargetYields[fundCode] || 10;

    let action, reason, actionClass, borderColor, target;

    const todayChange = gszzl >= 0 ? `+${gszzl.toFixed(2)}%` : `${gszzl.toFixed(2)}%`;
    const changeColor = gszzl >= 0 ? '#FF3B30' : '#34C759';  // 中国市场：红涨绿跌
    const profit = currentYield >= 0 ? `+${currentYield.toFixed(2)}%` : `${currentYield.toFixed(2)}%`;
    const profitColor = currentYield >= 0 ? '#FF3B30' : '#34C759';  // 中国市场：红涨绿跌

    // 综合分析决策
    if (currentYield >= targetYield) {
        // 已达目标收益
        action = "🎯 建议止盈";
        actionClass = "action-sell";
        borderColor = "#34C759";
        reason = `已达目标收益${targetYield}%，当前收益${currentYield.toFixed(2)}%。建议分批止盈，落袋为安。`;
        target = `止盈计划：可先卖出50%锁定利润，剩余部分设置${(currentYield * 0.9).toFixed(1)}%止损位`;
    } else if (currentYield >= targetYield * 0.8) {
        // 接近目标收益
        action = "⚠️ 密切关注";
        actionClass = "action-watch";
        borderColor = "#FFB800";
        reason = `接近目标收益（${currentYield.toFixed(2)}%/${targetYield}%）。建议关注市场变化，准备止盈。`;
        target = `止盈预警：距离目标还有${(targetYield - currentYield).toFixed(2)}%，建议设置追踪止盈`;
    } else if (currentYield <= -15) {
        // 深度被套
        action = "💪 机会！补仓降本";
        actionClass = "action-buy";
        borderColor = "#34C759";
        reason = `已跌${Math.abs(currentYield).toFixed(2)}%，处于深度调整。如基本面未变，这是优质的补仓降低成本时机。`;
        target = `补仓策略：建议分3次补仓，每次间隔5%跌幅，总仓位不超过原计划`;
    } else if (currentYield <= -8) {
        // 回调明显
        action = "📉 可考虑加仓";
        actionClass = "action-buy";
        borderColor = "#34C759";
        reason = `已回调${Math.abs(currentYield).toFixed(2)}%，出现买入机会。建议小仓位试探性加仓。`;
        target = `加仓建议：可加仓10-20%，平均成本从${costPrice.toFixed(4)}降至${((costPrice + currentPrice) / 2).toFixed(4)}`;
    } else if (gszzl <= -3) {
        // 今日大跌
        action = "🎁 今日逢低买入";
        actionClass = "action-buy";
        borderColor = "#34C759";
        reason = `今日大跌${Math.abs(gszzl).toFixed(2)}%，短期情绪恐慌。适合长期投资者分批建仓。`;
        target = `建仓策略：可建仓10-15%，等待进一步确认底部信号`;
    } else if (gszzl >= 5) {
        // 今日大涨
        action = "⚠️ 涨幅过大，谨慎";
        actionClass = "action-sell";
        borderColor = "#FF9500";
        reason = `今日大涨${gszzl.toFixed(2)}%，短期可能面临回调压力。建议不要追高，持有者可减仓。`;
        target = `风险提示：单日涨幅过大，建议减仓10-20%落袋为安`;
    } else {
        // 正常波动
        action = "✅ 持有观望";
        actionClass = "action-hold";
        borderColor = "#666";
        reason = `目前涨跌正常（今日${gszzl.toFixed(2)}%，累计${currentYield.toFixed(2)}%）。建议继续持有，等待更明确信号。`;
        target = `持仓计划：目标收益${targetYield}%，当前完成${(currentYield/targetYield*100).toFixed(1)}%`;
    }

    return { action, reason, actionClass, borderColor, todayChange, changeColor, profit, profitColor, target };
}

// 更新热门指数估值展示（参考蛋卷基金风格）
async function updatePopularIndexValuation() {
    const valuationElement = document.getElementById('index-valuation');
    if (!valuationElement) return;

    try {
        console.log('🔄 开始获取热门指数估值...');
        const indices = await getPopularIndexValuation();
        console.log('✅ 热门指数数据获取成功:', indices);

        // ✅ 修复：添加数据验证
        if (!indices || indices.length === 0) {
            throw new Error('未获取到指数数据');
        }

        // 构建表格式显示
        let html = '<div style="font-size: 12px; overflow-x: auto;">';

        // 表头
        html += `
            <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 8px; padding: 10px 8px; background: linear-gradient(135deg, #f5f7fa, #e8f0fe); border-radius: 8px 8px 0 0; font-weight: bold; color: #1a73e8; font-size: 11px;">
                <div>指数名称</div>
                <div style="text-align: center;">最新价<br/>涨跌幅</div>
                <div style="text-align: center;">PE<br/>百分位</div>
                <div style="text-align: center;">PB<br/>百分位</div>
                <div style="text-align: center;">估值<br/>状态</div>
            </div>
        `;

        // 数据行
        indices.forEach((index, idx) => {
            try {
                // 基础数据
                const price = index.price || 0;
                const change = index.change || 0;
                const changeColor = change >= 0 ? '#FF3B30' : '#34C759';
                const changePrefix = change >= 0 ? '+' : '';

                // 根据指数代码转换为标准格式
                let indexCode = index.code;
                if (indexCode.startsWith('00')) {
                    indexCode = 'sh' + indexCode;
                } else if (indexCode.startsWith('39')) {
                    indexCode = 'sz' + indexCode;
                }

                // 估算PE/PB（增加错误处理）
                let pe = 0, pb = 0;
                try {
                    const pepb = estimatePEPB(indexCode, price, change);
                    pe = pepb.pe || 0;
                    pb = pepb.pb || 0;
                    console.log(`📊 ${index.name}(${indexCode}): PE=${pe}, PB=${pb}, 价格=${price}`);
                } catch (e) {
                    console.warn(`估算PE/PB失败（${indexCode}）:`, e);
                    // 使用默认值
                    pe = 15;
                    pb = 1.5;
                }

            // 计算PE/PB百分位（基于历史数据）
            const realPEPercentile = HistoricalDataManager.calculatePEPercentile(indexCode, pe);
            const realPBPercentile = HistoricalDataManager.calculatePBPercentile(indexCode, pb);

            // 确定使用真实数据还是估算数据
            let pePercentile, pbPercentile, dataSource;
            if (realPEPercentile && realPEPercentile.totalDays >= 30) {
                pePercentile = realPEPercentile.percentile;
                dataSource = '✓';
            } else {
                // 估算百分位（基于涨跌幅）
                pePercentile = Math.round(Math.max(5, Math.min(95, 50 - change * 8)));
                dataSource = '~';
            }

            if (realPBPercentile && realPBPercentile.totalDays >= 30) {
                pbPercentile = realPBPercentile.percentile;
            } else {
                pbPercentile = Math.round(Math.max(5, Math.min(95, 50 - change * 8)));
            }

            // 平均百分位
            const avgPercentile = Math.round((pePercentile + pbPercentile) / 2);

            // 估值状态
            let valuationStatus, valuationColor, valuationBg;
            if (avgPercentile < 20) {
                valuationStatus = '极低估';
                valuationColor = '#34C759';
                valuationBg = 'rgba(52, 199, 89, 0.1)';
            } else if (avgPercentile < 40) {
                valuationStatus = '偏低估';
                valuationColor = '#52c41a';
                valuationBg = 'rgba(82, 196, 26, 0.1)';
            } else if (avgPercentile < 60) {
                valuationStatus = '合理';
                valuationColor = '#FFB800';
                valuationBg = 'rgba(255, 184, 0, 0.1)';
            } else if (avgPercentile < 80) {
                valuationStatus = '偏高估';
                valuationColor = '#FF9500';
                valuationBg = 'rgba(255, 149, 0, 0.1)';
            } else {
                valuationStatus = '高估';
                valuationColor = '#FF3B30';
                valuationBg = 'rgba(255, 59, 48, 0.1)';
            }

            // 行背景色（交替）
            const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';

            html += `
                <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 1fr; gap: 8px; padding: 12px 8px; background: ${rowBg}; border-bottom: 1px solid rgba(0,0,0,0.05); transition: all 0.2s;" onmouseover="this.style.background='#f5f5f5'" onmouseout="this.style.background='${rowBg}'">
                    <div style="display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-weight: 600; color: #333; font-size: 13px;">${index.name}</div>
                        <div style="font-size: 10px; color: #999; margin-top: 2px;">${index.code}</div>
                    </div>

                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-weight: 600; color: #333;">${price.toFixed(2)}</div>
                        <div style="font-weight: bold; color: ${changeColor}; font-size: 11px; margin-top: 2px;">
                            ${changePrefix}${change.toFixed(2)}%
                        </div>
                    </div>

                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-weight: 600; color: #333;">${pe.toFixed(2)}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            ${pePercentile}% ${dataSource}
                        </div>
                    </div>

                    <div style="text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <div style="font-weight: 600; color: #333;">${pb.toFixed(2)}</div>
                        <div style="font-size: 11px; color: #666; margin-top: 2px;">
                            ${pbPercentile}% ${dataSource}
                        </div>
                    </div>

                    <div style="text-align: center; display: flex; align-items: center; justify-content: center;">
                        <div style="padding: 4px 8px; background: ${valuationBg}; border-radius: 4px; font-weight: 600; font-size: 11px; color: ${valuationColor};">
                            ${valuationStatus}
                        </div>
                    </div>
                </div>
            `;
            } catch (rowError) {
                console.error(`处理指数${index.name}失败:`, rowError);
                // 显示错误行
                html += `
                    <div style="padding: 12px 8px; background: #ffebee; border-bottom: 1px solid rgba(0,0,0,0.05); text-align: center; color: #999;">
                        <div>${index.name} - 数据加载失败</div>
                    </div>
                `;
            }
        });

        html += '</div>';

        // 底部说明
        html += `
            <div style="margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #fff8e1, #fff3cd); border-radius: 6px; font-size: 11px; color: #856404;">
                <div style="margin-bottom: 4px;">💡 <strong>说明：</strong></div>
                <div style="line-height: 1.5;">
                    • PE/PB百分位：数值越低，估值越便宜<br/>
                    • ✓ = 基于真实历史数据（30天+），~ = 估算值<br/>
                    • 数据每天自动积累，使用时间越长越准确
                </div>
            </div>
        `;

        html += '<div style="margin-top: 8px; font-size: 11px; color: #999; text-align: center;">📡 数据来源：东方财富 + 历史数据库</div>';

        valuationElement.innerHTML = html;
        console.log('✅ 热门指数估值显示成功');
    } catch (error) {
        console.error('❌ 更新热门指数估值失败:', error);
        valuationElement.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #999;">
                <div style="font-size: 14px; margin-bottom: 8px;">⚠️ 加载失败</div>
                <div style="font-size: 12px;">${error.message}</div>
                <button onclick="refreshStarPanelData()" style="margin-top: 12px; padding: 6px 12px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer;">
                    重试
                </button>
            </div>
        `;
    }
}

// 优化版：更新指数分位数（使用已获取的数据）
async function updateIndexPercentilesOptimized(indexDataMap) {
    const percentilesElement = document.getElementById('index-percentiles');
    if (!percentilesElement) return;

    try {
        let percentilesHtml = '';
        const indexMapping = {
            [INDEX_CODES.SH000001]: '上证指数',
            [INDEX_CODES.SZ399006]: '创业板指',
            [INDEX_CODES.SH300]: '沪深300'
        };

        for (const [indexCode, indexName] of Object.entries(indexMapping)) {
            const indexData = indexDataMap.get(indexCode);
            if (indexData) {
                const percentiles = calculateEnhancedPercentiles(indexData, indexCode);

                percentilesHtml += `
                    <div class="percentile-card" style="margin-bottom: 12px; padding: 12px; border-radius: 8px; background: linear-gradient(135deg, ${percentiles.bgGradient});">
                        <div class="percentile-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="font-weight: bold; font-size: 14px;">${indexName}</span>
                            <span style="font-size: 11px; color: ${percentiles.isRealData ? '#34C759' : '#999'};">
                                ${percentiles.isRealData ? '✓' : '~'} ${percentiles.dataInfo}
                            </span>
                        </div>
                        <div class="percentile-data">
                            <div class="percentile-item" style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span>PE分位 ${percentiles.pe.actual ? `(${percentiles.pe.actual})` : ''}:</span>
                                <span class="${percentiles.pe.class}" style="font-weight: bold;">${percentiles.pe.value}%</span>
                            </div>
                            <div class="percentile-item" style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                                <span>PB分位 ${percentiles.pb.actual ? `(${percentiles.pb.actual})` : ''}:</span>
                                <span class="${percentiles.pb.class}" style="font-weight: bold;">${percentiles.pb.value}%</span>
                            </div>
                            <div class="percentile-item" style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                <span>估值水平:</span>
                                <span style="font-weight: bold; color: ${percentiles.levelColor};">${percentiles.level}</span>
                            </div>
                            <div class="percentile-advice" style="padding: 8px; background: rgba(255,255,255,0.7); border-radius: 4px; font-size: 12px; line-height: 1.5;">
                                ${percentiles.advice}
                            </div>
                        </div>
                    </div>
                `;
            }
        }

        percentilesElement.innerHTML = percentilesHtml || '<div class="no-data">暂无数据</div>';
    } catch (error) {
        console.error('更新指数分位数失败:', error);
        percentilesElement.innerHTML = '<div class="error">加载失败</div>';
    }
}

// 真实PE/PB分位数计算（基于历史估值数据）
function calculateEnhancedPercentiles(indexData, indexCode) {
    const getPercentileClass = (value) => {
        if (value < 20) return 'percentile-low';
        if (value < 40) return 'percentile-medium-low';
        if (value < 60) return 'percentile-medium';
        if (value < 80) return 'percentile-medium-high';
        return 'percentile-high';
    };

    // 获取当前PE/PB
    const { pe: currentPE, pb: currentPB } = estimatePEPB(indexCode, indexData.now, indexData.changePercent);

    // 尝试使用真实历史数据计算PE/PB分位数
    const realPEPercentile = HistoricalDataManager.calculatePEPercentile(indexCode, currentPE);
    const realPBPercentile = HistoricalDataManager.calculatePBPercentile(indexCode, currentPB);

    let peValue, pbValue, isRealData = false, dataInfo = '';

    if (realPEPercentile && realPEPercentile.totalDays >= 30 && realPBPercentile && realPBPercentile.totalDays >= 30) {
        // 有足够的历史数据，使用真实分位数
        peValue = realPEPercentile.percentile;
        pbValue = realPBPercentile.percentile;
        isRealData = true;
        dataInfo = `基于${realPEPercentile.totalDays}天历史数据`;
    } else {
        // 历史数据不足，使用估算
        const changePercent = indexData.changePercent;
        const estimatedPercentile = 50 - (changePercent * 8);
        peValue = Math.max(5, Math.min(95, estimatedPercentile));
        pbValue = Math.max(5, Math.min(95, estimatedPercentile));

        const days = realPEPercentile?.totalDays || 0;
        dataInfo = days > 0 ? `仅${days}天数据，估算值` : '估算值（需积累数据）';
    }

    const avg = (peValue + pbValue) / 2;
    let level, advice, levelColor, bgGradient;

    if (avg < 20) {
        level = "极低估值";
        levelColor = "#34C759";
        advice = isRealData
            ? `💎 PE/PB历史分位仅${Math.round(avg)}%！这是难得的建仓机会，强烈建议分批买入。
               <br><small>当前PE ${currentPE}（${peValue}%分位），PB ${currentPB}（${pbValue}%分位）</small>`
            : "💎 估值偏低，可能是建仓机会（需积累历史数据验证）。";
        bgGradient = "#e8f5e9, #c8e6c9";
    } else if (avg < 35) {
        level = "偏低估值";
        levelColor = "#34C759";
        advice = isRealData
            ? `📈 PE/PB历史${Math.round(avg)}%分位，估值较低，可适量配置。
               <br><small>当前PE ${currentPE}（${peValue}%分位），PB ${currentPB}（${pbValue}%分位）</small>`
            : "📈 估值偏低，可适量配置。";
        bgGradient = "#f1f8f4, #dcedc8";
    } else if (avg < 50) {
        level = "合理估值";
        levelColor = "#FFB800";
        advice = isRealData
            ? `⚖️ PE/PB${Math.round(avg)}%分位，估值适中，建议持仓观望。
               <br><small>当前PE ${currentPE}，PB ${currentPB}</small>`
            : "⚖️ 估值适中，建议持仓观望，等待更好的买入时机。";
        bgGradient = "#fff9e6, #fff3cd";
    } else if (avg < 70) {
        level = "偏高估值";
        levelColor = "#FF9500";
        advice = isRealData
            ? `⚠️ PE/PB历史${Math.round(avg)}%分位，估值偏高。持仓者可考虑部分减仓。
               <br><small>当前PE ${currentPE}（${peValue}%分位），PB ${currentPB}（${pbValue}%分位）</small>`
            : "⚠️ 估值偏高，不建议追高。";
        bgGradient = "#fff3e0, #ffe0b2";
    } else {
        level = "高估区域";
        levelColor = "#FF3B30";
        advice = isRealData
            ? `🛑 PE/PB历史${Math.round(avg)}%分位！估值过高，强烈建议减仓保护利润！
               <br><small>当前PE ${currentPE}（${peValue}%分位），PB ${currentPB}（${pbValue}%分位）</small>`
            : "🛑 估值过高！建议减仓，保护利润。";
        bgGradient = "#ffebee, #ffcdd2";
    }

    return {
        pe: {
            value: Math.round(peValue),
            actual: currentPE,
            class: getPercentileClass(peValue)
        },
        pb: {
            value: Math.round(pbValue),
            actual: currentPB,
            class: getPercentileClass(pbValue)
        },
        level,
        levelColor,
        advice,
        bgGradient,
        isRealData,
        dataInfo
    };
}

// 优化版：更新市场情绪（使用VIX波动率指数计算）
async function updateMarketSentimentOptimized(indexDataMap) {
    const sentimentElement = document.getElementById('market-sentiment');
    if (!sentimentElement) return;

    try {
        // 获取中国VIX指数（类VIX波动率计算）
        let chinaVIX = null;
        try {
            chinaVIX = await getChinaVIXIndex();
            console.log('中国VIX指数:', chinaVIX);
        } catch (error) {
            console.warn('获取VIX指数失败:', error);
        }

        // 如果VIX获取失败，使用历史数据计算
        const realSentiment = chinaVIX ? null : HistoricalDataManager.calculateRealMarketSentiment(indexDataMap);

        const fearGreedIndex = chinaVIX
            ? calculateVIXBasedFearGreedIndex(chinaVIX)
            : calculateEnhancedFearGreedIndex(realSentiment, null);

        const buffettIndicator = calculateEnhancedBuffettIndicator(realSentiment || { fearGreedIndex: fearGreedIndex.value });

        const dataSource = chinaVIX
            ? '<span style="color: #0088FF;">📊 波动率指数</span>'
            : '<span style="color: #999;">○ 历史数据</span>';

        const confidenceBadge = chinaVIX
            ? '<span style="color: #34C759;">✓ 实时数据</span>'
            : realSentiment && realSentiment.confidence === 'high'
            ? '<span style="color: #34C759;">✓ 高可信度</span>'
            : realSentiment && realSentiment.confidence === 'medium'
            ? '<span style="color: #FFB800;">~ 中等可信度</span>'
            : '<span style="color: #999;">○ 需积累数据</span>';

        sentimentElement.innerHTML = `
            <div class="sentiment-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <!-- 恐慌贪婪指数 - 中国特色显示 -->
                <div class="sentiment-card" style="padding: 15px; border-radius: 8px; background: linear-gradient(to bottom, #FFF8E1, #FFECB3); border: 1px solid rgba(255, 152, 0, 0.2); text-align: center;">
                    <div class="sentiment-title" style="font-size: 12px; margin-bottom: 8px; color: #F57C00; font-weight: 600;">
                        恐慌贪婪指数 ${dataSource}
                    </div>
                    <div class="sentiment-value" style="font-size: 36px; font-weight: bold; color: #FF6B00; margin: 8px 0;">
                        ${fearGreedIndex.value}
                    </div>
                    <div class="sentiment-label" style="font-size: 13px; font-weight: 600; margin: 4px 0; color: ${fearGreedIndex.color};">
                        ${fearGreedIndex.label}
                    </div>
                    ${chinaVIX ? `
                        <div style="font-size: 11px; margin-top: 6px; color: #666;">
                            中国VIX: ${chinaVIX.vix}
                        </div>
                    ` : ''}
                </div>

                <!-- 市场估值温度 - 温度计风格 -->
                <div class="sentiment-card" style="padding: 15px; border-radius: 8px; background: linear-gradient(to bottom, #FFEBEE, #FFCDD2); border: 1px solid rgba(244, 67, 54, 0.2); text-align: center;">
                    <div class="sentiment-title" style="font-size: 12px; margin-bottom: 8px; color: #C62828; font-weight: 600;">
                        市场估值温度
                    </div>
                    <div class="sentiment-value" style="font-size: 36px; font-weight: bold; color: #FF1744; margin: 8px 0;">
                        ${buffettIndicator.value}°C
                    </div>
                    <div class="sentiment-label" style="font-size: 13px; font-weight: 600; margin: 4px 0; color: ${buffettIndicator.color};">
                        ${buffettIndicator.label}
                    </div>
                </div>
            </div>

            <div class="sentiment-analysis" style="margin-top: 15px; padding: 12px; background: rgba(0,0,0,0.03); border-radius: 8px; font-size: 13px; line-height: 1.6;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span style="font-weight: bold;">📊 综合分析</span>
                    <span style="font-size: 11px;">${confidenceBadge}</span>
                </div>
                <div>${fearGreedIndex.analysis}</div>
                ${chinaVIX ? `
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 12px; color: #0088FF;">
                        <strong>市场波动数据：</strong>平均涨跌 ${chinaVIX.avgChange}% |
                        日内波动率 ${chinaVIX.avgVolatility}% |
                        上涨比例 ${chinaVIX.upRatio}%
                    </div>
                ` : ''}
                ${realSentiment && realSentiment.confidence !== 'low' ? `
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(0,0,0,0.1); font-size: 12px;">
                        <strong>历史数据分析：</strong>市场宽度 ${realSentiment.breadth.toFixed(1)}% |
                        5日动量 ${realSentiment.momentum > 0 ? '+' : ''}${realSentiment.momentum.toFixed(2)}% |
                        波动率 ${realSentiment.volatility.toFixed(2)}%
                    </div>
                ` : ''}
            </div>
        `;
    } catch (error) {
        console.error('更新市场情绪失败:', error);
        sentimentElement.innerHTML = '<div class="error">加载失败</div>';
    }
}

// 基于中国VIX计算恐慌贪婪指数
function calculateVIXBasedFearGreedIndex(chinaVIX) {
    const index = chinaVIX.fearGreedIndex;
    const vix = chinaVIX.vix;
    let label, color, gradient, analysis;

    // 参考VIX解读标准：
    // VIX < 12: 极度贪婪（市场过于平静）
    // VIX 12-20: 正常（长期均值）
    // VIX 20-30: 恐慌开始
    // VIX > 30: 极度恐慌

    if (vix >= 50) {
        label = "极度恐慌";
        color = "#34C759";
        gradient = "#e8f5e9, #a5d6a7";
        analysis = `市场处于极度恐慌（中国VIX ${vix}），波动率${chinaVIX.avgVolatility}%远超正常水平。历史经验显示，当市场恐慌达到极值时，往往是最佳建仓时机。建议：分批买入优质资产，3-5年必有丰厚回报。`;
    } else if (vix >= 30) {
        label = "恐慌";
        color = "#34C759";
        gradient = "#f1f8f4, #c8e6c9";
        analysis = `市场恐慌情绪明显（中国VIX ${vix}），平均涨跌${chinaVIX.avgChange}%，日内波动${chinaVIX.avgVolatility}%。投资者信心不足，但危机往往孕育机会。建议：适量配置，不要恐慌性抛售，耐心等待反弹。`;
    } else if (vix >= 20) {
        label = "谨慎";
        color = "#FFB800";
        gradient = "#fff9e6, #ffecb3";
        analysis = `市场波动率${vix}接近长期均值20，显示一定不确定性。${chinaVIX.upRatio}%的指数上涨，市场方向不明朗。建议：观望为主，等待更清晰的信号。`;
    } else if (vix >= 12) {
        label = "平稳";
        color = "#FFB800";
        gradient = "#fff9e6, #ffecb3";
        analysis = `市场情绪平稳（中国VIX ${vix}），波动率${chinaVIX.avgVolatility}%处于健康区间。市场没有明显的恐慌或贪婪。建议：持仓观望，保持均衡配置。`;
    } else if (vix >= 8) {
        label = "贪婪";
        color = "#FF9500";
        gradient = "#fff3e0, #ffcc80";
        analysis = `市场贪婪情绪上升（中国VIX ${vix}），波动率偏低至${chinaVIX.avgVolatility}%。市场过于平静往往预示着即将到来的波动。建议：考虑逐步减仓，锁定利润，提高现金比例。`;
    } else {
        label = "极度贪婪";
        color = "#FF3B30";
        gradient = "#ffebee, #ef9a9a";
        analysis = `市场极度贪婪（中国VIX ${vix}）！波动率低至${chinaVIX.avgVolatility}%，市场过度乐观。历史显示，VIX极低时往往是风险最大的时候。建议：果断减仓，保护利润，留足现金等待调整。`;
    }

    return { value: index, label, color, gradient, analysis };
}

// 真实恐慌贪婪指数（基于历史数据+东方财富实时数据）
function calculateEnhancedFearGreedIndex(realSentiment, eastMoneyEmotion = null) {
    let index = realSentiment.fearGreedIndex;

    // 如果有东方财富数据，进行融合计算
    if (eastMoneyEmotion) {
        // 权重：历史数据60%，东方财富实时数据40%
        index = Math.round(index * 0.6 + eastMoneyEmotion.index * 0.4);
        index = Math.max(0, Math.min(100, index));
    }

    let label, color, gradient, analysis;

    if (index <= 20) {
        label = "极度恐慌";
        color = "#34C759";
        gradient = "#e8f5e9, #a5d6a7";
        analysis = eastMoneyEmotion
            ? `市场处于极度恐慌（综合指数${index}），东方财富实时数据显示${eastMoneyEmotion.upRatio}%的指数上涨，市场宽度${realSentiment.breadth.toFixed(0)}%。历史数据表明这往往是最佳建仓时机。建议：分批买入优质资产，长期持有必有收获。`
            : `市场处于极度恐慌（指数${index}），市场宽度仅${realSentiment.breadth.toFixed(0)}%，历史数据表明这往往是最佳建仓时机。建议：分批买入优质资产，长期持有必有收获。`;
    } else if (index <= 40) {
        label = "恐慌";
        color = "#34C759";
        gradient = "#f1f8f4, #c8e6c9";
        analysis = eastMoneyEmotion
            ? `市场恐慌情绪明显（综合指数${index}），东方财富数据平均涨跌${eastMoneyEmotion.avgChange}%，5日动量${realSentiment.momentum > 0 ? '+' : ''}${realSentiment.momentum.toFixed(1)}%。投资者信心不足，但危机往往孕育机会。建议：适量配置，不要恐慌性抛售。`
            : `市场恐慌情绪明显（指数${index}），5日动量${realSentiment.momentum > 0 ? '+' : ''}${realSentiment.momentum.toFixed(1)}%，投资者信心不足。但危机往往孕育机会，建议：适量配置，不要恐慌性抛售。`;
    } else if (index <= 60) {
        label = "中性";
        color = "#FFB800";
        gradient = "#fff9e6, #ffecb3";
        analysis = `市场情绪平稳（${eastMoneyEmotion ? '综合' : ''}指数${index}），无明显买卖信号。建议：持仓观望，等待更明确的趋势。`;
    } else if (index <= 80) {
        label = "贪婪";
        color = "#FF9500";
        gradient = "#fff3e0, #ffcc80";
        analysis = eastMoneyEmotion
            ? `市场贪婪情绪上升（综合指数${index}），东方财富显示${eastMoneyEmotion.upRatio}%指数上涨，市场宽度${realSentiment.breadth.toFixed(0)}%。追涨意愿强烈，需警惕回调风险。建议：考虑逐步减仓，锁定利润。`
            : `市场贪婪情绪上升（指数${index}），${realSentiment.breadth.toFixed(0)}%的指数上涨，追涨意愿强烈。需警惕回调风险，建议：考虑逐步减仓，锁定利润。`;
    } else {
        label = "极度贪婪";
        color = "#FF3B30";
        gradient = "#ffebee, #ef9a9a";
        analysis = eastMoneyEmotion
            ? `市场极度贪婪（综合指数${index}）！东方财富实时情绪指数${eastMoneyEmotion.index}，波动率${realSentiment.volatility.toFixed(1)}%。历史经验显示这时风险极大。建议：果断减仓，保护利润。`
            : `市场极度贪婪（指数${index}）！波动率${realSentiment.volatility.toFixed(1)}%，历史经验显示这时风险极大。建议：果断减仓，保护利润。`;
    }

    return { value: index, label, color, gradient, analysis };
}

// 市场估值温度（基于真实数据）
function calculateEnhancedBuffettIndicator(realSentiment) {
    // 基于恐慌贪婪指数计算温度（0-100°C）
    // 极度恐慌=0°C（冰点），极度贪婪=100°C（沸点）
    const temperature = realSentiment.fearGreedIndex;

    let label, color, gradient;

    if (temperature < 20) {
        label = "冰点";
        color = "#34C759";
        gradient = "#e8f5e9, #a5d6a7";
    } else if (temperature < 40) {
        label = "偏冷";
        color = "#34C759";
        gradient = "#f1f8f4, #c8e6c9";
    } else if (temperature < 60) {
        label = "适中";
        color = "#FFB800";
        gradient = "#fff9e6, #ffecb3";
    } else if (temperature < 80) {
        label = "偏热";
        color = "#FF9500";
        gradient = "#fff3e0, #ffcc80";
    } else {
        label = "沸点";
        color = "#FF3B30";
        gradient = "#ffebee, #ef9a9a";
    }

    return { value: temperature, label, color, gradient };
}

// ═══════════════════════════════════════════════════════════════
// 投资决策系统 - 知过去·知未来·知现在
// ═══════════════════════════════════════════════════════════════

/**
 * 加载风险分析
 */
async function loadRiskAnalysis(container) {
    try {
        const innerContainer = container.querySelector('#risk-analysis-container');
        if (!innerContainer) {
            console.error('找不到风险分析容器');
            return;
        }

        innerContainer.innerHTML = '<div class="loading">正在计算风险指标...</div>';

        // 获取基金数据
        const fundResults = await batchGetFundData(CONFIG.fundCodes);
        const fundDataMap = new Map(fundResults.filter(r => r.data).map(r => [r.code, r.data]));

        // 计算总览数据
        let totalValue = 0;
        let totalCost = 0;
        let maxHistoryValue = parseFloat(localStorage.getItem('maxHistoryValue') || '0');

        for (const code of CONFIG.fundCodes) {
            const fundData = fundDataMap.get(code);
            if (fundData) {
                const share = CONFIG.fundShares[code] || 0;
                const costPrice = CONFIG.costPrices[code] || 0;
                const currentPrice = parseFloat(fundData.gsz);

                const currentValue = share * currentPrice;
                const cost = share * costPrice;

                totalValue += currentValue;
                totalCost += cost;

                // 计算历史最高点（基于目标收益率推算）
                const targetYield = CONFIG.fundTargetYields[code] || 10;
                const maxPrice = costPrice * (1 + targetYield / 100);
                const maxValue = share * maxPrice;
                maxHistoryValue += maxValue;
            }
        }

        // 更新历史最高市值
        if (totalValue > maxHistoryValue) {
            maxHistoryValue = totalValue;
            localStorage.setItem('maxHistoryValue', maxHistoryValue.toString());
        }

        // 计算整体风险指标
        const portfolioMetrics = calculatePortfolioMetrics(fundDataMap, totalValue, totalCost, maxHistoryValue);

        // 渲染风险分析界面
        const html = `
            <div class="star-section">
                <div style="padding: 16px; background: linear-gradient(135deg, #f5f7fa, #e8f0fe); border-radius: 8px;">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 12px; color: #1a73e8; display: flex; justify-content: space-between; align-items: center;">
                        <span>📊 整体风险分析</span>
                        <span style="font-size: 12px; color: #666; font-weight: normal;">${CONFIG.fundCodes.length}只基金</span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 12px;">
                        <div class="metric-card" data-metric="maxDrawdown" style="text-align: center; padding: 12px; background: rgba(255,255,255,0.8); border-radius: 8px; cursor: help; transition: all 0.2s;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                最大回撤
                                <span style="font-size: 11px; color: #999;">ℹ️</span>
                            </div>
                            <div style="font-size: 18px; font-weight: bold; color: ${portfolioMetrics.maxDrawdown > 25 ? '#FF6B6B' : portfolioMetrics.maxDrawdown > 15 ? '#FFB800' : '#34C759'};">
                                -${portfolioMetrics.maxDrawdown.toFixed(2)}%
                            </div>
                        </div>

                        <div class="metric-card" data-metric="volatility" style="text-align: center; padding: 12px; background: rgba(255,255,255,0.8); border-radius: 8px; cursor: help; transition: all 0.2s;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                组合波动率
                                <span style="font-size: 11px; color: #999;">ℹ️</span>
                            </div>
                            <div style="font-size: 18px; font-weight: bold; color: ${portfolioMetrics.volatility > 20 ? '#FF6B6B' : portfolioMetrics.volatility > 12 ? '#FFB800' : '#34C759'};">
                                ${portfolioMetrics.volatility.toFixed(2)}%
                            </div>
                        </div>

                        <div class="metric-card" data-metric="sharpe" style="text-align: center; padding: 12px; background: rgba(255,255,255,0.8); border-radius: 8px; cursor: help; transition: all 0.2s;">
                            <div style="font-size: 12px; color: #666; margin-bottom: 6px; display: flex; align-items: center; justify-content: center; gap: 4px;">
                                夏普比率
                                <span style="font-size: 11px; color: #999;">ℹ️</span>
                            </div>
                            <div style="font-size: 18px; font-weight: bold; color: ${portfolioMetrics.sharpe > 1 ? '#34C759' : portfolioMetrics.sharpe > 0.5 ? '#FFB800' : '#FF6B6B'};">
                                ${portfolioMetrics.sharpe.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    <div style="background: rgba(255,255,255,0.95); padding: 12px; border-radius: 8px; border-left: 4px solid ${portfolioMetrics.riskLevel.color};">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 6px; color: ${portfolioMetrics.riskLevel.color};">
                            ${portfolioMetrics.riskLevel.text}
                        </div>
                        <div style="font-size: 12px; color: #666; line-height: 1.5;">
                            ${portfolioMetrics.suggestion}
                        </div>
                    </div>
                </div>
            </div>

            <div class="star-section">
                <h4>基金持仓情况</h4>
                <div id="fund-holdings-list">
                    ${Array.from(fundDataMap.entries()).map(([code, fundData]) => {
                        const share = CONFIG.fundShares[code] || 0;
                        const costPrice = CONFIG.costPrices[code] || 0;
                        const currentPrice = parseFloat(fundData.gsz);
                        const currentValue = share * currentPrice;
                        const cost = share * costPrice;
                        const profitLoss = currentValue - cost;
                        const currentYield = cost !== 0 ? (profitLoss / cost * 100) : 0;
                        const weight = totalValue > 0 ? (currentValue / totalValue * 100) : 0;

                        return `
                            <div style="padding: 12px; background: white; border-radius: 8px; margin-bottom: 10px; border-left: 3px solid ${currentYield >= 0 ? '#34C759' : '#FF6B6B'};">
                                <div style="font-weight: bold; margin-bottom: 8px; font-size: 13px;">
                                    ${fundData.name || code}
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 12px; color: #666;">
                                    <div>持仓金额: <span style="color: #333;">¥${currentValue.toFixed(2)}</span></div>
                                    <div>持仓占比: <span style="color: #333;">${weight.toFixed(1)}%</span></div>
                                    <div>持仓收益: <span style="color: ${currentYield >= 0 ? '#34C759' : '#FF6B6B'};">${profitLoss >= 0 ? '+' : ''}¥${profitLoss.toFixed(2)}</span></div>
                                    <div>收益率: <span style="color: ${currentYield >= 0 ? '#34C759' : '#FF6B6B'};">${currentYield >= 0 ? '+' : ''}${currentYield.toFixed(2)}%</span></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        innerContainer.innerHTML = html;

        // 初始化悬浮提示
        initMetricTooltips();

    } catch (error) {
        console.error('加载风险分析失败:', error);
        const innerContainer = container.querySelector('#risk-analysis-container');
        if (innerContainer) {
            innerContainer.innerHTML = `
                <div class="error" style="padding: 20px; text-align: center; color: #ff6b6b;">
                    <p>😕 加载失败</p>
                    <p style="font-size: 12px; margin-top: 8px;">${error.message}</p>
                </div>
            `;
        }
    }
}

/**
 * 加载决策中心
 */
// 加载整体风险分析
async function loadRiskAnalysis(container) {
    try {
        const innerContainer = container.querySelector('#portfolio-risk-container') || container.querySelector('#risk-analysis-container');
        if (!innerContainer) {
            console.error('找不到风险分析容器');
            return;
        }

        innerContainer.innerHTML = '<div class="loading">正在分析组合风险...</div>';

        console.log('开始加载风险分析数据...');

        // 获取基金数据
        const fundResults = await batchGetFundData(CONFIG.fundCodes || []);

        // 转换为Map
        const fundDataMap = new Map();
        if (fundResults && Array.isArray(fundResults)) {
            fundResults.forEach(result => {
                if (result && result.data) {
                    fundDataMap.set(result.code, result.data);
                }
            });
        }

        if (fundDataMap.size === 0) {
            innerContainer.innerHTML = `
                <div class="no-data-panel" style="padding: 40px 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px;">
                        暂无基金数据
                    </div>
                    <div style="font-size: 13px; color: #999;">
                        请先在设置中添加基金
                    </div>
                </div>
            `;
            return;
        }

        // 计算组合数据
        let totalValue = 0;
        let totalCost = 0;
        let maxHistoryValue = parseFloat(localStorage.getItem('maxHistoryValue') || '0');

        for (const code of CONFIG.fundCodes) {
            const fundData = fundDataMap.get(code);
            if (fundData) {
                const share = CONFIG.fundShares[code] || 0;
                const costPrice = CONFIG.costPrices[code] || 0;
                const currentPrice = parseFloat(fundData.gsz);

                const currentValue = share * currentPrice;
                const cost = share * costPrice;

                totalValue += currentValue;
                totalCost += cost;

                // 计算历史最高点
                const targetYield = CONFIG.fundTargetYields[code] || 10;
                const maxPrice = costPrice * (1 + targetYield / 100);
                const maxValue = share * maxPrice;
                maxHistoryValue += maxValue;
            }
        }

        // 计算风险指标和各基金贡献度
        const portfolioMetrics = calculatePortfolioMetrics(fundDataMap, totalValue, totalCost, maxHistoryValue);

        // 计算各基金对指标的贡献
        const fundContributions = [];
        for (const code of CONFIG.fundCodes) {
            const fundData = fundDataMap.get(code);
            if (fundData) {
                const share = CONFIG.fundShares[code] || 0;
                const costPrice = CONFIG.costPrices[code] || 0;
                const currentPrice = parseFloat(fundData.gsz);
                const currentValue = share * currentPrice;
                const cost = share * costPrice;
                const profitLoss = currentValue - cost;
                const currentYield = cost !== 0 ? (profitLoss / cost * 100) : 0;
                const weight = totalValue > 0 ? (currentValue / totalValue * 100) : 0;

                // 估算单基金波动率
                const fundType = fundData.name.includes('债') ? 'bond' :
                                fundData.name.includes('混合') ? 'mixed' : 'stock';
                const baseVolatility = fundType === 'bond' ? 5 :
                                      fundType === 'mixed' ? 15 : 20;
                const gszzl = Math.abs(parseFloat(fundData.gszzl));
                const volatility = baseVolatility * (1 + gszzl / 10);

                // 计算回撤贡献（当前亏损的占比）
                const drawdownContribution = currentYield < 0 ? Math.abs(currentYield) * weight / 100 : 0;

                fundContributions.push({
                    code,
                    name: fundData.name,
                    weight,
                    currentYield,
                    volatility,
                    drawdownContribution,
                    volatilityContribution: volatility * weight / 100
                });
            }
        }

        // 按权重排序
        fundContributions.sort((a, b) => b.weight - a.weight);

        // 获取指标排名
        const getRankInfo = (value, thresholds, isReverse = false) => {
            if (isReverse) {
                if (value < thresholds[0]) return { rank: '优秀', color: '#34C759' };
                if (value < thresholds[1]) return { rank: '良好', color: '#52c41a' };
                if (value < thresholds[2]) return { rank: '中等', color: '#FFB800' };
                if (value < thresholds[3]) return { rank: '偏高', color: '#FF9500' };
                return { rank: '较差', color: '#FF6B6B' };
            } else {
                if (value >= thresholds[3]) return { rank: '优秀', color: '#34C759' };
                if (value >= thresholds[2]) return { rank: '良好', color: '#52c41a' };
                if (value >= thresholds[1]) return { rank: '中等', color: '#FFB800' };
                if (value >= thresholds[0]) return { rank: '偏差', color: '#FF9500' };
                return { rank: '较差', color: '#FF6B6B' };
            }
        };

        const drawdownRank = getRankInfo(portfolioMetrics.maxDrawdown, [10, 15, 20, 25], true);
        const volatilityRank = getRankInfo(portfolioMetrics.volatility, [10, 12, 15, 20], true);
        const sharpeRank = getRankInfo(portfolioMetrics.sharpe, [0, 0.5, 1.0, 1.5], false);

        // 渲染风险分析界面
        const html = `
            <div class="risk-analysis-panel">
                <!-- 整体评级 -->
                <div class="star-section">
                    <div style="padding: 16px; background: rgba(0, 0, 0, 0.02); border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 13px; color: #999;">整体风险评级</div>
                                <div style="font-size: 18px; font-weight: bold; color: ${portfolioMetrics.riskLevel.color}; margin-top: 4px;">
                                    ${portfolioMetrics.riskLevel.text}
                                </div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 13px; color: #999;">持仓基金</div>
                                <div style="font-size: 18px; font-weight: bold; color: #333; margin-top: 4px;">${CONFIG.fundCodes.length} 只</div>
                            </div>
                        </div>
                        <div style="font-size: 12px; color: #666; line-height: 1.6; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.05);">
                            💡 ${portfolioMetrics.suggestion}
                        </div>
                    </div>
                </div>

                <!-- 最大回撤 -->
                <div class="star-section">
                    <h4>📉 最大回撤</h4>
                    <div style="padding: 16px; background: rgba(0, 0, 0, 0.02); border-radius: 8px; margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 13px; color: #666; margin-bottom: 4px;">📉 最大回撤 Max Drawdown</div>
                                <div style="font-size: 12px; color: #999;">从组合最高点到当前的最大跌幅</div>
                            </div>
                            <div style="background: ${drawdownRank.rankColor}20; color: ${drawdownRank.rankColor}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                ${drawdownRank.rank}
                            </div>
                        </div>
                        <div style="font-size: 36px; font-weight: bold; color: ${drawdownRank.rankColor}; margin: 12px 0;">
                            -${portfolioMetrics.maxDrawdown.toFixed(2)}%
                        </div>
                        <div style="background: #f5f5f5; border-radius: 8px; height: 8px; overflow: hidden; margin-bottom: 12px;">
                            <div style="background: ${drawdownRank.rankColor}; height: 100%; width: ${Math.min(portfolioMetrics.maxDrawdown * 2, 100)}%; transition: width 0.5s;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-bottom: 12px;">
                            <span>0%</span>
                            <span style="color: #666; font-weight: bold;">当前: -${portfolioMetrics.maxDrawdown.toFixed(2)}%</span>
                            <span>-50%</span>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; border-left: 3px solid ${drawdownRank.rankColor};">
                            <div style="font-size: 12px; color: #333; font-weight: 500; margin-bottom: 6px;">📊 风险等级评估</div>
                            <div style="font-size: 11px; color: #666; line-height: 1.6;">
                                ${portfolioMetrics.maxDrawdown < 10 ? '✅ 表现优异，回撤控制出色，组合抗风险能力强' :
                                  portfolioMetrics.maxDrawdown < 15 ? '✅ 表现良好，小幅回撤在正常范围内' :
                                  portfolioMetrics.maxDrawdown < 20 ? '⚠️ 中等回撤，建议关注市场变化' :
                                  portfolioMetrics.maxDrawdown < 25 ? '⚠️ 回撤偏大，需要加强风险控制' :
                                  '🔴 回撤严重，建议重新审视资产配置'}
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #e3f2fd, #bbdefb); border-radius: 6px;">
                            <div style="font-size: 11px; color: #1976d2; line-height: 1.5;">
                                <div><strong>参考标准：</strong></div>
                                <div>🟢 优秀 < 10% | 🟡 良好 10-15% | 🟠 中等 15-20% | 🔴 偏高 > 20%</div>
                            </div>
                        </div>

                        <!-- 基金回撤贡献分析 -->
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <div style="font-size: 12px; font-weight: bold; color: #333; margin-bottom: 8px;">📊 回撤贡献分析</div>
                            ${fundContributions.filter(f => f.drawdownContribution > 0).length > 0 ?
                                fundContributions.filter(f => f.drawdownContribution > 0).slice(0, 3).map(fund => `
                                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,107,107,0.05); border-radius: 6px; margin-bottom: 6px;">
                                        <div style="flex: 1;">
                                            <div style="font-size: 12px; color: #333; font-weight: 500;">${fund.name}</div>
                                            <div style="font-size: 11px; color: #999; margin-top: 2px;">持仓占比 ${fund.weight.toFixed(1)}%</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="font-size: 14px; font-weight: bold; color: #FF6B6B;">${fund.currentYield.toFixed(2)}%</div>
                                            <div style="font-size: 11px; color: #999;">贡献 ${fund.drawdownContribution.toFixed(2)}%</div>
                                        </div>
                                    </div>
                                `).join('')
                                : '<div style="font-size: 12px; color: #52c41a; padding: 8px; background: rgba(82,196,26,0.05); border-radius: 6px;">✅ 所有基金均为盈利状态，无回撤贡献</div>'
                            }
                        </div>
                    </div>
                </div>

                <!-- 组合波动率 -->
                <div class="star-section">
                    <h4>📊 组合波动率</h4>
                    <div class="metric-card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${volatilityRank.rankColor}; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 13px; color: #666; margin-bottom: 4px;">📊 组合波动率 Volatility</div>
                                <div style="font-size: 12px; color: #999;">收益率的波动程度，反映整体风险</div>
                            </div>
                            <div style="background: ${volatilityRank.rankColor}20; color: ${volatilityRank.rankColor}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                ${volatilityRank.rank}
                            </div>
                        </div>
                        <div style="font-size: 36px; font-weight: bold; color: ${volatilityRank.rankColor}; margin: 12px 0;">
                            ${portfolioMetrics.volatility.toFixed(2)}%
                        </div>
                        <div style="background: #f5f5f5; border-radius: 8px; height: 8px; overflow: hidden; margin-bottom: 12px;">
                            <div style="background: ${volatilityRank.rankColor}; height: 100%; width: ${Math.min(portfolioMetrics.volatility * 2.5, 100)}%; transition: width 0.5s;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-bottom: 12px;">
                            <span>0%</span>
                            <span style="color: #666; font-weight: bold;">当前: ${portfolioMetrics.volatility.toFixed(2)}%</span>
                            <span>40%</span>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; border-left: 3px solid ${volatilityRank.rankColor};">
                            <div style="font-size: 12px; color: #333; font-weight: 500; margin-bottom: 6px;">📊 稳定性评估</div>
                            <div style="font-size: 11px; color: #666; line-height: 1.6;">
                                ${portfolioMetrics.volatility < 10 ? '✅ 低波动，组合非常稳健，适合保守型投资者' :
                                  portfolioMetrics.volatility < 12 ? '✅ 温和波动，风险适中，适合稳健型投资者' :
                                  portfolioMetrics.volatility < 15 ? '⚠️ 中等波动，需要一定风险承受能力' :
                                  portfolioMetrics.volatility < 20 ? '⚠️ 波动较大，适合积极型投资者' :
                                  '🔴 高波动，风险较高，需要强承受能力'}
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #fff8e1, #ffecb3); border-radius: 6px;">
                            <div style="font-size: 11px; color: #f57c00; line-height: 1.5;">
                                <div><strong>参考标准：</strong></div>
                                <div>🟢 低波 < 10% | 🟡 温和 10-12% | 🟠 中等 12-20% | 🔴 高波 > 20%</div>
                            </div>
                        </div>

                        <!-- 基金波动率贡献分析 -->
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(0,0,0,0.1);">
                            <div style="font-size: 12px; font-weight: bold; color: #333; margin-bottom: 8px;">📊 波动率贡献分析（Top 3）</div>
                            ${fundContributions.sort((a, b) => b.volatilityContribution - a.volatilityContribution).slice(0, 3).map(fund => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: ${fund.volatility > 15 ? 'rgba(255,149,0,0.05)' : 'rgba(0,0,0,0.02)'}; border-radius: 6px; margin-bottom: 6px;">
                                    <div style="flex: 1;">
                                        <div style="font-size: 12px; color: #333; font-weight: 500;">${fund.name}</div>
                                        <div style="font-size: 11px; color: #999; margin-top: 2px;">持仓占比 ${fund.weight.toFixed(1)}%</div>
                                    </div>
                                    <div style="text-align: right;">
                                        <div style="font-size: 14px; font-weight: bold; color: ${fund.volatility > 15 ? '#FF9500' : '#666'};">${fund.volatility.toFixed(1)}%</div>
                                        <div style="font-size: 11px; color: #999;">贡献 ${fund.volatilityContribution.toFixed(2)}%</div>
                                    </div>
                                </div>
                            `).join('')}
                            <div style="margin-top: 8px; padding: 8px; background: rgba(255,248,225,0.3); border-radius: 6px; font-size: 11px; color: #666;">
                                💡 <strong>优化建议：</strong>${
                                    fundContributions.filter(f => f.volatility > 20).length > 0
                                    ? '高波动基金过多，建议降低配置或增加债券型基金平衡风险'
                                    : fundContributions.filter(f => f.volatility > 15).length > 1
                                    ? '存在多只中高波动基金，可适当分散投资风格'
                                    : '波动率分布较为合理，继续保持'
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 夏普比率 -->
                <div class="star-section">
                    <h4>⚖️ 夏普比率</h4>
                    <div class="metric-card" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); border-left: 4px solid ${sharpeRank.rankColor}; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 16px rgba(0,0,0,0.12)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.08)'">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                            <div>
                                <div style="font-size: 13px; color: #666; margin-bottom: 4px;">⚖️ 夏普比率 Sharpe Ratio</div>
                                <div style="font-size: 12px; color: #999;">每承担1单位风险获得的超额收益</div>
                            </div>
                            <div style="background: ${sharpeRank.rankColor}20; color: ${sharpeRank.rankColor}; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                ${sharpeRank.rank}
                            </div>
                        </div>
                        <div style="font-size: 36px; font-weight: bold; color: ${sharpeRank.rankColor}; margin: 12px 0;">
                            ${portfolioMetrics.sharpe.toFixed(2)}
                        </div>
                        <div style="background: #f5f5f5; border-radius: 8px; height: 8px; overflow: hidden; margin-bottom: 12px;">
                            <div style="background: ${sharpeRank.rankColor}; height: 100%; width: ${Math.max(0, Math.min((portfolioMetrics.sharpe + 1) * 33.33, 100))}%; transition: width 0.5s;"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px; color: #999; margin-bottom: 12px;">
                            <span>-1.0</span>
                            <span style="color: #666; font-weight: bold;">当前: ${portfolioMetrics.sharpe.toFixed(2)}</span>
                            <span>2.0</span>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; border-left: 3px solid ${sharpeRank.rankColor};">
                            <div style="font-size: 12px; color: #333; font-weight: 500; margin-bottom: 6px;">📊 收益质量评估</div>
                            <div style="font-size: 11px; color: #666; line-height: 1.6;">
                                ${portfolioMetrics.sharpe > 1.5 ? '⭐⭐⭐ 卓越！风险调整后收益极优，资产配置合理' :
                                  portfolioMetrics.sharpe > 1.0 ? '⭐⭐ 优秀！风险收益平衡很好，值得保持' :
                                  portfolioMetrics.sharpe > 0.5 ? '⭐ 良好，基本合格，有优化空间' :
                                  portfolioMetrics.sharpe > 0 ? '⚠️ 一般，收益不足以弥补风险' :
                                  '❌ 较差，组合处于亏损状态，需要调整'}
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding: 10px; background: linear-gradient(135deg, #f3e5f5, #e1bee7); border-radius: 6px;">
                            <div style="font-size: 11px; color: #7b1fa2; line-height: 1.5;">
                                <div><strong>参考标准：</strong></div>
                                <div>⭐⭐⭐ 卓越 > 1.5 | ⭐⭐ 优秀 1.0-1.5 | ⭐ 良好 0.5-1.0 | ⚠️ 一般 < 0.5</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 综合评估 -->
                <div class="risk-summary" style="background: linear-gradient(135deg, ${portfolioMetrics.riskLevel.color}15, ${portfolioMetrics.riskLevel.color}05); padding: 20px; border-radius: 12px; border: 2px solid ${portfolioMetrics.riskLevel.color}30; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                        <div style="width: 48px; height: 48px; background: ${portfolioMetrics.riskLevel.color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                            🎯
                        </div>
                        <div style="flex: 1;">
                            <div style="font-size: 16px; font-weight: bold; color: ${portfolioMetrics.riskLevel.color}; margin-bottom: 4px;">
                                ${portfolioMetrics.riskLevel.text}
                            </div>
                            <div style="font-size: 12px; color: #666;">
                                基于三项核心指标的综合评定
                            </div>
                        </div>
                    </div>
                    <div style="background: white; padding: 16px; border-radius: 8px; font-size: 13px; color: #333; line-height: 1.8; border-left: 4px solid ${portfolioMetrics.riskLevel.color};">
                        <strong>💡 投资建议：</strong>${portfolioMetrics.suggestion}
                    </div>
                </div>

                <!-- 详细说明 -->
                <div class="risk-explanation" style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    <h4 style="font-size: 15px; font-weight: bold; color: #333; margin: 0 0 16px 0; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 20px;">📚</span>
                        指标详解与优化建议
                    </h4>
                    <div style="display: grid; gap: 12px;">
                        <div style="background: #f8f9fa; padding: 14px; border-radius: 8px; border-left: 3px solid #667eea;">
                            <div style="font-size: 12px; font-weight: bold; color: #333; margin-bottom: 6px;">
                                📉 最大回撤 (越小越好)
                            </div>
                            <div style="font-size: 11px; color: #666; line-height: 1.6;">
                                衡量组合从历史最高点下跌的最大幅度。回撤越小，说明组合抗风险能力越强。<br>
                                <strong>优化建议：</strong>增加债券基金配置，分散投资风格，避免过度集中。
                            </div>
                        </div>
                        <div style="background: #f8f9fa; padding: 14px; border-radius: 8px; border-left: 3px solid #f59e0b;">
                            <div style="font-size: 12px; font-weight: bold; color: #333; margin-bottom: 6px;">
                                📊 组合波动率 (越小越好)
                            </div>
                            <div style="font-size: 11px; color: #666; line-height: 1.6;">
                                反映组合收益的不确定性。波动率越低，收益越稳定。<br>
                                <strong>优化建议：</strong>平衡股债比例，避免高波动行业集中，考虑定投平滑波动。
                            </div>
                        </div>
                        <div style="background: #f8f9fa; padding: 14px; border-radius: 8px; border-left: 3px solid #10b981;">
                            <div style="font-size: 12px; font-weight: bold; color: #333; margin-bottom: 6px;">
                                ⚖️ 夏普比率 (越大越好)
                            </div>
                            <div style="font-size: 11px; color: #666; line-height: 1.6;">
                                衡量承担单位风险所获得的超额回报。>1.0表示风险收益比合理。<br>
                                <strong>优化建议：</strong>提升收益率或降低波动率，选择优质基金，及时止盈止损。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        innerContainer.innerHTML = html;
        console.log('风险分析渲染完成');

    } catch (error) {
        console.error('加载风险分析失败:', error);
        const innerContainer = container.querySelector('#portfolio-risk-container') || container.querySelector('#risk-analysis-container');
        if (innerContainer) {
            innerContainer.innerHTML = `
                <div class="error" style="padding: 20px; text-align: center;">
                    <div style="font-size: 16px; color: #FF3B30; margin-bottom: 8px;">加载失败</div>
                    <div style="font-size: 12px; color: #999;">${error.message}</div>
                </div>
            `;
        }
    }
}

async function loadDecisionCenter(container) {
    try {
        const innerContainer = container.querySelector('#decision-center-container');
        if (!innerContainer) {
            console.error('找不到决策中心容器');
            return;
        }

        innerContainer.innerHTML = '<div class="loading">正在分析市场数据...</div>';

        console.log('开始加载决策中心数据...');

        // 获取市场数据
        const [indexResults, fundResults] = await Promise.all([
            batchGetIndexData([INDEX_CODES.SH000001, INDEX_CODES.SZ399006, INDEX_CODES.SH300]),
            batchGetFundData(CONFIG.fundCodes || ['000001'])
        ]);

        console.log('原始数据获取成功:', { indexResults, fundResults });

        // 将数组转换为Map
        const indexDataMap = new Map();
        if (indexResults && Array.isArray(indexResults)) {
            indexResults.forEach(result => {
                if (result && result.data) {
                    indexDataMap.set(result.code, result.data);
                }
            });
        }

        const fundDataMap = new Map();
        if (fundResults && Array.isArray(fundResults)) {
            fundResults.forEach(result => {
                if (result && result.data) {
                    fundDataMap.set(result.code, result.data);
                }
            });
        }

        console.log('数据转换完成:', {
            indexCount: indexDataMap.size,
            fundCount: fundDataMap.size
        });

        // 检查数据
        if (indexDataMap.size === 0) {
            throw new Error('指数数据获取失败');
        }

        // 计算市场指标
        const sh000001 = indexDataMap.get(INDEX_CODES.SH000001);
        if (!sh000001) {
            throw new Error('上证指数数据不存在');
        }

        const marketData = calculateMarketData(sh000001, indexDataMap);
        console.log('市场数据计算完成:', marketData);

        // 渲染决策中心
        const html = renderDecisionCenter(marketData, fundDataMap);
        innerContainer.innerHTML = html;

        console.log('决策中心渲染完成');

        // 绑定交互事件
        bindDecisionCenterEvents(innerContainer, marketData);

    } catch (error) {
        console.error('加载决策中心失败:', error);
        console.error('错误堆栈:', error.stack);
        const innerContainer = container.querySelector('#decision-center-container');
        if (innerContainer) {
            innerContainer.innerHTML = `
                <div class="error" style="padding: 20px; text-align: center;">
                    <div style="font-size: 16px; color: #FF3B30; margin-bottom: 8px;">加载失败</div>
                    <div style="font-size: 12px; color: #999; margin-bottom: 12px;">${error.message}</div>
                    <button onclick="location.reload()" style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        重新加载
                    </button>
                </div>
            `;
        }
    }
}

/**
 * 计算市场数据
 */
function calculateMarketData(mainIndex, indexDataMap) {
    const { pe: currentPE, pb: currentPB } = estimatePEPB(INDEX_CODES.SH000001, mainIndex.now, mainIndex.changePercent);

    // 计算PE/PB分位数
    const realPEPercentile = HistoricalDataManager.calculatePEPercentile(INDEX_CODES.SH000001, currentPE);
    const realPBPercentile = HistoricalDataManager.calculatePBPercentile(INDEX_CODES.SH000001, currentPB);

    const pePercentile = realPEPercentile && realPEPercentile.totalDays >= 30
        ? realPEPercentile.percentile
        : Math.max(5, Math.min(95, 50 - mainIndex.changePercent * 8));

    const pbPercentile = realPBPercentile && realPBPercentile.totalDays >= 30
        ? realPBPercentile.percentile
        : Math.max(5, Math.min(95, 50 - mainIndex.changePercent * 8));

    // 计算市场情绪
    const realSentiment = HistoricalDataManager.calculateRealMarketSentiment(indexDataMap);
    const marketSentiment = realSentiment.fearGreedIndex;

    return {
        indexValue: mainIndex.now,
        indexChange: mainIndex.changePercent,
        currentPE: currentPE.toFixed(2),
        currentPB: currentPB.toFixed(2),
        pePercentile: Math.round(pePercentile),
        pbPercentile: Math.round(pbPercentile),
        marketSentiment: Math.round(marketSentiment),
        profitProbability1Year: estimateProfitProbability(pePercentile),
        realSentiment: realSentiment
    };
}

/**
 * 估算盈利概率
 */
function estimateProfitProbability(pePercentile) {
    if (pePercentile < 20) return 93;
    if (pePercentile < 40) return 82;
    if (pePercentile < 60) return 68;
    if (pePercentile < 80) return 55;
    return 42;
}

/**
 * 渲染决策中心
 */
function renderDecisionCenter(marketData, fundDataMap) {
    // 计算决策评分
    const decisionScore = calculateDecisionScore(marketData);

    return `
        <div class="decision-dashboard">
            ${renderDecisionScoreCard(decisionScore, marketData)}
            ${renderMarketDiagnosisCard(marketData)}
            ${renderFutureExpectationCard(marketData)}
            ${renderTodayActionsCard(marketData, fundDataMap)}
        </div>
    `;
}

/**
 * 计算决策评分
 */
function calculateDecisionScore(marketData) {
    const { pePercentile, pbPercentile, marketSentiment, profitProbability1Year } = marketData;
    const avgPercentile = (pePercentile + pbPercentile) / 2;

    // 1. 估值吸引力 (30%)
    let valuationScore = 0;
    if (avgPercentile < 20) valuationScore = 10;
    else if (avgPercentile < 30) valuationScore = 9;
    else if (avgPercentile < 40) valuationScore = 7.5;
    else if (avgPercentile < 50) valuationScore = 6;
    else if (avgPercentile < 60) valuationScore = 4.5;
    else if (avgPercentile < 70) valuationScore = 3;
    else if (avgPercentile < 80) valuationScore = 1.5;
    else valuationScore = 0.5;

    // 2. 市场情绪 (20%)
    let sentimentScore = 0;
    if (marketSentiment < 25) sentimentScore = 10;
    else if (marketSentiment < 35) sentimentScore = 8.5;
    else if (marketSentiment < 45) sentimentScore = 7;
    else if (marketSentiment < 55) sentimentScore = 5.5;
    else if (marketSentiment < 65) sentimentScore = 4;
    else if (marketSentiment < 75) sentimentScore = 2.5;
    else sentimentScore = 1;

    // 3. 历史胜率 (25%)
    let winRateScore = 0;
    if (profitProbability1Year >= 90) winRateScore = 10;
    else if (profitProbability1Year >= 80) winRateScore = 8.5;
    else if (profitProbability1Year >= 70) winRateScore = 7;
    else if (profitProbability1Year >= 60) winRateScore = 5.5;
    else if (profitProbability1Year >= 50) winRateScore = 4;
    else winRateScore = 2;

    // 4. 风险控制 (15%)
    const riskScore = avgPercentile < 30 ? 9 : avgPercentile < 50 ? 7 : avgPercentile < 70 ? 5 : 3;

    // 5. 资金成本 (10%)
    const costScore = 6;

    const totalScore = (valuationScore * 0.30) + (sentimentScore * 0.20) +
                      (winRateScore * 0.25) + (riskScore * 0.15) + (costScore * 0.10);

    let rating, action;
    if (totalScore >= 9) {
        rating = { stars: 5, text: '强烈买入', emoji: '⭐⭐⭐⭐⭐' };
        action = 'buy_strong';
    } else if (totalScore >= 7) {
        rating = { stars: 4, text: '买入', emoji: '⭐⭐⭐⭐' };
        action = 'buy';
    } else if (totalScore >= 5) {
        rating = { stars: 3, text: '持有', emoji: '⭐⭐⭐' };
        action = 'hold';
    } else if (totalScore >= 3) {
        rating = { stars: 2, text: '减仓', emoji: '⭐⭐' };
        action = 'reduce';
    } else {
        rating = { stars: 1, text: '卖出', emoji: '⭐' };
        action = 'sell';
    }

    return {
        totalScore: parseFloat(totalScore.toFixed(1)),
        rating: rating,
        action: action,
        breakdown: {
            valuation: valuationScore,
            sentiment: sentimentScore,
            winRate: winRateScore,
            risk: riskScore,
            cost: costScore
        }
    };
}

/**
 * 渲染决策评分卡片
 */
function renderDecisionScoreCard(scoreData, marketData) {
    const { totalScore, rating } = scoreData;
    const progressWidth = (totalScore / 10) * 100;
    const progressColor = totalScore >= 8 ? '#34C759' :
                         totalScore >= 6 ? '#FFB800' :
                         totalScore >= 4 ? '#FF9500' : '#FF3B30';

    return `
        <div class="decision-card">
            <div class="card-header">
                <h4>🎯 综合决策评分</h4>
            </div>
            <div class="card-content">
                <div class="score-display">
                    <div class="score-bar" style="width: 100%; height: 32px; background: #f0f0f0; border-radius: 16px; overflow: hidden; margin: 12px 0;">
                        <div style="width: ${progressWidth}%; height: 100%; background: ${progressColor}; display: flex; align-items: center; justify-content: center; transition: width 0.3s ease; border-radius: 16px;">
                            <span style="color: #fff; font-weight: bold; font-size: 16px;">${totalScore}/10</span>
                        </div>
                    </div>
                    <div style="text-align: center; margin: 12px 0;">
                        <span style="font-size: 20px; margin-right: 8px;">${rating.emoji}</span>
                        <span style="font-size: 16px; font-weight: bold; color: ${progressColor};">${rating.text}</span>
                    </div>
                </div>
                <div class="score-details">
                    <div class="detail-item">
                        <span>估值吸引力</span>
                        <span style="color: ${progressColor}; font-weight: bold;">${scoreData.breakdown.valuation.toFixed(1)}/10</span>
                    </div>
                    <div class="detail-item">
                        <span>市场情绪</span>
                        <span style="color: ${progressColor}; font-weight: bold;">${scoreData.breakdown.sentiment.toFixed(1)}/10</span>
                    </div>
                    <div class="detail-item">
                        <span>历史胜率</span>
                        <span style="color: ${progressColor}; font-weight: bold;">${scoreData.breakdown.winRate.toFixed(1)}/10</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 渲染市场诊断卡片
 */
function renderMarketDiagnosisCard(marketData) {
    const { pePercentile, marketSentiment, profitProbability1Year } = marketData;

    const peColor = pePercentile < 30 ? '#34C759' : pePercentile < 50 ? '#FFB800' : pePercentile < 70 ? '#FF9500' : '#FF3B30';
    const sentimentColor = marketSentiment < 35 ? '#34C759' : marketSentiment < 50 ? '#FFB800' : marketSentiment < 65 ? '#FF9500' : '#FF3B30';
    const probColor = profitProbability1Year >= 80 ? '#34C759' : profitProbability1Year >= 60 ? '#FFB800' : '#FF9500';

    const cyclePhase = pePercentile < 25 && marketSentiment < 40 ? '熊市底部' :
                      pePercentile < 45 ? '复苏上涨' :
                      pePercentile < 70 ? '牛市中期' : '牛市顶峰';

    const emotion = marketSentiment < 35 ? '恐慌' : marketSentiment < 50 ? '谨慎' : marketSentiment < 65 ? '乐观' : '贪婪';

    return `
        <div class="decision-card">
            <div class="card-header">
                <h4>📊 市场状态诊断</h4>
            </div>
            <div class="card-content">
                <div class="diagnosis-grid">
                    <div class="diag-item">
                        <div class="diag-label">PE分位</div>
                        <div class="diag-value" style="color: ${peColor};">${pePercentile}%</div>
                        <div class="diag-desc">${getPercentileDesc(pePercentile)}</div>
                    </div>
                    <div class="diag-item">
                        <div class="diag-label">市场周期</div>
                        <div class="diag-value">${cyclePhase}</div>
                        <div class="diag-desc">${emotion}</div>
                    </div>
                    <div class="diag-item">
                        <div class="diag-label">恐慌指数</div>
                        <div class="diag-value" style="color: ${sentimentColor};">${marketSentiment}</div>
                        <div class="diag-desc">${getSentimentDesc(marketSentiment)}</div>
                    </div>
                    <div class="diag-item">
                        <div class="diag-label">盈利概率</div>
                        <div class="diag-value" style="color: ${probColor};">${profitProbability1Year}%</div>
                        <div class="diag-desc">1年盈利概率</div>
                    </div>
                </div>
                <div class="market-summary">
                    ${getMarketSummary(pePercentile, marketSentiment)}
                </div>
            </div>
        </div>
    `;
}

function getPercentileDesc(p) {
    if (p < 20) return '极低估';
    if (p < 40) return '偏低估';
    if (p < 60) return '合理';
    if (p < 80) return '偏高估';
    return '高估';
}

function getSentimentDesc(s) {
    if (s < 25) return '极度恐慌';
    if (s < 40) return '恐慌';
    if (s < 55) return '平稳';
    if (s < 70) return '乐观';
    return '贪婪';
}

function getMarketSummary(pePercentile, sentiment) {
    if (pePercentile < 30 && sentiment < 40) {
        return `
            <div class="summary-box" style="background: linear-gradient(135deg, #e8f5e9, #c8e6c9); padding: 12px; border-radius: 8px;">
                <div class="summary-icon" style="font-size: 32px; margin-bottom: 8px;">💎</div>
                <div class="summary-text" style="line-height: 1.6; color: #2e7d32;">
                    市场处于<strong>历史级别的底部区域</strong>！估值分位仅${pePercentile}%，
                    恐慌指数${sentiment}，这往往是<strong>最佳建仓时机</strong>。
                </div>
            </div>
        `;
    } else if (pePercentile < 40) {
        return `
            <div class="summary-box" style="background: linear-gradient(135deg, #f1f8f4, #dcedc8); padding: 12px; border-radius: 8px;">
                <div class="summary-icon" style="font-size: 32px; margin-bottom: 8px;">📈</div>
                <div class="summary-text" style="line-height: 1.6; color: #558b2f;">
                    市场处于<strong>较好的买入区间</strong>，估值分位${pePercentile}%，
                    可以适量配置，分批建仓。
                </div>
            </div>
        `;
    } else if (pePercentile < 70) {
        return `
            <div class="summary-box" style="background: linear-gradient(135deg, #fff9e6, #fff3cd); padding: 12px; border-radius: 8px;">
                <div class="summary-icon" style="font-size: 32px; margin-bottom: 8px;">⚖️</div>
                <div class="summary-text" style="line-height: 1.6; color: #f57f17;">
                    市场估值适中，建议<strong>持仓观望</strong>，等待更好的买入时机。
                </div>
            </div>
        `;
    } else {
        return `
            <div class="summary-box" style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); padding: 12px; border-radius: 8px;">
                <div class="summary-icon" style="font-size: 32px; margin-bottom: 8px;">⚠️</div>
                <div class="summary-text" style="line-height: 1.6; color: #e65100;">
                    市场估值偏高（分位${pePercentile}%），建议<strong>谨慎或减仓</strong>，
                    避免高位接盘。
                </div>
            </div>
        `;
    }
}

/**
 * 渲染未来预期卡片
 */
function renderFutureExpectationCard(marketData) {
    const { pePercentile } = marketData;

    // 场景推演
    const scenarios = generateScenarios(pePercentile);
    const expectedReturn = scenarios.reduce((sum, s) => sum + (s.probability / 100) * s.avgReturn, 0);

    // 最佳持有期
    const optimalPeriod = pePercentile < 30 ? '1-2年' : pePercentile < 50 ? '1年' : '6个月-1年';
    const exitStrategy = pePercentile < 30 ? 'PE分位达70%以上时考虑减仓' :
                        pePercentile < 50 ? 'PE分位达60%以上时考虑减仓' : '建议短期持有或等待更好买点';

    return `
        <div class="decision-card">
            <div class="card-header">
                <h4>🔮 未来1年预期</h4>
            </div>
            <div class="card-content">
                <div class="expectation-summary">
                    <div class="exp-item">
                        <div class="exp-label">期望收益</div>
                        <div class="exp-value" style="color: #34C759;">+${expectedReturn.toFixed(1)}%</div>
                    </div>
                    <div class="exp-item">
                        <div class="exp-label">盈利概率</div>
                        <div class="exp-value">${marketData.profitProbability1Year}%</div>
                    </div>
                    <div class="exp-item">
                        <div class="exp-label">最佳持有</div>
                        <div class="exp-value">${optimalPeriod}</div>
                    </div>
                </div>

                <div class="scenarios">
                    <div style="font-size: 13px; font-weight: bold; margin: 12px 0; color: #333;">场景推演</div>
                    ${scenarios.map(s => `
                        <div class="scenario-item" style="margin: 8px 0; padding: 10px; background: #f8f8f8; border-radius: 6px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-weight: bold; font-size: 13px;">${s.name}</span>
                                <span style="color: ${s.color}; font-weight: bold; font-size: 13px;">${s.probability}%</span>
                            </div>
                            <div style="font-size: 12px; color: #666; margin: 4px 0;">
                                预期收益: ${s.returnRange[0]}% ~ ${s.returnRange[1]}%
                            </div>
                            <div style="font-size: 11px; color: #999; margin-top: 4px;">
                                ${s.trigger}
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div class="holding-rec" style="background: linear-gradient(135deg, #fff8e1, #fff3cd); padding: 12px; border-radius: 8px; margin-top: 12px;">
                    <div style="font-size: 13px; font-weight: bold; color: #333; margin-bottom: 6px;">
                        ⏰ 推荐持有时长：${optimalPeriod}
                    </div>
                    <div style="font-size: 12px; color: #666; line-height: 1.5;">
                        退出策略：${exitStrategy}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateScenarios(pePercentile) {
    if (pePercentile < 30) {
        return [
            { name: '乐观情境', probability: 40, returnRange: [40, 55], trigger: '经济超预期复苏', avgReturn: 47.5, color: '#34C759' },
            { name: '中性情境', probability: 40, returnRange: [20, 30], trigger: '经济平稳修复', avgReturn: 25, color: '#FFB800' },
            { name: '悲观情境', probability: 15, returnRange: [5, 15], trigger: '经济持续低迷', avgReturn: 10, color: '#FF9500' },
            { name: '极端情境', probability: 5, returnRange: [-10, 5], trigger: '黑天鹅事件', avgReturn: -2.5, color: '#FF3B30' }
        ];
    } else if (pePercentile < 50) {
        return [
            { name: '乐观情境', probability: 30, returnRange: [25, 40], trigger: '市场持续向好', avgReturn: 32.5, color: '#34C759' },
            { name: '中性情境', probability: 50, returnRange: [10, 20], trigger: '温和上涨', avgReturn: 15, color: '#FFB800' },
            { name: '悲观情境', probability: 15, returnRange: [0, 10], trigger: '震荡调整', avgReturn: 5, color: '#FF9500' },
            { name: '极端情境', probability: 5, returnRange: [-15, 0], trigger: '大幅回调', avgReturn: -7.5, color: '#FF3B30' }
        ];
    } else {
        return [
            { name: '乐观情境', probability: 20, returnRange: [10, 20], trigger: '继续上涨', avgReturn: 15, color: '#34C759' },
            { name: '中性情境', probability: 45, returnRange: [0, 10], trigger: '高位震荡', avgReturn: 5, color: '#FFB800' },
            { name: '悲观情境', probability: 25, returnRange: [-10, 0], trigger: '高位回落', avgReturn: -5, color: '#FF9500' },
            { name: '极端情境', probability: 10, returnRange: [-25, -10], trigger: '泡沫破裂', avgReturn: -17.5, color: '#FF3B30' }
        ];
    }
}

/**
 * 渲染今日操作清单
 */
function renderTodayActionsCard(marketData, fundDataMap) {
    const { pePercentile, marketSentiment } = marketData;
    const actions = generateTodayActions(marketData, fundDataMap);

    return `
        <div class="decision-card">
            <div class="card-header">
                <h4>⚡ 今日行动建议</h4>
            </div>
            <div class="card-content">
                ${actions.immediate.length > 0 ? `
                    <div class="action-section">
                        <div class="action-section-title">✅ 立即执行</div>
                        ${actions.immediate.map((action, i) => renderActionItem(action, i + 1)).join('')}
                    </div>
                ` : ''}

                ${actions.waiting.length > 0 ? `
                    <div class="action-section">
                        <div class="action-section-title">⏰ 等待执行</div>
                        ${actions.waiting.map((action, i) => renderActionItem(action, i + 1)).join('')}
                    </div>
                ` : ''}

                ${actions.monitoring.length > 0 ? `
                    <div class="action-section">
                        <div class="action-section-title">📊 持续监控</div>
                        ${actions.monitoring.map((action, i) => renderActionItem(action, i + 1)).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function generateTodayActions(marketData, fundDataMap) {
    const { pePercentile, marketSentiment } = marketData;
    const actions = { immediate: [], waiting: [], monitoring: [] };

    // 立即执行
    if (pePercentile < 40 && marketSentiment < 50) {
        actions.immediate.push({
            type: 'buy',
            title: '建仓指数基金',
            desc: `PE分位${pePercentile}%，历史低位，建议投入可用资金的40%`,
            icon: '💰'
        });
    }

    if (pePercentile < 50) {
        actions.immediate.push({
            type: 'dca',
            title: '设置智能定投',
            desc: '建议每月定投，根据PE分位动态调整金额',
            icon: '📅'
        });
    }

    // 等待执行
    if (pePercentile > 15) {
        actions.waiting.push({
            type: 'wait_buy',
            title: '二次加仓机会',
            desc: `等待PE分位<${Math.max(10, pePercentile - 10)}%或下跌>5%时追加投资`,
            icon: '⏰'
        });
    }

    // 持续监控
    actions.monitoring.push({
        type: 'monitor',
        title: '每日关注指标',
        desc: `PE分位(当前${pePercentile}%)、市场情绪(当前${marketSentiment})、持仓收益率`,
        icon: '📊'
    });

    return actions;
}

function renderActionItem(action, index) {
    return `
        <div class="action-item" style="display: flex; gap: 12px; padding: 10px; background: #f8f8f8; border-radius: 6px; margin: 8px 0;">
            <div style="font-size: 24px;">${action.icon}</div>
            <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: bold; color: #333; margin-bottom: 4px;">
                    ${index}. ${action.title}
                </div>
                <div style="font-size: 12px; color: #666; line-height: 1.5;">
                    ${action.desc}
                </div>
            </div>
        </div>
    `;
}

/**
 * 加载历史回测
 */
async function loadHistoryBacktest(container) {
    try {
        const innerContainer = container.querySelector('#history-backtest-container');
        if (!innerContainer) {
            console.error('找不到历史回测容器');
            return;
        }

        innerContainer.innerHTML = '<div class="loading">正在加载历史数据...</div>';

        console.log('开始加载历史回测数据...');

        // 获取历史数据
        const historicalData = HistoricalDataManager.getIndexHistory(INDEX_CODES.SH000001);

        console.log('历史数据:', historicalData ? `${historicalData.length}天` : '无数据');

        if (!historicalData || historicalData.length < 30) {
            innerContainer.innerHTML = `
                <div class="no-data-panel" style="padding: 40px 20px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 16px;">📊</div>
                    <div style="font-size: 16px; font-weight: bold; color: #333; margin-bottom: 8px;">
                        历史数据积累中...
                    </div>
                    <div style="font-size: 13px; color: #999; line-height: 1.6;">
                        需要至少30天的历史数据才能进行回测分析<br>
                        当前已积累：${historicalData ? historicalData.length : 0}天
                    </div>
                    <div style="margin-top: 16px; font-size: 12px; color: #666;">
                        💡 提示：系统会自动记录每日数据，请耐心等待数据积累
                    </div>
                </div>
            `;
            return;
        }

        // 渲染历史回测面板
        const html = renderHistoryBacktest(historicalData);
        innerContainer.innerHTML = html;

        console.log('历史回测渲染完成');

    } catch (error) {
        console.error('加载历史回测失败:', error);
        console.error('错误堆栈:', error.stack);
        const innerContainer = container.querySelector('#history-backtest-container');
        if (innerContainer) {
            innerContainer.innerHTML = `
                <div class="error" style="padding: 20px; text-align: center;">
                    <div style="font-size: 16px; color: #FF3B30; margin-bottom: 8px;">加载失败</div>
                    <div style="font-size: 12px; color: #999; margin-bottom: 12px;">${error.message}</div>
                    <button onclick="location.reload()" style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        重新加载
                    </button>
                </div>
            `;
        }
    }
}

/**
 * 渲染历史回测面板
 */
function renderHistoryBacktest(historicalData) {
    // 分析历史PE分位数分布
    const distribution = analyzePercentileDistribution(historicalData);

    return `
        <div class="backtest-panel">
            <div class="decision-card">
                <div class="card-header">
                    <h4>📜 历史数据统计</h4>
                    <span style="font-size: 12px; color: #999;">基于${historicalData.length}天数据</span>
                </div>
                <div class="card-content">
                    <div class="distribution-chart">
                        <div style="font-size: 13px; font-weight: bold; margin-bottom: 12px; color: #333;">
                            PE分位数历史分布
                        </div>
                        ${renderDistributionBars(distribution)}
                    </div>

                    <div class="backtest-summary" style="margin-top: 16px; padding: 12px; background: #f8f8f8; border-radius: 8px;">
                        <div style="font-size: 13px; font-weight: bold; color: #333; margin-bottom: 8px;">
                            📌 历史规律总结
                        </div>
                        <div style="font-size: 12px; color: #666; line-height: 1.8;">
                            • 低估区间(<20%): ${distribution.veryLow.count}天 (${distribution.veryLow.percent}%) - 极佳买入区间<br>
                            • 较低区间(20-40%): ${distribution.low.count}天 (${distribution.low.percent}%) - 较好买入区间<br>
                            • 合理区间(40-60%): ${distribution.medium.count}天 (${distribution.medium.percent}%) - 持有观望<br>
                            • 偏高区间(60-80%): ${distribution.high.count}天 (${distribution.high.percent}%) - 谨慎减仓<br>
                            • 高估区间(>80%): ${distribution.veryHigh.count}天 (${distribution.veryHigh.percent}%) - 高风险区域
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function analyzePercentileDistribution(historicalData) {
    const distribution = {
        veryLow: { count: 0, percent: 0 },
        low: { count: 0, percent: 0 },
        medium: { count: 0, percent: 0 },
        high: { count: 0, percent: 0 },
        veryHigh: { count: 0, percent: 0 }
    };

    historicalData.forEach((data, index) => {
        if (!data.pe) return;

        // 计算该时点的分位数
        const slice = historicalData.slice(Math.max(0, index - 120), index);
        if (slice.length === 0) return;

        const lowerCount = slice.filter(d => d.pe && d.pe < data.pe).length;
        const percentile = Math.round((lowerCount / slice.length) * 100);

        if (percentile < 20) distribution.veryLow.count++;
        else if (percentile < 40) distribution.low.count++;
        else if (percentile < 60) distribution.medium.count++;
        else if (percentile < 80) distribution.high.count++;
        else distribution.veryHigh.count++;
    });

    const total = historicalData.length;
    Object.keys(distribution).forEach(key => {
        distribution[key].percent = Math.round((distribution[key].count / total) * 100);
    });

    return distribution;
}

function renderDistributionBars(distribution) {
    const items = [
        { key: 'veryLow', label: '<20%', color: '#34C759' },
        { key: 'low', label: '20-40%', color: '#8BC34A' },
        { key: 'medium', label: '40-60%', color: '#FFB800' },
        { key: 'high', label: '60-80%', color: '#FF9500' },
        { key: 'veryHigh', label: '>80%', color: '#FF3B30' }
    ];

    return items.map(item => {
        const data = distribution[item.key];
        return `
            <div style="margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #666; margin-bottom: 4px;">
                    <span>${item.label}</span>
                    <span>${data.count}天 (${data.percent}%)</span>
                </div>
                <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                    <div style="width: ${data.percent}%; height: 100%; background: ${item.color}; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 绑定决策中心事件
 */
function bindDecisionCenterEvents(container, marketData) {
    // 可以添加交互事件，比如点击查看详情等
    // 暂时留空，后续扩展
}

// 添加决策系统的样式
function addDecisionSystemStyles() {
    const existingStyle = document.getElementById('decision-system-styles');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'decision-system-styles';
    style.textContent = `
        /* 标签页样式 */
        .star-tabs {
            display: flex;
            gap: 8px;
            padding: 12px;
            background: #f8f8f8;
            border-radius: 8px 8px 0 0;
            margin-bottom: 12px;
        }

        .star-tab {
            flex: 1;
            padding: 8px 12px;
            background: #fff;
            border: none;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            color: #666;
            cursor: pointer;
            transition: all 0.2s;
        }

        .star-tab:hover {
            background: #f0f0f0;
        }

        .star-tab.active {
            background: #007AFF;
            color: #fff;
        }

        .star-tab-content {
            display: none;
        }

        .star-tab-content.active {
            display: block;
        }

        /* 决策卡片样式 */
        .decision-dashboard {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .decision-card {
            background: #fff;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e0e0e0;
        }

        .card-header {
            padding: 12px 16px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-bottom: 1px solid #e0e0e0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .card-header h4 {
            margin: 0;
            font-size: 15px;
            color: #333;
        }

        .card-content {
            padding: 16px;
        }

        /* 诊断网格 */
        .diagnosis-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-bottom: 12px;
        }

        .diag-item {
            text-align: center;
            padding: 12px;
            background: #f8f8f8;
            border-radius: 6px;
        }

        .diag-label {
            font-size: 11px;
            color: #999;
            margin-bottom: 6px;
        }

        .diag-value {
            font-size: 20px;
            font-weight: bold;
            margin: 6px 0;
        }

        .diag-desc {
            font-size: 11px;
            color: #666;
        }

        /* 预期汇总 */
        .expectation-summary {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }

        .exp-item {
            text-align: center;
            padding: 12px;
            background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
            border-radius: 6px;
        }

        .exp-label {
            font-size: 11px;
            color: #666;
            margin-bottom: 6px;
        }

        .exp-value {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }

        /* 评分详情 */
        .score-details {
            margin-top: 12px;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
            font-size: 13px;
        }

        .detail-item:last-child {
            border-bottom: none;
        }

        /* 操作区域 */
        .action-section {
            margin-bottom: 16px;
        }

        .action-section:last-child {
            margin-bottom: 0;
        }

        .action-section-title {
            font-size: 13px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
        }

        /* 加载和错误状态 */
        .loading {
            text-align: center;
            padding: 40px 20px;
            color: #999;
            font-size: 14px;
        }

        .error {
            text-align: center;
            padding: 40px 20px;
            color: #FF3B30;
            font-size: 14px;
        }

        /* 响应式 */
        @media (max-width: 400px) {
            .diagnosis-grid,
            .expectation-summary {
                grid-template-columns: 1fr;
            }
        }
    `;

    document.head.appendChild(style);
}

// 在脚本初始化时添加样式
addDecisionSystemStyles();

// ═══════════════════════════════════════════════════════════════
// 操作记录管理模块
// ═══════════════════════════════════════════════════════════════

/**
 * 操作记录管理器
 */
const OperationRecordManager = {
    /**
     * 获取所有操作记录
     */
    getRecords() {
        return GM_getValue('operationRecords', []);
    },

    /**
     * 添加操作记录
     */
    async addRecord(record) {
        const records = this.getRecords();
        const newRecord = {
            id: Date.now().toString(),
            ...record,
            createTime: new Date().toISOString()
        };
        records.unshift(newRecord);
        GM_setValue('operationRecords', records);

        // 如果用户已登录，同步到云端
        if (UserManager.currentUser) {
            try {
                await UserManager.saveOperationRecordsToCloud();
                console.log('操作记录已同步到云端');
            } catch (error) {
                console.error('操作记录同步失败:', error);
                // 即使同步失败，也继续本地保存
            }
        }

        return newRecord;
    },

    /**
     * 删除操作记录
     */
    async deleteRecord(id) {
        const records = this.getRecords();
        const filtered = records.filter(r => r.id !== id);
        GM_setValue('operationRecords', filtered);

        // 如果用户已登录，同步到云端
        if (UserManager.currentUser) {
            try {
                await UserManager.saveOperationRecordsToCloud();
                console.log('操作记录已同步到云端');
            } catch (error) {
                console.error('操作记录同步失败:', error);
                // 即使同步失败，也继续本地删除
            }
        }
    },

    /**
     * 计算资金流向统计
     */
    calculateCashFlow() {
        const records = this.getRecords();
        let totalSell = 0;
        let totalDividend = 0;

        const fundFlows = {};

        // 统计卖出和分红记录
        records.forEach(record => {
            const amount = parseFloat(record.amount) || 0;

            if (record.type === 'sell') {
                totalSell += amount;
                fundFlows[record.fundCode] = fundFlows[record.fundCode] || { buy: 0, sell: 0, dividend: 0, name: record.fundName };
                fundFlows[record.fundCode].sell += amount;
            } else if (record.type === 'dividend') {
                totalDividend += amount;
                fundFlows[record.fundCode] = fundFlows[record.fundCode] || { buy: 0, sell: 0, dividend: 0, name: record.fundName };
                fundFlows[record.fundCode].dividend += amount;
            }
        });

        // 总买入 = 所有持有基金的总成本（成本价 × 份额）
        let totalBuy = 0;
        CONFIG.fundCodes.forEach(code => {
            const share = CONFIG.fundShares[code] || 0;
            const costPrice = CONFIG.costPrices[code] || 0;
            if (share > 0) {
                const holdingCost = share * costPrice;
                totalBuy += holdingCost;

                // 初始化基金流向数据（如果还没有）
                if (!fundFlows[code]) {
                    fundFlows[code] = { buy: 0, sell: 0, dividend: 0, name: code };
                }
                // 将持仓成本作为买入金额
                fundFlows[code].buy = holdingCost;
            }
        });

        const netCashFlow = totalSell + totalDividend - totalBuy;

        return {
            totalBuy,
            totalSell,
            totalDividend,
            netCashFlow,
            fundFlows
        };
    }
};

/**
 * 加载操作记录界面
 */
async function loadOperationRecords(container) {
    try {
        const innerContainer = container.querySelector('#operation-records-container');
        if (!innerContainer) {
            console.error('找不到操作记录容器');
            return;
        }

        const records = OperationRecordManager.getRecords();
        const cashFlow = OperationRecordManager.calculateCashFlow();

        const html = `
            <div class="operation-records-panel">
                <!-- 资金流向统计 -->
                <div class="star-section">
                    <h4>💰 资金流向统计</h4>
                    <div style="padding: 16px; background: rgba(0, 0, 0, 0.02); border-radius: 8px;">
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px;">
                            <div style="text-align: center; padding: 12px; background: rgba(255,107,107,0.1); border-radius: 6px;">
                                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">持仓总成本</div>
                                <div style="font-size: 11px; color: #999; margin-bottom: 2px;">(成本价×份额)</div>
                                <div style="font-size: 20px; font-weight: bold; color: #FF6B6B;">¥${cashFlow.totalBuy.toFixed(2)}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: rgba(52,199,89,0.1); border-radius: 6px;">
                                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">总卖出</div>
                                <div style="font-size: 11px; color: #999; margin-bottom: 2px;">(累计卖出金额)</div>
                                <div style="font-size: 20px; font-weight: bold; color: #34C759;">¥${cashFlow.totalSell.toFixed(2)}</div>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                            <div style="text-align: center; padding: 12px; background: rgba(255,184,0,0.1); border-radius: 6px;">
                                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">总分红</div>
                                <div style="font-size: 11px; color: #999; margin-bottom: 2px;">(累计分红收入)</div>
                                <div style="font-size: 20px; font-weight: bold; color: #FFB800;">¥${cashFlow.totalDividend.toFixed(2)}</div>
                            </div>
                            <div style="text-align: center; padding: 12px; background: ${cashFlow.netCashFlow >= 0 ? 'rgba(52,199,89,0.1)' : 'rgba(255,107,107,0.1)'}; border-radius: 6px;">
                                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">净回收资金</div>
                                <div style="font-size: 11px; color: #999; margin-bottom: 2px;">(卖出+分红-成本)</div>
                                <div style="font-size: 20px; font-weight: bold; color: ${cashFlow.netCashFlow >= 0 ? '#34C759' : '#FF6B6B'};">
                                    ${cashFlow.netCashFlow >= 0 ? '+' : ''}¥${cashFlow.netCashFlow.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 各基金资金流向 -->
                <div class="star-section">
                    <h4>📊 各基金资金流向</h4>
                    ${Object.keys(cashFlow.fundFlows).length > 0 ?
                        Object.entries(cashFlow.fundFlows).map(([code, flow]) => {
                            const net = flow.sell + flow.dividend - flow.buy;
                            return `
                                <div style="padding: 12px; background: rgba(0, 0, 0, 0.02); border-radius: 8px; margin-bottom: 8px;">
                                    <div style="font-size: 13px; font-weight: bold; color: #333; margin-bottom: 8px;">
                                        ${flow.name} (${code})
                                    </div>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 12px;">
                                        <div>
                                            <span style="color: #999;">持仓成本：</span>
                                            <span style="color: #FF6B6B; font-weight: bold;">¥${flow.buy.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span style="color: #999;">卖出：</span>
                                            <span style="color: #34C759; font-weight: bold;">¥${flow.sell.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span style="color: #999;">分红：</span>
                                            <span style="color: #FFB800; font-weight: bold;">¥${flow.dividend.toFixed(2)}</span>
                                        </div>
                                        <div>
                                            <span style="color: #999;">净回收：</span>
                                            <span style="color: ${net >= 0 ? '#34C759' : '#FF6B6B'}; font-weight: bold;">
                                                ${net >= 0 ? '+' : ''}¥${net.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')
                        : '<div style="padding: 20px; text-align: center; color: #999;">暂无基金资金流向数据</div>'
                    }
                </div>

                <!-- 操作按钮 -->
                <div class="star-section">
                    <div style="display: grid; grid-template-columns: ${UserManager.currentUser ? '1fr 1fr' : '1fr'}; gap: 8px;">
                        <button id="add-record-btn" style="padding: 12px; background: #1a73e8; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">
                        ➕ 添加操作记录
                    </button>
                        ${UserManager.currentUser ? `
                            <button id="sync-records-btn" style="padding: 12px; background: #34C759; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">
                                ☁️ 同步到云端
                            </button>
                        ` : ''}
                    </div>
                    ${UserManager.currentUser ? '<div style="margin-top: 8px; font-size: 12px; color: #34C759; text-align: center;">✓ 已登录，操作记录会自动同步到云端</div>' : '<div style="margin-top: 8px; font-size: 12px; color: #999; text-align: center;">💡 登录后可将操作记录同步到云端</div>'}
                </div>

                <!-- 操作记录列表 -->
                <div class="star-section">
                    <h4>📝 操作记录</h4>
                    ${records.length > 0 ?
                        records.map(record => {
                            const typeIcon = record.type === 'buy' ? '📥' : record.type === 'sell' ? '📤' : '💰';
                            const typeText = record.type === 'buy' ? '买入' : record.type === 'sell' ? '卖出' : '分红';
                            const typeColor = record.type === 'buy' ? '#FF6B6B' : record.type === 'sell' ? '#34C759' : '#FFB800';

                            return `
                                <div class="record-item" data-id="${record.id}" style="padding: 12px; background: rgba(0, 0, 0, 0.02); border-radius: 8px; margin-bottom: 8px;">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                                        <div style="flex: 1;">
                                            <div style="font-size: 13px; font-weight: bold; color: #333; margin-bottom: 4px;">
                                                ${typeIcon} ${record.fundName} (${record.fundCode})
                                            </div>
                                            <div style="font-size: 11px; color: #999;">${record.date}</div>
                                        </div>
                                        <div style="text-align: right;">
                                            <div style="background: ${typeColor}20; color: ${typeColor}; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
                                                ${typeText}
                                            </div>
                                            <div style="font-size: 16px; font-weight: bold; color: ${typeColor};">
                                                ${record.type === 'buy' ? '-' : '+'}¥${parseFloat(record.amount).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style="font-size: 12px; color: #666; display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                                        <div>份额: <span style="font-weight: bold;">${parseFloat(record.shares).toFixed(2)}</span></div>
                                        <div>价格: <span style="font-weight: bold;">¥${parseFloat(record.price).toFixed(4)}</span></div>
                                    </div>
                                    ${record.note ? `<div style="margin-top: 6px; padding: 6px; background: rgba(255,255,255,0.5); border-radius: 4px; font-size: 11px; color: #666;">📝 ${record.note}</div>` : ''}
                                    <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
                                        <button class="delete-record-btn" data-id="${record.id}" style="padding: 4px 12px; background: #ff6b6b; color: white; border: none; border-radius: 4px; font-size: 11px; cursor: pointer;">删除</button>
                                    </div>
                                </div>
                            `;
                        }).join('')
                        : '<div style="padding: 20px; text-align: center; color: #999;">暂无操作记录<br>点击上方按钮添加记录</div>'
                    }
                </div>
            </div>
        `;

        innerContainer.innerHTML = html;
        bindOperationRecordsEvents(innerContainer);

    } catch (error) {
        console.error('加载操作记录失败:', error);
    }
}

/**
 * 绑定操作记录事件
 */
function bindOperationRecordsEvents(container) {
    const addBtn = container.querySelector('#add-record-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => showAddRecordDialog());
    }

    const syncBtn = container.querySelector('#sync-records-btn');
    if (syncBtn) {
        syncBtn.addEventListener('click', async () => {
            if (!UserManager.currentUser) {
                alert('请先登录账号');
                return;
            }

            try {
                syncBtn.disabled = true;
                syncBtn.textContent = '⏳ 同步中...';
                await UserManager.saveOperationRecordsToCloud();
                syncBtn.textContent = '✓ 同步成功';
                setTimeout(() => {
                    syncBtn.textContent = '☁️ 同步到云端';
                    syncBtn.disabled = false;
                }, 2000);
            } catch (error) {
                console.error('同步失败:', error);
                alert('同步失败：' + error.message);
                syncBtn.textContent = '☁️ 同步到云端';
                syncBtn.disabled = false;
            }
        });
    }

    const deleteBtns = container.querySelectorAll('.delete-record-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const id = e.target.dataset.id;
            if (confirm('确定要删除这条记录吗？')) {
                await OperationRecordManager.deleteRecord(id);
                const recordsContainer = document.querySelector('#tab-records');
                if (recordsContainer) {
                    loadOperationRecords(recordsContainer);
                }
            }
        });
    });
}

/**
 * 显示添加记录对话框
 */
function showAddRecordDialog() {
    // 获取当前持有的基金（份额大于0的基金）
    const holdingFunds = CONFIG.fundCodes.filter(code => {
        const share = CONFIG.fundShares[code] || 0;
        return share > 0;
    });

    const dialog = document.createElement('div');
    dialog.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-start; justify-content: center; z-index: 9999999; overflow-y: auto; padding: 20px 0;';

    dialog.innerHTML = `
        <div style="background: white; border-radius: 12px; padding: 24px; width: 90%; max-width: 400px; max-height: 90vh; overflow-y: auto; margin: auto;">
            <h3 style="margin: 0 0 16px 0; font-size: 16px; color: #333;">添加操作记录</h3>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">操作类型</label>
                <select id="record-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                    <option value="buy">买入</option>
                    <option value="sell">卖出</option>
                    <option value="dividend">分红</option>
                </select>
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">选择基金</label>
                <select id="record-fund" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
                    ${holdingFunds.length > 0 ? holdingFunds.map(code => `<option value="${code}">${code}</option>`).join('') : '<option value="">暂无持仓基金</option>'}
                </select>
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">日期</label>
                <input type="date" id="record-date" value="${new Date().toISOString().split('T')[0]}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">份额</label>
                <input type="number" id="record-shares" placeholder="请输入份额" step="0.01" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">价格（单价）</label>
                <input type="number" id="record-price" placeholder="请输入价格" step="0.0001" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">
            </div>

            <div style="margin-bottom: 12px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">金额（自动计算）</label>
                <input type="number" id="record-amount" placeholder="份额×价格" readonly style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background: #f5f5f5;">
            </div>

            <div style="margin-bottom: 16px;">
                <label style="display: block; font-size: 12px; color: #666; margin-bottom: 4px;">备注（选填）</label>
                <textarea id="record-note" placeholder="可以添加备注说明" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-height: 60px; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; gap: 12px;">
                <button id="cancel-record-btn" style="flex: 1; padding: 10px; background: #f5f5f5; color: #666; border: none; border-radius: 6px; font-size: 14px; cursor: pointer;">取消</button>
                <button id="save-record-btn" style="flex: 1; padding: 10px; background: #1a73e8; color: white; border: none; border-radius: 6px; font-size: 14px; font-weight: bold; cursor: pointer;">保存</button>
            </div>
        </div>
    `;

    document.body.appendChild(dialog);

    const sharesInput = dialog.querySelector('#record-shares');
    const priceInput = dialog.querySelector('#record-price');
    const amountInput = dialog.querySelector('#record-amount');

    const calculateAmount = () => {
        const shares = parseFloat(sharesInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        amountInput.value = (shares * price).toFixed(2);
    };

    sharesInput.addEventListener('input', calculateAmount);
    priceInput.addEventListener('input', calculateAmount);

    dialog.querySelector('#cancel-record-btn').addEventListener('click', () => document.body.removeChild(dialog));

    dialog.querySelector('#save-record-btn').addEventListener('click', async () => {
        const type = dialog.querySelector('#record-type').value;
        const fundCode = dialog.querySelector('#record-fund').value;
        const date = dialog.querySelector('#record-date').value;
        const shares = parseFloat(dialog.querySelector('#record-shares').value);
        const price = parseFloat(dialog.querySelector('#record-price').value);
        const amount = parseFloat(dialog.querySelector('#record-amount').value);
        const note = dialog.querySelector('#record-note').value;

        if (!shares || !price || !amount) {
            alert('请填写完整的份额和价格信息');
            return;
        }

        await OperationRecordManager.addRecord({
            type,
            fundCode,
            fundName: fundCode,
            date,
            shares,
            price,
            amount,
            note
        });

        document.body.removeChild(dialog);

        const recordsContainer = document.querySelector('#tab-records');
        if (recordsContainer) {
            loadOperationRecords(recordsContainer);
        }

        alert('记录添加成功！' + (UserManager.currentUser ? '已同步到云端。' : ''));
    });

    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
        }
    });
}

// ========== 调试工具 ==========
// 提供给用户在控制台使用的调试函数
window.checkHistoryData = function() {
    console.log('📊 历史数据统计信息：');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const stats = HistoricalDataManager.getHistoryStats();

    if (Object.keys(stats).length === 0) {
        console.log('❌ 尚未积累任何历史数据');
        console.log('💡 提示：');
        console.log('   1. 历史数据会在每次刷新页面时自动记录');
        console.log('   2. 请先打开"投资星级"面板');
        console.log('   3. 数据会每天积累一次，需要30天以上才能进行历史回测');
        return;
    }

    let totalDays = 0;
    for (const [code, stat] of Object.entries(stats)) {
        console.log(`\n📈 ${code}:`);
        console.log(`   天数: ${stat.days} 天`);
        console.log(`   起始: ${stat.firstDate}`);
        console.log(`   最新: ${stat.lastDate}`);
        console.log(`   PE数据: ${stat.hasPE ? '✅ 有' : '❌ 无'}`);
        console.log(`   PB数据: ${stat.hasPB ? '✅ 有' : '❌ 无'}`);
        totalDays += stat.days;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 总计: ${Object.keys(stats).length} 个指数，共 ${totalDays} 条记录`);

    if (totalDays < 90) {
        console.log('\n⚠️  数据积累进度：');
        console.log(`   当前: ${totalDays} 天`);
        console.log(`   目标: 90 天（历史回测最低要求）`);
        console.log(`   进度: ${Math.round(totalDays / 90 * 100)}%`);
        console.log(`   预计: ${90 - totalDays} 天后可使用历史回测功能`);
    } else {
        console.log('\n✅ 数据充足，可以使用历史回测功能！');
    }

    console.log('\n💡 提示：');
    console.log('   - 历史回测需要至少90天数据');
    console.log('   - PE/PB分位数需要至少30天数据');
    console.log('   - 数据越多，分析越准确');
};

// 提供给用户清除历史数据的函数
window.clearHistoryData = function(confirm = false) {
    if (!confirm) {
        console.log('⚠️  警告：此操作将清除所有历史数据！');
        console.log('如需确认清除，请执行：clearHistoryData(true)');
        return;
    }

    GM_setValue(HistoricalDataManager.storageKey, '{}');
    console.log('✅ 历史数据已清除');
};

// 启动提示
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 基金实时监控 Pro42 已启动');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('💡 调试命令：');
console.log('   checkHistoryData()  - 查看历史数据积累情况');
console.log('   clearHistoryData()  - 清除历史数据（谨慎使用）');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

})();